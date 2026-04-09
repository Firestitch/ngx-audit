import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule, SubmitEvent } from '@firestitch/form';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface FsAuditAddDialogData {
  subjectObjectId: unknown;
  saveAudit: (data: { subjectObjectId: unknown; text: string }) => Observable<unknown>;
}

@Component({
  selector: 'fs-audit-add',
  templateUrl: './audit-add.component.html',
  styleUrls: ['./audit-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsDialogModule,
    FsFormModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class FsAuditAddComponent {

  public text = '';

  public data = inject<FsAuditAddDialogData>(MAT_DIALOG_DATA);
  private _dialogRef = inject(MatDialogRef<FsAuditAddComponent>);

  public save = (event: SubmitEvent): Observable<unknown> => {
    return this.data.saveAudit({
      subjectObjectId: this.data.subjectObjectId,
      text: this.text.trim(),
    }).pipe(
      tap(() => this._dialogRef.close(true)),
    );
  };

}
