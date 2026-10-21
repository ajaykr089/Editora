---
"@editora/ui-core": minor
---

A flatter, Radix Themes style look for the everyday components, and a 6px default radius.

This is a visible change; nothing about the API changes.

- **Radius:** the default `radius` is 6px (was 4px), so controls, cards and panels are slightly rounder. Set `radius: '4px'` in your theme to keep the old shape.
- **Buttons:** flat fills (no glow, no hover lift), a neutral `secondary` with a hairline border, a 2px focus ring, medium weight. `recipe` (`soft`, `surface`, `outline`, `ghost`) now works on every coloured variant; before it only changed `secondary`. Status fills (`danger`, `success`) are a shade deeper so white text meets 4.5:1 (it was 3.9:1 and 3.2:1), and `warning` takes dark text on an amber warning colour.
- **Fields:** input, password, number, select, combobox, multi-select, tags, textarea and the date/time pickers have a stronger hairline border (it was about 10% black), a darker border on hover, and a 2px focus ring inside the border instead of a soft 3-4px glow. Invalid, success and warning states are a 1px ring in the status colour on top of the border (a 2px line), not a pale glow. The combobox no longer lifts on focus. Placeholder text is 4.5:1 or better (it was 2.7:1 in the select).
- **`ui-field`** is flat: no border, background or padding. `variant="surface" | "outline" | "soft" | "contrast" | "elevated"` draw the box as before.
- **`ui-tabs`** default is a line: a hairline under the tabs and a 2px accent line under the selected one, with no box around the tabs or the panel. The old pill look is `variant="segmented"`; the other variants are unchanged.
- **Checkbox, radio, switch:** 16px checkbox and radio with a neutral border and a solid accent fill when checked (the check is dark on the amber accent), a 36x20px switch with a white thumb and a double-ring focus.
- **`ui-card`** has one hairline border and no shadow; **`ui-badge`** is a soft tinted label with no border and a 4px radius (`variant="solid"` for a filled one).
- New tokens: `--ui-color-placeholder` and `--ui-color-foreground-on-warning`. The built-in themes no longer pin the border of input, select and multi-select, the focus ring of input, the shadow, border and radius of card, or the look of badge, so the component defaults apply; custom themes that set them still win.
