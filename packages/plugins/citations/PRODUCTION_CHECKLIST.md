# Citations Plugin Production Gate

Date: March 4, 2026  
Scope: `@editora/plugins` -> `CitationsPlugin`

## 1. CI Command Set (Authoritative)

Run on Node 20+ (or current latest LTS) with a clean install.

```bash
# repo root
npm ci
npm run verify:citations
```

Equivalent explicit commands:

```bash
npm run typecheck:build --prefix packages/plugins
npm run test:citations --prefix packages/plugins
npm run test:content-rules --prefix packages/plugins
npm run build --prefix packages/plugins
```

`verify:citations` is defined in:
- root `package.json` -> `npm run verify:citations`
- `packages/plugins/package.json` -> `verify:citations`

## 2. Automated Gate Criteria

All of the following must pass:

- Typecheck (`packages/plugins` build tsconfig) succeeds.
- Citation regression tests succeed:
  - multi-instance isolation
  - delete behavior (keyboard + command)
  - refresh/data events + runtime option updates
- Existing content-rules suite still succeeds (anti-regression gate).
- Plugins bundle build succeeds and emits `dist/citations.{esm,cjs}.js`.
- `@editora/plugins/citations` export is resolvable in generated bundle.

## 3. Manual Functional Gate

Validate in Storybook (`Editor/Rich Text Editor - Web Component -> Basic`):

- Insert citation from panel updates inline ref.
- `Ctrl/Cmd + Alt + Shift + C` toggles panel.
- `Ctrl/Cmd + Alt + Shift + B` refreshes bibliography.
- `Ctrl/Cmd + Alt + Shift + J` cycles style.
- `Backspace/Delete` on selected or adjacent citation removes citation.
- `deleteCitation` command removes all occurrences by citation id.
- Bibliography section auto-removes when no citations remain.
- Footnotes section respects `enableFootnoteSync` true/false.

## 4. Accessibility Gate

- Panel is keyboard operable without mouse.
- Panel closes with `Esc` and returns editor focus.
- Form fields have explicit labels.
- `aria-live` status updates are announced.
- Citation references have useful `aria-label` text.
- Bibliography/endnotes sections expose semantic roles (`doc-bibliography` / `doc-endnotes`).

## 5. Performance Gate

Use a large document (10k+ words, 200+ refs) and verify:

- Typing latency remains stable (no visible freeze on each keypress).
- Debounced refresh avoids full rebuild on every keystroke.
- Repeated no-op refreshes are skipped by snapshot check.
- Open/close panel repeatedly does not leak timers/listeners.

## 6. Integration Gate

- React: Vite app and CRA app run with same plugin config unchanged.
- Web Component: `plugins: '... citations ...'` works with same options.
- Multi-instance: changes in one editor do not mutate another editor state.

## 7. Release Decision

Production-ready only when:

- CI command set is all green.
- Manual functional + accessibility + performance gates are signed off.
- No new severity-1/2 defects remain for citation insertion/deletion/refresh behavior.
