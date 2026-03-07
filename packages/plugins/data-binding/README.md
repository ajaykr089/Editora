# @editora/data-binding

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


`@editora/data-binding` adds merge-style data tokens to Editora with runtime preview from static data, callback data, or API sources.

## Features

- Native framework-agnostic plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Component without code changes
- Insert and edit data tokens like `{{user.firstName}}`
- Preview mode renders live values from runtime data
- Supports static object data, async callback data, and API fetch data
- Multi-instance safe (preview/data cache is isolated per editor)
- Accessible dialog (`role="dialog"`, focus trap, `Esc` close)
- Light/dark theme support

## Install

```bash
npm install @editora/data-binding
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, DataBindingPlugin } from '@editora/plugins';

const plugins = [
  BoldPlugin(),
  HistoryPlugin(),
  DataBindingPlugin({
    data: {
      user: { firstName: 'Ava', role: 'Admin' },
      order: { total: 4999.9, currency: 'USD' },
    },
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
    plugins: 'bold history dataBinding',
    toolbar: {
      items: 'bold undo redo | dataBinding dataBindingPreview',
    },
  });
</script>
```

Accepted aliases: `dataBinding`, `data-binding`, `databinding`.

## Toolbar Commands

- `openDataBindingDialog` -> open insert/edit dialog
- `insertDataBindingToken` -> insert token directly
- `editDataBindingToken` -> update selected token
- `toggleDataBindingPreview` -> toggle rendered preview
- `setDataBindingData` -> override data object for current editor
- `refreshDataBindings` -> clear cache and re-render tokens

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + D` -> open data binding dialog
- `Ctrl/Cmd + Alt + Shift + B` -> toggle preview
- `F7` -> open dialog (fallback)
- `F8` -> toggle preview (fallback)
- `Esc` -> close dialog

## API Data Source (Advanced)

```ts
DataBindingPlugin({
  api: {
    url: '/api/template/context',
    method: 'POST',
    headers: ({ editorRoot }) => ({
      'Content-Type': 'application/json',
      'X-Doc-Id': editorRoot.getAttribute('data-doc-id') || '',
    }),
    body: ({ editorRoot }) => ({
      locale: editorRoot.getAttribute('data-locale') || 'en-US',
      audience: editorRoot.getAttribute('data-audience') || 'public',
    }),
    responsePath: 'data',
    timeoutMs: 10000,
  },
  cacheTtlMs: 15000,
});
```

## Callback Data Source

```ts
DataBindingPlugin({
  async getData({ editorRoot }) {
    const locale = editorRoot.getAttribute('data-locale') || 'en-US';
    const res = await fetch(`/api/context?locale=${encodeURIComponent(locale)}`);
    if (!res.ok) return {};
    return res.json();
  },
});
```

## Runtime Data Update

```ts
(window as any).executeEditorCommand?.('setDataBindingData', {
  user: { firstName: 'Liam' },
  order: { total: 1200.5 },
});

(window as any).executeEditorCommand?.('toggleDataBindingPreview', true);
```

## Edge Cases Covered

- Tokens remain non-editable (`contenteditable="false"`).
- Preview state and data cache are per-editor instance.
- Dialog is keyboard accessible and closes reliably on `Esc` or outside click.
- Missing values fall back to configured fallback text.
- History records token insert/edit when History plugin is present.
