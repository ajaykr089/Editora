---
"@editora/ui-core": patch
---

Controls that reached assistive technology without a name now have one, and a few invalid ARIA references are gone. Verified with Chromium's accessibility tree over all 602 Storybook stories: 202 unnamed interactive controls became 0.

- **`ui-field`** labelled its control with an `aria-labelledby` pointing into its own shadow root, which can never resolve, so a slotted `<input>`, `ui-input`, `ui-textarea` or `ui-checkbox` was exposed unnamed. It now copies the label text onto the control as an `aria-label` (unless the author named it), and `ui-input`, `ui-textarea`, `ui-number-field`, `ui-password-field`, `ui-tags-input`, `ui-combobox` and the date/time pickers forward a host `aria-label` to the inner control. The pickers fall back to their placeholder.
- **`ui-password-field`** never showed its label, description or error when the attributes were set after the element connected (React does this), because the text was written to the slot fallback only at first render.
- **`ui-progress`** (line and circular), **`ui-tree`** and **`ui-tabs`** (tablist) forward `aria-label`; a progress bar falls back to its `label` and then "Progress". **`ui-rating`** falls back to its `label` and then "Rating". An interactive **`ui-card`** is named after its title. **`ui-wizard`** panels are named with the step title instead of an unresolvable `aria-labelledby`.
- **`ui-alert-dialog`**: the host carries `role="alertdialog"`, so a closed dialog was an empty, unnamed alert dialog in the page. It is now hidden from assistive technology while closed and named while open.
- **`ui-checkbox`** and **`ui-radio`** no longer set (and overwrite an author's) `aria-labelledby` pointing into their own shadow root.
