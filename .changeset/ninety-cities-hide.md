---
"@editora/ui-core": patch
---

Fix 4 XSS vectors found during a security audit of ui-core's HTML string rendering, all reachable via public custom-element attributes without any script needing to run first: TimePicker's translations attribute was interpolated unescaped into its overlay markup (every sibling picker already escaped this correctly - TimePicker was the outlier); Chart's per-series/per-point tone value was interpolated unescaped into SVG fill/stroke attributes and legend/tooltip style attributes; Skeleton's height/width/radius/gap/duration attributes were interpolated unescaped into a style attribute; Orbiter's orbit-radius/ring-gap/center-size/padding attributes passed non-numeric values through completely unvalidated into a style attribute. Each is fixed at its actual point of use with either existing escapeHtml() helpers or a stricter allowlist for CSS length values, matching the pattern already used correctly elsewhere in the same files.
