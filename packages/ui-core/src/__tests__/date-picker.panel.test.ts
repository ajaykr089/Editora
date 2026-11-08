import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-calendar';
import '../components/ui-date-picker';
import '../components/ui-date-range-picker';
import '../components/ui-date-time-picker';
import '../components/ui-date-range-time-picker';
import '../components/ui-time-picker';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function mount(tag: string, attrs: Record<string, string> = {}): HTMLElement {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
  document.body.appendChild(el);
  return el;
}

function layerOf(picker: HTMLElement): ShadowRoot {
  const host = picker.shadowRoot!.querySelector('[data-picker-layer]') as HTMLElement | null;
  expect(host, 'panel layer inside the picker').toBeTruthy();
  return host!.shadowRoot!;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('picker panels', () => {
  it('build no calendar while closed (popover mode)', async () => {
    for (const tag of ['ui-date-picker', 'ui-date-range-picker', 'ui-date-time-picker', 'ui-date-range-time-picker']) {
      const picker = mount(tag, { label: 'From' });
      await flush();
      expect(picker.shadowRoot!.querySelector('ui-calendar'), tag).toBeNull();
      expect(picker.shadowRoot!.querySelectorAll('*').length, tag).toBeLessThan(60);
    }
  });

  it('still build the calendar in inline mode, and drop it when leaving inline mode', async () => {
    const picker = mount('ui-date-picker', { mode: 'inline' });
    await flush();
    expect(picker.shadowRoot!.querySelector('.inline-calendar')).toBeTruthy();
    picker.setAttribute('mode', 'popover');
    await flush();
    expect(picker.shadowRoot!.querySelector('.inline-calendar')).toBeNull();

    const dtp = mount('ui-date-time-picker', { mode: 'inline' });
    await flush();
    expect(dtp.shadowRoot!.querySelector('.dt-calendar-inline')).toBeTruthy();
    expect(dtp.shadowRoot!.querySelector('select[data-segment="hours"]')).toBeTruthy();
  });

  it('open inside the picker, not at the end of the page', async () => {
    const picker = mount('ui-date-picker', { label: 'From', open: '' });
    await flush();
    expect(document.body.querySelector('.ui-date-picker-overlay-host')).toBeNull();
    const layer = layerOf(picker);
    expect(layer.querySelector('.panel ui-calendar')).toBeTruthy();
    expect(picker.shadowRoot!.querySelector('[data-picker-layer]')!.getAttribute('exportparts')).toContain('popover');
    picker.removeAttribute('open');
    await flush();
    expect(picker.shadowRoot!.querySelector('[data-picker-layer]')).toBeNull();
  });

  it('do not repeat the field label as a panel title, and show one Today', async () => {
    const picker = mount('ui-date-picker', { label: 'From', open: '' });
    await flush();
    const layer = layerOf(picker);
    const header = layer.querySelector('.header') as HTMLElement;
    expect(header.hidden).toBe(true);
    expect(layer.querySelector('.panel')!.getAttribute('aria-label')).toBe('From');
    expect(layer.querySelector('ui-calendar')!.hasAttribute('hide-today')).toBe(true);
    expect(layer.querySelector('.footer [data-action="today"]')).toBeTruthy();

    const range = mount('ui-date-range-picker', { label: 'Period', open: '' });
    await flush();
    const rangeLayer = layerOf(range);
    expect((rangeLayer.querySelector('.header') as HTMLElement).hidden).toBe(true);
    expect(rangeLayer.querySelector('ui-calendar')!.hasAttribute('hide-today')).toBe(true);
  });

  it('keep the calendar Today when the footer is hidden', async () => {
    const picker = mount('ui-date-picker', { 'show-footer': 'false', open: '' });
    await flush();
    expect(layerOf(picker).querySelector('ui-calendar')!.hasAttribute('hide-today')).toBe(false);
  });

  it('hide both Clear buttons when clearable="false"', async () => {
    const picker = mount('ui-date-picker', { clearable: 'false', value: '2026-11-08', open: '' });
    await flush();
    expect((picker.shadowRoot!.querySelector('.btn[data-action="clear"]') as HTMLElement).hidden).toBe(true);
    expect((layerOf(picker).querySelector('.footer [data-action="clear"]') as HTMLElement).hidden).toBe(true);

    const range = mount('ui-date-range-picker', { clearable: 'false', open: '' });
    await flush();
    expect((layerOf(range).querySelector('.footer [data-action="clear"]') as HTMLElement).hidden).toBe(true);
  });

  it('moves focus from the calendar host to its current day', async () => {
    const calendar = mount('ui-calendar', { value: '2026-11-08', tabindex: '-1' });
    await flush();
    calendar.focus();
    const active = calendar.shadowRoot!.activeElement as HTMLElement | null;
    expect(active?.getAttribute('data-date')).toBe('2026-11-08');
  });

  it('take a default-value that arrives after connecting (as React sets it)', async () => {
    for (const [tag, value] of [['ui-date-picker', '2026-11-08'], ['ui-time-picker', '09:30'], ['ui-date-time-picker', '2026-11-08T09:30']] as const) {
      const picker = mount(tag);
      await flush();
      picker.setAttribute('default-value', value);
      await flush();
      const input = picker.shadowRoot!.querySelector('input.input') as HTMLInputElement;
      expect(input.value, tag).not.toBe('');
      // a later default-value change is not a new value
      picker.setAttribute('default-value', tag === 'ui-time-picker' ? '10:45' : '2026-12-01');
      await flush();
      expect((picker.shadowRoot!.querySelector('input.input') as HTMLInputElement).value, tag).toBe(input.value);
    }
  });
});

