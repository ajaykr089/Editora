// Run checks for the examples of the @editora/ui-core README.
import fs from 'node:fs';
import path from 'node:path';
import { readmes, root } from '../shared.mjs';

export default async function checks({ run }) {
  // Every component the README lists is registered by the package, and has its own standalone entry.
  const readme = fs.readFileSync(readmes['ui-core'], 'utf8');
  const catalog = readme.slice(readme.indexOf('## Components'), readme.indexOf('Besides these'));
  const tags = [...new Set([...catalog.matchAll(/`(ui-[a-z-]+)`/g)].map((match) => match[1]))];
  await run(
    'ui-core-catalog',
    async (page) => {
      const unregistered = await page.evaluate((list) => list.filter((tag) => !customElements.get(tag)), tags);
      if (unregistered.length) return `not registered: ${unregistered.join(', ')}`;
      const noEntry = tags.filter((tag) => !fs.existsSync(path.join(root, 'packages/ui-core/dist', `${tag.slice(3)}.esm.js`)));
      return noEntry.length ? `no standalone entry for: ${noEntry.join(', ')}` : true;
    },
    { name: 'ui-core-catalog', kind: 'html', source: `<script type="module">import '@editora/ui-core';</script>` },
  );

  await run('ui-core-quick-start', async (page) => {
    const upgraded = await page.evaluate(() =>
      ['ui-field', 'ui-input', 'ui-button'].every((tag) => !!customElements.get(tag) && !!document.querySelector(tag)?.shadowRoot),
    );
    if (!upgraded) return 'the custom elements did not register and render';
    return (await page.locator('text=Work email').count()) ? true : 'the field does not show its description';
  });

  await run('ui-core-gallery', async (page) => {
    const tags = ['ui-field', 'ui-input', 'ui-button', 'ui-badge', 'ui-avatar', 'ui-alert', 'ui-switch', 'ui-checkbox', 'ui-progress', 'ui-date-picker'];
    const missing = await page.evaluate((list) => list.filter((tag) => !customElements.get(tag) || !document.querySelector(tag)?.shadowRoot), tags);
    return missing.length ? `these elements did not render: ${missing.join(', ')}` : true;
  });

  await run('ui-core-form', async (page, { logs }) => {
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(300);
    if (!logs.some((line) => line.startsWith('errors'))) return "submitting an empty form did not fire 'invalid'";
    await page.locator('ui-input[name="fullName"] input').fill('Ada Lovelace');
    await page.locator('ui-input[name="email"] input').fill('ada@example.com');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(300);
    if (!logs.some((line) => line.startsWith('dirty?'))) return "typing did not fire 'dirty-change'";
    const submitted = logs.find((line) => line.startsWith('values'));
    return submitted ? true : "a valid form did not fire 'submit'";
  });

  await run('ui-core-data-table', async (page) => {
    // The pager and the table render in shadow roots; Playwright's text selectors see through them.
    if (!(await page.locator('text=Showing 1-2 of 4').count())) return 'the first page does not show rows 1-2 of 4';
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.waitForTimeout(300);
    return (await page.locator('text=Showing 3-4 of 4').count()) && (await page.locator('text=Lena').count()) ? true : 'the pager did not move to rows 3-4';
  });

  await run('ui-core-gantt', async (page) => {
    const body = (await page.textContent('body')) ?? '';
    if (!/API contracts/.test(body) || !/QA sign-off/.test(body)) return 'the tasks are not shown';
    const links = await page.locator('ui-gantt svg path, ui-gantt svg polyline').count();
    return links > 0 ? true : 'the dependency link is not drawn';
  });

  await run('ui-core-gantt-planner', async (page) => {
    await page.waitForTimeout(500);
    const facts = await page.locator('ui-gantt').evaluate((element) => {
      const root = element.shadowRoot;
      return {
        bars: root.querySelectorAll('.bar').length,
        critical: root.querySelectorAll('.bar.critical').length,
        broken: root.querySelectorAll('path.violated').length,
        offDays: root.querySelectorAll('.off-day').length,
        svg: element.exportSvg().startsWith('<svg'),
      };
    });
    if (facts.bars < 10) return `only ${facts.bars} bars are drawn`;
    if (!facts.critical) return 'no bar is drawn as critical';
    if (!facts.broken) return 'the docs link that starts before beta ends is not drawn as broken';
    if (!facts.offDays) return 'weekends are not shaded';
    return facts.svg ? true : 'exportSvg() did not return an SVG';
  });

  await run('ui-core-dialogs', async (page) => {
    await page.getByRole('button', { name: 'Delete record' }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.waitForTimeout(400);
    if ((await page.textContent('#result')) !== 'Deleted') return `confirm() resolved to ${await page.textContent('#result')}`;
    await page.getByRole('button', { name: 'Publish' }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Not now' }).click();
    await page.waitForTimeout(400);
    return (await page.textContent('#result')) === 'Not published' ? true : `the alert dialog resolved to ${await page.textContent('#result')}`;
  });

  await run('ui-core-theme', async (page) => {
    const primary = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-color-primary').trim());
    const radius = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ui-radius').trim());
    return primary === '#0f766e' && radius === '10px' ? true : `the tokens are ${primary} / ${radius}`;
  });

  await run('ui-core-positioner', async (page) => {
    const gap = await page.evaluate(() => {
      const trigger = document.getElementById('trigger').getBoundingClientRect();
      const panel = document.getElementById('panel').getBoundingClientRect();
      return { gap: Math.round(panel.top - trigger.bottom), aligned: Math.round(panel.left - trigger.left) };
    });
    return gap.gap === 8 && gap.aligned === 0 ? true : `the panel is ${JSON.stringify(gap)} from the button, not 8 and 0`;
  });
}
