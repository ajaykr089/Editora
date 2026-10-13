---
"@editora/icons": patch
"@editora/react-icons": patch
---

Fix `absoluteStrokeWidth`, which did the opposite of what it says. Every stroke is drawn with `vector-effect="non-scaling-stroke"`, so its width is already in screen pixels at any size; the option scaled the width by `viewBox / size` on top of that, and a 1.5 stroke came out 3px at size 12 and 0.75px at size 48 (measured in Chromium). The option now leaves the width alone and the stroke stays `strokeWidth` pixels at every size. This also fixes `<ui-icon absolute-stroke-width>` in `@editora/ui-core` and `Icon` in `@editora/ui-react`, which render through `@editora/icons`. Nothing changes for code that does not pass the option.
