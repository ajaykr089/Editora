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
