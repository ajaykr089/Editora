---
title: "@editora/plugins"
description: Plugin catalog strategy and integration patterns for @editora/plugins.
keywords: [editora, plugins, commands, toolbar, integration]
---

# @editora/plugins

Comprehensive plugin distribution package for Editora.

## Installation

```bash
npm i @editora/plugins @editora/core
```

If you use plugin-driven UI (tables/dialogs/pickers), also import:

```ts
import "@editora/plugins/styles.css";
```

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `HeadingPlugin`, `BoldPlugin`, `ItalicPlugin`, `UnderlinePlugin`, `StrikethroughPlugin` | Plugin factories | Core formatting plugins |
| `ListPlugin`, `ChecklistPlugin` | Plugin factories | List and checklist behaviors |
| `HistoryPlugin` | Plugin factory | Undo/redo stack integration |
| `LinkPlugin`, `TablePlugin`, `AnchorPlugin`, `EmbedIframePlugin` | Plugin factories | Insertion/structure plugins |
| `BlockquotePlugin`, `CodePlugin`, `CodeSamplePlugin` | Plugin factories | Quote/code tooling |
| `ClearFormattingPlugin` | Plugin factory | Formatting reset behavior |
| `FontSizePlugin`, `FontFamilyPlugin`, `LineHeightPlugin` | Plugin factories | Typography controls |
| `TextAlignmentPlugin`, `IndentPlugin`, `DirectionPlugin`, `CapitalizationPlugin` | Plugin factories | Layout + writing direction controls |
| `TextColorPlugin`, `BackgroundColorPlugin` | Plugin factories | Color tooling |
| `MathPlugin`, `SpecialCharactersPlugin`, `EmojisPlugin` | Plugin factories | Character/math insertion |
| `PreviewPlugin`, `PrintPlugin`, `FullscreenPlugin` | Plugin factories | Viewing/output helpers |
| `PageBreakPlugin`, `FootnotePlugin`, `MergeTagPlugin`, `TemplatePlugin` | Plugin factories | Document authoring helpers |
| `CommentsPlugin`, `SpellCheckPlugin`, `A11yCheckerPlugin` | Plugin factories | Collaboration + quality plugins |
| `MediaManagerPlugin`, `DocumentManagerPlugin` | Plugin factories | Manager-backed plugins |
| `setMediaManagerConfig/getMediaManagerConfig` | Functions | Media manager runtime config |
| `setDocumentManagerConfig/getDocumentManagerConfig` | Functions | Document manager runtime config |
| `setGlobalApiConfig/getGlobalApiConfig/getGlobalApiHeaders/buildApiUrl` | Functions | Shared API config layer |
| `ApiConfig`, `MediaManagerConfig`, `DocumentManagerConfig` | Type exports | Config contracts |
| `@editora/plugins/lite` | Entry export | The 27 common plugins: formatting, lists, links, tables, colours, fonts, history |
| `@editora/plugins/enterprise` | Entry export | Advanced/specialized workflow, compliance, and QA plugins |
| `@editora/plugins/<plugin-name>` | Subpath exports | One plugin per import, such as `@editora/plugins/bold` |
| `@editora/plugins/styles.css` | CSS export | Plugin UI styles (table toolbar, dialogs, color pickers) |

## Entry Paths

All plugin entry paths are completely free (MIT) and fully customizable.

- `@editora/plugins`: full catalog
- `@editora/plugins/lite`: common/core subset
- `@editora/plugins/enterprise`: advanced/specialized subset
- `@editora/plugins/<plugin-name>`: granular subpath imports

Every entry tree-shakes, so pick the one that reads best: the bundle size is the same (see
[Bundle size](#bundle-size)).

### Enterprise Subset Includes

- `MentionPlugin`, `TrackChangesPlugin`, `VersionDiffPlugin`, `ConditionalContentPlugin`, `DataBindingPlugin`
- `ContentRulesPlugin`, `CitationsPlugin`, `ApprovalWorkflowPlugin`, `PIIRedactionPlugin`, `SmartPastePlugin`
- `BlocksLibraryPlugin`, `DocSchemaPlugin`, `TranslationWorkflowPlugin`, `SlashCommandsPlugin`
- `SpellCheckPlugin`, `A11yCheckerPlugin`, `CommentsPlugin`, `MergeTagPlugin`, `TemplatePlugin`
- `MediaManagerPlugin`, `DocumentManagerPlugin`

## Usage Example

```ts
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  HistoryPlugin,
  TablePlugin,
  SpellCheckPlugin,
} from "@editora/plugins";
import "@editora/plugins/styles.css";

const plugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  HistoryPlugin(),
  TablePlugin(),
  SpellCheckPlugin(),
];
```

## Merge Tag Functional Customization

```ts
import { MergeTagPlugin } from "@editora/plugins";

const mergeTag = MergeTagPlugin({
  categories: [
    {
      id: "CUSTOMER",
      name: "Customer",
      tags: [
        { key: "first_name", label: "First Name", value: "{{customer.first_name}}", preview: "John" },
        { key: "email", label: "Email", value: "{{customer.email}}", preview: "john@acme.com" }
      ]
    },
    {
      id: "ORDER",
      name: "Order",
      tags: [
        { key: "id", label: "Order ID", value: "{{order.id}}", preview: "#A-1024" }
      ]
    }
  ],
  defaultCategory: "CUSTOMER",
  dialog: {
    title: "Insert Variable",
    searchPlaceholder: "Search variables...",
    emptyStateText: "No variables found",
    cancelText: "Close",
    insertText: "Insert",
    showPreview: true
  },
  tokenTemplate: "{value}" // supports {key} {label} {category} {value}
});
```

## Template Plugin: Custom Template Registration

```ts
import { TemplatePlugin, addCustomTemplate } from "@editora/plugins";

addCustomTemplate({
  id: "invoice-basic",
  name: "Invoice (Basic)",
  category: "Billing",
  description: "Simple invoice template",
  html: `
    <h1>Invoice</h1>
    <p><strong>Customer:</strong> {{customer.name}}</p>
    <p><strong>Date:</strong> {{today}}</p>
    <p><strong>Total:</strong> {{invoice.total}}</p>
  `,
  tags: ["invoice", "billing"],
});

const plugins = [TemplatePlugin()];
```

## Best Practices

- Keep toolbar commands aligned with loaded plugin set.
- Validate structural plugins with undo/redo.
- Lazy-load heavy, dialog-based plugins in app routes where needed.

## Accessibility

Ensure all plugin dialogs and sidebars are keyboard accessible and announce state changes clearly.

## Bundle size

Your bundle gets the plugins you import and what they use, whichever entry you import them from. These were measured
with esbuild and Vite as minified ES modules; your own bundler may differ a little:

| Import | Size |
| --- | --- |
| `BoldPlugin`, from any entry | 3.5 KB (1.5 KB gzipped) |
| `TrackChangesPlugin`, from any entry | 20 KB (5.5 KB gzipped) |
| Bold, italic, headings, lists, links and history | 42 KB (12.5 KB gzipped) |

This needs a bundler that reads the `sideEffects` field of `package.json`. Vite, Rollup, webpack, esbuild and Parcel
all do. Version 1.2.7 and earlier declared no `sideEffects`, so importing one plugin from the root cost about
40 KB gzipped.

### Load-time code since 1.2.8

A plugin's load-time code, such as a global listener, now runs only when you import that plugin. It no longer runs
because you imported another plugin from the same entry. Code that relied on a plugin it never imported, or on a bare
`import '@editora/plugins'` for its side effects, no longer gets:

- `window.execEditorCommand` and `window.executeEditorCommand`, with `undo`, `redo` and `recordDomTransaction`
  registered globally. Calling `HistoryPlugin()` still sets these up.
- The global command registrations of the italic, list, link, indent and line-height modules. These were duplicates:
  the editor registers the commands of the plugins you pass it.
- Document-wide listeners of plugins you did not pass to the editor: fullscreen's Escape key, the table toolbar, math's
  double-click to edit, code-sample's copy button, and text colour's styles.

To keep one of these, import that plugin and pass it to the editor. `import '@editora/plugins/styles.css'` is kept as
before.
