# @editora/emojis

[![Version](https://img.shields.io/npm/v/@editora/emojis)](https://www.npmjs.com/package/@editora/emojis)
[![License](https://img.shields.io/npm/l/@editora/emojis)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

An emoji picker: a searchable dialog with categories, inserting the chosen emoji at the caret.

## Installation

```bash
npm install @editora/emojis
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { EmojisPlugin } from "@editora/emojis";
// or: import { EmojisPlugin } from "@editora/plugins";

const plugins = [EmojisPlugin()];
```

## Command and shortcut

- Command: `openEmojiDialog`
- Toolbar item: **Emojis**
- Shortcut: `Mod-Shift-j`

## Notes

- The dialog has a search field and a list of categories (vertical tabs, horizontal on a narrow screen). Typing in the search field filters the emojis shown.
- The focus starts in the search field. Escape closes the dialog and the caret goes back where it was.
- An insertion is recorded in the history, so Undo takes the emoji back out.
