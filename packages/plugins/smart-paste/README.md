# @editora/smart-paste

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


`@editora/smart-paste` provides high-fidelity clipboard handling for rich documents pasted from Microsoft Word, Google Docs, and arbitrary HTML sources.

It applies cleanup profiles at paste-time, keeps instance state isolated per editor, and exposes native commands/shortcuts for quick operator control.

## Features

- Native framework-agnostic plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Components without modification
- Word/Google Docs source detection
- Cleanup profiles: `fidelity`, `balanced`, `plain`
- Runtime profile switching and enable/disable toggle
- Accessible panel (`role="dialog"`, `aria-live`, keyboard support, focusable controls)
- Light/dark theme support
- Multi-instance safe command and panel state
- Keyboard shortcuts for panel/profile/toggle

## Install

```bash
npm install @editora/smart-paste
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { HistoryPlugin, SmartPastePlugin } from '@editora/plugins';

const plugins = [
  HistoryPlugin(),
  SmartPastePlugin({
    defaultProfile: 'balanced',
    maxHtmlLength: 250000,
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
    plugins: 'history smart-paste',
    toolbar: {
      items: 'undo redo | smartPaste smartPasteProfile smartPasteToggle',
    },
  });
</script>
```

Accepted aliases: `smartPaste`, `smart-paste`, `smartpaste`.

## Scenario: Legal Policy Update from Mixed Sources

Your compliance team is drafting a policy update. Content comes from:

- Word-based legal clauses
- Google Docs review notes
- Browser-copied HTML from internal wiki

You need to retain meaningful formatting but remove external editor artifacts before publishing.

### Step-by-step flow

1. Open Smart Paste panel: `Ctrl/Cmd + Alt + Shift + S`
2. Choose profile:
   - `Fidelity` for legal sections that need formatting retention
   - `Balanced` for normal editorial cleanup
   - `Plain Text` for strict no-format blocks
3. Paste sample content from Word/Google Docs/wiki
4. Review panel metrics (`source`, `removed`, `output chars`)
5. If incoming content quality degrades, cycle profile quickly: `Ctrl/Cmd + Alt + Shift + V`
6. Temporarily bypass the plugin if needed: `Ctrl/Cmd + Alt + Shift + G`
7. Re-enable and continue pasting once review is complete

### Why this helps

- Reduces invalid/dirty clipboard markup before it reaches persistence/export
- Gives editors explicit quality controls per paste stream
- Preserves operation speed in large documents with bounded HTML processing

## Toolbar Commands

- `toggleSmartPastePanel` -> open/close Smart Paste panel
- `cycleSmartPasteProfile` -> cycle `fidelity -> balanced -> plain`
- `setSmartPasteProfile` -> set profile directly
- `toggleSmartPasteEnabled` -> enable/disable smart paste
- `setSmartPasteOptions` -> update options at runtime
- `getSmartPasteState` -> emit `editora:smart-paste-state` and return snapshot

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + S` -> toggle Smart Paste panel
- `Ctrl/Cmd + Alt + Shift + V` -> cycle Smart Paste profile
- `Ctrl/Cmd + Alt + Shift + G` -> enable/disable Smart Paste
- `Esc` -> close panel

## Advanced Usage

### Profile-specific overrides

```ts
SmartPastePlugin({
  defaultProfile: 'fidelity',
  profileOptions: {
    fidelity: { keepStyles: true, keepClasses: false, preserveTables: true },
    balanced: { keepStyles: false, keepClasses: false, preserveTables: true },
    plain: { preserveTables: false },
  },
});
```

### Multi-instance React usage (isolated execution)

```tsx
import { useRef } from 'react';
import { EditoraEditor } from '@editora/react';
import { SmartPastePlugin } from '@editora/plugins';

export default function DualEditors() {
  const editorA = useRef<any>(null);
  const editorB = useRef<any>(null);

  return (
    <>
      <EditoraEditor
        plugins={[SmartPastePlugin({ defaultProfile: 'fidelity' })]}
        onInit={(api) => (editorA.current = api)}
      />
      <EditoraEditor
        plugins={[SmartPastePlugin({ defaultProfile: 'plain' })]}
        onInit={(api) => (editorB.current = api)}
      />

      <button onClick={() => editorA.current?.execCommand('setSmartPasteProfile', 'balanced')}>
        Set A Balanced
      </button>
      <button onClick={() => editorB.current?.execCommand('toggleSmartPasteEnabled')}>
        Toggle B Smart Paste
      </button>
    </>
  );
}
```

### Runtime option updates

```ts
(window as any).executeEditorCommand?.('setSmartPasteOptions', {
  maxHtmlLength: 180000,
  labels: {
    panelTitle: 'Paste Quality',
    fidelityText: 'Keep Formatting',
    balancedText: 'Clean Formatting',
    plainText: 'Text Only',
  },
});
```

## Edge Cases Covered

- Keyboard shortcuts only run when event target/selection is inside an editor
- Explicit command editor context is respected in multi-editor pages
- Read-only editor paste attempts are ignored safely
- Oversized HTML payloads fall back to plain text path
- Disconnected/unmounted editors are cleaned via mutation + lifecycle cleanup
- State getters return snapshots (not mutable internals)
