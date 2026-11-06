import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-layout';
import '../components/ui-app-header';

const wait = () => new Promise((resolve) => setTimeout(resolve, 10));
let original: typeof window.matchMedia;

function narrowViewport(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => { original = window.matchMedia; });
afterEach(() => { window.matchMedia = original; document.body.innerHTML = ''; });

async function mount(attrs: string) {
  document.body.innerHTML = `
    <ui-layout ${attrs}>
      <ui-app-header slot="header" show-menu-button="narrow"></ui-app-header>
      <nav slot="sidebar"><a href="#a" id="first">A</a></nav>
      <div slot="content"><button id="inside">x</button></div>
    </ui-layout>`;
  await wait();
  return document.querySelector('ui-layout') as HTMLElement & { toggleSidebar(): void; drawerActive: boolean };
}

describe('ui-layout shell drawer', () => {
  it('turns the sidebar into a drawer on narrow screens and opens it from the header menu button', async () => {
    narrowViewport(true);
    const layout = await mount('variant="shell"');
    expect(layout.drawerActive).toBe(true);
    const panel = layout.shadowRoot!.querySelector('.sidebar-panel')!;
    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.hasAttribute('inert')).toBe(true);

    const header = layout.querySelector('ui-app-header')!;
    (header.shadowRoot!.querySelector('.menu-btn') as HTMLButtonElement).click();
    await wait();
    expect(layout.hasAttribute('sidebar-open')).toBe(true);
    expect(panel.hasAttribute('inert')).toBe(false);
    expect(layout.shadowRoot!.querySelector('.content-panel')!.hasAttribute('inert')).toBe(true);
    expect(header.shadowRoot!.querySelector('.menu-btn')!.getAttribute('aria-expanded')).toBe('true');

    layout.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await wait();
    expect(layout.hasAttribute('sidebar-open')).toBe(false);
  });

  it('keeps the old stacked sidebar for other variants unless mobile-sidebar="drawer"', async () => {
    narrowViewport(true);
    let layout = await mount('');
    expect(layout.drawerActive).toBe(false);
    layout = await mount('mobile-sidebar="drawer"');
    expect(layout.drawerActive).toBe(true);
    layout = await mount('variant="shell" mobile-sidebar="stack"');
    expect(layout.drawerActive).toBe(false);
  });

  it('is not a drawer on wide screens; toggleSidebar collapses there as before', async () => {
    narrowViewport(false);
    const layout = await mount('variant="shell"');
    expect(layout.drawerActive).toBe(false);
    layout.toggleSidebar();
    await wait();
    expect(layout.hasAttribute('collapsed')).toBe(true);
    expect(layout.hasAttribute('sidebar-open')).toBe(false);
  });
});
