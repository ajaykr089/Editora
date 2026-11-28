---
title: "Vue, Svelte, Angular and plain HTML"
description: "Use the @editora/ui-core web components in Vue, Svelte, Angular or plain HTML, with typed templates, editor completion and a Custom Elements Manifest."
sidebar_label: "Frameworks"
keywords: [vue, svelte, angular, web components, custom elements manifest, typescript]
---

# Vue, Svelte, Angular and plain HTML

The `@editora/ui-core` elements are standard web components, so they work in any framework. The package also ships what editors and type checkers need to know about them:

| File | What reads it |
| --- | --- |
| `custom-elements.json` | The [Custom Elements Manifest](https://github.com/webcomponents/custom-elements-manifest): every element's attributes (with their allowed values), events, slots, CSS parts and CSS custom properties. Storybook, documentation tools and IDE plugins read it; `package.json` points to it with `"customElements"`. |
| `@editora/ui-core/vue` | Types for Vue templates (Volar and `vue-tsc`). |
| `@editora/ui-core/svelte` | Types for Svelte templates (`svelte-check`, Svelte 4 and 5). |
| `html-custom-data.json` | Tag and attribute completion in VS Code's HTML editor. |

All of them are generated from the element sources, so they list exactly what each element supports.

## Vue

Tell Vue that `ui-*` tags are custom elements, so it does not try to resolve them as Vue components:

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue';

export default {
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('ui-') } } })],
};
```

Register the elements once (all of them, or only the ones you use), and add the types:

```ts
// main.ts
import '@editora/ui-core/button';
import '@editora/ui-core/dialog';
```

```json
// tsconfig.json
{ "compilerOptions": { "types": ["@editora/ui-core/vue"] } }
```

Then templates are checked and completed:

```vue
<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false);
function onClose(event: CustomEvent) {
  open.value = false;
  console.log(event.detail);
}
</script>

<template>
  <ui-button variant="primary" @click="open = true">Edit</ui-button>
  <ui-dialog :open="open" title="Edit profile" @close="onClose">…</ui-dialog>
</template>
```

`vue-tsc` reports a value an attribute does not accept (`variant="nonsense"`) and an event handler of the wrong type. Vue passes a binding as a property when the element defines one, and as an attribute otherwise. Events are `CustomEvent`s, with their data in `event.detail`. `v-model` does not apply to custom elements: bind `:value` and listen to `@change` (or `@input`).

## Svelte

Svelte compiles custom elements as they are; register them and add the types:

```ts
// src/app.d.ts
/// <reference types="@editora/ui-core/svelte" />
```

```svelte
<script lang="ts">
  import '@editora/ui-core/button';
  import '@editora/ui-core/dialog';
  let open = $state(false);
</script>

<ui-button variant="primary" onclick={() => (open = true)}>Edit</ui-button>
<ui-dialog {open} title="Edit profile" onclose={() => (open = false)}>…</ui-dialog>
```

`svelte-check` checks attribute values and event handlers in components with `<script lang="ts">`. Both event syntaxes are typed: `onclose` (Svelte 5) and `on:close` (Svelte 4).

Svelte's accessibility lints do not know that `<ui-button>` is interactive (its real `<button>` is inside its shadow root), so they warn about click handlers on it. This filter silences those two warnings for `ui-*` elements only:

```js
// svelte.config.js
const CODES = ['a11y_click_events_have_key_events', 'a11y_no_static_element_interactions'];

export default {
  compilerOptions: {
    warningFilter: (warning) => {
      if (!CODES.includes(warning.code) || !warning.frame || !warning.start) return true;
      const prefix = `${warning.start.line}: `;
      const line = warning.frame.split('\n').find((l) => l.startsWith(prefix)) ?? '';
      return !line.slice(prefix.length + warning.start.column).startsWith('<ui-');
    },
  },
};
```

## Angular

Allow custom elements in the components that use them, and register the elements:

```ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@editora/ui-core/button';
import '@editora/ui-core/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ui-button variant="primary" (click)="open = true">Edit</ui-button>
    <ui-dialog [open]="open" title="Edit profile" (close)="onClose($event)">…</ui-dialog>
  `,
})
export class ProfileComponent {
  open = false;
  onClose(event: Event) {
    this.open = false;
    console.log((event as CustomEvent).detail);
  }
}
```

`[open]="…"` sets the element's property; use `[attr.name]="…"` to set an attribute instead. `(close)` listens to the element's event; Angular types `$event` as `Event`, so cast it to `CustomEvent` for `detail`. Angular does not type-check attributes on custom elements in templates. In your TypeScript code, `document.querySelector('ui-dialog')` and similar return the element's class for the elements that declare it in `HTMLElementTagNameMap`.

## Plain HTML

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@editora/ui-core/+esm';
</script>

<ui-button variant="primary">Save</ui-button>
```

For tag and attribute completion in VS Code, add the custom data to your workspace settings:

```json
// .vscode/settings.json
{ "html.customData": ["./node_modules/@editora/ui-core/html-custom-data.json"] }
```

## Tools that read the manifest

The `customElements` field in `package.json` points to `custom-elements.json`. For example, Storybook for web components shows each element's attributes, events, slots, CSS parts and CSS properties in its docs tab once you pass it the manifest:

```ts
// .storybook/preview.ts
import { setCustomElementsManifest } from '@storybook/web-components';
import manifest from '@editora/ui-core/custom-elements.json';

setCustomElementsManifest(manifest);
```
