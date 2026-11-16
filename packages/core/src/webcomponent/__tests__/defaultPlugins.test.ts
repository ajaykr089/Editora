import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';
import type { Plugin } from '../../plugins/Plugin';

// What <editora-editor> loads when it is not told which plugins to use. The registered plugins are
// stand-ins that only record being created, so the test is about the choice, not the plugins.
let created: string[] = [];
let instances: Record<string, Plugin & { __pluginConfig?: unknown }> = {};

function makeLoader() {
  const loader = new PluginLoader();
  for (const name of ['bold', 'italic', 'collaboration']) {
    loader.register(name, () => {
      created.push(name);
      const plugin: Plugin & { __pluginConfig?: unknown } = { name };
      instances[name] = plugin;
      return plugin;
    });
  }
  return loader;
}

async function mount(attrs: Record<string, string> = {}, config?: Record<string, unknown>) {
  (RichTextEditorElement as any).__globalPluginLoader = makeLoader();
  const el = document.createElement('editora-editor') as any;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (config) el.jsConfig = config;
  document.body.appendChild(el);
  // connectedCallback -> waitForPluginLoader -> setTimeout(initialize)
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  expect(el.querySelector('.editora-content'), 'editor content element').toBeTruthy();
  return el;
}

describe('<editora-editor> default plugin set', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  beforeEach(() => {
    created = [];
    instances = {};
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('loads the ordinary plugins when no plugins are named', async () => {
    await mount();
    expect(created).toEqual(expect.arrayContaining(['bold', 'italic']));
  });

  it('does not load collaboration by default: it sends the document to a server', async () => {
    await mount();
    expect(created).not.toContain('collaboration');
  });

  it('still leaves it out when the plugins attribute is empty', async () => {
    await mount({ plugins: '' });
    expect(created).not.toContain('collaboration');
  });

  it('loads collaboration when it is named in the plugins attribute', async () => {
    await mount({ plugins: 'bold collaboration' });
    expect(created).toContain('collaboration');
  });

  it('loads collaboration when it is named in a plugins array', async () => {
    await mount({}, { plugins: ['bold', 'collaboration'] });
    expect(created).toContain('collaboration');
  });

  it('loads collaboration, with its settings, when they are configured and no plugins are named', async () => {
    const settings = { websocketUrl: 'wss://collab.example.com', roomName: 'proposal-42' };
    await mount({}, { pluginConfig: { collaboration: settings } });

    expect(created).toContain('collaboration');
    expect(instances.collaboration.__pluginConfig).toEqual(settings);
  });

  it('does not treat a setting for another plugin as a reason to load collaboration', async () => {
    await mount({}, { pluginConfig: { bold: { anything: true } } });
    expect(created).not.toContain('collaboration');
  });
});
