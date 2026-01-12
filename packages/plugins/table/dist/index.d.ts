import { Plugin } from '@rte-editor/core';

/**
 * Table plugin for rich text editor.
 * Provides advanced table functionality with custom node views.
 */
declare class TablePlugin extends Plugin {
    constructor();
}
declare function createTablePlugin(): TablePlugin;

export { TablePlugin, createTablePlugin };
