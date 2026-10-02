---
"@editora/plugin-table": patch
---

Fix the floating table toolbar rendering as unstyled default `<button>` elements (visible OS borders, no icon/hover/dark-mode styling) instead of the app's design system. Unlike every sibling plugin with custom UI (comments, citations, preview, track-changes - all of which self-inject a `<style>` tag at runtime), this plugin only shipped its CSS as a static `table.css` import, relying on the consuming app's bundler to pick it up. A consumer using the web component build - which doesn't process arbitrary plugin CSS imports through a bundler the way a React app's Vite/webpack config does - never got this CSS at all. Now self-injects the toolbar's styles at runtime, matching the established sibling-plugin pattern, so the toolbar is correctly styled regardless of how the plugin was loaded.
