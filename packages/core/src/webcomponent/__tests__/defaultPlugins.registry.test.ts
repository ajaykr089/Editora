import { beforeAll, describe, expect, it } from 'vitest';
import { BUILT_IN_PLUGIN_REGISTRY } from '../builtInPlugins';
import { BUILT_IN_PLUGIN_NAMES, DEFAULT_PLUGINS, TOOLBAR_COMMAND_PLUGINS, pluginsForToolbarItems } from '../defaultPlugins';
import { TOOLBAR_ITEM_ALIASES } from '../../ui/ToolbarRenderer';

// The default plugin set relies on two hand-kept lists: the built-in plugin names, and which plugin each
// toolbar command belongs to. These tests load the real plugins and check both lists against them, so a
// new plugin or a renamed command fails here instead of quietly missing from a bare editor's toolbar.
// The `code` plugin needs @editora/light-code-editor built (CI builds before it tests).

type LoadedPlugin = { name: string; toolbar?: Array<{ command?: string }> };
const loaded = new Map<string, LoadedPlugin>();

describe('built-in plugin lists', () => {
  beforeAll(async () => {
    (document as any).execCommand ??= () => false;
    for (const [name, factory] of Object.entries(BUILT_IN_PLUGIN_REGISTRY)) {
      loaded.set(name, await factory());
    }
  }, 120_000);

  it('BUILT_IN_PLUGIN_NAMES lists exactly the names the full bundle registers', () => {
    expect([...BUILT_IN_PLUGIN_NAMES].sort()).toEqual(Object.keys(BUILT_IN_PLUGIN_REGISTRY).sort());
  });

  it('the default set is made of built-in plugins', () => {
    for (const name of DEFAULT_PLUGINS) expect(BUILT_IN_PLUGIN_NAMES.has(name), name).toBe(true);
  });

  it('maps every toolbar command of every built-in plugin to a name that loads that plugin', () => {
    const missing: string[] = [];
    for (const plugin of loaded.values()) {
      for (const item of plugin.toolbar ?? []) {
        if (!item.command) continue;
        const target = TOOLBAR_COMMAND_PLUGINS[item.command];
        if (!target || loaded.get(target)?.name !== plugin.name) {
          missing.push(`${item.command} (${plugin.name}) -> ${target ?? 'nothing'}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('maps no command that no built-in plugin has', () => {
    const commands = new Set(
      [...loaded.values()].flatMap((plugin) => (plugin.toolbar ?? []).map((item) => item.command)),
    );
    const stale = Object.keys(TOOLBAR_COMMAND_PLUGINS).filter((command) => !commands.has(command));
    expect(stale).toEqual([]);
  });

  it('resolves each toolbar alias whose command exists to the plugin that has it', () => {
    const isRegistered = (name: string) => BUILT_IN_PLUGIN_NAMES.has(name);
    for (const [alias, command] of Object.entries(TOOLBAR_ITEM_ALIASES)) {
      const owner = TOOLBAR_COMMAND_PLUGINS[command];
      if (!owner) continue;
      expect(pluginsForToolbarItems(alias, isRegistered), alias).toEqual([owner]);
    }
  });
});
