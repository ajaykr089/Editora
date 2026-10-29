# Change Log

## 1.0.30

### Patch Changes

- 74b6ac4: README: a "Try it live" link to a ready-to-run StackBlitz project, so the npm page lets people try the editor without installing anything. No code changes.

## 1.0.29

### Patch Changes

- 9fe059a: Clearer npm listing: a plain description and a focused keyword list (editor terms only; the unrelated UI-library and marketing keywords are gone), so the packages match the searches people actually make, such as "rich text editor", "wysiwyg" and "tinymce alternative". No code changes.
- Updated dependencies [9fe059a]
  - @editora/core@1.0.26

## 1.0.28

### Patch Changes

- fe65119: Media manager: paste and drop, captions, alignment and size, and the keyboard.

  - **Paste and drop to upload.** Pasting an image (a screenshot, a copied picture) or dropping image and video files on the editor puts a placeholder where they go, with its own progress and a cancel button, and swaps in the media when it is stored, as one undo step. Failures and refused files (too large, wrong type) say why. Text pasted together with a picture (spreadsheet cells, a copied page) stays text. `uploadOnPaste: false` turns it off.
  - **Figures and captions.** Inserted media is now `<figure class="rte-media" data-align>` with an optional `<figcaption>`; it can be aligned left, centre or right, captioned, and sized from a Size menu (small, medium, large, full width, original; relative to the visible width of the text). Alignment is plain margins and the figure shrinks to the picture (`display: table`), so saved HTML renders the same without the editor's CSS. Media from earlier versions is wrapped when it is aligned or captioned. `wrapInFigure: false` keeps the bare `<img>` / `<video>`. Enter in a caption goes on below, Backspace in an empty one removes it, and pasting into one is a line of plain text.
  - **Inserting at a caret splits the block.** A figure cannot live inside a paragraph (the HTML parser tears it out), so inserting splits the paragraph or heading around the caret instead of putting the figure inside it; at the end of the editor an empty paragraph is left to type in.
  - **Keyboard.** An arrow key at the edge of the paragraph beside media selects it (browsers skip over it), Alt+F10 moves into its toolbar (arrow keys, Enter or Space, Escape or Tab back to the text) and the toolbar keeps the focus on the button used. The corner handles use pointer events, so touch and pen drag them too, and show the size while dragging; they are larger on touch screens.
  - `mediaSlashItems` for `SlashCommandsPlugin({ items })` adds `/image` and `/video`. `getCleanEditorHTML` (core) now drops unfinished uploads, the editing-only `contenteditable` of figures, and captions nobody wrote in, so none of it reaches `onChange` or saved content.
  - **React:** `EditorContent` set `resize: both; overflow: auto; display: inline-block` on every image or video that was clicked, which put a second native resize grip on it, changed the saved content, and overrode block alignment. It no longer does.
  - Selecting by clicking a video's control bar no longer takes the click away from the video's own controls.

- 7e14517: Media manager: audio, embedded videos, galleries, stock photos and suggested alt text.

  - **Audio.** `insertAudio` and a picker for audio files; the result is a figure with an `<audio controls>` player that can be aligned and captioned, and is selected without taking the click from its controls. The Audio toolbar button is opt-in (`audio: true`) so that existing toolbars do not change; `audio` is a name for toolbar item lists in both toolbars, and `mediaSlashItems` has `/audio`. The default allowed types include MP3, WAV, Ogg, MP4/M4A, AAC and WebM audio. The repository's API server accepts and types audio (databases made before need `ALTER TABLE media MODIFY type ENUM('image', 'video', 'audio') NOT NULL`).
  - **Embedded videos.** The Insert Video dialog has an Embed tab for YouTube and Vimeo links, or the iframe snippet a site offers. Only the video's id is read; the iframe's address is built from it, so a pasted link cannot bring in another host, a script URL or extra parameters (YouTube's privacy-enhanced host, Vimeo's do-not-track setting). The player is a block figure that keeps its shape, loads lazily, can be aligned, captioned and sized, takes no mouse while editing (clicking it selects its figure) and survives the editor's sanitizer through the existing trusted-embed mark. `embedProviders` adds more services.
  - **Galleries.** Choosing two or more pictures offers Insert as gallery: one figure with a grid of equal-shaped pictures in 2 to 5 columns (a Columns menu in the toolbar) and one caption; each picture still has its own alt text, link, edit and replace, and can be removed alone. A gallery of stock photos carries their credits as its caption.
  - **Stock photos.** `stockProvider` adds a tab to the Insert Image dialog: you write `search` (calling your own backend, where the API key lives) and get a searchable, paged grid. Photos are inserted by address with their description as alt text and, by default, "Photo by <author> on <service>" as the caption. The editor calls no service itself.
  - **Suggested alt text.** `generateAltText` adds a Suggest button next to the alt text field in the picker and in the Edit alt text dialog. What comes back is tidied and put in the field for the person to read and change, never inserted on its own; failures are said next to the button.
  - An upload's type is now taken from the file that was sent rather than from the server's reply, so a server that files audio under another type cannot make it insert as something else.

- Updated dependencies [798b8e1]
- Updated dependencies [7f54946]
- Updated dependencies [fe65119]
- Updated dependencies [3e2a3a7]
- Updated dependencies [b01c88f]
- Updated dependencies [78aface]
- Updated dependencies [7e14517]
- Updated dependencies [dba8e5d]
  - @editora/plugins@1.1.0
  - @editora/core@1.0.25
  - @editora/themes@1.0.20

## 1.0.27

### Patch Changes

- ce68b95: Undo, dialogs, menus and a few plugins that did not do their job.

  **Undo and redo** (editor, web component and code editor):
  - Undo took back one character at a time and kept only the last 100 steps; typing is now grouped into words (a pause, a click, a caret key or Tab, undo and redo end a run; typing over a selection and deleting a selection are steps of their own) and 200 steps are kept.
  - After undo or redo the caret was left at the start of the document; it now goes back to the text that changed.
  - `<editora-editor>` never recorded typing, so Undo (the button and Cmd/Ctrl+Z) did nothing for typed text.
  - In the code editor, Ctrl/Cmd+Shift+Z undid again instead of redoing.

  **Keyboard and screen readers:**
  - Modal dialogs (Image, Video, Template, Preview, Math, Anchor, Code Sample, Emoji, Special Characters and the rest) now get a role and a name, take focus, keep Tab inside, and give the focus and the caret back when they close without changing the text.
  - The toolbar's block-type, font, alignment, line-height and capitalisation menus work with the keyboard in both `@editora/react` and `<editora-editor>`: they announce that they open a menu, take focus, move with the arrow keys, Home and End, choose with Enter or Space, and close with Escape.
  - The Spell Check panel is a named region; the Math dialog's controls are labelled; the media dialog's labels are tied to their fields, its tabs say which is selected, and its upload zone works with the keyboard.
  - In a table, Tab and Shift+Tab move between cells, and Tab in the last cell adds a row.
  - The Comments, Spell Check and Approval Workflow side panels take focus when they open, keep it when they redraw, and give it back to the editor when they close.
  - The Text Color and Background Color pickers could not be used from the keyboard: they opened without taking the focus and sat at the end of the page. They are now named dialogs that take the focus, keep Tab inside, and give the focus and the selection back to the text when they close.
  - Dialogs keep Tab inside in Safari, which does not Tab to buttons by default (the trap used to move the focus only at the first and last control).
  - The slash menu and the mention list tell a screen reader which suggestion is active, and the media dialog's hidden file input has a name.

  **Behaviour fixes:**
  - A URL can be typed in the Image and Video dialogs (the dialog was rebuilt on every keystroke, so only pasting worked), what is pasted there is escaped, and inserting media tells the editor, records Undo and puts the caret after it.
  - The slash menu ran a block command on the previous or next paragraph when the line was otherwise empty; it also now asks every command bridge before the browser's own command, so lists made from it match the toolbar.
  - Dialogs and panels pass an axe-core sweep in the light and dark themes: names for the code sample language select and the background colour input, tabs inside a tablist, text contrast of at least 4.5:1, and no `main` landmark inside the version diff dialog.
  - The floating toolbar of an image inside a link no longer lands on top of the editor toolbar.
  - Cycling the citation style (toolbar button or shortcut) now updates the Style dropdown in the Citations panel; it kept showing the old style.
  - Making a paragraph a list no longer leaves an empty paragraph before and after it, or moves the caret to the start of the line.
  - Choosing a heading keeps the selection.
  - The Math dialog opens with no network (KaTeX comes from the `katex` package, not a script from a CDN) and renders formulas with its layout rules embedded; its template grid no longer hides its last row.
  - Export Word no longer sends a request to `http://localhost:3001` on every click: there is no default API server any more, and with none configured the file is built in the browser. To use a backend, set `apiUrl` (`setGlobalApiConfig` or `setDocumentManagerConfig`). An empty `apiUrl` on a plugin now means "no API".
  - Spell-check suggestions rank the word that was meant first ("tset" gives "test", "wrods" gives "words").
  - The Comments panel no longer lies under the editor toolbar (a CSS variable was defined on the wrong element and the sticky toolbar sat above the panel).
  - Format Painter no longer writes styles the target already shows, so painting leaves no redundant inline styles.
  - Plugins no longer use the browser's `confirm()` and `prompt()`: removing media or a link, resizing, and discarding Source Editor changes use an in-page dialog with a named role, focus trap and Escape.
  - Undo history is capped by size as well as by count (about 40 million characters), and steps that start where the last one ended share a string, so a very large document no longer holds hundreds of copies.
  - Messages such as "Please select text first" appear in a live region instead of a blocking `alert()`.

- Updated dependencies [ce68b95]
  - @editora/core@1.0.24
  - @editora/plugins@1.0.23
  - @editora/themes@1.0.19
  - @editora/light-code-editor@1.0.19

## 1.0.26

### Patch Changes

- 74e8688: Fix two ways the React editor did not match its own documentation.

  - `toolbar={{ items: [...] }}` with `'heading'` (or `'paragraph'`) silently dropped the heading menu: the name was mapped to a `setHeading` command that the heading plugin no longer has (it is `setBlockType`), so nothing matched. The name now resolves to the heading menu, as it does in `@editora/core`.
  - The published typings were out of step with the component. `toolbar.items` also takes a string such as `'undo redo | bold italic'`, `content` also takes `minHeight`, `maxHeight` and `autoHeight`, and every field of `mediaConfig` is optional (it also takes `offline`). TypeScript users who followed the documentation got compile errors for all of these.

- e0c6fb4: Rewrite the READMEs of `@editora/core`, `@editora/react` and `@editora/plugins`, which are the npm pages of the three packages.

  The old READMEs documented APIs that do not exist (`createEditor({ content, onChange })` with `mount()` and `getJSON()` in core; `useEditor`, `useEditorState`, `ToolbarButton` and `ParagraphPlugin` in react; a catalog with subscript, superscript, audio and horizontal-rule plugins in plugins), and their images used relative paths that npm cannot show. The new ones describe what the packages do, with screenshots and examples:

  - every example is a file that is type-checked in strict mode and run in Chromium, and the README quotes it word for word (`npm run check:readme-examples`);
  - the screenshots are taken from the same examples (`npm run readme:screenshots`);
  - core: the `<editora-editor>` element, its attributes, methods and events, the two bundles, and the sanitising rules;
  - react: the props, the toolbar item names, the editor API, themes, and how to use the editor with Next.js (it cannot be imported on the server, so load it with `next/dynamic` and `ssr: false`);
  - plugins: all 56 plugins with their toolbar item, entry point and import path, plus measured bundle sizes: importing one plugin from the root entry bundles the whole catalog (125 KB gzipped), `lite` costs 24 KB and a subpath import 1 KB.

- Updated dependencies [e0c6fb4]
- Updated dependencies [16ae8ee]
  - @editora/core@1.0.23
  - @editora/plugins@1.0.22
  - @editora/light-code-editor@1.0.18
  - @editora/themes@1.0.18

## 1.0.25

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
  - @editora/core@1.0.21
  - @editora/light-code-editor@1.0.16

## 1.0.24

### Patch Changes

- da5bebd: Fixes from a real-browser audit of the UI packages.

  **ui-react / ui-sortable:** `className` was rendered as a literal `classname` attribute on custom-element hosts under React 16-18, so it never applied (about 115 wrappers); it is now mapped to `class`. Alert, Badge, Container, ContextMenu, DataTable, EmptyState, Field, Flex, Grid, Skeleton, Table, NavigationMenu and FloatingOverlay now forward refs. `Sortable` no longer crashes while `lists`/`items` are still undefined.

  **ui-core:** invalid selectors in `item-selector`, `direct-item-selector`, portal `target` and positioner `anchor`, and negative or oversized textarea `minlength`/`maxlength`, no longer throw. The transfer list, sortable lists, tab panels, multi-select, date-time picker and colour picker expose accessible names. `<ui-sortable>`: horizontal lanes now actually lay out horizontally; dropping on an empty list or below the last card works and a release no longer commits a stale target; keys typed into controls inside a card are no longer swallowed; keyboard dragging no longer stalls with `allow-nesting="false"`; a cancelled drag no longer leaves a card faded; right-to-left lanes navigate and drop in reading order; dragging near the page edge auto-scrolls.

  **collaboration:** content received from peers can no longer execute (scripts, event handlers, `javascript:` URLs and embeds are filtered), a destroyed binding fully detaches, a caller-supplied doc is no longer destroyed, a supplied provider's own doc is used, editors without an id no longer share the empty room, and a warning is logged when the public demo server is used by default.

  **plugins:** 39 duplicate/generic ids (e.g. `id="icon"`) removed from toolbar icon SVGs.

  **core / react:** the editing surface always has an accessible name (host `aria-label`, then the placeholder, then "Rich text editor").

- Updated dependencies [da5bebd]
  - @editora/plugins@1.0.21
  - @editora/core@1.0.20

## 1.0.23

### Patch Changes

- f1326f5: Fix several editor behaviours found while testing the web component and the React wrapper.

  - Table resize handles no longer leak into saved HTML. While the caret was in a table the table plugin put its drag handles (and a `position: relative` anchor style on the header cells) inside the document, and they appeared in every `onChange`, `content-change`, `getContent()`/`getHTML()` and autosave value. They are now stripped from everything the editor emits (new `stripEditorUiArtifacts` / `getCleanEditorHTML` helpers in `@editora/core`), and the table plugin removes the anchor style when the handles go. React's controlled-value comparison uses the cleaned DOM so typing inside a table does not rewrite the content.
  - `@editora/react`: the editor no longer steals focus from other fields. It called `focus()` inside the effect that depends on `onChange` and the config props, so any parent re-render that produced a new `onChange` (an inline arrow function) pulled focus back into the editor: typing in a title field next to a controlled editor lost focus after one character, and a controlled editor could put later characters at the start of the paragraph. It now focuses only on mount and when it becomes editable.
  - `<editora-editor>` keeps its edited content when it is moved in the DOM or reconfigured with `setConfig()`; it used to reset to the original `data-initial-content`.
  - `createPluginManager()`, declared in the typings but never implemented, now exists.

- Updated dependencies [f1326f5]
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19
  - @editora/plugins@1.0.20

## 1.0.22

### Patch Changes

- 4bf4290: Sanitise content handed to the editor before it is parsed, not only on the first edit. React's `value`, `defaultValue`, restored autosave and `setHTML`, and the web component's `data-initial-content`, restored autosave and `setContent` all assigned HTML to `innerHTML` unsanitised, so stored content such as `<img src=x onerror=…>` ran on load (and in read-only editors, which never fire an input event). These paths now use the same allowlist and opt-outs as typed input (`content.sanitize: false` or `security.sanitizeOnInput: false` keep the old behaviour). Editor-inserted embeds (`data-editora-embed`, http(s) `src`) survive a reload; other iframes are removed.

  Also fixes the trusted-embed exemption in `sanitizeInputHTML`: a single trusted embed used to unlock every later `<iframe>` in the same document (including an unmarked one or one with a `javascript:` src). The decision is now made per iframe.

  Note for web-component users: children placed inside `<editora-editor>` in your page's HTML are parsed by the browser before the element upgrades, so pass untrusted HTML through `data-initial-content` or `setContent()`.

- Updated dependencies [4bf4290]
  - @editora/core@1.0.17

## 1.0.21

### Patch Changes

- a3723fa: Fix a stray blank strip appearing between the editor's content box and its status bar (or bottom toolbar), with the content box's own rounded corners and border making it look like a separate, disconnected box floating above the status bar. `EditorContent`'s contenteditable element had a hardcoded `marginBottom: "16px"` and always rounded its bottom corners, even when a status bar or bottom toolbar immediately followed it - unlike the top edge, which has no such margin and sits flush against the toolbar above it. Found via a user screenshot showing the gap in both light and dark themes. Fixed by removing the unconditional bottom margin and only rounding the content box's bottom corners when nothing follows it (`RichTextEditor` now tells `EditorContent` whether a bottom toolbar or status bar is present via a new `roundBottomCorners` prop), so the content flows seamlessly into whatever comes next.
- a1640aa: Fix the embed-iframe plugin being completely non-functional: every inserted `<iframe>` was silently stripped back out within moments of insertion. `iframe` is deliberately excluded from the editor's default `sanitizeOnInput` allowlist - a real security boundary, since arbitrary pasted or typed content shouldn't be able to silently embed one - with a comment claiming "the embed-iframe plugin inserts iframes through its own explicit, user-initiated dialog, a different trust boundary that never calls through this sanitizer." That claim didn't hold: the plugin dispatched a plain `input` event after inserting, exactly like every other plugin's change notification, and `EditorContent`'s `handleInput` sanitizes on every `input` event unconditionally - there was no actual mechanism distinguishing the plugin's trusted insertion from arbitrary content, so the sanitizer stripped the iframe regardless.

  Found via live testing: inserting an embed through the dialog showed it for a moment, then it vanished, leaving an empty paragraph behind, with no error anywhere.

  Fixed by giving `sanitizeInputHTML` (never `sanitizePastedHTML`, so the paste boundary is unaffected) an `additionalAllowedTags` parameter, and having `EditorContent`'s `handleInput` read it from `event.detail.allowedTags` when the triggering event is a `CustomEvent` - letting one specific, already-in-the-trusted-DOM mutation keep a tag the default allowlist excludes, without reopening that tag to arbitrary input. The embed-iframe plugin now dispatches its post-insert event as `new CustomEvent('input', { detail: { allowedTags: ['iframe'] } })` instead of a plain `Event`, and `iframe` gets a dedicated entry in the attribute allowlist (src, sizing, fullscreen, scrolling/border) so the inserted embed keeps its full intended functionality rather than just surviving as a bare, unstyled frame.

  Verified live: an inserted iframe now survives with all its attributes intact, while both a simulated paste and a plain `input` event carrying a raw `<iframe>` tag are still correctly stripped - the security boundary the original design intended is now actually enforced, for arbitrary content, while the one trusted path works.

- 53a8021: Fix the floating selection toolbar's "Code" button, which only ever wrapped the selection in `<code>` and was not a real toggle. Clicking it on text already inside a `<code>` element nested a second `<code>` inside the first instead of removing the formatting, and `Range.surroundContents()` - used for the initial wrap - throws an uncaught `InvalidStateError` whenever the selection starts or ends partway into another element (e.g. partially overlapping a `<b>` run), which is a completely ordinary selection pattern. In that case the button silently did nothing.

  Found via live testing: re-selecting already-coded text and clicking "Code" again produced invalid nested `<code><code>...</code></code>` markup, and selecting text that partially overlapped a bold span threw an uncaught exception with no visible effect.

  Fixed by detecting when the whole selection already sits inside one `<code>` element and unwrapping it instead of wrapping again, and by using `range.extractContents()` to build the wrapped fragment instead of `surroundContents()`, which correctly splits any partially-selected element rather than throwing. Verified live: wrap, toggle-off, and a boundary-crossing selection all now work correctly.

- e756a24: Fix the shared `InlineMenu` React component (used by any `type: "inline-menu"` toolbar item - currently Capitalization and Text Alignment) rendering with its hardcoded light colors even inside a dark-themed editor. The existing dark-mode CSS only matched via an ancestor selector (`[data-theme="dark"] .rte-inline-menu`); despite the menu remaining a DOM descendant of the dark-themed wrapper (it uses `position: fixed` for placement, not a body portal), the menu was still painting with its light-theme background live in the browser. Fixed by having the component itself detect the dark-theme context from its anchor button (the same approach `@editora/mentions` and the newly-fixed `@editora/slash-commands` use) and apply an explicit `rte-inline-menu-theme-dark` class, with matching CSS added as a robust fallback alongside the existing ancestor-selector rule. Verified live: correctly dark in a dark-themed editor, unchanged (light) in a light-themed one.
- c26b303: Fix `@editora/react` pasting/typing content through an entirely separate, unpatched, hand-rolled HTML sanitizer instead of `@editora/core`'s DOMPurify-based one. `packages/react/src/utils/sanitizeHTML.ts` was a near-exact duplicate of the sanitizer `@editora/core` replaced with DOMPurify in an earlier release - same weak `value.startsWith('javascript:')` URL-scheme check (vulnerable to the well-known embedded-whitespace bypass, `href="jav&#9;ascript:alert(1)"`), and, found via live-browser paste testing, a live-DOM-parsing execution issue: it assigned untrusted pasted HTML directly to a real `<div>`'s `innerHTML` to walk and clean it, which lets the browser fire an `<img onerror=...>` (or `onload`, etc.) the instant the markup is parsed - before the cleanup pass ever ran - even though the final stored HTML came out clean. `@editora/core`'s sanitizer already avoided this by using DOMPurify's own safe internal parsing.

  `@editora/core` now exports `sanitizeHTML`/`sanitizePastedHTML`/`sanitizeInputHTML` (plus their config types) from its public entry point; `@editora/react`'s `EditorContent.tsx` imports these instead of its own copy, and the duplicate file is deleted.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [bb57fc7]
- Updated dependencies [bb57fc7]
- Updated dependencies [bb57fc7]
- Updated dependencies [e756a24]
- Updated dependencies [c26b303]
- Updated dependencies [6efb2ba]
- Updated dependencies [e74d395]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
  - @editora/plugins@1.0.18
  - @editora/light-code-editor@1.0.15
  - @editora/themes@1.0.16

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.20](https://github.com/ajaykr089/Editora/compare/@editora/react@1.0.11...@editora/react@1.0.20) (2026-09-05)

**Note:** Version bump only for package @editora/react

## 1.0.11 (2026-03-08)

**Note:** Version bump only for package @editora/react

## 1.0.10 (2026-03-05)

**Note:** Version bump only for package @editora/react

## 1.0.4 (2026-02-28)

### Changed

- Updated package publish metadata and declaration entrypoint resolution.
- Aligned peer dependency ranges for `@editora/core`, `@editora/plugins`, and `@editora/themes` to `^1.0.4`.

### Packaging

- Included top-level declaration entry in published files.

## 1.0.2 (2026-02-13)

**Note:** Version bump only for package @editora/react

## 1.0.1 (2026-02-12)

**Note:** Version bump only for package @editora/react
