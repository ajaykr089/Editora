---
'@editora/ui-react': patch
---

`AlertDialogProvider` and `DialogProvider` define the dialog elements they open. The managers import the components for types only, which the build removes, so in a production bundle `confirm()` created an undefined `ui-alert-dialog` and nothing appeared (in development something else usually loaded it).
