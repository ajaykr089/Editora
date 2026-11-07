# Changelog

Editora is a monorepo of separately versioned npm packages, so each package keeps its own changelog.
Every release adds one entry per change, written when the change is made and published with that
version.

- **[GitHub Releases](https://github.com/ajaykr089/Editora/releases)**: one release per published
  package version, with that version's changes as its notes. Watch the repository with
  *Custom → Releases* to be notified of new versions.
- **Per-package changelogs**: the table below. npm shows each package's README, which links back to
  its changelog.

## Packages

### Editor

| Package | Changelog |
| --- | --- |
| `@editora/core` | [packages/core/CHANGELOG.md](packages/core/CHANGELOG.md) |
| `@editora/react` | [packages/react/CHANGELOG.md](packages/react/CHANGELOG.md) |
| `@editora/plugins` | [packages/plugins/CHANGELOG.md](packages/plugins/CHANGELOG.md) |
| `@editora/themes` | [packages/themes/CHANGELOG.md](packages/themes/CHANGELOG.md) |
| `@editora/markdown-editor` | [packages/markdown-editor/CHANGELOG.md](packages/markdown-editor/CHANGELOG.md) |
| `@editora/light-code-editor` | [packages/light-code-editor/CHANGELOG.md](packages/light-code-editor/CHANGELOG.md) |
| `@editora/performance` | [packages/performance/CHANGELOG.md](packages/performance/CHANGELOG.md) |
| `@editora/cli` | [packages/cli/CHANGELOG.md](packages/cli/CHANGELOG.md) |

Individual plugin packages (`@editora/plugin-table`, `@editora/media-manager`, `@editora/comments`, ...)
each have a `CHANGELOG.md` in their folder under [packages/plugins](packages/plugins).

### Content tools

| Package | Changelog |
| --- | --- |
| `@editora/agent` | [packages/agent/CHANGELOG.md](packages/agent/CHANGELOG.md) |
| `@editora/ai-review` | [packages/ai-review/CHANGELOG.md](packages/ai-review/CHANGELOG.md) |
| `@editora/authorship` | [packages/authorship/CHANGELOG.md](packages/authorship/CHANGELOG.md) |
| `@editora/content-a11y` | [packages/content-a11y/CHANGELOG.md](packages/content-a11y/CHANGELOG.md) |
| `@editora/docx` | [packages/docx/CHANGELOG.md](packages/docx/CHANGELOG.md) |
| `@editora/email-html` | [packages/email-html/CHANGELOG.md](packages/email-html/CHANGELOG.md) |
| `@editora/paste-cleaner` | [packages/paste-cleaner/CHANGELOG.md](packages/paste-cleaner/CHANGELOG.md) |
| `@editora/rich-text-convert` | [packages/rich-text-convert/CHANGELOG.md](packages/rich-text-convert/CHANGELOG.md) |

### UI kit

| Package | Changelog |
| --- | --- |
| `@editora/ui-core` | [packages/ui-core/CHANGELOG.md](packages/ui-core/CHANGELOG.md) |
| `@editora/ui-react` | [packages/ui-react/CHANGELOG.md](packages/ui-react/CHANGELOG.md) |
| `@editora/ui-testing` | [packages/ui-testing/CHANGELOG.md](packages/ui-testing/CHANGELOG.md) |
| `@editora/ui-editor` | [packages/ui-editor/CHANGELOG.md](packages/ui-editor/CHANGELOG.md) |
| `@editora/ui-sortable` | [packages/ui-sortable/CHANGELOG.md](packages/ui-sortable/CHANGELOG.md) |
| `@editora/icons` | [packages/icons/CHANGELOG.md](packages/icons/CHANGELOG.md) |
| `@editora/react-icons` | [packages/react-icons/CHANGELOG.md](packages/react-icons/CHANGELOG.md) |
| `@editora/toast` | [packages/editora-toast/CHANGELOG.md](packages/editora-toast/CHANGELOG.md) |

`@editora/ui-vue`, `@editora/ui-svelte` and `@editora/ui-angular` are deprecated; use `@editora/ui-core`
directly.

## Adding an entry

Changes are recorded with [changesets](https://github.com/changesets/changesets): run
`npx changeset` in the pull request that makes the change, pick the packages and the bump, and
describe the change from the user's side. At release time the entries move into the packages'
`CHANGELOG.md` files and the GitHub Releases. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Before per-package changelogs

Until 1.0.4 (February 2026) `@editora/core`, `@editora/react`, `@editora/plugins` and
`@editora/themes` were released together and recorded here.

- **1.0.4** (2026-02-28): release preparation for the four packages; publish metadata and
  declaration entry points aligned for npm consumers.
- **1.0.2** (2026-02-13): version bump only.
- **1.0.1** (2026-02-12): corrected the plugin import examples in the README (`BoldPlugin`, not
  `createBoldPlugin`); web component usage documented; example projects updated to 1.0.1.
- **1.0.0** (2026-02-02): first stable release: framework-agnostic core with a plugin
  architecture, the React component and hooks, 40+ plugins, light/dark themes, XSS-safe
  sanitization and TypeScript types.
