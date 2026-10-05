import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-collection';
import '../components/ui-listbox';
import '../components/ui-portal';
import '../components/ui-positioner';
import '../components/ui-textarea';
import type { UICollection } from '../components/ui-collection';

// Attributes that carry a CSS selector or a number come straight from markup / framework props,
// so a typo must degrade gracefully instead of throwing out of attributeChangedCallback or an
// event handler (which would leave the element half-initialised).
// ('-1' is rejected by browsers but accepted by jsdom's selector engine, so it is left out here.)
const BAD_SELECTORS = ['[1,2,3]', '<b>x</b>', 'a b ) c', '"quoted'];

let uncaught: unknown[] = [];
const onError = (event: ErrorEvent) => {
  uncaught.push(event.error ?? event.message);
  event.preventDefault();
};

beforeEach(() => {
  uncaught = [];
  document.body.innerHTML = '';
  window.addEventListener('error', onError);
});

afterEach(() => {
  window.removeEventListener('error', onError);
});

describe('invalid selector attributes', () => {
  it.each(BAD_SELECTORS)('ui-collection falls back to the default selector for item-selector=%s', (bad) => {
    const el = document.createElement('ui-collection') as UICollection;
    el.innerHTML = '<button data-collection-item>One</button><button role="option">Two</button>';
    document.body.appendChild(el);

    el.setAttribute('item-selector', bad);

    expect(() => el.queryItems()).not.toThrow();
    expect(el.queryItems()).toHaveLength(2);
    expect(uncaught).toEqual([]);
  });

  it.each(BAD_SELECTORS)('ui-collection ignores direct-item-selector=%s', (bad) => {
    const el = document.createElement('ui-collection') as UICollection;
    el.setAttribute('item-selector', '.item');
    el.innerHTML = '<button class="item">One</button>';
    document.body.appendChild(el);

    el.setAttribute('direct-item-selector', bad);

    expect(() => el.queryItems()).not.toThrow();
    expect(el.queryItems()).toHaveLength(1);
    expect(uncaught).toEqual([]);
  });

  it('ui-collection still honours valid selectors', () => {
    const el = document.createElement('ui-collection') as UICollection;
    el.setAttribute('item-selector', '.item');
    el.innerHTML = '<button class="item">One</button><button class="other">Two</button>';
    document.body.appendChild(el);

    expect(el.queryItems()).toHaveLength(1);
  });

  it('ui-listbox keeps handling clicks when item-selector is invalid', () => {
    const el = document.createElement('ui-listbox') as HTMLElement;
    el.innerHTML = '<div role="option" data-value="a">A</div>';
    document.body.appendChild(el);
    el.setAttribute('item-selector', '[1,2,3]');

    const selected: string[] = [];
    el.addEventListener('select', (event) => selected.push((event as CustomEvent).detail.value));
    (el.querySelector('[role="option"]') as HTMLElement).click();

    expect(uncaught).toEqual([]);
    expect(selected).toEqual(['a']);
  });

  it.each(BAD_SELECTORS)('ui-portal treats target=%s as missing and falls back to body', async (bad) => {
    const el = document.createElement('ui-portal');
    const missing: string[] = [];
    el.addEventListener('target-missing', (event) => missing.push((event as CustomEvent).detail.target));
    el.setAttribute('target', bad);
    el.innerHTML = '<span id="ported">hi</span>';

    document.body.appendChild(el);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(uncaught).toEqual([]);
    expect(missing.length).toBeGreaterThan(0);
    expect(new Set(missing)).toEqual(new Set([bad]));
    expect(document.getElementById('ported')?.parentElement).toBe(document.body);
  });

  it.each(BAD_SELECTORS)('ui-positioner ignores anchor=%s and uses the slotted anchor', (bad) => {
    const el = document.createElement('ui-positioner');
    el.setAttribute('anchor', bad);
    el.innerHTML = '<button slot="anchor">anchor</button><div slot="content">content</div>';

    expect(() => document.body.appendChild(el)).not.toThrow();
    expect(() => (el as unknown as { updatePosition(): void }).updatePosition()).not.toThrow();
    expect(uncaught).toEqual([]);
  });
});

describe('ui-textarea length attributes', () => {
  const mount = (attrs: Record<string, string>) => {
    const el = document.createElement('ui-textarea');
    Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
    document.body.appendChild(el);
    return el;
  };
  const inner = (el: HTMLElement) => el.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

  it.each(['-1', '-727379969', '999999999999', 'NaN', '1e999', ''])('does not throw for maxlength/minlength=%s', (bad) => {
    const el = mount({ maxlength: bad, minlength: bad });

    expect(uncaught).toEqual([]);
    expect(inner(el).hasAttribute('maxlength')).toBe(false);
    expect(inner(el).hasAttribute('minlength')).toBe(false);
  });

  it('applies valid lengths and drops them again when they become invalid', () => {
    const el = mount({ maxlength: '20', minlength: '3' });
    expect(inner(el).maxLength).toBe(20);
    expect(inner(el).minLength).toBe(3);

    el.setAttribute('maxlength', '-5');
    expect(uncaught).toEqual([]);
    expect(inner(el).hasAttribute('maxlength')).toBe(false);
  });

  it('shows a plain character count rather than a nonsense limit when maxlength is invalid', () => {
    const el = mount({ maxlength: '-1', value: 'abc', 'show-count': '' });

    const count = el.shadowRoot?.querySelector('[id$="-count"]') as HTMLElement;
    expect(count.textContent).toBe('3');
  });
});
