# @editora/merge-tag

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Merge tag plugin for Editora rich text editor.

## What It Does

- Inserts merge tags/placeholders from a searchable dialog.
- Supports custom categories and tags.
- Supports custom token formatting.
- Supports keyboard navigation in the picker.
- Inserts non-editable inline merge-tag tokens.

## Installation

```bash
npm install @editora/merge-tag
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { MergeTagPlugin } from "@editora/merge-tag";

const plugins = [MergeTagPlugin()];
```

## Plugin Options

```ts
interface MergeTagItem {
  key?: string;
  label: string;
  category?: string;
  preview?: string;
  description?: string;
  value?: string;
}

interface MergeTagCategory {
  id?: string;
  name: string;
  tags: MergeTagItem[];
}

interface MergeTagDialogOptions {
  title?: string;
  searchPlaceholder?: string;
  emptyStateText?: string;
  cancelText?: string;
  insertText?: string;
  showPreview?: boolean;
}

interface MergeTagPluginOptions {
  tags?: MergeTagItem[];
  categories?: MergeTagCategory[];
  defaultCategory?: string;
  dialog?: MergeTagDialogOptions;
  tokenTemplate?: string | ((tag) => string);
}
```

## Functional Customization Example

```ts
import { MergeTagPlugin } from "@editora/merge-tag";

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
  tokenTemplate: "{value}"
});
```

`tokenTemplate` placeholders supported in string mode:
- `{key}`
- `{label}`
- `{category}`
- `{value}`

## Toolbar Command

- Command: `insertMergeTag`
- Toolbar label: `Merge Tag`

## Exported Types

- `MergeTagItem`
- `MergeTagCategory`
- `MergeTagDialogOptions`
- `MergeTagPluginOptions`
