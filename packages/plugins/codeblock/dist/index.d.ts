import { Plugin } from '@rte-editor/core';

declare class CodeBlockPlugin extends Plugin {
    constructor();
}
declare function createCodeBlockPlugin(): CodeBlockPlugin;

export { CodeBlockPlugin, createCodeBlockPlugin };
