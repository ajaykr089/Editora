---
"@editora/slash-commands": patch
---

Fix the slash command panel ("/" menu) always rendering with a hardcoded white background and black text, even inside a dark-themed editor. The panel is appended to `document.body` (so it can position itself freely near the caret), which puts it outside the DOM scope of a per-instance dark-theme wrapper (e.g. `<div data-theme="dark">` around one editor among several on a page) - the existing dark-mode CSS only matched via an ancestor selector, which can never reach an element appended to `document.body`. Found via live-browser testing with two independently-themed editors on the same page. Fixed the same way `@editora/mentions` already handles this: detect the dark-theme context from the editor element itself (not the panel's DOM position) and toggle an explicit class on the panel each time it's shown.
