import type { Plugin } from '@editora/core';

/**
 * The lifecycle hooks `PluginManager.register()` runs, for a plugin that was only listed so far
 * (see RichTextEditor: init is deferred while server-rendered HTML is being hydrated).
 */
export function runPluginInitHooks(plugin: Plugin): void {
  if (plugin.initialize) {
    try {
      plugin.initialize(plugin.config);
    } catch (error) {
      console.error(`Failed to initialize plugin "${plugin.name}":`, error);
    }
  }
  if (plugin.init && plugin.init !== plugin.initialize) {
    try {
      plugin.init(plugin.config);
    } catch (error) {
      console.error(`Failed to run init hook for plugin "${plugin.name}":`, error);
    }
  }
}
