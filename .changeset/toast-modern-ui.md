---
"@editora/toast": minor
---

Toast: a modern look, a stack that opens on hover, keyboard access and a complete `toast` API.

**Look.** The card is now opaque and neutral, with a status icon (one shape per level, a spinner for loading), instead of a 6% tint with a coloured stripe. The old tint made the toast 94% transparent, so the page showed through its text, and in dark mode the primary action button was white on white. The `dark` theme is now dark (it was a white card), `richColors` tints the card, `colored` and `glass` meet 4.5:1 contrast, and every theme was checked at 4.5:1 for text and 3:1 for icons in light and dark. `system` follows `prefers-color-scheme` and the app's own switch (a `dark` class or `data-theme`, `data-bs-theme`, `data-color-scheme`, `data-mantine-color-scheme` on `<html>`). `icon` accepts text, a DOM node or `false`; `configure({ icons: false })` turns the built-in icons off.

**Stacking.** Several toasts fold into a deck by default (`stack: true, expand: false`): the newest in full, older ones as edges behind it; hover, focus or a tap opens it into a list. The newest toast is now always nearest the edge of the screen (it was farthest). A dismissed toast leaves the layout at once. `configure({ stack: false })` gives a plain list. The layout uses `translate`/`scale`, so the animation types and swipe-to-dismiss still work.

**Behaviour.** Timers hold for the whole stack while it is hovered or focused and keep the time that was left (they used to restart from the full duration); a toast that arrives meanwhile is held too. Toasts are Tab stops; Alt+T (`hotkey`) focuses the newest, Escape dismisses the focused one and hands focus on; `pauseOnFocus` is on by default.

**API.** `toast('text')` shows a plain toast, and `toast.show`, `.promise`, `.update`, `.dismiss(id?)` (no id clears all), `.clear` and `.configure` complete the simple API; they do nothing on the server. `toast.promise(…, { success: { title, description } })` now replaces the loading text instead of keeping it.

**Fixes.** The progress bar had no styling and a zero-width track, so it never showed; it now sits in the text column and survives a message update. The primary action button took its colours from `:root`, so themed toasts got the wrong fill.

**Upgrading.** The layout uses the individual `translate` and `scale` CSS properties, so it needs Chrome 104, Safari 14.1 or Firefox 72 or later. If you styled toasts with CSS, the `::before` accent stripe and the tinted `background` of the level classes are gone: use the `--et-*` variables (`--et-bg`, `--et-text`, `--et-success`, …) or restyle `.editora-toast`. `configure({ stack: false })` restores a list; `configure({ icons: false })` removes the icons. The package is 15 KB gzipped JS plus 5 KB CSS (12 KB + 7 KB before); the README's "9 KB" figure was out of date.
