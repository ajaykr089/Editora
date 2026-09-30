---
"@editora/media-manager": patch
"@editora/a11y-checker": patch
---

Fix the same duplicate-stacked-overlay bug as the prior patch (see `dialog-overlay-stacking.md`) in two more plugins found during continued systematic QA: Insert Image/Video (`@editora/media-manager`) and the Accessibility Checker (`@editora/a11y-checker`, whose `toggleA11yChecker` command is misleadingly named - it always opened a new dialog rather than actually toggling one closed). Both now remove any existing instance of their dialog before creating a new one.
