---
title: "@editora/plugins"
description: Plugin package for formatting, content insertion, workflow, and quality tooling.
keywords: [plugins, commands, formatting]
---

# @editora/plugins

Plugin package for formatting, content insertion, workflow, and quality tooling.

## Installation

```bash
npm i @editora/plugins @editora/core
```

```ts
import "@editora/plugins/styles.css";
```

## Quick Start

```ts
import { BoldPlugin, ItalicPlugin, HistoryPlugin } from "@editora/plugins";
import "@editora/plugins/styles.css";

const plugins = [BoldPlugin(), ItalicPlugin(), HistoryPlugin()];
```

## Usage

Use root exports for fast integration, subpath exports for bundle control, `lite` for minimal stacks, and `enterprise` for advanced/specialized stacks.

## Examples

- Minimal stack: formatting + history
- Advanced stack: media, comments, spell-check, table, document manager
- Mixed stack with lazy-loaded heavy plugins

## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| Formatting/structure factories | Plugin exports | `HeadingPlugin`, `BoldPlugin`, `ItalicPlugin`, `UnderlinePlugin`, `StrikethroughPlugin`, `ListPlugin`, `ChecklistPlugin`, `BlockquotePlugin`, `CodePlugin`, `ClearFormattingPlugin` |
| Typography/style factories | Plugin exports | `FontSizePlugin`, `FontFamilyPlugin`, `TextAlignmentPlugin`, `TextColorPlugin`, `BackgroundColorPlugin`, `LineHeightPlugin`, `IndentPlugin`, `DirectionPlugin`, `CapitalizationPlugin` |
| Content insertion factories | Plugin exports | `LinkPlugin`, `TablePlugin`, `MathPlugin`, `SpecialCharactersPlugin`, `EmojisPlugin`, `EmbedIframePlugin`, `AnchorPlugin` |
| Workflow factories | Plugin exports | `HistoryPlugin`, `PreviewPlugin`, `FullscreenPlugin`, `PrintPlugin`, `PageBreakPlugin`, `CodeSamplePlugin`, `MergeTagPlugin`, `FootnotePlugin`, `TemplatePlugin` |
| Collaboration/quality factories | Plugin exports | `CommentsPlugin`, `SpellCheckPlugin`, `A11yCheckerPlugin` |
| Manager-backed factories | Plugin exports | `MediaManagerPlugin`, `DocumentManagerPlugin` |
| Manager config helpers | Functions | `setMediaManagerConfig`, `getMediaManagerConfig`, `setDocumentManagerConfig`, `getDocumentManagerConfig` |
| Global API config | Functions/types | `setGlobalApiConfig`, `getGlobalApiConfig`, `getGlobalApiHeaders`, `buildApiUrl`, `ApiConfig` |
| `@editora/plugins/lite` | Entry export | Lightweight subset focused on common commands |
| `@editora/plugins/enterprise` | Entry export | Advanced/specialized workflow, compliance, and QA plugins |
| Subpath exports | Package exports | Individual plugin paths (`@editora/plugins/<plugin-name>`) |
| `@editora/plugins/styles.css` | CSS export | Plugin UI styles for table toolbar, dialogs, and color pickers |

## Entry Paths

All entry paths are free and fully customizable.

- `@editora/plugins`: full plugin catalog
- `@editora/plugins/lite`: common/core plugin subset
- `@editora/plugins/enterprise`: advanced/specialized plugin subset
- `@editora/plugins/<plugin-name>`: targeted imports for strict bundle control

### Enterprise Subset Includes

- `MentionPlugin`, `TrackChangesPlugin`, `VersionDiffPlugin`, `ConditionalContentPlugin`, `DataBindingPlugin`
- `ContentRulesPlugin`, `CitationsPlugin`, `ApprovalWorkflowPlugin`, `PIIRedactionPlugin`, `SmartPastePlugin`
- `BlocksLibraryPlugin`, `DocSchemaPlugin`, `TranslationWorkflowPlugin`, `SlashCommandsPlugin`
- `SpellCheckPlugin`, `A11yCheckerPlugin`, `CommentsPlugin`, `MergeTagPlugin`, `TemplatePlugin`
- `MediaManagerPlugin`, `DocumentManagerPlugin`

## Best Practices

- Keep plugin list aligned with toolbar command list.
- Validate undo/redo for structural plugins (checklist/table/page break/footnote).
- Lazy-load heavy dialog-driven plugins in large applications.

## Accessibility

Ensure every plugin dialog/panel is keyboard navigable and theme-consistent in both light/dark modes.

## Performance Notes

Prefer subpath imports, `@editora/plugins/lite`, or `@editora/plugins/enterprise` and split optional plugins by route/context to keep baseline bundles lean.
