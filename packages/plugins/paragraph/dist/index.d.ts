import { Plugin } from '@rte-editor/core';

declare class ParagraphPlugin extends Plugin {
    constructor();
}
declare function createParagraphPlugin(): ParagraphPlugin;

export { ParagraphPlugin, createParagraphPlugin };
