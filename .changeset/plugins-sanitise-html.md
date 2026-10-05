---
"@editora/code": patch
"@editora/preview": patch
"@editora/document-manager": patch
"@editora/plugins": patch
---

Sanitise HTML in three plugins that handled it with hand-rolled code. The preview dialog and the source-view "Save" used a blacklist on a live detached `<div>` (so `<img onerror>` ran during the cleanup, and `javascript:` links with leading whitespace, mixed case or an embedded newline kept their `href`); importing a `.docx` assigned Mammoth's unsanitised output straight into the editor, and the Word/PDF export parsed the document into a live `<div>`. They now use a shared DOMPurify-based helper (formatting, tables, links and images are kept; scripts, event handlers, `javascript:`/non-image `data:` URLs, `srcdoc`, `<style>`, forms, `<base>` and `<meta>` are removed) and an inert `DOMParser` for read-only traversal.
