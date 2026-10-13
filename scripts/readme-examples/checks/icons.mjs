// Run checks for the examples of the @editora/icons README.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { readmes, root } from '../shared.mjs';

const ICONS_CDN = 'https://cdn.jsdelivr.net/npm/@editora/icons/dist/index.esm.js';
const UI_CORE_CDN = 'https://cdn.jsdelivr.net/npm/@editora/ui-core/dist/index.esm.js';

export default async function checks({ run, ok, fail }) {
  // The CommonJS build: it loads on Node 14 and later, with no warning (a bare `import` needs Node 22.12, see the README).
  const icons = createRequire(import.meta.url)(path.join(root, 'packages/icons/dist/index.cjs.js'));
  const readme = fs.readFileSync(readmes.icons, 'utf8');

  // The numbers the README gives are the numbers of the build.
  const definitions = icons.iconDefinitions;
  const numbers = {
    icons: definitions.length,
    solid: definitions.filter((d) => d.variants.solid).length,
    duotone: definitions.filter((d) => d.variants.duotone).length,
    aliases: Object.keys(icons.listIconAliases()).length,
    mirrored: definitions.filter((d) => d.rtlMirror).length,
  };
  for (const [what, value] of Object.entries(numbers)) {
    if (readme.includes(`<!-- ${what}:${value} -->`)) ok(`the README says there are ${value} ${what}`);
    else fail(`the README does not carry the number of ${what} (${value}): add <!-- ${what}:${value} --> next to it`);
  }
  const duotone = definitions.filter((d) => d.variants.duotone).map((d) => d.name).sort().join(', ');
  if (readme.includes(`<!-- duotone-names:${duotone} -->`)) ok('the README names the duotone icons');
  else fail(`the README does not name the duotone icons (${duotone}): add <!-- duotone-names:${duotone} -->`);

  // A name that exists is replaced, and a node with tone 'secondary' takes the secondary colour.
  icons.registerIcon({ name: 'zz-replace', variants: { outline: { nodes: [{ tag: 'circle', attrs: { cx: 12, cy: 12, r: 4 } }] } } });
  icons.registerIcon({ name: 'zz-replace', variants: { outline: { nodes: [{ tag: 'rect', attrs: { x: 4, y: 4, width: 8, height: 8 } }] } } });
  if (icons.renderIconSvg('zz-replace').includes('<rect') && !icons.renderIconSvg('zz-replace').includes('<circle')) ok('registering a name again replaces the icon');
  else fail('registering a name again does not replace the icon');
  icons.registerIcon({
    name: 'zz-tone',
    variants: {
      outline: { nodes: [{ tag: 'path', attrs: { d: 'M4 12h16' } }] },
      duotone: {
        nodes: [
          { tag: 'circle', attrs: { cx: 12, cy: 12, r: 8, fill: 'currentColor', tone: 'secondary' } },
          { tag: 'path', attrs: { d: 'M4 12h16', stroke: 'currentColor' } },
        ],
      },
    },
  });
  const tone = icons.renderIconSvg('zz-tone', { variant: 'duotone', color: '#2563eb', secondaryColor: '#93c5fd' });
  if (tone.includes('<circle cx="12" cy="12" r="8" fill="#93c5fd"') && tone.includes('<path d="M4 12h16" stroke="currentColor"')) ok("tone: 'secondary' draws a node in secondaryColor");
  else fail(`tone: 'secondary' does not give the node secondaryColor: ${tone}`);

  // Pure functions of their input: they work where there is no DOM.
  if (typeof globalThis.document === 'undefined' && icons.renderIconSvg('check').startsWith('<svg')) ok('renderIconSvg works in Node, with no DOM');
  else fail('renderIconSvg does not work in Node');

  await run('icons-quick-start', async (page) => {
    const buttons = await page.$$eval('#toolbar button', (nodes) =>
      nodes.map((node) => {
        const svg = node.querySelector('svg');
        return { label: node.getAttribute('aria-label'), hidden: svg?.getAttribute('aria-hidden'), width: svg?.getAttribute('width'), drawn: svg?.children.length };
      }),
    );
    if (buttons.length !== 6) return `expected 6 buttons, found ${buttons.length}`;
    for (const button of buttons) {
      if (!button.drawn) return `the "${button.label}" button has no icon`;
      if (button.hidden !== 'true') return `the icon in "${button.label}" is not hidden from screen readers`;
      if (button.width !== '18') return `the icon in "${button.label}" is ${button.width} wide, not 18`;
    }
    const box = await page.locator('#toolbar svg').first().boundingBox();
    if (Math.round(box.width) !== 18) return `the icon is ${box.width}px wide on screen`;
    // The icon takes the colour of the button's text.
    const stroke = await page.$eval('#toolbar svg path', (node) => getComputedStyle(node).stroke);
    const text = await page.$eval('#toolbar button', (node) => getComputedStyle(node).color);
    if (stroke !== text) return `the icon is ${stroke}, the button text ${text}`;

    // What the README says about names and accessibility, from the same CDN module.
    const out = await page.evaluate(async (url) => {
      const { renderIconSvg } = await import(url);
      const root = (svg) => svg.match(/^<svg[^>]*>/)[0];
      return {
        plain: root(renderIconSvg('bell')),
        titled: renderIconSvg('bell', { title: 'Notifications' }),
        labelled: renderIconSvg('bell', { ariaLabel: 'Alerts' }),
        explicit: root(renderIconSvg('bell', { decorative: false })),
        both: renderIconSvg('bell', { title: 'Notifications', decorative: true }),
        unknown: renderIconSvg('no-such-icon'),
        names: [renderIconSvg('Chart Line'), renderIconSvg('chart_line')].every((svg) => svg === renderIconSvg('chart-line')),
        alias: renderIconSvg('tick') === renderIconSvg('check'),
      };
    }, ICONS_CDN);
    if (!out.plain.includes('aria-hidden="true"') || !out.plain.includes('role="presentation"')) return `an icon without a title is not decorative: ${out.plain}`;
    if (!out.titled.includes('role="img"') || !out.titled.includes('aria-label="Notifications"') || !out.titled.includes('<title>Notifications</title>')) return `title does not label the icon: ${out.titled}`;
    if (!out.labelled.includes('role="img"') || !out.labelled.includes('aria-label="Alerts"') || out.labelled.includes('<title>')) return `ariaLabel does not label the icon: ${out.labelled}`;
    if (!out.explicit.includes('role="img"') || !out.explicit.includes('aria-label="bell"')) return `decorative: false does not name the icon: ${out.explicit}`;
    if (!out.both.includes('aria-hidden="true"')) return 'decorative: true does not hide an icon that has a title';
    if (out.unknown !== '') return `an unknown icon gives ${JSON.stringify(out.unknown)}, not an empty string`;
    if (!out.names) return 'Chart Line, chart_line and chart-line are not the same icon';
    if (!out.alias) return "the alias 'tick' is not the icon 'check'";
    return true;
  });

  await run('icons-options', async (page) => {
    const cells = await page.$$eval('.samples figure', (figures) =>
      figures.map((figure) => {
        const svg = figure.querySelector('svg');
        const paint = svg.querySelector('[stroke], [fill]:not([fill="none"])');
        const style = paint ? getComputedStyle(paint) : null;
        const nodes = [...svg.querySelectorAll('path, line, circle, polyline, rect, polygon')];
        return {
          label: figure.querySelector('figcaption').textContent,
          width: svg.getAttribute('width'),
          color: svg.getAttribute('color'),
          stroke: style?.stroke,
          strokeWidth: svg.querySelector('[stroke-width]')?.getAttribute('stroke-width'),
          vectorEffect: svg.querySelector('[stroke]') ? getComputedStyle(svg.querySelector('[stroke]')).vectorEffect : null,
          fills: [...new Set(nodes.map((node) => getComputedStyle(node).fill))],
          strokes: [...new Set(nodes.map((node) => getComputedStyle(node).stroke))],
          transform: svg.querySelector('g[transform]')?.getAttribute('transform') ?? null,
        };
      }),
    );
    const by = Object.fromEntries(cells.map((cell) => [cell.label, cell]));
    if (cells.length !== 12) return `expected 12 samples, found ${cells.length}`;
    if (by.default.width !== '15') return `the default size is ${by.default.width}, not 15`;
    if (by['size: 40'].width !== '40') return 'size: 40 is not 40 wide';
    if (by.color.stroke !== 'rgb(37, 99, 235)') return `color: the stroke is ${by.color.stroke}`;
    if (by['iconWeight: thin'].strokeWidth !== '1.25') return `thin is ${by['iconWeight: thin'].strokeWidth}`;
    if (by.default.strokeWidth !== '1.5') return `the default weight is ${by.default.strokeWidth}, not 1.5`;
    if (by['iconWeight: bold'].strokeWidth !== '1.75') return `bold is ${by['iconWeight: bold'].strokeWidth}`;
    if (by['strokeWidth: 2.5'].strokeWidth !== '2.5') return 'strokeWidth: 2.5 is not 2.5';
    if (by.default.vectorEffect !== 'non-scaling-stroke') return `strokes are not non-scaling: ${by.default.vectorEffect}`;
    if (!by['variant: solid'].fills.includes('rgb(37, 99, 235)')) return `the solid bell is not filled: ${by['variant: solid'].fills}`;
    const duotone = by['variant: duotone'];
    if (!duotone.fills.includes('rgb(147, 197, 253)') || !duotone.strokes.includes('rgb(37, 99, 235)')) return `the duotone icon does not use both colours: ${duotone.fills} / ${duotone.strokes}`;
    // The arrow is drawn on a 15-unit grid and scaled up by its own definition; rotating and flipping wrap that.
    if (/^(rotate|translate)/.test(by['arrow-right'].transform ?? '')) return `the plain arrow is turned or flipped: ${by['arrow-right'].transform}`;
    if (by['rotate: 90'].transform !== 'rotate(90 12 12)') return `rotate: ${by['rotate: 90'].transform}`;
    if (by['flip: horizontal'].transform !== 'translate(24 0) scale(-1 1)') return `flip: ${by['flip: horizontal'].transform}`;
    if (by['rtl: true'].transform !== 'translate(24 0) scale(-1 1)') return `rtl: ${by['rtl: true'].transform}`;
    return true;
  });

  await run('icons-catalog', async (page) => {
    const count = () => page.locator('.cell').count();
    const placeholder = await page.getByRole('searchbox', { name: 'Search icons' }).getAttribute('placeholder');
    if (placeholder !== `Search ${numbers.icons} icons`) return `the search box says "${placeholder}"`;
    if ((await count()) !== numbers.icons) return `${await count()} icons are shown, not ${numbers.icons}`;

    const box = page.getByRole('searchbox', { name: 'Search icons' });
    await box.fill('bell');
    const names = await page.$$eval('.cell span', (spans) => spans.map((span) => span.textContent));
    if (!names.includes('bell')) return `searching "bell" does not find bell: ${names}`;
    if (names.length > 20) return `searching "bell" finds ${names.length} icons`;
    await box.fill('tick');
    const viaAlias = await page.$$eval('.cell span', (spans) => spans.map((span) => span.textContent));
    if (!viaAlias.includes('check')) return `searching the alias "tick" does not find check: ${viaAlias}`;
    await box.fill('no-such-icon');
    if ((await count()) !== 0) return 'a search with no match still shows icons';
    return true;
  });

  await run('icons-custom', async (page, { logs }) => {
    await page.waitForTimeout(200);
    if (!logs.includes('true true')) return `hasIcon printed ${JSON.stringify(logs)}`;
    const svg = await page.$eval('#markup svg', (node) => ({ width: node.getAttribute('width'), drawn: node.children.length, stroke: getComputedStyle(node.querySelector('path')).stroke, fill: getComputedStyle(node.querySelector('path')).fill }));
    if (svg.drawn !== 3) return `the custom icon has ${svg.drawn} shapes, not 3`;
    if (svg.stroke !== 'rgb(37, 99, 235)' || svg.fill !== 'none') return `the custom icon is not an outline in blue: ${svg.stroke} / ${svg.fill}`;
    const image = await page.$eval('#image', (node) => ({ loaded: node.complete && node.naturalWidth > 0, src: node.getAttribute('src').slice(0, 24) }));
    if (!image.loaded) return 'the data URI does not load as an image';
    if (image.src !== 'data:image/svg+xml;utf8,') return `the data URI starts with ${image.src}`;
    const background = await page.$eval('#background', (node) => getComputedStyle(node).backgroundImage.startsWith('url("data:image/svg+xml'));
    return background ? true : 'the data URI is not used as a background';
  });

  await run('icons-ui-core', async (page) => {
    const icons = await page.$$eval('ui-icon', (nodes) =>
      nodes.map((node) => {
        const svg = node.shadowRoot?.querySelector('svg') ?? node.querySelector('svg');
        return { html: svg?.innerHTML ?? null, transform: svg?.querySelector('g[transform]')?.getAttribute('transform') ?? null, label: node.getAttribute('label') };
      }),
    );
    if (icons.length !== 6 || icons.some((icon) => !icon.html)) return `some <ui-icon> drew nothing: ${JSON.stringify(icons.map((icon) => !!icon.html))}`;
    const [plain, solid, duotone, bold, rotated] = icons;
    if (plain.html === solid.html) return 'icon-variant="solid" draws the same as the outline';
    if (plain.html === bold.html) return 'icon-weight="bold" draws the same as the regular weight';
    if (rotated.transform !== 'rotate(90 12 12)') return `rotate="90" gives ${rotated.transform}`;
    if (!duotone.html.includes('#93c5fd')) return 'secondary-color is not used by the duotone icon';

    // The README warns against registering these icons with ui-core: the registered copy is used from then on, so the
    // variant and weight of <ui-icon> stop mattering.
    const bridged = await page.evaluate(
      async ([coreUrl, iconsUrl]) => {
        const core = await import(coreUrl);
        const { registerWithEditoraUI } = await import(iconsUrl);
        const before = core.getIcon('bell', { variant: 'solid' });
        registerWithEditoraUI(core.registerIcon);
        const after = core.getIcon('bell', { variant: 'solid' });
        const outline = core.getIcon('bell');
        core.clearCustomIcons();
        // An icon registered with @editora/icons is found by ui-core, which reads the same registry.
        const icons = await import(iconsUrl);
        icons.registerIcon({ name: 'zz-ui-core', variants: { outline: { nodes: [{ tag: 'circle', attrs: { cx: 12, cy: 12, r: 6 } }] } } });
        return { before: before !== outline, after: after !== outline, custom: core.getIcon('zz-ui-core').includes('<circle') };
      },
      [UI_CORE_CDN, ICONS_CDN],
    );
    if (!bridged.before) return 'the solid bell is the same as the outline before bridging';
    if (bridged.after) return 'registering the icons with ui-core no longer makes the variants collapse: update the README';
    if (!bridged.custom) return 'ui-core does not find an icon registered with @editora/icons';
    return true;
  });
}
