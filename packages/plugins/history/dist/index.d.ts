import { Plugin } from '@rte-editor/core';

/**
 * History plugin for rich text editor.
 * Provides undo/redo functionality with configurable depth.
 */
declare class HistoryPlugin extends Plugin {
    private historyState;
    constructor(options?: {
        depth?: number;
        newGroupDelay?: number;
    });
    private handleTransaction;
}
/**
 * Create a history plugin instance.
 */
declare function createHistoryPlugin(options?: {
    depth?: number;
    newGroupDelay?: number;
}): HistoryPlugin;

export { HistoryPlugin, HistoryPlugin as HistoryPluginType, createHistoryPlugin };
