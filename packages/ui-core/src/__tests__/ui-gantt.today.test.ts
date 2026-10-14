import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = () => new Promise((resolve) => setTimeout(resolve, 30));

const iso = (offsetDays: number) => {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// The chart starts two days before its first task, and a week day is 13px.
const around = (startOffset: number, endOffset: number) => [{ id: 'a', label: 'Work', start: iso(startOffset), end: iso(endOffset) }];

const mount = async (
  tasks: unknown[],
  attrs: Record<string, string> = { zoom: 'week' },
  hostWidth = 0
) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  if (hostWidth) Object.defineProperty(gantt, 'clientWidth', { get: () => hostWidth, configurable: true });
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return gantt.shadowRoot as ShadowRoot;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt today marker', () => {
  it('puts the "Today" label in the header, centred on the line, and keeps only the line in the body', async () => {
    const root = await mount(around(-5, 10));
    const pill = root.querySelector<HTMLElement>('.timeline-head .today-pill')!;
    const line = root.querySelector<HTMLElement>('.timeline-body .today')!;

    expect(pill.textContent).toBe('Today');
    // today is 7 days after the chart starts, 13px a day
    expect(parseFloat(line.style.left)).toBeCloseTo(91, 1);
    // read the attribute: jsdom's style parser drops clamp()
    expect(pill.getAttribute('style')).toBe('left:clamp(22px, 91.00px, calc(100% - 22px))');
    expect(line.textContent).toBe('');
    expect(root.querySelector('.timeline-body .today-pill')).toBeNull();
  });

  it('no longer prints the label on the line, where it covered the bars', async () => {
    const root = await mount(around(-5, 10));
    const css = root.querySelector('style')!.textContent!;

    expect(css).not.toMatch(/\.today::before/);
    expect(css).toMatch(/\.today-pill \{[^}]*inset-block-end: 3px;/);
  });

  it('keeps the pill out of the accessibility tree with the rest of the header', async () => {
    const root = await mount(around(-5, 10));

    expect(root.querySelector('.timeline-head')!.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('.timeline-head')!.contains(root.querySelector('.today-pill'))).toBe(true);
  });

  it('leaves the day scale to its highlighted column, which a pill would cover', async () => {
    const root = await mount(around(-5, 10), { zoom: 'day' });

    expect(root.querySelector('.today-pill')).toBeNull();
    expect(root.querySelector('.tick.today-cell')).not.toBeNull();
    expect(root.querySelector('.timeline-body .today')).not.toBeNull();
  });

  it('draws neither the line nor the pill when show-today is "false"', async () => {
    const root = await mount(around(-5, 10), { zoom: 'week', 'show-today': 'false' });

    expect(root.querySelector('.today')).toBeNull();
    expect(root.querySelector('.today-pill')).toBeNull();
  });

  it('draws neither when today is not on the timeline', async () => {
    const root = await mount([{ id: 'a', label: 'Old', start: '2020-01-06', end: '2020-01-17' }]);

    expect(root.querySelector('.today')).toBeNull();
    expect(root.querySelector('.today-pill')).toBeNull();
  });

  it('draws today in the stretch added to fill a wide host, past the last task', async () => {
    // today is 64 days after the chart starts: 832px, beyond the 680px minimum timeline
    const tasks = around(-62, -52);
    expect((await mount(tasks)).querySelector('.today')).toBeNull();

    document.body.innerHTML = '';
    const wide = await mount(tasks, { zoom: 'week' }, 1700); // 1322px of timeline
    expect(wide.querySelector('.today')).not.toBeNull();
    expect(wide.querySelector('.today-pill')).not.toBeNull();
  });
});

describe('ui-gantt sticky header', () => {
  it('is opaque, so rows scrolling underneath do not show through it', async () => {
    const root = await mount(around(-5, 10));
    const css = root.querySelector('style')!.textContent!;
    const rule = /\.grid-head,\s*\.timeline-head \{([^}]*position: sticky[^}]*)\}/.exec(css)![1];

    expect(rule).toMatch(/background: var\(--ui-gantt-panel\);/);
    expect(rule).not.toMatch(/transparent/);
  });
});
