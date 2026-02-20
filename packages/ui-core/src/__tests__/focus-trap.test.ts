import { beforeEach, describe, expect, it } from 'vitest';
import { FocusManager } from '../focusManager';
import '../components/ui-drawer';

describe('focus trap hardening', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('cycles tab focus and prevents focus escape', () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);
    outside.focus();

    const container = document.createElement('div');
    const first = document.createElement('button');
    first.textContent = 'first';
    const second = document.createElement('button');
    second.textContent = 'second';
    container.append(first, second);
    document.body.appendChild(container);

    const trap = FocusManager.trap(container);
    expect(document.activeElement).toBe(first);

    second.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(first);

    first.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey: true }));
    expect(document.activeElement).toBe(second);

    outside.focus();
    expect(container.contains(document.activeElement)).toBe(true);

    trap.release();
    expect(document.activeElement).toBe(outside);
  });

  it('prioritizes the most-recent trap when traps are nested', () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);

    const one = document.createElement('div');
    const oneButton = document.createElement('button');
    oneButton.textContent = 'one';
    one.appendChild(oneButton);
    document.body.appendChild(one);

    const two = document.createElement('div');
    const twoButton = document.createElement('button');
    twoButton.textContent = 'two';
    two.appendChild(twoButton);
    document.body.appendChild(two);

    const trapOne = FocusManager.trap(one);
    const trapTwo = FocusManager.trap(two);

    outside.focus();
    expect(document.activeElement).toBe(twoButton);

    trapTwo.release();
    outside.focus();
    expect(document.activeElement).toBe(oneButton);

    trapOne.release();
  });

  it('keeps focus trapped in ui-drawer while open', () => {
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.appendChild(outside);
    outside.focus();

    const drawer = document.createElement('ui-drawer');
    drawer.setAttribute('open', '');
    drawer.setAttribute('dismissible', '');
    drawer.innerHTML = `
      <button>Action 1</button>
      <button>Action 2</button>
    `;
    document.body.appendChild(drawer);

    const panel = drawer.shadowRoot?.querySelector('.panel') as HTMLElement | null;
    expect(panel).toBeTruthy();
    expect(panel?.contains(document.activeElement)).toBe(true);

    outside.focus();
    expect(panel?.contains(document.activeElement)).toBe(true);

    drawer.removeAttribute('open');
    expect(document.activeElement).toBe(outside);
  });
});

