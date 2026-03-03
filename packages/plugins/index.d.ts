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
