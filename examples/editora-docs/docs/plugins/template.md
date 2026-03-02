---
title: Template Plugin
description: Reusable template insertion with search, categories, and sanitization.
keywords: [editora, plugins, template]
---

# Template Plugin

Reusable template insertion with search, categories, and sanitization.

## Installation and Import

```ts
import {
  TemplatePlugin,
  addCustomTemplate,
  getAllTemplates,
  getTemplateCategories,
  getTemplatesByCategory,
  searchTemplates,
  sanitizeTemplate,
  validateTemplate,
} from "@editora/plugins";
// or subpath: "@editora/plugins/template"
```

## Usage

```ts
const plugins = [TemplatePlugin()];
```

## Add Custom Templates

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

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Open template dialog | `insertTemplate` | None | `Template` |

## Config Options

This plugin does not expose plugin-level runtime config. Template data can be extended through helper APIs.

## Template Helper APIs

- `getAllTemplates()`
- `getTemplatesByCategory(category)`
- `getTemplateCategories()`
- `searchTemplates(query)`
- `addCustomTemplate(template)`
- `validateTemplate(template)`
- `sanitizeTemplate(html)`

## Behavior

- Supports category and search filtering
- Supports insert/replace style content flows
- Applies sanitization before insertion

## Security Notes

- Sanitization is DOMPurify-based
- Script-like content is stripped
- Keep sanitize flow enabled for untrusted template sources

## Validation Checklist

- Custom template add/search/category flows are stable
- Inserted template remains editable
- Undo/redo captures template insertion correctly
