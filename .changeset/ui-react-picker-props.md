---
'@editora/ui-react': patch
---

Pickers: `clearable={false}`, `allowInput={false}` and the other props whose element default is on (`closeOnSelect` on DatePicker, `allowPartial`, `allowSameDay`, `autoNormalize`) now turn the feature off; the wrapper used to remove the attribute, which the element reads as on. An uncontrolled picker (no `value` prop) keeps the date the user picked when another prop changes; the wrapper used to clear it.
