---
"@editora/conditional-content": patch
---

Fix conditional-content block headers becoming nearly illegible (light gray-white text on a pale cyan background) when Preview mode is toggled on inside a dark-themed editor. The preview-mode header background rule (`.rte-conditional-preview-on ... .rte-conditional-header { background: #ecfeff }`) was never theme-scoped, so it always applied - and because it combines more class/attribute selectors than the existing dark-mode header rule, it won on specificity and silently overrode the dark background back to its light-mode color, while the dark-mode text color rule (meant to pair with a dark background) stayed in effect. Found via a screenshot showing the condition text nearly unreadable. Fixed by adding a dark-theme-scoped override for the preview-mode header background, using a dark teal that stays visually distinct from the normal (non-preview) dark header, mirroring how the light theme distinguishes preview mode with a cyan tint.
