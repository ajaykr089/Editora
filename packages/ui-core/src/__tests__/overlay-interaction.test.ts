import { describe, it, expect, beforeEach } from 'vitest';

describe('overlay interaction (popover / dropdown / menu)', () => {
  beforeEach(() => {
    // ensure portal root is clean between tests
    const root = document.getElementById('ui-portal-root');
    if (root && root.parentElement) root.parentElement.removeChild(root);
  });

  it('ui-popover: clicking a slotted trigger opens the popover and portal contains content', () => {
    const el = document.createElement('ui-popover') as any;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content">POPOVER CONTENT</div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLElement;
    trigger.click();

    expect(el.hasAttribute('open')).toBe(true);

    const root = document.getElementById('ui-portal-root')!;
    const panel = root.querySelector('.panel') as HTMLElement | null;
    expect(panel).toBeTruthy();
    expect(panel!.textContent).toContain('POPOVER CONTENT');
    expect(panel!.classList.contains('show')).toBe(true);

    // removing host must also cleanup the portal
    el.remove();
    const rootAfter = document.getElementById('ui-portal-root');
    expect(rootAfter?.querySelector('.panel')).toBeNull();
  });

  it('ui-popover: closes on outside pointerdown', () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);

    const el = document.createElement('ui-popover') as any;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button>Action</button></div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLElement;
    trigger.click();
    expect(el.hasAttribute('open')).toBe(true);

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(el.hasAttribute('open')).toBe(false);

    el.remove();
    outside.remove();
  });

  it('ui-popover: Escape closes and restores trigger focus', () => {
    const el = document.createElement('ui-popover') as any;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button>Popover action</button></div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLButtonElement;
    trigger.focus();
    trigger.click();
    expect(el.hasAttribute('open')).toBe(true);

    const root = document.getElementById('ui-portal-root')!;
    const panelAction = root.querySelector('.panel button') as HTMLButtonElement | null;
    panelAction?.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(el.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(trigger);

    el.remove();
  });

  it('ui-dropdown: clicking a slotted trigger opens the dropdown and portal contains menu', () => {
    const el = document.createElement('ui-dropdown') as any;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><div class="item">Item A</div></div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLElement;
    trigger.click();

    expect(el.hasAttribute('open')).toBe(true);

    const root = document.getElementById('ui-portal-root')!;
    const menu = root.querySelector('.menu') as HTMLElement | null;
    expect(menu).toBeTruthy();
    expect(menu!.textContent).toContain('Item A');
    // ensure role and default item styling hooks are present
    expect(menu!.getAttribute('role')).toBe('menu');

    // removing host must also cleanup the portal
    el.remove();
    const rootAfter = document.getElementById('ui-portal-root');
    expect(rootAfter?.querySelector('.menu')).toBeNull();
  });

  it('ui-menu: clicking slotted trigger opens menu and selecting item emits select event with index', () => {
    const el = document.createElement('ui-menu') as any;
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="item">One</div>
      <div slot="item">Two</div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLElement;
    trigger.click();

    expect(el.hasAttribute('open')).toBe(true);

    const root = document.getElementById('ui-portal-root')!;
    const items = root.querySelectorAll('.item');
    expect(items.length).toBe(2);

    let selectedIndex: number | null = null;
    el.addEventListener('select', (ev: any) => { selectedIndex = ev.detail.index; });

    (items[1] as HTMLElement).click();
    expect(selectedIndex).toBe(1);

    // removing host must also cleanup the portal
    el.remove();
    const rootAfter = document.getElementById('ui-portal-root');
    expect(rootAfter?.querySelectorAll('.item').length).toBe(0);
  });

  it('ui-context-menu: openFor(anchorId) shows menu content and closes when anchor becomes hidden/removed', () => {
    const anchor = document.createElement('div');
    anchor.id = 'tmp-anchor';
    anchor.style.position = 'absolute';
    anchor.style.left = '20px';
    anchor.style.top = '20px';
    document.body.appendChild(anchor);

    const el = document.createElement('ui-context-menu') as any;
    el.innerHTML = `
      <div slot="content"><div class="c">A</div></div>
    `;
    document.body.appendChild(el);

    // open for anchor id
    el.openFor && el.openFor('tmp-anchor');
    expect(el.hasAttribute('open')).toBe(true);

    const surface = el.shadowRoot?.querySelector('.surface') as HTMLElement | null;
    expect(surface).toBeTruthy();
    expect(surface!.textContent).toContain('A');

    // hide anchor (display:none) -> reposition should close
    anchor.style.display = 'none';
    el._positionMenu && el._positionMenu();
    expect(el.hasAttribute('open')).toBe(false);

    // reopen and then remove anchor node entirely -> should also close
    el.close && el.close();
    el.openFor && el.openFor('tmp-anchor');
    expect(el.hasAttribute('open')).toBe(true);
    document.body.removeChild(anchor);
    el._positionMenu && el._positionMenu();
    expect(el.hasAttribute('open')).toBe(false);

    el.remove();
  });

  it('ui-floating-toolbar: showForAnchorId cleans up if anchor is removed/hidden', () => {
    const anchor = document.createElement('div');
    anchor.id = 'ft-anchor';
    anchor.style.position = 'absolute';
    anchor.style.left = '120px';
    anchor.style.top = '120px';
    document.body.appendChild(anchor);

    const toolbar = document.createElement('ui-floating-toolbar') as any;
    toolbar.innerHTML = `<div slot="toolbar">Toolbar</div>`;
    document.body.appendChild(toolbar);

    toolbar.showForAnchorId && toolbar.showForAnchorId('ft-anchor');
    expect(toolbar.hasAttribute('open')).toBe(true);

    const root = document.getElementById('ui-portal-root')!;
    let panel = root.querySelector('.floating-toolbar') as HTMLElement | null;
    expect(panel).toBeTruthy();

    // hide anchor
    anchor.style.display = 'none';
    document.body.dispatchEvent(new Event('resize'));
    panel = root.querySelector('.floating-toolbar') as HTMLElement | null;
    expect(panel).toBeNull();

    // reopen then remove anchor node entirely -> toolbar should cleanup
    toolbar.showForAnchorId && toolbar.showForAnchorId('ft-anchor');
    expect(root.querySelector('.floating-toolbar')).toBeTruthy();
    document.body.removeChild(anchor);
    document.body.dispatchEvent(new Event('resize'));
    expect(root.querySelector('.floating-toolbar')).toBeNull();

    toolbar.remove();
  });
});
