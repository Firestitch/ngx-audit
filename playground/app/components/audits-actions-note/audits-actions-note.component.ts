import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FsListAction } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';
import { Audits } from 'playground/app/consts/audits.const';
import { ObjectClasses } from 'playground/app/consts/object-classes.const';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FsAuditsComponent } from '../../../../src/app/modules/audits/components/audits/audits.component';


@Component({
    selector: 'app-audits-actions-note',
    templateUrl: './audits-actions-note.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsAuditsComponent],
})
export class AuditsActionsNoteComponent {
  private _message = inject(FsMessage);


  public ObjectClasses = ObjectClasses;

  // These render first, in declared order; the library appends Add Note after them.
  public actions: FsListAction[] = [
    {
      label: 'Export',
      click: () => this._message.success('Export clicked'),
    },
    {
      label: 'Archive',
      menu: true,
      click: () => this._message.success('Archive clicked'),
    },
  ];

  public saveAudit = () => {
    return of(null).pipe(
      tap(() => this._message.success('Note saved')),
    );
  };

  public loadAudits = () => {
    return of(Audits);
  };
}
