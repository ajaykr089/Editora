// Export all plugins
export { createBoldPlugin } from './bold/src';
export { createItalicPlugin } from './italic/src';
export { createHeadingPlugin } from './heading/src';
export { createParagraphPlugin } from './paragraph/src';
export { createHistoryPlugin } from './history/src';
export { createListPlugin } from './list/src';
export { createBlockquotePlugin } from './blockquote/src';
export { createTablePlugin } from './table/src';
export { createImagePlugin } from './image/src';
export { createLinkPlugin } from './link/src';
export { createCodeBlockPlugin } from './codeblock/src';

// Export plugin classes
export { BoldPlugin } from './bold/src/BoldPlugin';
export { ItalicPlugin } from './italic/src/ItalicPlugin';
export { HeadingPlugin } from './heading/src/HeadingPlugin';
export { ParagraphPlugin } from './paragraph/src/ParagraphPlugin';
export { HistoryPlugin } from './history/src/HistoryPlugin';
export { ListPlugin } from './list/src/ListPlugin';
export { BlockquotePlugin } from './blockquote/src/BlockquotePlugin';
export { TablePlugin } from './table/src/TablePlugin';
export { UnderlinePlugin } from './underline/src/UnderlinePlugin';
export { ImagePlugin } from './image/src/ImagePlugin';
export { LinkPlugin } from './link/src/LinkPlugin';
export { CodeBlockPlugin } from './codeblock/src/CodeBlockPlugin';
export { StrikethroughPlugin } from './strikethrough/src/StrikethroughPlugin';
export { ClearFormattingPlugin } from './clear-formatting/src/ClearFormattingPlugin';
export { MediaManagerPlugin } from './media-manager/src/MediaManagerPlugin';
export { CodePlugin } from './code/src/CodePlugin';
export  { FontSizePlugin, FontSizeProvider } from './font-size/src/index';
export { TextAlignmentPlugin, TextAlignmentProvider } from './text-alignment/src/index';
export { FontFamilyPlugin, FontFamilyProvider } from './font-family/src/index';
export { LineHeightPlugin, LineHeightProvider } from './line-height/src/index';
export { SpecialCharactersPlugin, SpecialCharactersProvider } from './special-characters/src/index';
export { MathPlugin } from './math/src/MathPlugin';
export { DocumentManagerPlugin, DocumentManagerProvider } from './document-manager/src/index';
export { TextColorPlugin } from './text-color/src/TextColorPlugin';
export { CapitalizationPlugin, CapitalizationPluginProvider } from './capitalization/src/index';
export { IndentPlugin } from './indent/src/index';
export { DirectionPlugin } from './direction/src/index';
export { EmbedIframePlugin } from './embed-iframe/src/index';
export { ChecklistPlugin } from './checklist/src/ChecklistPlugin';
export { EmojisPlugin } from './emojis/src/EmojisPlugin';
export { BackgroundColorPlugin } from './background-color/src/BackgroundColorPlugin';
export { PreviewPlugin, PreviewPluginProvider } from "./preview/src/index";
export { FullscreenPlugin, FullscreenPluginProvider, useFullscreen } from './fullscreen/src/index';

// 5 Production-Grade Plugins
export { PrintPlugin } from './print/src/index';
export { PageBreakPlugin, PageBreakPluginProvider } from './page-break/src/index';
export { FootnotePlugin, FootnotePluginProvider } from './footnote/src/index';
export { CodeSamplePlugin, CodeSamplePluginProvider } from './code-sample/src/index';
export { AnchorPlugin, AnchorPluginProvider } from './anchor/src/index';