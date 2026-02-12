/**
 * Standalone Web Component Bundle
 * Entry point for browser usage via script tag
 * 
 * Imports and bundles all plugins from @editora/plugins package
 * NO CODE DUPLICATION - reuses the exact same plugins as React version
 */

import { PluginLoader } from '../config/PluginLoader';
import { EditorState } from '../EditorState';

// Import ALL plugins from @editora/plugins package
// These are the EXACT SAME plugins used in Storybook/React
// Note: ParagraphPlugin removed - paragraph option is in HeadingPlugin dropdown
import {
  HeadingPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  ListPlugin,
  HistoryPlugin,
  LinkPlugin,
  BlockquotePlugin,
  ClearFormattingPlugin,
  TablePlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  TextAlignmentPlugin,
  MathPlugin,
  TextColorPlugin,
  BackgroundColorPlugin,
  SpecialCharactersPlugin,
  EmojisPlugin,
  LineHeightPlugin,
  IndentPlugin,
  CapitalizationPlugin,
  DirectionPlugin,
  CodePlugin,
  ChecklistPlugin,
  AnchorPlugin,
  EmbedIframePlugin
  // Note: Some plugins require React context providers (MediaManager, DocumentManager, etc.)
  // They can be added when we implement the provider bridge
} from '@editora/plugins';

/**
 * Command bridge for plugins without React providers
 * Adds command definitions to plugins that rely on React context
 */
const addCommandsToPlugin = (plugin: any) => {
  if (plugin.commands) {
    return plugin; // Plugin already has commands
  }

  // Map of plugin names to their command implementations
  const commandMap: Record<string, any> = {
    bold: {
      toggleBold: (state: EditorState) => {
        document.execCommand('bold', false);
        return state;
      }
    },
    italic: {
      toggleItalic: (state: EditorState) => {
        document.execCommand('italic', false);
        return state;
      }
    },
    underline: {
      toggleUnderline: (state: EditorState) => {
        document.execCommand('underline', false);
        return state;
      }
    },
    strikethrough: {
      toggleStrikethrough: (state: EditorState) => {
        document.execCommand('strikeThrough', false);
        return state;
      }
    },
    list: {
      toggleBulletList: (state: EditorState) => {
        document.execCommand('insertUnorderedList', false);
        return state;
      },
      toggleOrderedList: (state: EditorState) => {
        document.execCommand('insertOrderedList', false);
        return state;
      }
    },
    history: {
      undo: (state: EditorState) => {
        document.execCommand('undo', false);
        return state;
      },
      redo: (state: EditorState) => {
        document.execCommand('redo', false);
        return state;
      }
    },
    link: {
      openLinkDialog: (state: EditorState) => {
        const url = prompt('Enter URL:');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        return state;
      }
    },
    blockquote: {
      toggleBlockquote: (state: EditorState) => {
        document.execCommand('formatBlock', false, 'blockquote');
        return state;
      }
    },
    clearFormatting: {
      clearFormatting: (state: EditorState) => {
        document.execCommand('removeFormat', false);
        return state;
      }
    },
    table: {
      insertTable: (state: EditorState) => {
        console.log('Table insertion requires dialog - not implemented in basic mode');
        return state;
      }
    },
    fontSize: {
      setFontSize: (state: EditorState, size?: string) => {
        if (size) {
          document.execCommand('fontSize', false, size);
        }
        return state;
      },
      increaseFontSize: (state: EditorState) => {
        document.execCommand('fontSize', false, '4');
        return state;
      },
      decreaseFontSize: (state: EditorState) => {
        document.execCommand('fontSize', false, '2');
        return state;
      }
    },
    fontFamily: {
      setFontFamily: (state: EditorState, family?: string) => {
        if (family) {
          document.execCommand('fontName', false, family);
        }
        return state;
      }
    },
    textAlignment: {
      setTextAlignment: (state: EditorState, alignment?: string) => {
        if (alignment) {
          document.execCommand(`justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`, false);
        }
        return state;
      }
    },
    textColor: {
      openTextColorDialog: (state: EditorState) => {
        const color = prompt('Enter color (hex):');
        if (color) {
          document.execCommand('foreColor', false, color);
        }
        return state;
      }
    },
    backgroundColor: {
      openBackgroundColorDialog: (state: EditorState) => {
        const color = prompt('Enter background color (hex):');
        if (color) {
          document.execCommand('backColor', false, color);
        }
        return state;
      }
    },
    indent: {
      increaseIndent: (state: EditorState) => {
        document.execCommand('indent', false);
        return state;
      },
      decreaseIndent: (state: EditorState) => {
        document.execCommand('outdent', false);
        return state;
      }
    },
    code: {
      toggleSourceView: (state: EditorState) => {
        console.log('Source view toggle not implemented');
        return state;
      }
    }
  };

  // Add commands to plugin if available
  if (commandMap[plugin.name]) {
    plugin.commands = commandMap[plugin.name];
  }

  return plugin;
};

// Global plugin registry - initialized early
const globalPluginRegistry = new PluginLoader();

// Register ALL real plugins from @editora/plugins package
// Wrap them to add commands for non-React environment
// Note: paragraph plugin removed - paragraph option is in HeadingPlugin dropdown
console.log('[Editora] Initializing web component with real plugins from @editora/plugins...');

globalPluginRegistry.register('heading', () => addCommandsToPlugin(HeadingPlugin()));
globalPluginRegistry.register('bold', () => addCommandsToPlugin(BoldPlugin()));
globalPluginRegistry.register('italic', () => addCommandsToPlugin(ItalicPlugin()));
globalPluginRegistry.register('underline', () => addCommandsToPlugin(UnderlinePlugin()));
globalPluginRegistry.register('strikethrough', () => addCommandsToPlugin(StrikethroughPlugin()));
globalPluginRegistry.register('list', () => addCommandsToPlugin(ListPlugin()));
globalPluginRegistry.register('history', () => addCommandsToPlugin(HistoryPlugin()));
globalPluginRegistry.register('link', () => addCommandsToPlugin(LinkPlugin()));
globalPluginRegistry.register('blockquote', () => addCommandsToPlugin(BlockquotePlugin()));
globalPluginRegistry.register('clearFormatting', () => addCommandsToPlugin(ClearFormattingPlugin()));
globalPluginRegistry.register('table', () => addCommandsToPlugin(TablePlugin()));
globalPluginRegistry.register('fontSize', () => addCommandsToPlugin(FontSizePlugin()));
globalPluginRegistry.register('fontFamily', () => addCommandsToPlugin(FontFamilyPlugin()));
globalPluginRegistry.register('textAlignment', () => addCommandsToPlugin(TextAlignmentPlugin()));
globalPluginRegistry.register('math', () => addCommandsToPlugin(MathPlugin()));
globalPluginRegistry.register('textColor', () => addCommandsToPlugin(TextColorPlugin()));
globalPluginRegistry.register('backgroundColor', () => addCommandsToPlugin(BackgroundColorPlugin()));
globalPluginRegistry.register('specialCharacters', () => addCommandsToPlugin(SpecialCharactersPlugin()));
globalPluginRegistry.register('emojis', () => addCommandsToPlugin(EmojisPlugin()));
globalPluginRegistry.register('lineHeight', () => addCommandsToPlugin(LineHeightPlugin()));
globalPluginRegistry.register('indent', () => addCommandsToPlugin(IndentPlugin()));
globalPluginRegistry.register('capitalization', () => addCommandsToPlugin(CapitalizationPlugin()));
globalPluginRegistry.register('direction', () => addCommandsToPlugin(DirectionPlugin()));
globalPluginRegistry.register('code', () => addCommandsToPlugin(CodePlugin()));
globalPluginRegistry.register('checklist', () => addCommandsToPlugin(ChecklistPlugin()));
globalPluginRegistry.register('anchor', () => addCommandsToPlugin(AnchorPlugin()));
globalPluginRegistry.register('embedIframe', () => addCommandsToPlugin(EmbedIframePlugin()));

const registeredPlugins = globalPluginRegistry.getRegisteredPluginNames();
console.log('[Editora] Plugins registered:', registeredPlugins.length, 'plugins');
console.log('[Editora] Plugin list:', registeredPlugins);

// NOW import the custom element class (after plugins are registered)
import { RichTextEditorElement, initWebComponent } from './RichTextEditor';

// Set the global registry on the RichTextEditor class
// This is a workaround since we can't modify the constructor before class definition
(RichTextEditorElement as any).__globalPluginRegistry = globalPluginRegistry;

// Register the custom element AFTER plugins are registered
if (typeof window !== 'undefined' && !customElements.get('rich-text-editor')) {
  customElements.define('rich-text-editor', RichTextEditorElement);
  console.log('[Editora] Custom element registered');
}

// Export the custom element class and init function
export { RichTextEditorElement, initWebComponent };

// Export for global access in browsers  
if (typeof window !== 'undefined') {
  (window as any).Editora = {
    RichTextEditorElement,
    initWebComponent,
  };
}
