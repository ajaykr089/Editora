---
'@editora/ui-core': minor
---

The built-in icon set (`@editora/icons`, about 135 KB minified) is no longer bundled into every component that can show an icon. Icons are looked up by name, so a static import kept the whole set in, for example, the Button entry (55.9 KB gzipped, 80% of it icons). The set now loads on first use as its own chunk: Button costs 8.9 KB gzipped up front, a 20-component admin set 129.7 KB instead of 176.8 KB, and the icons (47 KB) only load when a built-in icon is rendered. While they load, an icon's box is empty instead of showing its fallback letter. `loadIcons()` preloads them (call it at startup, or before asserting on icons in tests); `iconsLoaded()` and `whenIconsLoaded()` report the state. Icons added with `registerIcon()` still render immediately.
