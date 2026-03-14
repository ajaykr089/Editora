import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-meter';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-meter', () => {
  it('clamps values and emits semantic state details', async () => {
    const el = document.createElement('ui-meter');
    el.setAttribute('min', '0');
    el.setAttribute('max', '100');
    el.setAttribute('value', '130');
    el.setAttribute('low', '25');
    el.setAttribute('high', '75');

    let detail: any = null;
    el.addEventListener('change', (event) => {
      detail = (event as CustomEvent).detail;
    });

    document.body.appendChild(el);
    await flushMicrotask();

    expect(detail?.value).toBe(100);
    expect(detail?.percent).toBe(100);
    expect(detail?.state).toBe('high');
    expect(el.getAttribute('data-meter-state')).toBe('high');
  });

  it('renders accessible value text and respects optimum ranges', async () => {
    const el = document.createElement('ui-meter');
    el.setAttribute('min', '0');
    el.setAttribute('max', '1');
    el.setAttribute('value', '0.82');
    el.setAttribute('low', '0.4');
    el.setAttribute('high', '0.7');
    el.setAttribute('optimum', '0.9');
    el.setAttribute('format', 'percent');
    el.setAttribute('precision', '0');
    el.setAttribute('label', 'Quality score');

    document.body.appendChild(el);
    await flushMicrotask();

    const track = el.shadowRoot?.querySelector('.track');
    const circle = el.shadowRoot?.querySelector('.circle-value');
    expect(track?.getAttribute('aria-valuetext')).toBe('82%');
    expect(track?.getAttribute('aria-label')).toBe('Quality score');
    expect(circle?.textContent).toBe('82%');
    expect(el.getAttribute('data-meter-state')).toBe('optimum');
  });
});
