# @editora/ui-vue

> [!WARNING]
> **Deprecated.** This package is no longer developed and will not get new components. Use
> [`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core) directly in Vue: its elements are standard
> custom elements, so no wrapper is needed.

## Use `@editora/ui-core` directly

```bash
npm install @editora/ui-core
```

```ts
// main.ts: register the elements you use, on the client
import '@editora/ui-core/button';
import '@editora/ui-core/input';
```

```vue
<ui-button variant="solid" @click="save">Save</ui-button>
```

Tell Vue that `ui-*` tags are custom elements, so it does not try to resolve them as components:

```ts
// vite.config.ts
vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith('ui-') } } })
```

Array and object values (for example on `ui-sortable`) are properties, not attributes. Assign them to the element
through a template ref after mount.

Working example: [`examples/ui-core-vue-direct`](https://github.com/ajaykr089/Editora/tree/main/examples/ui-core-vue-direct).

See also the [framework guide](https://github.com/ajaykr089/Editora/blob/main/packages/ui-core/docs/FRAMEWORK_DIRECT_USAGE.md).
For React, use [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react).

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
