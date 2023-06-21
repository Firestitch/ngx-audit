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

import { AuditsComponent } from './components';


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
    AuditsComponent,
  ],
  exports: [
    AuditsComponent,
  ],
})
export class FsAuditsModule { }
