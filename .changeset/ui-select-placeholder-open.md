---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

Select: `value=""` with a `placeholder` now shows the placeholder instead of the first option (the React wrapper synced `value` before `placeholder` and removed an empty value instead of writing it). `ui-select` also updates its shadow DOM in place after the first render instead of rebuilding it when options or slots change, so the combobox a test just found stays connected and clicking it opens the list (it used to be replaced one tick after mount, which made the list impossible to open from Testing Library), and focus survives option changes.
