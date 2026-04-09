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
import { FsListComponent, FsListConfig, FsListModule } from "@firestitch/list";

import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";

import { FsAuditsSubjectDirective } from "../../directives";
import { FsAuditAddComponent } from "../audit-add/audit-add.component";

import { NgTemplateOutlet } from "@angular/common";
import { FsBadgeModule } from "@firestitch/badge";
import { FsDateModule } from "@firestitch/date";
import { FsDialog } from "@firestitch/dialog";
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
  @Input() public apiPath: string | any[];
  @Input() public relatedSubjectObjectId;
  @Input() public showSubject = true;
  @Input() public showDelete = false;
  /**
   * Shows the **Add Note** list action when `true`. The action only appears if
   * {@link saveAudit} is set (including the default `POST` to {@link apiPath} when `apiPath` is provided).
   */
  @Input() public showCreate = false;
  @Input() public objectClasses = [];
  @Input() public auditMetaActions = AuditMetaActions;
  @Input() public loadAudits: (
    query,
  ) => Observable<{ audits: any[]; paging: any }>;
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
  public showObjectId = false;

  private _destroy$ = new Subject();
  private _api = inject(FsApi);
  private _dialog = inject(FsDialog);

  public reload(): void {
    this.list.reload();
  }

  public ngOnInit(): void {
    if (!this.loadAudits && this.apiPath) {
      this.loadAudits = (query) => {
        const path = Array.isArray(this.apiPath)
          ? this.apiPath
          : [this.apiPath];

        return this._api.get(path.join("/"), query, { key: null });
      };
    }

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
      actions: [
        {
          label: "Add Note",
          primary: true,
          show: () => this.showCreate && !!this.saveAudit,
          click: () => {
            this._dialog
              .open(FsAuditAddComponent, {
                width: "500px",
                data: {
                  subjectObjectId: this.subjectObjectId,
                  saveAudit: this.saveAudit,
                },
              })
              .afterClosed()
              .pipe(takeUntil(this._destroy$))
              .subscribe((result) => {
                if (result) {
                  this.list.reload();
                }
              });
          },
        },
      ],
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
        this.showObjectId = query.showObjectId;

        return this.loadAudits(query).pipe(
          map((response) => {
            return {
              data: response.audits.map((audit) => {
                const auditMetas = audit.auditMetas.reduce(
                  (accum, auditMeta) => {
                    const key = [
                      auditMeta.action,
                      auditMeta.objectName,
                      auditMeta.objectClass,
                      auditMeta.objectClassName,
                      auditMeta.objectId,
                      auditMeta.subject,
                    ].join(",");

                    return {
                      ...accum,
                      [key]: [...(accum[key] || []), auditMeta],
                    };
                  },
                  {},
                );

                if (
                  audit.actorAccount?.firstName &&
                  audit.actorAccount?.lastName
                ) {
                  audit.actorAccount.name = `${audit.actorAccount.firstName} ${audit.actorAccount.lastName.substr(0, 1)}.`;
                }

                audit.auditMetas = Object.keys(auditMetas).map((key) => {
                  const parts = key.split(",");

                  return {
                    action: parts[0],
                    objectName: parts[1],
                    objectClass: parts[2],
                    objectClassName: parts[3],
                    objectId: parts[4],
                    subject: parts[5],
                    metas: auditMetas[key],
                  };
                });

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
        name: "subjectObjectClass",
        type: ItemType.Select,
        label: "Subject Type",
        values: () => {
          return [{ name: "All", value: null }].concat(this.objectClasses);
        },
        hide: this.objectClasses.length === 0,
      },
      {
        name: "auditMetaObjectClass",
        type: ItemType.Select,
        label: "Detail Type",
        values: () => {
          return [{ name: "All", value: null }].concat(this.objectClasses);
        },
        hide: this.objectClasses.length === 0,
      },
      {
        name: "action",
        type: ItemType.Select,
        label: "Action",
        values: () => {
          return [{ name: "All", value: null }].concat(AuditMetaActions);
        },
      },
      {
        name: "showObjectId",
        label: "Show Object ID",
        type: ItemType.Checkbox,
        default: true,
      },
      {
        name: "date",
        type: ItemType.DateRange,
        label: ["From Date", "To Date"],
      },
    ];
  }
}
