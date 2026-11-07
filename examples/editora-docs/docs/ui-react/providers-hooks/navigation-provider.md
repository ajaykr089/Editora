---
title: NavigationProvider
description: Route every Editora link (Sidebar, Breadcrumb, route Tabs, Pagination) through your app's router, once.
sidebar_label: NavigationProvider
---

# NavigationProvider

Components that render links — `Sidebar`, `Breadcrumb`, `Tabs` with `href` tabs, and `Pagination` with `hrefTemplate` — share one link contract. Wrap your app once and they all navigate through your router instead of reloading the page:

```tsx
import { NavigationProvider } from '@editora/ui-react';

// React Router
const navigate = useNavigate();
<NavigationProvider navigate={(href) => navigate(href)}>…</NavigationProvider>

// Next.js (app router)
const router = useRouter();
<NavigationProvider navigate={(href) => router.push(href)}>…</NavigationProvider>

// TanStack Router
const navigate = useNavigate();
<NavigationProvider navigate={(href) => navigate({ to: href })}>…</NavigationProvider>
```

The links stay real `<a href>` elements, so Cmd/Ctrl-click, middle-click and `target="_blank"` open a new tab as usual; those clicks never reach the provider.

## Per component

Each of these components also takes `onNavigate`. It runs before the provider and can handle a link itself:

```tsx
<Breadcrumb
  onNavigate={(detail) => {
    detail.preventDefault();          // keep the page
    openInPanel(detail.href);
  }}
>
```

`navigation="client"` keeps the page on every link click even without a handler (Sidebar, Breadcrumb, Tabs).

| Component | Links come from | `onNavigate` detail |
| --- | --- | --- |
| `Sidebar` | items with `href` | `href`, `value`, `label`, `index`, `item` |
| `Breadcrumb` | `Breadcrumb.Item href` | `href`, `label`, `index` |
| `Tabs` | `Tabs.Tab href` (use `activation="manual"` so arrow keys do not navigate) | `href`, `value`, `label`, `index` |
| `Pagination` | `hrefTemplate="/expenses?page={page}"` | `href`, `page`, `previousPage` |

## Web components

Without React, listen for the same cancelable `navigate` event on the element (`event.detail.href`) and call `event.preventDefault()` to route it yourself, or set `navigation="client"`.
