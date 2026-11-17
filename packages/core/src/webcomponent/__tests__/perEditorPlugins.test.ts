import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';
import type { Plugin } from '../../plugins/Plugin';

// Two <editora-editor> elements on one page share the page's plugin registry. Each must still get
// its own plugin instances, configured from its own pluginConfig: a plugin that keeps per-instance
// state (collaboration's claim on an editor, its room) would otherwise serve only the first editor.
type Recorded = Plugin & { __pluginConfig?: any; inits: HTMLElement[] };
let created: Recorded[] = [];

function makeLoader() {
  const loader = new PluginLoader();
  loader.register('roomy', () => {
    const plugin: Recorded = {
      name: 'roomy',
      inits: [],
      init(context?: { editorElement?: HTMLElement }) {
        if (context?.editorElement) plugin.inits.push(context.editorElement);
      },
    };
    created.push(plugin);
    return plugin;
  });
  return loader;
}

async function mount(room: string) {
  const el = document.createElement('editora-editor') as any;
  el.jsConfig = { plugins: ['roomy'], pluginConfig: { roomy: { room } } };
  document.body.appendChild(el);
  await waitForBuild(el);
  return el;
}

async function waitForBuild(el: HTMLElement) {
  for (let i = 0; i < 40 && !el.querySelector('.editora-content'); i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  expect(el.querySelector('.editora-content'), 'editor content element').toBeTruthy();
}

function pluginOf(el: any): Recorded {
  return el.loadedPlugins.find((p: Plugin) => p.name === 'roomy');
}

describe('<editora-editor> plugin instances', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }
  });

  beforeEach(() => {
    created = [];
    (RichTextEditorElement as any).__globalPluginLoader = makeLoader();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('gives a second editor, mounted after the first is ready, its own instance and config', async () => {
    const a = await mount('room-a');
    const b = await mount('room-b');

    expect(created).toHaveLength(2);
    expect(pluginOf(a)).not.toBe(pluginOf(b));
    expect(pluginOf(a).__pluginConfig).toEqual({ room: 'room-a' });
    expect(pluginOf(b).__pluginConfig).toEqual({ room: 'room-b' });
    expect(pluginOf(a).inits).toEqual([a]);
    expect(pluginOf(b).inits).toEqual([b]);
  });

  it('keeps the same instance when one editor rebuilds, with its new config', async () => {
    const a = await mount('room-a');
    const first = pluginOf(a);

    await a.setConfig({ plugins: ['roomy'], pluginConfig: { roomy: { room: 'room-a2' } } });
    await waitForBuild(a);

    expect(created).toHaveLength(1);
    expect(pluginOf(a)).toBe(first);
    expect(first.__pluginConfig).toEqual({ room: 'room-a2' });
  });
});
