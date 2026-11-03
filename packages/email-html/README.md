# @editora/email-html

Send what people write in a rich-text editor as an email. Takes the HTML from any editor (Editora, Tiptap, Lexical,
ProseMirror, Quill, CKEditor, a plain `contenteditable`) and returns **email-safe HTML** that holds up in Outlook,
Gmail and Apple Mail, a **plain-text version** for the text part, and **warnings** for anything email clients will
not show. No dependencies, runs in Node and the browser, about 10 kB gzipped.

```js
import { toEmailHtml } from '@editora/email-html';

const { html, text, warnings } = toEmailHtml(editor.getHTML(), {
  title: 'Weekly update',
  preheader: 'Three things that shipped this week',
});
// Send `html` and `text` with your email service; show `warnings` to the author before sending.
```

Today this takes a chain of tools (an inliner such as Juice, then hand-made tables and Outlook fixes). This is one
call, made for editor output.

## What it does

| Editor output | Email output |
| --- | --- |
| Styles in a stylesheet or none at all | Every block gets inline styles from a theme, including the font (Outlook does not inherit fonts from tables) |
| A page that flows to any width | A centred 600px column, with an Outlook-only fixed table because Outlook ignores `max-width`; full width on phones |
| `<blockquote>`, `<hr>`, `<pre>` | Table cells with borders and padding, which Outlook draws; code keeps its indentation with `&nbsp;`/`<br>` |
| `<a class="button">` alone in a paragraph | A bulletproof button: the padding and colour are on a table cell, so Outlook shows the full button |
| `<img>` with no size, or wider than the column | `width`/`height` attributes (Outlook needs them), scaled down to fit the column |
| `<p>` inside list items, task lists | Plain list items; ☑/☐ for checkboxes |
| `rem`, CSS variables | `px`, and the variable's fallback |
| Flexbox, grid, positioning, shadows, transforms | Removed, with a warning saying which clients ignore them |
| `<script>`, event handlers, `javascript:` links, forms | Removed |
| `<iframe>`/`<video>` | A link to the video |
| Editora merge tags | The bare token (`{{ first_name }}`) for your email service to fill in; tokens also work as link URLs |

It also writes the head every email needs: `x-apple-disable-message-reformatting`, Outlook's 96 DPI setting, the
Apple Mail and Gmail link fixes, `color-scheme`, and a hidden preheader padded so body text does not leak into the
inbox preview.

## Warnings

```js
[
  'Images without a width show at their natural size in Outlook; set width on the image',
  'Images need alt text: many clients block images until the reader allows them',
  'Relative link URLs do not work in email; pass baseUrl (found "/pricing")',
  'Gmail and Outlook block data: images; host the image and use its URL',
  'A button inside a line of text shows as a plain link in Outlook; put it in its own paragraph',
  'Flexbox and grid layouts are not supported by Outlook or Gmail; use tables for columns ("display" was removed)',
  'The email is 118 KB; Gmail clips messages over 102 KB behind a "View entire message" link',
]
```

Repeats are counted (`... (3 times)`), so the list stays short.

## Options

| Option | Default | |
| --- | --- | --- |
| `title` | `''` | The document title |
| `preheader` | none | The preview line inboxes show after the subject |
| `width` | `600` | Column width in px |
| `padding` | `32` | Space inside the column in px |
| `theme` | see below | Colours, fonts, spacing |
| `styles` | `{}` | Extra inline styles by simple selector: `{ '.lead': 'font-size:20px', 'a.button': 'background-color:#111' }` |
| `baseUrl` | none | Resolve relative links and image paths |
| `lang`, `dir` | `'en'`, `'ltr'` | |
| `fragment` | `false` | Return only the inlined content, for an email service's own template |

The result is `{ html, text, warnings, size }`; `size` is in bytes. `toEmailText(html)` returns just the plain text.

### Theme

```js
toEmailHtml(html, {
  theme: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    color: '#222222',
    linkColor: '#b3261e',
    background: '#eeeeee',        // behind the column
    contentBackground: '#ffffff', // the column
    buttonBackground: '#b3261e',
    buttonColor: '#ffffff',
    headingSizes: [32, 26, 21, 18, 16, 14],
  },
});
```

Also `fontSize`, `lineHeight`, `mutedColor`, `headingColor`, `borderColor`, `codeBackground`, `codeFontFamily`,
`buttonRadius` and `spacing`. Inline styles already on the content win over the theme.

## Buttons

Give a link `class="button"` (or `btn`, `role="button"`, `data-email-button`) and put it in its own paragraph. Its
`background-color` style, if any, colours the button; the paragraph's `text-align` aligns it.

```html
<p style="text-align:center"><a class="button" href="https://example.com/start">Get started</a></p>
```

## CLI

```bash
npx @editora/email-html newsletter.html -o email.html --text email.txt --preheader "This week"
cat body.html | npx @editora/email-html - --fragment --base-url https://example.com > inlined.html
```

Warnings go to stderr; `--strict` exits with code 1 when there are any. `--theme theme.json` takes the theme
options above.

## Tested

The test suite covers each transform. The output was also rendered in Chrome at desktop and phone widths. It has
**not** been run through Outlook, Gmail or Apple Mail by an email-testing service; the fixes follow those clients'
documented behaviour. If something renders wrongly in a client, please open an issue with the input HTML and the
client.

## License

MIT
