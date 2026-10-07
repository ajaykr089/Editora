# Change Log

## 0.1.22

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

- 3d0b60e: Controls that reached assistive technology without a name now have one, and a few invalid ARIA references are gone. Verified with Chromium's accessibility tree over all 602 Storybook stories: 202 unnamed interactive controls became 0.

  - **`ui-field`** labelled its control with an `aria-labelledby` pointing into its own shadow root, which can never resolve, so a slotted `<input>`, `ui-input`, `ui-textarea` or `ui-checkbox` was exposed unnamed. It now copies the label text onto the control as an `aria-label` (unless the author named it), and `ui-input`, `ui-textarea`, `ui-number-field`, `ui-password-field`, `ui-tags-input`, `ui-combobox` and the date/time pickers forward a host `aria-label` to the inner control. The pickers fall back to their placeholder.
  - **`ui-password-field`** never showed its label, description or error when the attributes were set after the element connected (React does this), because the text was written to the slot fallback only at first render.
  - **`ui-progress`** (line and circular), **`ui-tree`** and **`ui-tabs`** (tablist) forward `aria-label`; a progress bar falls back to its `label` and then "Progress". **`ui-rating`** falls back to its `label` and then "Rating". An interactive **`ui-card`** is named after its title. **`ui-wizard`** panels are named with the step title instead of an unresolvable `aria-labelledby`.
  - **`ui-alert-dialog`**: the host carries `role="alertdialog"`, so a closed dialog was an empty, unnamed alert dialog in the page. It is now hidden from assistive technology while closed and named while open.
  - **`ui-checkbox`** and **`ui-radio`** no longer set (and overwrite an author's) `aria-labelledby` pointing into their own shadow root.

## 0.1.21

### Patch Changes

- da5bebd: Fixes from a real-browser audit of the UI packages.

  **ui-react / ui-sortable:** `className` was rendered as a literal `classname` attribute on custom-element hosts under React 16-18, so it never applied (about 115 wrappers); it is now mapped to `class`. Alert, Badge, Container, ContextMenu, DataTable, EmptyState, Field, Flex, Grid, Skeleton, Table, NavigationMenu and FloatingOverlay now forward refs. `Sortable` no longer crashes while `lists`/`items` are still undefined.

  **ui-core:** invalid selectors in `item-selector`, `direct-item-selector`, portal `target` and positioner `anchor`, and negative or oversized textarea `minlength`/`maxlength`, no longer throw. The transfer list, sortable lists, tab panels, multi-select, date-time picker and colour picker expose accessible names. `<ui-sortable>`: horizontal lanes now actually lay out horizontally; dropping on an empty list or below the last card works and a release no longer commits a stale target; keys typed into controls inside a card are no longer swallowed; keyboard dragging no longer stalls with `allow-nesting="false"`; a cancelled drag no longer leaves a card faded; right-to-left lanes navigate and drop in reading order; dragging near the page edge auto-scrolls.

  **collaboration:** content received from peers can no longer execute (scripts, event handlers, `javascript:` URLs and embeds are filtered), a destroyed binding fully detaches, a caller-supplied doc is no longer destroyed, a supplied provider's own doc is used, editors without an id no longer share the empty room, and a warning is logged when the public demo server is used by default.

  **plugins:** 39 duplicate/generic ids (e.g. `id="icon"`) removed from toolbar icon SVGs.

  **core / react:** the editing surface always has an accessible name (host `aria-label`, then the placeholder, then "Rich text editor").

## 0.1.20

### Patch Changes

- 5f909c8: Fix IconCloud orbit items and center rendering many times larger than intended, producing large overlapping translucent "ghost" panels behind the cloud instead of small orbiting icons. `::slotted([data-ui-icon-cloud-item])` and `::slotted([data-ui-icon-cloud-center])` set `inline-size`/`block-size` from the `item-size`/`center-size` attributes, but without `!important` those rules lose to any inline `width`/`height` style a consumer puts directly on an `IconCloud.Item`/`IconCloud.Center` (a very natural thing to do, e.g. to make an icon's wrapper fill its slot) - since inline styles always beat non-`!important` stylesheet rules. The item/center then sized itself to 100% of its absolutely-positioned containing block (the whole stage) instead of its intended small size, each landing at a different depth/opacity along the orbit and stacking up as several large faint rounded boxes. Found via a UI report on the `/icon-cloud` sandbox demo, which passes `style={{ width: '100%', height: '100%' }}` on its items. Fixed by marking these two size declarations `!important`, matching the existing `position: absolute !important` on the same rules (added for the same reason: a consumer's inline styles shouldn't be able to break the orbit layout contract).
- 750ebf4: Fix 4 XSS vectors found during a security audit of ui-core's HTML string rendering, all reachable via public custom-element attributes without any script needing to run first: TimePicker's translations attribute was interpolated unescaped into its overlay markup (every sibling picker already escaped this correctly - TimePicker was the outlier); Chart's per-series/per-point tone value was interpolated unescaped into SVG fill/stroke attributes and legend/tooltip style attributes; Skeleton's height/width/radius/gap/duration attributes were interpolated unescaped into a style attribute; Orbiter's orbit-radius/ring-gap/center-size/padding attributes passed non-numeric values through completely unvalidated into a style attribute. Each is fixed at its actual point of use with either existing escapeHtml() helpers or a stricter allowlist for CSS length values, matching the pattern already used correctly elsewhere in the same files.
- e0b29a3: Fix SplitButton's dropdown menu rendering with hardcoded light-mode colors under a dark ThemeProvider. Its menu is portaled to `document.body` to escape ancestor clipping/overflow, which moves it out of the component's own shadow root - so the `--ui-split-button-menu-*` custom properties defined in its `:host {}` block were invisible to it, same root cause as the DateRangePicker/DatePicker/TimePicker overlay-theming bugs fixed earlier. Found via a systematic audit of every ui-core component that portals content to `document.body`, cross-checking each against the two patterns already proven correct elsewhere (ui-menu/ui-menubar/ui-context-menu's read-computed-values-and-copy-as-inline-styles approach; ui-popover/DateRangePicker's re-derive-on-a-class-selector approach). Fixed with the former: read the already-resolved computed `--ui-split-button-menu-*` values off the host element and copy them onto the portaled menu as inline styles, matching ui-menu.ts's existing pattern rather than hand-duplicating each token's derivation formula a second time.

## 0.1.19

### Patch Changes

- 1265771: Fix six recurrences of two bug patterns found during an ecosystem-wide audit: (1) Button's icon prop, and DateTimePicker/DateRangeTimePicker's calendar grid, rendered inert when deep-imported because the parent component never imported the child custom element's own registration module; (2) DatePicker, DateTimePicker, DateRangeTimePicker, and TimePicker's popovers rendered with hardcoded light colors under dark themes, same root cause as DateRangePicker's already-fixed overlay bug - --ui-_-bg/--ui-_-surface tokens defined only in the component's own :host scope, invisible to the document.body-appended overlay div.
- 94bed27: Fix DateRangePicker's portaled overlay panel rendering with a light/white background under dark themes. Its --ui-dp-* surface tokens were only defined within the picker's own :host scope, invisible to the overlay div appended to document.body; now re-derived locally on the overlay host, matching the pattern already used by ui-popover.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.18](https://github.com/ajaykr089/Editora/compare/@editora/ui-core@0.1.4...@editora/ui-core@0.1.18) (2026-09-05)

**Note:** Version bump only for package @editora/ui-core

## [0.1.4](https://github.com/ajaykr089/Editora/compare/@editora/ui-core@0.1.0...@editora/ui-core@0.1.4) (2026-03-08)

**Note:** Version bump only for package @editora/ui-core

## [0.1.3](https://github.com/ajaykr089/Editora/compare/@editora/ui-core@0.1.0...@editora/ui-core@0.1.3) (2026-03-05)

**Note:** Version bump only for package @editora/ui-core
