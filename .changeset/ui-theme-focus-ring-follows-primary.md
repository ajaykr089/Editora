---
'@editora/ui-core': patch
---

`createThemeTokens({ colors: { primary } })` gives focus rings the new primary colour. The baseline's amber `focusRing` used to stay, so an app that set only its brand colour had gold outlines on every focused field, date and button. Pass `colors.focusRing` to choose a different ring colour.
