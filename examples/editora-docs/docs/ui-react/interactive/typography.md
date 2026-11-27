---
title: Typography
description: Heading, Text and Prose: the type scale as components, and styles for rich HTML such as editor output.
sidebar_label: Typography
---

# Typography

:::info New in @editora/ui-react 0.7.0 and @editora/ui-core 0.7.0
:::

Three components cover text: `Heading` for headings, `Text` for body copy, and `Prose` for HTML you do not write element by element (Markdown, a CMS field, Editora editor output).

## Heading

```tsx
import { Heading } from '@editora/ui-react';

<Heading level={1}>Billing</Heading>
<Heading level={3} size="lg" tone="muted">Invoices</Heading>
```

`level` (1-6, default 2) sets the outline level that screen readers navigate by, and a matching default size. `size` (`xs` to `4xl`) changes only the look, so the outline stays correct when the design wants a small `h2`. Also `weight`, `tone` (`default` `muted` `brand`), `align`, `truncate`, `balance`.

The host element is the heading (`role="heading"` with `aria-level`). To get a real `<h2>` tag in the markup (for in-page anchors or tools that read tags), write `<Heading><h2>…</h2></Heading>`, or use your own `h2` with the type tokens.

## Text

```tsx
import { Text } from '@editora/ui-react';

<Text variant="lead">A short introduction.</Text>
<Text>Body copy.</Text>
<Text variant="muted" size="sm">Last edited 2 minutes ago</Text>
<Text inline variant="code">npm install</Text>
<Text lines={2}>A long description clamped to two lines…</Text>
```

`variant`: `body` `lead` `large` `small` `muted` `caption` `code` `overline`. Also `size`, `weight`, `tone` (`default` `muted` `brand` `success` `warning` `danger`), `align`, `inline`, `truncate`, `lines`.

## Prose

```tsx
import { Prose } from '@editora/ui-react';

<Prose measure>
  <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
</Prose>
```

`Prose` styles headings, paragraphs, links, lists, quotes, code, tables, images and figures inside it. The content stays your markup in the page (selectable, searchable, styleable). Its rules use the specificity of one element selector: they beat a CSS reset such as `h1 { margin: 0 }`, and any class rule of yours beats them. `size` (`sm` `md` `lg`), `measure` (lines of about 68 characters).

Sanitise HTML from users before rendering it; `Prose` only styles it.

See the API reference for [Heading](../api/heading), [Text](../api/text) and [Prose](../api/prose).
