import { beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-popover';

describe('ui-popover integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    const root = document.getElementById('ui-portal-root');
    if (root?.parentElement) root.parentElement.removeChild(root);
  });

  it('opens from trigger click and renders portaled content', () => {
    const el = document.createElement('ui-popover');
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content">POPOVER CONTENT</div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLButtonElement;
    trigger.click();

    expect(el.hasAttribute('open')).toBe(true);
    const root = document.getElementById('ui-portal-root');
    expect(root).toBeTruthy();
    expect(root?.textContent).toContain('POPOVER CONTENT');
  });

  it('closes on outside pointerdown', () => {
    const outside = document.createElement('button');
    const el = document.createElement('ui-popover');
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button>Action</button></div>
    `;
    document.body.append(outside, el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLButtonElement;
    trigger.click();
    expect(el.hasAttribute('open')).toBe(true);

    outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('closes on Escape and restores focus to trigger', () => {
    const el = document.createElement('ui-popover');
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><button>Action</button></div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLButtonElement;
    trigger.focus();
    trigger.click();
    expect(el.hasAttribute('open')).toBe(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(el.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('anchors the arrow to the resolved placement edge', () => {
    const el = document.createElement('ui-popover');
    el.setAttribute('placement', 'right');
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content">POPOVER CONTENT</div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLButtonElement;
    trigger.click();

    const root = document.getElementById('ui-portal-root');
    const wrapper = root?.firstElementChild as HTMLElement | null;
    const arrow = root?.querySelector('.arrow') as HTMLElement | null;

    expect(wrapper?.getAttribute('data-placement')).toBe('right');
    expect(arrow).toBeTruthy();
  });

  it('updates portaled content while open when the source content changes', async () => {
    const el = document.createElement('ui-popover');
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content"><span data-copy>Initial content</span></div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLButtonElement;
    trigger.click();

    const source = el.querySelector('[slot="content"] [data-copy]') as HTMLElement;
    source.textContent = 'Updated content';
    await Promise.resolve();
    await Promise.resolve();

    const root = document.getElementById('ui-portal-root');
    expect(root?.textContent).toContain('Updated content');
  });

  it('applies surface attributes to the portaled popover shell', () => {
    const el = document.createElement('ui-popover');
    el.setAttribute('variant', 'glass');
    el.setAttribute('tone', 'danger');
    el.setAttribute('size', 'lg');
    el.setAttribute('radius', '18');
    el.setAttribute('elevation', 'high');
    el.innerHTML = `
      <button slot="trigger">Open</button>
      <div slot="content">Styled content</div>
    `;
    document.body.appendChild(el);

    const trigger = el.querySelector('[slot="trigger"]') as HTMLButtonElement;
    trigger.click();

    const root = document.getElementById('ui-portal-root');
    const shell = root?.firstElementChild as HTMLElement | null;

    expect(shell?.classList.contains('popover-shell')).toBe(true);
    expect(shell?.dataset.variant).toBe('glass');
    expect(shell?.dataset.tone).toBe('danger');
    expect(shell?.dataset.size).toBe('lg');
    expect(shell?.dataset.elevation).toBe('high');
    expect(shell?.style.getPropertyValue('--ui-popover-radius')).toBe('18px');
  });
});
