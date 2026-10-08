---
"@editora/markdown-editor": minor
---

Keep typing fast in long documents, publish a smaller package, and add screenshots to the README.

- **Long documents.** Building the preview of a document of several thousand lines takes a few hundred milliseconds, and it was done after every character. While the source pane is being typed in beside it, the preview of a long document (20,000 characters or more) whose last build was slow now waits for a pause in the typing (a pause of twice the build time, between 120 ms and 1 s) and is never older than 2 s. A document that is short or quick to build is rebuilt in the same render as before, so nothing changes for it. Typing in a 6,600-line document in split view blocked the page for about 1.1 s per character; it is now the browser's own cost of editing (about 130 ms) with the preview and the highlighting following when the typing pauses. (The line-number work in `@editora/light-code-editor` is part of this.)
- **Smaller package.** `marked` and `marked-footnote` were listed as dependencies and also bundled into the build, so they were installed and shipped twice. They are now left to the bundler: the published files go from 134 KB to 78 KB (ESM) and 104 KB to 63 KB (CJS), and a project that already uses `marked` shares its copy.
- **README** with screenshots (split view, dark theme, rich text, the preview's front matter, footnotes and math).

**Version:** this is a minor release because the default editing surface changed to the markdown source in this series (pass `editorType="rich"` for the previous behaviour), which for a 0.x package is the version that tells people to look.
