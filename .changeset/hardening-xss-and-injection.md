---
"@editora/core": patch
"@editora/plugins": patch
"@editora/comments": patch
"@editora/media-manager": patch
"@editora/code-sample": patch
"@editora/math": patch
"@editora/plugin-link": patch
"@editora/emojis": patch
"@editora/template": patch
"@editora/a11y-checker": patch
"@editora/embed-iframe": patch
"@editora/markdown-editor": patch
---

Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
