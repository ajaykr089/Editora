---
"@editora/light-code-editor": minor
"@editora/toast": patch
---

A modern look and real accessibility for the code editor's overlays, and contrast preferences for the toast.

**`@editora/light-code-editor`**
- **Accessibility:** the editing surface is a named, multi-line `role="textbox"` (`aria-readonly` when read-only), with a new `ariaLabel` option. The completion popup is a combobox listbox, not an unnamed dialog: the editor carries `aria-activedescendant`, `aria-controls` and `aria-haspopup` while it is open, options have ids, the list is focusable for scrolling and the status line is a polite live region. Find is a named `search` landmark with named inputs and icon buttons, go to line is a named group (its "Go" button's name now contains its visible text), the hover card and the context menu are named, and the fold toggles are buttons with `aria-expanded`.
- **Contrast:** muted text (gutter, meta, descriptions, shortcuts) was 3.6:1 on the active row in the dark theme; it is 4.5:1 or better in both themes, and the completion match highlight keeps 4.5:1 on the active row.
- **Look and feel:** one overlay system for find, go to line, completions, the context menu and the hover card (a raised surface, a hairline, a soft shadow, a 120ms pop-in that respects reduced motion, one focus ring). Completions get a coloured kind badge, a highlighted match, an accent bar on the active row, one-line descriptions and a keyboard-hint footer. Find options are toggle chips with a check mark, buttons use icons, fold toggles are chevrons that appear when the gutter is hovered (folded regions always show theirs), and the editor scrolls with a thin scrollbar.
- **Theme:** `setTheme()` also writes `--editor-surface`, `--editor-surface-hover`, `--editor-border-strong`, `--editor-accent`, `--editor-accent-soft`, `--editor-accent-contrast` and `--editor-shadow` (see the README); the dark gutter foreground is `#a6a6ab` (was `#858585`).

**`@editora/toast`**
- The toast honours `prefers-contrast: more` (a full-strength border, no shadow, full-strength description text, an always-visible close button) and Windows High Contrast / `forced-colors` (system colours for the card, text, actions, close button and progress bar).
