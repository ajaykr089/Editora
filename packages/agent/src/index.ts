// Headless core: the document model and tools, usable with any agent.
export { DraftDocument } from './core/draft.js';
export type { DraftBlock, DraftChanges, Selection } from './core/draft.js';
export { createDocumentTools, callTool } from './core/tools.js';
export type { DocumentToolsOptions } from './core/tools.js';
export { AgentToolError } from './core/types.js';
export type { AgentTool, BlockType, DocBlock, JsonSchema, NewBlock, ToolResult } from './core/types.js';

// Any contenteditable element.
export { readEditor, blockText, blockType, hasPendingSuggestions } from './dom/document.js';
export type { EditorSnapshot } from './dom/document.js';
export { commitDraft } from './dom/edits.js';
export type { CommitOptions, CommitResult } from './dom/edits.js';

// The agent loop and tool-calling providers.
export { runAgent, toToolSpecs, DEFAULT_AGENT_SYSTEM } from './core/loop.js';
export type { AgentMessage, AgentProvider, AgentRunResult, AgentStep, ChatRequest, ChatTurn, RunAgentOptions, ToolCall, ToolCallResult, ToolSpec } from './core/loop.js';
export { createOllamaAgentProvider, toOllamaMessages, OLLAMA_LOCAL_URL, OLLAMA_CLOUD_URL, DEFAULT_OLLAMA_AGENT_MODEL } from './providers/ollama.js';
export type { OllamaAgentProviderOptions } from './providers/ollama.js';
export { createOpenAICompatibleAgentProvider, toOpenAIMessages } from './providers/openai.js';
export type { OpenAICompatibleAgentOptions } from './providers/openai.js';
export { createProxyAgentProvider, AGENT_KEY_HEADER } from './providers/proxy.js';
export type { ProxyAgentProviderOptions } from './providers/proxy.js';
export { AgentProviderError } from './providers/http.js';
export type { FetchLike } from './providers/http.js';
