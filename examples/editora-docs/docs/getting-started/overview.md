---
title: Overview
description: Understand how Editora packages fit together in a scalable monorepo ecosystem.
keywords: [overview, architecture, packages]
---

# Overview

Understand how Editora packages fit together in a scalable monorepo ecosystem.

## Package map

- **Runtime**: `@editora/core`
- **React adapter**: `@editora/react`
- **Feature layer**: `@editora/plugins`
- **Visual system**: `@editora/themes`
- **Icons**: `@editora/icons`, `@editora/react-icons`
- **UI layer**: `@editora/ui-core`, `@editora/ui-react`
- **Code/source editing**: `@editora/light-code-editor`

## Recommended adoption order

1. Install core + chosen framework adapter.
2. Add only required plugins.
3. Apply theme and icon strategy.
4. Add UI packages for design-system integration.

## Integration paths

- Web component path:
  use `@editora/core` custom element APIs for framework-agnostic embedding.
- React path:
  use `@editora/react` for component/lifecycle integration.

## Release hygiene

- Keep `@editora/*` dependency versions aligned.
- Validate multi-instance and dark-mode behavior as release gates.
- Maintain docs and examples in the same PR as runtime or API changes.

## Direct package guides

- [`@editora/light-code-editor` package docs](../packages/light-code-editor)
- [`@editora/plugins` package docs](../packages/plugins)
- [`@editora/core` package docs](../packages/core)
