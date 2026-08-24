import { Component } from '@angular/core';

import { environment } from '../environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { AuditsActionsNoteComponent } from './components/audits-actions-note/audits-actions-note.component';
import { AuditsActionsComponent } from './components/audits-actions/audits-actions.component';
import { AuditsNoActionsComponent } from './components/audits-no-actions/audits-no-actions.component';
import { AuditsComponent } from './components/audits/audits.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [
        FsExampleModule,
        AuditsNoActionsComponent,
        AuditsComponent,
        AuditsActionsComponent,
        AuditsActionsNoteComponent,
    ]
})
export class AppComponent {
  public config = environment;
}
