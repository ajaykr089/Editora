import { Plugin } from '@rte-editor/core';

declare class ImagePlugin extends Plugin {
    constructor(options?: {
        uploadUrl?: string;
        maxSize?: number;
    });
}
declare function createImagePlugin(options?: {
    uploadUrl?: string;
    maxSize?: number;
}): ImagePlugin;

export { ImagePlugin, createImagePlugin };
