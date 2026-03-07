# @editora/slash-commands

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Slash command palette plugin for Editora. Type `/` to quickly run editor commands.

## Features

- Native framework-agnostic implementation (no React dependency)
- Works in React (Vite/CRA) and web components
- Keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Tab`, `Escape`)
- Keyboard shortcut: `Ctrl/Cmd + /` to open slash commands without typing `/`
- Accessible listbox semantics (`role=listbox`, `role=option`, `aria-selected`)
- Light/dark theme compatible popup styles
- Custom command items and actions
- Reliable built-in command catalog (headings, lists, table, divider, formatting)

## Installation

```bash
npm install @editora/slash-commands @editora/core
```

## React Usage

```ts
import { EditoraEditor } from '@editora/react';
import { SlashCommandsPlugin, BoldPlugin, HeadingPlugin, ListPlugin } from '@editora/plugins';

const plugins = [
  BoldPlugin(),
  HeadingPlugin(),
  ListPlugin(),
  SlashCommandsPlugin(),
];

<EditoraEditor plugins={plugins} />;
```

## Web Component Usage

```html
<editora-editor id="editor"></editora-editor>
<script>
  const el = document.getElementById('editor');
  el.setConfig({
    plugins: 'bold heading list slashCommands',
    toolbar: { items: 'bold heading | openSlashCommands' },
    pluginConfig: {
      slashCommands: {
        maxSuggestions: 10,
      },
    },
  });
</script>
```

Aliases accepted for plugin config lookup: `slashCommands`, `slash-commands`, `slashcommands`.

## Options

- `triggerChar?: string` default `'/'`
- `minChars?: number` default `0`
- `maxQueryLength?: number` default `48`
- `maxSuggestions?: number` default `10`
- `requireBoundary?: boolean` default `true`
- `includeDefaultItems?: boolean` default `true`
- `items?: SlashCommandItem[]`
- `itemRenderer?: (item, query) => string`
- `emptyStateText?: string` default `'No commands found'`
- `panelLabel?: string` default `'Slash commands'`

## SlashCommandItem

```ts
interface SlashCommandItem {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  command?: string;
  commandValue?: any;
  insertHTML?: string;
  action?: (ctx) => boolean | void | Promise<boolean | void>;
}
```

Execution order per item:

1. `action`
2. `insertHTML`
3. `command`

## Custom Item Example

```ts
import { SlashCommandsPlugin } from '@editora/plugins';

const slash = SlashCommandsPlugin({
  items: [
    {
      id: 'date',
      label: 'Insert Date',
      description: 'Insert current date',
      keywords: ['time', 'now'],
      action: ({ insertHTML }) => insertHTML(`<p>${new Date().toLocaleDateString()}</p>`),
    },
    {
      id: 'h2',
      label: 'Heading 2',
      command: 'heading2',
    },
  ],
});
```

## Advanced Usage

### Extend built-in commands

```ts
const slash = SlashCommandsPlugin({
  includeDefaultItems: true,
  items: [
    {
      id: 'insert-signature',
      label: 'Insert Signature Block',
      description: 'Insert email signature snippet',
      keywords: ['signature', 'email', 'footer'],
      action: ({ insertHTML }) =>
        insertHTML('<p>Regards,<br><strong>Jane Doe</strong><br>VP Engineering</p>'),
    },
  ],
});
```

Use this pattern to add plugin-specific commands such as `insertMention`, `toggleTrackChanges`, `togglePreview`, `insertMath`, `openEmojiDialog`, etc., only when those plugins are enabled in your editor.

### Use only your custom command set

```ts
const slash = SlashCommandsPlugin({
  includeDefaultItems: false,
  items: [
    { id: 'h2', label: 'Heading 2', command: 'heading2' },
    { id: 'divider', label: 'Divider', command: 'insertHorizontalRule' },
  ],
});
```

### Command item that passes value

```ts
const slash = SlashCommandsPlugin({
  items: [
    {
      id: 'align-center',
      label: 'Align Center',
      command: 'setTextAlignment',
      commandValue: 'center',
    },
  ],
});
```

## Edge Case Behavior

- If command execution fails (for example plugin command not registered), the typed invocation like `/table` is restored instead of being lost.
- Multi-instance safe: each editor gets unique list item IDs to avoid `aria-activedescendant` collisions.
- Popup repositions on selection changes, window resize, and scroll.
- `Enter` on empty result set closes the popup without forcing a command.
- Popup auto-closes when selection leaves editor or editor becomes read-only.

## Toolbar Command

The plugin exposes `openSlashCommands` toolbar/command entry.

- Add `openSlashCommands` to custom toolbar string to open the panel without typing `/`.
- The same command is also bound to `Ctrl/Cmd + /` by plugin keymap.
