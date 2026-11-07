import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-toast';
import '../components/ui-breadcrumb';
import '../components/ui-hover-card';
import '../components/ui-popover';
import '../components/ui-textarea';
import '../components/ui-tooltip';
import '../components/ui-positioner';
import * as positioner from '../primitives/positioner';
import { numberAttribute } from '../primitives/number-attribute';

// Number(null) and Number('') are 0: each of these used to read a missing attribute as 0.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const make = <T = HTMLElement>(tag: string, attrs: Record<string, string> = {}) => {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  document.body.appendChild(el);
  return el as unknown as T;
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('numberAttribute', () => {
  it('gives the fallback for a missing, blank or non-numeric value and the number otherwise', () => {
    expect(numberAttribute(null, 7)).toBe(7);
    expect(numberAttribute('', 7)).toBe(7);
    expect(numberAttribute('  ', 7)).toBe(7);
    expect(numberAttribute('abc', 7)).toBe(7);
    expect(numberAttribute('0', 7)).toBe(0);
    expect(numberAttribute('-2.5', 7)).toBe(-2.5);
  });
});

describe('a missing numeric attribute keeps the documented default', () => {
  it('ui-toast shows up to 5 toasts, not 1', () => {
    const toast = make<{ _maxVisible(): number }>('ui-toast');
    expect(toast._maxVisible()).toBe(5);
    (toast as unknown as HTMLElement).setAttribute('max-visible', '2');
    expect(toast._maxVisible()).toBe(2);
  });

  it('ui-breadcrumb does not collapse unless max-items is set', () => {
    const crumbs = make<{ _maxItems(): number }>('ui-breadcrumb');
    expect(crumbs._maxItems()).toBe(Number.POSITIVE_INFINITY);
    (crumbs as unknown as HTMLElement).setAttribute('max-items', '4');
    expect(crumbs._maxItems()).toBe(4);
  });

  it('ui-hover-card waits 120ms to open and to close', () => {
    const card = make<{ delay: number; closeDelay: number }>('ui-hover-card');
    expect(card.delay).toBe(120);
    expect(card.closeDelay).toBe(120);
    (card as unknown as HTMLElement).setAttribute('close-delay', '0');
    expect(card.closeDelay).toBe(0);
  });

  it('ui-popover sits 8px from its trigger', () => {
    expect(make<{ _offset(): number }>('ui-popover')._offset()).toBe(8);
  });

  it('ui-textarea has 4 rows', async () => {
    const area = make('ui-textarea');
    await flush();
    expect(area.shadowRoot!.querySelector('textarea')!.rows).toBe(4);
  });

  it('ui-tooltip waits 250ms before it opens', () => {
    vi.useFakeTimers();
    const tip = make('ui-tooltip', { text: 'Hint' });
    const trigger = document.createElement('button');
    tip.appendChild(trigger);
    const show = vi.spyOn(window, 'setTimeout');
    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    trigger.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    const delays = show.mock.calls.map(([, ms]) => ms);
    expect(delays).toContain(250);
    expect(delays).not.toContain(0);
  });

  it('ui-positioner keeps an 8px offset and 4px boundary padding', async () => {
    const create = vi.spyOn(positioner, 'createPositioner');
    const anchor = make('button', { id: 'anchor' });
    void anchor;
    const pos = make('ui-positioner', { anchor: '#anchor', open: '' });
    pos.appendChild(document.createElement('div'));
    await flush();
    const options = create.mock.calls.at(-1)?.[0] as { offset: number; boundaryPadding: number } | undefined;
    expect(options).toBeDefined();
    expect(options!.offset).toBe(8);
    expect(options!.boundaryPadding).toBe(4);
  });
});
