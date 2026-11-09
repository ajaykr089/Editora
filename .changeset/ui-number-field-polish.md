---
'@editora/ui-core': patch
---

`ui-number-field` looks like the fields around it. The value is start-aligned (with a prefix such as `$`, the number used to sit at the far end; `--ui-number-field-align: right` still lines numbers up), the stepper buttons show − and + instead of tiny filled triangles (still full-height, at least 24px wide), and decimals that come only from `step` are no longer padded: `step="0.5"` shows 24 as "24", not "24.0". `precision` still pads.
