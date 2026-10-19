import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToolbarRenderer } from '../ToolbarRenderer';

// The web component's toolbar menus (the block type, alignment...) were mouse-only: the trigger did not say it opens a
// menu, nothing had a menu role, and the arrow keys did nothing.
const PLUGIN = {
  name: 'menus',
  toolbar: [
    { label: 'Block', command: 'setBlockType', type: 'dropdown', options: [{ label: 'Paragraph', value: 'p' }, { label: 'Heading 1', value: 'h1' }, { label: 'Heading 2', value: 'h2' }] },
    { label: 'Alignment', command: 'setTextAlignment', type: 'inline-menu', icon: '<svg width="10" height="10"></svg>', options: [{ label: 'Left', value: 'left' }, { label: 'Center', value: 'center' }, { label: 'Right', value: 'right' }] },
  ],
} as any;

let host: HTMLElement;
let renderer: ToolbarRenderer;
let handler: ReturnType<typeof vi.fn>;

const trigger = (command: 'setBlockType' | 'setTextAlignment') => {
  const menuHost = command === 'setBlockType' ? '.editora-toolbar-dropdown:not(.editora-toolbar-inline-menu)' : '.editora-toolbar-inline-menu';
  return host.querySelector(`${menuHost} > button`) as HTMLButtonElement;
};
const menuOf = (button: HTMLElement) => button.parentElement!.querySelector('.editora-toolbar-dropdown-menu') as HTMLElement;
const itemsOf = (menu: HTMLElement) => Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
const key = (target: Element, init: KeyboardEventInit) => {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
};
const flush = () => Promise.resolve();

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  handler = vi.fn();
  renderer = new ToolbarRenderer({ items: 'setBlockType setTextAlignment' }, [PLUGIN]);
  renderer.setCommandHandler(handler);
  renderer.render(host);
});

afterEach(() => {
  renderer.destroy?.();
  host.remove();
});

for (const [name, command] of [['dropdown', 'setBlockType'], ['inline menu', 'setTextAlignment']] as const) {
  describe(`toolbar ${name}`, () => {
    it('says it opens a menu, and whether it is open', async () => {
      const button = trigger(command);
      expect(button.getAttribute('aria-haspopup')).toBe('menu');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      button.click();
      await flush();
      expect(menuOf(button).style.display).toBe('block');
      expect(button.getAttribute('aria-expanded')).toBe('true');
      button.click();
      await flush();
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('gives the menu a role and a name and the items a menuitem role, out of the tab order', () => {
      const menu = menuOf(trigger(command));
      expect(menu.getAttribute('role')).toBe('menu');
      expect(menu.getAttribute('aria-label')).toBe(command === 'setBlockType' ? 'Block' : 'Alignment');
      const items = itemsOf(menu);
      expect(items).toHaveLength(3);
      expect(items.every((item) => item.tabIndex === -1)).toBe(true);
    });

    it('leaves the focus where it was after a mouse click (a click with a pointer)', () => {
      const button = trigger(command);
      button.focus();
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
      expect(document.activeElement).toBe(button);
    });

    it('takes the focus into the menu for a click with no pointer (Enter or Space on the button)', () => {
      const button = trigger(command);
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 0 }));
      expect(document.activeElement).toBe(itemsOf(menuOf(button))[0]);
    });

    it('opens with ArrowDown on the first item and with ArrowUp on the last', () => {
      const button = trigger(command);
      const items = itemsOf(menuOf(button));
      expect(key(button, { key: 'ArrowDown' }).defaultPrevented).toBe(true);
      expect(menuOf(button).style.display).toBe('block');
      expect(document.activeElement).toBe(items[0]);

      key(document.activeElement!, { key: 'Escape' });
      key(button, { key: 'ArrowUp' });
      expect(document.activeElement).toBe(items[2]);
    });

    it('moves with the arrow keys, Home and End, and wraps at both ends', () => {
      const button = trigger(command);
      const items = itemsOf(menuOf(button));
      key(button, { key: 'ArrowDown' });
      key(document.activeElement!, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(items[1]);
      key(document.activeElement!, { key: 'End' });
      expect(document.activeElement).toBe(items[2]);
      key(document.activeElement!, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(items[0]);
      key(document.activeElement!, { key: 'ArrowUp' });
      expect(document.activeElement).toBe(items[2]);
      key(document.activeElement!, { key: 'Home' });
      expect(document.activeElement).toBe(items[0]);
    });

    it('closes with Escape and gives the focus back to the trigger', () => {
      const button = trigger(command);
      key(button, { key: 'ArrowDown' });
      key(document.activeElement!, { key: 'Escape' });
      expect(menuOf(button).style.display).toBe('none');
      expect(document.activeElement).toBe(button);
    });

    it('closes with Tab and leaves the focus to move on', () => {
      const button = trigger(command);
      key(button, { key: 'ArrowDown' });
      const event = key(document.activeElement!, { key: 'Tab' });
      expect(event.defaultPrevented).toBe(false);
      expect(menuOf(button).style.display).toBe('none');
    });

    it('chooses an item with Enter (a native button click), runs the command and closes', () => {
      const button = trigger(command);
      key(button, { key: 'ArrowDown' });
      key(document.activeElement!, { key: 'ArrowDown' });
      (document.activeElement as HTMLElement).click();
      expect(handler).toHaveBeenCalledWith(command, command === 'setBlockType' ? 'h1' : 'center');
      expect(menuOf(button).style.display).toBe('none');
    });

    it('does not react to other keys', () => {
      const button = trigger(command);
      key(button, { key: 'ArrowDown' });
      key(document.activeElement!, { key: 'a' });
      expect(menuOf(button).style.display).toBe('block');
      expect(document.activeElement).toBe(itemsOf(menuOf(button))[0]);
    });
  });
}
