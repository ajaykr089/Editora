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
| `@editora/plugins/lite` | Entry export | Lightweight subset for smaller bundles |
| `@editora/plugins/enterprise` | Entry export | Advanced/specialized workflow, compliance, and QA plugins |
| `@editora/plugins/<plugin-name>` | Subpath exports | Per-plugin imports for tree-shaking/lazy loading |
| `@editora/plugins/styles.css` | CSS export | Plugin UI styles (table toolbar, dialogs, color pickers) |

## Entry Paths

All plugin entry paths are completely free (MIT) and fully customizable.

- `@editora/plugins`: full catalog
- `@editora/plugins/lite`: common/core subset
- `@editora/plugins/enterprise`: advanced/specialized subset
- `@editora/plugins/<plugin-name>`: granular subpath imports

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

## Performance Notes

Prefer subpath imports, `@editora/plugins/lite`, or `@editora/plugins/enterprise` when you need a smaller default bundle.
