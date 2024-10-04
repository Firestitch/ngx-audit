import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { FsExampleModule } from '@firestitch/example';
import { FsListModule } from '@firestitch/list';
import { FsMessageModule } from '@firestitch/message';
import { FsAuditsModule } from 'src/public_api';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { AppComponent } from './app.component';
import { AuditsComponent } from './components';
import { AppMaterialModule } from './material.module';


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
