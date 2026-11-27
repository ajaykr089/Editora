import { describe, expect, it } from 'vitest';
import { KeyboardShortcutManager } from '../KeyboardShortcuts';

// Shortcuts were matched on `event.key` only. With Shift held a digit key reports its symbol, so Cmd/Ctrl+Shift+8
// (bullet list) arrived as "*" and Cmd/Ctrl+Shift+7 (numbered list) as "&", and neither ever ran.

function press(manager: KeyboardShortcutManager, init: KeyboardEventInit) {
  const ran: string[] = [];
  manager.handleKeyDown(new KeyboardEvent('keydown', { cancelable: true, ...init }), (command) => { ran.push(command); });
  return ran;
}

const mod = /Mac|iPhone|iPad/.test(navigator.platform) ? { metaKey: true } : { ctrlKey: true };

describe('KeyboardShortcutManager', () => {
  const manager = new KeyboardShortcutManager();

  it('runs the list shortcuts, whose keys type a symbol with Shift held', () => {
    expect(press(manager, { ...mod, shiftKey: true, key: '*', code: 'Digit8' })).toEqual(['toggleBulletList']);
    expect(press(manager, { ...mod, shiftKey: true, key: '&', code: 'Digit7' })).toEqual(['toggleOrderedList']);
  });

  it('still matches the character first, and leaves unmodified keys alone', () => {
    expect(press(manager, { ...mod, key: 'b', code: 'KeyB' })).toEqual(['toggleBold']);
    expect(press(manager, { shiftKey: true, key: '*', code: 'Digit8' })).toEqual([]);
  });

  // On Windows and Linux, AltGr arrives as Ctrl+Alt with the character it types. Matching its key cap instead made
  // AltGr+7 on a German keyboard ("{") the paragraph shortcut (Ctrl+Alt+7) and AltGr+E ("€") the code block one.
  it('lets AltGr type its characters', () => {
    const pc = new KeyboardShortcutManager();
    (pc as any).isMac = false;
    expect(press(pc, { ctrlKey: true, altKey: true, key: '{', code: 'Digit7' })).toEqual([]);
    expect(press(pc, { ctrlKey: true, altKey: true, key: '€', code: 'KeyE' })).toEqual([]);
    expect(press(pc, { ctrlKey: true, altKey: true, key: 'ę', code: 'KeyE' })).toEqual([]);
    // Ctrl+Alt on a layout where it types nothing still runs the shortcut.
    expect(press(pc, { ctrlKey: true, altKey: true, key: '7', code: 'Digit7' })).toEqual(['setBlockType']);
    expect(press(pc, { ctrlKey: true, altKey: true, key: 'e', code: 'KeyE' })).toEqual(['insertCodeBlock']);
  });
});

// The editors used only the built-in list: a plugin's `keymap` never ran, and a built-in key was blocked even when no
// loaded plugin had its command (Cmd/Ctrl+P did not print, Cmd+[ did not go back).
describe('KeyboardShortcutManager with plugin keymaps', () => {
  const event = (init: KeyboardEventInit) => new KeyboardEvent('keydown', { cancelable: true, ...init });

  it('runs keymap entries: a command, a command with its argument, and a function', () => {
    const manager = new KeyboardShortcutManager({ defaults: false });
    manager.registerKeymap({
      'Mod-Shift-x': 'toggleStrikethrough',
      'Mod-Shift-l': { command: 'setTextAlignment', params: 'left' },
      'Mod-Enter': () => true,
    });
    const ran: unknown[] = [];
    const run = (init: KeyboardEventInit) => {
      const e = event(init);
      const handled = manager.handleKeyDown(e, (command, params) => { ran.push(params === undefined ? command : [command, params]); });
      return [handled, e.defaultPrevented];
    };
    expect(run({ ...mod, shiftKey: true, key: 'X', code: 'KeyX' })).toEqual([true, true]);
    expect(run({ ...mod, shiftKey: true, key: 'L', code: 'KeyL' })).toEqual([true, true]);
    expect(run({ ...mod, key: 'Enter', code: 'Enter' })).toEqual([true, true]);
    expect(ran).toEqual(['toggleStrikethrough', ['setTextAlignment', 'left']]);
  });

  it('has no built-in keys when asked not to', () => {
    const manager = new KeyboardShortcutManager({ defaults: false });
    expect(manager.getAllShortcuts()).toEqual([]);
    expect(press(manager, { ...mod, key: 'b', code: 'KeyB' })).toEqual([]);
  });

  it('leaves the key to the browser when nothing runs', () => {
    const manager = new KeyboardShortcutManager({ defaults: false });
    manager.registerKeymap({ 'Mod-p': 'print', 'Mod-k': 'openLinkDialog', Escape: () => false });
    // No loaded plugin has the command.
    const print = event({ ...mod, key: 'p', code: 'KeyP' });
    expect(manager.handleKeyDown(print, () => true, () => false)).toBe(false);
    expect(print.defaultPrevented).toBe(false);
    // The command ran but did nothing.
    const link = event({ ...mod, key: 'k', code: 'KeyK' });
    expect(manager.handleKeyDown(link, () => false)).toBe(false);
    expect(link.defaultPrevented).toBe(false);
    // A keymap function said it did nothing.
    const escape = event({ key: 'Escape', code: 'Escape' });
    expect(manager.handleKeyDown(escape, () => true)).toBe(false);
    expect(escape.defaultPrevented).toBe(false);
  });

  it('leaves alone a key a plugin already handled', () => {
    const manager = new KeyboardShortcutManager({ defaults: false });
    manager.registerKeymap({ 'Mod-b': 'toggleBold' });
    const e = event({ ...mod, key: 'b', code: 'KeyB' });
    e.preventDefault();
    const ran: string[] = [];
    expect(manager.handleKeyDown(e, (command) => { ran.push(command); })).toBe(false);
    expect(ran).toEqual([]);
  });

  it('reads punctuation keys by the key cap, as Shift changes the character', () => {
    const manager = new KeyboardShortcutManager({ defaults: false });
    manager.registerKeymap({ 'Mod-Shift-.': 'toggleBlockquote', 'Mod-Shift-;': 'openEmojiDialog', 'Mod-/': 'openSlashCommands' });
    expect(press(manager, { ...mod, shiftKey: true, key: '>', code: 'Period' })).toEqual(['toggleBlockquote']);
    expect(press(manager, { ...mod, shiftKey: true, key: ':', code: 'Semicolon' })).toEqual(['openEmojiDialog']);
    expect(press(manager, { ...mod, key: '/', code: 'Slash' })).toEqual(['openSlashCommands']);
  });

  it('reads Mod as Cmd on a Mac and Ctrl elsewhere, and names of keys', () => {
    const mac = new KeyboardShortcutManager({ defaults: false });
    (mac as any).isMac = true;
    mac.registerKeymap({ 'Mod-Alt-Shift-ArrowLeft': 'setDirectionLTR', 'Ctrl-Space': 'x', F7: 'toggleSpellCheck' });
    expect(press(mac, { metaKey: true, altKey: true, shiftKey: true, key: 'ArrowLeft', code: 'ArrowLeft' })).toEqual(['setDirectionLTR']);
    expect(press(mac, { ctrlKey: true, altKey: true, shiftKey: true, key: 'ArrowLeft', code: 'ArrowLeft' })).toEqual([]);
    expect(press(mac, { ctrlKey: true, key: ' ', code: 'Space' })).toEqual(['x']);
    expect(press(mac, { key: 'F7', code: 'F7' })).toEqual(['toggleSpellCheck']);
  });
});
