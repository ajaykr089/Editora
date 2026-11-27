import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-carousel';
import type { UICarousel } from '../components/ui-carousel';

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function mount(attrs = '', slides = 3): UICarousel {
  const host = document.createElement('div');
  host.innerHTML = `<ui-carousel label="Featured" ${attrs}>${Array.from({ length: slides }, (_, i) => `<div>Slide ${i + 1}</div>`).join('')}</ui-carousel>`;
  document.body.appendChild(host);
  return host.firstElementChild as UICarousel;
}

function key(el: Element, name: string) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, composed: true }));
}

beforeEach(() => {
  window.matchMedia = window.matchMedia || ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} }) as any);
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('ui-carousel', () => {
  it('is a named carousel region whose hidden slides are inert', async () => {
    const el = mount();
    await flush();
    expect(el.getAttribute('role')).toBe('region');
    expect(el.getAttribute('aria-roledescription')).toBe('carousel');
    expect(el.getAttribute('aria-label')).toBe('Featured');
    const slides = Array.from(el.children) as HTMLElement[];
    expect(slides[0].getAttribute('aria-label')).toBe('1 of 3');
    expect(slides[0].getAttribute('aria-roledescription')).toBe('slide');
    expect(slides[0].hasAttribute('inert')).toBe(false);
    expect(slides[1].hasAttribute('inert')).toBe(true);
    expect(slides[1].getAttribute('aria-hidden')).toBe('true');
  });

  it('moves with the buttons, clamps without loop and wraps with it', async () => {
    const el = mount();
    await flush();
    const prev = el.shadowRoot!.querySelector('.prev') as HTMLButtonElement;
    const next = el.shadowRoot!.querySelector('.next') as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
    next.click();
    next.click();
    expect(el.index).toBe(2);
    expect(next.disabled).toBe(true);
    next.click();
    expect(el.index).toBe(2);
    el.setAttribute('loop', '');
    await flush();
    (el.shadowRoot!.querySelector('.next') as HTMLButtonElement).click();
    expect(el.index).toBe(0);
  });

  it('fires change with the reason and previous index', async () => {
    const el = mount();
    await flush();
    const onChange = vi.fn();
    el.addEventListener('change', onChange);
    (el.shadowRoot!.querySelector('.indicator[data-index="2"]') as HTMLButtonElement).click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].detail).toEqual({ index: 2, previousIndex: 0, reason: 'indicator' });
    el.goTo(2);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('marks the current indicator and names every indicator', async () => {
    const el = mount();
    await flush();
    el.next();
    const dots = el.shadowRoot!.querySelectorAll('.indicator');
    expect(dots.length).toBe(3);
    expect(dots[1].getAttribute('aria-current')).toBe('true');
    expect(dots[0].hasAttribute('aria-current')).toBe(false);
    expect(dots[2].getAttribute('aria-label')).toBe('Go to slide 3 of 3');
  });

  it('follows the arrow keys, Home and End, but not inside form fields', async () => {
    const el = mount();
    await flush();
    key(el, 'ArrowRight');
    expect(el.index).toBe(1);
    key(el, 'End');
    expect(el.index).toBe(2);
    key(el, 'Home');
    expect(el.index).toBe(0);
    const input = document.createElement('input');
    el.children[0].appendChild(input);
    key(input, 'ArrowRight');
    expect(el.index).toBe(0);
  });

  it('uses up and down when vertical', async () => {
    const el = mount('orientation="vertical"');
    await flush();
    key(el, 'ArrowDown');
    expect(el.index).toBe(1);
    key(el, 'ArrowRight');
    expect(el.index).toBe(1);
  });

  it('follows the index attribute and keeps it in sync', async () => {
    const el = mount('index="1"');
    await flush();
    expect(el.index).toBe(1);
    el.setAttribute('index', '2');
    expect(el.index).toBe(2);
    el.previous();
    expect(el.getAttribute('index')).toBe('1');
  });

  it('auto-rotates, wrapping at the end, and offers a stop button first in tab order', async () => {
    vi.useFakeTimers();
    const el = mount('autoplay interval="1000"');
    await flush();
    const rotation = el.shadowRoot!.querySelector('.rotation') as HTMLButtonElement;
    expect(rotation.hidden).toBe(false);
    expect(rotation.getAttribute('aria-label')).toBe('Stop automatic slide show');
    const buttons = Array.from(el.shadowRoot!.querySelectorAll('button'));
    expect(buttons[0]).toBe(rotation);
    expect(el.shadowRoot!.querySelector('.viewport')?.getAttribute('aria-live')).toBe('off');
    vi.advanceTimersByTime(1000);
    expect(el.index).toBe(1);
    vi.advanceTimersByTime(2000);
    expect(el.index).toBe(0);
    rotation.click();
    expect(rotation.getAttribute('aria-label')).toBe('Start automatic slide show');
    expect(el.shadowRoot!.querySelector('.viewport')?.getAttribute('aria-live')).toBe('polite');
    vi.advanceTimersByTime(5000);
    expect(el.index).toBe(0);
  });

  it('stops rotating while focus is inside', async () => {
    vi.useFakeTimers();
    const el = mount('autoplay interval="1000"');
    await flush();
    el.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    vi.advanceTimersByTime(3000);
    expect(el.index).toBe(0);
    el.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }));
    vi.advanceTimersByTime(1000);
    expect(el.index).toBe(1);
  });

  it('does not auto-rotate under reduced motion until play() is called', async () => {
    vi.useFakeTimers();
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {} })) as any;
    const el = mount('autoplay interval="1000"');
    await flush();
    vi.advanceTimersByTime(3000);
    expect(el.index).toBe(0);
    el.play();
    vi.advanceTimersByTime(1000);
    expect(el.index).toBe(1);
    window.matchMedia = original;
  });

  it('rebuilds indicators when slides change and keeps the index in range', async () => {
    const el = mount('', 3);
    await flush();
    el.goTo(2);
    el.lastElementChild!.remove();
    await flush();
    await flush();
    expect(el.shadowRoot!.querySelectorAll('.indicator').length).toBe(2);
    expect(el.index).toBe(1);
  });

  it('hides controls and indicators for a single slide', async () => {
    const el = mount('', 1);
    await flush();
    expect(el.shadowRoot!.querySelectorAll('.indicator').length).toBe(0);
    expect((el.shadowRoot!.querySelector('.next') as HTMLButtonElement).disabled).toBe(true);
  });

  it('uses the slide label in its name', async () => {
    const host = document.createElement('div');
    host.innerHTML = '<ui-carousel><div label="Pricing">a</div><div>b</div></ui-carousel>';
    document.body.appendChild(host);
    await flush();
    expect(host.querySelector('[label]')?.getAttribute('aria-label')).toBe('Pricing (1 of 2)');
  });
});
