import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsListModule } from '@firestitch/list';
import { FsAuditsModule } from '@firestitch/audit';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';
import { AuditsComponent } from './components';
import { RouterModule } from '@angular/router';
import { FsDatePickerModule } from '@firestitch/datepicker';


@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot(),
    FsListModule.forRoot(),
    FsMessageModule.forRoot(),
    FsMessageModule,
    FsAuditsModule,
    RouterModule.forRoot([]),
    FsDatePickerModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    AuditsComponent,
  ],
})
export class PlaygroundModule {
}
