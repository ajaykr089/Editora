# @editora/conditional-content

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


`@editora/conditional-content` adds template-style conditional blocks (`IF/ELSE`) to Editora, with audience/locale targeting and preview evaluation.

## Features

- Native framework-agnostic plugin (no framework dependency)
- Works in React (Vite/CRA) and Web Component without changes
- Insert/edit conditional blocks with:
  - condition expression
  - audience targeting
  - locale targeting
  - optional `ELSE` branch
- Grouped toolbar controls for conditional rule + preview
- Inline floating block actions (Edit / Delete) when caret is inside a conditional block
- Preview mode to evaluate visible branch from runtime context
- Multi-instance safe (per-editor preview/context state)
- Accessible dialog (`role="dialog"`, focus trap, `Esc` close)
- Dark/light theme support

## Install

```bash
npm install @editora/conditional-content
```

## Basic Usage (React)

```tsx
import { EditoraEditor } from '@editora/react';
import { ConditionalContentPlugin, BoldPlugin, HistoryPlugin } from '@editora/plugins';

const plugins = [
  BoldPlugin(),
  HistoryPlugin(),
  ConditionalContentPlugin({
    defaultCondition: 'user.role == "admin"',
    enableElseByDefault: true,
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
    plugins: 'bold history conditionalContent',
    toolbar: {
      items: 'bold undo redo | conditionalContent conditionalPreview',
    },
    pluginConfig: {
      conditionalContent: {
        defaultCondition: 'user.role == "admin"',
        enableElseByDefault: true,
      },
    },
  });
</script>
```

Accepted aliases: `conditionalContent`, `conditional-content`, `conditionalcontent`.

## Toolbar Commands

- `openConditionalDialog` → open insert/edit dialog
- `insertConditionalBlock` → insert block directly with config
- `editConditionalBlock` → edit currently selected conditional block
- `toggleConditionalPreview` → preview on/off
- `deleteConditionalBlock` → remove the currently selected conditional block
- `setConditionalContext` → update runtime context for preview evaluation

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + Shift + C` → open conditional dialog
- `Ctrl/Cmd + Alt + Shift + P` → toggle conditional preview
- `F9` → open conditional dialog (fallback)
- `F10` → toggle preview (fallback)
- `Esc` → close conditional dialog

## Condition Syntax (default evaluator)

Supported examples:

- `user.role == "admin"`
- `locale == "en-US"`
- `user.tier != "free"`
- `order.total >= 100`
- `user.tags contains "beta"`
- `user.role in ["admin", "editor"]`
- `feature.newDashboard` (truthy)
- `!feature.newDashboard` (falsy)

You can override evaluator with `evaluateCondition`.

## Advanced Usage

### Runtime context from API/state

```ts
ConditionalContentPlugin({
  async getContext({ editorRoot }) {
    const docId = editorRoot.getAttribute('data-doc-id');
    const res = await fetch(`/api/docs/${docId}/context`);
    if (!res.ok) return {};
    return res.json();
  },
  currentAudience: 'internal',
  currentLocale: 'en-US',
});
```

### Custom evaluator

```ts
ConditionalContentPlugin({
  evaluateCondition(condition, context) {
    // Plug your own parser/evaluator here
    if (!condition) return true;
    return condition === 'always' || Boolean(context['featureEnabled']);
  },
});
```

### Set/refresh context at runtime

```ts
(window as any).executeEditorCommand?.('setConditionalContext', {
  user: { role: 'editor' },
  audience: 'internal',
  locale: 'en-US',
});

(window as any).executeEditorCommand?.('toggleConditionalPreview', true);
```

## Edge Cases Covered

- Preview/edit state is isolated per editor instance.
- Dialog focus is trapped; `Esc` always closes.
- Preview mode locks conditional bodies to prevent accidental edits.
- `IF/ELSE` body visibility updates after context changes.
- Insertion preserves current selection content into the `IF` branch.
