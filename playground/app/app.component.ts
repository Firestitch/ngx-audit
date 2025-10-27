import { Component } from '@angular/core';

import { environment } from '../environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { AuditsComponent } from './components/audits/audits.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [FsExampleModule, AuditsComponent]
})
export class AppComponent {
  public config = environment;
}
