---
'@editora/ui-testing': minor
---

New package: test helpers for apps built on Editora UI. `setupEditoraTests()` prepares jsdom (ResizeObserver and matchMedia stubs, icons loaded up front), and user-level actions reach inside shadow roots by label or name: `selectOption`, `openDropdown`, `chooseMenuItem`, `selectTab`, `fillField` (with `append` and `commit`), `toggleField` and `getFieldError`, for Testing Library with user-event. `@editora/ui-testing/playwright` has the same verbs for Playwright.
