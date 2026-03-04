import type { Plugin } from "@editora/core";

export interface ApiConfig {
  apiUrl: string;
  headers?: Record<string, string>;
}

export type MediaManagerConfig = Record<string, unknown>;
export type DocumentManagerConfig = Record<string, unknown>;

export interface MergeTagItem {
  key?: string;
  label: string;
  category?: string;
  preview?: string;
  description?: string;
  value?: string;
}

export interface MergeTagCategory {
  id?: string;
  name: string;
  tags: MergeTagItem[];
}

export interface MergeTagDialogOptions {
  title?: string;
  searchPlaceholder?: string;
  emptyStateText?: string;
  cancelText?: string;
  insertText?: string;
  showPreview?: boolean;
}

export interface MergeTagPluginOptions {
  tags?: MergeTagItem[];
  categories?: MergeTagCategory[];
  defaultCategory?: string;
  dialog?: MergeTagDialogOptions;
  tokenTemplate?: string | ((tag: MergeTagItem & { key: string; category: string }) => string);
}

export interface TrackChangesPluginOptions {
  author?: string;
  enabledByDefault?: boolean;
  includeTimestamp?: boolean;
}

export type VersionDiffMode = "word" | "line";

export interface VersionDiffLabels {
  title?: string;
  baseline?: string;
  current?: string;
  noChanges?: string;
  loading?: string;
  tabInline?: string;
  tabSideBySide?: string;
  refresh?: string;
  setBaseline?: string;
  close?: string;
  mode?: string;
  ignoreWhitespace?: string;
  largeDocFallback?: string;
}

export interface VersionDiffOpenArgs {
  baselineHtml?: string;
  mode?: VersionDiffMode;
  ignoreWhitespace?: boolean;
}

export interface VersionDiffPluginOptions {
  baselineHtml?: string;
  getBaselineHtml?: (context: { editor: HTMLElement; editorRoot: HTMLElement }) => string | Promise<string>;
  mode?: VersionDiffMode;
  ignoreWhitespace?: boolean;
  maxTokens?: number;
  maxMatrixSize?: number;
  labels?: VersionDiffLabels;
}

export interface ConditionalContentLabels {
  dialogTitleInsert?: string;
  dialogTitleEdit?: string;
  conditionLabel?: string;
  conditionPlaceholder?: string;
  audienceLabel?: string;
  audiencePlaceholder?: string;
  localeLabel?: string;
  localePlaceholder?: string;
  elseLabel?: string;
  saveText?: string;
  cancelText?: string;
  blockIfLabel?: string;
  blockElseLabel?: string;
  allAudiencesText?: string;
  allLocalesText?: string;
}

export interface ConditionalBlockConfig {
  condition?: string;
  audience?: string[];
  locale?: string[];
  hasElse?: boolean;
}

export interface ConditionalContentDialogArgs extends ConditionalBlockConfig {
  target?: "insert" | "edit";
}

export interface ConditionalContentPluginOptions {
  defaultCondition?: string;
  defaultAudience?: string[];
  defaultLocale?: string[];
  enableElseByDefault?: boolean;
  labels?: ConditionalContentLabels;
  context?: Record<string, unknown> | (() => Record<string, unknown>);
  getContext?: (context: { editor: HTMLElement; editorRoot: HTMLElement }) => Record<string, unknown> | Promise<Record<string, unknown>>;
  currentAudience?: string | string[];
  currentLocale?: string | string[];
  evaluateCondition?: (condition: string, context: Record<string, unknown>) => boolean;
}

export type DataBindingFormat = "text" | "number" | "currency" | "date" | "json";

export interface DataBindingLabels {
  dialogTitleInsert?: string;
  dialogTitleEdit?: string;
  keyLabel?: string;
  keyPlaceholder?: string;
  fallbackLabel?: string;
  fallbackPlaceholder?: string;
  formatLabel?: string;
  currencyLabel?: string;
  currencyPlaceholder?: string;
  saveText?: string;
  cancelText?: string;
  previewOnText?: string;
  previewOffText?: string;
  tokenAriaPrefix?: string;
}

export interface DataBindingTokenConfig {
  key: string;
  fallback?: string;
  format?: DataBindingFormat;
  currency?: string;
}

export interface DataBindingDialogArgs extends Partial<DataBindingTokenConfig> {
  target?: "insert" | "edit";
}

export interface DataBindingApiRequestContext {
  editor: HTMLElement;
  editorRoot: HTMLElement;
  signal: AbortSignal;
}

export interface DataBindingApiConfig {
  url: string;
  method?: string;
  headers?: Record<string, string> | ((ctx: DataBindingApiRequestContext) => Record<string, string>);
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
  params?: Record<string, string> | ((ctx: DataBindingApiRequestContext) => Record<string, string>);
  body?:
    | Record<string, unknown>
    | BodyInit
    | ((ctx: DataBindingApiRequestContext) => Record<string, unknown> | BodyInit | undefined);
  buildRequest?: (ctx: DataBindingApiRequestContext) => { url: string; init?: RequestInit };
  responseType?: "json" | "text";
  responsePath?: string;
  transformResponse?: (response: unknown, ctx: DataBindingApiRequestContext) => Record<string, unknown>;
  timeoutMs?: number;
  onError?: (error: unknown, ctx: DataBindingApiRequestContext) => void;
}

export interface DataBindingPluginOptions {
  data?: Record<string, unknown> | (() => Record<string, unknown> | Promise<Record<string, unknown>>);
  getData?: (context: { editor: HTMLElement; editorRoot: HTMLElement }) => Record<string, unknown> | Promise<Record<string, unknown>>;
  api?: DataBindingApiConfig;
  cacheTtlMs?: number;
  labels?: DataBindingLabels;
  defaultFormat?: DataBindingFormat;
  defaultFallback?: string;
  locale?: string;
  numberFormatOptions?: Intl.NumberFormatOptions;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
}

export type ContentRulesSeverity = "error" | "warning" | "info";

export interface ContentRuleIssue {
  id: string;
  ruleId: string;
  severity: ContentRulesSeverity;
  message: string;
  excerpt?: string;
  suggestion?: string;
  locateText?: string;
  selector?: string;
}

export interface ContentRulesLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  runAuditText?: string;
  realtimeOnText?: string;
  realtimeOffText?: string;
  closeText?: string;
  noIssuesText?: string;
  summaryPrefix?: string;
  locateText?: string;
  bannedWordMessage?: string;
  requiredHeadingMessage?: string;
  sentenceLengthMessage?: string;
  readabilityMessage?: string;
}

export interface ContentRulesContext {
  editor: HTMLElement;
  editorRoot: HTMLElement;
  text: string;
  html: string;
  wordCount: number;
  sentenceCount: number;
  readabilityScore: number;
}

export interface ContentRuleDefinition {
  id: string;
  severity?: ContentRulesSeverity;
  evaluate: (context: ContentRulesContext) => ContentRuleIssue[] | Promise<ContentRuleIssue[]>;
}

export interface ContentRulesPluginOptions {
  bannedWords?: string[];
  requiredHeadings?: string[];
  maxSentenceWords?: number;
  minReadabilityScore?: number;
  maxIssues?: number;
  debounceMs?: number;
  enableRealtime?: boolean;
  labels?: ContentRulesLabels;
  normalizeText?: (value: string) => string;
  customRules?: ContentRuleDefinition[];
}

export type CitationStyle = "apa" | "mla" | "chicago";

export interface CitationRecord {
  id: string;
  author: string;
  year?: string;
  title: string;
  source?: string;
  url?: string;
  note?: string;
}

export interface CitationInput {
  id?: string;
  author: string;
  year?: string;
  title: string;
  source?: string;
  url?: string;
  note?: string;
}

export interface CitationsLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  styleLabel?: string;
  authorLabel?: string;
  yearLabel?: string;
  titleLabel?: string;
  sourceLabel?: string;
  urlLabel?: string;
  noteLabel?: string;
  insertText?: string;
  refreshText?: string;
  closeText?: string;
  bibliographyTitle?: string;
  footnotesTitle?: string;
  noCitationsText?: string;
  styleButtonPrefix?: string;
  recentHeading?: string;
  deleteRecentText?: string;
  summaryPrefix?: string;
  invalidMessage?: string;
}

export interface CitationsPluginOptions {
  defaultStyle?: CitationStyle;
  enableFootnoteSync?: boolean;
  debounceMs?: number;
  maxRecentCitations?: number;
  labels?: CitationsLabels;
  normalizeText?: (value: string) => string;
  generateCitationId?: (context: { editor: HTMLElement; index: number }) => string;
}

export type ApprovalStatus = "draft" | "review" | "approved";

export interface ApprovalComment {
  id: string;
  author: string;
  message: string;
  kind: "comment" | "system";
  createdAt: string;
}

export interface ApprovalSignoff {
  id: string;
  author: string;
  comment?: string;
  createdAt: string;
}

export interface ApprovalWorkflowState {
  status: ApprovalStatus;
  locked: boolean;
  comments: ApprovalComment[];
  signoffs: ApprovalSignoff[];
  updatedAt: string;
}

export interface ApprovalWorkflowLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  statusLabel?: string;
  statusDraftText?: string;
  statusReviewText?: string;
  statusApprovedText?: string;
  requestReviewText?: string;
  approveText?: string;
  reopenDraftText?: string;
  addCommentText?: string;
  actorLabel?: string;
  actorPlaceholder?: string;
  commentLabel?: string;
  commentPlaceholder?: string;
  closeText?: string;
  commentsHeading?: string;
  signoffsHeading?: string;
  noCommentsText?: string;
  noSignoffsText?: string;
  summaryPrefix?: string;
  lockedSuffix?: string;
  shortcutText?: string;
  approveCommentRequiredText?: string;
}

export interface ApprovalWorkflowPluginOptions {
  defaultStatus?: ApprovalStatus;
  lockOnApproval?: boolean;
  maxHistoryEntries?: number;
  requireCommentOnApprove?: boolean;
  defaultActor?: string;
  labels?: ApprovalWorkflowLabels;
  normalizeText?: (value: string) => string;
}

export type PIIRedactionType = "email" | "phone" | "ssn" | "credit-card" | "ipv4" | "api-key" | "jwt";
export type PIIRedactionSeverity = "high" | "medium" | "low";
export type PIIRedactionMode = "token" | "mask";

export interface PIIFinding {
  id: string;
  type: PIIRedactionType;
  severity: PIIRedactionSeverity;
  match: string;
  masked: string;
  occurrence: number;
  excerpt?: string;
  suggestion?: string;
}

export interface PIIRedactionStats {
  total: number;
  high: number;
  medium: number;
  low: number;
  redactedCount: number;
  byType: Record<PIIRedactionType, number>;
}

export interface PIIRedactionLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  scanText?: string;
  redactAllText?: string;
  redactText?: string;
  locateText?: string;
  realtimeOnText?: string;
  realtimeOffText?: string;
  closeText?: string;
  noFindingsText?: string;
  summaryPrefix?: string;
  shortcutText?: string;
  readonlyRedactionText?: string;
  matchLabel?: string;
  maskedLabel?: string;
  excerptLabel?: string;
}

export interface PIIRedactionDetectorConfig {
  enabled?: boolean;
  severity?: PIIRedactionSeverity;
  pattern?: RegExp;
}

export interface PIIRedactionPluginOptions {
  enableRealtime?: boolean;
  debounceMs?: number;
  maxFindings?: number;
  maskChar?: string;
  revealStart?: number;
  revealEnd?: number;
  redactionMode?: PIIRedactionMode;
  redactionToken?: string;
  detectors?: Partial<Record<PIIRedactionType, boolean | PIIRedactionDetectorConfig>>;
  labels?: PIIRedactionLabels;
  normalizeText?: (value: string) => string;
  skipInCodeBlocks?: boolean;
}

export type SmartPasteProfile = "fidelity" | "balanced" | "plain";
export type SmartPasteSource = "word" | "google-docs" | "html" | "plain";

export interface SmartPasteLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  enabledText?: string;
  disabledText?: string;
  toggleOnText?: string;
  toggleOffText?: string;
  cycleProfileText?: string;
  profileLabel?: string;
  fidelityText?: string;
  balancedText?: string;
  plainText?: string;
  lastPasteHeading?: string;
  lastPasteEmptyText?: string;
  lastPasteSourceLabel?: string;
  lastPasteProfileLabel?: string;
  lastPasteRemovedLabel?: string;
  lastPasteCharsLabel?: string;
  closeText?: string;
  shortcutText?: string;
  readonlyMessage?: string;
}

export interface SmartPasteProfileOptions {
  keepStyles?: boolean;
  keepClasses?: boolean;
  keepDataAttributes?: boolean;
  preserveTables?: boolean;
}

export interface SmartPastePluginOptions {
  enabled?: boolean;
  defaultProfile?: SmartPasteProfile;
  maxHtmlLength?: number;
  removeComments?: boolean;
  normalizeWhitespace?: boolean;
  profileOptions?: Partial<Record<SmartPasteProfile, SmartPasteProfileOptions>>;
  labels?: SmartPasteLabels;
  normalizeText?: (value: string) => string;
}

export interface SmartPasteReport {
  source: SmartPasteSource;
  profile: SmartPasteProfile;
  inputHtmlLength: number;
  outputHtmlLength: number;
  outputTextLength: number;
  removedElements: number;
  removedAttributes: number;
  removedComments: number;
  normalizedStyles: number;
  createdAt: string;
}

export interface MentionItem {
  id: string;
  label: string;
  value?: string;
  meta?: string;
}

export interface MentionApiRequestContext {
  query: string;
  trigger: string;
  limit: number;
  signal: AbortSignal;
}

export interface MentionApiConfig {
  url: string;
  method?: string;
  headers?: Record<string, string> | ((ctx: MentionApiRequestContext) => Record<string, string>);
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
  queryParam?: string;
  triggerParam?: string;
  limitParam?: string;
  staticParams?: Record<string, string>;
  body?: Record<string, unknown> | BodyInit | ((ctx: MentionApiRequestContext) => Record<string, unknown> | BodyInit | undefined);
  buildRequest?: (ctx: MentionApiRequestContext) => { url: string; init?: RequestInit };
  responseType?: "json" | "text";
  responsePath?: string;
  mapItem?: (raw: unknown, index: number) => MentionItem | null;
  transformResponse?: (response: unknown, ctx: MentionApiRequestContext) => MentionItem[];
  debounceMs?: number;
  timeoutMs?: number;
  onError?: (error: unknown, ctx: MentionApiRequestContext) => void;
}

export interface MentionPluginOptions {
  triggerChars?: string[];
  minChars?: number;
  maxQueryLength?: number;
  maxSuggestions?: number;
  items?: MentionItem[];
  api?: MentionApiConfig;
  search?: (query: string, trigger: string) => MentionItem[] | Promise<MentionItem[]>;
  itemRenderer?: (item: MentionItem, query: string) => string;
  emptyStateText?: string;
  noResultsText?: string;
  loadingText?: string;
  insertSpaceAfterMention?: boolean;
}

export interface SlashCommandActionContext {
  editor: HTMLElement;
  editorRoot: HTMLElement;
  query: string;
  trigger: string;
  executeCommand: (command: string, value?: any) => boolean;
  insertHTML: (html: string) => boolean;
}

export interface SlashCommandItem {
  id: string;
  label: string;
  description?: string;
  keywords?: string[];
  command?: string;
  commandValue?: any;
  insertHTML?: string;
  action?: (context: SlashCommandActionContext) => boolean | void | Promise<boolean | void>;
}

export interface SlashCommandsPluginOptions {
  triggerChar?: string;
  minChars?: number;
  maxQueryLength?: number;
  maxSuggestions?: number;
  requireBoundary?: boolean;
  includeDefaultItems?: boolean;
  items?: SlashCommandItem[];
  itemRenderer?: (item: SlashCommandItem, query: string) => string;
  emptyStateText?: string;
  panelLabel?: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  html: string;
  description?: string;
  preview?: string;
  tags?: string[];
}

export function HeadingPlugin(): Plugin;
export function BoldPlugin(): Plugin;
export function ItalicPlugin(): Plugin;
export function UnderlinePlugin(): Plugin;
export function StrikethroughPlugin(): Plugin;
export function ListPlugin(): Plugin;
export function ChecklistPlugin(): Plugin;
export function HistoryPlugin(): Plugin;
export function LinkPlugin(): Plugin;
export function BlockquotePlugin(): Plugin;
export function ClearFormattingPlugin(): Plugin;
export function CodePlugin(): Plugin;
export function TablePlugin(): Plugin;
export function FontSizePlugin(): Plugin;
export function FontFamilyPlugin(): Plugin;
export function TextAlignmentPlugin(): Plugin;
export function TextColorPlugin(): Plugin;
export function BackgroundColorPlugin(): Plugin;
export function LineHeightPlugin(): Plugin;
export function IndentPlugin(): Plugin;
export function DirectionPlugin(): Plugin;
export function CapitalizationPlugin(): Plugin;
export function MathPlugin(): Plugin;
export function SpecialCharactersPlugin(): Plugin;
export function EmojisPlugin(): Plugin;
export function EmbedIframePlugin(): Plugin;
export function AnchorPlugin(): Plugin;
export function MentionPlugin(options?: MentionPluginOptions): Plugin;
export function TrackChangesPlugin(options?: TrackChangesPluginOptions): Plugin;
export function VersionDiffPlugin(options?: VersionDiffPluginOptions): Plugin;
export function ConditionalContentPlugin(options?: ConditionalContentPluginOptions): Plugin;
export function DataBindingPlugin(options?: DataBindingPluginOptions): Plugin;
export function ContentRulesPlugin(options?: ContentRulesPluginOptions): Plugin;
export function CitationsPlugin(options?: CitationsPluginOptions): Plugin;
export function ApprovalWorkflowPlugin(options?: ApprovalWorkflowPluginOptions): Plugin;
export function PIIRedactionPlugin(options?: PIIRedactionPluginOptions): Plugin;
export function SmartPastePlugin(options?: SmartPastePluginOptions): Plugin;
export function SlashCommandsPlugin(options?: SlashCommandsPluginOptions): Plugin;

export function MediaManagerPlugin(): Plugin;
export function setMediaManagerConfig(config: Partial<MediaManagerConfig>): void;
export function getMediaManagerConfig(): MediaManagerConfig;

export function DocumentManagerPlugin(): Plugin;
export function setDocumentManagerConfig(config: Partial<DocumentManagerConfig>): void;
export function getDocumentManagerConfig(): DocumentManagerConfig;

export function PreviewPlugin(): Plugin;
export function FullscreenPlugin(): Plugin;
export function PrintPlugin(): Plugin;
export function PageBreakPlugin(): Plugin;
export function FootnotePlugin(): Plugin;
export function CodeSamplePlugin(): Plugin;
export function MergeTagPlugin(options?: MergeTagPluginOptions): Plugin;
export function TemplatePlugin(): Plugin;
export const PREDEFINED_TEMPLATES: Template[];
export function addCustomTemplate(template: Template): boolean;
export function getAllTemplates(): Template[];
export function getTemplatesByCategory(category: string): Template[];
export function getTemplateCategories(): string[];
export function searchTemplates(query: string): Template[];
export function sanitizeTemplate(html: string): string;
export function validateTemplate(template: Template): boolean;
export function CommentsPlugin(): Plugin;
export function SpellCheckPlugin(): Plugin;
export function A11yCheckerPlugin(): Plugin;

export function setGlobalApiConfig(config: Partial<ApiConfig>): void;
export function getGlobalApiConfig(): ApiConfig;
export function getGlobalApiHeaders(): Record<string, string>;
export function buildApiUrl(baseUrl: string, path: string): string;
