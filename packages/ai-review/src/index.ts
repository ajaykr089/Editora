// Headless core: works on plain text, in the browser or on a server.
export { tokenize, diffTokens, diffText, opsToChanges, applyChanges, DEFAULT_MAX_EDIT_DISTANCE } from './core/diff.js';
export type { DiffOp, DiffOpType, TextChange } from './core/diff.js';
export { AIReview, splitBlocks } from './core/review.js';
export type { ReviewHunk, HunkStatus, ReviewSnapshot, ReviewListener, ReviewOptions } from './core/review.js';
export { buildRewritePrompt, cleanModelOutput, REWRITE_PRESETS } from './core/prompt.js';
export type { RewritePreset, RewritePromptInput, RewritePrompt } from './core/prompt.js';
export { runRewrite } from './core/run.js';
export type { RunRewriteOptions } from './core/run.js';

// Providers.
export { AIProviderError } from './providers/types.js';
export type { AIProvider, CompletionRequest, FetchLike } from './providers/types.js';
export {
  createOllamaProvider,
  ollamaLocalCloudTag,
  OLLAMA_CLOUD_MODELS,
  OLLAMA_LOCAL_URL,
  OLLAMA_CLOUD_URL,
  DEFAULT_OLLAMA_MODEL,
} from './providers/ollama.js';
export type { OllamaProviderOptions, ModelOption } from './providers/ollama.js';
export { createOpenAICompatibleProvider, OPENAI_COMPATIBLE_PRESETS } from './providers/openai.js';
export type { OpenAICompatibleProviderOptions, OpenAICompatiblePreset } from './providers/openai.js';
export { createProxyProvider, CLIENT_KEY_HEADER } from './providers/proxy.js';
export type { ProxyProviderOptions } from './providers/proxy.js';

// Any contenteditable element.
export { attachAIReview, DEFAULT_MENU_LABELS } from './dom/attach.js';
export type { AttachOptions, AIReviewController, MenuLabels } from './dom/attach.js';
export { createDomReview, DEFAULT_REVIEW_LABELS } from './dom/overlay.js';
export type { DomReview, DomReviewOptions, ReviewEndInfo, ReviewLabels } from './dom/overlay.js';
export { htmlWithoutSuggestions } from './dom/marks.js';
export { targetsForRange, buildTextMap, textBlocks, BLOCK_SELECTOR } from './dom/text.js';
export type { ReviewTarget, TextMap } from './dom/text.js';
export {
  openSettingsDialog,
  loadSettings,
  saveSettings,
  providerFromSettings,
  DEFAULT_SETTINGS,
  OLLAMA_CLOUD_CHOICE,
  proxyChoicesFor,
  defaultSettingsFor,
  isOllamaRunning,
} from './dom/settings.js';
export type { AISettings, ProviderKind, ProxyChoice, UserSettingsConfig } from './dom/settings.js';
