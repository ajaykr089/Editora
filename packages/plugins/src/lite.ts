// Lightweight plugin entrypoint for smaller application bundles.
// Heavy/optional plugins remain available via subpath imports.
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
export { AnchorPlugin } from '../anchor/src/index';
export { PageBreakPlugin } from '../page-break/src/index';
export { FootnotePlugin } from '../footnote/src/index';
export { FullscreenPlugin } from '../fullscreen/src/index';
export { PreviewPlugin } from '../preview/src/index';
export { PrintPlugin } from '../print/src/index';

export { setGlobalApiConfig, getGlobalApiConfig, getGlobalApiHeaders, buildApiUrl } from './shared-config';
export type { ApiConfig } from './shared-config';
