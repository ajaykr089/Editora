# @editora/special-characters

[![Version](https://img.shields.io/npm/v/@editora/special-characters)](https://www.npmjs.com/package/@editora/special-characters)
[![License](https://img.shields.io/npm/l/@editora/special-characters)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

A picker for symbols, currency signs, quotation marks, accented letters and arrows, inserted at the caret.

## Installation

```bash
npm install @editora/special-characters
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { SpecialCharactersPlugin } from "@editora/special-characters";
// or: import { SpecialCharactersPlugin } from "@editora/plugins";

const plugins = [SpecialCharactersPlugin()];
```

## Command

- Command: `insertSpecialCharacter`
- Toolbar item: **Special Characters**

## The dialog

A search field and the categories **All**, **Currency**, **Text**, **Quotation**, **Mathematical**, **Extended Latin**, **Symbols** and **Arrows**. The focus starts in the search field; choose a character with the mouse or the keyboard. Escape closes the dialog and gives the caret back.
