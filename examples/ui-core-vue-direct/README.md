# ui-core Direct in Vue

This example shows how to use `@editora/ui-core` directly in Vue 3 without `@editora/ui-vue`.

It demonstrates:
- standalone component imports such as `@editora/ui-core/button`
- standard `CustomEvent` handling from Vue
- direct property assignment for `ui-sortable` (`lists` and `items`)
- a realistic release-planning board workflow

## Run

From the repo root:

```bash
source /usr/local/opt/nvm/nvm.sh
nvm use 22.12.0
npm run build --prefix packages/ui-core
npm run dev --prefix examples/ui-core-vue-direct
```

## Build

```bash
source /usr/local/opt/nvm/nvm.sh
nvm use 22.12.0
npm run build --prefix examples/ui-core-vue-direct
```
