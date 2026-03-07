# @editora/comments

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Comments plugin for Editora rich text editor.

## What It Does

- Adds inline comment anchors to selected text.
- Opens an editor-scoped comments side panel.
- Supports threaded replies and resolve/reopen actions.
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

- `addComment` captures current selection and opens the panel composer.
- `toggleComments` opens/closes the panel without losing editor context.
- Panel mounting is editor-root scoped for multiple editors on the same page.

## Notes

- Public package entry exports `CommentsPlugin`.
