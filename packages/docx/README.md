# @editora/docx

Read and write Word `.docx` files, in the browser or Node, with **no dependencies** (about 17 kB gzipped, plus 4 kB
for the optional import/export UI). Both
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

## Import and export UI

`@editora/docx/ui` adds the pieces people use: drag a Word file onto the editor (or pick one), then see a short
report. Exporting downloads the file and shows the same kind of report. It works with any editor and any framework.

```js
import { createDocxImport, downloadDocx } from '@editora/docx/ui';
import { convert, read } from '@editora/rich-text-convert';

const importer = createDocxImport({
  dropTarget: editorElement,   // shows "Drop a Word file to import it" while a file is dragged over
  onImport: ({ doc }) => editor.setContent(convert(doc, { from: 'ast', to: 'html' }).output),
});
importButton.addEventListener('click', () => importer.open());

saveButton.addEventListener('click', () => downloadDocx(read(editor.getContent(), 'html'), 'Report.docx', { title: 'Report' }));
```

- **The report says what matters.** Content that could not be kept (charts, comments...) is listed. Formatting that
  was simplified (font sizes, colours, alignment) and structure that was added (headings, lists) get one short line
  each, so a clean import of a plain file does not look like a failure.
- **Errors are plain.** Wrong file types, old `.doc` files, password-protected or damaged files and files that are
  too large each get a sentence that says what to do.
- **Accessible.** Errors are announced as alerts and results as status messages. Every card can be closed with its
  button or Escape. The drop overlay is hidden from screen readers, because the picker does the same job.
- **Fits in.** Light and dark themes follow the page (`prefers-color-scheme`, or `data-theme="dark"`), the layout
  works on phones, and motion is turned off for `prefers-reduced-motion`. Theme it with `--docx-ui-*` custom
  properties, translate it with `labels`, or pass `injectStyles: false` and use the exported `docxUiCss` under a
  strict content security policy.
- `showDocxReport()` and `summarizeWarnings()` are exported for building your own UI.

Success cards close by themselves; cards with warnings stay until dismissed. Only file drops are taken over: text
and HTML dropped on the editor still reach it.

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

Lists that use list styles (`numStyleLink`, common in company templates), numbering inherited from paragraph
styles, and level overrides that restart or reformat a list are all followed.

Reported in `warnings` rather than dropped silently: text colours, font sizes and alignment, page breaks, charts,
SmartArt, shapes, embedded objects, equations (kept as text), comments, headers and footers, and EMF/WMF images,
which browsers cannot show.

```js
const { doc } = await readDocx(bytes, {
  image: async ({ data, contentType, path }) => (await upload(new Blob([data], { type: contentType }))).url,
  trackedChanges: 'accept',      // or 'reject'
  keepEmptyParagraphs: false,    // Word files often use empty paragraphs for spacing
  inferStructure: true,
  maxSize: 100 * 1024 * 1024,              // largest file accepted
  maxUncompressedSize: 500 * 1024 * 1024,  // most it may expand to
});
```

### Errors and limits

Files that cannot be read throw a `DocxError` with a message you can show, and a `code`:

| `code` | When |
| --- | --- |
| `not-docx` | Not a ZIP file, or an Excel or PowerPoint file (the message says which) |
| `legacy-or-encrypted` | A Word 97-2003 `.doc` file, or a password-protected document |
| `too-large` | Over `maxSize`, or expanding past `maxUncompressedSize` |
| `corrupt` | Damaged or cut short. The original error is kept as `cause` |

Only the parts that are read get decompressed (the document, styles, numbering, notes and images), and each stops
as soon as the total passes `maxUncompressedSize`. A "zip bomb" is rejected without filling memory, and large
embedded files that are not read cost nothing.

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

- **Round trips:** for every block and mark the document tree has, writing a `.docx` and reading it back gives the
  same document. The same input always gives the same bytes.
- **Schema:** the document, styles, numbering and settings parts, the content types, the relationships and the
  app properties validate against the official ISO/IEC 29500 transitional and OPC schemas (`xmllint`). That covers
  drawings, nested tables, merged cells, deep lists, Unicode and emoji. (`core.xml` was not checked, because its
  schema imports the Dublin Core schemas from the web.)
- **Other tools reading our files:** mammoth reads them as the same document, except list start numbers, which
  mammoth never outputs. macOS `textutil` opens all of them.
- **Our reader on other tools' files:** files from the `docx` library (numbering, footnotes, merges, tracked
  changes, images) and from macOS `textutil` (no styles at all). Hand-written Word markup covers list styles, level
  overrides, `HYPERLINK` and other fields, content controls, symbols and bookmarks.
- **Damaged files:** 150 files with random byte damage, plus files cut short at many points, all either read or
  throw a `DocxError`, never anything else.
- **Size:** a 100-page report (1,650 blocks) is written in about 0.2 s and read in about 0.4 s on a laptop.
- **Browser:** the demo imports and exports with a real Editora editor in Chrome, including drag and drop, error
  cards, Escape to close, dark mode and phone width. The UI also has jsdom tests.

**Not yet done:** opening the files in Microsoft Word, LibreOffice and Google Docs. To check them, run

```bash
npm run build -w @editora/docx -w @editora/rich-text-convert
node packages/docx/scripts/make-samples.mjs
```

and open the six files in `packages/docx/samples-out/`. For each one, check that it opens without a repair prompt;
headings appear in the navigation pane; lists renumber when you add an item; links open; images show at a sensible
size; and merged table cells and the header row look right. Please report any file that reads or opens wrongly,
with the file attached.

## Demo

```bash
npm run build -w @editora/docx -w @editora/rich-text-convert
node packages/docx/demo/server.mjs   # http://localhost:5196
```

## License

MIT
