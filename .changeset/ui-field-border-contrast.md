---
'@editora/ui-core': minor
---

Field outlines reach 3:1 against the page (WCAG 1.4.11). Inputs, password and number fields, selects, multi-selects, comboboxes, tags inputs, text areas and the date and time pickers used the general line colour (about 1.6:1). The theme now sets `--ui-color-field-border` (half the text colour into the surface, about 3.4:1 on white) and `--ui-color-field-border-hover`; without a theme the same mix is computed from `--ui-color-text` and `--ui-color-surface`. Set `--ui-color-field-border` to choose your own. Soft, filled and other variants keep their own borders.
