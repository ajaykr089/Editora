# Change Log

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
