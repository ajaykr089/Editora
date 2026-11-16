---
'@editora/ui-core': patch
'@editora/ui-react': minor
---

React `Sidebar` gets `defaultCollapsed`: start collapsed, then let the sidebar keep its own state (collapse button, rail clicks, small screens). It is in the first paint and in server HTML. `collapsed` stays the controlled prop and wins when both are set.

`ui-sidebar` fixes found by checking Chromium, Firefox and WebKit:

- Right to left: icon-only tooltips and group flyouts opened over the sidebar. They now open towards the content, and the collapse chevron is mirrored.
- Tooltips and flyouts now line up with the sidebar's edge, not the icon inside it, and ignore the page scrollbar (with `position="right"` they overlapped the sidebar).
- The collapse chevron and rail transitions honour `prefers-reduced-motion`.
- The flyout's group title had 4.3:1 contrast; it is now above 4.5:1.
