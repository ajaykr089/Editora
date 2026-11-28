import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDialog, createListbox, createMenu, createPopover, createTabs } from '../headless';

function html(markup: string): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = markup;
  document.body.appendChild(host);
  return host;
}

const key = (el: Element, name: string, init: KeyboardEventInit = {}) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true, ...init }));

afterEach(() => {
  document.body.innerHTML = '';
  document.body.removeAttribute('style');
});

describe('createDialog', () => {
  const markup = `
    <button id="t">Open</button>
    <div id="d" hidden><h2>Delete file</h2><p data-dialog-description>This cannot be undone.</p>
      <button id="ok">Delete</button><button data-dialog-close>Cancel</button></div>
    <button id="outside">Outside</button>`;

  it('labels the dialog and wires the trigger', () => {
    const host = html(markup);
    createDialog({ trigger: host.querySelector('#t') as HTMLElement, content: host.querySelector('#d') as HTMLElement });
    const dialog = host.querySelector('#d')!;
    const trigger = host.querySelector('#t')!;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent).toBe('Delete file');
    expect(document.getElementById(dialog.getAttribute('aria-describedby')!)!.textContent).toBe('This cannot be undone.');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-controls')).toBe(dialog.id);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(dialog.getAttribute('data-state')).toBe('closed');
  });

  it('opens from the trigger, focuses inside, and closes with Escape, returning focus', () => {
    const host = html(markup);
    const onOpenChange = vi.fn();
    const trigger = host.querySelector('#t') as HTMLButtonElement;
    const dialog = createDialog({ trigger, content: host.querySelector('#d') as HTMLElement, onOpenChange });
    trigger.focus();
    trigger.click();
    expect(dialog.isOpen).toBe(true);
    expect((host.querySelector('#d') as HTMLElement).hidden).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(host.querySelector('#ok'));
    expect(onOpenChange).toHaveBeenLastCalledWith(true, 'trigger');
    key(document.activeElement!, 'Escape');
    expect(dialog.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(false, 'escape-key');
  });

  it('closes from a data-dialog-close button and locks scrolling while modal', () => {
    const host = html(markup);
    const dialog = createDialog({ content: host.querySelector('#d') as HTMLElement });
    dialog.open();
    expect(document.body.style.overflow).toBe('hidden');
    (host.querySelector('[data-dialog-close]') as HTMLButtonElement).click();
    expect(dialog.isOpen).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('can be non-modal and an alertdialog', () => {
    const host = html(markup);
    createDialog({ content: host.querySelector('#d') as HTMLElement, modal: false, role: 'alertdialog' });
    const dialog = host.querySelector('#d')!;
    expect(dialog.getAttribute('role')).toBe('alertdialog');
    expect(dialog.hasAttribute('aria-modal')).toBe(false);
  });

  it('shows an overlay with the panel and focuses inside once a hidden wrapper is revealed', async () => {
    const host = html('<div id="wrap" hidden><div id="ov"></div><div id="d" hidden><button id="ok">OK</button></div></div>');
    const wrap = host.querySelector('#wrap') as HTMLElement;
    const dialog = createDialog({
      content: host.querySelector('#d') as HTMLElement,
      overlay: host.querySelector('#ov') as HTMLElement,
      // The app reveals its wrapper later, as a framework render would.
      onOpenChange: (open) => { setTimeout(() => { wrap.hidden = !open; }, 0); },
    });
    dialog.open();
    expect((host.querySelector('#ov') as HTMLElement).hidden).toBe(false);
    expect(host.querySelector('#ov')!.getAttribute('data-state')).toBe('open');
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(document.activeElement).toBe(host.querySelector('#ok'));
    dialog.close();
    expect((host.querySelector('#ov') as HTMLElement).hidden).toBe(true);
  });

  it('destroy removes its listeners', () => {
    const host = html(markup);
    const trigger = host.querySelector('#t') as HTMLButtonElement;
    const dialog = createDialog({ trigger, content: host.querySelector('#d') as HTMLElement });
    dialog.destroy();
    trigger.click();
    expect(dialog.isOpen).toBe(false);
  });
});

describe('createPopover', () => {
  it('toggles from its trigger, moves focus in and closes with Escape', () => {
    const host = html('<button id="t">Filters</button><div id="p" hidden><input id="i" aria-label="Search"></div>');
    const trigger = host.querySelector('#t') as HTMLButtonElement;
    const popover = createPopover({ trigger, content: host.querySelector('#p') as HTMLElement });
    expect(host.querySelector('#p')!.getAttribute('role')).toBe('dialog');
    trigger.click();
    expect(popover.isOpen).toBe(true);
    expect(document.activeElement).toBe(host.querySelector('#i'));
    key(document.activeElement!, 'Escape');
    expect(popover.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });
});

describe('createPopover focus', () => {
  it('closes when focus moves outside it', () => {
    const host = html('<button id="t">Filters</button><div id="p" hidden><input id="i" aria-label="Search"></div><button id="after">After</button>');
    const popover = createPopover({ trigger: host.querySelector('#t') as HTMLElement, content: host.querySelector('#p') as HTMLElement });
    popover.open();
    const after = host.querySelector('#after') as HTMLButtonElement;
    after.focus();
    after.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(popover.isOpen).toBe(false);
  });
});

describe('createMenu', () => {
  const markup = `<button id="t">Actions</button>
    <div id="m" hidden>
      <button data-menu-item>Edit</button>
      <button data-menu-item aria-disabled="true">Duplicate</button>
      <button data-menu-item>Archive</button>
      <button data-menu-item>Delete</button>
    </div>`;

  it('opens with Arrow Down on the first item and Arrow Up on the last', () => {
    const host = html(markup);
    const trigger = host.querySelector('#t') as HTMLButtonElement;
    const menu = createMenu({ trigger, menu: host.querySelector('#m') as HTMLElement });
    const items = host.querySelectorAll('[data-menu-item]');
    expect(host.querySelector('#m')!.getAttribute('role')).toBe('menu');
    expect(items[0].getAttribute('role')).toBe('menuitem');
    key(trigger, 'ArrowDown');
    expect(menu.isOpen).toBe(true);
    expect(document.activeElement).toBe(items[0]);
    menu.close();
    key(trigger, 'ArrowUp');
    expect(document.activeElement).toBe(items[3]);
  });

  it('moves with arrows skipping disabled items, wraps, and finds items by typing', () => {
    const host = html(markup);
    const trigger = host.querySelector('#t') as HTMLButtonElement;
    createMenu({ trigger, menu: host.querySelector('#m') as HTMLElement });
    const items = host.querySelectorAll('[data-menu-item]');
    key(trigger, 'ArrowDown');
    key(document.activeElement!, 'ArrowDown');
    expect(document.activeElement).toBe(items[2]);
    key(document.activeElement!, 'End');
    expect(document.activeElement).toBe(items[3]);
    key(document.activeElement!, 'ArrowDown');
    expect(document.activeElement).toBe(items[0]);
    key(document.activeElement!, 'd');
    expect(document.activeElement).toBe(items[3]);
  });

  it('chooses with Enter, closes and returns focus', () => {
    const host = html(markup);
    const trigger = host.querySelector('#t') as HTMLButtonElement;
    const onSelect = vi.fn();
    const menu = createMenu({ trigger, menu: host.querySelector('#m') as HTMLElement, onSelect });
    key(trigger, 'ArrowDown');
    key(document.activeElement!, 'Enter');
    expect(onSelect).toHaveBeenCalledWith(host.querySelectorAll('[data-menu-item]')[0]);
    expect(menu.isOpen).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('ignores clicks on disabled items and closes on Escape', () => {
    const host = html(markup);
    const trigger = host.querySelector('#t') as HTMLButtonElement;
    const onSelect = vi.fn();
    const menu = createMenu({ trigger, menu: host.querySelector('#m') as HTMLElement, onSelect });
    trigger.click();
    (host.querySelectorAll('[data-menu-item]')[1] as HTMLButtonElement).click();
    expect(onSelect).not.toHaveBeenCalled();
    key(document.activeElement!, 'Escape');
    expect(menu.isOpen).toBe(false);
  });
});

describe('createTabs', () => {
  const markup = `<div id="list"><button data-tab>Account</button><button data-tab>Billing</button><button data-tab disabled>Team</button><button data-tab>Usage</button></div>
    <div data-panel>A</div><div data-panel>B</div><div data-panel>C</div><div data-panel>D</div>`;

  it('sets roles and links tabs to panels, one tab stop', () => {
    const host = html(markup);
    createTabs({ tablist: host.querySelector('#list') as HTMLElement });
    const tabs = host.querySelectorAll('[data-tab]');
    const panels = host.querySelectorAll('[data-panel]');
    expect(host.querySelector('#list')!.getAttribute('role')).toBe('tablist');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
    expect((tabs[0] as HTMLElement).tabIndex).toBe(0);
    expect((tabs[1] as HTMLElement).tabIndex).toBe(-1);
    expect((panels[1] as HTMLElement).hidden).toBe(true);
  });

  it('selects as arrows move, skipping disabled tabs, and reports the value', () => {
    const host = html(markup);
    const onValueChange = vi.fn();
    const tabs = createTabs({ tablist: host.querySelector('#list') as HTMLElement, onValueChange });
    const els = host.querySelectorAll<HTMLElement>('[data-tab]');
    els[0].focus();
    key(els[0], 'ArrowRight');
    expect(tabs.value).toBe('1');
    key(els[1], 'ArrowRight');
    expect(document.activeElement).toBe(els[3]);
    expect(tabs.value).toBe('3');
    key(els[3], 'Home');
    expect(tabs.value).toBe('0');
    expect(onValueChange).toHaveBeenCalledTimes(3);
  });

  it('only moves focus in manual mode until Enter', () => {
    const host = html(markup);
    const tabs = createTabs({ tablist: host.querySelector('#list') as HTMLElement, activation: 'manual' });
    const els = host.querySelectorAll<HTMLElement>('[data-tab]');
    els[0].focus();
    key(els[0], 'ArrowRight');
    expect(tabs.value).toBe('0');
    expect(document.activeElement).toBe(els[1]);
    key(els[1], 'Enter');
    expect(tabs.value).toBe('1');
  });
});

describe('createListbox', () => {
  const markup = `<div id="lb"><div data-option data-value="a">Apple</div><div data-option data-value="b">Banana</div><div data-option data-value="c" aria-disabled="true">Cherry</div><div data-option data-value="d">Date</div></div>`;

  it('single select follows focus, typeahead finds options', () => {
    const host = html(markup);
    const onValueChange = vi.fn();
    const list = createListbox({ listbox: host.querySelector('#lb') as HTMLElement, onValueChange });
    const options = host.querySelectorAll<HTMLElement>('[data-option]');
    expect(host.querySelector('#lb')!.getAttribute('role')).toBe('listbox');
    options[0].focus();
    key(options[0], 'ArrowDown');
    expect(list.value).toEqual(['b']);
    key(options[1], 'ArrowDown');
    expect(document.activeElement).toBe(options[3]);
    key(options[3], 'a');
    expect(list.value).toEqual(['a']);
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    expect(onValueChange).toHaveBeenLastCalledWith(['a']);
  });

  it('multiple select toggles with Space and click, selects all with Ctrl+A', () => {
    const host = html(markup);
    const list = createListbox({ listbox: host.querySelector('#lb') as HTMLElement, multiple: true });
    const options = host.querySelectorAll<HTMLElement>('[data-option]');
    expect(host.querySelector('#lb')!.getAttribute('aria-multiselectable')).toBe('true');
    options[0].click();
    options[1].focus();
    key(options[1], ' ');
    expect(list.value).toEqual(['a', 'b']);
    key(options[1], ' ');
    expect(list.value).toEqual(['a']);
    key(options[1], 'a', { ctrlKey: true });
    expect(list.value.sort()).toEqual(['a', 'b', 'd']);
  });
});
