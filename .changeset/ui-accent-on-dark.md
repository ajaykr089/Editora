---
'@editora/ui-core': patch
---

Contrast variants and dark panels follow the brand colour: 54 places that hard-coded a light blue (`#93c5fd`) for accents, focus rings and fills on dark surfaces now use the new `--ui-color-accent-on-dark` theme token (a light tint of the primary colour), with the old blue as the fallback when no theme is applied. Found with a custom-brand dark-theme audit over all Storybook stories.
