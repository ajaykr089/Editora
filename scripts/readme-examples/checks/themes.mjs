// Run checks for the examples of the @editora/themes README.
import fs from 'node:fs';
import path from 'node:path';
import { examplesDir } from '../shared.mjs';

export default async function checks({ run }) {
  const colour = (page, selector) => page.$$eval(selector, (els) => els.map((el) => getComputedStyle(el).color));

  await run('themes-gallery', async (page) => {
    const colours = await page.$$eval('[data-theme]', (hosts) => hosts.map((host) => getComputedStyle(host.querySelector('[contenteditable]')).color));
    if (new Set(colours).size !== 3) return `the three themes do not look different (text colours ${colours.join(' / ')})`;
    return true;
  });

  await run('themes-helpers', async (page) => {
    const textColour = () => colour(page, '[contenteditable]').then((colours) => colours[0]);
    const before = await textColour();
    await page.click('button');
    await page.waitForTimeout(300);
    const dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    const label = await page.textContent('button');
    const after = await textColour();
    if (dataTheme !== 'dark' || !/dark/.test(label ?? '')) return `toggleTheme() left data-theme="${dataTheme}" and the label "${label}"`;
    if (before === after) return 'the editor did not change colour when the page theme changed';
    await page.click('button');
    await page.waitForTimeout(300);
    return (await page.evaluate(() => document.documentElement.getAttribute('data-theme'))) === 'light' ? true : 'toggleTheme() did not switch back to light';
  });

  await run('themes-custom', async (page) => {
    const bg = await page.$eval('.rte-toolbar', (el) => getComputedStyle(el).backgroundColor);
    return bg === 'rgb(238, 242, 255)' ? true : `the toolbar is ${bg}, not the brand colour`;
  });

  // The stylesheet is also what the web component loads: it adds a class named after its theme attribute.
  const css = fs.readFileSync(path.join(examplesDir, 'my-brand.css'), 'utf8');
  await run(
    'my-brand',
    async (page) => {
      const state = await page.$eval('editora-editor', (el) => ({
        scoped: el.classList.contains('editora-theme-my-brand'),
        bg: getComputedStyle(el.querySelector('.editora-toolbar, .rte-toolbar')).backgroundColor,
      }));
      return state.scoped && state.bg === 'rgb(238, 242, 255)' ? true : `web component: ${JSON.stringify(state)}`;
    },
    {
      name: 'my-brand',
      kind: 'html',
      source: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>
<style>${css}</style>
<editora-editor theme="my-brand" plugins="bold italic" toolbar="bold italic" height="120"><p>Branded</p></editora-editor>`,
    },
  );

  await run('themes-extend-dark', async (page) => {
    const state = await page.evaluate(() => ({
      border: getComputedStyle(document.querySelector('.rte-toolbar')).borderTopColor,
      radius: getComputedStyle(document.querySelector('.rte-toolbar-button')).borderTopLeftRadius,
    }));
    return state.border === 'rgb(34, 211, 238)' && state.radius === '8px' ? true : `the dark theme was not extended: ${JSON.stringify(state)}`;
  });

  await run('themes-web-component', async (page) => {
    const state = await page.$eval('editora-editor', (el) => ({
      acme: el.classList.contains('editora-theme-acme'),
      colour: getComputedStyle(el.querySelector('.editora-content')).color,
    }));
    return state.acme && state.colour === 'rgb(15, 23, 42)' ? true : `the element is not themed: ${JSON.stringify(state)}`;
  });
}
