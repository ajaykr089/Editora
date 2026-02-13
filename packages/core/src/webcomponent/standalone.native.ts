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

// Import native plugins (framework-agnostic - NO REACT)
import { BoldPlugin } from "../../../plugins/bold/src/BoldPlugin.native";
import { ItalicPlugin } from "../../../plugins/italic/src/ItalicPlugin.native";
import { UnderlinePlugin } from "../../../plugins/underline/src/UnderlinePlugin.native";
import { StrikethroughPlugin } from "../../../plugins/strikethrough/src/StrikethroughPlugin.native";
import { LinkPlugin } from "../../../plugins/link/src/LinkPlugin.native";
import { TablePlugin } from "../../../plugins/table/src/TablePlugin.native";
import { ListPlugin } from "../../../plugins/list/src/ListPlugin.native";
import { HistoryPlugin } from "../../../plugins/history/src/HistoryPlugin.native";
import { ClearFormattingPlugin } from "../../../plugins/clear-formatting/src/ClearFormattingPlugin.native";
import { HeadingPlugin } from "../../../plugins/heading/src/HeadingPlugin.native";
import { BlockquotePlugin } from "../../../plugins/blockquote/src/BlockquotePlugin.native";
import { CodePlugin } from "../../../plugins/code/src/CodePlugin.native";
import { CodeSamplePlugin } from "../../../plugins/code-sample/src/CodeSamplePlugin.native";
import { IndentPlugin } from "../../../plugins/indent/src/IndentPlugin.native";
import { TextAlignmentPlugin } from "../../../plugins/text-alignment/src/TextAlignmentPlugin.native";
import { TextColorPlugin } from "../../../plugins/text-color/src/TextColorPlugin.native";
import { BackgroundColorPlugin } from "../../../plugins/background-color/src/BackgroundColorPlugin.native";
import { FontSizePlugin } from "../../../plugins/font-size/src/FontSizePlugin.native";
import { FontFamilyPlugin } from "../../../plugins/font-family/src/FontFamilyPlugin.native";
import { LineHeightPlugin } from "../../../plugins/line-height/src/LineHeightPlugin.native";
import { FootnotePlugin } from "../../../plugins/footnote/src/FootnotePlugin.native";
// ParagraphPlugin removed - paragraph option is in HeadingPlugin dropdown
import { DirectionPlugin } from "../../../plugins/direction/src/DirectionPlugin.native";
import { CapitalizationPlugin } from "../../../plugins/capitalization/src/CapitalizationPlugin.native";
import { ChecklistPlugin } from "../../../plugins/checklist/src/ChecklistPlugin.native";
import { AnchorPlugin } from "../../../plugins/anchor/src/AnchorPlugin.native";
import { EmbedIframePlugin } from "../../../plugins/embed-iframe/src/EmbedIframePlugin.native";
import { MathPlugin } from "../../../plugins/math/src/MathPlugin.native";
import { MediaManagerPlugin } from "../../../plugins/media-manager/src/MediaManagerPlugin.native";
import { MergeTagPlugin } from "../../../plugins/merge-tag/src/MergeTagPlugin.native";
import { PageBreakPlugin } from "../../../plugins/page-break/src/PageBreakPlugin.native";
import { PrintPlugin } from "../../../plugins/print/src/PrintPlugin.native";
import { PreviewPlugin } from "../../../plugins/preview/src/PreviewPlugin.native";
import { SpecialCharactersPlugin } from "../../../plugins/special-characters/src/SpecialCharactersPlugin.native";
import { SpellCheckPlugin } from "../../../plugins/spell-check/src/SpellCheckPlugin.native";
import { EmojisPlugin } from "../../../plugins/emojis/src/EmojisPlugin.native";
import { A11yCheckerPlugin } from "../../../plugins/a11y-checker/src/A11yCheckerPlugin.native";
import { CommentsPlugin } from "../../../plugins/comments/src/CommentsPlugin.native";
import { DocumentManagerPlugin } from "../../../plugins/document-manager/src/DocumentManagerPlugin.native";
import { FullscreenPlugin } from "../../../plugins/fullscreen/src/FullscreenPlugin.native";
import { TemplatePlugin } from "../../../plugins/template/src/TemplatePlugin.native";

/**
 * All plugins are now native! No more legacy plugins needed.
 * Phase 2: 100% COMPLETE!
 */

// Import RichTextEditor FIRST
import { RichTextEditorElement } from './RichTextEditor';

// Create global plugin loader instance
const globalPluginLoader = new PluginLoader();

// Set it on the class IMMEDIATELY before doing anything else
(RichTextEditorElement as any).__globalPluginLoader = globalPluginLoader;

/**
 * Initialize web component with global plugin registry
 */
export function initWebComponent() {

  // Register native plugins (framework-agnostic, no React) ✅
  const pluginFactories = [
    { name: 'BoldPlugin', factory: BoldPlugin },
    { name: 'ItalicPlugin', factory: ItalicPlugin },
    { name: 'UnderlinePlugin', factory: UnderlinePlugin },
    { name: 'StrikethroughPlugin', factory: StrikethroughPlugin },
    { name: 'ClearFormattingPlugin', factory: ClearFormattingPlugin },
    // ParagraphPlugin removed - paragraph option is in HeadingPlugin dropdown
    { name: 'HeadingPlugin', factory: HeadingPlugin },
    { name: 'BlockquotePlugin', factory: BlockquotePlugin },
    { name: 'CodePlugin', factory: CodePlugin },
    { name: 'codeSample', factory: CodeSamplePlugin },
    { name: 'ListPlugin', factory: ListPlugin },
    { name: 'ChecklistPlugin', factory: ChecklistPlugin },
    { name: 'TextAlignmentPlugin', factory: TextAlignmentPlugin },
    { name: 'IndentPlugin', factory: IndentPlugin },
    { name: 'DirectionPlugin', factory: DirectionPlugin },
    { name: 'TextColorPlugin', factory: TextColorPlugin },
    { name: 'BackgroundColorPlugin', factory: BackgroundColorPlugin },
    { name: 'FontSizePlugin', factory: FontSizePlugin },
    { name: 'FontFamilyPlugin', factory: FontFamilyPlugin },
    { name: 'LineHeightPlugin', factory: LineHeightPlugin },
    { name: 'CapitalizationPlugin', factory: CapitalizationPlugin },
    { name: 'LinkPlugin', factory: LinkPlugin },
    { name: 'TablePlugin', factory: TablePlugin },
    { name: 'AnchorPlugin', factory: AnchorPlugin },
    { name: 'EmbedIframePlugin', factory: EmbedIframePlugin },
    { name: 'MathPlugin', factory: MathPlugin },
    { name: 'MediaManagerPlugin', factory: MediaManagerPlugin },
    { name: 'MergeTagPlugin', factory: MergeTagPlugin },
    { name: 'PageBreakPlugin', factory: PageBreakPlugin },
    { name: 'PrintPlugin', factory: PrintPlugin },
    { name: 'PreviewPlugin', factory: PreviewPlugin },
    { name: 'SpecialCharactersPlugin', factory: SpecialCharactersPlugin },
    { name: 'SpellCheckPlugin', factory: SpellCheckPlugin },
    { name: 'EmojisPlugin', factory: EmojisPlugin },
    { name: 'A11yCheckerPlugin', factory: A11yCheckerPlugin },
    { name: 'CommentsPlugin', factory: CommentsPlugin },
    { name: 'DocumentManagerPlugin', factory: DocumentManagerPlugin },
    { name: 'FullscreenPlugin', factory: FullscreenPlugin },
    { name: 'TemplatePlugin', factory: TemplatePlugin },
    { name: 'HistoryPlugin', factory: HistoryPlugin },
    { name: 'FootnotePlugin', factory: FootnotePlugin },
  ];

  const nativePlugins: any[] = [];

  // Initialize each plugin with error handling
  pluginFactories.forEach(({ name, factory }) => {
    try {
      const plugin = factory();
      nativePlugins.push(plugin);
    } catch (error) {
      console.error(`[Editora] Failed to load ${name}:`, error);
    }
  });

  // All plugins are now native! ✅✅✅
  const allPlugins = nativePlugins;

  // Register plugins globally
  allPlugins.forEach(plugin => {
    globalPluginLoader.register(plugin.name, () => plugin);

  });
  
  // Return the plugins array directly
  return allPlugins;
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  // Initialize plugins first
  const plugins = initWebComponent();
  
  // Attach plugins to the element class
  (RichTextEditorElement as any).__globalPlugins = plugins;
  
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
  
  // Register custom element
  if (!customElements.get('editora-editor')) {
    customElements.define('editora-editor', RichTextEditorElement);
  }
  
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
    init: (selector: string, config?: any) => {
      const element = document.querySelector(selector);
      if (element instanceof RichTextEditorElement) {
        if (config) {
          element.setConfig(config);
        }
        return element.getAPI();
      }
      return null;
    }
  };
}

// Export for module usage (initWebComponent already exported above)
export { RichTextEditorElement };
export type { EditorAPI } from './RichTextEditor';
