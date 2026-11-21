/**
 * Standalone Web Component Bundle - Framework Agnostic
 * Entry point for browser usage via script tag
 * 
 * Uses native plugins with NO React dependency
 * Lightweight, fast, and works in any JavaScript environment
 */

// Import all styles for web components
import './index.css';

import { PluginLoader } from '../config/PluginLoader';

// Import RichTextEditor FIRST
import { RichTextEditorElement } from './RichTextEditor';
import { BUILT_IN_PLUGIN_REGISTRY } from './builtInPlugins';

// Create global plugin loader instance
const globalPluginLoader = new PluginLoader();

// Set it on the class IMMEDIATELY before doing anything else
(RichTextEditorElement as any).__globalPluginLoader = globalPluginLoader;


/**
 * Initialize web component with lazy plugin loading
 */
export async function initWebComponent() {
  // Register lazy-loaded plugins
  Object.entries(BUILT_IN_PLUGIN_REGISTRY).forEach(([name, loader]) => {
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
      contents.push(content);
      if (content) {
        el.setAttribute('data-initial-content', content);
      }
    });
    
    // After define, set content on new elements if they were replaced
    const allElements = document.querySelectorAll('editora-editor');
    const newElements = Array.from(allElements).filter(el => !el.hasAttribute('data-initial-content'));
    newElements.forEach(el => {
      const index = Array.from(allElements).indexOf(el);
      if (contents[index]) {
        el.setAttribute('data-initial-content', contents[index]);
      }
    });
    
    // Expose global API (TinyMCE-style)
    (window as any).Editora = {
      version: '1.0.0',
      plugins: globalPluginLoader.getRegisteredPluginNames(),
      WebComponent: RichTextEditorElement,
      init: async (selector: string, config?: any) => {
        const element = document.querySelector(selector);
        if (element instanceof RichTextEditorElement) {
          if (config) {
            await element.setConfig(config);
          }
          return element.getAPI();
        }
        return null;
      }
    };
  });
}

// Export for module usage (initWebComponent already exported above)
export { RichTextEditorElement };
export type { EditorAPI } from './RichTextEditor';
