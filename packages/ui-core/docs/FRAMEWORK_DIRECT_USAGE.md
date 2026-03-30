# Framework Direct Usage

`@editora/ui-core` is designed to work directly in framework applications because it ships standards-based custom elements and `CustomEvent` payloads.

## When Direct Usage Works Well

Direct usage is a good fit when a component is primarily driven by:

- string and boolean attributes
- slotted content
- standard DOM events or `CustomEvent.detail`

Examples:

- `ui-button`
- `ui-input`
- `ui-date-picker`
- `ui-alert`
- `ui-dialog`

## When You Need a Ref or Element Handle

Some components expose richer APIs through properties or imperative methods. In those cases, use the framework’s element reference pattern:

- Vue: `ref`
- Svelte: `bind:this`
- Angular: `@ViewChild`

The main example in this category is `ui-sortable`, which expects array-valued properties such as:

- `lists`
- `items`

## Example Projects

- Vue: [`examples/ui-core-vue-direct`](https://github.com/ajaykr089/Editora/tree/main/examples/ui-core-vue-direct)
- Svelte: [`examples/ui-core-svelte-direct`](https://github.com/ajaykr089/Editora/tree/main/examples/ui-core-svelte-direct)
- Angular: [`examples/ui-core-angular-direct`](https://github.com/ajaykr089/Editora/tree/main/examples/ui-core-angular-direct)

## Framework Notes

### Vue

- Import `ui-core` custom elements on the client.
- If you use runtime templates, mark `ui-*` tags as custom elements.
- For array/object properties, write to the underlying element reference after mount and whenever state changes.

### Svelte

- Custom elements work directly in markup.
- Use `on:event-name` for `CustomEvent` listeners.
- Use `bind:this` when a component needs non-string properties.

### Angular

- Add `CUSTOM_ELEMENTS_SCHEMA`.
- Use Angular event binding for custom events.
- Use `@ViewChild(...).nativeElement` when a custom element expects object or array properties.

## SSR Note

If a framework route renders on the server, register `ui-core` custom elements in a client-only boundary. The custom elements themselves are browser APIs, so registration should happen where `window` and `customElements` exist.
