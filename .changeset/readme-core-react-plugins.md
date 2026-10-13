---
"@editora/core": patch
"@editora/react": patch
"@editora/plugins": patch
---

Rewrite the READMEs of `@editora/core`, `@editora/react` and `@editora/plugins`, which are the npm pages of the three packages.

The old READMEs documented APIs that do not exist (`createEditor({ content, onChange })` with `mount()` and `getJSON()` in core; `useEditor`, `useEditorState`, `ToolbarButton` and `ParagraphPlugin` in react; a catalog with subscript, superscript, audio and horizontal-rule plugins in plugins), and their images used relative paths that npm cannot show. The new ones describe what the packages do, with screenshots and examples:

- every example is a file that is type-checked in strict mode and run in Chromium, and the README quotes it word for word (`npm run check:readme-examples`);
- the screenshots are taken from the same examples (`npm run readme:screenshots`);
- core: the `<editora-editor>` element, its attributes, methods and events, the two bundles, and the sanitising rules;
- react: the props, the toolbar item names, the editor API, themes, and how to use the editor with Next.js (it cannot be imported on the server, so load it with `next/dynamic` and `ssr: false`);
- plugins: all 56 plugins with their toolbar item, entry point and import path, plus measured bundle sizes: importing one plugin from the root entry bundles the whole catalog (125 KB gzipped), `lite` costs 24 KB and a subpath import 1 KB.
