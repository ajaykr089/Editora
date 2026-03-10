import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-tabs';
import '../components/ui-toolbar';
import '../components/ui-radio-group';
import '../components/ui-menubar';

function flushMicrotask() {
  return Promise.resolve();
}

describe('roving focus integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const root = document.getElementById('ui-portal-root');
    if (root?.parentElement) root.parentElement.removeChild(root);
  });

  it('ui-tabs keeps focus separate from selection in manual activation mode', async () => {
    const el = document.createElement('ui-tabs') as HTMLElement;
    el.setAttribute('activation', 'manual');
    el.innerHTML = `
      <button slot="tab" data-label="Alpha">Alpha</button>
      <button slot="tab" data-label="Beta">Beta</button>
      <button slot="tab" data-label="Gamma">Gamma</button>
      <div slot="panel">Panel A</div>
      <div slot="panel">Panel B</div>
      <div slot="panel">Panel C</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const first = el.shadowRoot?.querySelector('.tab[data-index="0"]') as HTMLButtonElement | null;
    first?.focus();
    first?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flushMicrotask();

    const second = el.shadowRoot?.querySelector('.tab[data-index="1"]') as HTMLButtonElement | null;
    expect(second?.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('selected')).toBe('0');

    second?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await flushMicrotask();

    expect(el.getAttribute('selected')).toBe('1');
  });

  it('ui-toolbar roves focus across slotted controls', async () => {
    const el = document.createElement('ui-toolbar') as HTMLElement;
    el.innerHTML = `
      <button>One</button>
      <button>Two</button>
      <button>Three</button>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const buttons = el.querySelectorAll('button');
    (buttons[0] as HTMLButtonElement).focus();
    (buttons[0] as HTMLButtonElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flushMicrotask();

    expect(buttons[1].getAttribute('tabindex')).toBe('0');
  });

  it('ui-radio-group uses roving focus for home/end and arrow movement', async () => {
    const el = document.createElement('ui-radio-group') as HTMLElement;
    el.setAttribute('options', JSON.stringify([
      { value: 'alpha', label: 'Alpha' },
      { value: 'beta', label: 'Beta' },
      { value: 'gamma', label: 'Gamma' }
    ]));
    document.body.appendChild(el);
    await flushMicrotask();

    const first = el.shadowRoot?.querySelector('.option[data-index="0"]') as HTMLButtonElement | null;
    first?.focus();
    first?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await flushMicrotask();
    expect(el.getAttribute('value')).toBe('beta');

    const second = el.shadowRoot?.querySelector('.option[data-index="1"]') as HTMLButtonElement | null;
    second?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await flushMicrotask();
    expect(el.getAttribute('value')).toBe('gamma');
  });

  it('ui-menubar roves focus across root items while closed', async () => {
    const el = document.createElement('ui-menubar') as HTMLElement;
    el.innerHTML = `
      <button slot="item">File</button>
      <button slot="item">Edit</button>
      <div slot="content"><button class="item">New</button></div>
      <div slot="content"><button class="item">Undo</button></div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const items = el.querySelectorAll('[slot="item"]');
    (items[0] as HTMLButtonElement).focus();
    (items[0] as HTMLButtonElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await flushMicrotask();

    expect(items[1].getAttribute('tabindex')).toBe('0');
    expect(el.hasAttribute('open')).toBe(false);
  });
});
