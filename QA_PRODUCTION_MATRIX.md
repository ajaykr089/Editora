# Production QA Matrix

Date: March 2, 2026  
Scope: multi-instance behavior, dark-theme dialogs, spellcheck/comments sidebars, checklist/history undo, plugin bundle entry strategy, SourceView/light-code-editor dialog performance.

## Automated Validation

| Area | Check | Method | Result |
|---|---|---|---|
| Build integrity | Monorepo release pipeline | `npm run verify:release` | PASS |
| Storybook integrity | Story compilation for editor stories | `npm run build-storybook` | PASS |
| Package integrity | All publishable packages dry-run pack | Included in `verify:release` | PASS |
| Plugin subpath exports | Multi-entry outputs generated | `npm run build -w @editora/plugins` | PASS |
| Plugin subpath runtime (CJS) | `@editora/plugins/bold` | `node -e "require('@editora/plugins/bold')"` | PASS |
| Plugin subpath runtime (ESM) | `@editora/plugins/spell-check`, `@editora/plugins/shared-config` | `node -e "import(...)"` | PASS |
| Multi-instance command context wiring | Toolbar sets command editor context key | `packages/react/src/components/Toolbar.tsx` | PASS |
| Comments panel mount scoping | Panel appended to active editor root state | `packages/plugins/comments/src/CommentsPlugin.native.ts` | PASS |
| Spellcheck panel mount scoping | Panel appended to active editor host | `packages/plugins/spell-check/src/SpellCheckPlugin.native.ts` | PASS |
| Checklist -> History integration | DOM transaction recording + input dispatch | `packages/plugins/checklist/src/ChecklistPlugin.native.ts` | PASS |
| Footnote -> History integration | DOM transaction recording + input dispatch | `packages/plugins/footnote/src/FootnotePlugin.native.ts` | PASS |
| History multi-editor targeting | Per-editor stacks + active resolution | `packages/plugins/history/src/HistoryPlugin.native.ts` | PASS |
| Spellcheck dark theme CSS | Dark selectors for panel/list/items/actions | `packages/plugins/spell-check/src/SpellCheckPlugin.native.ts` | PASS |
| Comments dark theme CSS | Dark selectors for comments panel/cards/actions | `packages/plugins/comments/src/CommentsPlugin.native.ts` | PASS |
| SourceView dialog build integrity | Source plugin builds with lifecycle updates | `npm run build --workspace @editora/code` | PASS |
| Light code editor build integrity | Extension optimizations compile and emit | `npm run build --workspace @editora/light-code-editor` | PASS |
| Storybook compile after SourceView updates | Editor stories compile with source dialog changes | `npm run build-storybook` | PASS |
| SourceView unsaved state diff cost | One-time formatted baseline reused (no repeated format per keystroke) | `packages/plugins/code/src/CodePlugin.native.ts` | PASS |
| SourceView listener cleanup | Overlay/document listeners are detached on close | `packages/plugins/code/src/CodePlugin.native.ts` | PASS |
| SourceView init responsiveness | Editor init deferred to next frame after modal mount | `packages/plugins/code/src/CodePlugin.native.ts` | PASS |
| Search panel multi-instance mounting | Search UI mounts against active modal, not global query | `packages/light-code-editor/src/extensions/SearchExtension.ts` | PASS |
| Search keystroke pressure control | Search input is debounced | `packages/light-code-editor/src/extensions/SearchExtension.ts` | PASS |
| Folding indicator update pressure | Updates are RAF-batched and skipped for unchanged text | `packages/light-code-editor/src/extensions/CodeFoldingExtension.ts` | PASS |

## Manual Browser Validation (Final Sign-off)

Run these before publishing:

1. Start Storybook: `npm run storybook`
2. Open: `http://localhost:6006/?path=/story/editor-rich-text-editor-web-component--test-7-theme-switcher-editor-only`
3. Open: `http://localhost:6006/?path=/story/editor-rich-text-editor-web-component--multiple-editors`

### Manual Scenarios

| Scenario | Expected Result | Status |
|---|---|---|
| Multi-instance spellcheck sidebar | Opening/closing in Editor A does not open Editor B panel | PENDING MANUAL |
| Multi-instance comments sidebar | Add/Toggle comments affects only clicked editor | PENDING MANUAL |
| Dark theme spellcheck panel | Header, list, suggestions, buttons readable and themed | PENDING MANUAL |
| Dark theme comments panel | Panel background, text, controls match dark theme | PENDING MANUAL |
| Checklist insertion over multiple lines | Creates valid checklist items for all selected lines | PENDING MANUAL |
| Undo after checklist / footnote operations | `Undo` reverts latest checklist/footnote mutation correctly | PENDING MANUAL |
| Undo/redo isolation across editors | Ctrl/Cmd+Z applies only to active editor instance | PENDING MANUAL |
| SourceView open/close stress (single instance) | Repeated open/close does not degrade responsiveness or leak overlays | PENDING MANUAL |
| SourceView open/close stress (multi-instance) | Opening in editor A/B targets correct instance and remains responsive | PENDING MANUAL |
| SourceView typing stress | Large HTML typing/search in source dialog remains responsive | PENDING MANUAL |
| SourceView ESC/overlay close behavior | ESC and outside-click close consistently without reopening side effects | PENDING MANUAL |

## Delta Applied In This Pass (Targeted Fixes)

- Added explicit toolbar command-context targeting (`__editoraCommandEditorRoot`) to:
  - `packages/plugins/history/src/HistoryPlugin.native.ts`
  - `packages/plugins/checklist/src/ChecklistPlugin.native.ts`
  - `packages/plugins/footnote/src/FootnotePlugin.native.ts`
- Added dark-theme attribute selector compatibility for comments panel:
  - `packages/plugins/comments/src/CommentsPlugin.native.ts` (`[theme="dark"]` support)
- SourceView / light-code-editor dialog performance pass:
  - `packages/plugins/code/src/CodePlugin.native.ts`
    - Cached formatted baseline HTML once for change comparison.
    - Added deterministic listener teardown on dialog close.
    - Deferred editor boot by `requestAnimationFrame` after dialog mount to reduce open jank.
    - Cached dialog element references to reduce repeated DOM queries.
  - `packages/light-code-editor/src/extensions/SearchExtension.ts`
    - Switched modal host lookup to active editor context.
    - Added input debounce and teardown for timers/references.
    - Added ESC close handling inside search/replace fields.
  - `packages/light-code-editor/src/extensions/CodeFoldingExtension.ts`
    - Switched modal host lookup to active editor context.
    - Added RAF-batched updates + text snapshot short-circuit.
    - Added change listener unregister and RAF cancel during destroy.

These changes directly reduce cross-editor command bleed and improve theme parity for web component contexts.

## Bundle Strategy Delivered

- Added per-plugin subpath entry points (example: `@editora/plugins/bold`, `@editora/plugins/spell-check`).
- Added lightweight aggregate entry: `@editora/plugins/lite`.
- Added advanced aggregate entry: `@editora/plugins/enterprise`.
- Kept root export for backward compatibility: `@editora/plugins`.
- Documented lazy-load pattern for heavy plugins using dynamic `import(...)`.
- Confirmed entry-path policy: full/lite/enterprise are free and customizable.

## Notes

- Node-only ESM import of full plugin aggregates can still fail without DOM globals for some plugins that touch `document` at module-eval time.  
  This does not affect browser runtime usage, but server-only import paths should use client-only dynamic imports.
