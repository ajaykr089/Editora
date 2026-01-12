import { Plugin } from '@rte-editor/core';

/**
 * Bold plugin for rich text editor.
 * Provides bold text formatting functionality.
 */
declare class BoldPlugin extends Plugin {
    constructor();
}
/**
 * Create a bold plugin instance.
 */
declare function createBoldPlugin(): BoldPlugin;

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

declare class ParagraphPlugin extends Plugin {
    constructor();
}
declare function createParagraphPlugin(): ParagraphPlugin;

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

/**
 * List plugin for rich text editor.
 * Provides ordered and unordered list functionality.
 */
declare class ListPlugin extends Plugin {
    constructor();
}
declare function createListPlugin(): ListPlugin;

declare class BlockquotePlugin extends Plugin {
    constructor();
}
declare function createBlockquotePlugin(): BlockquotePlugin;

/**
 * Table plugin for rich text editor.
 * Provides advanced table functionality with custom node views.
 */
declare class TablePlugin extends Plugin {
    constructor();
}
declare function createTablePlugin(): TablePlugin;

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

declare class LinkPlugin extends Plugin {
    constructor();
}
declare function createLinkPlugin(): LinkPlugin;

declare class CodeBlockPlugin extends Plugin {
    constructor();
}
declare function createCodeBlockPlugin(): CodeBlockPlugin;

export { BlockquotePlugin, BoldPlugin, CodeBlockPlugin, HeadingPlugin, HistoryPlugin, ImagePlugin, ItalicPlugin, LinkPlugin, ListPlugin, ParagraphPlugin, TablePlugin, createBlockquotePlugin, createBoldPlugin, createCodeBlockPlugin, createHeadingPlugin, createHistoryPlugin, createImagePlugin, createItalicPlugin, createLinkPlugin, createListPlugin, createParagraphPlugin, createTablePlugin };
