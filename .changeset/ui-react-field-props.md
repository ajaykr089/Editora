---
'@editora/ui-react': patch
---

Form fields take the same props across components. `Checkbox` has `name`, `value`, `required` and `defaultChecked` (it already took part in forms; `defaultChecked` used to be written as an attribute the element ignores, so the box stayed unticked). The date, time and range pickers take `description` like `Input`, `Select` and `Textarea` (it is their `hint`, which still works).
