# Change Log

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
