---
title: "Keyboard Shortcuts"
description: Keyboard shortcut reference for core editing commands and productivity workflows.
keywords: [editora, documentation, keyboard]
---

# Keyboard Shortcuts

A shortcut works when the plugin that owns it is loaded: each plugin declares its keys in its `keymap`, and the editor runs the keymaps of the plugins it has. A key no loaded plugin uses is left to the browser, so Cmd/Ctrl+P still prints and Cmd+[ still goes back. The one exception is Mod+B, Mod+I and Mod+U, which do nothing without the bold, italic or underline plugin, so the browser does not format the text itself.

`Mod` is Cmd on a Mac and Ctrl on Windows and Linux; `Alt` is Option on a Mac. On Windows and Linux, a Ctrl+Alt key that types a character with AltGr on your keyboard layout (`{` for AltGr+7 on a German keyboard) types it instead of running a shortcut.

## Text formatting

| Keys | Action | Plugin |
| --- | --- | --- |
| `Mod+B` | Bold | bold |
| `Mod+I` | Italic | italic |
| `Mod+U` | Underline | underline |
| `Mod+Shift+X` | Strikethrough | strikethrough |
| `Mod+\` | Clear formatting | clearFormatting |
| `Mod+Shift+U` | Upper case | capitalization |
| `Mod+Shift+F` | Font family | fontFamily |
| `Mod+Shift+H` | Background colour | backgroundColor |
| `Mod+Alt+C` / `Mod+Alt+V` | Copy / paste formatting | formatPainter |

## Blocks and lists

| Keys | Action | Plugin |
| --- | --- | --- |
| `Mod+Alt+0` | Paragraph | heading |
| `Mod+Alt+1` … `Mod+Alt+6` | Heading 1–6 | heading |
| `Mod+Shift+.` | Blockquote | blockquote |
| `Mod+Alt+E` | Code block | codeSample |
| `Mod+Shift+8` | Bullet list | list |
| `Mod+Shift+7` | Numbered list | list |
| `Mod+Shift+9` | Checklist | checklist |
| `Tab` / `Shift+Tab` (in a list item) | Nest the item / move it out | list |
| `Mod+]` / `Mod+[` | Indent / outdent | indent |
| `Mod+Enter` | Page break | pageBreak |

`Tab` outside a list moves the focus out of the editor, as it does on the rest of the page.

## Alignment and direction

| Keys | Action | Plugin |
| --- | --- | --- |
| `Mod+Shift+L` | Align left | textAlignment |
| `Mod+Shift+Alt+E` | Align center | textAlignment |
| `Mod+Shift+R` | Align right | textAlignment |
| `Mod+Shift+J` | Justify | textAlignment |
| `Mod+Alt+Shift+←` / `→` | Left-to-right / right-to-left | direction |

## Insert

| Keys | Action | Plugin |
| --- | --- | --- |
| `Mod+K` | Link | link |
| `Mod+Shift+K` | Anchor | anchor |
| `Mod+Shift+G` | Image | image (media manager) |
| `Mod+Shift+E` | Embed | embedIframe |
| `Mod+Shift+M` | Math | math |
| `Mod+Shift+;` | Emoji | emojis |
| `Mod+Shift+Alt+S` | Special character | specialCharacters |
| `Mod+Alt+F` | Footnote | footnote |
| `Mod+Shift+Alt+T` | Table | table |
| `Mod+Shift+Enter` / `Mod+Alt+Enter` (in a table) | Row below / column to the right | table |
| `Mod+/` | Slash command menu | slashCommands |
| `Mod+Alt+M` | Comment | comments |

## View and tools

| Keys | Action | Plugin |
| --- | --- | --- |
| `Mod+Shift+S` | Source view | code |
| `Mod+Alt+P` | Preview | preview |
| `Mod+P` | Print | print |
| `Mod+Alt+Shift+F`, `Esc` to leave | Full screen | fullscreen |
| `F7` | Spell check | spellCheck |
| `Mod+Shift+Alt+A` | Accessibility checker | a11yChecker |
| `Mod+Alt+Shift+X` | Track changes | trackChanges |
| `Mod+Alt+Shift+H` or `F8` | Version diff | versionDiff |

## History

| Keys | Action | Plugin |
| --- | --- | --- |
| `Mod+Z` | Undo | history |
| `Mod+Shift+Z`, `Mod+Y` | Redo | history |

## Workflow panels

| Keys | Action | Plugin |
| --- | --- | --- |
| `Mod+Alt+Shift+W` | Approval panel (`P` approves) | approvalWorkflow |
| `Mod+Alt+Shift+B` | Blocks library | blocksLibrary |
| `Mod+Alt+Shift+C` | Citations | citations |
| `Mod+Alt+Shift+N` or `F9` | Conditional content (`F10` previews) | conditionalContent |
| `Mod+Alt+Shift+R` | Content rules | contentRules |
| `Mod+Alt+Shift+D` | Data binding | dataBinding |
| `Mod+Alt+Shift+G` | Document schema (`J` validates) | docSchema |
| `Mod+Alt+Shift+I` | PII redaction (`U` scans, `M` redacts all, `Y` realtime) | piiRedaction |
| `Mod+Alt+Shift+V` | Smart paste | smartPaste |
| `Mod+Alt+Shift+L` | Translation workflow (`K` locks a segment) | translationWorkflow |

The other workflow actions are on the toolbar and in each plugin's panel.

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| Plugin `keymap` declarations | Config API | Maps keystrokes to plugin command identifiers |
| Runtime command dispatcher | Execution API | Executes mapped command in active editor instance |
| `useKeyboardShortcuts(options)` | React hook API | Wrapper-level keyboard shortcut registration/control |
| Toolbar command mapping | UI API | Maintains parity between shortcuts and visible actions |

## Config Matrix

| Scope | Config | Purpose |
| --- | --- | --- |
| Plugin keymap | per-plugin `keymap` | Adds/remaps shortcuts |
| App-level handling | host app key listeners | Prevent/allow global conflicts |

## Validation Checklist

- Shortcuts trigger expected commands in focused editor
- Browser/system shortcut collisions are handled explicitly
- Multi-instance pages apply shortcuts to active editor only
