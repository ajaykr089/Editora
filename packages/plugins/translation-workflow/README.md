# @editora/translation-workflow

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


`@editora/translation-workflow` adds localization QA workflows directly in the editor: segment locking, source-target preview, and per-locale validation.

## Features

- Native plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Components without modification
- Segment locking for finalized translations
- Source-target preview per segment
- Per-locale validation (placeholder/token integrity, untranslated checks, length-ratio checks)
- Realtime or on-demand validation
- Multi-instance-safe command targeting and toolbar active states
- Light/dark theme support
- Accessible panel (`role="dialog"`, `listbox` navigation, ARIA labels, live region updates)

## Install

```bash
npm install @editora/translation-workflow
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { TranslationWorkflowPlugin, HistoryPlugin } from '@editora/plugins';

export default function App() {
  return (
    <EditoraEditor
      plugins={[
        HistoryPlugin(),
        TranslationWorkflowPlugin({
          sourceLocale: 'en-US',
          targetLocale: 'fr-FR',
          enableRealtime: true,
        }),
      ]}
    />
  );
}
```

## Basic Usage (Web Component)

```html
<editora-editor id="editor"></editora-editor>
<script>
  const editor = document.getElementById('editor');
  editor.setConfig({
    plugins: 'history translation-workflow',
    toolbar: {
      items:
        'undo redo | toggleTranslationWorkflowPanel runTranslationLocaleValidation toggleTranslationSegmentLock toggleTranslationRealtime',
    },
  });
</script>
```

Accepted aliases: `translationWorkflow`, `translation-workflow`, `translationworkflow`.

## Step-by-Step Scenario (Product Localization)

Scenario: your product release notes are authored in English and translated to French. You want to lock approved segments, validate placeholders, and prevent untranslated strings before handoff.

1. Open panel: `Ctrl/Cmd + Alt + Shift + L`.
2. Set locales: source `en-US`, target `fr-FR`.
3. Click `Capture Source` once when source text is finalized.
4. Translate content in the editor.
5. Select completed segments and click `Lock Selected`.
6. Run `Validate Locale` or use shortcut `Ctrl/Cmd + Alt + Shift + V`.
7. Fix reported issues:
   - missing target content
   - token mismatch (for example `{{name}}`, `%ORDER_ID%`, `${count}`)
   - untranslated segment (same as source)
   - suspicious length ratio for target locale
8. Re-run validation until no blocking issues remain.

Why it helps:

- Prevents placeholder breakage in localized builds.
- Keeps approved segments immutable during review.
- Catches common translation QA gaps before export.

## Manual Verification Playbook (Real Use Case)

Use this as a deterministic QA run before production rollout.

### Scenario A: Release Notes Localization Gate

1. Start from this content:

```html
<h2>Release Notes v4.8</h2>
<p>Welcome {{firstName}}! Your order ID is %ORDER_ID%.</p>
<p>Click <strong>Upgrade Now</strong> to activate premium analytics.</p>
<p>For support, contact support@acme.com within 24 hours.</p>
```

2. Open Translation Workflow panel with `Ctrl/Cmd + Alt + Shift + L`.
3. Click `Capture Source`.
4. Replace the first paragraph with `Welcome to release notes.` (remove both placeholders).
5. Click `Validate Locale` (or `Ctrl/Cmd + Alt + Shift + V`).
6. Verify at least one issue indicates placeholder/token mismatch.
7. In the segment list, pick a segment and click `Lock Selected`.
8. Confirm the segment has lock styling and cannot be edited.
9. Click `Unlock Selected` on the same segment.
10. Confirm the segment is editable again and text can be updated.
11. Fix all issues and re-run validation until the panel reports no blocking issues.

Expected output:

- Placeholder mismatch is surfaced after step 5.
- Lock state is preserved in panel and segment UI.
- Unlock restores editability for the segment.
- Final validation can reach zero issues after fixes.

### Scenario B: Multi-Editor Isolation Check

1. Render two editors on the same page, both with `TranslationWorkflowPlugin`.
2. Open panel and enable realtime in Editor A only.
3. Keep Editor B realtime off.
4. Type translation changes in both editors.

Expected output:

- Toolbar active states (`toggleTranslationRealtime`, panel toggle) remain isolated per editor.
- Validation results and selected segment state do not leak across instances.

### Scenario C: Locked Segment Integrity Check

1. Lock a segment in panel.
2. Try to mutate locked segment content using another command/plugin flow (formatting or external DOM mutation in devtools).
3. Trigger validation again.

Expected output:

- Locked segment content is restored to its locked snapshot.
- Live region communicates that locked content is readonly.

### Run Local E2E for this Scenario

```bash
cd e2e-local
npm test -- tests/translation-workflow.scenario.spec.ts
```

This test automates:

- source capture
- token mismatch detection
- lock -> unlock flow
- post-unlock editability check

## Toolbar Commands

- `toggleTranslationWorkflowPanel`
- `openTranslationWorkflowPanel`
- `runTranslationLocaleValidation`
- `toggleTranslationSegmentLock`
- `toggleTranslationRealtime`
- `setTranslationLocales`
- `captureTranslationSourceSnapshot`
- `setTranslationWorkflowOptions`
- `getTranslationWorkflowState`

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + L` -> toggle workflow panel
- `Ctrl/Cmd + Alt + Shift + V` -> run locale validation
- `Ctrl/Cmd + Alt + Shift + K` -> lock/unlock selected segment

## Advanced Usage

### 1. Locale-specific validation rules

```ts
TranslationWorkflowPlugin({
  sourceLocale: 'en-US',
  targetLocale: 'ja-JP',
  localeRules: [
    {
      locale: 'ja',
      minLengthRatio: 0.45,
      maxLengthRatio: 1.2,
      requireDifferentFromSource: true,
      preserveTokens: true,
    },
  ],
});
```

### 2. Programmatic segment locking in multi-editor pages

```ts
const execute = (window as any).executeEditorCommand;
const editorHost = document.querySelector('[data-editora-editor]');

(window as any).__editoraCommandEditorRoot = editorHost;
execute?.('toggleTranslationSegmentLock', { segmentId: 'translation-segment-8', locked: true });
```

### 3. Runtime locale/profile update

```ts
(window as any).executeEditorCommand?.('setTranslationWorkflowOptions', {
  sourceLocale: 'en-US',
  targetLocale: 'de-DE',
  enableRealtime: false,
  labels: {
    panelTitle: 'Localization QA',
    validateText: 'Run L10n QA',
  },
});
```

### 4. Read runtime state

```ts
(window as any).executeEditorCommand?.('getTranslationWorkflowState', (state) => {
  console.log(state.targetLocale, state.issues.length, state.lockedSegmentCount);
});
```

## Edge Cases Covered

- Multi-editor pages: explicit command context is consumed for safe targeting.
- Stale keyboard focus: shortcuts ignore stale selections outside editor/panel context.
- Locked segments: edit attempts are blocked with live-region feedback.
- Detached editors: panel/state cleanup on unmount/removal.
- Long sessions: realtime validation is debounced and bounded by `maxIssues` / `maxSegments`.
- Token consistency: placeholders are compared source vs target per segment.
- Duplicate segment IDs (from pasted content): plugin re-keys duplicates to avoid lock/source state collisions.
- Nested segment candidates (for example `td > p`): plugin keeps leaf segments only to avoid double counting.
- Locked segment integrity: external mutations are restored back to locked snapshot before QA state is refreshed.
