import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-layout';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-layout panel-group adoption', () => {
  it('mounts a panel group for dashboard shells and propagates layoutchange', async () => {
    const el = document.createElement('ui-layout') as HTMLElement;
    el.innerHTML = `
      <div slot="sidebar">Sidebar</div>
      <div slot="content">Content</div>
      <div slot="aside">Aside</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const group = el.shadowRoot?.querySelector('ui-panel-group') as HTMLElement | null;
    expect(group).toBeTruthy();

    let fired = 0;
    el.addEventListener('layoutchange', () => {
      fired += 1;
    });

    group?.dispatchEvent(new CustomEvent('layout-change', { bubbles: true, composed: true }));
    expect(fired).toBe(1);
  });

  it('syncs collapsed host state into the sidebar panel', async () => {
    const el = document.createElement('ui-layout') as HTMLElement;
    el.innerHTML = `
      <div slot="sidebar">Sidebar</div>
      <div slot="content">Content</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    el.setAttribute('collapsed', '');
    await flushMicrotask();

    const sidebarPanel = el.shadowRoot?.querySelector('.sidebar-panel') as HTMLElement | null;
    expect(sidebarPanel?.hasAttribute('collapsed')).toBe(true);
  });

  it('uses stacked body mode when mode=stack', async () => {
    const el = document.createElement('ui-layout') as HTMLElement;
    el.setAttribute('mode', 'stack');
    el.innerHTML = `
      <div slot="sidebar">Sidebar</div>
      <div slot="content">Content</div>
      <div slot="aside">Aside</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const group = el.shadowRoot?.querySelector('ui-panel-group') as HTMLElement | null;
    const stackBody = el.shadowRoot?.querySelector('.stack-body') as HTMLElement | null;
    expect(group?.hidden).toBe(true);
    expect(stackBody?.hidden).toBe(false);
    expect(stackBody?.children.length).toBe(3);
  });
});
