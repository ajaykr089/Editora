---
"@editora/react": minor
---

The editor no longer takes focus when it mounts. It used to focus its editing area on every mount (and whenever it turned editable), and focusing scrolls the page, so a page with an editor further down opened scrolled to the editor, and focus left whatever field the user was in. The new `autofocus` prop brings the old behaviour back where you want it: `<EditoraEditor autofocus />`. This matches the web component, which only focuses with its `autofocus` option.
