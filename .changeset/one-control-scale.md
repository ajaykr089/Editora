---
"@editora/ui-core": minor
---

One control scale: buttons and form controls now line up at 24 / 32 / 40px.

Before, a default button was 36px, an input 40-42px, a select 42-44px and a multi-select 44px, so a row of them never lined up, and the three sizes differed per component. Now `ui-button`, `ui-input`, `ui-password-field`, `ui-number-field`, `ui-select`, `ui-combobox`, `ui-multi-select`, `ui-tags-input`, `ui-toggle` and the date and time pickers are 32px by default, 24px at `size="sm"` and 40px at `size="lg"`, with 12 / 14 / 16px text and the theme `radius` (previously 4, 10 or 12px depending on the component). `ui-textarea` takes the same text size, padding and radius. `ui-button` `scale` 1-4 maps to 24 / 32 / 40 / 48px. `ui-tags-input` gains `size`.

This is a visible change: default controls are shorter than before (button 36 to 32px, input 40 to 32px, select 42 to 32px). Set `--ui-control-height-2: 36px` on the page to get the old button height back, or set `components.button['height-md']` (and the matching input, select and multi-select keys) in your theme; those still win over the scale. The built-in light and dark themes no longer define those height keys.

Fixed: in the small size, the clear, show-password and dropdown-arrow buttons inside a field were 22-28px and now stay 24px tall (WCAG 2.2 target size).
