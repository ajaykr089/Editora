---
"@editora/themes": patch
---

Centre the check mark of a checked checklist item. The mark was a "✓" text glyph placed with hand-tuned `left` / `top` offsets, so where it landed depended on the font's glyph metrics: in practice it sat low and to the right of centre in the box. It is now an SVG laid over the exact box of the checkbox (the same size, border included) and centred in it, so it is centred whatever the font.
