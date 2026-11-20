---
"@editora/cli": minor
---

The CLI now uses your project's package manager, shows how to use what it installed, and has `init` and `list`.

- **The package manager comes from your project.** The `packageManager` field or the lock file (`pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `package-lock.json`) of the nearest folder decides, so `npx @editora/cli add button` in a pnpm project runs `pnpm add` instead of `npm install` (which made a second lock file). `--package-manager` still wins.
- **Next steps after installing**: the stylesheets to import once, in the entry file of your framework (`src/main.tsx`, `app/layout.tsx`...), and a few lines that use each name. Components share one import line.
- **`editora init`** names the project, framework and package manager, asks what to set up (or takes names), and installs it.
- **`editora list [search]`** shows every name by group, and `--json` prints them for scripts.
- **More names**: `web-editor`, `markdown-editor`, `ui-core`, `ui-sortable`, `ui-editor`, `icons`, `plugins`, `themes`, `collaboration`, `ai-review`, `agent`, `authorship`, `paste-cleaner`, `content-a11y`, `rich-text-convert`, `email-html`, `docx` and `ui-testing` (installed as a development dependency), and any package name such as `@editora/docx`. A misspelt name gets suggestions.
- **Checks**: with no `package.json` nothing is installed; a React package in a project without React gets a note with the command that adds it; a failed install says so and keeps the package manager's exit status.
- `editor` (and `all`) also install `@editora/core`, and `markdown-editor` installs `@editora/themes`, which package managers that skip peer dependencies left out.
- `ui-sortable` now installs `@editora/ui-sortable` (it was the Sortable of `@editora/ui-react`, which `sortable` still is), and `ui-editor` installs `@editora/ui-editor` (it was the React editor).
