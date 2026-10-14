import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const pad = (v: number) => String(v).padStart(2, '0');
const day = (offset: number) => {
  const now = new Date();
  const x = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};

const TASKS = [
  { id: 'p', label: 'Phase <1> & more', start: day(-10), end: day(30), type: 'summary', progress: 40 },
  { id: 'a', label: 'Design', start: day(-10), end: day(-2), parent: 'p', progress: 100, baselineStart: day(-12), baselineEnd: day(-4) },
  { id: 'b', label: 'Build', start: day(0), end: day(20), parent: 'p', progress: 50, critical: true, segments: [{ start: day(0), end: day(8) }, { start: day(12), end: day(20), progress: 10 }] },
  { id: 'm', label: 'Launch', start: day(30), type: 'milestone', parent: 'p' },
  { id: 'z', label: 'Outside', start: day(5), end: day(12) },
];
const LINKS = [{ id: 'ab', source: 'a', target: 'b' }, { id: 'bm', source: 'b', target: 'm' }];

const mount = async (attrs: Record<string, string> = {}, tasks: unknown[] = TASKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement & { exportSvg: () => string };
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  gantt.setAttribute('links', JSON.stringify(LINKS));
  gantt.setAttribute('zoom', 'week');
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const parse = (svg: string) => {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  expect(doc.querySelector('parsererror')).toBeNull();
  return doc;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt exportSvg', () => {
  it('returns a well-formed standalone SVG with a size and a title', async () => {
    const { gantt } = await mount();
    const svg = gantt.exportSvg();
    const doc = parse(svg);
    const root = doc.documentElement;

    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(Number(root.getAttribute('width'))).toBeGreaterThan(300);
    expect(root.getAttribute('viewBox')).toBe(`0 0 ${root.getAttribute('width')} ${root.getAttribute('height')}`);
    expect(root.querySelector('title')!.textContent).toContain('Project schedule');
  });

  it('writes every row of the chart, with its name escaped', async () => {
    const { gantt } = await mount();
    const doc = parse(gantt.exportSvg());
    const names = [...doc.querySelectorAll('text')].map((el) => el.textContent);

    expect(names).toContain('Phase <1> & more');
    expect(names).toEqual(expect.arrayContaining(['Design', 'Build', 'Launch', 'Outside', 'TASK']));
    expect(gantt.exportSvg()).not.toContain('<1>');
    expect(gantt.exportSvg()).toContain('Phase &lt;1&gt; &amp; more');
  });

  it('is taller by a row per task, and wider than the chart on screen is not', async () => {
    const { gantt } = await mount();
    const root = parse(gantt.exportSvg()).documentElement;

    expect(Number(root.getAttribute('height'))).toBe(62 + 5 * 42);
  });

  it('draws the bars, their progress, the parts of a split task, a milestone, a baseline and the links', async () => {
    const { gantt } = await mount();
    const doc = parse(gantt.exportSvg());
    const rects = [...doc.querySelectorAll('g rect')];

    expect(doc.querySelectorAll('polygon').length).toBe(1); // the milestone
    expect(doc.querySelectorAll('path[marker-end]').length).toBe(2); // both links
    expect(doc.querySelector('marker#arrow')).not.toBeNull();
    // a progress overlay is a black rect over a bar: 100% of Design is as wide as its bar
    const overlays = rects.filter((r) => r.getAttribute('fill') === '#000' && r.getAttribute('fill-opacity') === '.28');
    expect(overlays.length).toBeGreaterThanOrEqual(3);
    // two parts for Build: the 8-day one at 50% and the 8-day one at its own 10%
    const widths = overlays.map((r) => Number(r.getAttribute('width')));
    expect(widths).toEqual(expect.arrayContaining([expect.closeTo(8 * 13 * 0.5, 0), expect.closeTo(8 * 13 * 0.1, 0)]));
    expect(rects.some((r) => r.getAttribute('fill-opacity') === '.5' && r.getAttribute('height') === '4')).toBe(true); // the baseline
  });

  it('colours a critical task as danger', async () => {
    const { gantt } = await mount();
    const svg = gantt.exportSvg();

    expect(svg).toContain('#dc2626');
  });

  it('follows the filter and a collapsed branch', async () => {
    const { gantt } = await mount();
    gantt.setAttribute('filter', 'Design');
    await flush();
    const names = [...parse(gantt.exportSvg()).querySelectorAll('text')].map((el) => el.textContent);

    expect(names).toContain('Design');
    expect(names).not.toContain('Outside');
    expect(Number(parse(gantt.exportSvg()).documentElement.getAttribute('height'))).toBe(62 + 2 * 42); // Design and its parent

    gantt.removeAttribute('filter');
    (gantt as unknown as { toggleTask: (id: string, open: boolean) => void }).toggleTask('p', false);
    await flush();
    expect(Number(parse(gantt.exportSvg()).documentElement.getAttribute('height'))).toBe(62 + 2 * 42); // Phase and Outside
  });

  it('draws today, and leaves it out with show-today="false"', async () => {
    const { gantt } = await mount();
    expect(parse(gantt.exportSvg()).querySelectorAll('line[stroke-width="2"]').length).toBe(1);

    gantt.setAttribute('show-today', 'false');
    await flush();
    expect(parse(gantt.exportSvg()).querySelectorAll('line[stroke-width="2"]').length).toBe(0);
  });

  it('shades non-working days and holidays', async () => {
    const { gantt } = await mount({ 'non-working-days': '', holidays: JSON.stringify([day(3)]) });
    const rects = [...parse(gantt.exportSvg()).querySelectorAll('rect')];

    expect(rects.some((r) => r.getAttribute('fill') === '#d97706')).toBe(true);
    expect(rects.filter((r) => r.getAttribute('fill-opacity') === '.1').length).toBeGreaterThan(3);
  });

  it('labels the header at the scale on screen', async () => {
    const { gantt } = await mount({ zoom: 'month' });
    const labels = [...parse(gantt.exportSvg()).querySelectorAll('text')].map((el) => el.textContent);

    expect(labels).toContain(new Intl.DateTimeFormat(undefined, { month: 'short' }).format(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
    expect(labels).toContain(String(new Date().getFullYear()));
  });

  it('follows the locale and the labels', async () => {
    const { gantt } = await mount({ locale: 'de-DE', labels: JSON.stringify({ columnTask: 'Aufgabe', title: 'Plan', today: 'Heute' }) });
    const svg = gantt.exportSvg();

    expect(svg).toContain('AUFGABE');
    expect(svg).toContain('Heute');
    expect(parse(svg).querySelector('title')!.textContent).toContain('Plan');
  });

  it('returns nothing when there is nothing to draw', async () => {
    expect((await mount({}, [])).gantt.exportSvg()).toBe('');
    document.body.innerHTML = '';
    const { gantt } = await mount();
    gantt.setAttribute('filter', 'zzz-no-match');
    await flush();
    expect(gantt.exportSvg()).toBe('');
  });
});

describe('ui-gantt print', () => {
  it('shows the whole chart, without the screen-only parts', async () => {
    const { root } = await mount();
    const css = root.querySelector('style')!.textContent!;
    const print = css.slice(css.indexOf('@media print'), css.indexOf('@media (forced-colors'));

    expect(print).toMatch(/\.controls,[\s\S]*\.handle \{\s*display: none !important;/);
    expect(print).toMatch(/\.viewport,\s*:host\(\[fill\]\) \.viewport \{[^}]*overflow: visible;[^}]*max-block-size: none;/);
    expect(print).toMatch(/\.grid-head,[\s\S]*position: static;/);
    expect(print).toMatch(/print-color-adjust: exact;/);
    expect(print).toMatch(/break-inside: avoid;/);
  });
});
