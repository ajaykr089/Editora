---
title: UI kit stability (0.x)
description: What Editora's UI packages promise while they are 0.x - which changes can break your app, how they are announced, the codemods that update your code, the React and browser versions supported, and what 1.0 needs.
keywords: [editora ui stability, semver 0.x, breaking changes, deprecation policy, codemods, supported browsers, react versions]
---

# UI kit stability (0.x)

`@editora/ui-core`, `@editora/ui-react`, `@editora/icons`, `@editora/react-icons`, `@editora/ui-testing` and `@editora/codemods` are 0.x. This page says what that means for an app built on them: what may change, how you hear about it, and how to upgrade.

## Versions

| Release | Example | What it may contain |
| --- | --- | --- |
| Patch | 0.3.0 → 0.3.1 | Fixes and additions only. Nothing that is meant to break your code. |
| Minor | 0.3.x → 0.4.0 | Additions, and breaking changes when they are needed. Every one is announced (below). |

npm's default range for a 0.x package already takes patches only: `"@editora/ui-react": "^0.3.0"` installs 0.3.x and never 0.4.0. Move to the next minor on purpose, with the steps below.

## How breaking changes are announced

- In the package's `CHANGELOG.md`, the entry starts with **Behaviour change** and says what to do instead.
- When the change can be applied mechanically, there is a codemod (below).
- An API that is replaced keeps working for at least one more minor release where that is possible, and its documentation says what replaces it.

## Codemods

`@editora/codemods` updates your code for breaking changes, editing only what changed and keeping your formatting:

```bash
npx @editora/codemods <codemod> src --dry   # see what would change
npx @editora/codemods <codemod> src         # apply it
```

| Version | Codemod | What it does |
| --- | --- | --- |
| ui-react 0.2.0 | `text-field-on-commit` | `onChange` on `Input` and `Textarea` now fires on every keystroke, as React's `<input>` does. The codemod renames it to `onCommit`, which fires when an edit is committed (blur or Enter), as `onChange` used to. Skip it for fields you want updated as the user types, such as search boxes. |

Changes that cannot be applied mechanically are described in the changelog. For example, ui-react 0.2.0 made controlled props win: `value`, `checked`, `open` and similar props, passed together with a change handler, now take back the element's state when your handler does not accept a change.

## What is public API

You can rely on:

- React components, their props, and the shape of the values their callbacks receive.
- Custom element tag names, their attributes and properties, the events they dispatch and those events' `detail`.
- Documented CSS custom properties (`--ui-*`), `::part()` names and slot names.
- The exports listed in each package's `package.json`.

Not public, and free to change in any release:

- Markup and class names inside shadow roots. Style through custom properties and parts instead.
- Methods and properties whose names start with `_`, and undocumented `data-*` attributes.
- Exact pixels: spacing, shadows and colours are adjusted in minor and patch releases. Pin a version if you compare screenshots of Editora components in your own tests.

## Supported versions

- **React** 16.8 to 19 (`peerDependencies` allows up to React 20). Every change is tested with React 18 and React 19.
- **Browsers**: current Chrome, Edge, Firefox and Safari. Every change is tested in Chromium, Firefox and WebKit. A few features use newer platform APIs where they exist and fall back elsewhere; for example, overlays use the top layer (`popover`) in Chrome 114, Safari 17 and Firefox 125 and later, and `z-index` stacking before that.
- **Server rendering**: Node 20 and 22 are tested.

## What every change is checked against

Unit tests for ui-core and ui-react, React 19 compatibility, interaction tests in Chromium, Firefox and WebKit, an axe accessibility check over every Storybook story, screenshot comparisons in light and dark at three densities, and a size budget for every `@editora/ui-react` entry.

## Towards 1.0

1.0 will come when:

- two minor releases have shipped without a breaking change to the public API above;
- every prop in the generated API reference (for example [DataTable](../ui-react/api/data-table.md)), which is built from the source so it cannot fall behind, has a description;
- a full reference app (a marketing site and the product behind it) is built and tested on every change.

From 1.0, breaking changes only come in major releases.

## Upgrading, step by step

1. Read the `CHANGELOG.md` of `@editora/ui-core` and `@editora/ui-react` for every minor release you are crossing, and look for **Behaviour change**.
2. Run the codemods listed for those versions, with `--dry` first.
3. Run your tests. [`@editora/ui-testing`](../ui-react/testing.md) helps write tests that act like a user on Editora components.
