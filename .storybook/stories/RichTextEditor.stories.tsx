import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RichTextEditor } from "@editora/react";
import {
  ParagraphPlugin,
  HeadingPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  ListPlugin,
  BlockquotePlugin,
  CodePlugin,
  LinkPlugin,
  ClearFormattingPlugin,
  HistoryPlugin,
  TablePlugin,
  MediaManagerPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  TextAlignmentPlugin,
  MathPlugin,
  DocumentManagerPlugin,
  TextColorPlugin,
  BackgroundColorPlugin,
  SpecialCharactersPlugin,
  EmojisPlugin,
  LineHeightPlugin,
  IndentPlugin,
  EmbedIframePlugin,
  CapitalizationPlugin,
  DirectionPlugin,
  ChecklistPlugin,
  PreviewPlugin,
  FullscreenPlugin,
  AnchorPlugin,
  PrintPlugin,
  PageBreakPlugin,
  FootnotePlugin,
  CodeSamplePlugin,
  MergeTagPlugin,
  TemplatePlugin,
  CommentsPlugin,
  SpellCheckPlugin,
  A11yCheckerPlugin
} from "@editora/plugins";
import "@editora/themes/themes/default.css";

const meta: Meta<typeof RichTextEditor> = {
  title: "Editor/RichTextEditor",
  component: RichTextEditor,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

// Common plugins for all stories
const commonPlugins = [
  ParagraphPlugin(),
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin(),
  CodePlugin(),
  ListPlugin(),
  BlockquotePlugin(),
  LinkPlugin(),
  ClearFormattingPlugin(),
  TablePlugin(),
  HistoryPlugin(),
  MediaManagerPlugin(),
  FontSizePlugin(),
  FontFamilyPlugin(),
  TextAlignmentPlugin(),
  MathPlugin(),
  DocumentManagerPlugin(),
  TextColorPlugin(),
  BackgroundColorPlugin(),
  SpecialCharactersPlugin(),
  EmojisPlugin(),
  LineHeightPlugin(),
  IndentPlugin(),
  EmbedIframePlugin(),
  CapitalizationPlugin(),
  DirectionPlugin(),
  ChecklistPlugin(),
  PreviewPlugin(),
  FullscreenPlugin(),
  AnchorPlugin(),
  PrintPlugin(),
  PageBreakPlugin(),
  FootnotePlugin(),
  CodeSamplePlugin(),
  MergeTagPlugin(),
  TemplatePlugin(),
  CommentsPlugin(),
  SpellCheckPlugin(),
  A11yCheckerPlugin(),
];

export const Default: Story = {
  args: {
    plugins: commonPlugins,
    mediaConfig: {
      uploadUrl: "/api/media/upload",
      libraryUrl: "/api/media/library",
      maxFileSize: 5 * 1024 * 1024,
      allowedTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
      ],
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <RichTextEditor {...args} />
    </div>
  ),
};

export const MinimalPlugins: Story = {
  args: {
    plugins: [ParagraphPlugin(), BoldPlugin(), ItalicPlugin()],
  },
};

export const OnlyFormatting: Story = {
  args: {
    plugins: [ParagraphPlugin(), HeadingPlugin()],
  },
};

// ==================== NEW CONFIGURATION FEATURES ====================

/**
 * Toolbar Configuration Demo
 * Shows floating, sticky, and positioned toolbar options
 */
export const FloatingToolbar: Story = {
  args: {
    plugins: commonPlugins,
    toolbar: {
      floating: true,
      sticky: false,
      position: 'top',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Floating Toolbar Demo:</strong> Select text to see the floating toolbar appear
      </div>
      <RichTextEditor {...args} defaultValue="<p>Select this text to see the floating toolbar in action!</p>" />
    </div>
  ),
};

export const StickyToolbar: Story = {
  args: {
    plugins: commonPlugins,
    toolbar: {
      floating: false,
      sticky: true,
      position: 'top',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd', overflow: 'auto' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Sticky Toolbar Demo:</strong> Scroll down and the toolbar stays at the top
      </div>
      <RichTextEditor {...args} defaultValue={"<p>Scroll down to see the sticky toolbar...</p><br>".repeat(50)} />
    </div>
  ),
};

export const BottomToolbar: Story = {
  args: {
    plugins: commonPlugins,
    toolbar: {
      floating: false,
      sticky: false,
      position: 'bottom',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Bottom Toolbar Demo:</strong> Toolbar appears at the bottom of the editor
      </div>
      <RichTextEditor {...args} />
    </div>
  ),
};

/**
 * MenuBar & StatusBar Configuration
 */
export const WithMenuBar: Story = {
  args: {
    plugins: commonPlugins,
    menubar: {
      enabled: true,
    },
    statusbar: {
      enabled: true,
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>MenuBar & StatusBar:</strong> Full editor UI with menu and status bar
      </div>
      <RichTextEditor {...args} defaultValue="<p>Type to see word count in status bar</p>" />
    </div>
  ),
};

export const NoMenuBar: Story = {
  args: {
    plugins: commonPlugins,
    menubar: {
      enabled: false,
    },
    statusbar: {
      enabled: false,
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Minimal UI:</strong> No menu bar or status bar for clean interface
      </div>
      <RichTextEditor {...args} />
    </div>
  ),
};

/**
 * Media Configuration Demo
 * Shows file size limits, allowed types, and upload handling
 */
export const MediaConfiguration: Story = {
  args: {
    plugins: commonPlugins,
    media: {
      maxFileSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/png', 'image/jpeg'],
      uploadHandler: async (file: File): Promise<{ url: string; name: string }> => {
        console.log('Uploading file:', file.name, file.size);
        // Simulate upload
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              url: URL.createObjectURL(file),
              name: file.name,
            });
          }, 1000);
        });
      },
      chunkedUpload: {
        enabled: true,
        chunkSize: 512 * 1024, // 512KB chunks
      },
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Media Upload:</strong> Max 2MB, PNG/JPEG only, with chunked upload
        <br />
        <small>Try uploading an image to test validation and progress tracking</small>
      </div>
      <RichTextEditor {...args} />
    </div>
  ),
};

/**
 * Paste Configuration Demo
 */
export const PasteConfiguration: Story = {
  args: {
    plugins: commonPlugins,
    paste: {
      pasteAsPlainText: false,
      cleanupPaste: true,
      pasteFilters: ['removeStyles', 'removeClasses'],
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Smart Paste:</strong> Paste cleanup enabled
        <br />
        <small>Try pasting formatted content from Word or web pages</small>
      </div>
      <RichTextEditor {...args} />
    </div>
  ),
};

export const PastePlainText: Story = {
  args: {
    plugins: commonPlugins,
    paste: {
      pasteAsPlainText: true,
      cleanupPaste: true,
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Paste as Plain Text:</strong> All formatting stripped on paste
        <br />
        <small>Try pasting formatted text - only plain text will be inserted</small>
      </div>
      <RichTextEditor {...args} />
    </div>
  ),
};

/**
 * Spellcheck Configuration Demo
 */
export const SpellcheckBrowser: Story = {
  args: {
    plugins: commonPlugins,
    spellcheck: {
      provider: 'browser',
      language: 'en-US',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Browser Spellcheck:</strong> Native browser spell checking enabled
        <br />
        <small>Type "teh" or "wrng" to see spell check in action</small>
      </div>
      <RichTextEditor {...args} defaultValue="<p>Teh quik brwn fox...</p>" />
    </div>
  ),
};

export const SpellcheckCustomDictionary: Story = {
  args: {
    plugins: commonPlugins,
    spellcheck: {
      provider: 'browser',
      language: 'en-US',
      customDictionary: ['editora', 'webpack', 'JavaScript'],
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Custom Dictionary:</strong> "editora", "webpack", "JavaScript" whitelisted
        <br />
        <small>These technical terms won't be flagged as misspelled</small>
      </div>
      <RichTextEditor {...args} defaultValue="<p>Using editora with webpack and JavaScript</p>" />
    </div>
  ),
};

/**
 * Autosave Configuration Demo
 */
export const AutosaveEnabled: Story = {
  args: {
    plugins: commonPlugins,
    autosave: {
      enabled: true,
      interval: 5000, // 5 seconds
      retention: 7 * 24 * 60 * 60 * 1000, // 7 days
      prefix: 'editora-autosave',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Autosave Enabled:</strong> Auto-saves every 5 seconds
        <br />
        <small>Type some content and refresh the page - your work will be restored</small>
      </div>
      <RichTextEditor {...args} />
    </div>
  ),
};

/**
 * History Configuration Demo
 */
export const HistoryConfiguration: Story = {
  args: {
    plugins: commonPlugins,
    history: {
      undoLevels: 50,
      undoTimeout: 300,
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>History Config:</strong> 50 undo levels, 300ms timeout
        <br />
        <small>Use Cmd/Ctrl+Z to undo, Cmd/Ctrl+Shift+Z to redo</small>
      </div>
      <RichTextEditor {...args} defaultValue="<p>Make changes and test undo/redo</p>" />
    </div>
  ),
};

/**
 * Accessibility Configuration Demo
 */
export const AccessibilityFull: Story = {
  args: {
    plugins: commonPlugins,
    accessibility: {
      keyboardNavigation: true,
      ariaLabels: true,
      highContrast: true,
      skipToContent: true,
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Full Accessibility:</strong> Keyboard nav, ARIA labels, high contrast
        <br />
        <small>Try navigating with Tab, use screen reader for ARIA announcements</small>
      </div>
      <RichTextEditor {...args} />
    </div>
  ),
};

/**
 * Performance Configuration Demo
 */
export const PerformanceOptimized: Story = {
  args: {
    plugins: commonPlugins,
    performance: {
      debounceDelay: 150,
      lazyLoading: true,
      virtualScrolling: true,
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Performance Mode:</strong> Debounced updates, lazy loading, virtual scrolling
        <br />
        <small>Optimized for large documents and fast typing</small>
      </div>
      <RichTextEditor {...args} />
    </div>
  ),
};

/**
 * Language & Direction Demo
 */
export const RTLLanguage: Story = {
  args: {
    plugins: commonPlugins,
    language: {
      ui: 'ar',
      direction: 'rtl',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>RTL Support:</strong> Right-to-left text direction for Arabic/Hebrew
        <br />
        <small>مرحبا بك في المحرر (Arabic text flows right to left)</small>
      </div>
      <RichTextEditor {...args} defaultValue="<p>مرحبا بك في editora</p>" />
    </div>
  ),
};

/**
 * Security Configuration Demo
 */
export const SecurityStrict: Story = {
  args: {
    plugins: commonPlugins,
    security: {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3'],
      allowedAttributes: ['class', 'style'],
      sanitizeHtml: true,
      cspNonce: 'random-nonce-123',
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Strict Security:</strong> Limited tags, sanitization enabled, CSP nonce
        <br />
        <small>Try pasting dangerous HTML - it will be sanitized</small>
      </div>
      <RichTextEditor {...args} />
    </div>
  ),
};

/**
 * Print Configuration Demo
 */
export const PrintConfiguration: Story = {
  args: {
    plugins: commonPlugins,
    print: {
      pageSize: 'A4',
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
      customStyles: `
        @media print {
          body { font-family: 'Times New Roman', serif; }
          h1 { page-break-before: always; }
        }
      `,
    },
  },
  render: (args) => (
    <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <strong>Print Settings:</strong> A4 page, custom margins, print-specific styles
        <br />
        <small>Use Print button in toolbar or Cmd/Ctrl+P</small>
      </div>
      <RichTextEditor {...args} defaultValue="<h1>Chapter 1</h1><p>Content here...</p>" />
    </div>
  ),
};

/**
 * EditorAPI Demo - Programmatic Control
 */
export const EditorAPIDemo: Story = {
  render: () => {
    const EditorAPIExample = () => {
      const [api, setApi] = useState<any>(null);
      const [content, setContent] = useState('<p>Initial content</p>');
      const [logs, setLogs] = useState<string[]>([]);

      const addLog = (message: string) => {
        setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
      };

      return (
        <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
          <div style={{ flex: 1, border: '1px solid #ddd' }}>
            <RichTextEditor
              plugins={commonPlugins}
              value={content}
              onChange={(html: string) => {
                console.log('[Story] onChange called with:', html);
                setContent(html);
                addLog('Content changed');
              }}
              onInit={(editorApi: any) => {
                setApi(editorApi);
                addLog('Editor initialized');
              }}
            />
          </div>
          <div style={{ width: '300px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>EditorAPI Controls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  const html = api?.getHTML() || '';
                  addLog(`Get HTML (${html.length} chars)`);
                  alert(html);
                }}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                Get HTML
              </button>
              <button
                onClick={() => {
                  api?.setHTML('<p>Programmatically set content!</p>');
                  addLog('Set HTML via API');
                }}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                Set HTML
              </button>
              <button
                onClick={() => {
                  api?.execCommand('bold');
                  addLog('Executed bold command');
                }}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                Toggle Bold
              </button>
              <button
                onClick={() => {
                  api?.focus();
                  addLog('Editor focused');
                }}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                Focus Editor
              </button>
              <button
                onClick={() => {
                  const state = api?.getState();
                  addLog(`Get state: ${state?.plugins.length || 0} plugins`);
                  console.log('Editor state:', state);
                }}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                Get State
              </button>
            </div>
            <div style={{ marginTop: '20px', padding: '10px', background: 'white', borderRadius: '4px', fontSize: '12px' }}>
              <strong>Activity Log:</strong>
              {logs.length === 0 && <div style={{ color: '#999', marginTop: '10px' }}>No activity yet</div>}
              {logs.map((log, i) => (
                <div key={i} style={{ marginTop: '5px', padding: '5px', background: '#f0f0f0', borderRadius: '3px' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return <EditorAPIExample />;
  },
};

/**
 * Complete Production Configuration
 * Shows all features working together
 */
export const ProductionReady: Story = {
  render: () => {
    const ProductionEditor = () => {
      const [api, setApi] = useState<any>(null);

      return (
        <div style={{ position: 'relative', height: '600px', border: '1px solid #ddd' }}>
          <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
            <strong>Production Configuration:</strong> All enterprise features enabled
            <br />
            <small>Autosave, accessibility, performance, security, RTL support, and more</small>
          </div>
          <RichTextEditor
            plugins={commonPlugins}
            
            // Toolbar
            toolbar={{
              floating: false,
              sticky: true,
              position: 'top',
            }}
            
            // UI
            menubar={{ enabled: true }}
            statusbar={{ enabled: true }}
            
            // Media
            media={{
              maxFileSize: 10 * 1024 * 1024,
              allowedTypes: ['image/png', 'image/jpeg', 'image/gif', 'video/mp4'],
              uploadHandler: async (file: File) => {
                console.log('Uploading:', file.name);
                return { url: URL.createObjectURL(file), name: file.name };
              },
              chunkedUpload: { enabled: true, chunkSize: 1024 * 1024 },
            }}
            
            // Content handling
            paste={{
              pasteAsPlainText: false,
              cleanupPaste: true,
              pasteFilters: ['removeStyles'],
            }}
            
            // Spellcheck
            spellcheck={{
              provider: 'browser',
              language: 'en-US',
              customDictionary: ['editora'],
            }}
            
            // Autosave
            autosave={{
              enabled: true,
              interval: 30000,
              retention: 7 * 24 * 60 * 60 * 1000,
            }}
            
            // History
            history={{
              undoLevels: 100,
              undoTimeout: 500,
            }}
            
            // Accessibility
            accessibility={{
              keyboardNavigation: true,
              ariaLabels: true,
              highContrast: false,
              skipToContent: true,
            }}
            
            // Performance
            performance={{
              debounceDelay: 300,
              lazyLoading: true,
              virtualScrolling: false,
            }}
            
            // Security
            security={{
              sanitizeHtml: true,
              allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'img', 'table', 'tr', 'td', 'th'],
              allowedAttributes: ['href', 'src', 'alt', 'class', 'style'],
            }}
            
            // Language
            language={{
              ui: 'en',
              direction: 'ltr',
            }}
            
            // Print
            print={{
              pageSize: 'A4',
              margins: { top: 20, right: 20, bottom: 20, left: 20 },
            }}
            
            // API
            onInit={(editorApi: any) => {
              setApi(editorApi);
              console.log('Editor ready with API:', editorApi);
            }}
            
            defaultValue="<h1>Production-Ready Editor</h1><p>This editor has all enterprise features configured for real-world use.</p>"
          />
        </div>
      );
    };

    return <ProductionEditor />;
  },
};
