import { NgModule } from '@angular/core';

import { FsAuditAddComponent } from './components/audit-add/audit-add.component';
import { FsAuditsComponent } from './components/audits/audits.component';
import { FsAuditsSubjectDirective } from './directives/audits-subject.directive';

@NgModule({
  imports: [
    FsAuditsComponent,
    FsAuditAddComponent,
    FsAuditsSubjectDirective,
  ],
  exports: [
    FsAuditsComponent,
    FsAuditAddComponent,
    FsAuditsSubjectDirective,
  ],
})
export class FsAuditsModule {}
