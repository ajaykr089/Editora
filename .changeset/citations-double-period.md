---
"@editora/citations": patch
---

Fix bibliography entries getting a doubled period whenever the author, title, or source field already ends in one. `formatBibliographyEntry` unconditionally appended a literal `.` after each of those fields in every style - but APA/Chicago author names are conventionally entered as `Last, F.` (already period-terminated for the initial), so a real citation like author "Smith, J." rendered as "Smith, J.. (2024)." in the generated bibliography, for every one of the three supported styles.

Found via live testing: inserting a citation with a standard APA-style author name produced a visibly doubled period in the "References" section. Fixed with a small helper that only appends a period when the field doesn't already end in sentence-terminal punctuation; verified live that APA, MLA, and Chicago bibliography entries all render with correct single punctuation.
