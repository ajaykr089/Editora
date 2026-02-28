/**
 * Core Web Component Bundle - Minimal
 * Entry point for browser usage with only essential plugins
 *
 * Includes only core editing plugins for smaller bundle size
 */

// Import all styles for web components
import './index.css';

import { PluginLoader } from '../config/PluginLoader';

// Import RichTextEditor FIRST
import { RichTextEditorElement } from './RichTextEditor';

// Create global plugin loader instance
const globalPluginLoader = new PluginLoader();

// Set it on the class IMMEDIATELY before doing anything else
(RichTextEditorElement as any).__globalPluginLoader = globalPluginLoader;

/**
 * Core plugin registry - only essential plugins
 */
const pluginRegistry: Record<string, () => Promise<any>> = {
  // Core editing plugins (always loaded)
  'bold': () => import("../../../plugins/bold/src/BoldPlugin.native").then(m => m.BoldPlugin()),
  'italic': () => import("../../../plugins/italic/src/ItalicPlugin.native").then(m => m.ItalicPlugin()),
  'underline': () => import("../../../plugins/underline/src/UnderlinePlugin.native").then(m => m.UnderlinePlugin()),
  'strikethrough': () => import("../../../plugins/strikethrough/src/StrikethroughPlugin.native").then(m => m.StrikethroughPlugin()),
  'clearFormatting': () => import("../../../plugins/clear-formatting/src/ClearFormattingPlugin.native").then(m => m.ClearFormattingPlugin()),
  'heading': () => import("../../../plugins/heading/src/HeadingPlugin.native").then(m => m.HeadingPlugin()),
  'blockquote': () => import("../../../plugins/blockquote/src/BlockquotePlugin.native").then(m => m.BlockquotePlugin()),
  'code': () => import("../../../plugins/code/src/CodePlugin.native").then(m => m.CodePlugin()),
  'list': () => import("../../../plugins/list/src/ListPlugin.native").then(m => m.ListPlugin()),
  'history': () => import("../../../plugins/history/src/HistoryPlugin.native").then(m => m.HistoryPlugin()),
};

/**
 * Initialize web component with core plugins only
 */
export async function initWebComponent() {
  // Register core plugins
  Object.entries(pluginRegistry).forEach(([name, loader]) => {
    globalPluginLoader.register(name, loader);
  });

  return globalPluginLoader;
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  // Initialize plugins first (async)
  initWebComponent().then(pluginLoader => {
    // Attach plugin loader to the element class
    (RichTextEditorElement as any).__globalPluginLoader = pluginLoader;

    // Register custom element AFTER plugins are loaded
    if (!customElements.get('editora-editor')) {
      customElements.define('editora-editor', RichTextEditorElement);
    }

    // Capture initial content for existing elements before upgrading
    const existingElements = document.querySelectorAll('editora-editor:not([data-initial-content])');
    const contents: string[] = [];
    existingElements.forEach((el) => {
      const content = el.innerHTML.trim();
      if (content) {
        contents.push(content);
        el.setAttribute('data-initial-content', content);
        el.innerHTML = '';
      }
    });

    // Upgrade existing elements
    existingElements.forEach((el, index) => {
      // Force upgrade
      if (el instanceof RichTextEditorElement) {
        // Element is already upgraded, just initialize if needed
        if (!(el as any).isInitialized && contents[index]) {
          el.setAttribute('content', contents[index]);
        }
      }
    });
  });
}
