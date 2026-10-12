import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';
import { resetIgnoredOptionWarnings, warnIgnoredOption } from '../../config/deprecatedOptions';

// `menubar` is accepted but nothing renders a menu bar. The editor says so once, when a page actually asks
// for one, and does not claim to have one in its resolved configuration.

async function mount(attrs: Record<string, string> = {}, config?: Record<string, unknown>) {
  const el = document.createElement('editora-editor') as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (config) el.jsConfig = config;
  document.body.appendChild(el);
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  expect(el.querySelector('.editora-content'), 'editor content element').toBeTruthy();
  return el;
}

describe('menubar', () => {
  let warn: { mock: { calls: unknown[][] }; mockRestore(): void };

  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    (RichTextEditorElement as any).__globalPluginLoader = new PluginLoader();
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  beforeEach(() => {
    resetIgnoredOptionWarnings();
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    document.body.innerHTML = '';
  });

  const menubarWarnings = () => warn.mock.calls.filter(([message]) => String(message).includes('"menubar"'));

  it('warns once per option, and again for a different one', () => {
    warnIgnoredOption('menubar', 'There is no menu bar.');
    warnIgnoredOption('menubar', 'There is no menu bar.');
    warnIgnoredOption('other', 'Nothing uses it.');
    expect(warn).toHaveBeenCalledTimes(2);
    expect(String(warn.mock.calls[0][0])).toContain('The "menubar" option has no effect');
    expect(String(warn.mock.calls[0][0])).toContain('There is no menu bar.');
  });

  it.each([['menubar', ''], ['menubar', 'true'], ['menubar', '{"enabled":true,"items":["file"]}']])(
    'warns for the %s attribute written as "%s"',
    async (name, value) => {
      await mount({ [name]: value });
      expect(menubarWarnings()).toHaveLength(1);
    },
  );

  it.each([[true], [{ enabled: true, items: ['file', 'edit'] }], [{}]])(
    'warns for menubar passed to setConfig as %j',
    async (menubar) => {
      await mount({}, { menubar });
      expect(menubarWarnings()).toHaveLength(1);
    },
  );

  it('says nothing when no menu bar is asked for', async () => {
    await mount();
    await mount({ menubar: 'false' });
    await mount({}, { menubar: false });
    await mount({}, { menubar: { enabled: false } });
    expect(menubarWarnings()).toHaveLength(0);
  });

  it('says it once however many editors ask', async () => {
    await mount({ menubar: 'true' });
    await mount({ menubar: 'true' });
    await mount({}, { menubar: true });
    expect(menubarWarnings()).toHaveLength(1);
  });

  it('does not report a menu bar in the resolved configuration unless one was requested', async () => {
    const el = await mount();
    expect(el.getAPI().getConfig().menubar).toBe(false);
  });

  it('renders no menu bar even when one is requested', async () => {
    const el = await mount({ menubar: 'true' });
    expect(el.querySelector('[role="menubar"], [class*="menubar"]')).toBeNull();
  });
});
