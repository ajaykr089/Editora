---
"@editora/markdown-editor": minor
---

Keep typing fast in long documents, publish a smaller package, fix the accessibility and Safari problems found by checking it in real browsers, and add screenshots to the README.

- **Long documents.** Building the preview of a document of several thousand lines takes a few hundred milliseconds, and it was done after every character. While the source pane is being typed in beside it, the preview of a long document (20,000 characters or more) whose last build was slow now waits for a pause in the typing (a pause of twice the build time, between 120 ms and 1 s) and is never older than 2 s. A document that is short or quick to build is rebuilt in the same render as before, so nothing changes for it. Typing in a 6,600-line document in split view blocked the page for about 1.1 s per character; it is now the browser's own cost of editing (about 130 ms) with the preview and the highlighting following when the typing pauses. (The line-number work in `@editora/light-code-editor` is part of this.)
- **Smaller package.** `marked` and `marked-footnote` were listed as dependencies and also bundled into the build, so they were installed and shipped twice. They are now left to the bundler: the published files go from 134 KB to 78 KB (ESM) and 104 KB to 63 KB (CJS), and a project that already uses `marked` shares its copy.
- **Accessibility** (found with axe-core, WCAG 2.2 AA, and by keyboard in Chromium, Firefox and WebKit; axe now reports nothing in light or dark, in any view):
  - **No keyboard trap.** Tab indents in the source pane, so a keyboard user who tabbed in could not get out, and every Tab press edited the document. Escape then Tab (or Shift+Tab) now leaves it (the fix is in `@editora/light-code-editor`), and the text area is described by a new translatable hint, `labels.sourceHint`, so assistive technology can announce this.
  - **Contrast.** The selected view button (white on `#007bff`, 3.97:1), the title, the preview's label, the front matter's title, the empty state and the placeholder were below 4.5:1. They are darkened (dark theme unchanged, it already read well).
  - **Names.** The heading button and its menu items start with the glyph they show (`H2 Heading level: Heading 2`), so a name that can be read can be said; the arrow is hidden from assistive technology. The checkboxes of task items in the preview have names, new labels `taskDone` and `taskTodo`.
  - **Preview.** It is one named region (it was a `section` with the name, around a scrolling `div`) and can be focused, so a keyboard can scroll it, with a visible focus ring.
- **Safari: Escape in fullscreen.** Safari does not focus a button when it is clicked, so after pressing the fullscreen button the editor never heard Escape and could only be left with the button. Escape is now heard wherever the focus is (and still yields to a menu or the find panel that handled it).
- **Footnote numbers** no longer make their line taller than the lines around them.
- **README** with screenshots (split view, dark theme, rich text, the preview's front matter, footnotes and math), an Accessibility section and the keyboard notes.

**Version:** this is a minor release because the default editing surface changed to the markdown source in this series (pass `editorType="rich"` for the previous behaviour), which for a 0.x package is the version that tells people to look.
