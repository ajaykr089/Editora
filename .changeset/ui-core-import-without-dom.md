---
"@editora/ui-core": patch
---

Let `@editora/ui-core` be imported in a process without a DOM. Importing the package, any `@editora/ui-core/<name>` entry, or `@editora/ui-react` on a server threw `HTMLElement is not defined` (or `customElements is not defined`), so a Next.js page that server-renders a `'use client'` component using `@editora/ui-react/client` answered with HTTP 500. The element classes now extend a placeholder when there is no `HTMLElement`, and three registrations (`ui-sidebar`, `ui-color-picker`, `ui-number-field`) check for `customElements` like the other elements do. Nothing changes in a browser; the elements are still defined only there.
