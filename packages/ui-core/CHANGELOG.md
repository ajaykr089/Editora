# Change Log

## 0.7.0

### Minor Changes

- bb0be84: New components, so nothing that shadcn/ui or Radix offers is missing:

  - Typography and helpers: `Spinner`, `Heading`, `Text`, `Prose` (styles rich HTML such as editor output), `AccessibleIcon`, and `Announcer` with an `announce()` function for screen-reader announcements.
  - Controls and layout: `ButtonGroup`, `InputGroup` (addons, and toolbars above or below a textarea), `NativeSelect` (a styled native select that stays in your form), `Item` and `ItemGroup` (list rows).
  - Chat and agent UI: `Message`, `Bubble`, `BubbleGroup`, `Marker`, `MessageScroller` (follows streamed output, anchors new turns, keeps your place when history loads), `Attachment`, `AttachmentGroup`, `Trace`, `TraceItem`, `Question` and `Questionnaire`.
  - `ui-kbd`, `ui-code-block` and `ui-carousel` custom elements in `@editora/ui-core` for apps without React (the React `Kbd`, `CodeBlock` and `Carousel` are unchanged).

  `Button` accepts `variant="outline"`, `"soft"`, `"surface"` (the looks `recipe` already had) and a new `"link"`. Before, `variant="outline"` silently rendered a solid button.

  The simple wrappers are hook-free and also exported from `@editora/ui-react/server`.

## 0.6.3

### Patch Changes

- a6be7f6: Three `ui-slider` thumb styles now apply in Chrome, Edge and Safari: the slight grow while a handle is pressed, the reduced-motion rule (which also stopped the slider's own transitions), and the forced-colors (Windows High Contrast) thumb colour. Each rule listed the Chromium/Safari and the Firefox thumb pseudo-elements together, and Chromium and WebKit drop a whole rule when one selector in it is unknown to them, so only Firefox ever used these rules.

## 0.6.2

### Patch Changes

- fa42bb4: A range `ui-slider` (and `Slider range` in `@editora/ui-react`) can now be moved by its start handle with a mouse or finger. The two handles overlapped and the end handle took every press, so dragging the start handle moved the end handle to the pointer, and a single click anywhere on the track did the same. A press now moves whichever handle is nearer (when both sit on the same value, the direction of the first move decides), and the pressed handle gets focus for the keyboard. Values also snap from `min` the way the native input does, so `min="5" step="10"` gives 15, 25, and so on instead of rounding to multiples of 10.

## 0.6.1

### Patch Changes

- Updated dependencies [5fd049a]
- Updated dependencies [7d2a229]
- Updated dependencies [d812360]
- Updated dependencies [8d7a928]
  - @editora/icons@0.3.0

## 0.6.0

### Minor Changes

- 4120258: Library gaps found while building the admin templates:

  - New web components `ui-page-header`, `ui-stat` and `ui-metric-card`, so apps without React get the page header and stat tiles React has had as `PageHeader`, `Stat` and `MetricCard`. The page title is a real heading (`h1` unless `heading-level` says otherwise), actions go in `slot="actions"` (a named group), and every text has an attribute and a slot of the same name. Entries: `@editora/ui-core/page-header`, `@editora/ui-core/stat`.
  - `ui-form` events are typed: `submit`, `invalid`, `validate`, `dirty-change` and `autosave` are `CustomEvent`s with typed `detail` (TypeScript used to type a `submit` listener's event as the browser's `SubmitEvent`, so `event.detail.values` did not compile). `document.querySelector('ui-form')` returns `UIForm`.
  - `ui-data-table layout="auto"` (React `layout="auto"`) sizes each column to its content instead of an equal share. Resizable and virtualized tables keep fixed columns.
  - `Avatar` / `ui-avatar` take `tone="brand"`, like `Badge`.

## 0.5.0

### Minor Changes

- a69e637: `ui-button` / `Button` take `href` (with `target`, `rel`, `download`) for a link that looks like a button. It renders a real `<a>`, so it opens in a new tab with a modifier key, shows its address and is announced as a link, and it follows the same `navigate` contract as Sidebar and Breadcrumb links: React `onNavigate`, or `NavigationProvider` routes it through the app's router. A disabled link button has no `href` and does nothing.
- 95df4c7: `ui-chart` (React `Chart`):

  - `show-summary="false"` also hides the readout line under the plot (range and change, or the selected point). `show-insight` (React `showInsight`) shows or hides that line on its own.
  - No status pill while the state is idle: it said "Live" on every chart, title or not. An empty header is hidden (its `display: flex` beat the `hidden` attribute).
  - The plot fits its card by default: `--ui-chart-plot-min-width` is now `0px` (set a width to keep dense data legible and scroll instead), and the last point's hit target no longer sticks out and adds a 7px scrollbar.
  - Series and point `tone` accepts theme tone names (`success`, `danger`, `warning`, `info`, `primary`, `accent`, `neutral`) as well as colours; names used to draw black.
  - A single dataset is no longer called "Series 1" in the tooltip.
  - The value axis no longer crosses zero when no value does (₹-230 under data that is all 0 or more).
  - Numbers follow `locale` (React `locale`), else the nearest `lang` attribute, so `en-IN` gives 1,00,000.

- 17aa80c: `ui-data-table` (with `selectable`) works with a checkbox column the app renders: a checkbox with `data-row-select` in a row adds that row to (or takes it out of) the selection, and one with `data-select-all` in the header selects or clears the rows on the page. The table keeps every one of them checked, and select-all indeterminate, as the selection changes (row clicks, bulk clear). Plain `<input type="checkbox">` and `ui-checkbox` both work. Headers with `data-sort="false"`, and the select-all column, are not sortable.
- 9bb78e9: `ui-dropdown` takes `align="start" | "end"` (React `align`) to line the menu up with that edge of the trigger. Without it the menu starts at the trigger's start edge, and lines up with the end edge when it would otherwise run off the window (a menu button at the right of a header).
- f055ee4: Field outlines reach 3:1 against the page (WCAG 1.4.11). Inputs, password and number fields, selects, multi-selects, comboboxes, tags inputs, text areas and the date and time pickers used the general line colour (about 1.6:1). The theme now sets `--ui-color-field-border` (half the text colour into the surface, about 3.4:1 on white) and `--ui-color-field-border-hover`; without a theme the same mix is computed from `--ui-color-text` and `--ui-color-surface`. Set `--ui-color-field-border` to choose your own. Soft, filled and other variants keep their own borders.
- c73698b: Date and time picker panels (`ui-date-picker`, `ui-date-range-picker`, `ui-date-time-picker`, `ui-time-picker`, `ui-date-range-time-picker`):

  - The panel opens inside the picker (in the top layer where the Popover API exists) instead of at the end of `document.body`. Theme variables set on a wrapper now reach it, and it can be styled with `::part(popover)`, `::part(footer)` and the like. Styles that targeted `body > .ui-date-picker-overlay-host` no longer apply.
  - The panel is opaque (`--color-panel-solid`, then `--ui-color-surface`; override with `--ui-dp-panel-bg`) and has a shadow (`--shadow-5`; override with `--ui-dp-popover-shadow`).
  - The date and range panels are at least as wide as the calendar (`--ui-dp-panel-min-width`, default 18.5rem), so a narrow field no longer leaves the calendar sticking out and the month name cut off.
  - The field label is no longer repeated as a panel title next to the field (the phone sheet keeps it); it names the dialog instead.
  - One Today button: the calendar's own is hidden while the footer (or the range presets) show one.
  - `clearable="false"` also hides the footer's Clear.
  - A closed picker no longer builds a hidden inline calendar (about 180 elements per field); inline mode builds it when needed.
  - A `default-value` that arrives after the element connected (as React sets attributes) is used as the starting value.

- 84edd8f: `ui-sidebar layout="dual"` (React `<Sidebar layout="dual">`): an icon rail plus a panel, as in Slack or Supabase.

  - Top-level items become the rail (icon with a short label; a top-level item's `section` change draws a divider). An item with `children` is an area: clicking it shows its pages in the panel, under its label and `description`. A top-level item without children is a link or button on the rail.
  - The panel follows `value`: it opens the area holding the current page. A rail click only changes the panel, not the value, and fires `area-change` (React `onAreaChange`).
  - `collapsed` hides the panel and keeps the rail (the area holding the current page stays marked). With `collapsible`, a click on the open area folds the panel away and any area click opens it again.
  - `width`, `min-width`, `max-width` and resizing size the panel; `--ui-sidebar-rail-width` (72px) sizes the rail. Header, search, promo and footer slots sit in the panel; new `rail-start` / `rail-end` slots (React `Sidebar.RailStart` / `Sidebar.RailEnd`) hold a logo or avatar on the rail.
  - Keyboard: Up/Down walk the rail, Right moves into the panel, Left goes back to the rail. Works with every `variant`.

- 647a63e: `ui-sidebar`: a usable icon-only mode, a collapse button and three new looks.

  - Fix: collapsed (icon-only) items had no accessible name, because their labels were `display: none`. The labels are now visually hidden, so screen readers still read them.
  - Fix: a group could not be opened while collapsed (its pages were unreachable). Hovering it opens its pages in a flyout beside the rail. A click, Enter or Right arrow opens the flyout and keeps it open. Escape or Left closes it and returns focus. Choosing a page or clicking outside closes it too.
  - Collapsed items show their name in a tooltip on hover and focus.
  - `collapse-button` (React `collapseButton`), with `collapsible`: a chevron in the header row that collapses and expands the sidebar.
  - New variants: `solid` (the current item filled with the brand colour), `gradient` (a deep brand gradient with a bright current item) and `glass` (frosted, for a photo or colour mesh behind it).
  - Fix: in a sized slot (such as a layout shell), the sidebar now stays inside the slot and its list scrolls. Before, a tall footer pushed the sidebar past the window and scrolled the whole panel. The header, search, promo and footer no longer shrink.

- 83869a0: A modern look for `ui-sidebar`, and new styles to choose from.

  - Every variant: medium-weight labels (the current page semibold), muted icons that brighten on hover and for the current page, the current item marked by a quiet fill with no tinted border, tighter rows, a guide line for nested items, quieter section labels, smaller badges and a soft promo panel.
  - New variants: `inset` (on the page canvas, the current item raised like a card; pair it with `ui-layout variant="shell" inset`, React `<Layout variant="shell" inset>`, which puts the content on a raised card), `indicator` (a brand-colour bar on the current item), and `pill` (rounded, roomier rows).
  - `contrast` is now a neutral near-black with the brand only on the current item, instead of a navy gradient.
  - New tokens: `--ui-sidebar-item-font-weight`, `--ui-sidebar-item-active-font-weight`, `--ui-sidebar-icon-color`, `--ui-sidebar-indicator`, and `--ui-layout-inset-canvas` / `--ui-layout-inset-gap` on the layout.

- edf8a80: `ui-sidebar`: the space between rows was a fixed 8px. It is now `--ui-sidebar-row-gap` (or `--base-sidebar-row-gap` from a wrapper), attribute `row-gap`, React `rowGap`. `itemGap` stays the space inside a row.
- 29e7ae8: `ui-sortable` `page-styles` (React `Sortable` `pageStyles`): your page's stylesheets also apply to `renderItem` / `renderListHeader` content, which is drawn inside the sortable's shadow root where app CSS classes did not reach (kanban cards had to be styled inline). The page's CSS is adopted in a cascade layer, so it styles your markup but never overrides the sortable's own look, and it follows stylesheets added later. The primitive behind it, `adoptPageStyles`, lives in `primitives/page-styles`.

### Patch Changes

- ad3d5ac: - Themes: a dark editor on a light page (an editor-only dark area) took the page's light `--ui` text colour, so its toolbar inputs had dark text on a dark field. The dark theme now takes the Editora UI palette only when the page itself is dark (`data-ui-mode="dark"`, or a dark marker on `html` / `body`); otherwise it keeps its own dark colours.
  - `ui-sidebar`: danger-toned items read on the dark `contrast` and `gradient` variants (new `--ui-sidebar-danger-text` token, lifted towards white there).
- 607fb54: `ui-app-header`: menus opened from the header (an account menu, notifications) show over the page again. The header's frosted background made it a layer of its own with no z-index, so a tab bar or card further down the page was drawn over an open menu; it now sits at `--ui-app-header-z`. A `sticky` header also cut such menus off at its bottom edge (paint containment); it no longer does.
- 0d12323: `ui-breadcrumb`: a crumb whose text or link changes after the breadcrumb is on the page is redrawn. A React page that rendered `<Breadcrumb.Item>{customer?.name ?? id}</Breadcrumb.Item>` kept showing the id after the name loaded, because only added or removed items were noticed.
- f930497: `ui-button`: calling `click()` on the element works like a native button: a `type="submit"` button submits its form (`<form>` or `ui-form`), `type="reset"` resets it, and a disabled button does nothing. It used to fire a click on the element only, so scripts and tests that clicked a submit button never submitted.
- 221623d: `ui-calendar`: focusing the calendar moves focus to its current day, so arrow keys work at once and the ring is the theme's (`--ui-ring-color`) instead of the browser's default outline (the macOS accent colour). A value set from outside moves the focus day to it. In range mode, clicking the end date no longer gets lost: the calendar re-rendered on the focus caused by `mousedown` and replaced the button before the click.
- a41f734: `ui-calendar`: with `events-display="badges"`, a day cell too narrow for a readable label (84px or less) shows each event as a coloured dot instead of a cut-off stub ("Sup…", "S… P…"). Wider calendars keep the labels.
- fba4051: `ui-card` without a header (or media) pads the top of its content like every other side. The header section is always first in the shadow tree, even when hidden, so the `.body:first-child` rule never matched and the content touched the top edge.
- 2733cb4: Chart, DataTable and Stat (`variant="card"`) frames use the same corner radius as Card: `--base-card-radius`, falling back to `--ui-radius` + 2px. Side by side they used three different radii (Chart `--ui-radius` + 4px, Stat a fixed 16px from an undefined `--ui-radius-lg`), and a theme could not set one card radius for all of them.
- 23213a0: `ui-chart`: area charts start their value axis at zero, as bar charts do. The filled area stood on a fitted baseline, so a revenue area on a $4,000 floor made a 40% dip look like a 90% one. Line, step and scatter charts keep the fitted axis.
- de66cc9: `ui-chart`: the title and subtitle use the same type as a Card's title and description (18px bold / 14px), so a chart next to a card on a dashboard no longer looks like a smaller, different component. `--ui-chart-title-size`, `--ui-chart-title-line-height`, `--ui-chart-subtitle-size` and `--ui-chart-subtitle-line-height` change them.
- bffe35d: `ui-chart` takes `heading-level` (React: `headingLevel`) for its title, default 3, so a chart under an `<h1>` page title can use level 2 and keep the heading order valid.
- 5658cdf: `ui-chart`: the change percentage under a chart no longer takes the value prefix (`-$1,990 (-24.3%)`, not `(-$24.3%)`), and donut and radial charts describe their largest slice and its share instead of a meaningless first-to-last change.
- 27951e7: `ui-chart`: the `values` and `labels` attributes take a JSON array (`values="[12, 18, 9]"`, `labels='["Jan 1, 2026", "Feb 1, 2026"]'`) as well as comma-separated text. A JSON array used to lose its first and last value without a word (`[12` and `9]` are not numbers), and a label with a comma in it was split in two. The React `Chart` now passes `values` and `labels` as JSON, so labels such as "Jun 1, 2026" work.
- f2242ac: `ui-chart`: a chart that is loading and has no data yet shows a shimmer the height of the plot, announced as "Loading chart data", instead of "No series data available". The card no longer says there is no data and then jumps in height when the data arrives.
- 2382831: `ui-chart`: the value axis of line, area, step, scatter and bar charts lands on round numbers. The five gridlines read `$0, $15,000, $30,000, $45,000, $60,000` instead of `$0, $13,565, $27,130…`, and small values keep the decimals the step needs (`0.25`, not `0.3`).
- 278a0b7: `ui-chart` with a few points: the plot kept a fixed minimum width (420px, 320px on small screens), so in a narrower card the last bars were cut off behind a hidden scrollbar; the minimum now scales with the number of points (about 28px each) and large datasets keep the old minimum. All-positive bar charts no longer show a negative tick on the y-axis, and negative values put the sign before the prefix (`-$1,990`, not `$-1,990`).
- 1bdfc32: `ui-chart`: with several series, the summary row and the readout under the plot say which series their figures describe (they always used the first one, unnamed). New `show-change="false"` (React `showChange={false}`) for charts of categories, such as deal stages or devices: the summary shows the lowest value instead of a first-to-last change, which means nothing there. The "Delta" label now reads "Change".
- 2c3a8d8: `ui-select`, `ui-multi-select` and `ui-combobox` build their option list when they open. A closed field used to keep its whole list in its shadow tree (about 180 to 220 elements for 50 options), which made filter-heavy pages large and test queries slow. `ui-radio-group` outlines also reach 3:1 (`--ui-color-field-border`), like `ui-radio`.
- baf3202: `ui-combobox`: the open/close chevron matches `ui-select` (same size and muted colour, no hover box, accent while open), and the chevron and clear icons are drawn at their intended size. The browser's default button padding left 12px of each 24px button, so both icons were shrunk.
- c09ba5f: PIN input boxes, checkbox and radio outlines, the switch's off track and the slider track use `--ui-color-field-border` and reach 3:1 against the page (they were 1.3 to 1.9:1).
- 857e8e4: `ui-data-table`: `data-align="end"` (or `"center"`) on a column's `th` and `td` aligns it, with tabular figures for numbers. The table's own header style beat any app CSS, so a numeric column's header could not be right-aligned over its numbers.
- a179786: `ui-data-table` with a few columns fits a narrow card: every table had a minimum width of 680px (620px on small screens), so a two- or three-column table scrolled sideways on a phone. The minimum now scales with the visible columns (about 100px each, not counting columns hidden by `hidden-columns` or by your CSS); wide tables keep the old minimum.
- d3fcdc4: `ui-data-table`: while loading, the words appear once, on the overlay over the rows; the status bar above the table stays for screen readers only, instead of repeating them. The first load says "Loading table data"; "Refreshing table data" is kept for when there are rows to refresh.
- b0cc0e2: `ui-data-table`: the `row-select` event (React `onRowSelect`) carries `ids`, the `data-id` of every selected row, and `id`, the clicked row's. Apps could only get positions and cell text before, so acting on the selected records (delete, export) meant mapping text back to records.
- 8a28491: `ui-data-table`: the bulk actions bar that appears when rows are selected sticks to the bottom of the window while the table is in view (`--ui-data-table-bulk-offset`, 16px). It sat under the last row, so on a table taller than the window, selecting a row near the top showed nothing.
- 6d61b37: `ui-empty-state` no longer makes up a description. Without one it showed "Try adjusting your filters or creating a new record." on every empty state, including ones with no filters (an empty inbox, a free day in a calendar). The line is now left out unless a `description` or a `slot="description"` is given.
- 9bec255: `ui-gantt`: with `fill` in a container that has no height of its own (a card, a page section), the timeline collapsed to 0px and only the toolbar showed. The scroll area now keeps a minimum height, `--ui-gantt-fill-min-height` (default 240px).
- 724bbb3: `ui-layout`: when the header or footer slot brings its own landmark (an AppHeader, a `<header>`/`<footer>` or an explicit role), the layout's wrapper steps aside, so the page has one banner instead of two nested ones. The sidebar, content and aside panels are plain boxes instead of unnamed `<section>`s, which stopped a Sidebar's `<aside>` from being a landmark.
- eed5448: `ui-layout variant="shell"`: a sidebar sized to its whole column no longer gets a horizontal scrollbar. The panel's 1px divider left it one pixel too wide; slotted sidebar and aside content now fits the panel, and those panels never scroll sideways.
- 8333a1d: Dropdown, menu, menubar and context-menu items and section labels are start-aligned. A menu opened from a right-aligned header or toolbar inherited its `text-align: end`, which pushed every label to the right edge and away from its icon or check mark.
- e5ec922: `ui-number-field` in a form: text typed since the field was last left is committed when the form reads or validates it (Safari and Firefox do not move focus to a clicked Submit button, so the form read the old, often empty, value), and an error appearing or clearing updates in place instead of re-rendering the field, which in Safari threw away the text being typed. Its required asterisk is hidden from screen readers.
- 0d61f0a: `ui-number-field` looks like the fields around it. The value is start-aligned (with a prefix such as `$`, the number used to sit at the far end; `--ui-number-field-align: right` still lines numbers up), the stepper buttons show − and + instead of tiny filled triangles (still full-height, at least 24px wide), and decimals that come only from `step` are no longer padded: `step="0.5"` shows 24 as "24", not "24.0". `precision` still pads.
- fe4a85a: Tooltip, Menu, ContextMenu (and Menubar) panels have their background, border and padding back: lifting them into the top layer reset those with inline style, which beat the component's own CSS (since the top-layer change). The reset is now a zero-specificity rule. Portalled Menu, Tooltip, Popover and SplitButton panels also take the theme variables of the wrapper around their component. ContextMenu's hidden in-element copy no longer leaves an empty box.
- 67c9252: Date, date-time, date-range, date-range-time and time pickers open with a toggle that looks like `ui-select`'s: a thin chevron in the field's muted colour that turns over while the panel is open. It was a filled glyph inside a grey button, so pickers looked unlike every other field around them.
- fc212ed: Date, time, date-time and date-range pickers take part in `ui-form`: their value is collected by `getValues()` and submit, `required` is checked, and `form.setErrors()` shows a message on them. Before, a picked date was missing from the form's values and a required picker was never checked.
- c5ad082: `ui-radio-group` with `orientation="horizontal"` puts plain radios side by side at their own width, wrapping when needed. Each option took a 160px column, so in a narrow form column three short choices stacked one per line even though the group was horizontal. Card and segmented groups keep their columns.
- 590a6ef: ColorPicker, Calendar, DateField and Stepper keep an uncontrolled value when another prop changes. ColorPicker `recent={false}` turns recent colours off. Picker `defaultOpen` opens the picker, and an open picker is no longer closed by an unrelated prop change.
- 0e3c827: README: a "What's new" section summarising the 0.3 and 0.4 (ui-core) and 0.2 and 0.3 (ui-react) changes, including the behaviour changes to check when upgrading, and a link to the changelog. No code changes.
- bfc158c: The `*` after a required field's label is hidden from screen readers in every field. Twelve fields (number field, date/time pickers and fields, file upload, multi-select, tags, pin input) left it readable, so "Amount" was announced "Amount star"; the control already says it is required.
- bd3b91b: Dialogs, drawers and other overlays that lock page scrolling no longer push the page sideways. The lock reserved a scrollbar gutter on both `<html>` and `<body>` whether or not the page had a scrollbar, so on a page that did not scroll (or with overlay scrollbars) everything moved left when a dialog opened. It now measures the page's scrollbar once and makes up for exactly that, on `<html>` only.
- 98e723f: React `Sidebar` gets `defaultCollapsed`: start collapsed, then let the sidebar keep its own state (collapse button, rail clicks, small screens). It is in the first paint and in server HTML. `collapsed` stays the controlled prop and wins when both are set.

  `ui-sidebar` fixes found by checking Chromium, Firefox and WebKit:

  - Right to left: icon-only tooltips and group flyouts opened over the sidebar. They now open towards the content, and the collapse chevron is mirrored.
  - Tooltips and flyouts now line up with the sidebar's edge, not the icon inside it, and ignore the page scrollbar (with `position="right"` they overlapped the sidebar).
  - The collapse chevron and rail transitions honour `prefers-reduced-motion`.
  - The flyout's group title had 4.3:1 contrast; it is now above 4.5:1.

- 21cdb6c: `ui-sidebar`: an item `icon` that is an icon name (`'receipt'`, `'chart-pie'`) renders that Editora icon, as `icon` does in other components; it used to print the name as text in the icon box. Other strings (an emoji, a letter) are still shown as text.
- 8dfa855: `ui-sidebar`: a group that holds the current item (`value`) opens by itself, once for each new value, so the reader sees where they are; a closed group holding it is shown in the active colour (`data-has-active`). Group toggles now have `aria-expanded`, so screen readers hear whether a group is open.
- 48c41ca: `ui-textarea` takes `counter` (as `ui-input` does) as well as `show-count`, and React `Textarea` takes `counter` as well as `showCount`. The same character count had a different name on the two fields.
- 048fc0d: `ui-textarea` honours `--ui-width`, like Select and the date pickers, so a form can give every field the same width; the default is unchanged (`min(100%, 520px)`).
- e764187: `createThemeTokens({ colors: { primary } })` gives focus rings the new primary colour. The baseline's amber `focusRing` used to stay, so an app that set only its brand colour had gold outlines on every focused field, date and button. Pass `colors.focusRing` to choose a different ring colour.
- b1cb04b: `ui-toggle-group` with `variant="soft"` or `"contrast"` is a proper segmented control: the track gets 3px of padding, toggles inside it drop their own border (it doubled the track's) and round their corners inside the track's (so `shape="pill"` rounds the toggles too), and the pressed toggle is a surface-coloured segment with a soft shadow instead of a second outline.
- a37e9f9: `ui-transfer-list` stacks its two lists and the move buttons when the list itself is narrower than 560px, not when the window is narrower than 760px. In a narrow card on a wide screen, the three columns were squeezed to a few characters each and the labels overlapped.

## 0.4.0

### Minor Changes

- 48455d8: Charts carry their numbers as a table: one row per label and a column per series, with the chart's title as caption. It is always there for screen readers, which get the plot itself as a single image, and `show-table` (React `showTable`) shows it on screen below the chart.
- 1a8e02d: DataTable for server-driven admin screens. `server-side` (React `serverSide`) shows the rows it is given as the current page and never sorts, filters or slices them itself, while still reporting sort, filter and page changes; `total-rows` (`totalRows`) drives the summary and pagination. `hidden-columns` (`hiddenColumns`) hides columns by key or index. Rows with `data-href` become links: a click anywhere on the row (not on a control in it) or Enter follows it through the shared `navigate` contract, so `NavigationProvider` or `onNavigate` can route it; modifier and middle clicks open a new tab.
- da7c0bd: Forms can show errors from a server response. `ui-form` has `setErrors({ email: 'Already registered' })`, `clearErrors(names?)` and `getErrors()`, and React's `Form` an `errors` prop that applies each new object once. Messages show on Editora fields as their own validation errors and on native inputs as their validity message with `aria-invalid`; the first field with an error, in page order, is focused. An error clears when its field is edited, and all of them when the form is validated or submitted again, so they never block the next attempt.

### Patch Changes

- a924a61: `ui-data-table` `pagination-id` works when the pager comes after the table in the page. It was looked up once when the table connected, so the usual layout (table, then pager) left paging dead; the pager is now found by id when needed.
- 93a7258: `ui-file-upload`: a file's Retry button uploads only that file; it used to restart every failed or pending file. New `retryUpload(file)` does the same from code, and the Retry button is labelled with the file name for screen readers.
- 69068ed: `ui-form` keeps focus on the first field with an error. Showing the error re-rendered an Editora field right after it took focus, so focus fell back to the page, both for `setErrors` and for a submit that failed validation.
- e428bb3: `ui-switch` toggles when the switch element itself is clicked: `element.click()`, and assistive technology activating the element with `role="switch"`. Only clicks inside its shadow root were handled, so those did nothing (a mouse click on the switch was not affected).

## 0.3.0

### Minor Changes

- b25a486: Ship only the icons you use. `@editora/icons/glyphs` exports every built-in icon on its own (`checkIcon`, `chevronDownIcon`, ...) so a bundler keeps only the ones imported, and `@editora/icons/renderer` draws a definition with `renderIconDefinition(definition, options)` without loading the catalog (about 1.7 KB gzipped). In `@editora/ui-core`, `addIcons(checkIcon, searchIcon)` (from `@editora/ui-core/add-icons`, or the package root; only apps that use it ship its 1.7 KB renderer) registers icons by definition: they draw at once, keep their variants and weights, are found by their aliases, and the full set (about 46 KB gzipped) is only fetched when an icon that was not added is shown.
- 56cc0f7: `Card.Actions` puts buttons or menus on the title's row inside `Card.Header`, at the end, without a wrapper (the header was a single-column grid). `EmptyState variant="plain"` draws no box of its own, for use inside a Card, table or panel. `Alert live={false}` (`live="false"`) is a static page banner: no `role="alert"`/`status` and no `aria-live`, so it is not announced when the page loads. Also fixes Card without a footer, which had no padding under its content.
- cddc05a: Input and Textarea take `description-position="below"` (React `descriptionPosition="below"`) to show the description under the field, above any error, instead of between the label and the field. The reading order for screen readers is unchanged.
- 1e7ba3a: Textarea, Select, Checkbox, Switch, RadioGroup, PasswordField, NumberField, Slider and MultiSelect are form-associated, like Input: their value is in the surrounding `<form>`'s `FormData` (a checkbox or switch submits its `value`, default `on`, only when checked; MultiSelect and a range Slider submit one entry per value), `form.reset()` restores the value or checked state they had before the user changed them, a `<fieldset disabled>` disables them, and `required` takes part in the form's validation (an empty required field now blocks a native submit; add `novalidate` to validate in JavaScript). Also fixes `ui-slider` without `min`/`max` attributes, which clamped every value to 0.
- d0aec84: The built-in icon set (`@editora/icons`, about 135 KB minified) is no longer bundled into every component that can show an icon. Icons are looked up by name, so a static import kept the whole set in, for example, the Button entry (55.9 KB gzipped, 80% of it icons). The set now loads on first use as its own chunk: Button costs 8.9 KB gzipped up front, a 20-component admin set 129.7 KB instead of 176.8 KB, and the icons (47 KB) only load when a built-in icon is rendered. While they load, an icon's box is empty instead of showing its fallback letter. `loadIcons()` preloads them (call it at startup, or before asserting on icons in tests); `iconsLoaded()` and `whenIconsLoaded()` report the state. Icons added with `registerIcon()` still render immediately.
- ea0ae06: `ui-input` is now form-associated: its value is part of a surrounding `<form>`'s `FormData`, `form.reset()` restores it, a `<fieldset disabled>` disables it, and its validity (`required`, `pattern`, `minlength`…) takes part in the form's constraint validation, so an empty `required` field now blocks a native submit like a native input does (add `novalidate` to the form to validate in JavaScript instead). Pressing Enter in `ui-input`, `ui-password-field` or `ui-number-field` submits the surrounding `<form>` (through its default submit button, which a disabled default button blocks, as natively) or `<ui-form>`; a keydown listener can still cancel it with `preventDefault()`.
- 5e8cd10: Layout `variant="shell"` for app frames: full viewport height (`--ui-layout-shell-height`), no outer frame or padding, unframed panels with one divider per edge, a sidebar column that follows the sidebar's width, and only the content area scrolling. AppHeader and Sidebar inside it lose their own outer border and radius (they read inherited `--base-*` tokens), so there are no boxes inside boxes. On narrow screens (`drawer-breakpoint`, default 980px) the shell's sidebar becomes an off-canvas drawer with a backdrop: AppHeader's menu button opens it (its `aria-expanded` follows), Escape, the backdrop or picking a link/item closes it, focus moves into it and back, and the rest of the page is inert while it is open. Other variants keep the stacked sidebar unless `mobile-sidebar="drawer"`. New: `sidebar-open` / `openSidebar()` / `closeSidebar()` / `sidebar-open-change`, and in React `sidebarOpen`, `onSidebarOpenChange`, `mobileSidebar`, `drawerBreakpoint`, `sidebarLabel`. AppHeader `showMenuButton="narrow"` shows the button only where the drawer is used.
- 4a5aea1: One router-agnostic link API. Sidebar, Breadcrumb, Tabs and Pagination dispatch the same cancelable `navigate` event (`detail.href`) before following a link; new-tab clicks stay with the browser and `navigation="client"` always keeps the page. New in React: `<NavigationProvider navigate={(href) => router.push(href)}>` routes every component's links through your router (React Router, Next.js, TanStack Router…), and each of the four takes `onNavigate`. Tabs accept `href` per tab (route tabs); Pagination's `hrefTemplate="?page={page}"` renders real page links. Also fixes `Breadcrumb.Item href` in React, which never rendered a link (the element read only `href`, the wrapper passed `data-href`).
- 1c27821: New pre-definition stylesheet for server-rendered pages: `@editora/ui-core/preload.css` (also `PRELOAD_CSS` from `@editora/ui-core/preload`, and `<EditoraPreloadStyle />` from `@editora/ui-react` / `@editora/ui-react/server` for the document head). Until the custom elements are defined it gives each element the display it will have, hides what it will hide (closed dialogs and drawers, menu and popover content, raw `<option>`s, every tab panel but the first) and reserves the height of form controls, labels, tab strips and cards. On a test page the content below moved 155–223px when the scripts loaded; with the stylesheet it moves about 5px, with no flash of hidden content. Every rule is scoped to `:not(:defined)` inside `@layer editora-preload`, so it stops applying once an element upgrades and app styles override it. Also: `ui-tabs` no longer overwrites an `id` the author set on a panel.
- 95a2110: Input and PasswordField accept your own native `<input slot="input">`, for sign-in forms: password managers and autofill could not reliably find an input inside the shadow root. The component keeps its label, styling, clear and show/hide buttons around your input but never changes its `name`, `type` (apart from the show/hide toggle), `autocomplete` or `placeholder`; the input is an ordinary form field (submitted once, Enter submits natively) and is named after the component's label unless you labelled it. Clicking the label focuses the field, with or without a slotted input.
- 3df4735: App-wide density: `ThemeProvider density="compact" | "default" | "comfortable"` (or `tokens.density` with `applyTheme`) rescales the shared control tokens every control sizes itself from: heights 28/32/36px for the default size, padding, font size and the default gap. A component's own `density` still overrides it.

### Patch Changes

- 8c7ae64: Two fixes from the new Storybook accessibility sweep: the inline DateTimePicker's hour and minute selects were unstyled browser defaults (19px tall, below the 24px WCAG 2.2 target size) because their styles only existed for the popover, and a Sortable list that scrolls (`max-height`) could not be reached from the keyboard when the single roving tab stop was in another list; that list is now a tab stop itself.
- 4c0898f: Contrast variants and dark panels follow the brand colour: 54 places that hard-coded a light blue (`#93c5fd`) for accents, focus rings and fills on dark surfaces now use the new `--ui-color-accent-on-dark` theme token (a light tint of the primary colour), with the old blue as the fallback when no theme is applied. Found with a custom-brand dark-theme audit over all Storybook stories.
- 7b34943: Card: `Card.Inset` written after `Card.Header` now renders below the header (between the header and the body). It used to be fixed above the header, so a header followed by a full-bleed table showed the table first. An inset written first still sits at the top.
- 12ef8d6: Dialog and AlertDialog put a single dialog in the accessibility tree: the panel inside the shadow root (named by its title, with `aria-modal`). The host no longer gets `role="dialog"` / `role="alertdialog"` added. The panel role is set with the new `dialog-role` attribute (the React `roleType` prop now writes it); a `role` attribute on the host is still read for backwards compatibility.
- e7315af: Dialog, AlertDialog and Drawer focus traps now include the content you put in them. The trap looked for focusable elements only in the overlay's own shadow root and read `document.activeElement`, which is the overlay host while focus is inside it, so in a Dialog every Tab sent focus back to the close button and its fields could not be reached from the keyboard. Traps now follow the rendered (flat) tree across slots and nested components such as Input, and `autofocus` on a field inside a dialog works.
- f303688: Dropdown, Menu, Menubar and Popover mark the light-DOM content they copy into their panel as `aria-hidden`, so Testing Library and other DOM-reading tools see one set of menu items (the open menu's) instead of two. Browsers already hid the originals; nothing changes visually.
- 2042a85: A missing numeric attribute no longer reads as 0, so these defaults apply again: `ui-toast` shows up to 5 toasts (it showed 1), `ui-breadcrumb` only collapses when `max-items` is set (it collapsed past 3 items), `ui-tooltip` waits 250ms to open and 120ms to close, `ui-hover-card` waits 120ms, `ui-popover`, `ui-tooltip` and `ui-positioner` keep their 8px offset (and the positioner its 4px boundary padding), and `ui-textarea` has 4 rows.
- 783d56b: Pagination renders the right pages on its first render: `page={1} count={3}` no longer shows a single page with Next disabled until the next tick. Keyboard focus also stays on Next/Previous (or the current page) after paging, instead of being lost when the buttons re-render.
- 74dce9b: Preload styles: a `ui-tabs` with a server-rendered `selected` (1 to 9) shows that panel before the element is defined, not the first one.
- db566c8: React wrappers are correct on the first render: the element renders once with every prop applied, in the same commit, instead of showing its defaults until the next microtask (a test reading the shadow DOM straight after `render()` saw, for example, an Input without its label or a Meter without its value). Wrapper event listeners are attached before that render, so an event the element dispatches while rendering is no longer missed. `ui-rating` no longer drops an `aria-label` that is set after it named itself. New `flushPendingRender()` on every element runs a queued render immediately.
- 179505e: Container wrappers (Tabs, Dialog, AlertDialog, Drawer, Dropdown, Menu, ContextMenu, Menubar, NavigationMenu, Popover, Tooltip, HoverCard, Accordion, Collapsible, QuickActions, Sidebar, Layout, Alert) now only react to events their own element dispatches. A `change`, `open`, `close` or `select` bubbling up from a child (a checkbox in a tab panel, a dropdown inside a dialog) no longer calls the parent's `onChange`/`onClose`; a checkbox in a tab panel used to close the panel. Tabs also keep keyboard focus on the active tab when panel content re-renders (the tab strip is only rebuilt when the tabs themselves change, and focus is restored when it is), and only count their own tabs and panels, not those of a nested `ui-tabs`.
- 616fed6: Select and Combobox mark their light-DOM `<option>` children `aria-hidden` (they are only the data the list renders from), so WebKit's accessibility tree, Playwright and Testing Library see each option once instead of twice.
- 8c7a9f9: Select: `value=""` with a `placeholder` now shows the placeholder instead of the first option (the React wrapper synced `value` before `placeholder` and removed an empty value instead of writing it). `ui-select` also updates its shadow DOM in place after the first render instead of rebuilding it when options or slots change, so the combobox a test just found stays connected and clicking it opens the list (it used to be replaced one tick after mount, which made the list impossible to open from Testing Library), and focus survives option changes.
- 6f5a0cc: Sidebar: link items (`href`) dispatch a cancelable `navigate` event before the browser follows them. In React, `onNavigate={(d) => { d.preventDefault(); router.push(d.href); }}` routes without a page reload, and `navigation="client"` keeps the page on every link click. Clicks that open a new tab (Cmd/Ctrl/Shift/middle click, `target="_blank"`) are never intercepted. Enter on a link item now follows it (it was swallowed). `Sidebar.Group` and `Sidebar.Item` placed directly inside `<Sidebar>` now render; they used to be ignored ("No matches found") unless wrapped in `Sidebar.Content`.
- Updated dependencies [b25a486]
  - @editora/icons@0.2.0

## 0.2.2

### Patch Changes

- b2b57d9: `applyTheme` (and so ui-react's `ThemeProvider`) now sets `color-scheme` from the theme's background, so scrollbars, form-control chrome and the canvas follow a dark token theme on a light system and the reverse. It is set on the element being themed, so a scoped theme stays scoped; `applySystemTheme` still sets it from the system preference.

## 0.2.1

### Patch Changes

- ba42563: Found by running every story with the real theme tokens applied (Storybook itself applies none, so earlier sweeps only saw the CSS fallback colours).

  - **`ui-alert`:** a solid alert keeps 4.5:1 for its description text with the default theme's red (the fill is a little darker and the description text is 92% white).
  - **`ui-wizard`:** the contrast variant uses its own dark step fills and lines. It took the light theme's accent tint under light text (1.1:1 on the current step).
  - **`ui-animated-text`:** the soft tone text is darker (the default green was 4.41:1).
  - **Docs:** the Theming section now says to theme a subtree with `applyTheme(tokens, element)` or `ThemeProvider`, because the derived fill, line and soft accent roles do not follow a few hand-set `--ui-color-*` variables.
  - **Status colours as text and as solid fills:** the theme now derives `--ui-color-danger-text`, `-success-text`, `-warning-text`, `-info-text` and a readable `-accent-text` (each 4.5:1 or better on the surface and on its own tint), plus `--ui-color-danger-solid` / `-success-solid` and `--ui-color-foreground-on-danger` / `-on-success` for solid fills. The plain `--ui-color-danger` and the like are fill and icon colours, which read at only 3-4:1 as text on white. Field and form error messages (input, select, number and password fields, textarea, date and time pickers, tags input, file upload, fieldset, label), label, description, odometer, number ticker, chart and separator tones, tab and chip text, the solid app header and alert dialog, the gantt "today" pill and the dock badge now use them. The amber accent was used as text in tab labels, chips, labels and the sortable (about 2:1).
  - **Layout containers** (`ui-flex`, `ui-grid`, `ui-masonry-grid`, `ui-placement-grid`, `ui-presence`, `ui-portal`, `ui-direction-provider`) inherit their text colour instead of repainting it with the theme text colour, so content inside a contrast box or a solid header keeps the colour it was given (it was dark on dark).
  - **`ui-tabs`:** the selected tab of the solid variant is a surface chip with readable accent text (it was the dark on-primary colour with accent text, 2:1).
  - **`@editora/ui-react` `SplitButton`:** the label follows `--ui-color-foreground-on-primary` (white on the amber primary was 1.57:1).
  - Every story run with the real theme applied, in light: 171 stories with contrast findings before the redesign, 0 now.
  - **Open states (found by clicking every trigger in every story and running axe on what opens):** `ui-hover-card` names its `role="dialog"` panel (the author's label, else the trigger text, else the card heading); `ui-inline-edit` gives its editing field an accessible name (the label, else the placeholder); `ui-multi-select` while loading or empty is a valid listbox (`aria-busy`, an inert option); `ui-toast` uses a `div` for its toasts (`role="status"` is not allowed on `article`); the sidebar resize handle is a 24px target; `ui-dialog` submit text follows `--ui-color-foreground-on-primary`; the shared menu styles (`ui-menu`, `ui-dropdown`, `ui-context-menu`, `ui-menubar`) use the readable tone tokens for danger, success and warning items and stronger captions, shortcuts and section labels; the select group label, the accordion badge, the gantt sort header (also in its contrast variant) and the calendar's active month are readable; `@editora/ui-react` `SplitButton` menu text, descriptions, shortcuts and danger items are readable in the light, dark and fixed-white menu variants.

## 0.2.0

### Minor Changes

- c148036: The flat, Radix Themes style look, for the rest of the everyday components. Visible change, no API change.

  - **Alert:** a flat tint with a hairline in the tone colour, a plain icon (no circle), no shadow. The coloured bar on the leading edge is now opt-in: `indicator="line"` (it used to be on unless `indicator="none"`). Theme keys `alert.border`, `alert.shadow` and `alert.icon-size` are no longer pinned by the built-in themes.
  - **Slider, progress, meter, skeleton:** no box around the slider, a 4px track with a white thumb and no pulsing end dot; progress and meter are 6px with a solid fill (progress sizes xs/sm/lg are 3/4/8px); skeletons use the neutral fill colour.
  - **Avatar, breadcrumb, pagination:** a soft tinted avatar without border or shadow; the current breadcrumb is bold with no pill and no hover lift; pagination loses its bordered bar and uses 24/32/40px buttons from the control scale with a solid accent for the current page. The built-in themes no longer pin the avatar's border, shadow and background.
  - **Calendar:** days are plain cells (the bordered tile per day is gone), the selected day is a solid accent, outside days are the muted colour at full strength (4.5:1).
  - **Accordion, collapsible, stepper:** flat surfaces with dividers; the accent bar on an open accordion item is opt-in (`indicator="line"`); stepper steps have no card, a solid circle marks the current step.
  - **Toggle, toggle group, toolbar:** a pressed toggle is a soft accent with dark text (was a solid fill); `ui-toggle` no longer draws a default dot glyph (pass `icon-on` / `icon-off`); the toggle group and toolbar lose their padded box.
  - **Pin input, empty state, file upload:** 40px pin slots with a readable placeholder; the default action of the empty state and the "Choose files" button are primary buttons (the tinted version was unreadable on the amber accent).
  - **Hover card, drawer:** the flat overlay surface (solid panel colour, hairline, theme shadow).
  - Invalid-style glows on avatar and file-upload states are rings, not blurred shadows.
  - **Data and shell (second round):** `ui-table` and `ui-data-table` (a hairline frame, a subtle header and hover fill, 8px radius), `ui-tree` and `ui-tree-item` (no frame, 32px rows, a soft accent when selected), `ui-timeline` (no box), `ui-transfer-list` (no outer box or per-item borders, control radii), `ui-sidebar`, `ui-app-header` and `ui-navigation-menu` (control rhythm, soft accent for the current item, no shadow or padded box; the built-in themes no longer pin their border, shadow, radius or item size), `ui-form` and `ui-fieldset` (flat by default, `variant="surface" | "outline" | "soft" | "contrast" | "elevated"` draws the box), `ui-wizard` (flat frame, a solid primary button, steps without cards), `ui-chart` (no nested boxes, tone text at 4.5:1), `ui-command`, `ui-selection-popup`, `ui-floating-toolbar` and `ui-quick-actions` (the flat overlay surface), `ui-scroll-area`, `ui-date-field` and `ui-time-field` (the 32px control height), `ui-gantt` (no frame shadow, a soft accent for the active zoom), `ui-color-picker`, `ui-block-controls`, `ui-box`, `ui-card`, `ui-badge` and the date and time pickers' remaining states.
  - **No blurred glows left:** every focus and state halo of 3-4px is a 2px ring (a test fails if one comes back), and the remaining hover lifts are gone except the opt-in `animation` of `ui-button`.
  - **Decorative and layout components:** `ui-marquee`, `ui-animated-list`, `ui-animated-text`, `ui-spinning-text`, `ui-icon-cloud`, `ui-orbiter`, `ui-dock` and `ui-odometer` keep their motion but lose the card chrome (gradient surfaces, large radii and heavy shadows): a solid panel colour, a hairline, the theme radius, no shadow (the dock keeps a small one); the icon cloud's floor shadow is lighter. `ui-aspect-ratio` has no sheen, and its badge text meets 4.5:1. `ui-layout`, `ui-container`, `ui-section`, `ui-form` and `ui-fieldset` use the theme radius, and their boxed variants use the theme shadows instead of hard-coded ones.
  - **Verification pass (resize handles, radio group, beam, hover states):** `ui-splitter` is a hairline across the gap with a grip in the middle that turns accent on hover, focus and drag (the old handle was a faint 2px stub). `ui-radio-group` is plain rows with a ring-style radio by default; `variant="card"` and `variant="segmented"` keep the box. `ui-animated-beam` nodes and hub are flat (a hairline, no drop shadow) and the dock's badge and label no longer cast a glow. Controls that had no hover state now have one: pin input slots, the file-upload "Choose files" button, the colour picker's format tabs and Clear/Done buttons. Focus indication was checked on every focusable element in Chromium, Firefox and WebKit, in light and dark.
  - **Second verification pass (states):** the empty stars of `ui-rating` are a light neutral (they were the dark muted text colour); `ui-inline-edit` buttons and field use the control radius and height, with a solid primary Save, hover fills and the 2px ring; `ui-file-upload` file rows, remove button and drop surface are flat (a hairline, the theme radius, a 24px remove button, a hover border, and a soft accent with a 2px ring while dragging); `ui-dock` tiles have no border until active and no blurred backdrop smear behind the magnified icon, and the label uses the control radius; `ui-command` resets slotted native `<button>` rows (they kept the browser border) and dims disabled rows; `ui-color-picker` uses control radii, a solid primary Done button and no hover shadow on swatches.
  - **Third pass (the remaining states) and a keyboard fix:** `ui-rating` now responds to the arrow keys, Home and End when it has focus (the host is the `role="slider"` and the Tab stop, but the key handler only listened inside the shadow root, so Tab then an arrow key did nothing in every browser); its stars no longer carry a drop shadow or a hover tile; the progress bar of `ui-file-upload` is the accent colour while uploading and green only when the upload is complete (red on error), and its transitions respect reduced motion.

- 0453386: A flatter, Radix Themes style look for the everyday components, and a 6px default radius.

  This is a visible change; nothing about the API changes.

  - **Radius:** the default `radius` is 6px (was 4px), so controls, cards and panels are slightly rounder. Set `radius: '4px'` in your theme to keep the old shape.
  - **Buttons:** flat fills (no glow, no hover lift), a neutral `secondary` with a hairline border, a 2px focus ring, medium weight. `recipe` (`soft`, `surface`, `outline`, `ghost`) now works on every coloured variant; before it only changed `secondary`. Status fills (`danger`, `success`) are a shade deeper so white text meets 4.5:1 (it was 3.9:1 and 3.2:1), and `warning` takes dark text on an amber warning colour.
  - **Fields:** input, password, number, select, combobox, multi-select, tags, textarea and the date/time pickers have a stronger hairline border (it was about 10% black), a darker border on hover, and a 2px focus ring inside the border instead of a soft 3-4px glow. Invalid, success and warning states are a 1px ring in the status colour on top of the border (a 2px line), not a pale glow. The combobox no longer lifts on focus. Placeholder text is 4.5:1 or better (it was 2.7:1 in the select).
  - **`ui-field`** is flat: no border, background or padding. `variant="surface" | "outline" | "soft" | "contrast" | "elevated"` draw the box as before.
  - **`ui-tabs`** default is a line: a hairline under the tabs and a 2px accent line under the selected one, with no box around the tabs or the panel. The old pill look is `variant="segmented"`; the other variants are unchanged.
  - **Checkbox, radio, switch:** 16px checkbox and radio with a neutral border and a solid accent fill when checked (the check is dark on the amber accent), a 36x20px switch with a white thumb and a double-ring focus.
  - **`ui-card`** has one hairline border and no shadow; **`ui-badge`** is a soft tinted label with no border and a 4px radius (`variant="solid"` for a filled one).
  - New tokens: `--ui-color-placeholder` and `--ui-color-foreground-on-warning`. The built-in themes no longer pin the border of input, select and multi-select, the focus ring of input, the shadow, border and radius of card, or the look of badge, so the component defaults apply; custom themes that set them still win.

- 0eafaf4: One control scale: buttons and form controls now line up at 24 / 32 / 40px.

  Before, a default button was 36px, an input 40-42px, a select 42-44px and a multi-select 44px, so a row of them never lined up, and the three sizes differed per component. Now `ui-button`, `ui-input`, `ui-password-field`, `ui-number-field`, `ui-select`, `ui-combobox`, `ui-multi-select`, `ui-tags-input`, `ui-toggle` and the date and time pickers are 32px by default, 24px at `size="sm"` and 40px at `size="lg"`, with 12 / 14 / 16px text and the theme `radius` (previously 4, 10 or 12px depending on the component). `ui-textarea` takes the same text size, padding and radius. `ui-button` `scale` 1-4 maps to 24 / 32 / 40 / 48px. `ui-tags-input` gains `size`.

  This is a visible change: default controls are shorter than before (button 36 to 32px, input 40 to 32px, select 42 to 32px). Set `--ui-control-height-2: 36px` on the page to get the old button height back, or set `components.button['height-md']` (and the matching input, select and multi-select keys) in your theme; those still win over the scale. The built-in light and dark themes no longer define those height keys.

  Fixed: in the small size, the clear, show-password and dropdown-arrow buttons inside a field were 22-28px and now stay 24px tall (WCAG 2.2 target size).

- fa93f3a: Overlays: enter and exit animation, state attributes for CSS, and the top layer.

  - **Motion:** popovers, menus, menubar panels, dropdowns, selects, comboboxes, multi-selects, tooltips, dialogs and alert dialogs now fade and scale in from the side they open on and play a quick exit before they are removed. Before, most of them vanished instantly on close, and `ui-dialog` and `ui-alert-dialog` did not animate at all (their transition could not run out of `display: none`). Reduced motion turns it off. New variables: `--ui-overlay-in-duration`, `--ui-overlay-out-duration`, `--ui-overlay-shift`.
  - **State hooks:** open surfaces carry `data-state="open|closed"` and, when positioned, `data-side` and `data-align` (the positioner and `showPortalFor` set them next to `data-placement`).
  - **Top layer:** popover, menu, menubar, context menu, split button, tooltip, dialog and alert dialog use `popover="manual"` so they sit above every `z-index` on the page. Browsers without the Popover API keep the old stacking. The panels of select, dropdown, combobox and multi-select stay in their field (they are positioned inside it).
  - **Look:** popover, dialog, select, dropdown and combobox panels share one flat surface: the solid panel colour, a hairline border, the theme shadow and radius. The dialog has no divider above its footer and no empty gap when there is no error.
  - **Fixes:** the tooltip's exit animation never played (its cleanup removed the node first). The alert dialog's default confirm button had dark text on a grey fill (about 2.7:1); it now uses the primary fill, and tone fills are deep enough for white text.
  - New internal helpers (not exported yet): `openOverlay`, `closeOverlay`, `setPanelOpen`, `liftToTopLayer` and `OVERLAY_MOTION_CSS`.

- e6291c8: Design tokens: a semantic layer, a system light/dark theme and CSS output.

  - `applyTheme` now also sets role tokens derived from the 12-step scales (`--ui-color-fill*`, `--ui-color-line*`, `--ui-color-text-*`, `--ui-color-accent-*`), the focus ring (`--ui-ring-*`), a Radix-style control scale (`--ui-control-height-1..3` and matching font size, padding and radius) and overlay easing. They follow the accent palette, the gray scale and dark mode. Nothing reads them yet, so existing components look the same.
  - New `applySystemTheme()` applies the light or dark theme to match the operating system, follows changes live, and returns a function that stops following. It also sets `data-ui-mode` and `color-scheme`.
  - New `themeToCss(tokens, selector)` and `themeToVariables(tokens)` give the theme as a stylesheet or a plain object, for server rendering.
  - Fixed: `--ui-color-info` and `--ui-color-surface-elevated` were read by components (6 and 16 places) but never defined, so they fell back to a fixed light colour in every theme, including dark. The theme now defines both. A new test fails if a component reads a `--ui-color-*` token the theme does not define.

### Patch Changes

- 8cd343c: Fixes found by the end-to-end QA sweep of every story in Chromium, Firefox and WebKit.

  - **Scoped themes:** a theme that only sets raw colours (a dark `background`/`surface`/`text`, or a custom `primary`) now gets coherent derived roles. It used to inherit the light baseline's gray scale and amber accent scale, so a dark `ThemeProvider` panel showed light fills and borders, and a blue primary still got amber soft states. The affected scale steps are rebuilt from the theme's own colours; the shipped light and dark themes and the accent palettes are unchanged.
  - **`ui-alert`:** `variant="solid"` is a solid fill again (the tone rules had overridden it, leaving white text on a pale tint), with readable text per tone.
  - **`ui-toggle`, `ui-toggle-group`, `ui-toolbar`:** `tone` tints the pressed state in its own colour (it was the theme accent), and `variant="contrast"` has a solid light pressed fill (dark text on a dark tint was 1.4:1).
  - **`ui-wizard`:** the primary button of the contrast variant has dark text.
  - **`ui-chart`:** tone text mixes toward the chart's own text colour, so the contrast variant stays readable.
  - **`ui-calendar`:** events drawn on a selected day follow the day's text colour.
  - **`ui-data-table`:** a frame that scrolls but holds nothing focusable becomes a focusable, named region so the overflow can be reached from the keyboard; the loading state is dimmed less (text stays above 4.5:1).
  - **`ui-sortable`:** the helper text is no longer dimmed below 4.5:1.
  - **`@editora/markdown-editor`:** the footnote back-reference link is underlined (it differed from the surrounding text only by colour, 1.18:1).
  - **`ui-alert-dialog` and `ui-dialog` with `headless`:** the top-layer change made an embedded (headless) dialog jump to the top of the viewport and collapse its host. A headless dialog stays in the page flow again.
  - **Toggle groups and toolbars:** a `variant="contrast"` group or toolbar passes the contrast look to its child toggles (they stayed on the light look, dark text on a dark surface).
  - **Date and time pickers:** a locale tag the browser rejects (a typo in `locale`, or a profile whose `navigator.language` is the string "undefined") no longer throws "invalid language tag"; it falls back to `en-US`.

## 0.1.25

### Patch Changes

- 26e9a7b: `<ui-gantt>` / `Gantt`: a full planner, and fixes for the keyboard and focus bugs a real browser showed.

  Fixed:
  - The filter field took one character per render, and bars and expanders lost focus after a keyboard edit. Summary bars and `readonly` charts ignored the keyboard. A controlled `tasks` rewrite reset the scroll and the selection, `open: false` was ignored, and `showToolbar={false}` / `showToday={false}` did nothing in React.
  - Handlers ran twice after a render that changed nothing; dates with a time or offset moved a task a day with the viewer's time zone (they are now calendar days); on a phone the sticky task list covered the timeline (below 640px only the name column is kept).
  - Critical bars stayed blue or green (the inline tone beat the critical rule); they are now drawn in the danger tone.

  New:
  - **Time header and zoom**: two header rows (month over days or weeks, year over months or quarters), `week-start`, a Today pill, `zoom="fit"` (the whole project scaled to the chart's width), visible progress inside bars, and descriptive bar names with a shared tooltip (with the dates while you drag).
  - **Layout**: `fill` and `max-height`, `columns` and `grid-width` with a splitter you can drag or use with the arrow keys (`gridresize`), `labels` and `locale` to translate every word, finger-sized bars and handles on touch screens.
  - **Moving around**: the chart opens on today, a Today button, `scrollToDate()`, `scrollToTask()`, `toggleTask()`, `expandAll()` and `collapseAll()`; the task list is a keyboard-navigable treegrid.
  - **Editing**: a cancelable `beforetaskchange`, `snap`, scrolling at the edge while dragging, Escape to cancel a drag, rename in place (`taskrename`), `creatable` with `taskcreate`, `auto-summary` and `cascade` for parents, and `linkable` to draw dependencies by dragging and remove them with Delete (`linkcreate`, `linkdelete`).
  - **Scheduling**: broken dependencies are drawn red, `schedule="auto"` pushes the tasks that follow one you move, `critical-path` computes the critical path, `non-working-days` and `holidays` shade days behind the rows.
  - **Export**: `exportSvg()` returns the whole chart as an SVG string, and the chart prints as a whole.

  In `@editora/ui-react` the same options are props and events, `ref` gives the element's methods, and the new types (`GanttLabels`, `GanttColumn`, `GanttElement` and the detail types) are exported.

## 0.1.24

### Patch Changes

- 6d6ed5f: `<ui-sortable>`: cards can move between two sortables, lists can scroll by themselves, and there is one drag path.

  New:
  - **Between sortables**: elements with the same `group` (React `group`) take each other's cards. Hold a card over another one and it marks the place; drop and both report it, each with its own `before-change` (either can cancel it) and `change`, which carries `external: { direction: 'in' | 'out', peer }`, so each keeps its own state. A card goes with its children; a copy leaves the first board as it was and gets a fresh id. The receiving sortable's `canDrop` (`info.from` is the sender), `maxItems`, `accepts`, `allow-nesting` and lock state apply, ids must be unique across the group, and Alt nests in a card of the other one. Dragging between sortables is pointer-only; `moveSelectionTo(peer, { targetListId, beforeId?, parentId?, clone? })` does it from code and for the keyboard.
  - **Lists with a height of their own**: `lists[].maxHeight` and `list-max-height` / `listMaxHeight` (a number of px or a plain CSS length). A list taller than that scrolls by itself, dragging at its edge scrolls it, and the keyboard keeps the focused card (and the keyboard-drag placeholder) in view. A list whose cards fit does not scroll.

  Changed:
  - **One drag path.** The native HTML5 drag (`dragstart`/`dragover`/`drop`, used only by custom drag handles marked `draggable`) is gone: measured with a real mouse in Chromium, Firefox and WebKit, custom handles already used the pointer drag. The wrappers no longer set `draggable` on them, and the browser is not allowed to start a native drag while a card is held. The hidden "drop preview" box and the two labels only the native drag image used (`draggingOne`, `draggingMany`) are removed (both were never released).

- 8c417f0: `<ui-sortable>` is safer by default and much easier to use in other scenarios.

  **Behaviour change: a plain drag no longer nests.** The middle 40% of every card used to mean "drop inside", so reordering a flat list by dropping on the middle of a card nested it. Now the top half of a card is "before it" and the bottom half "after it". To nest with the pointer, hold Alt (Option) or drop on the far side of the card; the card highlights before you let go (`nest-trigger` / `nestTrigger`: `gutter` is the default, `modifier` is Alt only, `area` restores the old rule). The keyboard's "Nest inside" destinations and `allow-nesting="false"` are unchanged.

  New:
  - **Touch**: a card dragged by its body (or a custom handle) is lifted by holding it for 350 ms (`touch-hold-delay` / `touchHoldDelay`, 0 for none). Before, a touch drag on such a card scrolled the page and could not be dragged at all. The built-in handle still lifts at once.
  - **Guard rails**: `lists[].maxItems`, a `canDrop(info)` function (React `canDrop`), and a cancelable `before-change` event (React `onBeforeChange`, return `false` to cancel). A refused place never highlights, the keyboard skips it, and the lifted card turns red over it. `moveSelection()` now returns whether anything moved.
  - **`data`** on items and lists: any JSON value, carried through moves, copies, events and callbacks (always as a copy).
  - **`labels`** (React `labels`): replace any of the 56 texts the component shows or announces; **`hide-toolbar`** (React `hideToolbar`) hides the hint line from sight.
  - **Plain-JS rendering**: `renderItem`, `renderListHeader` and `renderEmptyState` as properties of the element, returning a DOM node or a string of HTML.

  Fixed:
  - The component took the focus after every render, even when it was not inside it: a focus ring on the first card before anyone touched the board, and focus stolen from a search box whenever the parent re-rendered it while someone typed. The focus is now put back only when it was on a card, or when a move, a click or `focusItem()` asked for it.
  - A highlighted drop position stayed on when the pointer stopped over a place that refuses the drop.

- f5bd2ae: Fix `<ui-sortable>` hiding the dragged card during a keyboard drag over "Nest inside <card>" when that card has no children yet. The branch check matched the exact string `class="item"` and so missed the placeholder (`item item-placeholder`); the card was gone from the screen until the drop.
- ca08a36: A new look for `<ui-sortable>`, and a few fixes that came with it.

  - Flat, lightly bordered cards on a quiet surface, tight spacing (a list is about half as tall as before: the invisible drop rails no longer take up room), a faint drag grip that shows fully on hover, focus, selection and touch, and a guide line under nested cards. The first card no longer looks focused when nothing is.
  - Dragging with the pointer now lifts the real card under the pointer (a copy, with a count badge for several items and a `+` for a copy), leaves an empty slot where it was, and marks the drop position with a thin line. The "Moving item" pill and the floating "Drop preview" box are gone. `drag-preview-size="compact"` now narrows the lifted card.
  - Lists sit side by side and the board scrolls sideways when they do not fit (min width `--ui-sortable-list-min-size`, 260px), and it keeps its scroll position across renders and scrolls to a card dropped into a far list. Holding a card at the edge of the board, or of a list that has its own scrollbar (`::part(items)`), scrolls it.
  - The "N items selected" line is hidden until something is selected. New parts: `items`, `drag-ghost`.
  - The README pictures show the new look.

## 0.1.23

### Patch Changes

- 16ae8ee: Rewrite the READMEs of `@editora/light-code-editor`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/ui-sortable` and `@editora/toast`, which are the npm pages of these packages, with screenshots and examples.

  Their images and links were relative paths that npm cannot show, and several examples did not run. Every example is now a file that is type-checked in strict mode and run in Chromium (React ones under `StrictMode`, drag and drop with the pointer and the keyboard), and the README quotes it word for word (`npm run check:readme-examples`). The screenshots are taken from the same examples (`npm run readme:screenshots`).

  Things the READMEs now get right that they did not: the `@editora/themes` tokens only set text, border and shadow colours (backgrounds are set by rules), the helpers it exports are documented; `@editora/ui-core` and `@editora/ui-react` list measured bundle sizes (a Button imported from the `@editora/ui-react` root is 1 MB gzipped up front, from its own entry 54 KB up front plus the rest of `ui-core` loaded later); `@editora/toast` documents its defaults (bottom right, four seconds, three visible, theme `system`) and that it is safe to import on the server.

- 8a37a0c: Fix two ways `<ui-form>` did nothing in plain HTML, found while testing the README example.

  - A `<ui-button type="submit">` (or `type="reset"`) inside a `<ui-form>` did nothing. The button looked for an ancestor `<form>`, but `<ui-form>` keeps its `<form>` in a shadow root, which `closest()` cannot see. It now calls the form's `requestSubmit()` and `reset()`.
  - A form whose markup is on the page before the script that registers the elements had no values and validated nothing. Elements are upgraded in the order they were defined, so a control such as `<ui-input>` could be upgraded before `<ui-form>`, find no `registerField()` on it, and never register. The form now asks the controls inside it to register again once it is upgraded. (React and other code that creates the elements after the import was not affected.)

- 3bfac80: Let `@editora/ui-core` be imported in a process without a DOM. Importing the package, any `@editora/ui-core/<name>` entry, or `@editora/ui-react` on a server threw `HTMLElement is not defined` (or `customElements is not defined`), so a Next.js page that server-renders a `'use client'` component using `@editora/ui-react/client` answered with HTTP 500. The element classes now extend a placeholder when there is no `HTMLElement`, and three registrations (`ui-sidebar`, `ui-color-picker`, `ui-number-field`) check for `customElements` like the other elements do. Nothing changes in a browser; the elements are still defined only there.
- b2dc737: Fix `<ui-sortable>` dropping a selection that is set before its items. The selection is kept only for ids that exist, so a `selection` that arrived before `items` (the order of a React render, or of a script that assigns `selection` first) was emptied and never read again once the items were there: a controlled `selection={['epic']}` showed "0 items selected". The selection is now read again whenever the items change.
- Updated dependencies [59c675b]
- Updated dependencies [59c675b]
  - @editora/icons@0.1.12

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
