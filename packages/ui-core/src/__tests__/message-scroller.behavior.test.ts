import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-message-scroller';
import type { UIMessageScroller } from '../components/ui-message-scroller';

// jsdom has no layout: give the viewport scroll metrics we control.
function fakeLayout(vp: HTMLElement, metrics: { scrollHeight: number; clientHeight: number }) {
  let top = 0;
  Object.defineProperty(vp, 'scrollHeight', { configurable: true, get: () => metrics.scrollHeight });
  Object.defineProperty(vp, 'clientHeight', { configurable: true, get: () => metrics.clientHeight });
  Object.defineProperty(vp, 'scrollTop', {
    configurable: true,
    get: () => top,
    set: (value: number) => {
      top = Math.max(0, Math.min(metrics.scrollHeight - metrics.clientHeight, value));
    },
  });
  return {
    get top() { return top; },
    userScroll(value: number) {
      top = value;
      vp.dispatchEvent(new Event('scroll'));
    },
  };
}

async function mount(attrs = ''): Promise<{ el: UIMessageScroller; vp: HTMLElement; metrics: { scrollHeight: number; clientHeight: number }; layout: ReturnType<typeof fakeLayout> }> {
  vi.useFakeTimers();
  const el = document.createElement('ui-message-scroller') as UIMessageScroller;
  if (attrs) for (const pair of attrs.split(' ')) {
    const [name, value = ''] = pair.split('=');
    el.setAttribute(name, value);
  }
  el.innerHTML = '<div message-id="m1">One</div><div message-id="m2">Two</div>';
  document.body.appendChild(el);
  const vp = el.shadowRoot!.querySelector('.viewport') as HTMLElement;
  const metrics = { scrollHeight: 1000, clientHeight: 400 };
  const layout = fakeLayout(vp, metrics);
  vi.advanceTimersByTime(200);
  await Promise.resolve();
  return { el, vp, metrics, layout };
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('ui-message-scroller', () => {
  it('is a focusable named region around a log', async () => {
    const { el, vp } = await mount('label=Chat');
    expect(vp.getAttribute('role')).toBe('region');
    expect(vp.getAttribute('tabindex')).toBe('0');
    expect(vp.getAttribute('aria-label')).toBe('Chat');
    const log = el.shadowRoot!.querySelector('[role="log"]')!;
    expect(log.getAttribute('aria-relevant')).toBe('additions');
  });

  it('opens at the end and then shows the transcript', async () => {
    const { el, layout } = await mount();
    expect(layout.top).toBe(600);
    expect(el.hasAttribute('data-pending-scroll')).toBe(false);
    expect(el.following).toBe(true);
    expect(el.atEnd).toBe(true);
  });

  it('opens at the start when asked', async () => {
    const { layout, el } = await mount('initial-scroll=start');
    expect(layout.top).toBe(0);
    expect(el.following).toBe(false);
  });

  it('lets go when the reader scrolls up, and shows the jump button', async () => {
    const { el, vp, layout } = await mount();
    const onFollow = vi.fn();
    el.addEventListener('follow-change', onFollow);
    vp.dispatchEvent(new WheelEvent('wheel', { deltaY: -40 }));
    layout.userScroll(300);
    expect(el.following).toBe(false);
    expect(onFollow.mock.calls[0][0].detail).toEqual({ following: false });
    const jump = el.shadowRoot!.querySelector('.jump') as HTMLButtonElement;
    expect(jump.getAttribute('data-active')).toBe('true');
    expect(jump.hasAttribute('inert')).toBe(false);
    expect(jump.tabIndex).toBe(0);
  });

  it('follows again when the reader comes back to the end', async () => {
    const { el, layout } = await mount();
    layout.userScroll(100);
    expect(el.following).toBe(false);
    layout.userScroll(600);
    expect(el.following).toBe(true);
    const jump = el.shadowRoot!.querySelector('.jump') as HTMLButtonElement;
    expect(jump.hasAttribute('inert')).toBe(true);
    expect(jump.tabIndex).toBe(-1);
  });

  it('jumps to the latest and follows again from the button', async () => {
    const { el, layout } = await mount();
    layout.userScroll(100);
    (el.shadowRoot!.querySelector('.jump') as HTMLButtonElement).click();
    expect(el.following).toBe(true);
    expect(layout.top).toBe(600);
  });

  it('lets go on scroll keys', async () => {
    const { el, vp } = await mount();
    vp.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }));
    expect(el.following).toBe(false);
  });

  it('scrolls to a message by id and reports unknown ids', async () => {
    const { el } = await mount();
    expect(el.scrollToMessage('m1')).toBe(true);
    expect(el.following).toBe(false);
    expect(el.scrollToMessage('missing')).toBe(false);
  });

  it('asks for older messages near the top, once per visit', async () => {
    const { el, layout } = await mount();
    const onStart = vi.fn();
    el.addEventListener('reach-start', onStart);
    layout.userScroll(20);
    layout.userScroll(10);
    expect(onStart).toHaveBeenCalledTimes(1);
    layout.userScroll(300);
    layout.userScroll(0);
    expect(onStart).toHaveBeenCalledTimes(2);
  });

  it('holds announcements while busy', async () => {
    const { el } = await mount();
    el.setAttribute('busy', '');
    const log = el.shadowRoot!.querySelector('[role="log"]')!;
    expect(log.getAttribute('aria-busy')).toBe('true');
    el.removeAttribute('busy');
    expect(log.hasAttribute('aria-busy')).toBe(false);
  });

  it('follows growing content at the live edge', async () => {
    const { el, metrics, layout } = await mount();
    metrics.scrollHeight = 1400;
    el.appendChild(Object.assign(document.createElement('div'), { textContent: 'Three' }));
    await Promise.resolve();
    await Promise.resolve();
    vi.advanceTimersByTime(100);
    expect(layout.top).toBe(1000);
  });

  it('does not move a reader who scrolled up when content is added below', async () => {
    const { el, metrics, layout } = await mount();
    layout.userScroll(200);
    metrics.scrollHeight = 1400;
    el.appendChild(Object.assign(document.createElement('div'), { textContent: 'Three' }));
    await Promise.resolve();
    await Promise.resolve();
    expect(layout.top).toBe(200);
  });
});
