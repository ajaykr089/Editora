/**
 * The same user-level actions for Playwright. Playwright's locators already look inside open shadow
 * roots, so these are thin: they exist so tests read the same in both runners, and so the details
 * (an option list that renders after opening, a field's error living on its Editora host) are
 * handled once.
 *
 *   import { selectOption, getFieldError } from '@editora/ui-testing/playwright';
 *   await selectOption(page, 'Country', 'India');
 *
 * Every helper takes a Page or a Locator to search within.
 */
import type { Locator, Page } from '@playwright/test';
import { fieldError } from './field-error';

export type Name = string | RegExp;
type Scope = Page | Locator;

const FIELD_ROLES = ['textbox', 'searchbox', 'combobox', 'spinbutton', 'checkbox', 'switch', 'radiogroup', 'slider', 'listbox'] as const;
type FieldRole = (typeof FIELD_ROLES)[number];

/** The page a scope belongs to: options and menus open in panels outside the field. */
function pageOf(scope: Scope): Page {
  return 'page' in scope && typeof scope.page === 'function' ? (scope as Locator).page() : (scope as Page);
}

/** Opens a Select (or MultiSelect) found by its label and picks an option by its text. */
export async function selectOption(scope: Scope, name: Name, option: Name): Promise<void> {
  await scope.getByRole('combobox', { name }).click();
  await pageOf(scope).getByRole('listbox').getByRole('option', { name: option }).click();
}

/** Opens a Dropdown by its trigger's name and returns the open menu. */
export async function openDropdown(scope: Scope, trigger: Name): Promise<Locator> {
  await scope.getByRole('button', { name: trigger }).click();
  const menu = pageOf(scope).getByRole('menu');
  await menu.waitFor();
  return menu;
}

/** Opens a Dropdown by its trigger's name and chooses one of its items. */
export async function chooseMenuItem(scope: Scope, trigger: Name, item: Name): Promise<void> {
  const menu = await openDropdown(scope, trigger);
  await menu.getByRole('menuitem', { name: item }).click();
}

/** Selects a tab by its name. */
export async function selectTab(scope: Scope, name: Name): Promise<void> {
  await scope.getByRole('tab', { name }).click();
}

/**
 * Fills a text field found by its label, replacing its value (or adding to it with
 * `{ append: true }`). `{ commit: true }` presses Tab afterwards so `onCommit` fires.
 */
export async function fillField(
  scope: Scope,
  name: Name,
  text: string,
  options: { append?: boolean; commit?: boolean } = {}
): Promise<Locator> {
  const field = await findField(scope, ['textbox', 'searchbox', 'spinbutton', 'combobox'], name);
  if (options.append) {
    await field.focus();
    await field.press('End');
    await field.pressSequentially(text);
  } else {
    await field.fill(text);
  }
  if (options.commit) await field.press('Tab');
  return field;
}

/** Clicks a Checkbox or Switch found by its label; returns its control. */
export async function toggleField(scope: Scope, name: Name): Promise<Locator> {
  const control = await findField(scope, ['checkbox', 'switch'], name);
  await control.click();
  return control;
}

/** The error message a field shows (see the jsdom version); empty when it has none. */
export async function getFieldError(scope: Scope, name: Name): Promise<string> {
  const control = await findField(scope, [...FIELD_ROLES], name);
  return control.evaluate(fieldError);
}

async function findField(scope: Scope, roles: FieldRole[], name: Name): Promise<Locator> {
  const candidates = roles.map((role) => scope.getByRole(role, { name, exact: typeof name === 'string' }));
  const any = candidates.reduce((all, next) => all.or(next));
  await any.first().waitFor();
  for (const candidate of candidates) {
    const count = await candidate.count();
    if (count === 1) return candidate;
    if (count > 1) throw new Error(`Found ${count} fields named ${String(name)}: make the name more specific.`);
  }
  throw new Error(`No field named ${String(name)}.`);
}
