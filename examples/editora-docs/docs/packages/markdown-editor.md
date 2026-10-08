---
title: "@editora/markdown-editor"
description: Markdown editor for React on the Editora toolbar and theme - lossless source editing, a live sanitised preview, scroll sync, fullscreen, footnotes, front matter and optional math.
keywords: [editora, markdown, markdown-editor, react, preview, footnotes, math, katex]
---

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

// A fixed height: each pane scrolls on its own, and in split view the two scroll together
<MarkdownEditor value={value} onChange={setValue} height={520} />
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
| `height` | `number \| string` | | Fixes the height (a number is px, a string any CSS length). Each pane then scrolls inside the editor. Without it the editor grows with its text. |
| `syncScroll` | `boolean` | `true` | In split view, scroll the source and the preview together. Needs a `height` (or fullscreen), since only then do the panes scroll. |
| `minHeight` | `number` | `220` | Minimum height, in px, of each pane's content area. |
| `renderMath` | `(tex, displayMode) => string` | | Turns on math in the preview (see [Math](#math)). |
| `labels` | `Partial<MarkdownEditorLabels>` | English | Any of the text the editor shows, to translate it (see [Labels](#labels)). |
| `className` | `string` | | Added to the root element. |

A `ref` gives a [handle](#ref).

## Editing

**Source** (the default) is the markdown text in a code editor, with markdown syntax highlighting, line numbers,
wrapping and find / replace (Cmd/Ctrl+F). The markdown is the document, so nothing is converted and nothing is
lost, whatever it contains (HTML blocks, footnotes, front matter, odd spacing...).

- **Toolbar**, in the Editora editor's style: undo / redo, heading level, bold, italic, strikethrough, link, image,
  bullet / numbered / task lists, quote, inline code, code block, table and horizontal rule. Each acts on the
  selection (or the line the caret is on) and is one undo step. Formatting that is already there is toggled off
  again. Image makes `![alt text](url)` (a selected address becomes the source, any other selection the
  description) and Table inserts a 3x2 table with the first header selected, with the blank lines around it that
  markdown needs.
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
is sanitised and not preserved. Front matter is kept untouched. Footnotes and math are not understood by the rich
surface (they would be rewritten as plain text), so use the source editor for documents that have them. Switching
between the two keeps the text, and changes it only if you edit while in rich text.

Views: **Edit**, **Split** and **Preview**. Switching keeps the editor mounted, so undo history and selection
survive. The header also has a **fullscreen** button: the editor fills the window, the page behind it does not
scroll, and Escape leaves (unless a menu or the find panel took that Escape).

## The preview

GitHub-flavoured markdown, plus:

- **Front matter**: a YAML block fenced by `---` at the very start of the document (as Jekyll, Hugo, Docusaurus and
  Obsidian use) is shown as a collapsed "Front matter" block instead of a rule and a heading. A block between two
  rules that is prose rather than YAML is not mistaken for it.
- **Footnotes**: `text[^1]` and `[^1]: the note` become numbered links with the notes, and a link back from each,
  at the end. A click on one stays inside the preview; it does not change the address of your page.
- **Task lists** with checkboxes, tables with alignment, highlighted code.
- **Math** when you ask for it (below).

### Scroll sync

With a `height`, the source and the preview scroll as one in split view. The match is exact rather than by
proportion: each top-level block of the preview knows the line it starts on, and positions between blocks are
interpolated, so a tall code block or table does not throw the panes out of step. Both ends line up too.

### Math

`$x^2$` inline, `$$x^2$$` inside a paragraph, and a fence of `$$` on its own lines for a display formula. Typesetting
needs a library much larger than this package, so you bring one and pass the function that uses it:

```tsx
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Define it outside the component (or memoise it): the preview is rendered again when it changes.
const renderMath = (tex: string, displayMode: boolean) =>
  katex.renderToString(tex, { displayMode, output: 'html', throwOnError: false });

<MarkdownEditor value={value} onChange={setValue} renderMath={renderMath} />
```

Without `renderMath`, a dollar sign is just a dollar sign, so documents that did not ask for math are not changed.
What counts as a formula follows pandoc, so `costs $5 and $6` is left alone: no space just inside the dollar signs,
no digit right after the closing one, and `\$` is a dollar sign. Code is never read as math. A formula the
typesetter rejects is shown as written. The typeset HTML is sanitised against a short allowlist (spans, `svg`,
`path`, `line`, `g` and the attributes KaTeX uses): KaTeX's `output: 'html'` works, MathML output and custom-element
output (MathJax's `chtml`) do not.

## Ref

```tsx
const editor = useRef<MarkdownEditorHandle>(null);

<MarkdownEditor ref={editor} value={value} onChange={setValue} />

editor.current?.focus();
editor.current?.getValue();
editor.current?.insertText('![photo](https://example.com/photo.jpg)'); // at the cursor, replacing the selection
editor.current?.runCommand('table'); // what the toolbar button does
```

`insertText` and `runCommand` are one undo step each and return `false` when the editor is read-only or the surface
is `editorType="rich"`. Commands: `bold`, `italic`, `strikethrough`, `inlineCode`, `link`, `image`, `quote`,
`bulletList`, `orderedList`, `taskList`, `codeBlock`, `table`, `horizontalRule`.

## Labels

Every piece of text the editor shows or announces can be replaced; whatever you leave out stays English:

```tsx
<MarkdownEditor
  labels={{
    title: 'Markdown',
    source: 'Fuente',
    richText: 'Texto enriquecido',
    edit: 'Editar',
    split: 'Dividido',
    preview: 'Vista previa',
    enterFullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    commands: { bold: 'Negrita', italic: 'Cursiva', table: 'Tabla' },
  }}
/>
```

See `MarkdownEditorLabels` for the full list: the header, both switches, the toolbar's buttons and tooltips, the
heading menu, the preview's heading and empty state, the front matter and footnotes text, and the names read by
assistive technology. Not covered: the counts in the status bar, which `@editora/core` draws, and the toolbar of the
rich-text surface, which belongs to `@editora/react`.

## Styling

The editor reads the `--rte-*` variables of `@editora/themes`. `--md-fullscreen-z-index` (default `9999`) sets the
layer of the fullscreen editor, and the `md-` classes (`md-editor`, `md-preview`, `md-front-matter`, ...) are there
to restyle.

## Security

The preview and the rich pane are sanitised with `@editora/core`'s DOMPurify wrapper, so raw HTML in markdown
(`<img onerror>`, `<script>`, `javascript:` links) cannot run. Links in the preview open in a new tab with
`rel="noopener noreferrer"`. Typeset formulas are sanitised on their own, against a narrower list than the rest.
With no DOM (a server render) the preview renders nothing rather than unsanitised HTML, so render the component on
the client.

## Requirements

React 16.8 to 20. Depends on `@editora/light-code-editor`, `@editora/react`, `@editora/plugins` and `@editora/core`.
