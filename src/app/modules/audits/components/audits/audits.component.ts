import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";

import { FsApi } from "@firestitch/api";
import { index } from "@firestitch/common";
import { IFilterConfigItem, ItemType } from "@firestitch/filter";
import { FsListAction, FsListComponent, FsListConfig, FsListModule } from "@firestitch/list";

import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";

import { FsAuditsSubjectDirective } from "../../directives";

import { NgTemplateOutlet } from "@angular/common";
import { FsBadgeModule } from "@firestitch/badge";
import { FsDateModule } from "@firestitch/date";
import { FsHtmlRendererModule } from "@firestitch/html-editor";
import { AuditMetaActions } from "./../../../../consts";
import { AuditMetaAction } from "./../../../../enums";

@Component({
  selector: "fs-audits",
  templateUrl: "./audits.component.html",
  styleUrls: ["./audits.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsListModule,
    NgTemplateOutlet,
    FsBadgeModule,
    FsDateModule,
    FsHtmlRendererModule,
  ],
})
export class FsAuditsComponent implements OnInit, OnDestroy {
  @ContentChild(FsAuditsSubjectDirective, { read: TemplateRef })
  public subjectTemplate: TemplateRef<FsAuditsSubjectDirective>;

  /** Subject entity id; forwarded to {@link saveAudit} and the add-note dialog. */
  @Input() public subjectObjectId;
  @Input() public apiPath: string | any[] = ['audits']
  @Input() public relatedSubjectObjectId;
  @Input() public showSubject = true;
  @Input() public showDelete = false;
  @Input() public actions: FsListAction[] = [];
  @Input() public showSubjectTypeFilter = true;
  @Input() public showDetailTypeFilter = true;
  /**
   * Shows the **Add Note** list action when `true`. The action only appears if
   * {@link saveAudit} is set (including the default `POST` to {@link apiPath} when `apiPath` is provided).
   */
  @Input() public showCreate = false;
  @Input() public objectClasses: { name: string; value: string }[] = [];
  @Input() public subjectObjectClasses: string[] = [];
  @Input() public auditMetaActions = AuditMetaActions;
  @Input() public loadAudits: (
    query,
  ) => Observable<{ audits: any[]; paging: any }>=  (query) => {
    const path = Array.isArray(this.apiPath)
      ? this.apiPath
      : [this.apiPath];

    return this._api.get(path.join("/"), query, { key: null });
  };

  @Input() public deleteAudit: (audit) => Observable<any>;
  /**
   * Persists a manual note from the Add Note dialog. Return an observable that emits when the save
   * succeeds; the dialog then closes and the list reloads. If omitted and {@link apiPath} is set,
   * defaults to `POST` on `apiPath` with `{ subjectObjectId, text }`.
   */
  @Input() public saveAudit: (data: {
    subjectObjectId: unknown;
    text: string;
  }) => Observable<unknown>;

  @ViewChild(FsListComponent, { static: true })
  public list: FsListComponent;

  public config: FsListConfig;
  public AuditMetaAction = AuditMetaAction;
  public auditMetaActionNames = {};
  public objectClassNames = {};

  private _destroy$ = new Subject();
  private _api = inject(FsApi);

  public reload(): void {
    this.list.reload();
  }

  public ngOnInit(): void {
    if (!this.deleteAudit && this.apiPath) {
      this.deleteAudit = (audit) => {
        const path = [
          ...(Array.isArray(this.apiPath) ? this.apiPath : [this.apiPath]),
          audit.id,
        ];

        return this._api.delete(path.join("/"), audit);
      };
    }

    if (!this.saveAudit && this.apiPath) {
      this.saveAudit = (data) => {
        const path = Array.isArray(this.apiPath)
          ? this.apiPath
          : [this.apiPath];

        return this._api.post(path.join("/"), data);
      };
    }

    this._initConfig();
    this.objectClassNames = index(this.objectClasses, "value", "name");
    this.auditMetaActionNames = this.auditMetaActions.reduce((accum, item) => {
      return {
        ...accum,
        [item.value]: item.pastName || item.name,
      };
    }, {});
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  private _initConfig(): void {
    this.config = {
      sort: { value: "date", direction: "desc" },
      sorts: [{ name: "Created", direction: "desc", value: "date" }],
      paging: {
        limits: [25, 50, 150, 250, 500, 1000],
      },
      rowHoverHighlight: false,
      actions: this.actions,
      rowActions: [
        {
          click: (data) => {
            return this.deleteAudit(data);
          },
          show: () => {
            return this.showDelete && !!this.deleteAudit;
          },
          label: "Delete",
          remove: {
            title: "Confirm",
            template: "Are you sure you would like to delete this audit?",
          },
        },
      ],
      group: {
        groupBy: (row) => {
          return row;
        },
        compareBy: (row) => {
          return row.id;
        },
      },
      filters: this._getFilters(),
      fetch: (query) => {
        query = {
          ...query,
          relatedSubjectObjectId: this.relatedSubjectObjectId,
          subjectObjectId: this.subjectObjectId,
          subjectObjects: true,
          subjectClientAccounts: true,
          auditMetas: true,
          auditMetaObjectClasses: true,
          auditMetaObjectNames: true,
          actorAccounts: true,
          actorAccountAvatars: true,
        };

        if(this.subjectObjectClasses.length > 0) {
          query.subjectObjectClass = this.subjectObjectClasses.join(',');
        }

        return this.loadAudits(query).pipe(
          map((response) => {
            return {
              data: response.audits.map((audit) => {
                const groups = new Map<string, any>();
                for (const auditMeta of audit.auditMetas) {
                  const key = JSON.stringify([
                    auditMeta.action,
                    auditMeta.objectName,
                    auditMeta.objectClass,
                    auditMeta.objectClassName,
                    auditMeta.objectId,
                    auditMeta.subject,
                  ]);
                  let group = groups.get(key);
                  if (!group) {
                    group = { ...auditMeta, metas: [] };
                    groups.set(key, group);
                  }
                  group.metas.push(auditMeta);
                }
                audit.auditMetas = Array.from(groups.values());

                if (
                  audit.actorAccount?.firstName &&
                  audit.actorAccount?.lastName
                ) {
                  audit.actorAccount.name = `${audit.actorAccount.firstName} ${audit.actorAccount.lastName.substr(0, 1)}.`;
                }

                return audit;
              }),
              paging: response.paging,
            };
          }),
        );
      },
    };
  }

  private _getFilters(): IFilterConfigItem[] {
    return [
      {
        name: "keyword",
        type: ItemType.Keyword,
        label: "Search",
      },
      {
        name: "date",
        type: ItemType.DateRange,
        label: ["From Date", "To Date"],
      },
      {
        name: "action",
        type: ItemType.Select,
        label: "Action",
        multiple: true,
        values: () => {
          return AuditMetaActions;
        },
      },
      {
        name: "subjectObjectClass",
        type: ItemType.Select,
        label: "Subject Type",
        values: () => {
          return [{ name: "All", value: null }].concat(this.objectClasses);
        },
        hide: this.objectClasses.length === 0 || !this.showSubjectTypeFilter,  
      },
      {
        name: "auditMetaObjectClass",
        type: ItemType.Select,
        label: "Detail Type",
        values: () => {
          return [{ name: "All", value: null }].concat(this.objectClasses);
        },
        hide: !this.showDetailTypeFilter,
      },
    ];
  }
}
