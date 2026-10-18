import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Toolbar } from '../components/Toolbar';

// The toolbar's dropdowns (block type, font family, alignment...) could only be used with a mouse: the items were
// bare divs, and the trigger said nothing about opening a menu.
const BLOCKS = [
  { label: 'Paragraph', value: 'p' },
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
];
const ITEMS = [
  { type: 'dropdown', label: 'Block Type', command: 'setBlockType', options: BLOCKS },
  { type: 'dropdown', label: 'Font Family', command: 'setFontFamily', options: [{ label: 'Serif', value: 'serif' }, { label: 'Mono', value: 'mono' }] },
] as any;

const editorStub = { pluginManager: { getToolbarItems: () => [] } } as any;
let run: ReturnType<typeof vi.fn>;

const trigger = (name: RegExp | string = /^P/) => screen.getByRole('button', { name });
const menu = () => screen.queryByRole('menu');
const items = () => Array.from(menu()!.querySelectorAll<HTMLElement>('[role^="menuitem"]'));
const focusedLabel = () => document.activeElement?.textContent?.trim();

const mount = () =>
  render(<Toolbar editor={editorStub} itemsOverride={ITEMS} showMoreOptions={false} />);

beforeEach(() => {
  run = vi.fn();
  (window as any).executeEditorCommand = run;
  document.body.innerHTML = '';
});

afterEach(() => {
  cleanup();
  delete (window as any).executeEditorCommand;
});

describe('toolbar dropdown trigger', () => {
  it('says it opens a menu, and whether it is open', () => {
    mount();
    const button = trigger();
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(button, { detail: 1 });
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('is not a toggle button: it carries no aria-pressed', () => {
    mount();
    expect(trigger().hasAttribute('aria-pressed')).toBe(false);
  });

  it('names itself with what it shows, and keeps the decorative arrow out of the name', () => {
    mount();
    const button = trigger();
    expect(button.querySelector('[aria-hidden="true"]')?.textContent).toBe('▼');
    expect(button.getAttribute('title')).toBe('Block Type');
    expect(button.hasAttribute('aria-label')).toBe(false);
  });
});

describe('opening the menu', () => {
  it('opens a labelled menu of items, with the right roles, when clicked with the mouse', () => {
    mount();
    fireEvent.click(trigger(), { detail: 1 });
    expect(menu()?.getAttribute('aria-label')).toBe('Block Type');
    expect(items().map((item) => item.getAttribute('role'))).toEqual(['menuitemradio', 'menuitemradio', 'menuitemradio']);
    expect(items().map((item) => item.getAttribute('aria-checked'))).toEqual(['false', 'false', 'false']);
  });

  it('leaves the focus where it was for a mouse click, so the editor keeps its selection', () => {
    mount();
    trigger().focus();
    fireEvent.click(trigger(), { detail: 1 });
    expect(document.activeElement).toBe(trigger());
  });

  it('takes the focus into the menu when it is opened with Enter or Space (a click with no pointer)', () => {
    mount();
    fireEvent.click(trigger(), { detail: 0 });
    expect(menu()).not.toBeNull();
    expect(menu()!.contains(document.activeElement)).toBe(true);
    expect(focusedLabel()).toBe('Paragraph');
  });

  it('opens with ArrowDown on the first item and with ArrowUp on the last', () => {
    mount();
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
    expect(focusedLabel()).toBe('Paragraph');
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });

    fireEvent.keyDown(trigger(), { key: 'ArrowUp' });
    expect(focusedLabel()).toBe('Heading 2');
  });

  it('shows no check marks on a menu that does not know the current choice, and uses menuitem', () => {
    mount();
    fireEvent.click(trigger('Font Family' as any), { detail: 0 });
    expect(items().map((item) => item.getAttribute('role'))).toEqual(['menuitem', 'menuitem']);
    expect(items().some((item) => item.hasAttribute('aria-checked'))).toBe(false);
  });
});

describe('moving in the menu', () => {
  const open = () => {
    mount();
    fireEvent.keyDown(trigger(), { key: 'ArrowDown' });
  };

  it('moves with the arrow keys and wraps around at both ends', () => {
    open();
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(focusedLabel()).toBe('Heading 1');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(focusedLabel()).toBe('Heading 2');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(focusedLabel()).toBe('Paragraph');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(focusedLabel()).toBe('Heading 2');
  });

  it('goes to the first and last items with Home and End', () => {
    open();
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(focusedLabel()).toBe('Heading 2');
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(focusedLabel()).toBe('Paragraph');
  });

  it('makes the focused item the choice with Enter, and closes', () => {
    open();
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
    expect(run).toHaveBeenCalledWith('setBlockType', 'h1');
    expect(menu()).toBeNull();
  });

  it('does the same with Space', () => {
    open();
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    fireEvent.keyDown(document.activeElement!, { key: ' ' });
    expect(run).toHaveBeenCalledWith('setBlockType', 'h2');
    expect(menu()).toBeNull();
  });

  it('closes with Escape and gives the focus back to the trigger', () => {
    open();
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(menu()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('closes with Tab, leaving the focus to move on', () => {
    open();
    fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
    expect(menu()).toBeNull();
    expect(run).not.toHaveBeenCalled();
  });

  it('chooses an item with a mouse click as before', () => {
    mount();
    fireEvent.click(trigger(), { detail: 1 });
    fireEvent.click(screen.getByText('Heading 2'));
    expect(run).toHaveBeenCalledWith('setBlockType', 'h2');
    expect(menu()).toBeNull();
  });

  it('ignores other keys', () => {
    open();
    fireEvent.keyDown(document.activeElement!, { key: 'a' });
    expect(menu()).not.toBeNull();
    expect(focusedLabel()).toBe('Paragraph');
  });
});


// Font family, alignment, line height and capitalisation are inline menus: the same menu, a different component.
describe('toolbar inline menus', () => {
  const INLINE = [
    {
      type: 'inline-menu',
      label: 'Text Alignment',
      command: 'setTextAlignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ] as any;
  const mountInline = () => render(<Toolbar editor={editorStub} itemsOverride={INLINE} showMoreOptions={false} />);
  const button = () => screen.getByRole('button', { name: 'Text Alignment' });

  // The menu is placed after it opens; an element that is not visible cannot take focus.
  const rect = { x: 10, y: 10, width: 100, height: 30, top: 10, left: 10, right: 110, bottom: 40, toJSON: () => ({}) } as DOMRect;
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rect);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('says it opens a menu, and names it, on the icon-only trigger', () => {
    mountInline();
    expect(button().getAttribute('aria-haspopup')).toBe('menu');
    expect(button().getAttribute('aria-expanded')).toBe('false');
    expect(button().hasAttribute('aria-pressed')).toBe(false);
  });

  it('opens a labelled menu of menu items with the mouse and leaves the focus alone', () => {
    mountInline();
    button().focus();
    fireEvent.click(button(), { detail: 1 });
    expect(button().getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menu').getAttribute('aria-label')).toBe('Text Alignment');
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual(['Left', 'Center', 'Right']);
    expect(document.activeElement).toBe(button());
  });

  it('opens with ArrowDown on the first item, and with ArrowUp on the last', async () => {
    mountInline();
    fireEvent.keyDown(button(), { key: 'ArrowDown' });
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Left'));
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    fireEvent.keyDown(button(), { key: 'ArrowUp' });
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Right'));
  });

  it('opens with Enter or Space (a click with no pointer) and takes the focus in', async () => {
    mountInline();
    fireEvent.click(button(), { detail: 0 });
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Left'));
  });

  it('moves with the arrow keys, Home and End, and wraps', async () => {
    mountInline();
    fireEvent.keyDown(button(), { key: 'ArrowDown' });
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Left'));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toBe('Center');
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(document.activeElement?.textContent).toBe('Right');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement?.textContent).toBe('Left');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(document.activeElement?.textContent).toBe('Right');
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(document.activeElement?.textContent).toBe('Left');
  });

  it('chooses with Enter, runs the command with the value and closes', async () => {
    mountInline();
    fireEvent.keyDown(button(), { key: 'ArrowDown' });
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('Left'));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
    expect(run).toHaveBeenCalledWith('setTextAlignment', 'center');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes with Escape and gives the focus back to the trigger', async () => {
    mountInline();
    fireEvent.keyDown(button(), { key: 'ArrowDown' });
    await vi.waitFor(() => expect(screen.queryByRole('menu')).not.toBeNull());
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(button());
  });

  it('chooses with a mouse click as before', () => {
    mountInline();
    fireEvent.click(button(), { detail: 1 });
    fireEvent.click(screen.getByText('Right'));
    expect(run).toHaveBeenCalledWith('setTextAlignment', 'right');
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
