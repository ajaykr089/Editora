<h1 align="center">@editora/core</h1>

<p align="center">
  A rich text editor as a web component. Put <code>&lt;editora-editor&gt;</code> in plain HTML, Vue, Angular, Svelte or
  any other page, name the plugins you want, and only those load. Using React? See
  <a href="https://www.npmjs.com/package/@editora/react"><code>@editora/react</code></a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/core"><img src="https://img.shields.io/npm/v/@editora/core.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/core"><img src="https://img.shields.io/npm/dm/@editora/core.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/core.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/core"><img src="https://img.shields.io/npm/types/@editora/core.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/">Website</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/core/docs/images/web-component.png" alt="The editor in a page: a toolbar with undo, redo, headings, bold, italic, underline, colours, lists, quote, link and table, above a heading, a paragraph, a list and a table" width="900">
</p>

## Features

- **One element, any framework.** `<editora-editor>` is a standard custom element, so it works wherever HTML does.
- **Load only what you use.** List the plugins you want in the `plugins` attribute and only their code is fetched. The
  editor in the quick start below is about 64 KB gzipped, stylesheet included.
- **A real toolbar from a string.** `toolbar="undo redo | bold italic | link"`, or hide it altogether.
- **Plugins for the rest.** Tables, lists and checklists, colours, links, code, math, comments, track changes and more:
  see [`@editora/plugins`](https://www.npmjs.com/package/@editora/plugins).
- **Light and dark themes**, a read-only mode, an optional status bar, and an accessible name for the editing area.
- **Safe by default.** Content you set from JavaScript, and anything typed or pasted, is sanitised before it is
  kept (see [Security](#security)).
- Written in TypeScript; the typings ship with the package.

## Install

From a CDN, with no build step (pin a version in production: replace `@editora/core` with `@editora/core@1` in the
URLs below):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>
```

Or from npm, for a bundler such as Vite, webpack or esbuild:

```bash
npm install @editora/core
```

## Quick start

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>

<editora-editor
  height="320"
  plugins="heading bold italic underline list link history"
  toolbar="undo redo | heading | bold italic underline | bullist numlist | link"
  placeholder="Start writing..."
>
  <h2>Hello, Editora</h2>
  <p>This is a <strong>web component</strong>. Select some text and use the toolbar.</p>
</editora-editor>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/core/docs/images/quick-start.png" alt="The editor from the quick start: a toolbar with undo, redo, a paragraph menu, bold, italic, underline, lists and a link button, above a heading and a paragraph" width="900">
</p>

The content between the tags is the starting content. Put only HTML you trust there (see [Security](#security)); to load
anything else, call `setContent()`.

## Use it with a bundler

```ts
import '@editora/core/webcomponent'; // registers <editora-editor>
import '@editora/core/webcomponent.css';
```

Then use the element in your templates, in any framework:

```html
<editora-editor plugins="bold italic link history" toolbar="undo redo | bold italic | link"></editora-editor>
```

## Configure it

Set options as attributes:

| Attribute | |
| --- | --- |
| `plugins` | The plugins to load, separated by spaces (see [the plugin list](https://www.npmjs.com/package/@editora/plugins#plugin-catalog), column *Name*). |
| `toolbar` | The toolbar items, with `\|` between groups: `"undo redo \| bold italic"`. `"false"` hides the toolbar. |
| `height` | The height in pixels. Default `400`. |
| `width` | The width in pixels. By default the editor fills its parent. |
| `placeholder` | Text shown while the editor is empty. |
| `readonly` | `"true"` makes the content read-only. You can change it at any time. |
| `theme` | `light` (the default) or `dark`. Set the attribute again to switch. |
| `statusbar` | `"true"` shows a status bar. |
| `autofocus` | Focuses the editor when it loads. |
| `aria-label` | The accessible name of the editing area. |

The element has more attributes for autosave (`autosave-*`), spell check (`spellcheck-*`), pasting (`paste-*`),
language (`language-*`), accessibility (`accessibility-*`) and performance (`performance-*`). They are listed in the
element's `observedAttributes`, and they match the option groups of [`@editora/react`](https://www.npmjs.com/package/@editora/react#props).

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>

<!-- A short toolbar, the dark theme and a shorter editor -->
<editora-editor
  height="220"
  theme="dark"
  plugins="bold italic underline list link history"
  toolbar="undo redo | bold italic underline | bullist numlist | link"
  placeholder="Write a note..."
>
  <p>A compact editor for comments and notes.</p>
</editora-editor>

<!-- Read-only: formatted content that cannot be edited -->
<editora-editor height="140" readonly="true" plugins="bold italic" toolbar="false">
  <p>This content is <strong>read-only</strong>.</p>
</editora-editor>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/core/docs/images/themes.png" alt="A compact dark editor with a short toolbar, above a read-only editor with no toolbar" width="900">
</p>

The editor in the picture at the top of this page is configured like this:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>

<editora-editor
  height="440"
  plugins="heading bold italic underline blockquote list textColor backgroundColor link table history"
  toolbar="undo redo | heading | bold italic underline | textColor backgroundColor | bullist numlist | blockquote link table"
>
  <h2>Release notes</h2>
  <p>
    Editora is a <strong>web component</strong>, so it works the same in plain HTML, Vue, Angular and Svelte.
    Select some text to try the <em>toolbar</em>.
  </p>
  <ul>
    <li>Formatting, lists and links</li>
    <li>Tables you can edit in place</li>
  </ul>
  <table>
    <tr><th>Plan</th><th>Seats</th><th>Price</th></tr>
    <tr><td>Team</td><td>10</td><td>$49</td></tr>
    <tr><td>Business</td><td>50</td><td>$199</td></tr>
  </table>
</editora-editor>
```

You can also configure an editor from JavaScript with `editor.setConfig({ toolbar: 'bold italic', height: 300 })`.
To switch the theme at run time, set the attribute: `editor.setAttribute('theme', 'dark')`.

### Toolbar items

`toolbar` takes names separated by spaces, with `|` between groups. The names are camelCase and case-sensitive
(`textColor`, not `textcolor`), and each one needs its plugin in `plugins`:

| Name | Plugin |
| --- | --- |
| `undo`, `redo` | `history` |
| `bold`, `italic`, `underline`, `strikethrough` | the plugin of the same name |
| `heading` | `heading`: a menu for paragraph and the heading levels |
| `bullist`, `numlist`, `checklist` | `list`, `checklist` |
| `link`, `table`, `blockquote`, `math`, `emojis`, `fullscreen`, `preview` | the plugin of the same name |
| `textColor`, `backgroundColor`, `fontSize` | `textColor`, `backgroundColor`, `fontSize` |
| `direction` | `direction`: left-to-right and right-to-left buttons |
| `trackChanges`, `comments`, `a11yChecker` | the plugin of the same name |
| `mergeTags` | `mergeTag` |

A plugin's own command name works too, for example `insertMergeTag`. The full list of plugins, and the name each one is
loaded by, is in [`@editora/plugins`](https://www.npmjs.com/package/@editora/plugins#plugin-catalog).

## Read and write content

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>

<editora-editor id="editor" height="240" plugins="bold italic underline list history" toolbar="undo redo | bold italic underline | bullist numlist">
  <p>Edit me, then use the buttons.</p>
</editora-editor>

<button id="read">Read HTML</button>
<button id="replace">Replace</button>
<button id="bold">Bold</button>
<pre id="out"></pre>

<script type="module">
  const editor = document.getElementById('editor');
  const out = document.getElementById('out');

  // Fired when the toolbar and plugins are ready.
  editor.addEventListener('editor-ready', () => console.log('ready'));

  // Fired as the content changes (debounced). The HTML is in event.detail.html.
  editor.addEventListener('content-change', (event) => {
    out.textContent = event.detail.html;
  });

  document.getElementById('read').onclick = () => (out.textContent = editor.getContent());
  document.getElementById('replace').onclick = () => editor.setContent('<h2>Replaced</h2><p>From outside.</p>');
  document.getElementById('bold').onclick = () => editor.execCommand('toggleBold');
</script>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/core/docs/images/api.png" alt="An editor with the text Replaced and From outside, three buttons under it, and the HTML of the content printed below" width="900">
</p>

| Method | |
| --- | --- |
| `getContent()` | The content as clean HTML. |
| `setContent(html)` | Replaces the content. The HTML is sanitised first. |
| `execCommand(name)` | Runs a command, as the toolbar does: `toggleBold`, `toggleItalic`, `toggleBulletList`, `insertTable`, `undo`, and so on. Returns `true` if the command ran. |
| `focus()` / `blur()` | Moves the focus into or out of the editor. |
| `setConfig(options)` | Changes options at run time, such as `toolbar` or `height`. |
| `getAPI()` | The same methods as an object, plus `on(event, handler)`, `getConfig()` and `setReadonly(boolean)`. |

| Event | `event.detail` | |
| --- | --- | --- |
| `editor-ready` | | The editor has been built. It fires again if the editor is rebuilt, for example after you change `plugins` or `toolbar`. |
| `content-change` | `{ html }` | The content changed. It can fire more than once for the same HTML, so compare before you save. |
| `editor-focus` / `editor-blur` | | The editor gained or lost the focus. |
| `editor-destroy` | | The editor was torn down. |

## Choose a bundle

| File | Contains |
| --- | --- |
| `dist/webcomponent.js` | Every plugin. Each one is loaded only when you name it in `plugins`. |
| `dist/webcomponent-core.js` | Ten essentials: `bold`, `italic`, `underline`, `strikethrough`, `clearFormatting`, `heading`, `blockquote`, `code`, `list` and `history`. |

Each has its own stylesheet (`webcomponent.min.css`, `webcomponent-core.min.css`).

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent-core.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent-core.js"></script>

<editora-editor plugins="bold italic list history" toolbar="undo redo | bold italic | bullist numlist">
  <p>Only the essential plugins are available in this bundle.</p>
</editora-editor>
```

> [!WARNING]
> Always list the plugins you want. If you leave `plugins` out, **every** plugin in the bundle is loaded, including ones
> that need setup. The `collaboration` plugin, for example, syncs the document through a public Yjs demo server unless
> you give it your own server, so never leave it loaded by accident. See
> [`@editora/plugins`](https://www.npmjs.com/package/@editora/plugins#collaboration).

## Security

- `setContent()`, typing and pasting go through a sanitiser by default. Scripts, event-handler attributes such as
  `onerror`, and `javascript:` links are removed.
- **HTML written between the `<editora-editor>` tags is parsed by the browser before Editora sees it,** so a script or
  an `onerror` handler in it can run. Only put trusted HTML there, and load anything else with `setContent()`.
- The sanitisers are exported if you need them elsewhere: `sanitizeHTML`, `sanitizeInputHTML` and
  `sanitizePastedHTML`.

## TypeScript

The package ships its typings. The element is `RichTextEditorElement`; `EditorAPI` describes what `getAPI()` returns.

## The rest of the family

| Package | |
| --- | --- |
| [`@editora/react`](https://www.npmjs.com/package/@editora/react) | The editor as a React component. |
| [`@editora/plugins`](https://www.npmjs.com/package/@editora/plugins) | More than fifty plugins. |
| [`@editora/themes`](https://www.npmjs.com/package/@editora/themes) | Light, dark and acme themes. |
| [`@editora/light-code-editor`](https://www.npmjs.com/package/@editora/light-code-editor) | A small code editor. |
| [`@editora/markdown-editor`](https://www.npmjs.com/package/@editora/markdown-editor) | A markdown editor with a live preview. |

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
