/**
 * Lightweight Code Editor Library
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

// Import CSS styles for self-contained library
import './styles/editor.css';

import { EditorCore } from './EditorCore';
import { KeymapExtension } from './extensions/KeymapExtension';
import { TransactionExtension } from './extensions/TransactionExtension';

// Main exports
export { EditorCore } from './EditorCore';
export { TextModel } from './TextModel';
export { View } from './View';

// Extensions
export * from './extensions';

// Types
export type {
  EditorAPI,
  EditorConfig,
  EditorState,
  EditorEvents,
  EditorExtension,
  Position,
  Range,
  TextChange,
  Transaction,
  Cursor,
  SearchResult,
  SearchOptions,
  BracketMatch,
  FoldRange,
  Theme,
  DecorationStyle,
  EditorDecoration,
  InlineDecoration,
  LineDecoration,
  GutterDecoration,
  DiagnosticSeverity,
  EditorDiagnostic,
  CompletionItemKind,
  CompletionItem,
  CompletionResult,
  CompletionContext,
  CompletionProvider,
  FormattingMode,
  FormattingContext,
  FormattingResult,
  Formatter,
  LanguageServiceDocumentSnapshot,
  LanguageServiceHighlightContext,
  LanguageServiceDiagnosticsContext,
  LanguageServiceHoverContext,
  LanguageServiceHoverResult,
  LanguageServiceCodeActionContext,
  LanguageServiceCodeAction,
  LanguageServiceHighlighter,
  LanguageServiceDiagnosticsProvider,
  LanguageServiceHoverProvider,
  LanguageServiceCodeActionsProvider
} from './types';

// Factory function for easy instantiation
export function createEditor(container: HTMLElement, config?: import('./types').EditorConfig) {
  // A copy of the list: the defaults added below must not go into the caller's own array, or a second editor made
  // from the same options would get this editor's keymap (and Ctrl+Z in one editor would undo in the other).
  const finalConfig = { ...config, extensions: [...(config?.extensions ?? [])] };

  // Add KeymapExtension if not already present
  const hasKeymap = finalConfig.extensions.some(ext => ext.name === 'keymap');
  if (!hasKeymap) {
    finalConfig.extensions.unshift(new KeymapExtension(finalConfig.keymap));
  }

  // Add TransactionExtension by default
  const hasTransaction = finalConfig.extensions.some(ext => ext.name === 'transaction');
  if (!hasTransaction) {
    finalConfig.extensions.unshift(new TransactionExtension());
  }

  return new EditorCore(container, finalConfig);
}

// Default export
export default EditorCore;
