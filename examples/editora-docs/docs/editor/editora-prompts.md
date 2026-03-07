---
title: Editor Prompt Pack
description: Reusable prompts for AI-assisted implementation of Editora rich text editor in React and web component apps.
keywords: [editor prompts, rich text editor react, ai prompt pack, enterprise editor]
---

# Editor Prompt Pack

Use these prompts when working on rich text editor implementations.

## 1. Enterprise editor workspace

```text
Build an enterprise editorial workspace using @editora/react and @editora/plugins.
Use @editora/ui-react components for shell UI (cards, tabs, dialog, buttons, toast).
Include autosave feedback, publish confirmation, and one compliance plugin.
Return complete runnable TSX.
```

## 2. Minimal editor integration

```text
Create a minimal React page with EditoraEditor using only bold, italic, link, and history plugins.
Include toolbar and statusbar config, plus onChange logging.
Keep bundle and setup lean.
```

## 3. Compliance-ready editor

```text
Configure Editora with A11yCheckerPlugin, ContentRulesPlugin, and PIIRedactionPlugin.
Add examples for policy writing workflow with validation feedback.
Explain plugin config clearly.
```

## 4. Migration to Editora React

```text
Migrate this existing editor implementation to @editora/react.
Map toolbar actions and plugin behavior.
Preserve keyboard accessibility and paste sanitization behavior.
List breaking differences.
```

## 5. Web component editor prompt

```text
Build the same editor using @editora/core web component APIs only.
No React wrappers.
Provide HTML/JS and plugin initialization code with real imports.
```

## 6. Performance review prompt

```text
Review this Editora editor integration for performance issues:
- duplicate event listeners
- excessive re-renders
- heavy plugin initialization paths
- expensive serialization on each change
Provide concrete fixes and code.
```
