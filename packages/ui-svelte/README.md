# @editora/ui-svelte

> [!WARNING]
> **Deprecated.** This package is no longer developed and will not get new components. Use
> [`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core) directly in Svelte: its elements are standard
> custom elements, so no wrapper is needed.

## Use `@editora/ui-core` directly

```bash
npm install @editora/ui-core
```

```svelte
<script>
  import '@editora/ui-core/button';
  import '@editora/ui-core/input';
</script>

<ui-button variant="solid" on:click={save}>Save</ui-button>
```

Custom elements work in Svelte markup as they are. Listen to `CustomEvent`s with `on:event-name`, and use `bind:this` to
assign array and object values (for example on `ui-sortable`) as properties.

Working example: [`examples/ui-core-svelte-direct`](https://github.com/ajaykr089/Editora/tree/main/examples/ui-core-svelte-direct).

See also the [framework guide](https://github.com/ajaykr089/Editora/blob/main/packages/ui-core/docs/FRAMEWORK_DIRECT_USAGE.md).
For React, use [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react).

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
