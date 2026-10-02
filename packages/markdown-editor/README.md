# @editora/markdown-editor

A lightweight markdown editor package for the Editora ecosystem with an editor/preview experience and formatting helpers.

## Features

- Markdown text input surface
- Split editor and preview layout
- Toolbar helpers for bold, italic, headings, lists, quotes, and code
- Controlled and uncontrolled usage
- React component API

## Usage

```tsx
import { MarkdownEditor } from '@editora/markdown-editor';

export function Example() {
  return <MarkdownEditor defaultValue={'# Hello\n\nWrite markdown here.'} />;
}
```
