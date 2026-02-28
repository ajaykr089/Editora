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
  Theme
} from './types';

// Factory function for easy instantiation
export function createEditor(container: HTMLElement, config?: import('./types').EditorConfig) {
  // Include KeymapExtension by default if not explicitly disabled
  const finalConfig = { ...config };
  if (!finalConfig.extensions) {
    finalConfig.extensions = [];
  }

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
