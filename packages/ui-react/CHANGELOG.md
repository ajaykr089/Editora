# Change Log

## 0.3.0

### Minor Changes

- 48455d8: Charts carry their numbers as a table: one row per label and a column per series, with the chart's title as caption. It is always there for screen readers, which get the plot itself as a single image, and `show-table` (React `showTable`) shows it on screen below the chart.
- 1a8e02d: DataTable for server-driven admin screens. `server-side` (React `serverSide`) shows the rows it is given as the current page and never sorts, filters or slices them itself, while still reporting sort, filter and page changes; `total-rows` (`totalRows`) drives the summary and pagination. `hidden-columns` (`hiddenColumns`) hides columns by key or index. Rows with `data-href` become links: a click anywhere on the row (not on a control in it) or Enter follows it through the shared `navigate` contract, so `NavigationProvider` or `onNavigate` can route it; modifier and middle clicks open a new tab.
- c5cab3e: `FiltersBar` has a date range: `dateRange` / `onDateRangeChange` add a date-range picker, and `dateRangePresets` one-click ranges beside it (the active one shows as pressed). `commonDateRangePresets` provides last 7 and 30 days, this and last month, and this year in the user's local time.
- da7c0bd: Forms can show errors from a server response. `ui-form` has `setErrors({ email: 'Already registered' })`, `clearErrors(names?)` and `getErrors()`, and React's `Form` an `errors` prop that applies each new object once. Messages show on Editora fields as their own validation errors and on native inputs as their validity message with `aria-invalid`; the first field with an error, in page order, is focused. An error clears when its field is edited, and all of them when the form is validated or submitted again, so they never block the next attempt.

### Patch Changes

- Updated dependencies [48455d8]
- Updated dependencies [1a8e02d]
- Updated dependencies [a924a61]
- Updated dependencies [93a7258]
- Updated dependencies [69068ed]
- Updated dependencies [da7c0bd]
- Updated dependencies [e428bb3]
  - @editora/ui-core@0.4.0

## 0.2.0

### Minor Changes

- 56cc0f7: `Card.Actions` puts buttons or menus on the title's row inside `Card.Header`, at the end, without a wrapper (the header was a single-column grid). `EmptyState variant="plain"` draws no box of its own, for use inside a Card, table or panel. `Alert live={false}` (`live="false"`) is a static page banner: no `role="alert"`/`status` and no `aria-live`, so it is not announced when the page loads. Also fixes Card without a footer, which had no padding under its content.
- cddc05a: Input and Textarea take `description-position="below"` (React `descriptionPosition="below"`) to show the description under the field, above any error, instead of between the label and the field. The reading order for screen readers is unchanged.
- 5e8cd10: Layout `variant="shell"` for app frames: full viewport height (`--ui-layout-shell-height`), no outer frame or padding, unframed panels with one divider per edge, a sidebar column that follows the sidebar's width, and only the content area scrolling. AppHeader and Sidebar inside it lose their own outer border and radius (they read inherited `--base-*` tokens), so there are no boxes inside boxes. On narrow screens (`drawer-breakpoint`, default 980px) the shell's sidebar becomes an off-canvas drawer with a backdrop: AppHeader's menu button opens it (its `aria-expanded` follows), Escape, the backdrop or picking a link/item closes it, focus moves into it and back, and the rest of the page is inert while it is open. Other variants keep the stacked sidebar unless `mobile-sidebar="drawer"`. New: `sidebar-open` / `openSidebar()` / `closeSidebar()` / `sidebar-open-change`, and in React `sidebarOpen`, `onSidebarOpenChange`, `mobileSidebar`, `drawerBreakpoint`, `sidebarLabel`. AppHeader `showMenuButton="narrow"` shows the button only where the drawer is used.
- 4a5aea1: One router-agnostic link API. Sidebar, Breadcrumb, Tabs and Pagination dispatch the same cancelable `navigate` event (`detail.href`) before following a link; new-tab clicks stay with the browser and `navigation="client"` always keeps the page. New in React: `<NavigationProvider navigate={(href) => router.push(href)}>` routes every component's links through your router (React Router, Next.js, TanStack Router…), and each of the four takes `onNavigate`. Tabs accept `href` per tab (route tabs); Pagination's `hrefTemplate="?page={page}"` renders real page links. Also fixes `Breadcrumb.Item href` in React, which never rendered a link (the element read only `href`, the wrapper passed `data-href`).
- 1c27821: New pre-definition stylesheet for server-rendered pages: `@editora/ui-core/preload.css` (also `PRELOAD_CSS` from `@editora/ui-core/preload`, and `<EditoraPreloadStyle />` from `@editora/ui-react` / `@editora/ui-react/server` for the document head). Until the custom elements are defined it gives each element the display it will have, hides what it will hide (closed dialogs and drawers, menu and popover content, raw `<option>`s, every tab panel but the first) and reserves the height of form controls, labels, tab strips and cards. On a test page the content below moved 155–223px when the scripts loaded; with the stylesheet it moves about 5px, with no flash of hidden content. Every rule is scoped to `:not(:defined)` inside `@layer editora-preload`, so it stops applying once an element upgrades and app styles override it. Also: `ui-tabs` no longer overwrites an `id` the author set on a panel.
- 697ba7b: Text fields follow React's model for `<input>`. **Behaviour change:** `onChange` on `Input` and `Textarea` now fires on every keystroke (like `onInput`); the old behaviour, firing when the edit is committed on blur or Enter, is the new `onCommit` prop. New `defaultValue` on Input, Textarea, NumberField and Combobox sets the starting value of an uncontrolled field. `value` with a change handler is controlled: typing works when you store each value, and a value you reject or transform (for example upper-casing) is what the field shows, with the caret kept where the user typed. `value` without a handler is still an initial value. NumberField adds `onInput({ rawValue, value })` per keystroke and is controlled on commit (partial text such as `1.` is not a number yet); Combobox's selected `value` is controlled on selection. FiltersBar's search box is no longer forced to a controlled empty value when you pass `onSearchChange` without `search`.
- 3df4735: App-wide density: `ThemeProvider density="compact" | "default" | "comfortable"` (or `tokens.density` with `applyTheme`) rescales the shared control tokens every control sizes itself from: heights 28/32/36px for the default size, padding, font size and the default gap. A component's own `density` still overrides it.

### Patch Changes

- 12ef8d6: Dialog and AlertDialog put a single dialog in the accessibility tree: the panel inside the shadow root (named by its title, with `aria-modal`). The host no longer gets `role="dialog"` / `role="alertdialog"` added. The panel role is set with the new `dialog-role` attribute (the React `roleType` prop now writes it); a `role` attribute on the host is still read for backwards compatibility.
- 4d4c9ee: Controlled props win. When you pass `selected`/`value` (Tabs), `page` (Pagination), `value` (Select, Slider, RadioGroup, ToggleGroup, MultiSelect), `checked` (Checkbox, Switch), `pressed` (Toggle) or `open` (Dialog, Drawer, Dropdown, Popover) together with a change handler, the element now goes back to the prop when your handler does not accept a change, instead of drifting from React state. Without a handler the prop is still the initial value, as before. Text fields (Input, Textarea, NumberField, Combobox) are unchanged for now.
- 700c5f8: Every `@editora/ui-react/<Name>` entry now has both a default and a named export (the same component). Avatar, Checkbox, DirectionProvider, Portal, Presence, Progress, Radio, RadioGroup, ScrollArea, Separator and VisuallyHidden only had the named one, so `import Checkbox from '@editora/ui-react/Checkbox'` rendered "Element type is invalid".
- db566c8: React wrappers are correct on the first render: the element renders once with every prop applied, in the same commit, instead of showing its defaults until the next microtask (a test reading the shadow DOM straight after `render()` saw, for example, an Input without its label or a Meter without its value). Wrapper event listeners are attached before that render, so an event the element dispatches while rendering is no longer missed. `ui-rating` no longer drops an `aria-label` that is set after it named itself. New `flushPendingRender()` on every element runs a queued render immediately.
- 179505e: Container wrappers (Tabs, Dialog, AlertDialog, Drawer, Dropdown, Menu, ContextMenu, Menubar, NavigationMenu, Popover, Tooltip, HoverCard, Accordion, Collapsible, QuickActions, Sidebar, Layout, Alert) now only react to events their own element dispatches. A `change`, `open`, `close` or `select` bubbling up from a child (a checkbox in a tab panel, a dropdown inside a dialog) no longer calls the parent's `onChange`/`onClose`; a checkbox in a tab panel used to close the panel. Tabs also keep keyboard focus on the active tab when panel content re-renders (the tab strip is only rebuilt when the tabs themselves change, and focus is restored when it is), and only count their own tabs and panels, not those of a nested `ui-tabs`.
- c0e2cf4: Server-rendered HTML now carries the attributes the wrappers set on their elements (`label`, `description`, `size`, `selected`, `disabled`, ...). They were written only in layout effects, which do not run on the server, so the preload styles could not reserve a labelled field's height and elements upgraded from their defaults before hydration. Wrapper hosts, `Tabs.Tab` and `Tabs.Panel` also no longer log hydration mismatches for attributes the elements add to themselves when they upgrade.
- e94ea43: Stat, MetricCard, Kbd, CodeSnippet and SplitButton take their colours from the theme (ThemeProvider / applyTheme tokens, including the contrast-checked `--ui-color-*-text` steps) instead of fixed values such as `#2563eb`, so a custom brand palette or dark theme reaches them. The old colours remain as fallbacks when no theme is applied.
- 8c7a9f9: Select: `value=""` with a `placeholder` now shows the placeholder instead of the first option (the React wrapper synced `value` before `placeholder` and removed an empty value instead of writing it). `ui-select` also updates its shadow DOM in place after the first render instead of rebuilding it when options or slots change, so the combobox a test just found stays connected and clicking it opens the list (it used to be replaced one tick after mount, which made the list impossible to open from Testing Library), and focus survives option changes.
- 6f5a0cc: Sidebar: link items (`href`) dispatch a cancelable `navigate` event before the browser follows them. In React, `onNavigate={(d) => { d.preventDefault(); router.push(d.href); }}` routes without a page reload, and `navigation="client"` keeps the page on every link click. Clicks that open a new tab (Cmd/Ctrl/Shift/middle click, `target="_blank"`) are never intercepted. Enter on a link item now follows it (it was swallowed). `Sidebar.Group` and `Sidebar.Item` placed directly inside `<Sidebar>` now render; they used to be ignored ("No matches found") unless wrapped in `Sidebar.Content`.
- Updated dependencies [b25a486]
- Updated dependencies [8c7ae64]
- Updated dependencies [4c0898f]
- Updated dependencies [56cc0f7]
- Updated dependencies [7b34943]
- Updated dependencies [cddc05a]
- Updated dependencies [12ef8d6]
- Updated dependencies [e7315af]
- Updated dependencies [1e7ba3a]
- Updated dependencies [d0aec84]
- Updated dependencies [ea0ae06]
- Updated dependencies [5e8cd10]
- Updated dependencies [f303688]
- Updated dependencies [4a5aea1]
- Updated dependencies [2042a85]
- Updated dependencies [783d56b]
- Updated dependencies [74dce9b]
- Updated dependencies [1c27821]
- Updated dependencies [db566c8]
- Updated dependencies [179505e]
- Updated dependencies [616fed6]
- Updated dependencies [8c7a9f9]
- Updated dependencies [6f5a0cc]
- Updated dependencies [95a2110]
- Updated dependencies [3df4735]
  - @editora/ui-core@0.3.0

## 0.1.28

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

- Updated dependencies [ba42563]
  - @editora/ui-core@0.2.1

## 0.1.27

### Patch Changes

- Updated dependencies [c148036]
- Updated dependencies [0453386]
- Updated dependencies [0eafaf4]
- Updated dependencies [fa93f3a]
- Updated dependencies [8cd343c]
- Updated dependencies [e6291c8]
  - @editora/ui-core@0.2.0

## 0.1.26

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

- Updated dependencies [26e9a7b]
  - @editora/ui-core@0.1.25

## 0.1.25

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

- Updated dependencies [6d6ed5f]
- Updated dependencies [8c417f0]
- Updated dependencies [f5bd2ae]
- Updated dependencies [ca08a36]
  - @editora/ui-core@0.1.24

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
