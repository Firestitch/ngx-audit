import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Audits } from 'playground/app/consts/audits.const';
import { ObjectClasses } from 'playground/app/consts/object-classes.const';
import { of } from 'rxjs';

import { FsAuditsComponent } from '../../../../src/app/modules/audits/components/audits/audits.component';


@Component({
    selector: 'app-audits-no-actions',
    templateUrl: './audits-no-actions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsAuditsComponent],
})
export class AuditsNoActionsComponent {
  public ObjectClasses = ObjectClasses;

  public loadAudits = () => {
    return of(Audits);
  };
}
