import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { FsApi } from '@firestitch/api';
import { index } from '@firestitch/common';
import { IFilterConfigItem, ItemType } from '@firestitch/filter';
import { FsListComponent, FsListConfig } from '@firestitch/list';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { FsAuditsSubjectDirective } from '../../directives';

import { AuditMetaActions } from './../../../../consts';
import { AuditMetaAction } from './../../../../enums';


@Component({
  selector: 'fs-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsAuditsComponent implements OnInit, OnDestroy {

  @ContentChild(FsAuditsSubjectDirective, { read: TemplateRef })
  public subjectTemplate: TemplateRef<FsAuditsSubjectDirective>;

  @Input() public subjectObjectId;
  @Input() public apiPath: string | any[];
  @Input() public relatedSubjectObjectId;
  @Input() public showSubject = true;
  @Input() public objectClasses = [];
  @Input() public auditMetaActions = AuditMetaActions;
  @Input() public loadAudits: (query) => Observable<{ audits: any[]; paging: any }>;
  @Input() public deleteAudit: (audit) => Observable<any>;

  @ViewChild(FsListComponent, { static: true })
  public list: FsListComponent;

  public config: FsListConfig;
  public AuditMetaAction = AuditMetaAction;
  public auditMetaActionNames = {};
  public objectClassNames = {};
  public showObjectId = false;

  private _destroy$ = new Subject();
  private _api: FsApi;

  public reload(): void {
    this.list.reload();
  }

  public ngOnInit(): void {
    if(!this.loadAudits && this.apiPath) {
      this.loadAudits = (query) => {
        const path = Array.isArray(this.apiPath) ? this.apiPath : [this.apiPath];

        return this._api.get(path.join('/'), query);
      };
    }

    if(!this.deleteAudit && this.apiPath) {
      this.deleteAudit = (audit) => {
        const path = [
          ...(Array.isArray(this.apiPath) ? this.apiPath : [this.apiPath]),
          audit.id,
        ];

        return this._api.delete(path.join('/'), audit);
      };
    }

    this._initConfig();
    this.objectClassNames = index(this.objectClasses, 'value', 'name');
    this.auditMetaActionNames = this.auditMetaActions
      .reduce((accum, item) => {
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
      sort: { value: 'date', direction: 'desc' },
      sorts: [
        { name: 'Created', direction: 'desc', value: 'date' },
      ],
      paging: {
        limits: [25, 50, 150, 250, 500, 1000],
      },
      rowHoverHighlight: false,
      rowActions: this.deleteAudit ? [
        {
          click: (data) => {
            return this.deleteAudit(data);
          },
          show: () => {
            return !!this.deleteAudit;
          },
          label: 'Delete',
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this audit?',
          },
        },
      ] : [],
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

        return this.loadAudits(query)
          .pipe(
            map((response) => {
              return {
                data: response.audits.map((audit) => {
                  const auditMetas = audit.auditMetas
                    .reduce((accum, auditMeta) => {
                      const key = [
                        auditMeta.action,
                        auditMeta.objectName,
                        auditMeta.objectClass,
                        auditMeta.objectClassName,
                        auditMeta.objectId,
                        auditMeta.subject,
                      ].join(',');

                      return {
                        ...accum,
                        [key]: [
                          ...(accum[key] || []),
                          auditMeta,
                        ],
                      };
                    }, {});

                  if(audit.actorAccount?.firstName && audit.actorAccount?.lastName) {
                    audit.actorAccount.name = `${audit.actorAccount.firstName} ${audit.actorAccount.lastName.substr(0, 1)}.`;
                  }

                  audit.auditMetas = Object.keys(auditMetas)
                    .map((key) => {
                      const parts = key.split(',');

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
        name: 'keyword',
        type: ItemType.Keyword,
        label: 'Search',
      },
      {
        name: 'subjectObjectClass',
        type: ItemType.Select,
        label: 'Subject Type',
        values: () => {
          return [{ name: 'All', value: null }]
            .concat(this.objectClasses);
        },
        hide: this.objectClasses.length === 0,
      },
      {
        name: 'auditMetaObjectClass',
        type: ItemType.Select,
        label: 'Detail Type',
        values: () => {
          return [{ name: 'All', value: null }]
            .concat(this.objectClasses);
        },
        hide: this.objectClasses.length === 0,
      },
      {
        name: 'action',
        type: ItemType.Select,
        label: 'Action',
        values: () => {
          return [{ name: 'All', value: null }]
            .concat(AuditMetaActions);
        },
      },
      {
        name: 'showObjectId',
        label: 'Show Object ID',
        type: ItemType.Checkbox,
        default: true,
      },
      {
        name: 'date',
        type: ItemType.DateRange,
        label: ['From Date','To Date'],
      },
    ];
  }

}
