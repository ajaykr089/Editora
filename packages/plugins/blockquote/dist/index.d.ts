import { Plugin } from '@rte-editor/core';

declare class BlockquotePlugin extends Plugin {
    constructor();
}
declare function createBlockquotePlugin(): BlockquotePlugin;

export { BlockquotePlugin, createBlockquotePlugin };
