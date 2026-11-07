# @editora/ui-testing

Test helpers for apps built on [Editora UI](https://www.npmjs.com/package/@editora/ui-react). Editora components draw their controls (a select's combobox, the tab buttons, an input's `<input>`) inside shadow roots, which Testing Library's standard queries do not search. These helpers act the way a user does, by role and accessible name, so a test reads like the screen:

```ts
await selectOption(user, 'Country', 'India');
await fillField(user, 'Email', 'ann@acme.test');
expect(await getFieldError('Email')).toBe('Already registered');
```

The same helpers exist for Playwright.

## Install

```bash
npm install -D @editora/ui-testing @testing-library/dom @testing-library/react @testing-library/user-event shadow-dom-testing-library jsdom
```

For Playwright you only need `@editora/ui-testing` next to `@playwright/test`.

## Vitest or Jest (jsdom)

Call `setupEditoraTests()` from your setup file. It stubs what jsdom lacks (`ResizeObserver`, `matchMedia`) and loads the built-in icons up front so icon assertions are synchronous:

```ts
// vitest.config.ts: test: { environment: 'jsdom', setupFiles: ['./test/setup.ts'] }
// test/setup.ts
import { setupEditoraTests } from '@editora/ui-testing';

await setupEditoraTests();
```

With Jest, list the file under `setupFilesAfterEnv` and use `beforeAll(() => setupEditoraTests())`.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fillField, getFieldError, selectOption, toggleField } from '@editora/ui-testing';

it('saves a contact', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ContactForm onSubmit={onSubmit} />);

  await fillField(user, 'Name', 'Ann Lee');
  await selectOption(user, 'Role', 'Staff');
  await toggleField(user, 'Send updates');
  await user.click(screen.getByRole('button', { name: 'Save' }));

  expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Ann Lee', role: 'staff' }));
});
```

| Helper | What it does |
| --- | --- |
| `setupEditoraTests({ icons? })` | Prepares jsdom; `icons: false` skips loading the icons. |
| `selectOption(user, label, option)` | Opens a Select (or MultiSelect) by its label and picks an option by its text. |
| `openDropdown(user, trigger)` | Opens a Dropdown by its trigger's name and returns the open menu. |
| `chooseMenuItem(user, trigger, item)` | Opens a Dropdown and chooses an item. |
| `selectTab(user, name)` | Selects a tab. |
| `fillField(user, label, text, { append?, commit? })` | Replaces (or appends to) a text field's value. `commit` leaves the field as a browser does on blur, so `onCommit` fires. |
| `toggleField(user, label)` | Clicks a Checkbox or Switch. |
| `getFieldError(label)` | The error a field shows: its validation or `form.setErrors()` message, or a native input's validity message while it is `aria-invalid`. Empty when there is none. |

Labels and names take a string (exact) or a RegExp. For anything else, query by role with `shadow-dom-testing-library`'s `screen.getByShadowRole(...)`.

## Playwright

```ts
import { fillField, getFieldError, selectOption } from '@editora/ui-testing/playwright';

test('saves a contact', async ({ page }) => {
  await page.goto('/contacts/new');
  await fillField(page, 'Name', 'Ann Lee');
  await selectOption(page, 'Role', 'Staff');
  await page.getByRole('button', { name: 'Save' }).click();
  expect(await getFieldError(page, 'Email')).toBe('');
});
```

The same verbs take a `Page` or a `Locator` to search within: `selectOption`, `openDropdown` (returns the menu's `Locator`), `chooseMenuItem`, `selectTab`, `fillField`, `toggleField` and `getFieldError`. Playwright's own locators already look inside open shadow roots; these helpers keep tests reading the same in both runners and handle the details (a list that opens in its own panel, a field's error living on its Editora element) in one place.

## What jsdom cannot show

jsdom has no layout, no `ElementInternals` (so `new FormData(form)` does not contain Editora fields' values and `required` does not block a native submit) and no animations. Test those in a real browser, with the Playwright helpers.

## License

MIT
