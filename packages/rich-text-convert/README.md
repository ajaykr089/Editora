# @editora/rich-text-convert

Move content between rich-text editors. Converts **Tiptap / ProseMirror JSON, Lexical, Slate, Plate, Portable Text
(Sanity), Editor.js, HTML and Markdown** in any direction, and tells you exactly what could not be carried over
instead of silently dropping it. No dependencies, runs in Node and the browser, about 18 kB gzipped.

```js
import { convert } from '@editora/rich-text-convert';

const { output, warnings } = convert(tiptapJson, { to: 'lexical' });
// warnings: ['Lexical has no built-in image node; images were dropped (pass imageNodes: true if your editor registers one)']
```

The input format is detected when `from` is left out. JSON formats can be passed as objects or as JSON strings.

## Formats

| `from` / `to` | What it is |
| --- | --- |
| `html` | HTML (body content; scripts, styles and forms are ignored) |
| `markdown` | CommonMark + GFM: tables, task lists, `~~strike~~`; marks Markdown lacks are written as `<u>`, `<sub>`, `<sup>`, `<mark>` |
| `tiptap` | `editor.getJSON()` with StarterKit names (`bulletList`, `codeBlock`, `bold`...), plus Table, Image, TaskList, Subscript, Superscript, Highlight |
| `prosemirror` | `doc.toJSON()` with prosemirror-schema-basic, -list and -tables names (`bullet_list`, `code_block`, `strong`...) |
| `lexical` | `editor.getEditorState().toJSON()` with the rich-text, list, link, code and table nodes |
| `slate` | Slate value using the element names from Slate's examples (`heading-one`, `bulleted-list`, `check-list-item`...) |
| `plate` | Plate value (`p`, `h1`, `ul`/`li`/`lic`, `code_block`/`code_line`, `a`, `img`...) |
| `portable-text` | Sanity Portable Text blocks, spans, decorators and link `markDefs` |
| `editorjs` | Editor.js `save()` output: paragraph, header, list (nested and 1.x string lists), checklist, quote, code, delimiter, image, table, raw |
| `ast` | The shared document tree every conversion goes through |

## What gets reported

Every format can hold headings, paragraphs, bold/italic/code, links, lists and code blocks. Beyond that they differ,
and each difference becomes a warning:

| Target | Loses | Warning says |
| --- | --- | --- |
| Lexical | Images (no core image node; `lexical: { imageNodes: true }` writes them for your own ImageNode); blocks inside quotes and list items are joined | `Lexical has no built-in image node...` |
| ProseMirror basic schema | Underline, strike, sub/superscript, highlight; task-list checkboxes | `The basic ProseMirror schema has no "underline" mark...` |
| Markdown | Merged table cells; block content inside table cells | `...table...` |
| Portable Text | Checkboxes, list start numbers, inline images; rules, images and tables become blocks your schema must define | `Portable Text lists have no start number...` |
| Editor.js | Code language; merged cells; mixed bullet/numbered nesting | `The Editor.js code tool has no language...` |
| Slate / Plate | List start numbers; Plate checkboxes | `Slate lists have no start number...` |
| Any | Unknown nodes (mentions, callouts, embeds...) are unwrapped to their text or dropped | `Unsupported block "callout" was unwrapped` |

Repeated warnings are collapsed (`... (12 times)`), so the list stays readable for a whole site migration.

## API

```ts
convert(input, { from?, to, lexical?, editorjs? }): { output, warnings: string[] }
detectFormat(input): Format
read(input, from?): Doc            // to the shared tree
write(doc, to, options?): unknown  // from the shared tree
```

| Option | | |
| --- | --- | --- |
| `lexical.imageNodes` | `false` | Write `{ type: 'image', src, altText }` nodes |
| `lexical.horizontalRules` | `true` | Write `horizontalrule` nodes (HorizontalRuleNode from @lexical/react) |
| `editorjs.lists` | `'nested'` | `'strings'` writes @editorjs/list 1.x string items and a separate checklist block |

`read` + `write` let you change the content in between, for example rewriting image URLs during a migration:

```js
import { read, write } from '@editora/rich-text-convert';

const doc = read(post.body, 'portable-text');
const rewrite = (blocks) => blocks.forEach((block) => block.type === 'image' && (block.src = cdn(block.src)));
rewrite(doc.children);
const html = write(doc, 'html');
```

## CLI

```bash
npx @editora/rich-text-convert post.json --to markdown
npx @editora/rich-text-convert notes.md --to tiptap -o notes.json
cat state.json | npx @editora/rich-text-convert - --from lexical --to html --strict
```

Warnings go to stderr. `--strict` exits with code 1 when anything was lost, for migration scripts and CI.
`--lexical-images` and `--editorjs-strings` set the options above; `--help` lists everything.

## Tested against the real editors

Besides round-trip tests for every format, the output was checked against the editors themselves (Tiptap 3.32,
Lexical 0.53, Slate 0.120, @portabletext/to-html 6):

- Tiptap's schema accepts our JSON, and it equals what Tiptap's own HTML import produces from the same HTML.
- The ProseMirror basic + list + tables schema accepts our `prosemirror` JSON.
- Lexical parses our state and re-exports it unchanged; its HTML export of it reads back as the same document.
- Slate's normalizer leaves our `slate` and `plate` values unchanged.
- @portabletext/to-html renders our Portable Text to the same document.

Editor.js needs a browser to run, so its output is checked against its documented block formats only. If a
document from your editor converts wrongly, please open an issue with the JSON.

## License

MIT
