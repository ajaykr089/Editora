export { ParagraphPlugin } from '../paragraph/src/ParagraphPlugin';
export { HeadingPlugin } from '../heading/src/HeadingPlugin';
export { BoldPlugin } from '../bold/src/BoldPlugin';
export { ItalicPlugin } from '../italic/src/ItalicPlugin';
export { UnderlinePlugin } from '../underline/src/UnderlinePlugin';
export { ListPlugin } from '../list/src/ListPlugin';
export { HistoryPlugin } from '../history/src/HistoryPlugin';
export { LinkPlugin } from '../link/src/LinkPlugin';
export { StrikethroughPlugin } from '../strikethrough/src/StrikethroughPlugin';
export { BlockquotePlugin } from '../blockquote/src/BlockquotePlugin';
export { ClearFormattingPlugin } from '../clear-formatting/src/ClearFormattingPlugin';
export { TablePlugin } from '../table/src/TablePlugin';
export { MediaManagerPlugin, setMediaManagerConfig, getMediaManagerConfig } from '../media-manager/src/index';
export type { MediaManagerConfig } from '../media-manager/src/index';
export { FontSizePlugin, FontSizeProvider } from '../font-size/src/index';
export { TextAlignmentPlugin, TextAlignmentProvider } from '../text-alignment/src/index';
export { FontFamilyPlugin, FontFamilyProvider } from '../font-family/src/index';
export { MathPlugin, MathProvider } from '../math/src/index';
export { DocumentManagerPlugin, DocumentManagerProvider, setDocumentManagerConfig, getDocumentManagerConfig } from '../document-manager/src/index';
export type { DocumentManagerConfig } from '../document-manager/src/index';

// New plugins
export { TextColorPlugin } from '../text-color/src/index';
export { BackgroundColorPlugin } from '../background-color/src/index';
export { SpecialCharactersPlugin } from '../special-characters/src/index';
export { EmojisPlugin } from '../emojis/src/index';
export { LineHeightPlugin } from '../line-height/src/index';
export { IndentPlugin } from '../indent/src/index';
export { EmbedIframePlugin } from '../embed-iframe/src/index';
export { CapitalizationPlugin } from '../capitalization/src/index';
export { DirectionPlugin } from '../direction/src/index';
export { CodePlugin } from '../code/src/index';
export { ChecklistPlugin } from '../checklist/src/index';
export { PreviewPlugin, PreviewPluginProvider } from "../preview/src/index";

// Shared API configuration for all plugins
export { setGlobalApiConfig, getGlobalApiConfig, getGlobalApiHeaders, buildApiUrl } from './shared-config';
export type { ApiConfig } from './shared-config';
