import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-slider';

type Slider = HTMLElement & { valueStart: number; valueEnd: number };

// jsdom has no layout: give the inputs a 1000px track so 1px = 1 unit (the probe thumb measures 0).
async function mount(attrs: string): Promise<{ slider: Slider; wrap: HTMLElement; events: string[] }> {
  document.body.innerHTML = `<ui-slider range min="0" max="1000" step="25" ${attrs}></ui-slider>`;
  await new Promise((resolve) => setTimeout(resolve, 0));
  const slider = document.querySelector('ui-slider') as Slider;
  const root = slider.shadowRoot as ShadowRoot;
  for (const input of Array.from(root.querySelectorAll('input'))) {
    input.getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 1000, bottom: 24, width: 1000, height: 24, x: 0, y: 0, toJSON() {} }) as DOMRect;
  }
  const events: string[] = [];
  for (const type of ['input', 'change']) {
    slider.addEventListener(type, (event) => {
      const detail = (event as CustomEvent).detail;
      events.push(`${type}:${detail.valueStart}-${detail.valueEnd}`);
    });
  }
  return { slider, wrap: root.querySelector('.track-wrap') as HTMLElement, events };
}

function pointer(target: HTMLElement, type: string, clientX: number): void {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, button: 0 });
  Object.assign(event, { pointerId: 1, pointerType: 'mouse' });
  target.dispatchEvent(event);
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-slider range pointer handling', () => {
  it('moves the start handle when the press is nearer to it (the end handle used to take it)', async () => {
    const { slider, wrap, events } = await mount('value-start="150" value-end="650"');
    pointer(wrap, 'pointerdown', 160);
    pointer(wrap, 'pointermove', 300);
    pointer(wrap, 'pointerup', 300);
    expect(slider.valueStart).toBe(300);
    expect(slider.valueEnd).toBe(650);
    expect(slider.getAttribute('value-end')).toBe('650');
    // The press lands on the start handle (snaps to 150: no change), the move drags it.
    expect(events).toEqual(['input:300-650', 'change:300-650']);
  });

  it('moves the end handle when the press is nearer to it', async () => {
    const { slider, wrap } = await mount('value-start="150" value-end="650"');
    pointer(wrap, 'pointerdown', 590);
    pointer(wrap, 'pointerup', 590);
    expect(slider.valueStart).toBe(150);
    expect(slider.valueEnd).toBe(600);
  });

  it('a click outside the range moves the handle on that side', async () => {
    const { slider, wrap } = await mount('value-start="150" value-end="650"');
    pointer(wrap, 'pointerdown', 40);
    pointer(wrap, 'pointerup', 40);
    expect([slider.valueStart, slider.valueEnd]).toEqual([50, 650]);
    pointer(wrap, 'pointerdown', 980);
    pointer(wrap, 'pointerup', 980);
    expect([slider.valueStart, slider.valueEnd]).toEqual([50, 975]);
  });

  it('a handle stops at the other one instead of pushing it', async () => {
    const { slider, wrap } = await mount('value-start="150" value-end="650"');
    pointer(wrap, 'pointerdown', 150);
    pointer(wrap, 'pointermove', 900);
    pointer(wrap, 'pointerup', 900);
    expect([slider.valueStart, slider.valueEnd]).toEqual([650, 650]);
  });

  it('when both handles share a value, the first move decides which one follows', async () => {
    const { slider, wrap } = await mount('value-start="500" value-end="500"');
    pointer(wrap, 'pointerdown', 500);
    expect([slider.valueStart, slider.valueEnd]).toEqual([500, 500]);
    pointer(wrap, 'pointermove', 300);
    pointer(wrap, 'pointermove', 450);
    pointer(wrap, 'pointerup', 450);
    expect([slider.valueStart, slider.valueEnd]).toEqual([450, 500]);

    pointer(wrap, 'pointerdown', 500);
    pointer(wrap, 'pointermove', 800);
    pointer(wrap, 'pointerup', 800);
    expect([slider.valueStart, slider.valueEnd]).toEqual([450, 800]);
  });

  it('a press that changes nothing fires no change event', async () => {
    const { wrap, events } = await mount('value-start="150" value-end="650"');
    pointer(wrap, 'pointerdown', 150);
    pointer(wrap, 'pointerup', 150);
    expect(events).toEqual([]);
  });

  it('ignores pointers while disabled', async () => {
    const { slider, wrap } = await mount('value-start="150" value-end="650" disabled');
    pointer(wrap, 'pointerdown', 300);
    pointer(wrap, 'pointerup', 300);
    expect([slider.valueStart, slider.valueEnd]).toEqual([150, 650]);
  });

  it('snaps from min like the native input', async () => {
    document.body.innerHTML = '<ui-slider range min="5" max="105" step="10" value-start="15" value-end="95"></ui-slider>';
    await new Promise((resolve) => setTimeout(resolve, 0));
    const slider = document.querySelector('ui-slider') as Slider;
    expect([slider.valueStart, slider.valueEnd]).toEqual([15, 95]);
  });
});
