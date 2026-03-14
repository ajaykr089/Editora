import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-panel';
import '../components/ui-splitter';
import '../components/ui-panel-group';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
  window.localStorage.clear();
});

describe('ui-panel-group', () => {
  it('creates splitters and normalizes an initial layout', async () => {
    const el = document.createElement('ui-panel-group') as HTMLElement & { getLayout(): number[] };
    el.innerHTML = `
      <ui-panel size="20"></ui-panel>
      <ui-panel></ui-panel>
      <ui-panel size="30"></ui-panel>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const splitters = el.querySelectorAll('ui-splitter');
    expect(splitters).toHaveLength(2);
    expect(el.getLayout().map((value) => Math.round(value))).toEqual([20, 50, 30]);
  });

  it('resizes adjacent panels from splitter keyboard input', async () => {
    const el = document.createElement('ui-panel-group') as HTMLElement & { getLayout(): number[] };
    el.style.width = '900px';
    el.style.height = '360px';
    el.innerHTML = `
      <ui-panel size="40"></ui-panel>
      <ui-panel size="60"></ui-panel>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const splitter = el.querySelector('ui-splitter') as HTMLElement;
    splitter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    const layout = el.getLayout();
    expect(layout[0]).toBeGreaterThan(40);
    expect(layout[1]).toBeLessThan(60);
  });

  it('persists layout when storage-key and auto-save are enabled', async () => {
    window.localStorage.removeItem('ui-panel-group:test-layout');

    const first = document.createElement('ui-panel-group') as HTMLElement & {
      setLayout(sizes: number[]): void;
    };
    first.setAttribute('storage-key', 'test-layout');
    first.setAttribute('auto-save', '');
    first.innerHTML = `
      <ui-panel></ui-panel>
      <ui-panel></ui-panel>
    `;
    document.body.appendChild(first);
    await flushMicrotask();
    first.setLayout([65, 35]);
    first.remove();

    const second = document.createElement('ui-panel-group') as HTMLElement & { getLayout(): number[] };
    second.setAttribute('storage-key', 'test-layout');
    second.setAttribute('auto-save', '');
    second.innerHTML = `
      <ui-panel></ui-panel>
      <ui-panel></ui-panel>
    `;
    document.body.appendChild(second);
    await flushMicrotask();

    expect(second.getLayout().map((value) => Math.round(value))).toEqual([65, 35]);
  });

  it('supports panel collapse and expand through the panel contract', async () => {
    const el = document.createElement('ui-panel-group') as HTMLElement & { getLayout(): number[] };
    el.innerHTML = `
      <ui-panel size="30" collapsible collapsed-size="8"></ui-panel>
      <ui-panel size="70"></ui-panel>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const panel = el.querySelector('ui-panel') as HTMLElement & { collapse(): void; expand(): void };
    panel.collapse();
    expect(el.getLayout()[0]).toBeCloseTo(8, 1);

    panel.expand();
    expect(el.getLayout()[0]).toBeGreaterThan(8);
  });

  it('reacts to collapsed attribute changes on child panels', async () => {
    const el = document.createElement('ui-panel-group') as HTMLElement & { getLayout(): number[] };
    el.innerHTML = `
      <ui-panel size="68" min-size="42"></ui-panel>
      <ui-panel size="32" min-size="18" collapsed-size="8"></ui-panel>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const panel = el.querySelectorAll('ui-panel')[1] as HTMLElement;
    panel.setAttribute('collapsed', '');
    await flushMicrotask();
    expect(el.getLayout()[1]).toBeCloseTo(8, 1);

    panel.removeAttribute('collapsed');
    await flushMicrotask();
    expect(el.getLayout()[1]).toBeGreaterThan(8);
  });
});
