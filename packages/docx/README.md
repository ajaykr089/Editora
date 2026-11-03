# @editora/docx

Read and write Word `.docx` files, in the browser or Node, with **no dependencies** (about 16 kB gzipped). Both
directions use one document tree, so a Word file comes out as real headings, nested numbered lists, links, images
and merged table cells, and goes back into Word the same way. Anything that cannot be carried over is listed in
`warnings`.

Together with [@editora/rich-text-convert](../rich-text-convert) it converts Word files to and from Tiptap,
ProseMirror, Lexical, Slate, Plate, Portable Text, Editor.js, HTML and Markdown.

```js
import { readDocx, writeDocx } from '@editora/docx';
import { convert, read } from '@editora/rich-text-convert';

// Word -> your editor
const { doc, warnings } = await readDocx(await file.arrayBuffer());
editor.commands.setContent(convert(doc, { from: 'ast', to: 'tiptap' }).output);

// Your editor -> Word
const { data } = await writeDocx(read(editor.getJSON(), 'tiptap'), { title: 'Report' });
download(new Blob([data]), 'report.docx');
```

Before this you needed two libraries, one per direction (mammoth to read, docx to write), and an HTML step in the
middle.

## Reading

| In the Word file | In the document tree |
| --- | --- |
| Heading 1–6 and Title styles, custom styles based on them, outline levels | Headings |
| Numbered and bulleted lists, nested, with start numbers and restarts (also from list styles) | Nested lists |
| Bold, italic, underline, strike, subscript, superscript, highlight; Strong/Emphasis styles; monospace fonts | Marks (monospace becomes code) |
| Hyperlinks, including `HYPERLINK` fields and links to bookmarks | Links |
| Quote and code paragraph styles | Quotes and code blocks |
| Tables with header rows, `gridSpan` and vertical merges | Tables with colspan and rowspan |
| Inline images, with alt text and title | Images (`data:` URLs, or your own URLs via `image`) |
| Footnotes and endnotes | Superscript numbers, with the notes as a numbered list at the end |
| Tracked changes | Accepted (or rejected, with `trackedChanges: 'reject'`) |
| Text boxes, content controls, smart tags | Their content |
| ☐/☑ at the start of list items | Task-list checkboxes |

Files with no structure at all (from Pages, TextEdit, or written by hand) get it inferred: typed bullets and numbers
followed by a tab become real lists, and in a document with no heading styles, short bold paragraphs set larger than
the body text become headings. The warnings say when this happened; `inferStructure: false` turns it off.

Reported in `warnings` rather than dropped silently: text colours, font sizes and alignment, page breaks, charts,
SmartArt, shapes, embedded objects, equations (kept as text), comments, headers and footers, and EMF/WMF images,
which browsers cannot show.

```js
const { doc } = await readDocx(bytes, {
  image: async ({ data, contentType, path }) => (await upload(new Blob([data], { type: contentType }))).url,
  trackedChanges: 'accept',      // or 'reject'
  keepEmptyParagraphs: false,    // Word files often use empty paragraphs for spacing
  inferStructure: true,
});
```

## Writing

```js
const { data, warnings } = await writeDocx(doc, {
  title: 'Quarterly report',
  author: 'Finance',
  page: 'a4',                    // or 'letter' (default)
  font: 'Calibri',
  fontSize: 11,
  lang: 'en-GB',
  loadImage: async (src) => new Uint8Array(await (await fetch(src)).arrayBuffer()),
});
```

The file uses Word's own built-in styles, so it looks and behaves like a document written in Word. Headings use the
Heading 1–6 styles (they appear in the navigation pane and the table of contents). Lists are real Word numbering
that renumbers when items move. Links work, and images are embedded at their real size, scaled to fit the page.
Tables have a repeating header row and merged cells. Quotes, code and code spans use their own styles, and a rule is
a bordered paragraph.

Images are loaded from `data:` URLs, and from http(s) URLs with `fetch`; pass `loadImage` to load them yourself. An
image that cannot be loaded is written as its alt text, with a warning. SVG images are left out (convert them to PNG).
Code-block languages are not kept, because Word has nowhere to store them; the warning says so.

## CLI

```bash
npx @editora/docx report.docx --to markdown -o report.md
npx @editora/docx report.docx --to html --images ./images -o report.html
npx @editora/docx notes.md -o notes.docx --title "Notes"
```

Formats other than `ast` need `@editora/rich-text-convert` installed next to it. Warnings go to stderr; `--strict`
exits with code 1 when anything was lost.

## Tested

- Round trips: the document tree written to `.docx` and read back is unchanged, for every block and mark the tree
  has.
- Files from other tools: files made by the `docx` library (numbering, footnotes, merges, tracked changes, images)
  and by macOS `textutil` are read in the test suite.
- Our files read by other tools: mammoth reads our output as the same document, apart from list start numbers,
  which mammoth never writes. macOS `textutil` (Apple's text system) opens our files with all their text, lists and
  tables.
- In a browser: the demo reads and writes files in Chrome, fetching images over the network.

It has **not** been opened in Microsoft Word or LibreOffice for these tests. The files follow the Office Open XML
schema's element order, and use only basic, widely supported markup. If a file reads or opens wrongly, please open
an issue with the file.

## Demo

```bash
npm run build -w @editora/docx -w @editora/rich-text-convert
node packages/docx/demo/server.mjs   # http://localhost:5196
```

## License

MIT
