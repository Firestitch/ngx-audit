
import { AuditMetaAction } from '../enums';

export const AuditMetaActions = [
  { name: 'Create', value: AuditMetaAction.Create, pastName: 'Created' },
  { name: 'Add', value: AuditMetaAction.Add, pastName: 'Added to' },
  { name: 'Change', value: AuditMetaAction.Change, pastName: 'Changed' },
  { name: 'Remove', value: AuditMetaAction.Remove, pastName: 'Removed from' },
  { name: 'Delete', value: AuditMetaAction.Delete, pastName: 'Deleted' },
  { name: 'Info', value: AuditMetaAction.Info, pastName: 'Info' },
];
