# ui-core Direct in Svelte

This example shows how to use `@editora/ui-core` directly in Svelte without `@editora/ui-svelte`.

It demonstrates:
- direct `ui-core` usage from Svelte with no wrapper package
- a routed showcase shell with category pages for forms, pickers, navigation, overlays, data, and motion
- a full catalog route that mounts the broader component directory
- direct property assignment and `CustomEvent` handling on `ui-sortable`

## Routes

- `#/overview`
- `#/forms`
- `#/pickers`
- `#/navigation`
- `#/overlays`
- `#/data`
- `#/motion`
- `#/catalog`

## Run

From the repo root:

```bash
source /usr/local/opt/nvm/nvm.sh
nvm use 22.12.0
npm run build --prefix packages/ui-core
npm run dev --prefix examples/ui-core-svelte-direct
```

## Build

```bash
source /usr/local/opt/nvm/nvm.sh
nvm use 22.12.0
npm run build --prefix examples/ui-core-svelte-direct
```
