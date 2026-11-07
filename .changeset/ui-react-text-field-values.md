---
'@editora/ui-react': minor
---

Text fields follow React's model for `<input>`. **Behaviour change:** `onChange` on `Input` and `Textarea` now fires on every keystroke (like `onInput`); the old behaviour, firing when the edit is committed on blur or Enter, is the new `onCommit` prop. New `defaultValue` on Input, Textarea, NumberField and Combobox sets the starting value of an uncontrolled field. `value` with a change handler is controlled: typing works when you store each value, and a value you reject or transform (for example upper-casing) is what the field shows, with the caret kept where the user typed. `value` without a handler is still an initial value. NumberField adds `onInput({ rawValue, value })` per keystroke and is controlled on commit (partial text such as `1.` is not a number yet); Combobox's selected `value` is controlled on selection. FiltersBar's search box is no longer forced to a controlled empty value when you pass `onSearchChange` without `search`.
