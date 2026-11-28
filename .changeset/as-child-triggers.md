---
"@editora/ui-react": minor
---

`asChild` on trigger parts: `Popover.Trigger`, `HoverCard.Trigger`, `Dropdown.Trigger`, `Menu.Trigger`, `Accordion.Trigger`, `NavigationMenu.Trigger` and `NavigationMenu.Link` render their single child instead of their own element, with props, event handlers and refs merged. Use it for router links (`<NavigationMenu.Link asChild><Link href="/blog">Blog</Link></NavigationMenu.Link>`) or your own buttons. `HoverCard.Trigger`'s documentation already showed `asChild`, but until now the prop did nothing.
