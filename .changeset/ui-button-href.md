---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

`ui-button` / `Button` take `href` (with `target`, `rel`, `download`) for a link that looks like a button. It renders a real `<a>`, so it opens in a new tab with a modifier key, shows its address and is announced as a link, and it follows the same `navigate` contract as Sidebar and Breadcrumb links: React `onNavigate`, or `NavigationProvider` routes it through the app's router. A disabled link button has no `href` and does nothing.
