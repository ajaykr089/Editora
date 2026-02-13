/**
 * Plugin Loader Utility
 * Allows loading additional plugins after the core bundle is loaded
 */

import { PluginLoader } from '../config/PluginLoader';

/**
 * Advanced plugin registry - loaded on demand
 */
const advancedPluginRegistry: Record<string, () => Promise<any>> = {
  'codeSample': () => import("../../../plugins/code-sample/src/CodeSamplePlugin.native").then(m => m.CodeSamplePlugin()),
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
  'link': () => import("../../../plugins/link/src/LinkPlugin.native").then(m => m.LinkPlugin()),
  'table': () => import("../../../plugins/table/src/TablePlugin.native").then(m => m.TablePlugin()),
  'anchor': () => import("../../../plugins/anchor/src/AnchorPlugin.native").then(m => m.AnchorPlugin()),
  'embedIframe': () => import("../../../plugins/embed-iframe/src/EmbedIframePlugin.native").then(m => m.EmbedIframePlugin()),
  'math': () => import("../../../plugins/math/src/MathPlugin.native").then(m => m.MathPlugin()),
  'image': () => import("../../../plugins/media-manager/src/MediaManagerPlugin.native").then(m => m.MediaManagerPlugin()),
  'mergeTag': () => import("../../../plugins/merge-tag/src/MergeTagPlugin.native").then(m => m.MergeTagPlugin()),
  'pageBreak': () => import("../../../plugins/page-break/src/PageBreakPlugin.native").then(m => m.PageBreakPlugin()),
  'print': () => import("../../../plugins/print/src/PrintPlugin.native").then(m => m.PrintPlugin()),
  'preview': () => import("../../../plugins/preview/src/PreviewPlugin.native").then(m => m.PreviewPlugin()),
  'specialCharacters': () => import("../../../plugins/special-characters/src/SpecialCharactersPlugin.native").then(m => m.SpecialCharactersPlugin()),
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
 * Load additional plugins dynamically
 */
export async function loadPlugins(pluginNames: string[]): Promise<void> {
  const pluginLoader = (window as any).EditoraCore?.__globalPluginLoader ||
                      (window as any).Editora?.__globalPluginLoader;

  if (!pluginLoader) {
    console.warn('Editora plugin loader not found. Make sure to load the core bundle first.');
    return;
  }

  // Register advanced plugins if not already registered
  Object.entries(advancedPluginRegistry).forEach(([name, loader]) => {
    if (!pluginLoader.getRegisteredPluginNames().includes(name)) {
      pluginLoader.register(name, loader);
    }
  });

  // Load the requested plugins
  await pluginLoader.loadMultiple(pluginNames);
}

/**
 * Get available plugin names
 */
export function getAvailablePlugins(): string[] {
  return Object.keys(advancedPluginRegistry);
}

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).EditoraPlugins = {
    loadPlugins,
    getAvailablePlugins,
  };
}