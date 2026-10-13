// Run checks for the examples of the @editora/ui-react README.
import fs from 'node:fs';
import path from 'node:path';
import { readmes, root } from '../shared.mjs';

export default async function checks({ run, ok, fail }) {
  // Everything the README's component and hook lists name is exported from the package.
  const readme = fs.readFileSync(readmes['ui-react'], 'utf8');
  const listed = readme.slice(readme.indexOf('## Components'), readme.indexOf('## Floating positioning'));
  const names = [...new Set([...listed.matchAll(/`([A-Z][A-Za-z0-9]+|use[A-Z][A-Za-z0-9]+)`/g)].map((match) => match[1]))];
  const index = fs.readFileSync(path.join(root, 'packages/ui-react/src/index.tsx'), 'utf8');
  const missing = names.filter((name) => !new RegExp(`\\b${name}\\b`).test(index));
  if (missing.length) fail(`the README lists names the package does not export: ${missing.join(', ')}`);
  else ok(`all ${names.length} components and hooks in the README are exported`);

  const count = (page, selector) => page.locator(selector).count();

  await run('ui-react-quick-start', async (page) => {
    const upgraded = await page.evaluate(() => ['ui-input', 'ui-button'].every((tag) => !!document.querySelector(tag)?.shadowRoot));
    if (!upgraded) return 'the elements did not render';
    return (await count(page, 'text=Title')) ? true : 'the input does not show its label';
  });

  await run('ui-react-imports', async (page) => {
    const rendered = await page.evaluate(() => ({ inputs: document.querySelectorAll('ui-input').length, buttons: document.querySelectorAll('ui-button').length }));
    return rendered.inputs === 2 && rendered.buttons === 2 ? true : `expected 2 inputs and 2 buttons, got ${JSON.stringify(rendered)}`;
  });

  await run('ui-react-form', async (page, { logs }) => {
    const submit = page.getByRole('button', { name: 'Submit' });
    if (!(await submit.isDisabled())) return 'Submit should start disabled';
    await page.getByRole('button', { name: 'Validate' }).click();
    await page.waitForTimeout(300);
    if (!(await count(page, 'text=Please fill out this field'))) return 'Validate does not show the errors';
    await page.locator('ui-input[name="fullName"] input').fill('Ada Lovelace');
    await page.locator('ui-input[name="email"] input').fill('ada@example.com');
    await page.waitForTimeout(400);
    if (await submit.isDisabled()) return 'Submit stays disabled after typing: the dirty state does not reach React';
    await submit.click();
    await page.waitForTimeout(300);
    if (!logs.some((line) => line.startsWith('submit') && /Ada Lovelace/.test(line))) return 'onSubmit did not receive the values';
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.waitForTimeout(400);
    return (await submit.isDisabled()) ? true : 'Reset did not make the form clean again';
  });

  await run('ui-react-dialogs', async (page, { logs }) => {
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(500);
    if (!(await count(page, 'text=Archive project?'))) return 'the confirm dialog is not shown (under StrictMode it used to be dismissed at once)';
    await page.getByRole('button', { name: 'Archive', exact: true }).click();
    await page.waitForTimeout(400);
    if (!logs.some((line) => /action: submit/.test(line))) return `confirm() did not resolve with submit (${logs.filter((l) => /action/.test(l)).join(' | ')})`;
    await page.getByRole('button', { name: 'Prompt' }).click();
    await page.waitForTimeout(500);
    const input = page.locator('input[placeholder="New name"]');
    if (!(await input.count())) return 'the prompt dialog has no input';
    await input.first().fill('Roadmap');
    await page.locator('ui-alert-dialog').getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(400);
    return logs.some((line) => /Roadmap/.test(line)) ? true : 'prompt() did not resolve with the typed value';
  });

  await run('ui-react-data-table', async (page) => {
    if (!(await count(page, 'text=Showing 1-2 of 4'))) return 'the first page does not show rows 1-2 of 4';
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.waitForTimeout(400);
    return (await count(page, 'text=Showing 3-4 of 4')) && (await count(page, 'text=Lena')) ? true : 'the pager did not move to rows 3-4';
  });

  await run('ui-react-pickers', async (page) => {
    const labels = ['Start date', 'Window', 'Publish at'];
    const missing = [];
    for (const label of labels) if (!(await count(page, `text=${label}`))) missing.push(label);
    return missing.length ? `missing: ${missing.join(', ')}` : true;
  });

  await run('ui-react-gantt', async (page) => {
    const found = (await count(page, 'text=Foundation')) && (await count(page, 'text=Handoff milestone'));
    return found ? true : 'the tasks are not shown';
  });

  await run('ui-react-theme', async (page) => {
    const state = await page.evaluate(() => ({
      primary: getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary').trim(),
      stored: Object.keys(localStorage).includes('my-app.theme'),
    }));
    return state.primary === '#0f766e' && state.stored ? true : `the theme is ${JSON.stringify(state)}`;
  });

  await run('ui-react-floating', async (page) => {
    await page.getByRole('button', { name: 'Open' }).click();
    await page.waitForTimeout(500);
    if (!(await count(page, 'text=Floating content'))) return 'the floating content did not open';
    const gap = await page.evaluate(() => {
      const trigger = [...document.querySelectorAll('button')].find((b) => b.textContent === 'Open').getBoundingClientRect();
      const text = document.evaluate("//div[contains(text(), 'Floating content')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
      return text ? Math.round(text.getBoundingClientRect().top - trigger.bottom) : null;
    });
    if (gap === null || gap < 0 || gap > 40) return `the panel is ${gap} px from its button`;
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    return (await count(page, 'text=Floating content')) === 0 ? true : 'Escape did not close it';
  });

  await run('ui-react-gallery', async (page) => {
    const tags = ['ui-input', 'ui-button', 'ui-badge', 'ui-avatar', 'ui-alert', 'ui-switch', 'ui-checkbox', 'ui-progress', 'ui-date-picker'];
    const missing = await page.evaluate((list) => list.filter((tag) => !document.querySelector(tag)?.shadowRoot), tags);
    return missing.length ? `did not render: ${missing.join(', ')}` : true;
  });
}
