# Change Log

## 1.0.15

### Patch Changes

- bb57fc7: Fix several ways of losing content. Table: Select All then Insert Table replaced the whole document. Checklist: converting loose root-level text deleted it. Link: a multi-block selection was flattened into a single plain-text `<a>`; it now links per block. code-sample: blocks decayed into a stray "Copy" text node with dead handlers after the first keystroke; they are now `<pre data-lang><code>` with delegated handlers. translation-workflow: unlocking made segments editable in read-only editors. light-code-editor: Backspace beside an emoji left a lone surrogate, Tab replaced a multi-line selection with spaces (it now indents/outdents lines), Replace All needed one Undo per match, and Alt/Cmd+Backspace deleted a single character. markdown-editor: the rich editor remounted on every keystroke and lost focus, and the toolbar inserted a literal `\n`.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.14](https://github.com/ajaykr089/Editora/compare/@editora/light-code-editor@1.0.8...@editora/light-code-editor@1.0.14) (2026-09-05)

**Note:** Version bump only for package @editora/light-code-editor

## 1.0.8 (2026-03-08)

**Note:** Version bump only for package @editora/light-code-editor

## 1.0.7 (2026-03-05)

**Note:** Version bump only for package @editora/light-code-editor

## 1.0.2 (2026-02-13)

**Note:** Version bump only for package @editora/light-code-editor

## 1.0.1 (2026-02-12)

**Note:** Version bump only for package @editora/light-code-editor
