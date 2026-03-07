# @editora/approval-workflow

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


`@editora/approval-workflow` adds native editorial workflow controls to Editora with Draft -> Review -> Approved states, sign-off history, and optional lock-on-approval behavior.

## Features

- Native framework-agnostic plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Component without code changes
- Draft / Review / Approved state management
- Sign-off entries with actor + timestamp + optional note
- Optional lock-on-approval (sets editor readonly while approved)
- Accessible workflow panel (`role="dialog"`, `aria-live`, labeled controls)
- Keyboard shortcuts for panel and status transitions
- Light/dark theme support
- Multi-instance safe state and panel handling

## Install

```bash
npm install @editora/approval-workflow
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { HistoryPlugin, ApprovalWorkflowPlugin } from '@editora/plugins';

const plugins = [
  HistoryPlugin(),
  ApprovalWorkflowPlugin({
    lockOnApproval: true,
    defaultStatus: 'draft',
    defaultActor: 'Editorial Lead',
  }),
];

export default function App() {
  return <EditoraEditor plugins={plugins} />;
}
```

## Basic Usage (Web Component)

```html
<editora-editor id="editor"></editora-editor>
<script>
  const editor = document.getElementById('editor');
  editor.setConfig({
    plugins: 'history approval-workflow',
    toolbar: {
      items: 'undo redo | approvalWorkflow approvalRequestReview approvalApprove approvalReopen',
    },
  });
</script>
```

Accepted aliases: `approvalWorkflow`, `approval-workflow`, `approvalworkflow`.

## When This Plugin Is Useful

- Editorial teams that need a clear Draft -> Review -> Approved lifecycle
- Legal/compliance workflows where final approval must be explicit and auditable
- Product/content release notes that require owner sign-off before publish
- Multi-team docs where reviewers need comments and approval history in one place
- Regulated environments where approved content should become read-only until reopened

## Dummy Scenario: Security Incident Communication Memo

Use this scenario to validate real-world behavior before production rollout.

### Context

- Document: `Security Incident Customer Communication Memo`
- Author: `Content Lead`
- Reviewer: `Security Reviewer`
- Approver: `Policy Owner`
- Rule: approval comment is required, and approved document is locked

### Plugin Configuration

```ts
ApprovalWorkflowPlugin({
  defaultStatus: 'draft',
  lockOnApproval: true,
  requireCommentOnApprove: true,
  defaultActor: 'Policy Owner',
});
```

### Step-By-Step Test Flow

1. Start in draft and open the workflow panel with `Ctrl/Cmd + Alt + Shift + A`.
2. Add comment as author: `Initial incident memo draft ready for review.` and click `Add Comment`.
3. Click `Request Review` (or use `Ctrl/Cmd + Alt + Shift + R`).
4. Confirm summary shows `In Review` and a system comment is added for review request.
5. Add reviewer comment: `Add customer ETA and legal disclaimer language.`.
6. Try to approve without a comment. Expect rejection because `requireCommentOnApprove` is enabled.
7. Approve with comment: `Legal + Security sign-off complete for external release.`.
8. Confirm status changes to `Approved`, sign-off entry is created, and editor becomes read-only (`contenteditable=false`, `data-readonly=true`).
9. Try typing in the editor. Expect no content mutation while approved.
10. Reopen the document with `Reopen Draft` (or `Ctrl/Cmd + Alt + Shift + D`).
11. Confirm status returns to `Draft` and original editability is restored.

### Multi-Instance Validation

1. Render two editors with Approval Workflow enabled.
2. Move editor A to `Approved`.
3. Keep editor B in `Draft` and add a comment there.
4. Confirm status/comments/sign-offs remain isolated per editor instance.

### Accessibility Validation

1. Open panel and navigate controls only with `Tab` and `Shift+Tab`.
2. Activate actions with keyboard (`Enter` / `Space`) and close panel using `Esc`.
3. Verify screen reader announces labels and status updates from `aria-live` regions.

## Toolbar Commands

- `toggleApprovalWorkflowPanel` -> open/close approval workflow panel
- `requestApprovalReview` -> move status to review
- `approveDocument` -> move status to approved + append sign-off entry
- `reopenDraft` -> move status back to draft
- `addApprovalComment` -> add comment to workflow history
- `setApprovalStatus` -> set explicit status (`draft | review | approved`)
- `getApprovalWorkflowState` -> emit `editora:approval-state`, cache state on `editor.__approvalWorkflowState`, optional callback
- `setApprovalWorkflowOptions` -> update options at runtime for target editor

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + A` -> open/close approval panel
- `Ctrl/Cmd + Alt + Shift + R` -> request review
- `Ctrl/Cmd + Alt + Shift + P` -> approve document
- `Ctrl/Cmd + Alt + Shift + D` -> reopen draft
- `Esc` -> close panel

Shortcuts are scoped to active editor/panel context and do not trigger globally when focus is outside the editor.

## Advanced Usage

### Approve with actor/comment

```ts
const exec = (window as any).executeEditorCommand;

exec?.('approveDocument', {
  author: 'Policy Owner',
  comment: 'Compliance review completed.',
});
```

### Add structured review comment

```ts
const exec = (window as any).executeEditorCommand;

exec?.('addApprovalComment', {
  author: 'Legal Reviewer',
  message: 'Section 4 language updated for jurisdiction scope.',
});
```

### Read workflow state

```ts
const exec = (window as any).executeEditorCommand;

exec?.('getApprovalWorkflowState', (state) => {
  console.log('approval state', state);
});

document.addEventListener('editora:approval-state', (event) => {
  const state = (event as CustomEvent).detail?.state;
  console.log('approval state via event', state);
});
```

## Edge Cases Covered

- Multi-instance state isolation (workflow changes in one editor do not mutate another)
- Approval lock restores original readonly/contenteditable attributes when reopened
- Runtime option updates immediately rehydrate panel and editor status attributes
- Commands remain deterministic when callbacks throw
- Panel and listeners are detached cleanly on plugin destroy
- Toolbar button active states track current workflow status
