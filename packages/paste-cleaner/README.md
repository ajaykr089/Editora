# @editora/paste-cleaner

Clean what people paste into your editor. Content from Word, Google Docs, Google Sheets, Excel, Pages, TextEdit,
web pages and VS Code comes out as plain semantic HTML with **real lists, headings and tables**, and Markdown or plain
text gets structure too. Works with any editor; no dependencies; about 11 kB gzipped.

```js
import { cleanPaste } from '@editora/paste-cleaner';

const { html, source, warnings } = cleanPaste({ html: clipboardHtml, text: clipboardText });
// source: 'word' | 'word-online' | 'google-docs' | 'google-sheets' | 'excel' | 'apple' | 'web' | 'vscode' | 'markdown' | 'plain' ...
```

## What it fixes

| From | Problem | Result |
| --- | --- | --- |
| Word | Lists are flat paragraphs with `mso-list` styles and fake `·` bullets | Nested `<ul>`/`<ol>`, with bullet vs number from Word's own list definitions |
| Word | `<o:p>`, `Mso*` classes, VML shapes, blank-line paragraphs, tracked changes | Removed; tracked changes accepted |
| Word | Images point at `file:///C:/.../clip_image001.png` | Dropped and reported in `warnings` / `images` |
| Word for the web | Every list item is its own list | One nested list |
| Google Docs | The whole paste is wrapped in `<b style="font-weight:normal">`; bold and italic are inline styles | Wrapper removed; `<strong>`, `<em>`, `<u>`, `<s>`, `<sup>`, `<sub>` |
| Google Docs | Nested lists sit directly inside the parent list; links go through `google.com/url?q=` | Proper nesting; the real link |
| Sheets, Excel | Tables full of widths, number formats and stylesheet classes | Clean `<table>`; a bold first row becomes `<thead>`; right-aligned numbers stay right-aligned |
| Pages, TextEdit | Headings are just bigger text set in a `<style>` block | Real headings |
| Web pages | Every element carries computed inline styles | Clean tags |
| VS Code | One `<div>` per line with coloured spans | One `<pre><code>` block |
| Markdown | `## Heading`, `- lists`, tables, code fences shown as literal text | Headings, nested lists, tables, code blocks, links |

Everything is sanitized against an allow-list: no scripts, event handlers, `javascript:`/`data:` links, frames, forms,
SVG or style sheets get through. Only `href`, `src`, `alt`, `width`/`height`, `colspan`/`rowspan`, `start` and (when
kept) `text-align` and colours survive.

## Any contenteditable

```js
import { attachPasteCleaner } from '@editora/paste-cleaner';

const cleaner = attachPasteCleaner(document.querySelector('#editor'), {
  onPaste: ({ source, warnings }) => warnings.forEach(showToast),
  uploadImage: async (blob) => (await upload(blob)).url, // optional: pasted screenshots and data: images
});
```

Pasting blocks into the middle of a paragraph splits it, and the first and last pasted paragraphs join the text around
the caret. The browser's own undo keeps working. <kbd>Shift</kbd>+<kbd>Ctrl/⌘</kbd>+<kbd>V</kbd> pastes plain text.

## Editora

```js
import { PasteCleanerPlugin } from '@editora/paste-cleaner/editora';

editor.setConfig({ plugins: ['heading', 'bold', 'list', 'table', 'history', PasteCleanerPlugin()] });
```

Use it instead of `smartPaste`. Each paste is one undo step.

## Tiptap and ProseMirror

Run pasted HTML through `cleanPaste` before the editor parses it:

```js
new Editor({ editorProps: { transformPastedHTML: (html) => cleanPaste(html).html } }); // Tiptap
new EditorView(node, { state, transformPastedHTML: (html) => cleanPaste(html).html }); // ProseMirror
```

Other editors: call `cleanPaste` wherever they let you intercept pasted HTML.

## Options

| Option | Default | |
| --- | --- | --- |
| `keepColors` | `false` | Keep text and highlight colours |
| `keepAlignment` | `true` | Keep centred / right / justified text |
| `keepTables` | `true` | `false` turns rows into paragraphs |
| `keepImages` | `true` | |
| `allowDataImages` | `true` | Inline `data:image/png...` images (SVG is never allowed) |
| `keepLinks` | `true` | |
| `inferHeadings` | `true` | Short, large paragraphs become `h1`–`h3` when the source styled headings by size |
| `detectHeaderRows` | `true` | A fully bold first table row becomes a header row |
| `markdown` | `true` | Convert plain text that is clearly Markdown |
| `linkify` | `true` | Link bare URLs in plain text |
| `plainText` | `false` | Paragraphs and line breaks only |
| `parse` | `DOMParser` | On a server, pass one from jsdom or linkedom: `parse: (html) => new JSDOM(html).window.document` |

The result also has `text` (a plain-text version), `inline` (true for a phrase pasted mid-sentence), and `images`
(every image with `kept` or the reason it was dropped).

## Tested on

The test suite cleans one clipboard sample per source. The Pages/TextEdit sample is a real capture (macOS
`textutil`); the Word, Word for the web, Google Docs, Sheets, Excel, Chrome and VS Code samples are written to match
those apps' documented clipboard markup. If a paste from your app comes out wrong, please open an issue with its
`text/html` (any clipboard inspector shows it).

## Demo

```bash
npm run build -w @editora/core && npm run build -w @editora/paste-cleaner
node packages/paste-cleaner/demo/server.mjs   # http://localhost:5193
```

## License

MIT
