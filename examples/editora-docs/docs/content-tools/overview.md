---
title: Content tools
sidebar_label: Overview
sidebar_position: 1
description: Five small packages for what people write in a rich-text editor - clean pastes, check accessibility, review AI rewrites, send as email and convert between editor formats. They work with Editora or any other editor.
keywords: [editora, paste cleaner, accessibility, ai review, email html, rich text converter, tiptap, lexical]
---

# Content tools

Five packages that work on the content itself rather than on the editor. Each one has no runtime dependencies, runs
with Editora or any other editor (Tiptap, Lexical, ProseMirror, Quill, a plain `contenteditable`), and most also run
on a server.

| Package | What it does | Where it runs |
| --- | --- | --- |
| [`@editora/paste-cleaner`](./paste-cleaner) | Turns pastes from Word, Google Docs, Sheets, Excel, Pages and web pages into clean HTML with real lists, headings and tables; Markdown pastes get structure too | Editor plugin, any `contenteditable`, Tiptap/ProseMirror hooks, server |
| [`@editora/content-a11y`](./content-a11y) | Checks what authors write (alt text, headings, link text, tables, contrast...) against WCAG 2.2 and offers fixes | Editor plugin, any `contenteditable`, server, CLI for CI |
| [`@editora/ai-review`](./ai-review) | Shows an AI rewrite as word-level suggestions the user accepts or rejects, like tracked changes | Editor plugin, any `contenteditable`, headless, server proxy |
| [`@editora/email-html`](./email-html) | Turns editor HTML into email-safe HTML for Outlook, Gmail and Apple Mail, plus a plain-text version | Node, browser, CLI |
| [`@editora/rich-text-convert`](./rich-text-convert) | Converts between Tiptap/ProseMirror JSON, Lexical, Slate, Plate, Portable Text, Editor.js, HTML and Markdown, and reports what could not be carried over | Node, browser, CLI |

## Using them together in Editora

The first three are Editora plugins:

```bash
npm i @editora/core @editora/paste-cleaner @editora/content-a11y @editora/ai-review
```

```js
import '@editora/core/webcomponent';
import '@editora/core/webcomponent.css';
import { PasteCleanerPlugin } from '@editora/paste-cleaner/editora';
import { ContentA11yPlugin } from '@editora/content-a11y/editora';
import { AIReviewPlugin } from '@editora/ai-review/editora';

const editor = document.querySelector('editora-editor');
editor.setConfig({
  plugins: [
    'heading', 'bold', 'italic', 'link', 'list', 'table', 'history',
    PasteCleanerPlugin(),
    ContentA11yPlugin({ minHeadingLevel: 2 }),
    AIReviewPlugin(),
  ],
  toolbar: 'undo redo | heading bold italic link | bullist table | openAIReview toggleContentA11y',
});
```

The other two work on the HTML you get out of the editor:

```js
import { toEmailHtml } from '@editora/email-html';
import { convert } from '@editora/rich-text-convert';

const html = editor.getContent();
const email = toEmailHtml(html, { title: 'Weekly update' }); // { html, text, warnings }
const { output: markdown } = convert(html, { from: 'html', to: 'markdown' });
```
