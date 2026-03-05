# @editora/plugins

Aggregated plugin package with native plugin factories.

## Why use it

- Faster setup than installing many plugin packages manually
- Shared compatibility line with `@editora/core`
- Consistent command/toolbar integration patterns

## Coverage areas

- Formatting and typography
- Lists, alignment, and structure
- Media and embeds
- Workflow features (preview, print, fullscreen)
- Quality features (accessibility, spell-check)
- Collaboration and productivity plugins

## Example

```ts
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  HistoryPlugin,
  TablePlugin,
  SpellCheckPlugin,
} from "@editora/plugins";
import "@editora/plugins/styles.css";

const plugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  HistoryPlugin(),
  TablePlugin(),
  SpellCheckPlugin(),
];
```

## Bundle strategy

- Start with essential plugins
- Add heavy dialog-driven plugins only when needed
- Prefer subpath imports in performance-sensitive apps
- Use `@editora/plugins/lite` for common/core plugins
- Use `@editora/plugins/enterprise` for advanced/specialized workflows
- All plugin entry paths are free and fully customizable

## API Surface

- Factory exports for native and advanced plugins
- Plugin configuration helpers (for media/document managers)
- Lite entry for smaller imports (`@editora/plugins/lite`)
- Enterprise entry for advanced imports (`@editora/plugins/enterprise`)
- CSS export for plugin UI surfaces (`@editora/plugins/styles.css`)

## Enterprise Subset

`@editora/plugins/enterprise` is intended for specialized workflows and currently includes:

- `MentionPlugin`, `TrackChangesPlugin`, `VersionDiffPlugin`, `ConditionalContentPlugin`, `DataBindingPlugin`
- `ContentRulesPlugin`, `CitationsPlugin`, `ApprovalWorkflowPlugin`, `PIIRedactionPlugin`, `SmartPastePlugin`
- `BlocksLibraryPlugin`, `DocSchemaPlugin`, `TranslationWorkflowPlugin`, `SlashCommandsPlugin`
- `SpellCheckPlugin`, `A11yCheckerPlugin`, `CommentsPlugin`, `MergeTagPlugin`, `TemplatePlugin`
- `MediaManagerPlugin`, `DocumentManagerPlugin`

## Config Matrix

| Import Strategy | Use Case |
| --- | --- |
| Package-root imports | Fast onboarding |
| Subpath imports | Bundle-size optimization |
| `@editora/plugins/lite` | Lightweight default stack |
| `@editora/plugins/enterprise` | Advanced/specialized default stack |
| Dynamic import for heavy plugins | Route/context-based loading |

## Validation Checklist

- Loaded plugin list matches toolbar command set
- Heavy plugins are lazy-loaded where appropriate
- Multi-instance command execution remains isolated
- Plugin order does not cause command shadowing conflicts
