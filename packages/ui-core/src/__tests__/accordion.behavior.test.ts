import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-accordion';

function flushMicrotask() {
  return Promise.resolve();
}

function createAccordionMarkup() {
  return `
    <div data-ui-accordion-item data-description="Overview" data-badge="Core">
      <button data-ui-accordion-trigger type="button">Section one</button>
      <div data-ui-accordion-panel>Panel one</div>
    </div>
    <div data-ui-accordion-item>
      <button data-ui-accordion-trigger type="button">Section two</button>
      <div data-ui-accordion-panel>Panel two</div>
    </div>
  `;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-accordion', () => {
  it('normalizes radius values and keeps shape as a compatibility alias', async () => {
    const el = document.createElement('ui-accordion');
    el.innerHTML = createAccordionMarkup();
    el.setAttribute('radius', '12');
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.style.getPropertyValue('--ui-accordion-radius')).toBe('12px');

    el.setAttribute('radius', 'full');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-accordion-radius')).toBe('999px');

    el.removeAttribute('radius');
    el.setAttribute('shape', 'square');
    await flushMicrotask();
    expect(el.style.getPropertyValue('--ui-accordion-radius')).toBe('4px');
  });

  it('opens and closes items through the rendered trigger buttons', async () => {
    const el = document.createElement('ui-accordion');
    el.setAttribute('collapsible', 'true');
    el.innerHTML = createAccordionMarkup();
    document.body.appendChild(el);
    await flushMicrotask();

    const trigger = el.querySelector('[data-ui-accordion-trigger]') as HTMLButtonElement | null;
    expect(trigger).toBeTruthy();

    trigger?.click();
    await flushMicrotask();
    expect(el.getAttribute('open')).toBe('0');

    trigger?.click();
    await flushMicrotask();
    expect(el.getAttribute('open')).toBe('-1');
  });

  it('supports disabling the indicator rail', async () => {
    const el = document.createElement('ui-accordion');
    el.setAttribute('indicator', 'none');
    el.innerHTML = createAccordionMarkup();
    document.body.appendChild(el);
    await flushMicrotask();

    expect(el.getAttribute('indicator')).toBe('none');
  });
});
