import React from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { EditoraEditor } from '../index';

// The React editor ran only the core's fixed list of shortcuts: a plugin's `keymap` never ran, and a key on the list
// was blocked even with no plugin for it, so Cmd/Ctrl+P did nothing at all.

if (!(globalThis as any).ResizeObserver) {
  (globalThis as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
}

const ran: unknown[] = [];
const strike = {
  name: 'strike',
  commands: { toggleStrikethrough: () => { ran.push('toggleStrikethrough'); return true; } },
  keymap: { 'Mod-Shift-x': 'toggleStrikethrough' },
};

const mod = /Mac|iPhone|iPad/.test(navigator.platform) ? { metaKey: true } : { ctrlKey: true };

function press(content: HTMLElement, init: KeyboardEventInit) {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  content.dispatchEvent(event);
  return event.defaultPrevented;
}

beforeEach(() => {
  ran.length = 0;
});

afterEach(() => {
  cleanup();
});

describe('<EditoraEditor> keyboard shortcuts', () => {
  it("runs the plugins' keymaps and leaves the browser the keys no plugin uses", async () => {
    const { container } = render(<EditoraEditor defaultValue="<p>Hi</p>" plugins={[strike as any]} />);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const content = container.querySelector('.rte-content') as HTMLElement;

    expect(press(content, { ...mod, shiftKey: true, key: 'X', code: 'KeyX' })).toBe(true);
    expect(ran).toEqual(['toggleStrikethrough']);

    expect(press(content, { ...mod, key: 'p', code: 'KeyP' })).toBe(false); // print
    // No bold plugin: the browser must not bold the text itself either.
    expect(press(content, { ...mod, key: 'b', code: 'KeyB' })).toBe(true);
    expect(ran).toEqual(['toggleStrikethrough']);
  });
});
