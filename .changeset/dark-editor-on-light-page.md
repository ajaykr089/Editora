---
'@editora/themes': patch
'@editora/ui-core': patch
---

- Themes: a dark editor on a light page (an editor-only dark area) took the page's light `--ui` text colour, so its toolbar inputs had dark text on a dark field. The dark theme now takes the Editora UI palette only when the page itself is dark (`data-ui-mode="dark"`, or a dark marker on `html` / `body`); otherwise it keeps its own dark colours.
- `ui-sidebar`: danger-toned items read on the dark `contrast` and `gradient` variants (new `--ui-sidebar-danger-text` token, lifted towards white there).
