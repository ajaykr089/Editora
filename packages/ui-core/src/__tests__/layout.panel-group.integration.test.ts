import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-layout';

function flushMicrotask() {
  return Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-layout shell behavior', () => {
  it('mounts a stable shell and emits normalized layout details on meaningful changes', async () => {
    const el = document.createElement('ui-layout') as HTMLElement;
    el.innerHTML = `
      <div slot="sidebar">Sidebar</div>
      <div slot="content">Content</div>
      <div slot="aside">Aside</div>
    `;
    document.body.appendChild(el);
    await flushMicrotask();

    const body = el.shadowRoot?.querySelector('.body') as HTMLElement | null;
    expect(body).toBeTruthy();
    expect(body?.dataset.layout).toBe('dashboard-start');

    const details: any[] = [];
    el.addEventListener('layoutchange', (event) => {
      details.push((event as CustomEvent).detail);
    });

    el.setAttribute('collapsed', '');
    await flushMicrotask();

    expect(details).toHaveLength(1);
    expect(details[0]).toMatchObject({
      mode: 'dashboard',
      collapsed: true,
      sidebarVisible: false,
      asideVisible: true,
      layout: 'dashboard-start-no-sidebar'
    });

    el.setAttribute('collapsed', '');
    await flushMicrotask();
    expect(details).toHaveLength(1);
  });

  it('syncs collapsed host state into the sidebar panel visibility', async () => {
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
    expect(sidebarPanel?.hidden).toBe(true);
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

    const body = el.shadowRoot?.querySelector('.body') as HTMLElement | null;
    const panels = Array.from(el.shadowRoot?.querySelectorAll('.panel') ?? []).filter((panel) => !(panel as HTMLElement).hidden);
    expect(body?.classList.contains('stack')).toBe(true);
    expect(body?.dataset.mode).toBe('stack');
    expect(panels.length).toBe(3);
  });
});
