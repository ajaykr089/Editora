---
title: "Custom Plugins"
description: Plugin authoring guide for command registration, toolbar wiring, and lifecycle-safe behavior.
keywords: [editora, documentation, custom]
---

# Custom Plugins

Plugin authoring guide for command registration, toolbar wiring, and lifecycle-safe behavior.

## Plugin anatomy

A plugin usually contains:

- Unique `name`
- `commands` map
- `toolbar` item declarations
- Optional `keymap`
- Optional initialization logic

## Minimal plugin template

```ts
export function MyPlugin() {
  return {
    name: "myPlugin",
    toolbar: [
      { label: "My Action", command: "myCommand", type: "button", icon: "✨" },
    ],
    commands: {
      myCommand: (_args, context) => {
        const el = context?.contentElement;
        if (!el) return false;
        document.execCommand("insertText", false, "My value");
        return true;
      },
    },
    keymap: {
      "Mod-Alt-Shift-o": "myCommand",
    },
  };
}
```

## Keyboard shortcuts

The editor runs the `keymap` of every plugin it loads; a later plugin's key replaces an earlier one's. A key is written as modifiers and a key joined by `-`: `Mod` (Cmd on a Mac, Ctrl elsewhere), `Ctrl`, `Cmd`, `Alt`, `Shift`, then a character (`b`, `1`, `.`, `/`) or a key name (`Enter`, `Escape`, `ArrowLeft`, `F7`, `Space`). A value is:

- a command name: `"Mod-Shift-x": "toggleStrikethrough"`;
- a command with its argument: `"Mod-Shift-l": { command: "setTextAlignment", params: "left" }`;
- a function, called with the key event and the editor's context (`{ editorElement, contentElement }`). Return `false` when it did nothing, so the key is left to the browser.

The key is blocked only when the command ran. Check the [shortcut list](./keyboard-shortcuts.md) before you pick one, and keep clear of keys the browser or the system keep (Mod+T, Mod+Shift+T, Mod+N, Mod+W, Mod+Shift+Q on a Mac).

## Plugin types

- Mark/formatting plugins
- Block/structure plugins
- Command-only utility plugins
- Dialog-driven plugins

## Integration checklist

1. Register commands before toolbar binding
2. Preserve and restore selection around dialogs
3. Scope all overlays to the active editor instance
4. Emit input/update events after DOM mutation
5. Verify undo/redo compatibility with structural changes

## Packaging checklist

- Export from package root
- Provide TS types
- Include build artifacts (ESM/CJS as required)
- Document commands and keyboard shortcuts

## Common pitfalls

- Global query selectors causing cross-instance bugs
- Selection loss on toolbar click
- Missing cleanup for event listeners/dialog nodes
- Theme-incompatible plugin UI surfaces

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `name` | Required plugin field | Unique plugin identity used in diagnostics/registration |
| `commands` | Required plugin field | Command handlers invoked by toolbar/shortcuts/programmatic execution |
| `toolbar` | Optional plugin field | Toolbar item declarations bound to plugin commands |
| `keymap` | Optional plugin field | Keyboard shortcut bindings to command keys |
| Lifecycle hooks (`init`/cleanup contract) | Optional plugin field | Setup listeners/UI and dispose safely on teardown |
| Selection utilities (plugin runtime context) | Runtime surface | Preserve/restore selection for dialog-driven actions |

## Config Matrix

| Field | Required | Purpose |
| --- | --- | --- |
| `name` | Yes | Plugin identity and diagnostics |
| `commands` | Yes | Runtime action handlers |
| `toolbar` | No | Toolbar integration |
| `keymap` | No | Keyboard command mapping |
| `init` | No | Startup/setup behavior |

## Validation Checklist

- Commands run only in intended editor context
- Selection-sensitive actions preserve caret/range
- Plugin DOM mutations are undo/redo safe
- Event listeners are cleaned up on teardown paths
