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
});
