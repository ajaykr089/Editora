// Native plugins (27 total - no React dependencies)
// ParagraphPlugin removed - paragraph option now in HeadingPlugin dropdown
export { HeadingPlugin } from '../heading/src/index';
export { BoldPlugin } from '../bold/src/index';
export { ItalicPlugin } from '../italic/src/index';
export { UnderlinePlugin } from '../underline/src/index';
export { StrikethroughPlugin } from '../strikethrough/src/index';
export { ListPlugin } from '../list/src/index';
export { ChecklistPlugin } from '../checklist/src/index';
export { HistoryPlugin } from '../history/src/index';
export { LinkPlugin } from '../link/src/index';
export { BlockquotePlugin } from '../blockquote/src/index';
export { ClearFormattingPlugin } from '../clear-formatting/src/index';
export { CodePlugin } from '../code/src/index';
export { TablePlugin } from '../table/src/index';
export { FontSizePlugin } from '../font-size/src/index';
export { FontFamilyPlugin } from '../font-family/src/index';
export { TextAlignmentPlugin } from '../text-alignment/src/index';
export { TextColorPlugin } from '../text-color/src/index';
export { BackgroundColorPlugin } from '../background-color/src/index';
export { LineHeightPlugin } from '../line-height/src/index';
export { IndentPlugin } from '../indent/src/index';
export { DirectionPlugin } from '../direction/src/index';
export { CapitalizationPlugin } from '../capitalization/src/index';
export { MathPlugin } from '../math/src/index';
export { SpecialCharactersPlugin } from '../special-characters/src/index';
export { EmojisPlugin } from '../emojis/src/index';
export { EmbedIframePlugin } from '../embed-iframe/src/index';
export { AnchorPlugin } from '../anchor/src/index';

// Regular plugins (with React components - 13 total)
export { MediaManagerPlugin, setMediaManagerConfig, getMediaManagerConfig } from '../media-manager/src/index';
export type { MediaManagerConfig } from '../media-manager/src/index';
export { DocumentManagerPlugin, setDocumentManagerConfig, getDocumentManagerConfig } from '../document-manager/src/index';
export type { DocumentManagerConfig } from '../document-manager/src/index';
export { PreviewPlugin } from "../preview/src/index";
export { FullscreenPlugin } from '../fullscreen/src/index';
export { PrintPlugin } from '../print/src/index';
export { PageBreakPlugin } from '../page-break/src/index';
export { FootnotePlugin } from '../footnote/src/index';
export { CodeSamplePlugin } from '../code-sample/src/index';
export { MergeTagPlugin } from '../merge-tag/src/index';
export { TemplatePlugin } from '../template/src/index';
export { CommentsPlugin } from '../comments/src/index';
export { SpellCheckPlugin } from '../spell-check/src/index';
export { A11yCheckerPlugin } from '../a11y-checker/src/index';

// Shared API configuration for all plugins
export { setGlobalApiConfig, getGlobalApiConfig, getGlobalApiHeaders, buildApiUrl } from './shared-config';
export type { ApiConfig } from './shared-config';
