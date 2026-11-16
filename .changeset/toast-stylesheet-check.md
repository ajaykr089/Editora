---
'@editora/toast': patch
---

When `toast.css` is not loaded, toasts still fall back to a minimal look, and the console now says so once, with the import to add. The check also finds the stylesheet inside a bundled CSS file (it sets `--editora-toast-stylesheet` on `:root`); it used to look only for a file named `toast.css` or an inline `<style>`.
