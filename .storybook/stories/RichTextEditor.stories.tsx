import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import { EditoraEditor } from "@editora/react";
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
import "@editora/themes/themes/acme.css";

// Import the Web Component build
// import "../../packages/core/dist/webcomponent.esm.js";

// Import native plugins
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  LinkPlugin,
  TablePlugin,
  ListPlugin,
  HistoryPlugin,
  ClearFormattingPlugin,
  HeadingPlugin,
  BlockquotePlugin,
  CodePlugin,
  CodeSamplePlugin,
  IndentPlugin,
  TextAlignmentPlugin,
  TextColorPlugin,
  BackgroundColorPlugin,
  FontSizePlugin,
  FontFamilyPlugin,
  LineHeightPlugin,
  FootnotePlugin,
  DirectionPlugin,
  CapitalizationPlugin,
  ChecklistPlugin,
  AnchorPlugin,
  EmbedIframePlugin,
  MathPlugin,
  MediaManagerPlugin,
  MergeTagPlugin,
  PageBreakPlugin,
  PrintPlugin,
  PreviewPlugin,
  SpecialCharactersPlugin,
  SpellCheckPlugin,
  EmojisPlugin,
  A11yCheckerPlugin,
  CommentsPlugin,
  DocumentManagerPlugin,
  FullscreenPlugin,
  TemplatePlugin,
  TrackChangesPlugin,
  MentionPlugin,
  SlashCommandsPlugin,
  VersionDiffPlugin,
  ConditionalContentPlugin,
  DataBindingPlugin,
  ContentRulesPlugin,
  CitationsPlugin,
  ApprovalWorkflowPlugin,
  PIIRedactionPlugin,
  SmartPastePlugin,
} from "@editora/plugins";
import { Box, Flex, Grid} from '@editora/ui-react';


const meta: Meta = {
  title: "Editor/Rich Text Editor - Web Component",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Editora Web Component - Framework Agnostic Rich Text Editor

**Bundle Size**: 115 KB minified (28.65 KB gzipped)  
**Native Plugins**: 40  
**Framework Dependencies**: 0  
**Supports**: React, Vue, Angular, Svelte, Vanilla JS

## Features
- ✅ Zero framework dependencies
- ✅ 91% bundle size reduction
- ✅ TinyMCE-style declarative API
- ✅ Works everywhere
- ✅ 37 native plugins including Code Sample, Media Manager, Math, Merge Tags, Page Break, Template, A11y Checker, Comments, and more
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// All native plugins
const allNativePlugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin(),
  ClearFormattingPlugin(),
  // ParagraphPlugin removed - paragraph option is in HeadingPlugin dropdown
  HeadingPlugin(),
  BlockquotePlugin(),
  CodePlugin(),
  CodeSamplePlugin(),
  ListPlugin(),
  ChecklistPlugin(),
  TextAlignmentPlugin(),
  IndentPlugin(),
  DirectionPlugin(),
  TextColorPlugin(),
  BackgroundColorPlugin(),
  FontSizePlugin(),
  FontFamilyPlugin(),
  LineHeightPlugin(),
  CapitalizationPlugin(),
  LinkPlugin(),
  TablePlugin(),
  AnchorPlugin(),
  EmbedIframePlugin(),
  MathPlugin(),
  MediaManagerPlugin(),
  MergeTagPlugin(),
  PageBreakPlugin(),
  PrintPlugin(),
  PreviewPlugin(),
  SpecialCharactersPlugin(),
  SpellCheckPlugin(),
  EmojisPlugin(),
  A11yCheckerPlugin(),
  CommentsPlugin(),
  DocumentManagerPlugin(),
  FullscreenPlugin(),
  TemplatePlugin(),
  HistoryPlugin(),
  FootnotePlugin(),
  TrackChangesPlugin(),
  VersionDiffPlugin(),
  ConditionalContentPlugin(),
  DataBindingPlugin({
    data: {
      user: { firstName: "Ava", lastName: "Miller" },
      order: { total: 1234.56, createdAt: "2026-03-03T12:00:00Z" },
    },
  }),
  ContentRulesPlugin({
    bannedWords: ["obviously", "simply"],
    requiredHeadings: ["Summary"],
    maxSentenceWords: 28,
    minReadabilityScore: 55,
    enableRealtime: true,
  }),
  CitationsPlugin({
    defaultStyle: "apa",
    enableFootnoteSync: true,
  }),
  ApprovalWorkflowPlugin({
    defaultStatus: "draft",
    lockOnApproval: true,
    defaultActor: "Editorial Lead",
  }),
  PIIRedactionPlugin({
    enableRealtime: true,
    redactionMode: "token",
    maxFindings: 120,
  }),
  SmartPastePlugin({
    defaultProfile: "balanced",
    maxHtmlLength: 220000,
  }),
  SlashCommandsPlugin(),
  MentionPlugin({
    items: [
      { id: "john.doe", label: "John Doe", meta: "john@acme.com" },
      { id: "sarah.lee", label: "Sarah Lee", meta: "sarah@acme.com" },
      { id: "ops.team", label: "Ops Team", meta: "team" },
    ],
  }),
];

/**
 * Basic usage with default configuration
 * All 37 native plugins loaded automatically
 */
export const Basic: Story = {
  render: () => (
    <EditoraEditor
      plugins={allNativePlugins}
      statusbar={{ enabled: true, position: "bottom" }}
      floatingToolbar={true}
      defaultValue={`
        <h2>Welcome to Editora!!</h2>
        <p>This is a <strong>framework-agnostic</strong> rich text editor with <mark style="background: #ffeb3b;">37 native plugins</mark>.</p>
        <p>✨ <strong>Key Features:</strong></p>
        <ul>
          <li>Zero framework dependencies</li>
          <li>115 KB minified (28.65 KB gzipped)</li>
          <li>91% smaller than before!</li>
          <li>Works with React, Vue, Angular, Svelte</li>
        </ul>
        <p>Try editing this content!</p>
      `}
    />
  ),
};

/**
 * Web Component API - TinyMCE Style Usage
 * Demonstrates using the global Editora API
 */
export const WebComponentAPI: Story = {
  render: () => {
    const editorRef = useRef<any>(null);
    const [output, setOutput] = useState("");
    const [pluginCount, setPluginCount] = useState(0);
    const [version, setVersion] = useState("");

    useEffect(() => {
      // Access the global Editora object
      if (typeof window !== 'undefined' && (window as any).Editora) {
        const Editora = (window as any).Editora;
        setVersion(Editora.version || "N/A");
        setPluginCount(Editora.plugins?.length || 0);
      }
    }, []);

    const getContent = () => {
      if (editorRef.current) {
        const content = editorRef.current.innerHTML;
        setOutput(content);
      }
    };

    const setContent = () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = `
          <h3>Content Set via API!</h3>
          <p>Updated at: ${new Date().toLocaleTimeString()}</p>
          <p>This was set using the Web Component API.</p>
        `;
      }
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#f5f5f5", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>🌐 Global Editora API</h4>
          <p style={{ margin: "5px 0" }}>Version: <strong>{version}</strong></p>
          <p style={{ margin: "5px 0" }}>Plugins Available: <strong>{pluginCount}</strong></p>
          <Flex style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button onClick={getContent} style={{ padding: "8px 16px" }}>Get Content</button>
            <button onClick={setContent} style={{ padding: "8px 16px" }}>Set Content</button>
          </Flex>
        </Box>

        <div ref={editorRef}>
          <EditoraEditor
            plugins={allNativePlugins}
            statusbar={{ enabled: true }}
            defaultValue={`
              <h3>Web Component API Demo</h3>
              <p>This editor can be controlled via the global <code>window.Editora</code> object.</p>
              <p>Try the buttons above to interact with the editor programmatically!</p>
            `}
          />
        </div>

        {output && (
          <Box style={{ marginTop: "20px", padding: "15px", background: "#e8f5e9", borderRadius: "4px" }}>
            <h4 style={{ margin: "0 0 10px 0" }}>📄 Output:</h4>
            <pre style={{ overflow: "auto", fontSize: "12px" }}>{output}</pre>
          </Box>
        )}
      </div>
    );
  },
};

/**
 * All 32 Native Plugins Showcase
 * Demonstrates every available plugin
 */
export const AllPluginsShowcase: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#e3f2fd", borderRadius: "4px" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🔌 All 32 Native Plugins Loaded</h3>
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", fontSize: "13px" }}>
          <div><strong>Basic Formatting (5):</strong><br/>Bold, Italic, Underline, Strikethrough, ClearFormatting</div>
          <div><strong>Block Types (4):</strong><br/>Paragraph, Heading, Blockquote, Code</div>
          <div><strong>Lists (2):</strong><br/>List, Checklist</div>
          <div><strong>Layout (3):</strong><br/>TextAlignment, Indent, Direction</div>
          <div><strong>Typography (6):</strong><br/>TextColor, BackgroundColor, FontSize, FontFamily, LineHeight, Capitalization</div>
          <div><strong>Content (6):</strong><br/>Link, Image, Table, Anchor, EmbedIframe, Footnote</div>
          <div><strong>Special (3):</strong><br/>Math, SpecialCharacters, Emojis</div>
          <div><strong>Tools (4):</strong><br/>A11yChecker, Comments, DocumentManager, Fullscreen</div>
          <div><strong>History (1):</strong><br/>History</div>
        </Grid>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
          <h1>🎨 All Plugin Features</h1>
          
          <h2>Basic Formatting</h2>
          <p><strong>Bold</strong>, <em>Italic</em>, <u>Underline</u>, <s>Strikethrough</s></p>
          
          <h2>Typography</h2>
          <p style="color: #e91e63;">Text Color</p>
          <p style="background-color: #ffeb3b;">Background Color</p>
          <p style="font-size: 18px;">Font Size: 18px</p>
          <p style="font-family: 'Courier New';">Font Family: Courier New</p>
          <p style="line-height: 2;">Line Height: 2.0</p>
          
          <h2>Text Alignment</h2>
          <p style="text-align: left;">Left aligned</p>
          <p style="text-align: center;">Center aligned</p>
          <p style="text-align: right;">Right aligned</p>
          <p style="text-align: justify;">Justified text with enough content to wrap and demonstrate the justification effect across multiple lines.</p>
          
          <h2>Lists</h2>
          <ul>
            <li>Bullet list item 1</li>
            <li>Bullet list item 2</li>
          </ul>
          <ol>
            <li>Numbered list item 1</li>
            <li>Numbered list item 2</li>
          </ol>
          
          <h2>Block Quotes</h2>
          <blockquote>
            "This is a blockquote. It can contain multiple paragraphs and formatting."
          </blockquote>
          
          <h2>Code</h2>
          <pre><code>function hello() {
  console.log("Hello, World!");
}</code></pre>
          
          <h2>Links & Media</h2>
          <p><a href="https://example.com">Click here for a link</a></p>
          
          <h2>Tables</h2>
          <table border="1">
            <tr><th>Header 1</th><th>Header 2</th></tr>
            <tr><td>Cell 1</td><td>Cell 2</td></tr>
            <tr><td>Cell 3</td><td>Cell 4</td></tr>
          </table>
          
          <p>Try using the toolbar to test all features! 🚀</p>
        `}
      />
    </div>
  ),
};

/**
 * Custom Toolbar Configuration
 * Demonstrates toolbar customization
 */
export const CustomToolbar: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#fff3e0", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 10px 0" }}>🎨 Custom Toolbar</h4>
        <p style={{ margin: 0, fontSize: "14px" }}>Only essential formatting tools are shown in the toolbar.</p>
      </Box>

      <EditoraEditor
        plugins={[
          BoldPlugin(),
          ItalicPlugin(),
          UnderlinePlugin(),
          StrikethroughPlugin(),
          LinkPlugin(),
          HistoryPlugin(),
        ]}
        statusbar={{ enabled: true }}
        toolbar={{
          items: "undo redo | bold italic underline strikethrough | link",
          sticky: true,
        }}
        defaultValue={`
          <h2>Minimal Editor</h2>
          <p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>
          <p>Perfect for comment sections, chat applications, or simple text input.</p>
        `}
      />
    </div>
  ),
};

/**
 * Readonly Mode
 * Demonstrates readonly editor for viewing content
 */
export const ReadonlyMode: Story = {
  render: () => {
    const [readonly, setReadonly] = useState(true);

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#f3e5f5", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>🔒 Readonly Mode</h4>
          <button onClick={() => setReadonly(!readonly)} style={{ padding: "8px 16px" }}>
            {readonly ? "Enable Editing" : "Disable Editing"}
          </button>
        </Box>

        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          readonly={readonly}
          defaultValue={`
            <h2>Readonly Content</h2>
            <p>This content is <strong>${readonly ? "readonly" : "editable"}</strong>.</p>
            <p>Click the button above to toggle editing mode.</p>
            <ul>
              <li>Perfect for previewing documents</li>
              <li>Displaying formatted content</li>
              <li>Review mode in collaborative editing</li>
            </ul>
          `}
        />
      </div>
    );
  },
};

/**
 * Test 6: Placeholder
 * Shows multiple placeholder examples in editor instances
 */
export const Test6Placeholder: Story = {
  render: () => {
    return (
      <div>
        <Box
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "#e3f2fd",
            borderRadius: "4px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>🧪 Test 6: Placeholder</h4>
          <p style={{ margin: 0, fontSize: "14px" }}>
            Three placeholder examples: simple, detailed guidance, and
            prefilled-content fallback.
          </p>
        </Box>

        <Grid
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 8px 0" }}>Simple Placeholder</h4>
            <EditoraEditor
              plugins={[BoldPlugin(), ItalicPlugin()]}
              toolbar={{ items: "bold italic", showMoreOptions: false }}
              statusbar={{ enabled: true }}
              placeholder="Type something here..."
            />
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0" }}>Detailed Placeholder</h4>
            <EditoraEditor
              plugins={[BoldPlugin(), ItalicPlugin(), UnderlinePlugin()]}
              toolbar={{
                items: "bold italic underline",
                showMoreOptions: false,
              }}
              statusbar={{ enabled: true }}
              placeholder="Draft release notes: summary, impact, migration steps, and rollback plan."
            />
          </div>

          <div>
            <h4 style={{ margin: "0 0 8px 0" }}>Prefilled Then Clear</h4>
            <EditoraEditor
              plugins={[BoldPlugin(), ItalicPlugin()]}
              toolbar={{ items: "bold italic", showMoreOptions: false }}
              statusbar={{ enabled: true }}
              placeholder="Delete all content to show this placeholder."
              defaultValue="<p>This editor starts with content. Clear it to reveal placeholder.</p>"
            />
          </div>
        </Grid>
      </div>
    );
  },
};

/**
 * Test 7: Theme Switcher (Editor Only)
 * Toggles theme on editor wrappers without changing Storybook page theme
 */
export const Test7ThemeSwitcherEditorOnly: Story = {
  render: () => {
    const [themeA, setThemeA] = useState<"default" | "dark" | "acme">("default");
    const [themeB, setThemeB] = useState<"default" | "dark" | "acme">("dark");

    const cycleTheme = (theme: "default" | "dark" | "acme") => {
      if (theme === "default") return "dark";
      if (theme === "dark") return "acme";
      return "default";
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#ede7f6", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>🎨 Test 7: Theme Switcher (Editor Only)</h4>
          <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>
            Switches only editor themes using wrapper-level attributes (`data-theme`).
          </p>
          <Flex style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={() => setThemeA(cycleTheme(themeA))} style={{ padding: "8px 16px" }}>
              Cycle Editor A
            </button>
            <button onClick={() => setThemeB(cycleTheme(themeB))} style={{ padding: "8px 16px" }}>
              Cycle Editor B
            </button>
            <button
              onClick={() => {
                setThemeA("dark");
                setThemeB("dark");
              }}
              style={{ padding: "8px 16px" }}
            >
              Set Both Dark
            </button>
            <button
              onClick={() => {
                setThemeA("default");
                setThemeB("default");
              }}
              style={{ padding: "8px 16px" }}
            >
              Set Both Default
            </button>
            <button
              onClick={() => {
                setThemeA("acme");
                setThemeB("acme");
              }}
              style={{ padding: "8px 16px" }}
            >
              Set Both Acme
            </button>
          </Flex>
          <p style={{ margin: "12px 0 0 0", fontSize: "13px" }}>
            Current themes: <strong>Editor A = {themeA}</strong>, <strong>Editor B = {themeB}</strong>
          </p>
        </Box>

        <Grid style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div
            data-theme={themeA}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: themeA === "dark" ? "#0b1220" : themeA === "acme" ? "#eef4fb" : "#ffffff",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                color: themeA === "dark" ? "#f8fafc" : themeA === "acme" ? "#0f4f4a" : "#111827",
              }}
            >
              Editor A
            </h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              floatingToolbar={true}
              defaultValue="<p>Editor A theme is controlled independently.</p>"
            />
          </div>

          <div
            data-theme={themeB}
            style={{
              padding: "10px",
              borderRadius: "8px",
              background: themeB === "dark" ? "#0b1220" : themeB === "acme" ? "#eef4fb" : "#ffffff",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px 0",
                color: themeB === "dark" ? "#f8fafc" : themeB === "acme" ? "#0f4f4a" : "#111827",
              }}
            >
              Editor B
            </h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              floatingToolbar={true}
              defaultValue="<p>Editor B can use a different theme from Editor A.</p>"
            />
          </div>
        </Grid>
      </div>
    );
  },
};

/**
 * Event Handling
 * Demonstrates onChange events and content tracking
 */
export const EventHandling: Story = {
  render: () => {
    const [content, setContent] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    const handleChange = (html: string) => {
      setContent(html);
      const text = html.replace(/<[^>]*>/g, "").trim();
      setWordCount(text.split(/\s+/).filter(Boolean).length);
      setCharCount(text.length);
    };

    return (
      <div>
        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          onChange={handleChange}
          defaultValue={`
            <h2>Try typing here!</h2>
            <p>Watch the statistics update in real-time as you type.</p>
          `}
        />

        <Box style={{ marginTop: "20px", padding: "15px", background: "#e8f5e9", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>📊 Statistics</h4>
          <p style={{ margin: "5px 0" }}>Words: <strong>{wordCount}</strong></p>
          <p style={{ margin: "5px 0" }}>Characters: <strong>{charCount}</strong></p>
          <details style={{ marginTop: "10px" }}>
            <summary style={{ cursor: "pointer" }}>Show HTML</summary>
            <pre style={{ fontSize: "12px", overflow: "auto", marginTop: "10px" }}>{content}</pre>
          </details>
        </Box>
      </div>
    );
  },
};

/**
 * Math Equations
 * Demonstrates the Math plugin with LaTeX support
 */
export const MathEquations: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#e1f5fe", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 10px 0" }}>🔢 Math Plugin</h4>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Insert mathematical equations using LaTeX notation. Click the Math button in the toolbar (fx).
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
          <h2>Mathematical Equations</h2>
          <p>Inline equation: <span data-math-inline="true" data-latex="E = mc^2" class="math-inline">$E = mc^2$</span></p>
          
          <p>Block equation:</p>
          <div data-math-block="true" data-latex="\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}" class="math-block">
            $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$
          </div>
          
          <p>Pythagorean theorem: <span data-math-inline="true" data-latex="a^2 + b^2 = c^2" class="math-inline">$a^2 + b^2 = c^2$</span></p>
          
          <p><strong>Try it:</strong> Use Cmd/Ctrl-Shift-M to open the math dialog!</p>
        `}
      />
    </div>
  ),
};

/**
 * Special Characters & Emojis
 * Demonstrates special character and emoji insertion
 */
export const SpecialContent: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#fce4ec", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 10px 0" }}>✨ Special Characters & Emojis</h4>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Insert special characters (Cmd/Ctrl-Shift-S) and emojis (Cmd/Ctrl-Shift-J).
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
          <h2>Special Characters & Emojis</h2>
          
          <h3>Special Characters</h3>
          <p>Common: © ® ™ § ¶ † ‡ • ★</p>
          <p>Arrows: → ← ↑ ↓ ↔ ⇒ ⇐</p>
          <p>Currency: $ € £ ¥ ₹ ₽</p>
          <p>Math: ± × ÷ ≠ ≤ ≥ ∞ ∑ ∫ √</p>
          <p>Greek: α β γ δ π σ θ Ω</p>
          
          <h3>Emojis</h3>
          <p>Smileys: 😀 😃 😄 😊 😍 🤩</p>
          <p>Gestures: 👍 👏 🙌 💪 ✌️ 🤝</p>
          <p>Objects: 💻 📱 📷 ⌚ 💡 🔋</p>
          <p>Nature: 🌵 🌲 🌹 🌸 ⭐ 🌞</p>
          
          <p><strong>Try it:</strong> Use the toolbar buttons to insert more!</p>
        `}
      />
    </div>
  ),
};

/**
 * Tables
 * Demonstrates table creation and editing
 */
export const Tables: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#f1f8e9", borderRadius: "4px" }}>
        <h4 style={{ margin: "0 0 10px 0" }}>📊 Table Plugin</h4>
        <p style={{ margin: 0, fontSize: "14px" }}>
          Create and edit tables with the table button in the toolbar.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
          <h2>Tables</h2>
          <p>Below is an example table:</p>
          
          <table border="1" style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 8px; background: #f5f5f5;">Feature</th>
                <th style="padding: 8px; background: #f5f5f5;">Status</th>
                <th style="padding: 8px; background: #f5f5f5;">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px;">Web Component</td>
                <td style="padding: 8px;">✅ Complete</td>
                <td style="padding: 8px;">100% framework-agnostic</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Native Plugins</td>
                <td style="padding: 8px;">✅ Complete</td>
                <td style="padding: 8px;">29 plugins available</td>
              </tr>
              <tr>
                <td style="padding: 8px;">Bundle Size</td>
                <td style="padding: 8px;">✅ Optimized</td>
                <td style="padding: 8px;">115 KB (91% reduction)</td>
              </tr>
            </tbody>
          </table>
          
          <p><strong>Try it:</strong> Click the table button to create a new table!</p>
        `}
      />
    </div>
  ),
};

/**
 * Multiple Editors
 * Demonstrates multiple editor instances on one page
 */
export const MultipleEditors: Story = {
  render: () => {
    const [contentA, setContentA] = useState("");
    const [contentB, setContentB] = useState("");

    const syncAtoB = () => {
      setContentB(contentA);
    };

    const syncBtoA = () => {
      setContentA(contentB);
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#fff9c4", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>👥 Multiple Editors</h4>
          <p style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
            Two independent editor instances with content synchronization.
          </p>
          <Flex style={{ display: "flex", gap: "10px" }}>
            <button onClick={syncAtoB} style={{ padding: "8px 16px" }}>Sync A → B</button>
            <button onClick={syncBtoA} style={{ padding: "8px 16px" }}>Sync B → A</button>
          </Flex>
        </Box>

        <Grid style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <h4>Editor A</h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              onChange={setContentA}
              defaultValue="<h3>Editor A</h3><p>Type here...</p>"
            />
          </div>
          <div>
            <h4>Editor B</h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              value={contentB}
              onChange={setContentB}
              defaultValue="<h3>Editor B</h3><p>Type here...</p>"
            />
          </div>
        </Grid>
      </div>
    );
  },
};

/**
 * Controlled Editor
 * Demonstrates controlled component pattern
 */
export const ControlledEditor: Story = {
  render: () => {
    const [value, setValue] = useState(`
      <h2>Controlled Editor</h2>
      <p>This editor's content is controlled by React state.</p>
    `);

    const resetContent = () => {
      setValue(`
        <h2>Reset!</h2>
        <p>Content was reset at ${new Date().toLocaleTimeString()}</p>
      `);
    };

    const appendContent = () => {
      setValue(prev => prev + `<p>Appended at ${new Date().toLocaleTimeString()}</p>`);
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#e0f2f1", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>🎛️ Controlled Component</h4>
          <Flex style={{ display: "flex", gap: "10px" }}>
            <button onClick={resetContent} style={{ padding: "8px 16px" }}>Reset Content</button>
            <button onClick={appendContent} style={{ padding: "8px 16px" }}>Append Content</button>
          </Flex>
        </Box>

        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

/**
 * Performance - Large Document
 * Tests editor with large content
 */
export const PerformanceLargeDocument: Story = {
  render: () => {
    const generateLargeContent = () => {
      let content = "<h1>Large Document Performance Test</h1>";
      content += "<p><strong>This document contains 100 paragraphs to test performance.</strong></p>";
      
      for (let i = 1; i <= 100; i++) {
        content += `<h3>Section ${i}</h3>`;
        content += `<p>This is paragraph ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`;
        if (i % 10 === 0) {
          content += `<blockquote>Milestone: Completed ${i} sections!</blockquote>`;
        }
      }
      
      return content;
    };

    return (
      <div>
        <Box style={{ marginBottom: "20px", padding: "15px", background: "#ffebee", borderRadius: "4px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>⚡ Performance Test</h4>
          <p style={{ margin: 0, fontSize: "14px" }}>
            This editor contains 100 sections (300+ paragraphs) to test performance with large documents.
          </p>
        </Box>

        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          defaultValue={generateLargeContent()}
        />
      </div>
    );
  },
};

/**
 * Framework Independence Demo
 * Shows that the same editor works in different contexts
 */
export const FrameworkIndependence: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: "20px", padding: "15px", background: "#f3e5f5", borderRadius: "4px" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🌐 Framework Independence</h3>
        <p style={{ margin: 0, fontSize: "14px" }}>
          This same editor can be used in React (shown here), Vue, Angular, Svelte, or vanilla JavaScript!
        </p>
        
        <Grid style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", fontSize: "13px" }}>
          <Box style={{ padding: "10px", background: "white", borderRadius: "4px" }}>
            <strong>React:</strong><br/>
            <code style={{ fontSize: "11px" }}>&lt;EditoraEditor /&gt;</code>
          </Box>
          <Box style={{ padding: "10px", background: "white", borderRadius: "4px" }}>
            <strong>Vanilla JS:</strong><br/>
            <code style={{ fontSize: "11px" }}>&lt;editora-editor&gt;</code>
          </Box>
          <Box style={{ padding: "10px", background: "white", borderRadius: "4px" }}>
            <strong>Vue:</strong><br/>
            <code style={{ fontSize: "11px" }}>&lt;editora-editor&gt;</code>
          </Box>
          <Box style={{ padding: "10px", background: "white", borderRadius: "4px" }}>
            <strong>Angular:</strong><br/>
            <code style={{ fontSize: "11px" }}>&lt;editora-editor&gt;</code>
          </Box>
        </Grid>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
          <h2>🚀 Universal Editor</h2>
          <p><strong>Zero framework dependencies!</strong></p>
          
          <h3>✅ Works With:</h3>
          <ul>
            <li>React (this example)</li>
            <li>Vue.js</li>
            <li>Angular</li>
            <li>Svelte</li>
            <li>Vanilla JavaScript</li>
            <li>Any web framework</li>
          </ul>
          
          <h3>📦 Bundle Benefits:</h3>
          <ul>
            <li><strong>115 KB</strong> minified</li>
            <li><strong>28.65 KB</strong> gzipped</li>
            <li><strong>91% smaller</strong> than before</li>
            <li>No React in production bundle</li>
          </ul>
          
          <blockquote>
            "Build once, use everywhere!"
          </blockquote>
        `}
      />
    </div>
  ),
};
