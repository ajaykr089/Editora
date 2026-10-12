import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';

// `contextMenu` is a switch for the browser's own right-click menu, not a menu the editor draws: `enabled: false`
// stops the browser menu from opening, anything else leaves it alone. The docs say so; this keeps them honest.

async function rightClick(attrs: Record<string, string> = {}, config?: Record<string, unknown>) {
  const el = document.createElement('editora-editor') as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (config) el.jsConfig = config;
  el.innerHTML = '<p>text</p>';
  document.body.appendChild(el);
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  const content = el.querySelector('.editora-content') as HTMLElement;
  expect(content, 'editor content element').toBeTruthy();

  const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
  content.querySelector('p')!.dispatchEvent(event);
  return {
    browserMenuBlocked: event.defaultPrevented,
    editorMenus: el.querySelectorAll('[role="menu"]').length,
  };
}

describe('contextMenu', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    (RichTextEditorElement as any).__globalPluginLoader = new PluginLoader();
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('leaves the browser menu alone by default, and draws none of its own', async () => {
    expect(await rightClick()).toEqual({ browserMenuBlocked: false, editorMenus: 0 });
  });

  it.each([
    ['context-menu-enabled="true"', { 'context-menu-enabled': 'true' }, undefined],
    ['context-menu=\'{"enabled":true}\'', { 'context-menu': '{"enabled":true}' }, undefined],
    ['setConfig({ contextMenu: true })', {}, { contextMenu: true }],
    ['setConfig({ contextMenu: { enabled: true } })', {}, { contextMenu: { enabled: true } }],
  ])('leaves the browser menu alone for %s', async (_label, attrs, config) => {
    expect((await rightClick(attrs, config)).browserMenuBlocked).toBe(false);
  });

  it.each([
    ['context-menu-enabled="false"', { 'context-menu-enabled': 'false' }, undefined],
    ['context-menu=\'{"enabled":false}\'', { 'context-menu': '{"enabled":false}' }, undefined],
    ['setConfig({ contextMenu: false })', {}, { contextMenu: false }],
    ['setConfig({ contextMenu: { enabled: false } })', {}, { contextMenu: { enabled: false } }],
  ])('blocks the browser menu for %s', async (_label, attrs, config) => {
    expect((await rightClick(attrs, config)).browserMenuBlocked).toBe(true);
  });
});
