<h1 align="center">@editora/react</h1>

<p align="center">
  A rich text editor for React: one component, a toolbar that comes from the plugins you choose, controlled or
  uncontrolled, with light and dark themes.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/react"><img src="https://img.shields.io/npm/v/@editora/react.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/react"><img src="https://img.shields.io/npm/dm/@editora/react.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/react.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/react"><img src="https://img.shields.io/npm/types/@editora/react.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/">Website</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/react/docs/images/document-editor.png" alt="The editor in a React page: a toolbar above a heading, a paragraph and an editable table, with a status bar showing the word count" width="900">
</p>

## Features

- **One component.** `<EditoraEditor />` gives you the editing area, the toolbar and an optional status bar.
- **Choose your plugins.** The toolbar is built from the plugins you pass in, so you ship only what you use. There are
  more than fifty in [`@editora/plugins`](https://www.npmjs.com/package/@editora/plugins): tables, lists, colours,
  code, math, comments, track changes and more.
- **Controlled or uncontrolled**, with `value` and `onChange`, or `defaultValue`. The value is HTML.
- **Themes.** Light, dark and acme, applied to everything inside an element with `data-theme`.
- **An imperative API** for the cases where state is not enough: read and replace the HTML, run commands.
- **Typed.** The props and the editor API are typed; the typings ship with the package.
- Tested with React 18 and 19 (the peer range is React 16.8 to 20). Server rendering needs one extra step; see [Next.js and server rendering](#nextjs-and-server-rendering).

## Install

```bash
npm install @editora/react @editora/core @editora/plugins @editora/themes
```

`@editora/core` is required. `@editora/plugins` (the toolbar items) and `@editora/themes` (the styles) are optional
peer dependencies, but you will want both.

## Quick start

```tsx
import { useState } from 'react';
import { EditoraEditor } from '@editora/react';
import {
  BoldPlugin,
  HeadingPlugin,
  HistoryPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  UnderlinePlugin,
} from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

// Create the plugins once, outside the component (or with useMemo), so the editor is not rebuilt on every render.
const plugins = [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  ListPlugin(),
  LinkPlugin(),
  HistoryPlugin(),
];

const toolbar = {
  items: ['undo', 'redo', 'heading', 'bold', 'italic', 'underline', 'link', 'bullist', 'numlist'],
};

export default function App() {
  const [html, setHtml] = useState('<h2>Launch briefing</h2><p>Start writing, or paste something in.</p>');

  return (
    <EditoraEditor
      value={html}
      onChange={setHtml}
      plugins={plugins}
      toolbar={toolbar}
      placeholder="Start writing..."
    />
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/react/docs/images/quick-start.png" alt="The quick-start editor: undo, redo, a heading menu, bold, italic, underline, a link and two list buttons, above a heading and a paragraph" width="900">
</p>

Import plugins from `@editora/plugins/lite`, not from `@editora/plugins`: the root entry bundles every plugin, so one
`BoldPlugin` from it costs about 125 KB gzipped, against about 24 KB from `lite` (see
[`@editora/plugins`](https://www.npmjs.com/package/@editora/plugins#choose-an-entry-point)).

## A full document editor

Add more plugins and the toolbar grows with them; it folds the buttons that do not fit into a menu. The options below
turn on the status bar, clean pasting, spell check, the accessibility checker and input sanitising.

```tsx
import { EditoraEditor } from '@editora/react';
import {
  BackgroundColorPlugin,
  BlockquotePlugin,
  BoldPlugin,
  ChecklistPlugin,
  ClearFormattingPlugin,
  HeadingPlugin,
  HistoryPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  StrikethroughPlugin,
  TablePlugin,
  TextAlignmentPlugin,
  TextColorPlugin,
  UnderlinePlugin,
} from '@editora/plugins/lite';
import { A11yCheckerPlugin, CommentsPlugin } from '@editora/plugins/enterprise';
import { CodeSamplePlugin } from '@editora/plugins/code-sample';
import { EmojisPlugin } from '@editora/plugins/emojis';
import { MathPlugin } from '@editora/plugins/math';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const plugins = [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin(),
  ListPlugin(),
  ChecklistPlugin(),
  LinkPlugin(),
  BlockquotePlugin(),
  HistoryPlugin(),
  ClearFormattingPlugin(),
  TextAlignmentPlugin(),
  TextColorPlugin(),
  BackgroundColorPlugin(),
  TablePlugin(),
  CodeSamplePlugin(),
  MathPlugin(),
  EmojisPlugin(),
  CommentsPlugin(),
  A11yCheckerPlugin(),
];

const initialHtml = `
  <h2>Quarterly business review</h2>
  <p>Revenue grew <strong>18%</strong> year on year. The numbers below feed the board summary.</p>
  <table>
    <tr><th>Region</th><th>Q1</th><th>Q2</th></tr>
    <tr><td>Europe</td><td>1.2M</td><td>1.4M</td></tr>
    <tr><td>Americas</td><td>2.1M</td><td>2.5M</td></tr>
  </table>
  <p>Next steps: confirm the forecast, then publish the report.</p>
`;

export default function DocumentEditor() {
  return (
    <EditoraEditor
      defaultValue={initialHtml}
      plugins={plugins}
      toolbar={{ sticky: true, showMoreOptions: true }}
      statusbar={{ enabled: true }}
      paste={{ clean: true, keepFormatting: true, convertWord: true }}
      spellcheck={{ enabled: true, provider: 'browser' }}
      accessibility={{ enableARIA: true, keyboardNavigation: true, checker: true }}
      security={{ sanitizeOnInput: true, sanitizeOnPaste: true }}
      content={{ minHeight: 260 }}
    />
  );
}
```

## Props

| Prop | Type | |
| --- | --- | --- |
| `value` | `string` | The HTML, for a controlled editor. Use it with `onChange`. |
| `defaultValue` | `string` | The starting HTML, for an uncontrolled editor. |
| `onChange` | `(html: string) => void` | Called with the HTML after every edit. |
| `plugins` | `Plugin[]` | The plugins to use. They decide what the toolbar offers. Create them once. |
| `pluginConfig` | `Record<string, unknown>` | Settings passed to plugins by name. |
| `toolbar` | `{ items?, sticky?, showMoreOptions? }` | `items` is a string such as `'undo redo \| bold italic'` or an array of names (see [Toolbar items](#toolbar-items)). `sticky` keeps the toolbar in view while the page scrolls, and `showMoreOptions` folds the buttons that do not fit into a menu. |
| `floatingToolbar` | `boolean \| { enabled? }` | A toolbar that appears next to the selected text. |
| `statusbar` | `{ enabled?, position? }` | A status bar with the cursor position and the word and character counts. `position` is `'top'` or `'bottom'`. |
| `readonly` | `boolean` | Shows the content without letting the user edit it. |
| `placeholder` | `string` | Text shown while the editor is empty. |
| `content` | `{ minHeight?, maxHeight?, autoHeight?, sanitize?, allowedTags?, allowedAttributes? }` | The size of the editing area, in pixels, and what HTML it keeps. With `autoHeight` the area grows with the content, up to `maxHeight`. |
| `paste` | `{ clean?, keepFormatting?, convertWord? }` | How pasted content is handled. |
| `security` | `{ sanitizeOnPaste?, sanitizeOnInput? }` | Sanitising of pasted and typed content. |
| `history` | `{ maxSteps?, debounceMs? }` | The undo history. |
| `language` | `{ locale?, direction? }` | The language, and `'ltr'` or `'rtl'` text. |
| `spellcheck` | `{ enabled?, provider?, apiUrl?, apiHeaders? }` | `provider` is `'browser'`, `'local'` or `'api'`. |
| `autosave` | `{ enabled?, intervalMs?, storageKey?, provider?, apiUrl? }` | Saves the content to `localStorage` or an API. |
| `accessibility` | `{ enableARIA?, keyboardNavigation?, checker? }` | ARIA attributes, keyboard navigation and the accessibility checker. |
| `performance` | `{ debounceInputMs?, viewportOnlyScan? }` | Input debouncing, and skipping work for editors that are off screen. |
| `media` / `mediaConfig` | `{ uploadUrl?, libraryUrl?, maxFileSize?, allowedTypes?, ... }` | Where images and video are uploaded and listed. |
| `onInit` | `(editor: EditorAPI) => void` | Called with the [editor API](#the-editor-api) once the editor is ready. |
| `onDestroy` | `() => void` | Called when the editor is removed. |
| `id`, `className` | `string` | Passed to the editor's container. |

`menubar` is accepted but nothing renders a menu bar yet.

## Toolbar items

`toolbar.items` picks and orders the buttons. A string separates groups with `|`; an array lists the names. A name
matches a plugin's button, so a plugin you did not pass in adds nothing. If none of the names match, the toolbar falls back to every button the plugins provide. These names work:

| Name | Plugin |
| --- | --- |
| `undo`, `redo` | `HistoryPlugin` |
| `bold`, `italic`, `underline`, `strikethrough` | the plugin of the same name |
| `heading` | `HeadingPlugin`: a menu for paragraph and the heading levels |
| `bullist`, `numlist`, `checklist` | `ListPlugin`, `ChecklistPlugin` |
| `link`, `anchor` | `LinkPlugin`, `AnchorPlugin` |
| `image`, `video` | `MediaManagerPlugin` |
| `table`, `blockquote`, `math`, `footnote` | the plugin of the same name |
| `codeblock`, `sourceview` | `CodeSamplePlugin`, `CodePlugin` |
| `textcolor`, `backgroundcolor` | `TextColorPlugin`, `BackgroundColorPlugin` |
| `fontsize`, `fontfamily`, `lineheight` | the plugin of the same name |
| `textalignment`, `indent`, `outdent`, `direction`, `capitalization` | the matching plugin |
| `clearformatting`, `formatpainter` | the matching plugin |
| `specialcharacters`, `pagebreak`, `fullscreen`, `preview`, `print` | the matching plugin |
| `comments`, `trackchanges`, `spellcheck`, `a11ychecker` | the matching plugin |
| `mergetag`, `mention`, `template`, `slashcommands`, `embediframe` | the matching plugin |

The same names work in the [plugin catalog](https://www.npmjs.com/package/@editora/plugins#plugin-catalog), which lists
the one for every plugin. A plugin's own command name also works: `openEmojiDialog` is the button of `EmojisPlugin`.

## The editor API

`onInit` hands you an `EditorAPI`. Keep it in a ref to read or change the content from outside React state:

```tsx
import { useRef, useState } from 'react';
import { EditoraEditor, type EditorAPI } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const plugins = [BoldPlugin(), ItalicPlugin(), HistoryPlugin()];

export default function WithEditorApi() {
  const editor = useRef<EditorAPI | null>(null);
  const [saved, setSaved] = useState('');

  return (
    <>
      <EditoraEditor
        defaultValue="<p>Select some text, then use the buttons below.</p>"
        plugins={plugins}
        onInit={(api) => {
          editor.current = api;
        }}
      />

      <button onClick={() => editor.current?.execCommand('toggleBold')}>Bold</button>
      <button onClick={() => editor.current?.setHTML('<p>Replaced from outside.</p>')}>Replace</button>
      <button onClick={() => setSaved(editor.current?.getHTML() ?? '')}>Read HTML</button>

      <pre>{saved}</pre>
    </>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/react/docs/images/editor-api.png" alt="An editor with bold text selected, three buttons under it, and the resulting HTML printed below" width="900">
</p>

| Method | |
| --- | --- |
| `getHTML()` / `setHTML(html)` | Read or replace the content. |
| `execCommand(name, value?)` | Run a command, as the toolbar does: `toggleBold`, `toggleItalic`, `toggleBulletList`, `insertTable`, `undo`, and so on. |
| `registerCommand(name, fn)` | Add your own command. |
| `onChange(fn)` | Subscribe to changes; returns an unsubscribe function. |
| `getState()` | The editor's state. |
| `focus()` / `blur()` / `destroy()` | Focus, blur, or tear the editor down. |

## Themes

Import the theme stylesheets you need, then put `data-theme` on any element around the editor:

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin, LinkPlugin, UnderlinePlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import '@editora/plugins/styles.css';

const plugins = [BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), LinkPlugin(), HistoryPlugin()];

// A theme applies to everything inside an element that carries data-theme.
export default function Themes() {
  return (
    <>
      <div data-theme="dark">
        <EditoraEditor defaultValue="<p>This editor follows the <strong>dark</strong> theme.</p>" plugins={plugins} />
      </div>

      <div data-theme="acme">
        <EditoraEditor defaultValue="<p>This one follows the <strong>acme</strong> theme.</p>" plugins={plugins} />
      </div>
    </>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/react/docs/images/themes.png" alt="Two editors: one in the dark theme, one in the acme theme with a pale blue toolbar" width="900">
</p>

## Next.js and server rendering

The editor needs the browser's DOM when its code is loaded, so it cannot be imported on the server. In Next.js a
`'use client'` file is still rendered on the server first, which fails with `HTMLElement is not defined`. Load the
editor on the client only, with `next/dynamic`:

```tsx
'use client';

import dynamic from 'next/dynamic';

// Editor.tsx is a client component that renders <EditoraEditor />, as in the quick start.
const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function Page() {
  return <Editor />;
}
```

This is checked with Next.js 15 and React 19. In other frameworks, do the same: import the editor only in code that
runs in the browser.

## Lower-level exports

For custom layouts the package also exports `Toolbar`, `EditorContent`, `InlineMenu`, `useKeyboardShortcuts` and
`mergeConfig`; see the typings. `EditoraEditor` is also exported as `RichTextEditor`.

## The rest of the family

| Package | |
| --- | --- |
| [`@editora/plugins`](https://www.npmjs.com/package/@editora/plugins) | More than fifty plugins for the toolbar. |
| [`@editora/themes`](https://www.npmjs.com/package/@editora/themes) | Light, dark and acme themes. |
| [`@editora/core`](https://www.npmjs.com/package/@editora/core) | The editor engine, and the `<editora-editor>` web component for any other framework. |
| [`@editora/markdown-editor`](https://www.npmjs.com/package/@editora/markdown-editor) | A markdown editor with a live preview. |

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
