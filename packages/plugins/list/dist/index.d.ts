import { Plugin } from '@rte-editor/core';

/**
 * List plugin for rich text editor.
 * Provides ordered and unordered list functionality.
 */
declare class ListPlugin extends Plugin {
    constructor();
}
declare function createListPlugin(): ListPlugin;

export { ListPlugin, createListPlugin };
