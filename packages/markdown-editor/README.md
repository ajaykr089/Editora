# @editora/markdown-editor

A markdown editor for React, built on the Editora editor. You edit in the same toolbar and surface as the
rich-text editor, next to a live, sanitised preview, and the value you read and write is **markdown**.

## Install

```bash
npm install @editora/markdown-editor @editora/themes
```

Load the editor styles once in your app (the markdown editor is themed with the same `--rte-*` variables as
the rich-text editor, so it follows your theme, including dark mode):

```ts
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css'; // optional: enables `.dark`, `[data-theme="dark"]`, `.editora-theme-dark`
import '@editora/plugins/styles.css';
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
| `value` | `string` | | Controlled markdown. When it changes from outside, the editing pane reloads it. |
| `defaultValue` | `string` | `''` | Initial markdown when uncontrolled. |
| `onChange` | `(markdown: string) => void` | | Called with the markdown after every edit. |
| `mode` | `'edit' \| 'preview' \| 'split'` | `'split'` | Initial view. Follows the prop if it changes. |
| `preview` | `boolean` | `true` | `false` removes the preview pane and the view switch, leaving only the editor. |
| `readOnly` | `boolean` | `false` | Disables editing and the toolbar. |
| `placeholder` | `string` | `'Write markdown here...'` | |
| `minHeight` | `number` | `220` | Minimum height, in px, of each pane's content area. |
| `className` | `string` | | Added to the root element. |

## What you get

- The Editora toolbar: undo/redo, headings, bold, italic, strikethrough, link, bullet / numbered / task lists,
  quote and code block, plus the selection toolbar (including inline code) and a status bar.
- Edit, Split and Preview views. Switching views keeps the editor mounted, so undo history and selection survive.
- A preview that supports GitHub-flavoured markdown (tables, task lists, strikethrough) with highlighted code.

## How the markdown is kept

The editing pane is a rich-text surface. Markdown is rendered into it when it loads, and converted back to
markdown on every edit, so the markdown you receive is **normalised** the first time you edit a document
(`*` bullets become `-`, `Setext` headings become `#`, `1. 1. 1.` is renumbered, and so on) and is stable after
that. These constructs round-trip without loss:

headings, paragraphs and line breaks, bold, italic, strikethrough, inline code, links (with titles), images,
bullet / ordered (with start number) / nested / task lists, blockquotes, fenced code (with language), tables
(with alignment) and horizontal rules.

Things to know:

- Underline and super/subscript have no markdown syntax, so they are kept as inline HTML (`<u>`, `<sup>`, `<sub>`).
- Other raw HTML in the markdown is sanitised and is not preserved through the editing pane.
- Characters that would read as markdown when typed as plain text (`*`, `_`, `` ` ``, `[`, a leading `#` or `-`, ...)
  are backslash-escaped, so what you see in the editor is what the preview shows.

## Security

Both the preview and the editing pane are sanitised with `@editora/core`'s DOMPurify wrapper, so raw HTML in
markdown (`<img onerror>`, `<script>`, `javascript:` links) cannot run. Links in the preview open in a new tab with
`rel="noopener noreferrer"`. With no DOM (a server render) nothing is rendered rather than unsanitised HTML, so
render the component on the client.

## Requirements

React 16.8 to 20. The editor depends on `@editora/react`, `@editora/plugins` and `@editora/core`.
