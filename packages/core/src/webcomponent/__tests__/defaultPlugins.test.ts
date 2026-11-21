import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { RichTextEditorElement } from '../RichTextEditor';
import { PluginLoader } from '../../config/PluginLoader';
import type { Plugin } from '../../plugins/Plugin';
import { DEFAULT_PLUGINS } from '../defaultPlugins';

// What <editora-editor> loads when it is not told which plugins to use. The registered plugins are
// stand-ins that only record being created, so the test is about the choice, not the plugins.
let created: string[] = [];
let instances: Record<string, Plugin & { __pluginConfig?: unknown }> = {};

// Registered name -> the stand-in's plugin name and toolbar command. Aliases share a plugin name, as
// `formatPainter` / `format-painter` / `formatpainter` do in the real bundle.
const STAND_INS: Record<string, { name: string; command: string }> = {
  bold: { name: 'bold', command: 'toggleBold' },
  italic: { name: 'italic', command: 'toggleItalic' },
  list: { name: 'list', command: 'toggleBulletList' },
  history: { name: 'history', command: 'undo' },
  fontSize: { name: 'fontSize', command: 'fontSize' },
  textColor: { name: 'textColor', command: 'openTextColorPicker' },
  math: { name: 'math', command: 'insertMath' },
  image: { name: 'image', command: 'insertImage' },
  mentions: { name: 'mentions', command: 'insertMention' },
  mention: { name: 'mentions', command: 'insertMention' },
  spellCheck: { name: 'spellCheck', command: 'toggleSpellCheck' },
  a11yChecker: { name: 'a11yChecker', command: 'toggleA11yChecker' },
  formatPainter: { name: 'formatPainter', command: 'toggleFormatPainter' },
  'format-painter': { name: 'formatPainter', command: 'toggleFormatPainter' },
  formatpainter: { name: 'formatPainter', command: 'toggleFormatPainter' },
  collaboration: { name: 'collaboration', command: '' },
};

function makeLoader(extra: Record<string, { name: string; command: string }> = {}) {
  const loader = new PluginLoader();
  for (const [registered, spec] of Object.entries({ ...STAND_INS, ...extra })) {
    loader.register(registered, () => {
      created.push(registered);
      const plugin: Plugin & { __pluginConfig?: unknown } = {
        name: spec.name,
        toolbar: spec.command ? [{ label: spec.name, command: spec.command }] : [],
      };
      instances[registered] = plugin;
      return plugin;
    });
  }
  return loader;
}

async function mount(
  attrs: Record<string, string> = {},
  config?: Record<string, unknown>,
  loader: PluginLoader = makeLoader(),
) {
  (RichTextEditorElement as any).__globalPluginLoader = loader;
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

function toolbarCommands(el: HTMLElement): string[] {
  return Array.from(el.querySelectorAll('.editora-toolbar [data-command]')).map(
    (button) => button.getAttribute('data-command') || '',
  );
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

  it('loads the default set, and only that, when no plugins are named', async () => {
    const el = await mount();
    const registeredDefaults = DEFAULT_PLUGINS.filter((name) => name in STAND_INS);
    expect(created.sort()).toEqual([...registeredDefaults].sort());
    expect(toolbarCommands(el)).toEqual(['toggleBold', 'toggleItalic', 'toggleBulletList', 'undo']);
  });

  it('treats an empty plugins attribute as not naming any', async () => {
    await mount({ plugins: '' });
    expect(created).toContain('bold');
    expect(created).not.toContain('math');
  });

  it('loads the plugins that the toolbar names, by alias or by command', async () => {
    const el = await mount({ toolbar: 'undo | bold bullist | fontSize openTextColorPicker | insertMath' });
    expect(created).toEqual(expect.arrayContaining(['fontSize', 'textColor', 'math']));
    expect(created).not.toContain('mentions');
    expect(toolbarCommands(el)).toEqual([
      'undo',
      'toggleBold',
      'toggleBulletList',
      'fontSize',
      'openTextColorPicker',
      'insertMath',
    ]);
  });

  it('draws the image button for the `image` toolbar name', async () => {
    const el = await mount({ toolbar: 'bold image' });
    expect(created).toContain('image');
    expect(toolbarCommands(el)).toEqual(['toggleBold', 'insertImage']);
  });

  it('loads a plugin once when the toolbar names it more than one way', async () => {
    const el = await mount({ toolbar: 'mention insertMention mentions' });
    expect(created.filter((name) => name === 'mentions' || name === 'mention')).toEqual(['mentions']);
    // `mentions` is the plugin's registered name, not a toolbar name: it loads the plugin, draws no button.
    expect(toolbarCommands(el)).toEqual(['insertMention', 'insertMention']);
  });

  it('follows a toolbar change made after the editor was built', async () => {
    const el = await mount();
    expect(created).not.toContain('fontSize');
    el.setAttribute('toolbar', 'bold fontSize');
    for (let i = 0; i < 40 && !toolbarCommands(el).includes('fontSize'); i++) {
      await new Promise((r) => setTimeout(r, 25));
    }
    expect(toolbarCommands(el)).toEqual(['toggleBold', 'fontSize']);
  });

  it('loads a plugin that has settings under pluginConfig, with those settings', async () => {
    const settings = { trigger: '@', items: [] };
    await mount({}, { pluginConfig: { mentions: settings } });
    expect(created).toContain('mentions');
    expect(instances.mentions.__pluginConfig).toEqual(settings);
    expect(created).not.toContain('mention');
  });

  it('loads the accessibility checker when accessibility.checker is on', async () => {
    await mount({}, { accessibility: { checker: true } });
    expect(created).toContain('a11yChecker');
  });

  it('does not load the spell-check plugin for the spellcheck setting, which is the browser one', async () => {
    await mount({}, { spellcheck: { enabled: true, provider: 'browser' } });
    expect(created).not.toContain('spellCheck');
  });

  it('loads a plugin the page registered itself', async () => {
    await mount({}, undefined, makeLoader({ wordCount: { name: 'wordCount', command: 'showWordCount' } }));
    expect(created).toContain('wordCount');
  });

  it('loads a built-in plugin the page already loaded through the plugin loader', async () => {
    const loader = makeLoader();
    await loader.load('math');
    created = [];
    await mount({}, undefined, loader);
    expect(created).toContain('math');
  });

  it('loads every registered plugin for plugins="all", one instance each, collaboration still left out', async () => {
    const el = await mount({ plugins: 'all' });
    const loadedNames = new Set(created.map((registered) => STAND_INS[registered].name));
    expect([...loadedNames].sort()).toEqual(
      [...new Set(Object.values(STAND_INS).map((spec) => spec.name))].filter((name) => name !== 'collaboration').sort(),
    );
    const commands = toolbarCommands(el);
    expect(commands.filter((command) => command === 'toggleFormatPainter')).toHaveLength(1);
    expect(commands.filter((command) => command === 'insertMention')).toHaveLength(1);
  });

  it('accepts "all" alongside other names, including collaboration', async () => {
    await mount({}, { plugins: ['all', 'collaboration'] });
    expect(created).toContain('math');
    expect(created).toContain('collaboration');
  });

  it('loads exactly the listed plugins when plugins is set, whatever the toolbar names', async () => {
    await mount({ plugins: 'bold italic', toolbar: 'bold italic fontSize' });
    expect(created.sort()).toEqual(['bold', 'italic']);
  });

  it('does not load collaboration by default: it sends the document to a server', async () => {
    await mount();
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
