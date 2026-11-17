---
"@editora/icons": minor
---

New `searchIcons(query, { category?, limit? })` finds icons best match first, by name, alias (`delete` finds `trash`),
tag (`bin` finds `trash`, `ai` finds `sparkles`) and category (`weather`). Every word of the query has to match, and when
no icon matches them all, the icons that match the most words come back instead of nothing. Each result says what matched
(`{ name, score, matchedBy, matched }`), and icons added with `registerIcon` are searched too. New `listIconCategories()`
returns every category with its icon count, for picker filters. Every built-in icon now has at least one category (341 had
none; existing categories are unchanged, and all brand icons are also in `logos`), and 123 common icons gain search tags
for the words people type (`gear`, `bin`, `photo`, `email`, `ai`).
