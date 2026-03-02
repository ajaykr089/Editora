---
title: Plugin Directory
description: Catalog of major Editora plugins and recommended integration stacks.
keywords: [editora, plugins, catalog, stacks, integrations]
---

# Plugin Directory

Catalog of major Editora plugins and recommended integration stacks.

## Plugin Catalog

- `MediaManagerPlugin`: image/video insertion workflows
- `TablePlugin`: table creation and editing
- `CodeSamplePlugin`: code blocks with language labels
- `ChecklistPlugin`: interactive checklist items
- `TemplatePlugin`: reusable content templates
- `CommentsPlugin`: in-editor comments panel
- `LinkPlugin`: link dialog and actions
- `PrintPlugin`: print rendering workflow
- `PreviewPlugin`: modal preview mode
- `HistoryPlugin`: undo/redo and DOM transactions
- `SpellCheckPlugin`: spelling suggestions panel
- `EmojisPlugin`: emoji picker dialog
- `SpecialCharactersPlugin`: symbol picker
- `MathPlugin`: formula insertion
- `DocumentManagerPlugin`: import/export workflows

## Recommended Stacks

### Blog editor

- `MediaManagerPlugin`
- `CodeSamplePlugin`
- `TemplatePlugin`
- `LinkPlugin`

### Technical documentation

- `CodeSamplePlugin`
- `TablePlugin`
- `MathPlugin`
- `SpecialCharactersPlugin`

### Collaborative workspace

- `CommentsPlugin`
- `HistoryPlugin`
- `DocumentManagerPlugin`
- `PreviewPlugin`

## Import Patterns

```ts
import { CodeSamplePlugin, TablePlugin } from "@editora/plugins";
```

```ts
import { CodeSamplePlugin } from "@editora/plugins/code-sample";
import { TablePlugin } from "@editora/plugins/table";
```

## Merge Tag Runtime Configuration

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
