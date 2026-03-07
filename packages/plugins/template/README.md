# @editora/template

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Template plugin for Editora rich text editor.

## What It Does

- Opens a template picker dialog from the toolbar.
- Supports category and search filtering.
- Supports insert mode and replace mode.
- Sanitizes template HTML with `dompurify` before insertion.
- Records DOM transactions for undo/redo integration.

## Installation

```bash
npm install @editora/template
```

If you are installing plugins as a bundle:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { TemplatePlugin } from "@editora/template";

const plugins = [TemplatePlugin()];
```

## Exports

- `TemplatePlugin()`
- `PREDEFINED_TEMPLATES`
- `addCustomTemplate(template)`
- `getAllTemplates()`
- `getTemplatesByCategory(category)`
- `getTemplateCategories()`
- `searchTemplates(query)`
- `sanitizeTemplate(html)`
- `validateTemplate(template)`
- `Template` type

## Add Custom Templates

```ts
import { addCustomTemplate, type Template } from "@editora/template";

const invoiceTemplate: Template = {
  id: "invoice-basic",
  name: "Invoice",
  category: "Business",
  description: "Basic invoice document",
  html: "<h2>Invoice</h2><p>Bill To: {{ customer_name }}</p>",
};

addCustomTemplate(invoiceTemplate);
```

## Toolbar Command

- Command: `insertTemplate`
- Toolbar label: `Template`

## Notes

- HTML is sanitized before insertion.
- Script tags and unsafe attributes are stripped.
- Template insertion works in both React wrapper and web component editors.
