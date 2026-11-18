---
"@editora/version-diff": patch
"@editora/plugins": patch
---

Fix `VersionDiffPlugin({ baselineHtml })` having no effect. The plugin remembers the editor's starting content the first time the editor is focused or typed in, and that remembered copy was checked before the `baselineHtml` option, so the dialog compared the document with itself and always showed "No changes detected" (only `getBaselineHtml` worked). The option now outranks the remembered starting content; a baseline set at run time (`setVersionDiffBaseline` or "Set Current as Baseline") still outranks both.
