---
"@editora/core": patch
"@editora/plugins": patch
"@editora/react": patch
"@editora/text-color": patch
---

Make `@editora/core`, `@editora/plugins` and `@editora/react` importable on the server, and `<EditoraEditor />` renderable there.

Before, importing any of them in Node threw (`HTMLElement is not defined`, then `document is not defined`), so a Next.js page whose `'use client'` file imported `@editora/react` returned HTTP 500: client components are rendered on the server first, and the only way to use the editor was `next/dynamic(..., { ssr: false })`. Now:

- `@editora/core`: `RichTextEditorElement extends HTMLElement` was evaluated when the module loaded. It extends a stand-in class when there is no `HTMLElement`; the custom element is still only ever defined in a browser.
- `@editora/plugins` and `@editora/text-color`: the text-color plugin read `document.readyState` at module scope, which broke `@editora/plugins`, `@editora/plugins/lite` and `@editora/plugins/text-color`. It now checks that a document exists first.
- `@editora/react`: while rendering, the editor ran every plugin's `init` hook, also on the server. They build DOM and add listeners (`collaboration` queued an editor claim on every render, which nothing on the server ever takes), and 15 of the 17 in the enterprise set threw and logged `document is not defined` per render. On the server the plugins are now only listed, which is all the toolbar needs, and `init` runs in the browser as before. The inline menu's raw `useLayoutEffect`, which React 18 warns about on every server render, uses the same server-safe wrapper as the toolbar.

The server renders the editor shell (toolbar and an empty content area) and the content appears on hydration. Checked with Next.js 15 and React 19, `next dev` and a production build: HTTP 200, no hydration messages, typing and the toolbar work.
