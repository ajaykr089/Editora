---
title: Testing with Editora UI
description: Test apps built on @editora/ui-react with Vitest or Jest (jsdom, Testing Library) and Playwright, including shadow-DOM queries, icons and forms.
keywords: [testing, vitest, jest, testing library, playwright, shadow dom, ui-react]
---

# Testing with Editora UI

Editora components are web components: each renders its controls (the select's combobox, the tab buttons, an input's `<input>`) inside a shadow root. Testing Library's standard queries do not look inside shadow roots, so they cannot find those controls. This page sets up Vitest or Jest with jsdom to see them, and shows the Playwright equivalent.

Every example on this page runs as written against React 19, `@testing-library/react` 16, `@testing-library/user-event` 14 and `shadow-dom-testing-library`.

## Setup (Vitest or Jest with jsdom)

```bash
npm install -D @testing-library/react @testing-library/user-event shadow-dom-testing-library jsdom
```

Use the `jsdom` environment and a setup file:

```ts
// vitest.config.ts
export default defineConfig({
  test: { environment: 'jsdom', setupFiles: ['./test/setup.ts'] },
});
```

```ts
// test/setup.ts
import { loadIcons } from '@editora/ui-core';

// jsdom lacks these browser APIs; several components observe size or media queries.
class ResizeObserverStub { observe() {} unobserve() {} disconnect() {} }
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
window.matchMedia ??= ((query: string) => ({
  matches: false, media: query, onchange: null,
  addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia;

// Built-in icons load on first use; load them up front so icon assertions are synchronous.
await loadIcons();
```

With Jest, list the same file under `setupFilesAfterEnv` and replace the top-level `await` with `beforeAll(() => loadIcons())`.

## Querying inside shadow roots

`shadow-dom-testing-library` adds `*ByShadow*` versions of every query (`getByShadowRole`, `findByShadowText`, ...). They search the page and every open shadow root, by role and accessible name, the same way the standard queries do:

```tsx
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { screen } from 'shadow-dom-testing-library';

it('switches tabs', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  render(
    <Tabs onChange={onChange}>
      <Tabs.Tab>Profile</Tabs.Tab>
      <Tabs.Tab>Billing</Tabs.Tab>
      <Tabs.Panel>…</Tabs.Panel>
      <Tabs.Panel>…</Tabs.Panel>
    </Tabs>
  );

  await user.click(await screen.findByShadowRole('tab', { name: 'Billing' }));
  expect(onChange).toHaveBeenCalledWith(1);
});
```

Things in the light DOM, such as a dropdown's trigger button that you rendered yourself, are found by the standard queries as usual.

### First render

Components render with every prop applied before `render()` returns, so you can assert straight away. Use `find*` queries for things that appear later: an opened menu or listbox, a dialog after an animation, a toast.

### Typing and fields

The text fields' `<input>` and `<textarea>` are reachable by their label:

```tsx
const email = screen.getByShadowRole('textbox', { name: 'Email' });
await user.type(email, 'ann@acme.test');
```

`onChange` on `Input` and `Textarea` fires on every keystroke; `onCommit` fires on blur or Enter.

## Helpers

These two helpers cover the most common interactions. Copy them into your test utilities:

```ts
// test/editora.ts
import { screen, within } from 'shadow-dom-testing-library';
import type { UserEvent } from '@testing-library/user-event';

/** Opens a Select found by its accessible name and picks an option by its text. */
export async function selectOption(user: UserEvent, name: string | RegExp, option: string | RegExp) {
  const combobox = await screen.findByShadowRole('combobox', { name });
  await user.click(combobox);
  const listbox = await screen.findByShadowRole('listbox');
  await user.click(within(listbox).getByShadowRole('option', { name: option }));
}

/** Opens a Dropdown by its trigger's name and returns its open menu. */
export async function openDropdown(user: UserEvent, trigger: string | RegExp) {
  await user.click(await screen.findByRole('button', { name: trigger }));
  return screen.findByShadowRole('menu');
}
```

```tsx
await selectOption(user, 'Role', 'Staff');
expect(onChange).toHaveBeenCalledWith('staff');

const menu = await openDropdown(user, 'Actions');
await user.click(within(menu).getByShadowRole('menuitem', { name: 'Export' }));
```

### Duplicate roles

Menus, dropdowns, menubars and popovers copy their content into their own panel and hide the original with `aria-hidden`, so role queries find one set of items.

A Select's `<option>` children are the exception: they stay in the light DOM, and jsdom cannot tell they are not displayed, so `getAllByShadowRole('option')` returns them as well as the listbox's options. Query inside the listbox, as `selectOption` does.

## Forms

jsdom does not implement `ElementInternals`, which the form fields use to take part in a `<form>`: in jsdom, `new FormData(form)` does not contain their values and `required` does not block submission. Test those behaviours in a real browser (below). Enter-to-submit and the `onSubmit` handler itself work in jsdom.

For sign-in forms, slot your own `<input slot="input">` into `Input` / `PasswordField` (see [Input](./form-inputs/input.md)); those inputs are ordinary form fields everywhere, jsdom included.

## Playwright

Playwright's locators look inside open shadow roots by default, so the built-in role queries work without helpers:

```ts
await page.getByRole('combobox', { name: 'Kind' }).click();
await page.getByRole('option', { name: 'Beta' }).click();
await expect(page.getByRole('combobox', { name: 'Kind' })).toHaveText('Beta');

await page.getByRole('tab', { name: 'Billing' }).click();
await page.getByRole('textbox', { name: 'Email' }).fill('ann@acme.test');
```

Playwright queries the accessibility tree, so the hidden originals of menu items and select options never match. Use it for anything layout, focus, form-association or animation related, which jsdom does not model.
