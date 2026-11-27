import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';
import type { Plugin } from '../../plugins/Plugin';

// <editora-editor> ran only a fixed list of shortcuts. A plugin's `keymap` never ran (Mod+Shift+X strikethrough,
// Mod+Enter page break, Mod+Shift+S source view and 70 more did nothing), and a key on the fixed list was blocked
// even with no plugin for it, so Cmd/Ctrl+P did not print and Cmd+[ did not go back.

const ran: unknown[] = [];

function makeLoader() {
  const loader = new PluginLoader();
  loader.register('strike', (): Plugin => ({
    name: 'strike',
    commands: { toggleStrikethrough: () => { ran.push('toggleStrikethrough'); return true; } },
    keymap: { 'Mod-Shift-x': 'toggleStrikethrough' },
  }));
  loader.register('align', (): Plugin => ({
    name: 'align',
    commands: { setTextAlignment: (value: unknown) => { ran.push(['setTextAlignment', value]); return true; } },
    keymap: { 'Mod-Shift-r': { command: 'setTextAlignment', params: 'right' } },
  }));
  loader.register('escape', (): Plugin => ({
    name: 'escape',
    keymap: { Escape: (_event: unknown, context: any) => { ran.push(['Escape', context?.editorElement?.tagName]); return false; } },
  }));
  return loader;
}

const mod = /Mac|iPhone|iPad/.test(navigator.platform) ? { metaKey: true } : { ctrlKey: true };

async function mount(plugins: string[]) {
  const el = document.createElement('editora-editor') as any;
  el.jsConfig = { plugins };
  document.body.appendChild(el);
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const content = el.querySelector('.editora-content') as HTMLElement;
  expect(content, 'editor content element').toBeTruthy();
  return content;
}

function press(content: HTMLElement, init: KeyboardEventInit) {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  content.dispatchEvent(event);
  return event.defaultPrevented;
}

describe('<editora-editor> keyboard shortcuts', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    (RichTextEditorElement as any).__globalPluginLoader = makeLoader();
    if (!customElements.get('editora-editor')) customElements.define('editora-editor', RichTextEditorElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    ran.length = 0;
  });

  it("runs the loaded plugins' keymaps", async () => {
    const content = await mount(['strike', 'align', 'escape']);
    expect(press(content, { ...mod, shiftKey: true, key: 'X', code: 'KeyX' })).toBe(true);
    expect(press(content, { ...mod, shiftKey: true, key: 'R', code: 'KeyR' })).toBe(true);
    // A keymap function gets the editor, and returning false leaves the key to the browser.
    expect(press(content, { key: 'Escape', code: 'Escape' })).toBe(false);
    expect(ran).toEqual(['toggleStrikethrough', ['setTextAlignment', 'right'], ['Escape', 'EDITORA-EDITOR']]);
  });

  it('leaves the browser its keys when no loaded plugin uses them', async () => {
    const content = await mount(['strike']);
    expect(press(content, { ...mod, key: 'p', code: 'KeyP' })).toBe(false); // print
    expect(press(content, { ...mod, key: 'd', code: 'KeyD' })).toBe(false); // bookmark
    expect(press(content, { ...mod, key: '[', code: 'BracketLeft' })).toBe(false); // back, on a Mac
    expect(ran).toEqual([]);
  });

  it('keeps the browser from formatting text itself with Mod+B, I and U when no plugin does', async () => {
    const content = await mount(['strike']);
    expect(press(content, { ...mod, key: 'b', code: 'KeyB' })).toBe(true);
    expect(press(content, { ...mod, key: 'i', code: 'KeyI' })).toBe(true);
    expect(press(content, { ...mod, key: 'u', code: 'KeyU' })).toBe(true);
    expect(ran).toEqual([]);
  });
});
