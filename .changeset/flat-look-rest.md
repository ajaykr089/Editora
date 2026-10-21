---
"@editora/ui-core": minor
---

The flat, Radix Themes style look, for the rest of the everyday components. Visible change, no API change.

- **Alert:** a flat tint with a hairline in the tone colour, a plain icon (no circle), no shadow. The coloured bar on the leading edge is now opt-in: `indicator="line"` (it used to be on unless `indicator="none"`). Theme keys `alert.border`, `alert.shadow` and `alert.icon-size` are no longer pinned by the built-in themes.
- **Slider, progress, meter, skeleton:** no box around the slider, a 4px track with a white thumb and no pulsing end dot; progress and meter are 6px with a solid fill (progress sizes xs/sm/lg are 3/4/8px); skeletons use the neutral fill colour.
- **Avatar, breadcrumb, pagination:** a soft tinted avatar without border or shadow; the current breadcrumb is bold with no pill and no hover lift; pagination loses its bordered bar and uses 24/32/40px buttons from the control scale with a solid accent for the current page. The built-in themes no longer pin the avatar's border, shadow and background.
- **Calendar:** days are plain cells (the bordered tile per day is gone), the selected day is a solid accent, outside days are the muted colour at full strength (4.5:1).
- **Accordion, collapsible, stepper:** flat surfaces with dividers; the accent bar on an open accordion item is opt-in (`indicator="line"`); stepper steps have no card, a solid circle marks the current step.
- **Toggle, toggle group, toolbar:** a pressed toggle is a soft accent with dark text (was a solid fill); `ui-toggle` no longer draws a default dot glyph (pass `icon-on` / `icon-off`); the toggle group and toolbar lose their padded box.
- **Pin input, empty state, file upload:** 40px pin slots with a readable placeholder; the default action of the empty state and the "Choose files" button are primary buttons (the tinted version was unreadable on the amber accent).
- **Hover card, drawer:** the flat overlay surface (solid panel colour, hairline, theme shadow).
- Invalid-style glows on avatar and file-upload states are rings, not blurred shadows.
