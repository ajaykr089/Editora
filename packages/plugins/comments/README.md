# @editora/comments

[![Version](https://img.shields.io/npm/v/@editora/comments)](https://www.npmjs.com/package/@editora/comments)
[![License](https://img.shields.io/npm/l/@editora/comments)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/comments)](https://bundlephobia.com/package/@editora/comments)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Comments plugin for Editora rich text editor.

## What It Does

- Adds inline comment anchors to selected text, or a note about the whole document.
- Opens an editor-scoped comments side panel with Open / Resolved / All tabs.
- Threads show the author, a relative time, the quoted text, replies, and resolve/reopen and delete actions.
- Supports showing/hiding comments per editor instance.
- Integrates with editor theming and multi-instance behavior.

## Installation

```bash
npm install @editora/comments
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { CommentsPlugin } from "@editora/comments";

const plugins = [CommentsPlugin()];
```

## Toolbar Commands

- `addComment` (toolbar label: `Add Comment`)
- `toggleComments` (toolbar label: `Show / Hide Comments`)

## Behavior Notes

- `addComment` opens a new-comment form in the panel. With text selected the form quotes it and the comment is anchored there; with nothing selected it is a note for the whole document. Enter posts, Shift+Enter adds a line, Escape cancels.
- Clicking highlighted text opens its thread. Threads are listed in document order, notes last.
- `toggleComments` opens/closes the panel without losing editor context.
- Panel mounting is editor-root scoped for multiple editors on the same page.

## Notes

- Public package entry exports `CommentsPlugin`.
