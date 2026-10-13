// Run checks for the examples of the @editora/react-icons README.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { readmes, root } from '../shared.mjs';

export default async function checks({ run, ok, fail }) {
  const require = createRequire(import.meta.url);
  const reactIcons = require(path.join(root, 'packages/react-icons/dist/index.cjs.js'));
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const readme = fs.readFileSync(readmes['react-icons'], 'utf8');

  // The numbers the README gives are the numbers of the build.
  const components = Object.keys(reactIcons.icons).length;
  if (readme.includes(`<!-- components:${components} -->`)) ok(`the README says there are ${components} icon components`);
  else fail(`the README does not carry the number of icon components (${components}): add <!-- components:${components} -->`);
  if (reactIcons.iconNames.length === components) ok('iconNames lists every component');
  else fail(`iconNames has ${reactIcons.iconNames.length} names for ${components} components`);

  // The variants the README counts are the ones the icons have.
  const core = require(path.join(root, 'packages/icons/dist/index.cjs.js')).iconDefinitions;
  for (const [what, value] of [['solid', core.filter((d) => d.variants.solid).length], ['duotone', core.filter((d) => d.variants.duotone).length]]) {
    if (readme.includes(`<!-- ${what}:${value} -->`)) ok(`the README says ${value} icons are ${what}`);
    else fail(`the README does not carry the number of ${what} icons (${value}): add <!-- ${what}:${value} -->`);
  }

  // It renders on the server, with no effects: the same markup comes out.
  const html = renderToStaticMarkup(React.createElement(reactIcons.IconProvider, { value: { size: 20 } }, React.createElement(reactIcons.CheckIcon, { title: 'Done' })));
  if (html.startsWith('<svg') && html.includes('width="20"') && html.includes('aria-label="Done"')) ok('an icon renders to a string on the server');
  else fail(`an icon does not render on the server: ${html.slice(0, 120)}`);
  if (renderToStaticMarkup(React.createElement(reactIcons.Icon, { name: 'definitely-not-an-icon' })) === '') ok('an unknown icon name renders nothing');
  else fail('an unknown icon name renders something');

  // Nothing in the build marks it as a client component, which the README tells Next.js users about.
  if (!fs.readFileSync(path.join(root, 'packages/react-icons/dist/index.esm.js'), 'utf8').slice(0, 40).includes('use client')) ok("the build has no 'use client' directive");
  else fail("the build now has a 'use client' directive: update the README");

  const svgs = (page) =>
    page.$$eval('svg', (nodes) =>
      nodes.map((svg) => {
        const shapes = [...svg.querySelectorAll('path, line, circle, polyline, rect, polygon')];
        return {
          width: svg.getAttribute('width'),
          hidden: svg.getAttribute('aria-hidden'),
          role: svg.getAttribute('role'),
          label: svg.getAttribute('aria-label'),
          title: svg.querySelector('title')?.textContent ?? null,
          shapes: shapes.length,
          strokes: [...new Set(shapes.map((node) => getComputedStyle(node).stroke))],
          fills: [...new Set(shapes.map((node) => getComputedStyle(node).fill))],
          strokeWidth: svg.querySelector('[stroke-width]')?.getAttribute('stroke-width') ?? null,
        };
      }),
    );

  await run('react-icons-quick-start', async (page) => {
    const all = await svgs(page);
    if (all.length !== 6) return `expected 6 icons, found ${all.length}`;
    const [search, bell, settings, success, shield, pie] = all;
    for (const [name, icon] of [['search', search], ['bell', bell], ['settings', settings]]) {
      if (icon.hidden !== 'true') return `the ${name} icon in a labelled button is not hidden from screen readers`;
      if (icon.width !== '18') return `the ${name} icon is ${icon.width} wide: the provider says 18`;
    }
    if (!bell.fills.includes('rgb(37, 99, 235)')) return `the solid bell is not filled in blue: ${bell.fills}`;
    if (success.role !== 'img' || success.label !== 'Success') return `the success icon is not named: ${success.role} / ${success.label}`;
    if (shield.role !== 'img' || shield.title !== 'Protected' || shield.label !== 'Protected') return `the shield is not named: ${JSON.stringify(shield)}`;
    if (!shield.fills.includes('rgb(147, 197, 253)')) return `the duotone shield does not use its secondary colour: ${shield.fills}`;
    if (pie.width !== '24') return `the pie chart is ${pie.width} wide: its size prop says 24`;
    const names = await page.$$eval('button[aria-label]', (buttons) => buttons.map((button) => button.getAttribute('aria-label')));
    return names.join() === 'Search,Notifications,Settings' ? true : `the buttons are ${names}`;
  });

  await run('react-icons-provider', async (page) => {
    const all = await svgs(page);
    if (all.length !== 9) return `expected 9 icons, found ${all.length}`;
    for (const icon of all.slice(0, 3)) {
      if (icon.width !== '28' || !icon.strokes.includes('rgb(36, 41, 47)') || icon.strokeWidth !== '1.5') return `the outer provider is not applied: ${JSON.stringify(icon)}`;
    }
    for (const icon of all.slice(3, 6)) {
      if (icon.width !== '28') return `the nested provider lost the size it did not set: ${icon.width}`;
      if (!icon.strokes.includes('rgb(37, 99, 235)') || icon.strokeWidth !== '1.75') return `the nested provider is not applied: ${JSON.stringify(icon)}`;
    }
    if (all[6].width !== '28') return 'an icon with no props does not take the provider size';
    if (all[7].width !== '40' || !all[7].strokes.includes('rgb(217, 119, 6)')) return `props do not beat the provider: ${JSON.stringify(all[7])}`;
    if (!all[8].fills.includes('rgb(220, 38, 38)')) return `the solid heart is not red: ${all[8].fills}`;
    const readouts = await page.$$eval('code', (nodes) => nodes.map((node) => node.textContent));
    const expected = ['size 28, #24292f, weight regular', 'size 28, #2563eb, weight bold'];
    return readouts.join('|') === expected.join('|') ? true : `useIconContext reads ${JSON.stringify(readouts)}`;
  });

  await run('react-icons-dynamic', async (page) => {
    const all = await svgs(page);
    if (all.length !== 6) return `expected 6 icons, found ${all.length}`;
    const [brand, ...rest] = all;
    if (brand.shapes !== 2 || brand.width !== '20' || brand.title !== 'Brand') return `the registered icon is not drawn: ${JSON.stringify(brand)}`;
    if (!brand.strokes.includes('rgb(37, 99, 235)')) return `the registered icon is not blue: ${brand.strokes}`;
    for (const icon of rest) {
      if (icon.width !== '16' || !icon.shapes) return `a menu icon is not drawn at 16: ${JSON.stringify(icon)}`;
    }
    return true;
  });
}
