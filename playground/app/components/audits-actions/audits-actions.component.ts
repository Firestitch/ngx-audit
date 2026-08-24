import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { FsListAction } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';
import { Audits } from 'playground/app/consts/audits.const';
import { ObjectClasses } from 'playground/app/consts/object-classes.const';
import { of } from 'rxjs';

import { FsAuditsComponent } from '../../../../src/app/modules/audits/components/audits/audits.component';


@Component({
    selector: 'app-audits-actions',
    templateUrl: './audits-actions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsAuditsComponent],
})
export class AuditsActionsComponent {
  public ObjectClasses = ObjectClasses;

  // showCreate is left off, so Add Note is hidden and only these two render.
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

  public loadAudits = () => {
    return of(Audits);
  };

  private _message = inject(FsMessage);
}
