# @editora/content-a11y

Accessibility checks for the content people **write**: alt text, headings, link text, lists, tables, colour contrast
and more, each mapped to WCAG 2.2, with fixes. It runs in any editor (problems appear next to the content), on a
server, and in CI, so inaccessible content is caught before it is published. No dependencies; about 13 kB gzipped.

Page scanners such as axe check the whole rendered page and the code around it. This checks the part authors control,
in the editor, and explains each problem in plain words.

```js
import { checkContent, fixContent } from '@editora/content-a11y';

const { issues, errors } = checkContent(html, { minHeadingLevel: 2 });
// issues: [{ rule, severity, level, wcag, message, help, element, snippet, fixes }]

const { html: fixed, applied } = fixContent(html); // only the fixes that are safe without looking
```

## Rules

| Rule | Checks | WCAG | Fix |
| --- | --- | --- | --- |
| `image-alt-missing` | Images without alt text | 1.1.1 A | write alt text / mark decorative |
| `image-alt-filename` | Alt text that is a file name or "image", "photo"... | 1.1.1 A | write alt text / mark decorative |
| `image-alt-redundant` | Alt text starting "Image of..." | best practice | **auto**: drop the prefix |
| `image-alt-long` | Alt text over 150 characters | best practice | rewrite |
| `image-link-alt` | Linked images with no alt, so the link has no name | 2.4.4 A | say where the link goes |
| `iframe-title` | Embeds (videos, maps) without a title | 4.1.2 A | add a title |
| `media-captions` | Videos without a captions track | 1.2.2 A | |
| `link-empty` | Links with no text | 2.4.4 A | **auto**: remove the empty link |
| `link-generic-text` | "click here", "read more", "here"... | 2.4.4 A | rewrite the link text |
| `link-url-text` | Long web addresses as link text | best practice | use a description |
| `link-new-window` | Links that open a new tab without saying so | 3.2.5 AAA | add "(opens in a new tab)" / same tab |
| `link-file-type` | Links to PDF, Word, Excel... without the file type | best practice | add "(PDF)" |
| `link-same-text` | The same link text going to different places | 2.4.9 AAA | |
| `heading-empty` | Empty headings | 1.3.1 A | **auto**: remove |
| `heading-skip` | Skipped heading levels (h2 then h4) | 1.3.1 A | change the level |
| `heading-too-high` | Headings above the content's starting level (with `minHeadingLevel`) | best practice | change the level |
| `heading-fake` | Short bold paragraphs used as headings | 1.3.1 A | make it a heading |
| `heading-long` | Headings over 160 characters | best practice | make it a paragraph |
| `list-fake` | Lines typed with "-" or "1." instead of a list | 1.3.1 A | make it a list |
| `table-headers` | Data tables without header cells | 1.3.1 A | make the first row the header |
| `table-empty-header` | Empty header cells | 1.3.1 A | |
| `text-contrast` | Text colours set in the content with too little contrast | 1.4.3 AA | nearest passing colour |
| `text-all-caps` | Long runs of capital letters | best practice | sentence case |
| `text-underline` | Underlined text that is not a link | best practice | remove the underline |
| `empty-paragraphs` | Empty paragraphs used for spacing | best practice | **auto**: remove |

**Fixes.** `auto` fixes are safe without looking, and are the only ones `fixContent()` applies unless you pass
`kinds: ['auto', 'suggested']`. Fixes that need words from a person (alt text, link text) take them as input, and
fixes that depend on what the content means (marking an image decorative, opening a link in the same tab) are only
ever applied by a person; never in bulk.

**Contrast** is checked for colours set in the content itself (inline styles from an editor's colour picker). Colours
from your theme are the theme's job; pass `background` if your content sits on a non-white background.

## In an editor

```js
import { attachContentChecker } from '@editora/content-a11y';

const checker = attachContentChecker(document.querySelector('#editor'), {
  minHeadingLevel: 2,
  onChange: ({ errors, warnings }) => updateBadge(errors + warnings),
  onFix: ({ beforeHTML }) => history.record(beforeHTML), // for your undo stack
});
```

Markers appear next to each problem without changing the content's HTML. A marker opens the explanation, the WCAG
criterion and the fixes; <kbd>Escape</kbd> closes it and arrow keys move between markers. It re-checks as people type.

### Editora

```js
import { ContentA11yPlugin } from '@editora/content-a11y/editora';

editor.setConfig({
  plugins: ['heading', 'bold', 'link', 'table', 'history', ContentA11yPlugin({ minHeadingLevel: 2 })],
  toolbar: 'undo redo | heading bold link table | toggleContentA11y',
});
```

The toolbar button shows the number of problems and turns the markers on. Every fix is one undo step. Commands:
`toggleContentA11y`, `fixContentA11y` (apply the safe fixes), `getContentA11yResult`.

## In CI

```bash
npm i -D @editora/content-a11y jsdom
npx content-a11y content/ --min-heading 2            # exits 1 on errors
npx content-a11y content/ --fix                      # apply the safe fixes in place
npx content-a11y page.html --json > a11y-report.json
cat body.html | npx content-a11y - --fail-on warning
```

Options: `--fix`, `--fix-suggested`, `--json`, `--min-heading <n>`, `--fail-on error|warning|none`,
`--rule <id>=off|error|warning|info` (repeatable). Folders are searched for `.html` files. Full documents keep their
`<head>` when fixed.

On a server, `checkContent` needs an HTML parser for strings: `checkContent(html, { parse: (h) => new JSDOM(h).window.document })`.

## Options

| Option | Default | |
| --- | --- | --- |
| `minHeadingLevel` | none | Where the content's headings start. Pass 2 when the page title is the h1 |
| `rules` | | `{ 'text-all-caps': 'off', 'link-new-window': 'error' }` |
| `maxAltLength` | 150 | |
| `background` | `#ffffff` | The page background behind the content, for contrast |
| `genericLinkText` | | More phrases to treat as meaningless link text |
| `fileTypes` | pdf, doc(x), xls(x), ppt(x), odt, zip | |
| `messages` | | Replace a rule's message (e.g. to translate) |
| `parse` | `DOMParser` | |

## Demo

```bash
npm run build -w @editora/core && npm run build -w @editora/content-a11y
node packages/content-a11y/demo/server.mjs   # http://localhost:5196
```

## License

MIT
