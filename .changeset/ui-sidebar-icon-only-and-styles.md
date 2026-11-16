---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

`ui-sidebar`: a usable icon-only mode, a collapse button and three new looks.

- Fix: collapsed (icon-only) items had no accessible name, because their labels were `display: none`. The labels are now visually hidden, so screen readers still read them.
- Fix: a group could not be opened while collapsed (its pages were unreachable). Hovering it opens its pages in a flyout beside the rail. A click, Enter or Right arrow opens the flyout and keeps it open. Escape or Left closes it and returns focus. Choosing a page or clicking outside closes it too.
- Collapsed items show their name in a tooltip on hover and focus.
- `collapse-button` (React `collapseButton`), with `collapsible`: a chevron in the header row that collapses and expands the sidebar.
- New variants: `solid` (the current item filled with the brand colour), `gradient` (a deep brand gradient with a bright current item) and `glass` (frosted, for a photo or colour mesh behind it).
- Fix: in a sized slot (such as a layout shell), the sidebar now stays inside the slot and its list scrolls. Before, a tall footer pushed the sidebar past the window and scrolled the whole panel. The header, search, promo and footer no longer shrink.
