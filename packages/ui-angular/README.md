# @editora/ui-angular

> [!WARNING]
> **Deprecated.** This package is no longer developed and will not get new components. Use
> [`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core) directly in Angular: its elements are standard
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

```ts
// app.module.ts (or the `schemas` of a standalone component)
@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })
```

```html
<ui-button variant="solid" (click)="save()">Save</ui-button>
```

Custom events work with Angular event binding. Array and object values (for example on `ui-sortable`) are properties:
read the element with `@ViewChild(...).nativeElement` and assign them there.

Working example: [`examples/ui-core-angular-direct`](https://github.com/ajaykr089/Editora/tree/main/examples/ui-core-angular-direct).

See also the [framework guide](https://github.com/ajaykr089/Editora/blob/main/packages/ui-core/docs/FRAMEWORK_DIRECT_USAGE.md).
For React, use [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react).

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
