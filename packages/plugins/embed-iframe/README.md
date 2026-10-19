# @editora/embed-iframe

[![Version](https://img.shields.io/npm/v/@editora/embed-iframe)](https://www.npmjs.com/package/@editora/embed-iframe)
[![License](https://img.shields.io/npm/l/@editora/embed-iframe)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Embeds a page or a video in the document with an iframe, from a dialog.

## Installation

```bash
npm install @editora/embed-iframe
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { EmbedIframePlugin } from "@editora/embed-iframe";
// or: import { EmbedIframePlugin } from "@editora/plugins";

const plugins = [EmbedIframePlugin()];
```

## Command and shortcut

- Command: `openEmbedIframeDialog`
- Toolbar item: **Embed Iframe**
- Shortcut: `Mod-Shift-e`

## Notes

- The dialog asks for a source URL (and, under **Advanced**, a description URL and more); only `http:` and `https:` URLs with a host are accepted, and the field says what is wrong when one is not.
- YouTube (`watch`, `youtu.be` and `embed` links) and Vimeo links are turned into their embed URLs.
- An `<iframe>` is not in the editor's default allowlist, so pasted or typed content cannot embed one silently. This plugin marks its own insertion as trusted for that one change, and nothing else.
- Opening the dialog moves the focus into it, keeps Tab inside it, and gives the focus and the selection back when it is cancelled.
