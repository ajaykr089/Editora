import { describe, expect, it } from 'vitest';
import { KeyboardShortcutManager } from '../KeyboardShortcuts';

// Shortcuts were matched on `event.key` only. With Shift held a digit key reports its symbol, so Cmd/Ctrl+Shift+8
// (bullet list) arrived as "*" and Cmd/Ctrl+Shift+7 (numbered list) as "&", and neither ever ran.

function press(manager: KeyboardShortcutManager, init: KeyboardEventInit) {
  const ran: string[] = [];
  manager.handleKeyDown(new KeyboardEvent('keydown', { cancelable: true, ...init }), (command) => ran.push(command));
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
