---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

One router-agnostic link API. Sidebar, Breadcrumb, Tabs and Pagination dispatch the same cancelable `navigate` event (`detail.href`) before following a link; new-tab clicks stay with the browser and `navigation="client"` always keeps the page. New in React: `<NavigationProvider navigate={(href) => router.push(href)}>` routes every component's links through your router (React Router, Next.js, TanStack Router…), and each of the four takes `onNavigate`. Tabs accept `href` per tab (route tabs); Pagination's `hrefTemplate="?page={page}"` renders real page links. Also fixes `Breadcrumb.Item href` in React, which never rendered a link (the element read only `href`, the wrapper passed `data-href`).
