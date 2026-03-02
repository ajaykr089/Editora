---
title: "React Examples"
description: React integration examples for controlled editing, plugin composition, and multi-instance validation.
keywords: [editora, documentation, react]
---

# React Examples

React integration examples for controlled editing, plugin composition, and multi-instance validation.

## Baseline editor

```tsx
import { useMemo, useState } from "react";
import { EditoraEditor } from "@editora/react";
import { BoldPlugin, ItalicPlugin, HistoryPlugin } from "@editora/plugins";
import "@editora/plugins/styles.css";
import "@editora/themes/themes/default.css";

export default function EditorScreen() {
  const [value, setValue] = useState("<p>Start writing...</p>");
  const plugins = useMemo(() => [BoldPlugin(), ItalicPlugin(), HistoryPlugin()], []);

  return (
    <EditoraEditor
      value={value}
      onChange={setValue}
      plugins={plugins}
      floatingToolbar
    />
  );
}
```

## Full-feature pattern

- Start with stable plugin arrays (`useMemo`)
- Add advanced plugins incrementally
- Lazy-load heavier plugins when route/context requires
- Keep theme CSS at app-shell scope to avoid duplicate style injection

## Content management patterns

- Controlled mode (`value`, `onChange`) for app-state syncing
- Uncontrolled mode (`defaultValue`) for lightweight local editing
- Debounce large-content updates before persistence

## Multi-instance checklist

- Spell-check/comments sidebars are instance-scoped
- Floating toolbar positions per active selection
- Toolbar commands do not affect sibling editors
- Status counters update only for focused editor

## Readonly and security checklist

- Readonly mode blocks all mutating commands
- Selection and copy behavior still works
- Sanitization settings align with app security policy

## Performance checklist

- Large documents keep acceptable input latency
- Mutation-heavy plugins do not freeze UI
- History operations stay responsive after long sessions

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `EditoraEditor` | React component API | Primary editor wrapper surface |
| `value/defaultValue`, `onChange` | Content API | Controlled and uncontrolled content flows |
| `onInit`, `onDestroy` | Lifecycle API | Attach/detach runtime integrations cleanly |
| `plugins={[...]}` | Plugin composition API | Feature selection through plugin factory arrays |
| `toolbar`, `statusbar`, `floatingToolbar` | UI behavior API | Controls toolbar and status surfaces |
| `autosave`, `security`, `performance`, `accessibility` | Runtime config API | Operational controls from React props |

## Config Matrix

| Concern | React Config Surface |
| --- | --- |
| Content sync | `value/defaultValue`, `onChange` |
| Feature set | `plugins` |
| UI behavior | `toolbar`, `statusbar`, `floatingToolbar` |
| Runtime behavior | `autosave`, `security`, `performance`, `accessibility` |

## Validation Checklist

- Controlled and uncontrolled modes behave correctly
- Plugin sidebars/dialogs stay instance-scoped
- Theming remains consistent during runtime switches
- Readonly mode blocks all mutating flows
