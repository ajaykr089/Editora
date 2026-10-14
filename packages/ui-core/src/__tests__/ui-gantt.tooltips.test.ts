import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const TASKS = [
  { id: 'p', label: 'Discovery', start: '2026-03-02', end: '2026-03-20', type: 'summary', progress: 60 },
  { id: 'a', label: 'Interviews', start: '2026-03-02', end: '2026-03-06', parent: 'p', progress: 40, assignee: 'Ava', critical: true },
  { id: 'b', label: 'Requirements', start: '2026-03-09', end: '2026-03-13', parent: 'p' },
  { id: 'm', label: 'Sign-off', start: '2026-03-20', type: 'milestone', parent: 'p', progress: 100 },
];

const mount = async (attrs: Record<string, string> = {}, tasks: unknown[] = TASKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};

const bar = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!;
const tip = (root: ParentNode) => root.querySelector<HTMLElement>('.bar-tip')!;
const medium = (year: number, month: number, day: number) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(year, month - 1, day));

const hover = (target: Element, pointerType = 'mouse') => {
  const event = new MouseEvent('pointerenter', { bubbles: false });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  target.dispatchEvent(event);
};
const leave = (target: Element) => target.dispatchEvent(new MouseEvent('pointerleave'));

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt bar names', () => {
  it('names a task by label, dates, progress, assignee and the critical flag', async () => {
    const { root } = await mount();

    expect(bar(root, 'a').getAttribute('aria-label')).toBe(
      `Interviews, ${medium(2026, 3, 2)} to ${medium(2026, 3, 6)}, 40% complete, assigned to Ava, critical`
    );
  });

  it('names a task with no progress or owner by label and dates only', async () => {
    const { root } = await mount();

    expect(bar(root, 'b').getAttribute('aria-label')).toBe(`Requirements, ${medium(2026, 3, 9)} to ${medium(2026, 3, 13)}`);
  });

  it('says what a summary and a milestone are, and gives a milestone one date and no progress', async () => {
    const { root } = await mount();

    expect(bar(root, 'p').getAttribute('aria-label')).toBe(
      `Discovery, summary, ${medium(2026, 3, 2)} to ${medium(2026, 3, 20)}, 60% complete`
    );
    expect(bar(root, 'm').getAttribute('aria-label')).toBe(`Sign-off, milestone, ${medium(2026, 3, 20)}`);
  });

  it('follows a date change made from the keyboard', async () => {
    const { root } = await mount();
    bar(root, 'b').focus();
    bar(root, 'b').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();

    expect(bar(root, 'b').getAttribute('aria-label')).toBe(`Requirements, ${medium(2026, 3, 10)} to ${medium(2026, 3, 14)}`);
  });
});

describe('ui-gantt bar tooltip', () => {
  it('is one element in the timeline, hidden from assistive technology and closed to begin with', async () => {
    const { root } = await mount();

    expect(root.querySelectorAll('.bar-tip').length).toBe(1);
    expect(root.querySelector('.timeline-body')!.contains(tip(root))).toBe(true);
    expect(tip(root).getAttribute('aria-hidden')).toBe('true');
    expect(tip(root).hasAttribute('data-open')).toBe(false);
    // not inside a bar, whose overflow would clip it
    expect(bar(root, 'a').contains(tip(root))).toBe(false);
  });

  it('opens after a short delay on hover with the same facts as the name, and closes on leave', async () => {
    const { root } = await mount();

    hover(bar(root, 'a'));
    expect(tip(root).hasAttribute('data-open')).toBe(false); // not at once, so scanning across bars does not flicker
    await flush(200);

    expect(tip(root).hasAttribute('data-open')).toBe(true);
    expect(tip(root).querySelector('strong')!.textContent).toBe('Interviews');
    const lines = [...tip(root).querySelectorAll('span')].map((el) => el.textContent);
    expect(lines).toEqual([`${medium(2026, 3, 2)} to ${medium(2026, 3, 6)}`, '40% complete · assigned to Ava · critical']);

    leave(bar(root, 'a'));
    expect(tip(root).hasAttribute('data-open')).toBe(false);
  });

  it('does not open for a quick pass over a bar', async () => {
    const { root } = await mount();

    hover(bar(root, 'a'));
    leave(bar(root, 'a'));
    await flush(200);

    expect(tip(root).hasAttribute('data-open')).toBe(false);
  });

  it('does not open on touch', async () => {
    const { root } = await mount();

    hover(bar(root, 'a'), 'touch');
    await flush(200);

    expect(tip(root).hasAttribute('data-open')).toBe(false);
  });

  it('opens at once on keyboard focus and closes on blur', async () => {
    const { root } = await mount();

    bar(root, 'b').focus();
    expect(tip(root).hasAttribute('data-open')).toBe(true);
    expect(tip(root).querySelector('strong')!.textContent).toBe('Requirements');

    bar(root, 'b').blur();
    expect(tip(root).hasAttribute('data-open')).toBe(false);
  });

  it('shows the kind of a summary or milestone, and one date for a milestone', async () => {
    const { root } = await mount();

    bar(root, 'm').focus();
    expect([...tip(root).querySelectorAll('span')].map((el) => el.textContent)).toEqual([`milestone · ${medium(2026, 3, 20)}`]);
    bar(root, 'p').focus();
    expect(tip(root).querySelectorAll('span')[0].textContent).toBe(`summary · ${medium(2026, 3, 2)} to ${medium(2026, 3, 20)}`);
  });

  it('can be dismissed with Escape while the bar keeps focus', async () => {
    const { root } = await mount();
    bar(root, 'b').focus();
    expect(tip(root).hasAttribute('data-open')).toBe(true);

    bar(root, 'b').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(tip(root).hasAttribute('data-open')).toBe(false);
    expect(root.activeElement).toBe(bar(root, 'b'));
  });

  it('closes when a drag starts, since the bar shows its own dates then', async () => {
    const { root } = await mount();
    bar(root, 'b').focus();
    expect(tip(root).hasAttribute('data-open')).toBe(true);

    bar(root, 'b').setPointerCapture = () => {}; // jsdom has none
    bar(root, 'b').dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, button: 0 }));

    expect(tip(root).hasAttribute('data-open')).toBe(false);
  });

  it('shows the new dates after a keyboard edit, because focus returns to the bar', async () => {
    const { root } = await mount();
    bar(root, 'b').focus();
    bar(root, 'b').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();

    expect(tip(root).hasAttribute('data-open')).toBe(true);
    expect(tip(root).querySelectorAll('span')[0].textContent).toBe(`${medium(2026, 3, 10)} to ${medium(2026, 3, 14)}`);
  });

  it('escapes task text', async () => {
    const { root } = await mount({}, [{ id: 'x', label: '<img src=x onerror=alert(1)>', start: '2026-03-02', end: '2026-03-06', assignee: '<b>Eve</b>' }]);
    bar(root, 'x').focus();

    expect(tip(root).querySelector('img')).toBeNull();
    expect(tip(root).querySelector('b')).toBeNull();
    expect(tip(root).textContent).toContain('<img src=x onerror=alert(1)>');
    expect(root.querySelector('img')).toBeNull();
  });

  it('is styled so forced-colors users get a bordered, system-coloured tip', async () => {
    const { root } = await mount();
    const css = root.querySelector('style')!.textContent!;

    expect(css).toMatch(/\.bar-tip \{[^}]*pointer-events: none;/);
    expect(css).toMatch(/forced-colors: active[\s\S]*\.bar-tip \{[^}]*border: 1px solid CanvasText;/);
  });

  describe('while a bar is dragged', () => {
    const fire = (target: HTMLElement, type: string, clientX: number) => {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      target.dispatchEvent(event);
    };

    it('shows the dates the bar would take, in the tooltip, and closes it on release', async () => {
      const { root } = await mount({ zoom: 'week' });
      const target = bar(root, 'b');
      target.setPointerCapture = () => {}; // jsdom has none

      fire(target, 'pointerdown', 100);
      fire(target, 'pointermove', 126); // 26px = 2 days at the week scale (13px a day)
      await flush(60);

      expect(tip(root).hasAttribute('data-open')).toBe(true);
      expect(tip(root).querySelector('strong')!.textContent).toBe('Requirements');
      expect(tip(root).querySelectorAll('span')[0].textContent).toBe(`${medium(2026, 3, 11)} to ${medium(2026, 3, 15)}`);

      fire(target, 'pointerup', 126);
      await flush();
      expect(tip(root).hasAttribute('data-open')).toBe(false);
    });

    it('no longer has a drag tip inside the bar, where the bar clipped it', async () => {
      const { root } = await mount();

      expect(root.querySelector('.drag-tip')).toBeNull();
      expect(root.querySelector('style')!.textContent).not.toMatch(/\.drag-tip/);
    });
  });
});
