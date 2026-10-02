---
"@editora/comments": patch
"@editora/capitalization": patch
---

Fix toolbar icons rendering as solid black squares instead of their actual glyph when many plugins are loaded together. Both icons' upstream SVGRepo export used a class-based `<defs><style>.cls-1{fill:none}</style></defs>` block for a transparent bounding rect - fine when an icon is shadow-DOM-scoped, but this markup is inserted via raw `innerHTML` into plain light-DOM toolbar content alongside every other plugin's icon, so the `<style>` tag applied document-wide: any other icon reusing the same auto-generated class name would collide with it. Inlined the one declaration it held (`fill="none"`) directly on the rect instead, so there's nothing left to leak.
