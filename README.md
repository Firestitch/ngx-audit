# @firestitch/audit

Angular audits list component (`fs-audits`) with optional filters, grouping, and actions.

## Add Note

The **Add Note** button appears in the list toolbar when all of the following are true:

1. **`[showCreate]="true"`** — turns the feature on.
2. **`saveAudit` is available** — either you pass `[saveAudit]` yourself, or you rely on the default from **`apiPath`**: if `ngOnInit` runs with `apiPath` set and no `saveAudit`, the component assigns `saveAudit` as a `POST` to that path with body `{ subjectObjectId, text }`.
3. **`subjectObjectId`** — set to the id of the subject the note belongs to; it is forwarded into `saveAudit` and the dialog.

Your handler should perform the create (API call, etc.) and return an **`Observable`**. When that observable **emits**, the dialog closes and the list **reloads** if the close result is truthy.

### Example (custom handler)

```html
<fs-audits
  [loadAudits]="loadAudits"
  [subjectObjectId]="entityId"
  [showCreate]="true"
  [saveAudit]="saveAudit">
</fs-audits>
```

```typescript
saveAudit = (data: { subjectObjectId: unknown; text: string }) => {
  return this.http.post("/api/audits", data);
};
```

### Example (`apiPath` only)

If you use `apiPath`, you can omit both `loadAudits` and `saveAudit`: the component uses **GET** `apiPath` for the list and **POST** `apiPath` with `{ subjectObjectId, text }` for new notes.

```html
<fs-audits
  [apiPath]="['accounts', accountId, 'audits']"
  [subjectObjectId]="accountId"
  [showCreate]="true">
</fs-audits>
```

### Runtime requirements

The add flow opens a Material-style dialog via **Firestitch** (`FsDialog`). Ensure your application provides the same dialog setup as other Firestitch packages (e.g. `provideAnimations`, `@firestitch/dialog` / Angular Material dialog).

A working demo configuration is in `playground/app/components/audits/`.
