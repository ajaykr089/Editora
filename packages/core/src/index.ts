// Legacy exports (backward compatibility)
export { Editor } from './Editor';
export { EditorState } from './EditorState';
export type { EditorSelection } from './EditorState';
export { Schema } from './schema/Node';
export type { Node, NodeSpec } from './schema/Node';
export { PluginManager } from './plugins/Plugin';
export type { Plugin, ToolbarItem } from './plugins/Plugin';
export { PluginRuntime, createPluginRuntime } from './plugins/PluginRuntime';
export type { PluginRuntimeContext } from './plugins/PluginRuntime';

// Keyboard Shortcuts
export { KeyboardShortcutManager } from './KeyboardShortcuts';
export type { KeyboardShortcut, KeyboardShortcutConfig } from './KeyboardShortcuts';

// Enterprise plugins
export { createSpellcheckPlugin, createMediaPlugin } from './plugins/enterprise';
export type { SpellcheckConfig, MediaConfig } from './plugins/enterprise';

// New architecture exports
// Core layer
export * from './core';

// UI layer
export * from './ui';

// Config layer
export * from './config';

// Adapters
export * from './adapters';

// Web Component
export * from './webcomponent';

// Convenience factory functions
import { VanillaAdapter } from './adapters/VanillaAdapter';
import { RichTextEditorElement } from './webcomponent/RichTextEditor';

/**
 * Create editor instance for vanilla JavaScript usage
 * @example
 * const editor = Editora.createEditor({
 *   element: document.getElementById('editor'),
 *   plugins: 'bold italic link',
 *   toolbar: 'undo redo | bold italic | link'
 * });
 */
export function createEditor(options: any) {
  return new VanillaAdapter(options);
}

/**
 * Initialize Web Component globally
 * Allows usage via <editora-editor> HTML tag
 * 
 * NOTE: Auto-initialization is disabled here to avoid conflicts.
 * The standalone.native.ts bundle handles web component registration.
 */
export function initWebComponent() {
  if (typeof window !== 'undefined' && !customElements.get('editora-editor')) {
    customElements.define('editora-editor', RichTextEditorElement);
  }
}

// Auto-initialization DISABLED - handled by standalone bundles
// if (typeof window !== 'undefined') {
//   initWebComponent();
// }
