import { Plugin } from '@rte-editor/core';

/**
 * Heading plugin for rich text editor.
 * Provides heading block functionality (H1-H6).
 */
declare class HeadingPlugin extends Plugin {
    constructor();
}
/**
 * Create a heading plugin instance.
 */
declare function createHeadingPlugin(): HeadingPlugin;

export { HeadingPlugin, createHeadingPlugin };
