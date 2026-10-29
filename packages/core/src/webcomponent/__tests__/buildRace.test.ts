import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';
import type { Plugin } from '../../plugins/Plugin';

// initialize() is async (plugins load on demand), and several things start a build: connecting the element,
// observed attributes during the upgrade, setConfig(), attribute changes. Builds used to overlap and the last
// one to finish loading won, so a setConfig() made during the first build was silently undone.

const plugin = (name: string, command: string): Plugin => ({
  name,
  toolbar: [{ label: name, command }],
  commands: { [command]: () => true },
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let ready: string[][];

function create(attrs: Record<string, string>): any {
  const el = document.createElement('editora-editor') as any;
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  el.addEventListener('editor-ready', () => ready.push(el.loadedPlugins.map((p: Plugin) => p.name)));
  return el;
}

const commands = (el: HTMLElement) => Array.from(el.querySelectorAll('[data-command]')).map((b) => (b as HTMLElement).dataset.command);

describe('<editora-editor> overlapping builds', () => {
  beforeAll(() => {
    (document as any).execCommand ??= () => false;
    if (!customElements.get('editora-editor')) customElements.define('editora-editor', RichTextEditorElement);
  });

  beforeEach(() => {
    ready = [];
    const loader = new PluginLoader();
    // A plugin that takes a while to load, like a lazily imported chunk over the network.
    loader.register('slow', async () => {
      await sleep(80);
      return plugin('slow', 'slowCommand');
    });
    loader.register('quick', () => plugin('quick', 'quickCommand'));
    (RichTextEditorElement as any).__globalPluginLoader = loader;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('keeps a setConfig() made while the first build is still loading', async () => {
    const el = create({ plugins: 'slow' });
    document.body.appendChild(el);
    await el.setConfig({ plugins: [plugin('fromConfig', 'configCommand')], toolbar: 'configCommand' });
    await sleep(250);

    expect(el.loadedPlugins.map((p: Plugin) => p.name)).toEqual(['fromConfig']);
    expect(commands(el)).toEqual(['configCommand']);
    expect(ready).toEqual([['fromConfig']]);
  });

  // The common page setup: markup first, the script (which defines the element) after it, then setConfig().
  it('keeps a setConfig() made right after the element is upgraded in the page', async () => {
    const tag = `race-editor-${Math.random().toString(36).slice(2)}`;
    document.body.innerHTML = `<${tag} plugins="slow"><p>Hello</p></${tag}>`;
    const el = document.querySelector(tag) as any;
    customElements.define(tag, class extends RichTextEditorElement {});
    el.addEventListener('editor-ready', () => ready.push(el.loadedPlugins.map((p: Plugin) => p.name)));
    await el.setConfig({ plugins: [plugin('fromConfig', 'configCommand')], toolbar: 'configCommand' });
    await sleep(250);

    expect(el.loadedPlugins.map((p: Plugin) => p.name)).toEqual(['fromConfig']);
    expect(commands(el)).toEqual(['configCommand']);
    expect(ready).toEqual([['fromConfig']]);
    expect(el.querySelector('.editora-content').innerHTML).toContain('Hello');
  });

  it('builds once when it is connected, even though the upgrade also reports its attributes', async () => {
    document.body.innerHTML = '<editora-editor plugins="quick"><p>Hello</p></editora-editor>';
    const el = document.querySelector('editora-editor') as any;
    el.addEventListener('editor-ready', () => ready.push(el.loadedPlugins.map((p: Plugin) => p.name)));
    await sleep(150);

    expect(ready).toEqual([['quick']]);
    expect(el.querySelectorAll('.editora-content')).toHaveLength(1);
    expect(el.querySelector('.editora-content').innerHTML).toContain('Hello');
  });

  it('uses the latest plugins attribute when it changes during a build', async () => {
    const el = create({ plugins: 'slow' });
    document.body.appendChild(el);
    await sleep(10);
    el.setAttribute('plugins', 'quick');
    await sleep(250);

    expect(el.loadedPlugins.map((p: Plugin) => p.name)).toEqual(['quick']);
    expect(commands(el)).toEqual(['quickCommand']);
    expect(ready.at(-1)).toEqual(['quick']);
  });

  it('does not build into an element that was removed while it was loading', async () => {
    const el = create({ plugins: 'slow' });
    document.body.appendChild(el);
    await sleep(10);
    el.remove();
    await sleep(200);

    expect(ready).toEqual([]);
    expect(el.querySelector('.editora-toolbar')).toBeNull();
  });

  it('still rebuilds normally for a setConfig() after the editor is ready', async () => {
    const el = create({ plugins: 'quick' });
    document.body.appendChild(el);
    await sleep(100);
    await el.setConfig({ plugins: [plugin('later', 'laterCommand')], toolbar: 'laterCommand' });
    await sleep(50);

    expect(commands(el)).toEqual(['laterCommand']);
    expect(ready.at(-1)).toEqual(['later']);
  });
});
