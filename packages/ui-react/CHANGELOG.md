# Change Log

## 0.1.24

### Patch Changes

- 16ae8ee: Rewrite the READMEs of `@editora/light-code-editor`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/ui-sortable` and `@editora/toast`, which are the npm pages of these packages, with screenshots and examples.

  Their images and links were relative paths that npm cannot show, and several examples did not run. Every example is now a file that is type-checked in strict mode and run in Chromium (React ones under `StrictMode`, drag and drop with the pointer and the keyboard), and the README quotes it word for word (`npm run check:readme-examples`). The screenshots are taken from the same examples (`npm run readme:screenshots`).

  Things the READMEs now get right that they did not: the `@editora/themes` tokens only set text, border and shadow colours (backgrounds are set by rules), the helpers it exports are documented; `@editora/ui-core` and `@editora/ui-react` list measured bundle sizes (a Button imported from the `@editora/ui-react` root is 1 MB gzipped up front, from its own entry 54 KB up front plus the rest of `ui-core` loaded later); `@editora/toast` documents its defaults (bottom right, four seconds, three visible, theme `system`) and that it is safe to import on the server.

- bf92375: Make every wrapper register the elements it renders itself, and stop shipping the whole `@editora/ui-core` catalog as a lazy chunk. Each wrapper already imported its own element, but a missing element fell back to a dynamic `import('@editora/ui-core')`, so every build that deep-imported one component (`@editora/ui-react/Button`) also emitted a 450-500 KB gzipped chunk (never fetched by `Button`, but always built and deployed, and inlined by bundlers that do not split). That fallback is removed. It was also hiding that some wrappers registered nothing: deep-importing `TimeField` (from `DateField`), `Dropzone` (from `FileUpload`) or the `Description`, `FieldError`, `ControlGroup` and `Fieldset` parts of `FieldSemantics` rendered elements that never upgraded, and `Sortable` only worked because of the fallback (about 2.4 MB unminified, fetched at run time). They now import their own entries. A wrapper whose element is still missing logs a warning that names the `@editora/ui-core/<name>` import to add.
- d835f6b: Fix `@editora/ui-react/server` failing in React Server Components. The entry is meant for server components, but its components shared a chunk with the hooks of the client wrappers (`useRef`, `useEffect`, ...) and imported `@editora/ui-core`, which needs `HTMLElement` when it is loaded, so Next.js answered every page that used it with HTTP 500 ("You're importing a component that needs `useRef`"). The entry now loads only React: the markup comes from a hook-free `createUIElement`, and the elements are no longer registered by the server graph. Define them in the browser by importing `@editora/ui-react/client` (or `@editora/ui-core`) from a client component. A deep import such as `@editora/ui-react/Box` still registers its element and is now a client module.
- 4594dc4: Fix three problems found while running the README examples in a browser.

  - `DialogProvider` and `AlertDialogProvider` did not work under React `StrictMode`, which Vite, Create React App and Next.js turn on in development: every `confirm()` or `prompt()` resolved at once as `dismiss` and no dialog appeared. StrictMode runs an effect's cleanup and setup again without rendering in between, and the cleanup had dropped the manager. The setup now brings the manager back, with the alert dialog's defaults.
  - `<Pagination>` removed the `count` that a linked `<DataTable paginationId="...">` had written on it, because its own `count` prop was undefined, so the pager showed one page whatever the table held. It now only removes attributes it set itself.
  - The Gantt types (`GanttTask`, `GanttLink`, `GanttTaskChangeDetail`, `GanttLinkSelectDetail`, `GanttTaskType`, `GanttZoom`, `GanttSort`, `GanttBarVariant`) were not exported from the package root, although the `Gantt` component needs them. They are now.

- Updated dependencies [16ae8ee]
- Updated dependencies [8a37a0c]
- Updated dependencies [3bfac80]
- Updated dependencies [b2dc737]
  - @editora/ui-core@0.1.23
  - @editora/toast@2.0.10

## 0.1.23

### Patch Changes

- ac24c10: An accessibility and layout pass over the UI components, measured with axe-core over all 602 Storybook stories (292 stories had violations; none remain). The names pass from the previous release stays at 0 unnamed controls.

  **Descriptions and names now reach the control**

  - A `ui-field` description and error were pointed at with ids inside the field's shadow root, which the control can never follow. The field now puts their text on the control as `aria-description`. `ui-input`, `ui-textarea`, `ui-number-field`, `ui-password-field`, `ui-tags-input`, `ui-combobox`, `ui-select`, `ui-multi-select`, `ui-pin-input`, `ui-date-field`, `ui-time-field` and the date pickers forward it (and an `aria-describedby` the author put on the host) to the element inside them. `ui-tags-input` now wires its own description and error too.
  - `ui-dock` items fold a visible badge count into their name ("Inbox, 9"), `ui-avatar` keeps its generated name current when `alt` or `badge` arrive after the first render and includes the badge, the `ui-color-picker` trigger is named by its label and the value it shows (and no longer points `aria-labelledby` into its shadow root), and the `ui-carousel` text controls ("Back", "Forward") are named with the words they show. `ui-date-field` and `ui-time-field` name their group from `aria-label`.

  **Valid ARIA**

  - Roles sit on elements that allow them: `ui-card`, `ui-drawer`, the calendar grid, `ui-floating-toolbar` and `ui-quick-actions` use `div` instead of `article`, `aside` and `section`. `ui-tabs` and `ui-wizard` no longer set `aria-controls` / `aria-activedescendant` to ids in another tree. `ui-gantt` exposes a tree grid with real header, row and cell roles and a labelled timeline, `ui-placement-grid` is a list of list items, an empty `ui-sortable` list is a group rather than an empty listbox, and the sortable handle is a decorative element with no `aria-grabbed`. A custom drag handle is taken out of the tab order, since the item is the keyboard stop.
  - A `ui-menu` / `ui-dropdown` trigger puts `aria-haspopup` / `aria-expanded` on the real button inside the trigger wrapper (a `ui-button` forwards them to its inner button) instead of on a generic wrapper. `ui-switch`, `ui-toggle` and `ui-rating` no longer nest buttons inside a role-bearing host. A labelled, non-interactive `Orbiter.Item` is an image.

  **Contrast**

  - Muted text, status colours (success, warning, info, error) and tone accents are darker where they sat below 4.5:1, including the translucent mixes in the sidebar, menus and listbox, the solid variants of tabs, alert dialog and app header, the pressed `ui-toggle` fills, the `ui-animated-text` info tone and `Stat` tones. The `contrast` variants of the form controls, meter and transfer list are for dark surfaces, as before.
  - **Text on a solid fill follows the theme.** `ui-button` drew white text on its primary fill whatever the theme said, so the library's own default theme (amber `#ffc53d`) gave white on amber at 1.6:1. It now uses the theme's on-primary colour (`--ui-color-foreground-on-primary`), and `ui-toggle`, `ui-switch`, `ui-tabs` and `ui-select`, which read a variable the theme never set, fall back to it. The built-in accent palettes pick a text colour that reads at 4.5:1 (`blue` and `gray` now use near-black on their fill instead of white at 3.3:1; the fill colours are unchanged), and a theme that changes `colors.primary` without a text colour gets one derived from it instead of keeping amber's dark one (`createThemeTokens`, `ThemeProvider`; `readableForeground` and `deriveForegroundOnPrimary` are exported from `@editora/ui-core/runtime`). A text colour you set yourself is kept.
  - Secondary and ghost `ui-button` text takes more of the text colour, soft buttons mix their tint with the theme's surface instead of white (they were light panels in a dark theme), and the contrast `ui-sidebar`'s active item has a darker fill so its white label reads.

  **Themes and layout**

  - A theme that overrides `colors.surface` / `colors.background` (a dark theme) but not `surfaces` kept the baseline's light panels, so sidebars, menus and cards stayed white under light text. Unset surfaces now follow the colours the theme sets (`createThemeTokens`, `ThemeProvider`; `deriveThemeSurfaces` is exported from `@editora/ui-core/runtime`).
  - `ui-data-table` and `ui-table` scroll inside their own frame instead of widening a grid or flex parent, `ui-pin-input` digits shrink on a narrow container, `ui-rating`'s label wraps, `ui-combobox`'s control no longer overflows a narrow cell, and the `ui-react` carousel indicators and the code-editor fold buttons have non-overlapping 24px targets (the carousel dots are now spaced by their padding, so they sit slightly further apart).
  - **`ui-number-field` steppers are side by side** (decrease, then increase) and as tall as the field instead of stacked at about 20px each, and the `ui-color-picker` hue and alpha sliders have a 24px hit area around the same 12px track. `ui-react`'s `Dock.Item` separates its label and badge with a space.
  - **`@editora/light-code-editor` lines are 24px tall (they were 21px)**, and its fold column is 24px wide, so the fold buttons are 24x24 targets that no longer overlap when two consecutive lines fold (WCAG 2.5.8). Code is about 14% airier; line numbers, decorations and folding all follow the one line-height constant.
  - **`ui-calendar`**: a day's button holds only the day number, and its event marks and tooltip are drawn beside it in the same `.day-cell` (the marks are `aria-hidden`; the events stay in the tooltip the button's `aria-describedby` points at). The text shown on the button is then part of its name. The tooltip, which was clipped by the button and never visible, now shows on hover and focus, opening inward at the edge columns. An unusable `locale` falls back to `en-US` instead of leaving the calendar empty.
  - **An interactive `ui-card` is named from all the text it shows**, in the order it is drawn (it was the title only, so the description shown on the card was not part of its name); `ui-react`'s `Card` puts a space between its sections so that text does not run together. A disabled `ui-number-field` or `ui-multi-select` marks its shell `aria-disabled`, so the suffix, chips and steppers in it are inactive like the input.

  **Known limit**

  - A link or button inside a `ui-switch` is an interactive element inside `role="switch"`, which is invalid ARIA; the docs now say to keep them beside the switch (the click guard still works for existing markup).

- Updated dependencies [ac24c10]
- Updated dependencies [3d0b60e]
  - @editora/ui-core@0.1.22

## 0.1.22

### Patch Changes

- da5bebd: Fixes from a real-browser audit of the UI packages.

  **ui-react / ui-sortable:** `className` was rendered as a literal `classname` attribute on custom-element hosts under React 16-18, so it never applied (about 115 wrappers); it is now mapped to `class`. Alert, Badge, Container, ContextMenu, DataTable, EmptyState, Field, Flex, Grid, Skeleton, Table, NavigationMenu and FloatingOverlay now forward refs. `Sortable` no longer crashes while `lists`/`items` are still undefined.

  **ui-core:** invalid selectors in `item-selector`, `direct-item-selector`, portal `target` and positioner `anchor`, and negative or oversized textarea `minlength`/`maxlength`, no longer throw. The transfer list, sortable lists, tab panels, multi-select, date-time picker and colour picker expose accessible names. `<ui-sortable>`: horizontal lanes now actually lay out horizontally; dropping on an empty list or below the last card works and a release no longer commits a stale target; keys typed into controls inside a card are no longer swallowed; keyboard dragging no longer stalls with `allow-nesting="false"`; a cancelled drag no longer leaves a card faded; right-to-left lanes navigate and drop in reading order; dragging near the page edge auto-scrolls.

  **collaboration:** content received from peers can no longer execute (scripts, event handlers, `javascript:` URLs and embeds are filtered), a destroyed binding fully detaches, a caller-supplied doc is no longer destroyed, a supplied provider's own doc is used, editors without an id no longer share the empty room, and a warning is logged when the public demo server is used by default.

  **plugins:** 39 duplicate/generic ids (e.g. `id="icon"`) removed from toolbar icon SVGs.

  **core / react:** the editing surface always has an accessible name (host `aria-label`, then the placeholder, then "Rich text editor").

- Updated dependencies [da5bebd]
  - @editora/ui-core@0.1.21

## 0.1.21

### Patch Changes

- e2208ec: Fix AnimatedNumber deep-import registration gap. It wraps the <ui-odometer> custom element rather than a same-named one, so the mechanical name-based fix applied to the rest of ui-react's components earlier this week missed it - it never imported @editora/ui-core/odometer. Found by the new custom-element registration checker, which traces actual template/warnIfElementNotRegistered tag usage rather than assuming component and tag names match.
- Updated dependencies [5f909c8]
- Updated dependencies [750ebf4]
- Updated dependencies [e0b29a3]
  - @editora/ui-core@0.1.20

## 0.1.20

### Patch Changes

- c28e875: Deep-importing an individual component (e.g. @editora/ui-react/Chart) now registers only that component's custom element instead of requiring the full @editora/ui-core barrel. Previously every component wrapper relied solely on the package root's blanket 'import @editora/ui-core', so any deep import needed manually importing the whole registry too, defeating tree-shaking (root imports pulled ~6MB unminified vs ~140KB for a single deep import in testing).
- Updated dependencies [1265771]
- Updated dependencies [94bed27]
  - @editora/ui-core@0.1.19

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.19](https://github.com/ajaykr089/Editora/compare/@editora/ui-react@0.1.18...@editora/ui-react@0.1.19) (2026-09-05)

**Note:** Version bump only for package @editora/ui-react

## [0.1.5](https://github.com/ajaykr089/Editora/compare/@editora/ui-react@0.1.0...@editora/ui-react@0.1.5) (2026-03-08)

**Note:** Version bump only for package @editora/ui-react

## [0.1.4](https://github.com/ajaykr089/Editora/compare/@editora/ui-react@0.1.0...@editora/ui-react@0.1.4) (2026-03-05)

**Note:** Version bump only for package @editora/ui-react
