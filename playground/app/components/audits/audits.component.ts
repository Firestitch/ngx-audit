import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FsMessage } from '@firestitch/message';
import { Audits } from 'playground/app/consts/audits.const';
import { ObjectClasses } from 'playground/app/consts/object-classes.const';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FsAuditsComponent } from '../../../../src/app/modules/audits/components/audits/audits.component';


@Component({
    selector: 'app-audits',
    templateUrl: './audits.component.html',
    styleUrls: ['./audits.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsAuditsComponent],
})
export class AuditsComponent {
  public ObjectClasses = ObjectClasses;

  public saveAudit = (data: { subjectObjectId: unknown; text: string }) => {
    return of(null).pipe(
      tap(() => this._message.success('Note saved')),
    );
  };

  public loadAudits = () => {
    return of(Audits);
  };

  private _message = inject(FsMessage);
}
