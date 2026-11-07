---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

Layout `variant="shell"` for app frames: full viewport height (`--ui-layout-shell-height`), no outer frame or padding, unframed panels with one divider per edge, a sidebar column that follows the sidebar's width, and only the content area scrolling. AppHeader and Sidebar inside it lose their own outer border and radius (they read inherited `--base-*` tokens), so there are no boxes inside boxes. On narrow screens (`drawer-breakpoint`, default 980px) the shell's sidebar becomes an off-canvas drawer with a backdrop: AppHeader's menu button opens it (its `aria-expanded` follows), Escape, the backdrop or picking a link/item closes it, focus moves into it and back, and the rest of the page is inert while it is open. Other variants keep the stacked sidebar unless `mobile-sidebar="drawer"`. New: `sidebar-open` / `openSidebar()` / `closeSidebar()` / `sidebar-open-change`, and in React `sidebarOpen`, `onSidebarOpenChange`, `mobileSidebar`, `drawerBreakpoint`, `sidebarLabel`. AppHeader `showMenuButton="narrow"` shows the button only where the drawer is used.
