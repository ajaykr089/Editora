# @editora/markdown-editor

A markdown editor for React, built on the Editora editor. You write markdown in a code editor with the Editora
toolbar and shortcuts, next to a live, sanitised preview, and the value you read and write is the markdown itself.

## Install

```bash
npm install @editora/markdown-editor @editora/themes
```

Load the styles once in your app. The markdown editor is themed with the same `--rte-*` variables as the rich-text
editor, so it follows your theme, including dark mode:

```ts
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css'; // optional: enables `.dark`, `[data-theme="dark"]`, `.editora-theme-dark`
import '@editora/light-code-editor/light-code-editor.css';
import '@editora/plugins/styles.css'; // only needed for editorType="rich"
```

## Usage

```tsx
import { MarkdownEditor } from '@editora/markdown-editor';

// Uncontrolled
<MarkdownEditor defaultValue={'# Hello\n\nWrite **markdown** here.'} onChange={(markdown) => save(markdown)} />

// Controlled
const [value, setValue] = useState('# Hello');
<MarkdownEditor value={value} onChange={setValue} />
```

## Props

| Prop | Type | Default | |
| --- | --- | --- | --- |
| `value` | `string` | | Controlled markdown. |
| `defaultValue` | `string` | `''` | Initial markdown when uncontrolled. |
| `onChange` | `(markdown: string) => void` | | Called with the markdown after every edit. |
| `editorType` | `'source' \| 'rich'` | `'source'` | What the editing pane is (see below). The header also lets the user switch. |
| `mode` | `'edit' \| 'preview' \| 'split'` | `'split'` | Initial layout. Follows the prop if it changes. |
| `preview` | `boolean` | `true` | `false` removes the preview pane and the layout switch, leaving only the editor. |
| `readOnly` | `boolean` | `false` | Disables editing and the toolbar. |
| `placeholder` | `string` | `'Write markdown here...'` | |
| `minHeight` | `number` | `220` | Minimum height, in px, of each pane's content area. |
| `className` | `string` | | Added to the root element. |

## Editing

**Source** (the default) is the markdown text in a code editor, with markdown syntax highlighting, line numbers,
wrapping and find / replace (Cmd/Ctrl+F). The markdown is the document, so nothing is converted and nothing is
lost, whatever it contains (HTML blocks, footnotes, front matter, odd spacing...).

- **Toolbar**, in the Editora editor's style: undo / redo, heading level, bold, italic, strikethrough, link,
  bullet / numbered / task lists, quote, inline code, code block and horizontal rule. Each acts on the selection (or
  the line the caret is on) and is one undo step. Formatting that is already there is toggled off again.
- **Shortcuts**: Cmd/Ctrl+B bold, +I italic, +Shift+X strikethrough, +E inline code, +K link.
- **Enter** in a list or quote carries the marker to the next line (numbers count up, task boxes start unchecked),
  splits an item when pressed in the middle of it, and ends the list on an empty item.
- A status bar with line and column, selection size, and word, character and line counts.

**Rich text** (`editorType="rich"`) renders the markdown into the Editora rich-text editor and converts it back on
every edit. It is more approachable for people who do not write markdown, but the markdown is **normalised** the
first time it is edited (`*` bullets become `-`, `Setext` headings become `#`, `1. 1. 1.` is renumbered, ...) and
is stable after that. These constructs round-trip without loss: headings, paragraphs and line breaks, bold,
italic, strikethrough, inline code, links (with titles), images, bullet / ordered (with start number) / nested /
task lists, blockquotes, fenced code (with language), tables (with alignment) and horizontal rules. Underline and
super/subscript have no markdown syntax, so they are kept as inline HTML (`<u>`, `<sup>`, `<sub>`); other raw HTML
is sanitised and not preserved. Switching between the two keeps the text, and changes it only if you edit while in
rich text.

Views: **Edit**, **Split** and **Preview**. Switching keeps the editor mounted, so undo history and selection
survive.

## Security

The preview and the rich pane are sanitised with `@editora/core`'s DOMPurify wrapper, so raw HTML in markdown
(`<img onerror>`, `<script>`, `javascript:` links) cannot run. Links in the preview open in a new tab with
`rel="noopener noreferrer"`. With no DOM (a server render) the preview renders nothing rather than unsanitised
HTML, so render the component on the client.

## Requirements

React 16.8 to 20. Depends on `@editora/light-code-editor`, `@editora/react`, `@editora/plugins` and `@editora/core`.
