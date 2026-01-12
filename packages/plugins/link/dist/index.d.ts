import { Plugin } from '@rte-editor/core';

declare class LinkPlugin extends Plugin {
    constructor();
}
declare function createLinkPlugin(): LinkPlugin;

export { LinkPlugin, createLinkPlugin };
