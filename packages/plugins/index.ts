// Export native plugins only
export { BoldPlugin } from './bold/src';
export { ItalicPlugin } from './italic/src';
export { HeadingPlugin } from './heading/src';
export { HistoryPlugin } from './history/src';
export { ListPlugin } from './list/src';
export { BlockquotePlugin } from './blockquote/src';
export { TablePlugin } from './table/src';
export { LinkPlugin } from './link/src';
export { UnderlinePlugin } from './underline/src';
export { StrikethroughPlugin } from './strikethrough/src';
export { ClearFormattingPlugin } from './clear-formatting/src';
export { MediaManagerPlugin } from './media-manager/src';
export { CodePlugin } from './code/src';
export { FontSizePlugin } from './font-size/src';
export { TextAlignmentPlugin } from './text-alignment/src';
export { FontFamilyPlugin } from './font-family/src';
export { LineHeightPlugin } from './line-height/src';
export { SpecialCharactersPlugin } from './special-characters/src';
export { MathPlugin } from './math/src';
export { DocumentManagerPlugin } from './document-manager/src';
export { TextColorPlugin } from './text-color/src';
export { CapitalizationPlugin } from './capitalization/src';
export { IndentPlugin } from './indent/src';
export { DirectionPlugin } from './direction/src';
export { EmbedIframePlugin } from './embed-iframe/src';
export { ChecklistPlugin } from './checklist/src';
export { EmojisPlugin } from './emojis/src';
export { BackgroundColorPlugin } from './background-color/src';
export {
  MentionPlugin,
  type MentionItem,
  type MentionPluginOptions,
  type MentionApiConfig,
  type MentionApiRequestContext,
} from './mentions/src';
export { TrackChangesPlugin, type TrackChangesPluginOptions } from './track-changes/src';
export {
  VersionDiffPlugin,
  type VersionDiffMode,
  type VersionDiffLabels,
  type VersionDiffPluginOptions,
  type VersionDiffOpenArgs,
} from './version-diff/src';
export {
  ConditionalContentPlugin,
  type ConditionalContentPluginOptions,
  type ConditionalContentLabels,
  type ConditionalBlockConfig,
  type ConditionalContentDialogArgs,
} from './conditional-content/src';
export {
  DataBindingPlugin,
  type DataBindingPluginOptions,
  type DataBindingTokenConfig,
  type DataBindingDialogArgs,
  type DataBindingFormat,
  type DataBindingApiConfig,
  type DataBindingApiRequestContext,
  type DataBindingLabels,
} from './data-binding/src';
export {
  ContentRulesPlugin,
  type ContentRulesPluginOptions,
  type ContentRuleIssue,
  type ContentRulesSeverity,
  type ContentRulesLabels,
  type ContentRulesContext,
  type ContentRuleDefinition,
} from './content-rules/src';
export {
  CitationsPlugin,
  type CitationStyle,
  type CitationRecord,
  type CitationInput,
  type CitationsLabels,
  type CitationsPluginOptions,
} from './citations/src';
export {
  ApprovalWorkflowPlugin,
  type ApprovalStatus,
  type ApprovalComment,
  type ApprovalSignoff,
  type ApprovalWorkflowState,
  type ApprovalWorkflowLabels,
  type ApprovalWorkflowPluginOptions,
} from './approval-workflow/src';
export {
  PIIRedactionPlugin,
  type PIIRedactionType,
  type PIIRedactionSeverity,
  type PIIFinding,
  type PIIRedactionStats,
  type PIIRedactionLabels,
  type PIIRedactionDetectorConfig,
  type PIIRedactionPluginOptions,
} from './pii-redaction/src';
export {
  SmartPastePlugin,
  type SmartPasteProfile,
  type SmartPasteSource,
  type SmartPasteLabels,
  type SmartPasteProfileOptions,
  type SmartPastePluginOptions,
  type SmartPasteReport,
} from './smart-paste/src';
export {
  BlocksLibraryPlugin,
  type BlocksLibraryItem,
  type BlocksLibraryItemInput,
  type BlocksLibraryLabels,
  type BlocksLibraryRequestContext,
  type BlocksLibraryPluginOptions,
  type BlocksLibraryRuntimeState,
} from './blocks-library/src';
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
} from './doc-schema/src';
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
} from './translation-workflow/src';
export {
  SlashCommandsPlugin,
  type SlashCommandsPluginOptions,
  type SlashCommandItem,
  type SlashCommandActionContext,
} from './slash-commands/src';
export { PreviewPlugin } from './preview/src';
export { FullscreenPlugin } from './fullscreen/src';

// 5 Production-Grade Plugins (First Batch)
export { PrintPlugin } from './print/src';
export { PageBreakPlugin } from './page-break/src';
export { FootnotePlugin } from './footnote/src';
export { CodeSamplePlugin } from './code-sample/src';
export { AnchorPlugin } from './anchor/src';
// 5 Enterprise Plugins (Second Batch)
export {
  MergeTagPlugin,
  type MergeTagItem,
  type MergeTagCategory,
  type MergeTagDialogOptions,
  type MergeTagPluginOptions,
} from './merge-tag/src';
export {
  TemplatePlugin,
  PREDEFINED_TEMPLATES,
  addCustomTemplate,
  getAllTemplates,
  getTemplatesByCategory,
  getTemplateCategories,
  searchTemplates,
  sanitizeTemplate,
  validateTemplate,
  type Template,
} from './template/src';
export { CommentsPlugin } from './comments/src';
export { SpellCheckPlugin } from './spell-check/src';
export { A11yCheckerPlugin } from './a11y-checker/src';
