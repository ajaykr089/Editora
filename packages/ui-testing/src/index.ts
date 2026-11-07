/**
 * Test helpers for apps built on Editora UI, for Vitest or Jest with jsdom and Testing Library.
 *
 * Editora components render their controls (a select's combobox, tab buttons, an input's <input>)
 * inside shadow roots, which Testing Library's standard queries do not search. These helpers act
 * the way a user does, by role and accessible name, through `shadow-dom-testing-library`, so a
 * test reads like the screen: `await selectOption(user, 'Country', 'India')`.
 *
 * Peer dependencies: @testing-library/dom, @testing-library/user-event, shadow-dom-testing-library
 * (and @editora/ui-core for setupEditoraTests). For Playwright, see `@editora/ui-testing/playwright`.
 */
import { screen, within } from 'shadow-dom-testing-library';
import type { UserEvent } from '@testing-library/user-event';
import { fieldError } from './field-error';

export type Name = string | RegExp;

export { fieldError } from './field-error';

/**
 * Prepares jsdom for Editora components: stubs the browser APIs it lacks (ResizeObserver,
 * matchMedia) and loads the built-in icons up front so icon assertions are synchronous. Call it
 * from your test setup file: `await setupEditoraTests()` (Vitest) or
 * `beforeAll(() => setupEditoraTests())` (Jest).
 */
export async function setupEditoraTests(options: { icons?: boolean } = {}): Promise<void> {
  const g = globalThis as typeof globalThis & { ResizeObserver?: unknown };
  if (typeof g.ResizeObserver === 'undefined') {
    g.ResizeObserver = class ResizeObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
  if (options.icons !== false) {
    const { loadIcons } = await import('@editora/ui-core');
    await loadIcons();
  }
}

/** Opens a Select (or MultiSelect) found by its label and picks an option by its text. */
export async function selectOption(user: UserEvent, name: Name, option: Name): Promise<void> {
  const combobox = await screen.findByShadowRole('combobox', { name });
  await user.click(combobox);
  const listbox = await screen.findByShadowRole('listbox');
  await user.click(within(listbox).getByShadowRole('option', { name: option }));
}

/** Opens a Dropdown (or menu button) by its trigger's name and returns the open menu. */
export async function openDropdown(user: UserEvent, trigger: Name): Promise<HTMLElement> {
  await user.click(await screen.findByShadowRole('button', { name: trigger }));
  return screen.findByShadowRole('menu');
}

/** Opens a Dropdown by its trigger's name and chooses one of its items. */
export async function chooseMenuItem(user: UserEvent, trigger: Name, item: Name): Promise<void> {
  const menu = await openDropdown(user, trigger);
  await user.click(within(menu).getByShadowRole('menuitem', { name: item }));
}

/** Selects a tab by its name. */
export async function selectTab(user: UserEvent, name: Name): Promise<void> {
  await user.click(await screen.findByShadowRole('tab', { name }));
}

/**
 * Types into a text field (Input, Textarea, PasswordField, NumberField, ...) found by its label,
 * replacing what is there unless `{ append: true }`. Pass `{ commit: true }` to leave the field
 * afterwards, as a browser does on blur, so `onCommit` fires.
 */
export async function fillField(
  user: UserEvent,
  name: Name,
  text: string,
  options: { append?: boolean; commit?: boolean } = {}
): Promise<HTMLElement> {
  const field = await findTextField(name);
  const before = (field as HTMLInputElement).value ?? '';
  if (options.append) {
    if (text) await user.type(field, text);
  } else {
    // user.clear() refuses fields inside a shadow root (the page reports their host as focused),
    // so select what is there and type over it, as a user would.
    const length = ((field as HTMLInputElement).value ?? '').length;
    const selection = { initialSelectionStart: 0, initialSelectionEnd: length };
    if (text) await user.type(field, text, selection);
    else if (length) await user.type(field, '{Backspace}', selection);
  }
  if (options.commit) {
    // Leaving the field: browsers fire `change` on blur after an edit, jsdom does not, and
    // user.tab() starts from the field's host, so the inner control would never see the blur.
    if (((field as HTMLInputElement).value ?? '') !== before) field.dispatchEvent(new Event('change', { bubbles: true }));
    field.blur();
  }
  return field;
}

/** Clicks a Checkbox or Switch found by its label; returns its control. */
export async function toggleField(user: UserEvent, name: Name): Promise<HTMLElement> {
  const control = await findByAnyRole(['checkbox', 'switch'], name);
  await user.click(control);
  return control;
}

/**
 * The error message a field shows, found by the field's label: an Editora field's validation or
 * `setErrors` message, or a native control's validity message while it is invalid. Empty when the
 * field has no error.
 */
export async function getFieldError(name: Name): Promise<string> {
  return fieldError(await findByAnyRole(FIELD_ROLES, name));
}

const FIELD_ROLES = ['textbox', 'searchbox', 'combobox', 'spinbutton', 'checkbox', 'switch', 'radiogroup', 'slider', 'listbox'];

async function findTextField(name: Name): Promise<HTMLElement> {
  return findByAnyRole(['textbox', 'searchbox', 'spinbutton', 'combobox'], name);
}

async function findByAnyRole(roles: string[], name: Name): Promise<HTMLElement> {
  // findBy* would wait out its timeout on every role that does not match: look once, then wait
  // only if nothing matched yet (a field rendered after an async step).
  const lookup = () => {
    for (const role of roles) {
      const found = screen.queryAllByShadowRole(role, { name });
      if (found.length === 1) return found[0] as HTMLElement;
      if (found.length > 1) throw new Error(`Found ${found.length} elements with role "${role}" and name ${String(name)}: make the name more specific.`);
    }
    return null;
  };
  const now = lookup();
  if (now) return now;
  const { waitFor } = await import('@testing-library/dom');
  return waitFor(() => {
    const found = lookup();
    if (!found) throw new Error(`No field named ${String(name)} with role ${roles.join(', ')}.`);
    return found;
  });
}
