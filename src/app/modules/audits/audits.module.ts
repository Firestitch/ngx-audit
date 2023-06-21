import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { FsListModule } from '@firestitch/list';
import { FsDateModule } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsBadgeModule } from '@firestitch/badge';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlRendererModule } from '@firestitch/html-editor';

import { FsAuditsComponent } from './components';
import { FsAuditsSubjectDirective } from './directives';


@NgModule({
  imports: [
    CommonModule,

    MatButtonModule,
    MatDialogModule,

    CommonModule,
    FsDateModule,
    FsDialogModule,
    FsListModule,
    FsFormModule,
    FsHtmlRendererModule,
    FsBadgeModule,
  ],
  declarations: [
    FsAuditsComponent,
    FsAuditsSubjectDirective,
  ],
  exports: [
    FsAuditsComponent,
    FsAuditsSubjectDirective,
  ],
})
export class FsAuditsModule { }
