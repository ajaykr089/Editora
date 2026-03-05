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
export {
  MentionPlugin,
  type MentionItem,
  type MentionPluginOptions,
  type MentionApiConfig,
  type MentionApiRequestContext,
} from '../mentions/src/index';
export { TrackChangesPlugin, type TrackChangesPluginOptions } from '../track-changes/src/index';
export {
  VersionDiffPlugin,
  type VersionDiffMode,
  type VersionDiffLabels,
  type VersionDiffPluginOptions,
  type VersionDiffOpenArgs,
} from '../version-diff/src/index';
export {
  ConditionalContentPlugin,
  type ConditionalContentPluginOptions,
  type ConditionalContentLabels,
  type ConditionalBlockConfig,
  type ConditionalContentDialogArgs,
} from '../conditional-content/src/index';
export {
  DataBindingPlugin,
  type DataBindingPluginOptions,
  type DataBindingTokenConfig,
  type DataBindingDialogArgs,
  type DataBindingFormat,
  type DataBindingApiConfig,
  type DataBindingApiRequestContext,
  type DataBindingLabels,
} from '../data-binding/src/index';
export {
  ContentRulesPlugin,
  type ContentRulesPluginOptions,
  type ContentRuleIssue,
  type ContentRulesSeverity,
  type ContentRulesLabels,
  type ContentRulesContext,
  type ContentRuleDefinition,
} from '../content-rules/src/index';
export {
  CitationsPlugin,
  type CitationStyle,
  type CitationRecord,
  type CitationInput,
  type CitationsLabels,
  type CitationsPluginOptions,
} from '../citations/src/index';
export {
  ApprovalWorkflowPlugin,
  type ApprovalStatus,
  type ApprovalComment,
  type ApprovalSignoff,
  type ApprovalWorkflowState,
  type ApprovalWorkflowLabels,
  type ApprovalWorkflowPluginOptions,
} from '../approval-workflow/src/index';
export {
  PIIRedactionPlugin,
  type PIIRedactionType,
  type PIIRedactionSeverity,
  type PIIFinding,
  type PIIRedactionStats,
  type PIIRedactionLabels,
  type PIIRedactionDetectorConfig,
  type PIIRedactionPluginOptions,
} from '../pii-redaction/src/index';
export {
  SmartPastePlugin,
  type SmartPasteProfile,
  type SmartPasteSource,
  type SmartPasteLabels,
  type SmartPasteProfileOptions,
  type SmartPastePluginOptions,
  type SmartPasteReport,
} from '../smart-paste/src/index';
export {
  BlocksLibraryPlugin,
  type BlocksLibraryItem,
  type BlocksLibraryItemInput,
  type BlocksLibraryLabels,
  type BlocksLibraryRequestContext,
  type BlocksLibraryPluginOptions,
  type BlocksLibraryRuntimeState,
} from '../blocks-library/src/index';
export {
  DocSchemaPlugin,
  type DocSchemaIssueType,
  type DocSchemaIssueSeverity,
  type DocSchemaIssue,
  type DocSchemaSection,
  type DocSchemaDefinition,
  type DocSchemaLabels,
  type DocSchemaPluginOptions,
  type DocSchemaRuntimeState,
} from '../doc-schema/src/index';
export {
  TranslationWorkflowPlugin,
  type TranslationWorkflowIssueType,
  type TranslationWorkflowIssueSeverity,
  type TranslationWorkflowIssue,
  type TranslationWorkflowSegment,
  type TranslationWorkflowSegmentState,
  type TranslationWorkflowLocaleRule,
  type TranslationWorkflowLabels,
  type TranslationWorkflowPluginOptions,
  type TranslationWorkflowRuntimeState,
} from '../translation-workflow/src/index';
export {
  SlashCommandsPlugin,
  type SlashCommandsPluginOptions,
  type SlashCommandItem,
  type SlashCommandActionContext,
} from '../slash-commands/src/index';
export { PageBreakPlugin } from '../page-break/src/index';
export { FootnotePlugin } from '../footnote/src/index';
export { FullscreenPlugin } from '../fullscreen/src/index';
export { PreviewPlugin } from '../preview/src/index';
export { PrintPlugin } from '../print/src/index';

export { setGlobalApiConfig, getGlobalApiConfig, getGlobalApiHeaders, buildApiUrl } from './shared-config';
export type { ApiConfig } from './shared-config';
