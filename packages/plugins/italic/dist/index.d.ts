import { Plugin } from '@rte-editor/core';

/**
 * Italic plugin for rich text editor.
 * Provides italic text formatting functionality.
 */
declare class ItalicPlugin extends Plugin {
    constructor();
}
/**
 * Create an italic plugin instance.
 */
declare function createItalicPlugin(): ItalicPlugin;

export { ItalicPlugin, ItalicPlugin as ItalicPluginType, createItalicPlugin };
