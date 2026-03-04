# @editora/citations

`@editora/citations` adds native citation authoring to Editora with inline references, bibliography generation, and optional citation-note (footnote) sync.

## Features

- Native framework-agnostic plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Component without code changes
- Inline citations with APA / MLA / Chicago style switching
- Auto-generated bibliography section (`References`)
- Optional citation-note sync (`Citation Notes` section)
- Multi-instance safe (state, panel, and debounce timers isolated per editor)
- Accessible panel (`role="dialog"`, keyboard focus, `aria-live`, labeled controls)
- Light/dark theme support
- Debounced content refresh for performance

## Install

```bash
npm install @editora/citations
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, CitationsPlugin } from '@editora/plugins';

const plugins = [
  BoldPlugin(),
  HistoryPlugin(),
  CitationsPlugin({
    defaultStyle: 'apa',
    enableFootnoteSync: true,
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
    plugins: 'bold history citations',
    toolbar: {
      items: 'bold undo redo | citations citationsRefresh citationsStyle',
    },
  });
</script>
```

Accepted aliases: `citations`, `citation`.

## Toolbar Commands

- `toggleCitationsPanel` -> open/close citations panel
- `insertCitation` -> insert citation at current caret
- `refreshCitations` -> rebuild citation references + bibliography + notes
- `setCitationStyle` -> set `apa | mla | chicago`
- `cycleCitationStyle` -> rotate style in toolbar/dialog
- `getCitationRecords` -> emit `editora:citations-data`, cache on `editor.__citationRecords`, optional callback
- `setCitationsOptions` -> update plugin options at runtime
- `locateCitation` -> focus citation reference by id
- `deleteCitation` -> remove selected/adjacent citation or remove all occurrences by citation id
- `insertRecentCitation` -> reinsert most recent citation (or by citation id) without reopening/reloading

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + C` -> open/close citations panel
- `Ctrl/Cmd + Alt + Shift + B` -> refresh bibliography and notes
- `Ctrl/Cmd + Alt + Shift + J` -> cycle citation style
- `Esc` -> close panel

## Advanced Usage

### Insert citation programmatically

```ts
(window as any).executeEditorCommand?.('insertCitation', {
  author: 'Nielsen',
  year: '2024',
  title: 'Designing Content Workflows',
  source: 'Editorial Systems Journal',
  url: 'https://example.org/editorial-systems',
  note: 'Used in policy baseline section',
});
```

### Switch style + refresh

```ts
const exec = (window as any).executeEditorCommand;

exec?.('setCitationStyle', 'chicago');
exec?.('refreshCitations');
```

### Read citation records

```ts
const exec = (window as any).executeEditorCommand;

exec?.('getCitationRecords', (records) => {
  console.log('records', records);
});

document.addEventListener('editora:citations-data', (event) => {
  const records = (event as CustomEvent).detail?.records || [];
  console.log('records via event', records);
});
```

## Edge Cases Covered

- Duplicate citation ids are deduped in bibliography while preserving inline occurrences.
- Invalid custom ids are normalized before use in DOM anchors/backrefs.
- Backspace/Delete on selected or adjacent citation references removes the citation cleanly.
- Deleted citations remain available in the recent list for quick reinsertion in the same session.
- Panel includes direct per-recent-item `Delete` actions to avoid manual id workflows.
- Deleting references and typing updates bibliography/notes via debounced refresh.
- Managed sections are excluded from insertion targets to avoid nested references.
- Repeated refreshes with unchanged references skip expensive DOM rebuilds.
- Runtime option/style changes are scoped to the targeted editor instance.

## Production Gate

- CI gate command: `npm run verify:citations` (repo root)
- Detailed checklist: `packages/plugins/citations/PRODUCTION_CHECKLIST.md`
