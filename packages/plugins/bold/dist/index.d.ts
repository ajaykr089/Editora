import { Plugin } from '@rte-editor/core';

/**
 * Bold plugin for rich text editor.
 * Provides bold text formatting functionality.
 */
declare class BoldPlugin extends Plugin {
    constructor();
}
/**
 * Create a bold plugin instance.
 */
declare function createBoldPlugin(): BoldPlugin;

export { BoldPlugin, BoldPlugin as BoldPluginType, createBoldPlugin };
