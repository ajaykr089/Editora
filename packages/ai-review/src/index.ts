// Headless core: works on plain text, in the browser or on a server.
export { tokenize, diffTokens, diffText, opsToChanges, applyChanges, DEFAULT_MAX_EDIT_DISTANCE } from './core/diff';
export type { DiffOp, DiffOpType, TextChange } from './core/diff';
export { AIReview, splitBlocks } from './core/review';
export type { ReviewHunk, HunkStatus, ReviewSnapshot, ReviewListener, ReviewOptions } from './core/review';
export { buildRewritePrompt, cleanModelOutput, REWRITE_PRESETS } from './core/prompt';
export type { RewritePreset, RewritePromptInput, RewritePrompt } from './core/prompt';
export { runRewrite } from './core/run';
export type { RunRewriteOptions } from './core/run';

// Providers.
export { AIProviderError } from './providers/types';
export type { AIProvider, CompletionRequest, FetchLike } from './providers/types';
export {
  createOllamaProvider,
  ollamaLocalCloudTag,
  OLLAMA_CLOUD_MODELS,
  OLLAMA_LOCAL_URL,
  OLLAMA_CLOUD_URL,
  DEFAULT_OLLAMA_MODEL,
} from './providers/ollama';
export type { OllamaProviderOptions, ModelOption } from './providers/ollama';
export { createOpenAICompatibleProvider, OPENAI_COMPATIBLE_PRESETS } from './providers/openai';
export type { OpenAICompatibleProviderOptions, OpenAICompatiblePreset } from './providers/openai';
export { createProxyProvider, CLIENT_KEY_HEADER } from './providers/proxy';
export type { ProxyProviderOptions } from './providers/proxy';

// Any contenteditable element.
export { attachAIReview, DEFAULT_MENU_LABELS } from './dom/attach';
export type { AttachOptions, AIReviewController, MenuLabels } from './dom/attach';
export { createDomReview, DEFAULT_REVIEW_LABELS } from './dom/overlay';
export type { DomReview, DomReviewOptions, ReviewEndInfo, ReviewLabels } from './dom/overlay';
export { htmlWithoutSuggestions } from './dom/marks';
export { targetsForRange, buildTextMap } from './dom/text';
export type { ReviewTarget, TextMap } from './dom/text';
export {
  openSettingsDialog,
  loadSettings,
  saveSettings,
  providerFromSettings,
  DEFAULT_SETTINGS,
} from './dom/settings';
export type { AISettings, ProviderKind, ProxyChoice, UserSettingsConfig } from './dom/settings';
