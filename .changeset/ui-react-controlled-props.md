---
'@editora/ui-react': patch
---

Controlled props win. When you pass `selected`/`value` (Tabs), `page` (Pagination), `value` (Select, Slider, RadioGroup, ToggleGroup, MultiSelect), `checked` (Checkbox, Switch), `pressed` (Toggle) or `open` (Dialog, Drawer, Dropdown, Popover) together with a change handler, the element now goes back to the prop when your handler does not accept a change, instead of drifting from React state. Without a handler the prop is still the initial value, as before. Text fields (Input, Textarea, NumberField, Combobox) are unchanged for now.
