---
'@editora/ui-react': patch
---

`Button` keeps the standard `aria-label` attribute. The host props overwrote it with the camelCase `ariaLabel` prop (undefined unless given), so an icon-only `<Button aria-label="Close">` had no accessible name.
