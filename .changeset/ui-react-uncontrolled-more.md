---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

ColorPicker, Calendar, DateField and Stepper keep an uncontrolled value when another prop changes. ColorPicker `recent={false}` turns recent colours off. Picker `defaultOpen` opens the picker, and an open picker is no longer closed by an unrelated prop change.
