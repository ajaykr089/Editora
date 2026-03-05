# FAQ

## Should all packages depend on React?

No. Only React-facing packages should declare React peer dependencies.

## Do I need all Editora packages for a basic editor?

No. Start with `@editora/core` and add packages as needed (`@editora/plugins`, `@editora/themes`, `@editora/react`).

## What is the minimal React install?

`@editora/react`, `@editora/core`, `react`, and `react-dom`.

## How should internal package versions be managed?

Keep all `@editora/*` dependencies aligned to the latest compatible line to avoid resolution drift.

## Can I use a custom theme?

Yes. Start from default theme tokens, then override semantic variables and validate all plugin surfaces.

## Do icons require a provider?

No. `<Icon />` works without a provider. `IconProvider` is optional for shared defaults.

## How do I keep bundle size small?

- Prefer targeted plugin imports, `@editora/plugins/lite`, or `@editora/plugins/enterprise`
- Lazy-load heavy plugins
- Avoid loading unused theme files

All plugin entry paths (`@editora/plugins`, `@editora/plugins/lite`, `@editora/plugins/enterprise`) are free and fully customizable.

## What are common multi-instance pitfalls?

- Global selectors that target the wrong editor
- Sidebar/dialog mount leakage across editors
- Selection loss before command execution

## Why do toolbar commands sometimes fail after clicking dialogs?

Selection can be lost when focus shifts. Use selection-preserving command workflows in plugins that open dialogs or side panels.

## API Surface

- Practical guidance across package APIs and integration surfaces
- Troubleshooting for command, theme, and dependency workflows

## Config Matrix

| Topic | Primary Config Surface |
| --- | --- |
| Dependencies | package manager + peer ranges |
| Themes | theme class/data-theme/token overrides |
| Commands | plugin command/keymap wiring |
| Multi-instance behavior | active editor resolution and scoped mounts |

## Validation Checklist

- Answers match current package behavior and dependency policy
- Guidance is actionable for both web component and React paths
- Troubleshooting steps are reproducible in local development
