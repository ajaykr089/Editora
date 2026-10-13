<h1 align="center">@editora/plugins</h1>

<p align="center">
  Fifty-six plugins for the Editora editor: formatting, tables, math, comments, track changes, document import and
  export, and more. Pick the ones you need and the toolbar is built from them.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/plugins"><img src="https://img.shields.io/npm/v/@editora/plugins.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/plugins"><img src="https://img.shields.io/npm/dm/@editora/plugins.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/plugins.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/plugins"><img src="https://img.shields.io/npm/types/@editora/plugins.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/">Website</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/plugins/docs/images/table.png" alt="An editor with a freshly inserted table and the floating table toolbar above it, for adding and removing rows and columns" width="900">
</p>

## What you get

- **A plugin per feature.** Bold, headings, lists, links and tables; fonts and colours; code blocks and math; comments,
  track changes and approval workflows; Word and PDF export. [The full catalog](#plugin-catalog) lists all 56.
- **The toolbar follows your plugins.** Each plugin adds its own buttons, dialogs and shortcuts.
- **Three ways to import**, from the whole catalog down to a single plugin, so you can keep your bundle small
  ([measured below](#choose-an-entry-point)).
- **For React and for the web component.** The same plugins run in
  [`@editora/react`](https://www.npmjs.com/package/@editora/react) and in the `<editora-editor>` element of
  [`@editora/core`](https://www.npmjs.com/package/@editora/core).
- MIT licensed and typed; the typings ship with the package.

## Install

```bash
npm install @editora/plugins @editora/core @editora/react @editora/themes
```

Import the plugin styles once, next to a theme. They style the dialogs, pickers and the table toolbar:

```ts
import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';
```

## Quick start

A plugin is a function. Call it, put the result in the `plugins` array of the editor, and name the buttons you want in
`toolbar.items`:

```tsx
import { EditoraEditor } from '@editora/react';

// 1. The common plugins, in one small entry point.
import { BoldPlugin, HeadingPlugin, HistoryPlugin, LinkPlugin, TablePlugin } from '@editora/plugins/lite';
// 2. Advanced plugins: review, workflow and structured authoring.
import { TrackChangesPlugin } from '@editora/plugins/enterprise';
// 3. A single plugin, and nothing else.
import { MathPlugin } from '@editora/plugins/math';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const plugins = [
  HeadingPlugin(),
  BoldPlugin(),
  LinkPlugin(),
  TablePlugin(),
  MathPlugin(),
  TrackChangesPlugin({ author: 'Ava Miller' }),
  HistoryPlugin(),
];

export default function EntryPoints() {
  return (
    <EditoraEditor
      defaultValue="<p>Import from the smallest entry point that has what you need.</p>"
      plugins={plugins}
      toolbar={{ items: 'undo redo | heading bold link | table math | trackchanges' }}
    />
  );
}
```

Create the plugins once, outside the component or with `useMemo`, so the editor is not rebuilt on every render.

## Choose an entry point

| Import from | You get | Cost of importing one plugin from it |
| --- | --- | --- |
| `@editora/plugins/<subpath>` | One plugin, such as `@editora/plugins/bold`. | `BoldPlugin`: 3 KB (1 KB gzipped)<br>`TrackChangesPlugin`: 20 KB (5 KB gzipped) |
| `@editora/plugins/lite` | The 27 common plugins: formatting, lists, links, tables, colours, fonts, history. | `BoldPlugin`: 83 KB (24 KB gzipped) |
| `@editora/plugins/enterprise` | The 22 advanced plugins: review, workflow, structured authoring, import and export. | `TrackChangesPlugin`: 256 KB (77 KB gzipped) |
| `@editora/plugins` | All 56 plugins. | `BoldPlugin`: 447 KB (125 KB gzipped)<br>`TrackChangesPlugin`: 467 KB (129 KB gzipped) |

The last column is measured with esbuild, as minified ES modules, importing that one plugin and nothing else; a
bundler of your own may differ a little. The point is that **the entry points do not tree-shake**: importing one plugin
from `@editora/plugins`, `lite` or `enterprise` bundles everything that entry exports. Six common plugins (bold, italic,
headings, lists, links, history) cost 127 KB gzipped from the root and 27 KB from `lite`. Import from `lite` for the
common ones, and from a subpath for anything else.

## Plugin catalog

Every plugin is a function with the same name, available from the root entry and from its own subpath. **Entry** says
which entry point also has it. **Toolbar item** is the name to use in `toolbar.items` of the React editor. **Name** is
what you write in the `plugins` attribute of `<editora-editor>`.

| Plugin | What it adds | Toolbar item | Entry | Subpath | Name |
| --- | --- | --- | --- | --- | --- |
| `A11yCheckerPlugin` | Accessibility checker panel | `a11ychecker` | `enterprise` | `a11y-checker` | `a11yChecker` |
| `AnchorPlugin` | Named anchors to link to | `anchor` | `lite` | `anchor` | `anchor` |
| `ApprovalWorkflowPlugin` | Approval workflow: request a review and track it | `approvalworkflow` | `enterprise` | `approval-workflow` | `approvalWorkflow` |
| `BackgroundColorPlugin` | Background (highlight) colour | `backgroundcolor` | `lite` | `background-color` | `backgroundColor` |
| `BlockquotePlugin` | Block quotes | `blockquote` | `lite` | `blockquote` | `blockquote` |
| `BlocksLibraryPlugin` | A library of reusable content blocks | `blockslibrary` | `enterprise` | `blocks-library` | `blocksLibrary` |
| `BoldPlugin` | Bold | `bold` | `lite` | `bold` | `bold` |
| `CapitalizationPlugin` | Change the case of the selected text | `capitalization` | `lite` | `capitalization` | `capitalization` |
| `ChecklistPlugin` | Checklists (task lists) | `checklist` | `lite` | `checklist` | `checklist` |
| `CitationsPlugin` | Citations panel | `citations` | `enterprise` | `citations` | `citations` |
| `ClearFormattingPlugin` | Clear formatting | `clearformatting` | `lite` | `clear-formatting` | `clearFormatting` |
| `CodePlugin` | Source (HTML) view | `sourceview` |  | `code` | `code` |
| `CodeSamplePlugin` | Code blocks | `codeblock` |  | `code-sample` | `codeSample` |
| `CollaborationPlugin` | Real-time collaboration through a y-websocket server (Yjs); see [Collaboration](#collaboration) |  | `enterprise` | `collaboration` | `collaboration` |
| `CommentsPlugin` | Comments on selected text | `comments` | `enterprise` | `comments` | `comments` |
| `ConditionalContentPlugin` | Content shown only for certain audiences or locales | `conditionalcontent` | `enterprise` | `conditional-content` | `conditionalContent` |
| `ContentRulesPlugin` | Content rules: banned words, required headings, readability | `contentrules` | `enterprise` | `content-rules` | `contentRules` |
| `DataBindingPlugin` | Fields bound to your data by key, such as `user.firstName` | `databinding` | `enterprise` | `data-binding` | `dataBinding` |
| `DirectionPlugin` | Left-to-right and right-to-left text | `direction` | `lite` | `direction` | `direction` |
| `DocSchemaPlugin` | Validate a document against a structure | `docschema` | `enterprise` | `doc-schema` | `docSchema` |
| `DocumentManagerPlugin` | Import Word documents; export Word and PDF | `importword` `exportword` `exportpdf` | `enterprise` | `document-manager` | `document-manager` |
| `EmbedIframePlugin` | Embed an iframe | `embediframe` |  | `embed-iframe` | `embedIframe` |
| `EmojisPlugin` | Emoji picker | `openEmojiDialog` |  | `emojis` | `emojis` |
| `FontFamilyPlugin` | Font family | `fontfamily` | `lite` | `font-family` | `fontFamily` |
| `FontSizePlugin` | Font size | `fontsize` | `lite` | `font-size` | `fontSize` |
| `FootnotePlugin` | Footnotes | `footnote` | `lite` | `footnote` | `footnote` |
| `FormatPainterPlugin` | Copy formatting from one place to another | `formatpainter` |  | `format-painter` | `formatPainter` |
| `FullscreenPlugin` | Fullscreen | `fullscreen` | `lite` | `fullscreen` | `fullscreen` |
| `HeadingPlugin` | Paragraph and heading levels | `heading` | `lite` | `heading` | `heading` |
| `HistoryPlugin` | Undo and redo | `undo` `redo` | `lite` | `history` | `history` |
| `IndentPlugin` | Indent and outdent | `indent` `outdent` | `lite` | `indent` | `indent` |
| `ItalicPlugin` | Italic | `italic` | `lite` | `italic` | `italic` |
| `LineHeightPlugin` | Line spacing | `lineheight` | `lite` | `line-height` | `lineHeight` |
| `LinkPlugin` | Links | `link` | `lite` | `link` | `link` |
| `ListPlugin` | Bulleted and numbered lists | `bullist` `numlist` | `lite` | `list` | `list` |
| `MathPlugin` | Math formulas (LaTeX or MathML) | `math` |  | `math` | `math` |
| `MediaManagerPlugin` | Insert images and video | `image` `video` | `enterprise` | `media-manager` | `image` |
| `MentionPlugin` | @mentions from a list you provide | `mention` | `enterprise` | `mentions` | `mentions` |
| `MergeTagPlugin` | Merge tags such as `{{ First name }}` | `mergetag` | `enterprise` | `merge-tag` | `mergeTag` |
| `PIIRedactionPlugin` | Scan for personal data | `piiredaction` | `enterprise` | `pii-redaction` | `piiRedaction` |
| `PageBreakPlugin` | Page breaks | `pagebreak` | `lite` | `page-break` | `pageBreak` |
| `PreviewPlugin` | Preview | `preview` | `lite` | `preview` | `preview` |
| `PrintPlugin` | Print | `print` | `lite` | `print` | `print` |
| `SlashCommandsPlugin` | A `/` command menu | `slashcommands` | `enterprise` | `slash-commands` | `slashCommands` |
| `SmartPastePlugin` | Smart paste profiles | `smartpaste` | `enterprise` | `smart-paste` | `smartPaste` |
| `SpecialCharactersPlugin` | Special characters | `specialcharacters` |  | `special-characters` | `specialCharacters` |
| `SpellCheckPlugin` | Spell check | `spellcheck` | `enterprise` | `spell-check` | `spellCheck` |
| `StrikethroughPlugin` | Strikethrough | `strikethrough` | `lite` | `strikethrough` | `strikethrough` |
| `TablePlugin` | Tables, with a toolbar for editing rows and columns | `table` | `lite` | `table` | `table` |
| `TemplatePlugin` | Insert content templates | `template` | `enterprise` | `template` | `template` |
| `TextAlignmentPlugin` | Text alignment | `textalignment` | `lite` | `text-alignment` | `textAlignment` |
| `TextColorPlugin` | Text colour | `textcolor` | `lite` | `text-color` | `textColor` |
| `TrackChangesPlugin` | Suggested edits, attributed to an author, that can be accepted or rejected | `trackchanges` | `enterprise` | `track-changes` | `trackChanges` |
| `TranslationWorkflowPlugin` | Translation workflow: locale validation and segment locking | `translationworkflow` | `enterprise` | `translation-workflow` | `translationWorkflow` |
| `UnderlinePlugin` | Underline | `underline` | `lite` | `underline` | `underline` |
| `VersionDiffPlugin` | Compare the document with a baseline | `versiondiff` | `enterprise` | `version-diff` | `versionDiff` |

Plugins with no entry are imported from their subpath (or the root). A plugin's own command name also works as a
toolbar item in React, for example `openEmojiDialog`.

## Configure a plugin

Most plugins work without options. Some take an options object:

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HeadingPlugin, HistoryPlugin } from '@editora/plugins/lite';
import { DataBindingPlugin, MergeTagPlugin, TrackChangesPlugin } from '@editora/plugins/enterprise';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const plugins = [
  HeadingPlugin(),
  BoldPlugin(),
  HistoryPlugin(),

  // Tags the author can insert, grouped by category, with a preview value.
  MergeTagPlugin({
    tags: [
      { key: 'first_name', label: 'First name', category: 'Contact', preview: 'Ava' },
      { key: 'company', label: 'Company', category: 'Account', preview: 'Editora Labs' },
    ],
  }),

  // Record edits as suggestions that can be accepted or rejected, attributed to this author.
  TrackChangesPlugin({ author: 'Ava Miller', enabledByDefault: false }),

  // Values that data-bound fields in the document are resolved against.
  DataBindingPlugin({ data: { user: { firstName: 'Ava' }, account: { name: 'Editora Labs' } } }),
];

export default function PluginOptions() {
  return (
    <EditoraEditor
      defaultValue="<h2>Welcome</h2><p>Insert a merge tag, or turn on track changes and edit this sentence.</p>"
      plugins={plugins}
      toolbar={{ items: 'undo redo | heading bold | mergetag | trackchanges databinding' }}
    />
  );
}
```

<table>
  <tr>
    <td width="50%"><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/plugins/docs/images/merge-tags.png" alt="The Insert Merge Tag dialog, with a search box, the Contact and Account categories and a preview of the tag"></td>
    <td width="50%"><img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/plugins/docs/images/track-changes.png" alt="A sentence with a tracked insertion highlighted in green"></td>
  </tr>
  <tr>
    <td align="center"><sub>Merge tags, from the <code>tags</code> option</sub></td>
    <td align="center"><sub>Track changes, with the edit marked</sub></td>
  </tr>
</table>

The option types are in the typings of each plugin. Others that take options include `MentionPlugin`,
`SlashCommandsPlugin`, `VersionDiffPlugin`, `ContentRulesPlugin`, `CitationsPlugin` and `SmartPastePlugin`.

## Math

`MathPlugin` opens a dialog with quick templates and a LaTeX or MathML field:

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/plugins/docs/images/math.png" alt="The Insert Math Formula dialog with LaTeX and MathML, quick templates such as fraction and square root, and a formula field" width="700">
</p>

## Load a heavy plugin on demand

Plugins are ordinary modules, so you can load one when it is needed and keep it out of your main bundle:

```tsx
import { useEffect, useState } from 'react';
import type { Plugin } from '@editora/core';
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const basePlugins: Plugin[] = [BoldPlugin(), ItalicPlugin(), HistoryPlugin()];

// Load a heavy plugin only when the editor is shown, so it stays out of your main bundle.
export default function LazyPlugins() {
  const [plugins, setPlugins] = useState<Plugin[]>(basePlugins);

  useEffect(() => {
    import('@editora/plugins/spell-check').then(({ SpellCheckPlugin }) => {
      setPlugins([...basePlugins, SpellCheckPlugin()]);
    });
  }, []);

  return <EditoraEditor defaultValue="<p>Spell check arrives after the first render.</p>" plugins={plugins} />;
}
```

## Collaboration

`CollaborationPlugin` edits one document together through a [y-websocket](https://github.com/yjs/y-websocket) server.
Give it your own server:

```ts
CollaborationPlugin({
  websocketUrl: 'wss://collab.example.com', // your own y-websocket server
  roomName: 'proposal-42',
  userName: 'Ava Miller',
});
```

> [!WARNING]
> **Without `websocketUrl` the plugin syncs through the public Yjs demo server** (`wss://demos.yjs.dev`). The room is
> named after `roomName`, then the editor's `id`, and otherwise `editora-default-room`, which every user of the
> default shares. Anyone who knows the room name can read and edit the document. The plugin logs a warning once when
> this happens. Always pass your own server. In `<editora-editor>`, also list your plugins: leaving the `plugins`
> attribute out loads every plugin, this one included.

The other options are `userColor`, and `doc` or `provider` if you already have a Yjs document or provider.

## With the web component

The plugins also run in `<editora-editor>`. Name them in the `plugins` attribute, using the **Name** column above:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>

<editora-editor plugins="history heading bold table mergeTag" toolbar="undo redo | heading bold | table | mergeTags"></editora-editor>
```

Toolbar names in the element are camelCase and case-sensitive (`textColor`, `trackChanges`, `mergeTags`), unlike the
lowercase names in the table. See [`@editora/core`](https://www.npmjs.com/package/@editora/core#toolbar-items) for the
list and for the element's other options. Plugin options such as `tags` are set through the factory functions, in React.

## TypeScript

The typings ship with the package, for the root entry and for every subpath. A plugin is typed as `Plugin` from
`@editora/core`.

## The rest of the family

| Package | |
| --- | --- |
| [`@editora/react`](https://www.npmjs.com/package/@editora/react) | The editor as a React component. |
| [`@editora/core`](https://www.npmjs.com/package/@editora/core) | The editor engine and the `<editora-editor>` web component. |
| [`@editora/themes`](https://www.npmjs.com/package/@editora/themes) | Light, dark and acme themes. |

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
