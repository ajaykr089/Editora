# @editora/blocks-library

`@editora/blocks-library` provides a native reusable block/snippet workflow for rich-text authoring. Teams can define an org-wide block catalog, search by keywords/category, and insert blocks with keyboard-first workflows.

## Features

- Native plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Components without modification
- Search + category filtering for large block libraries
- Keyboard-first navigation (`ArrowUp/ArrowDown`, `Enter`, `Esc`)
- Multi-instance-safe toolbar and command targeting
- Light/dark theme support
- Accessible panel (`role="dialog"`, `role="listbox"`, `role="option"`, live region updates)
- Runtime option updates and optional async block loading

## Install

```bash
npm install @editora/blocks-library
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { BlocksLibraryPlugin, HistoryPlugin } from '@editora/plugins';

const blocks = [
  {
    id: 'hero-notice',
    label: 'Hero Notice',
    category: 'Announcements',
    tags: ['banner', 'hero'],
    html: '<section><h2>Important Update</h2><p>Please review before publishing.</p></section>',
  },
  {
    id: 'faq-item',
    label: 'FAQ Item',
    category: 'Support',
    tags: ['faq'],
    html: '<h3>Question</h3><p>Answer...</p>',
  },
];

export default function App() {
  return (
    <EditoraEditor
      plugins={[
        HistoryPlugin(),
        BlocksLibraryPlugin({
          blocks,
          maxResults: 120,
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
    plugins: 'history blocks-library',
    toolbar: {
      items: 'undo redo | blocksLibraryPanel insertLastBlockSnippet',
    },
  });
</script>
```

Accepted aliases: `blocksLibrary`, `blocks-library`, `blockslibrary`.

## Step-by-Step Scenario (Policy Team)

Scenario: your compliance team repeatedly inserts standardized policy sections (security notice, escalation matrix, legal disclaimer, incident footer).

1. Configure block registry in plugin options (`blocks` array).
2. Open panel with `Ctrl/Cmd + Alt + Shift + B`.
3. Type part of a label/tag (for example `escalation`) in search.
4. Narrow by category (for example `Operations`).
5. Move with `ArrowUp`/`ArrowDown`.
6. Press `Enter` to insert selected block at caret.
7. Reuse previous block quickly with `Ctrl/Cmd + Alt + Shift + L`.

Why it helps:

- Keeps critical sections consistent across documents.
- Reduces manual copy/paste and formatting drift.
- Speeds up editorial flow while preserving compliance language.

## Toolbar Commands

- `toggleBlocksLibraryPanel` -> open/close panel
- `openBlocksLibraryPanel` -> open panel
- `insertBlockSnippet` -> insert block by id
- `insertLastBlockSnippet` -> insert last inserted block
- `refreshBlocksLibraryData` -> force reload async block registry
- `setBlocksLibraryOptions` -> update options at runtime
- `getBlocksLibraryState` -> emit and return current state snapshot

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + B` -> toggle Blocks Library panel
- `Ctrl/Cmd + Alt + Shift + L` -> insert last block
- `ArrowUp / ArrowDown` -> move selection in panel
- `Enter` -> insert selected block
- `Esc` -> close panel

## Advanced Usage

### 1. Async org-wide block registry

```ts
BlocksLibraryPlugin({
  getBlocks: async ({ signal }) => {
    const response = await fetch('/api/blocks?scope=policy', { signal });
    if (!response.ok) throw new Error('Failed to load blocks');
    return response.json();
  },
  cacheTtlMs: 120_000,
});
```

### 2. Runtime updates for a single editor instance

```ts
(window as any).executeEditorCommand?.('setBlocksLibraryOptions', {
  defaultCategory: 'support',
  maxResults: 150,
  labels: {
    panelTitle: 'Team Snippets',
    insertText: 'Insert Snippet',
  },
});
```

### 3. Programmatic insertion by id

```ts
(window as any).executeEditorCommand?.('insertBlockSnippet', 'hero-notice');
```

## Edge Cases Covered

- Multi-editor pages: command context and toolbar active state stay scoped per editor.
- Read-only editors: insertion is blocked safely with clear live-region messaging.
- Disconnected editors: panel/state cleanup on unmount/removal.
- Large registries: bounded render list (`maxResults`) and cached filtering.
- Async registry failures: non-crashing load error state with retry command.
- Unsafe block HTML: blocked tags and dangerous URL/event attributes are stripped.

