---
"@editora/toast": minor
---

No CSS to import, JSX in React, and a smaller bundle.

- **The styles are built in.** The first toast puts them in a `<style>` at the start of `<head>` (so the app's own CSS still wins), unless `toast.css` is already on the page. Importing `toast.css` keeps working. Under a content security policy, `configure({ nonce })` or `<meta property="csp-nonce">` gives the `<style>` its nonce; `configure({ injectStyles: false })` turns it off.
- **`@editora/toast/lite`**: the same API without the built-in stylesheet, for apps that load `toast.css` themselves (about 5 KB gzipped smaller).
- **`@editora/toast/react`**: `toast` takes JSX as the title, message, description and icon; `toast.custom(render, options?)` shows your own component in the toast; `<Toaster />` renders that JSX through portals, so it sees the app's context, and takes the settings as props. It is marked `"use client"`. React 16.8 to 20 are supported (optional peer dependencies).
- **DOM nodes** can be the `title`, `message` and `description` of a toast, as they already could be its `icon`. A toast with node content is a duplicate only by `dedupeKey`, and a ResizeObserver lays the stack out again when a toast's content changes size.
- **`toast.promise` keeps the loading toast until the promise settles.** Before, a promise slower than `duration` lost its toast and the success or error was never shown. A result can also be a function that returns options: `success: (file) => ({ title: ..., description: ... })`.
- **Smaller**: the spring, bounce, slide, zoom, flip, fade, elastic and rotate animations are a separate file, loaded the first time one is used. With its styles included, the package is about 15 KB gzipped in an app (it was 12.5 KB plus 5.6 KB of CSS).
- The `browser` field and export condition are gone: they pointed bundlers that read them (webpack 4) at the UMD build instead of the ES module one. The UMD file is unchanged in place, and now brings its styles too.
- The stale `.d.ts` files that were committed in `src/` are removed (the published typings are built into `dist/`).
