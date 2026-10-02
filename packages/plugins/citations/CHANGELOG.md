# @editora/citations

## 1.0.2

### Patch Changes

- bb45a9d: Fix bibliography entries getting a doubled period whenever the author, title, or source field already ends in one. `formatBibliographyEntry` unconditionally appended a literal `.` after each of those fields in every style - but APA/Chicago author names are conventionally entered as `Last, F.` (already period-terminated for the initial), so a real citation like author "Smith, J." rendered as "Smith, J.. (2024)." in the generated bibliography, for every one of the three supported styles.

  Found via live testing: inserting a citation with a standard APA-style author name produced a visibly doubled period in the "References" section. Fixed with a small helper that only appends a period when the field doesn't already end in sentence-terminal punctuation; verified live that APA, MLA, and Chicago bibliography entries all render with correct single punctuation.

- 365ed30: Fix the Citations panel giving sighted users no feedback at all when "Insert Citation" fails validation (e.g. a missing Title) or succeeds. The panel already computed the right message ("Author and title are required.", "Citation inserted.", etc.) and wrote it into a `.rte-citations-live` region - but that element is the standard visually-hidden "sr-only" pattern, meant only for screen readers via `aria-live`. A sighted user who forgot to fill a required field and clicked Insert saw literally nothing happen, with no indication why. Found via live-browser testing. Fixed by also writing the same message into a new, visible status line (red for errors, green for success), while leaving the existing screen-reader announcement untouched.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
