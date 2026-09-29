---
"@editora/core": patch
---

Register the new `@editora/collaboration` plugin in both plugin registries (`webcomponent/plugin-loader.ts` and `webcomponent/standalone.native.ts`), so `plugins: ['collaboration']` resolves like any other built-in plugin name.
