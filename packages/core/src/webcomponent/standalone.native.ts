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

// Create global plugin loader instance
const globalPluginLoader = new PluginLoader();

// Set it on the class IMMEDIATELY before doing anything else
(RichTextEditorElement as any).__globalPluginLoader = globalPluginLoader;

/**
 * Lazy-loaded plugin registry for optimal bundle size
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
  'codeSample': () => import("../../../plugins/code-sample/src/CodeSamplePlugin.native").then(m => m.CodeSamplePlugin()),
  'list': () => import("../../../plugins/list/src/ListPlugin.native").then(m => m.ListPlugin()),
  'checklist': () => import("../../../plugins/checklist/src/ChecklistPlugin.native").then(m => m.ChecklistPlugin()),
  'textAlignment': () => import("../../../plugins/text-alignment/src/TextAlignmentPlugin.native").then(m => m.TextAlignmentPlugin()),
  'indent': () => import("../../../plugins/indent/src/IndentPlugin.native").then(m => m.IndentPlugin()),
  'direction': () => import("../../../plugins/direction/src/DirectionPlugin.native").then(m => m.DirectionPlugin()),
  'textColor': () => import("../../../plugins/text-color/src/TextColorPlugin.native").then(m => m.TextColorPlugin()),
  'backgroundColor': () => import("../../../plugins/background-color/src/BackgroundColorPlugin.native").then(m => m.BackgroundColorPlugin()),
  'fontSize': () => import("../../../plugins/font-size/src/FontSizePlugin.native").then(m => m.FontSizePlugin()),
  'fontFamily': () => import("../../../plugins/font-family/src/FontFamilyPlugin.native").then(m => m.FontFamilyPlugin()),
  'lineHeight': () => import("../../../plugins/line-height/src/LineHeightPlugin.native").then(m => m.LineHeightPlugin()),
  'capitalization': () => import("../../../plugins/capitalization/src/CapitalizationPlugin.native").then(m => m.CapitalizationPlugin()),
  'history': () => import("../../../plugins/history/src/HistoryPlugin.native").then(m => m.HistoryPlugin()),
  
  // Advanced plugins (lazy loaded)
  'link': () => import("../../../plugins/link/src/LinkPlugin.native").then(m => m.LinkPlugin()),
  'table': () => import("../../../plugins/table/src/TablePlugin.native").then(m => m.TablePlugin()),
  'trackChanges': () => import("../../../plugins/track-changes/src/TrackChangesPlugin.native").then(m => m.TrackChangesPlugin()),
  'versionDiff': () => import("../../../plugins/version-diff/src/VersionDiffPlugin.native").then(m => m.VersionDiffPlugin()),
  'version-diff': () => import("../../../plugins/version-diff/src/VersionDiffPlugin.native").then(m => m.VersionDiffPlugin()),
  'versiondiff': () => import("../../../plugins/version-diff/src/VersionDiffPlugin.native").then(m => m.VersionDiffPlugin()),
  'mentions': () => import("../../../plugins/mentions/src/MentionPlugin.native").then(m => m.MentionPlugin()),
  'mention': () => import("../../../plugins/mentions/src/MentionPlugin.native").then(m => m.MentionPlugin()),
  'anchor': () => import("../../../plugins/anchor/src/AnchorPlugin.native").then(m => m.AnchorPlugin()),
  'embedIframe': () => import("../../../plugins/embed-iframe/src/EmbedIframePlugin.native").then(m => m.EmbedIframePlugin()),
  'math': () => import("../../../plugins/math/src/MathPlugin.native").then(m => m.MathPlugin()),
  'image': () => import("../../../plugins/media-manager/src/MediaManagerPlugin.native").then(m => m.MediaManagerPlugin()),
  'mergeTag': () => import("../../../plugins/merge-tag/src/MergeTagPlugin.native").then(m => m.MergeTagPlugin()),
  'pageBreak': () => import("../../../plugins/page-break/src/PageBreakPlugin.native").then(m => m.PageBreakPlugin()),
  'print': () => import("../../../plugins/print/src/PrintPlugin.native").then(m => m.PrintPlugin()),
  'preview': () => import("../../../plugins/preview/src/PreviewPlugin.native").then(m => m.PreviewPlugin()),
  'specialCharacters': () => import("../../../plugins/special-characters/src/SpecialCharactersPlugin.native").then(m => m.SpecialCharactersPlugin()),
  'slashCommands': () => import("../../../plugins/slash-commands/src/SlashCommandsPlugin.native").then(m => m.SlashCommandsPlugin()),
  'slash-commands': () => import("../../../plugins/slash-commands/src/SlashCommandsPlugin.native").then(m => m.SlashCommandsPlugin()),
  'spellCheck': () => import("../../../plugins/spell-check/src/SpellCheckPlugin.native").then(m => m.SpellCheckPlugin()),
  'emojis': () => import("../../../plugins/emojis/src/EmojisPlugin.native").then(m => m.EmojisPlugin()),
  'a11yChecker': () => import("../../../plugins/a11y-checker/src/A11yCheckerPlugin.native").then(m => m.A11yCheckerPlugin()),
  'comments': () => import("../../../plugins/comments/src/CommentsPlugin.native").then(m => m.CommentsPlugin()),
  'document-manager': () => import("../../../plugins/document-manager/src/DocumentManagerPlugin.native").then(m => m.DocumentManagerPlugin()),
  'fullscreen': () => import("../../../plugins/fullscreen/src/FullscreenPlugin.native").then(m => m.FullscreenPlugin()),
  'template': () => import("../../../plugins/template/src/TemplatePlugin.native").then(m => m.TemplatePlugin()),
  'footnote': () => import("../../../plugins/footnote/src/FootnotePlugin.native").then(m => m.FootnotePlugin()),
};

/**
 * Initialize web component with lazy plugin loading
 */
export async function initWebComponent() {
  // Register lazy-loaded plugins
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
