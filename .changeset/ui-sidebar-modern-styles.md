---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

A modern look for `ui-sidebar`, and new styles to choose from.

- Every variant: medium-weight labels (the current page semibold), muted icons that brighten on hover and for the current page, the current item marked by a quiet fill with no tinted border, tighter rows, a guide line for nested items, quieter section labels, smaller badges and a soft promo panel.
- New variants: `inset` (on the page canvas, the current item raised like a card; pair it with `ui-layout variant="shell" inset`, React `<Layout variant="shell" inset>`, which puts the content on a raised card), `indicator` (a brand-colour bar on the current item), and `pill` (rounded, roomier rows).
- `contrast` is now a neutral near-black with the brand only on the current item, instead of a navy gradient.
- New tokens: `--ui-sidebar-item-font-weight`, `--ui-sidebar-item-active-font-weight`, `--ui-sidebar-icon-color`, `--ui-sidebar-indicator`, and `--ui-layout-inset-canvas` / `--ui-layout-inset-gap` on the layout.
