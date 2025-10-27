import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsExampleModule } from '@firestitch/example';
import { FsListModule } from '@firestitch/list';
import { FsMessageModule } from '@firestitch/message';
import { provideRouter } from '@angular/router';
import { FsDatePickerModule } from '@firestitch/datepicker';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, FsExampleModule.forRoot(), FsListModule.forRoot(), FsMessageModule.forRoot(), FsMessageModule, FsDatePickerModule.forRoot()),
        provideAnimations(),
        provideRouter([]),
    ]
})
  .catch(err => console.error(err));

