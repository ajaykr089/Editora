import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";

// Import the light code editor library
import {
  createEditor,
  LineNumbersExtension,
  SyntaxHighlightingExtension,
  ThemeExtension,
  ReadOnlyExtension,
  SearchExtension,
  BracketMatchingExtension,
  CodeFoldingExtension
} from "@editora/light-code-editor";
import "../../packages/light-code-editor/dist/light-code-editor.css";

const meta: Meta = {
  title: "UI Components/Light Code Editor",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Light Code Editor - Lightweight Code Editor Library

**Bundle Size**: ~38 KB ES module (8.7 KB gzipped)  
**Features**: Syntax highlighting, themes, search, folding, extensions  
**Zero Dependencies**: Framework agnostic, works everywhere  

## Features
- ✅ Self-contained library (CSS included)
- ✅ Modular extension system
- ✅ HTML syntax highlighting
- ✅ Light and dark themes
- ✅ Line numbers gutter
- ✅ Search and replace
- ✅ Bracket matching
- ✅ Code folding
- ✅ Read-only mode
- ✅ TypeScript support
- ✅ Zero runtime dependencies
        `,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["light", "dark"],
      description: "Editor theme",
    },
    showLineNumbers: {
      control: { type: "boolean" },
      description: "Show line numbers",
    },
    syntaxHighlighting: {
      control: { type: "boolean" },
      description: "Enable syntax highlighting",
    },
    readOnly: {
      control: { type: "boolean" },
      description: "Read-only mode",
    },
    enableSearch: {
      control: { type: "boolean" },
      description: "Enable search functionality",
    },
    bracketMatching: {
      control: { type: "boolean" },
      description: "Enable bracket matching",
    },
    codeFolding: {
      control: { type: "boolean" },
      description: "Enable code folding",
    },
  },
};

export default meta;
type Story = StoryObj;

const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background-color: #f5f5f5;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    h1 {
      color: #333;
      text-align: center;
    }

    .highlight {
      background-color: #fff3cd;
      padding: 10px;
      border-left: 4px solid #ffc107;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Our Website</h1>

    <p>This is a sample HTML document demonstrating various elements and styling.</p>

    <div class="highlight">
      <strong>Note:</strong> This content is highlighted for emphasis.
    </div>

    <ul>
      <li>First item</li>
      <li>Second item with <a href="#">a link</a></li>
      <li>Third item</li>
    </ul>

    <button onclick="alert('Hello!')">Click me</button>

    <!-- This is a comment -->
    <p>End of document.</p>
  </div>

  <script>
    console.log("Page loaded successfully!");
  </script>
</body>
</html>`;

const LightCodeEditorDemo = ({
  theme = "dark",
  showLineNumbers = true,
  syntaxHighlighting = true,
  readOnly = false,
  enableSearch = true,
  bracketMatching = true,
  codeFolding = true
}: {
  theme?: string;
  showLineNumbers?: boolean;
  syntaxHighlighting?: boolean;
  readOnly?: boolean;
  enableSearch?: boolean;
  bracketMatching?: boolean;
  codeFolding?: boolean;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [currentContent, setCurrentContent] = useState(sampleHTML);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up previous instance
    if (editorInstanceRef.current) {
      editorInstanceRef.current.destroy?.();
    }

    // Create extensions array
    const extensions = [];

    if (showLineNumbers) {
      extensions.push(new LineNumbersExtension());
    }

    if (syntaxHighlighting) {
      extensions.push(new SyntaxHighlightingExtension());
    }

    extensions.push(new ThemeExtension());

    if (readOnly) {
      extensions.push(new ReadOnlyExtension());
    }

    if (enableSearch) {
      extensions.push(new SearchExtension());
    }

    if (bracketMatching) {
      extensions.push(new BracketMatchingExtension());
    }

    if (codeFolding) {
      extensions.push(new CodeFoldingExtension());
    }

    // Create editor instance
    editorInstanceRef.current = createEditor(editorRef.current, {
      value: currentContent,
      theme,
      readOnly,
      extensions
    });

    // Listen for changes
    editorInstanceRef.current.on('change', () => {
      const newContent = editorInstanceRef.current.getValue();
      setCurrentContent(newContent);
    });

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy?.();
      }
    };
  }, [theme, showLineNumbers, syntaxHighlighting, readOnly, enableSearch, bracketMatching, codeFolding]);

  const handleSearch = () => {
    if (editorInstanceRef.current && searchQuery) {
      const results = editorInstanceRef.current.search(searchQuery);
      console.log('Search results:', results);
    }
  };

  const handleReplace = () => {
    if (editorInstanceRef.current && searchQuery) {
      const replacement = prompt('Replace with:');
      if (replacement !== null) {
        const count = editorInstanceRef.current.replaceAll(searchQuery, replacement);
        alert(`Replaced ${count} occurrences`);
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const loadSampleContent = (contentType: string) => {
    let content = "";
    switch (contentType) {
      case "html":
        content = sampleHTML;
        break;
      case "minimal":
        content = `<!DOCTYPE html>
<html>
<head><title>Minimal</title></head>
<body>
  <h1>Hello World</h1>
  <p>This is a minimal HTML document.</p>
</body>
</html>`;
        break;
      case "complex":
        content = `<div class="wrapper">
  <header>
    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="home">
      <h1>Welcome</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <button class="btn-primary">Get Started</button>
    </section>

    <section id="about">
      <h2>About Us</h2>
      <div class="grid">
        <div class="card">
          <h3>Feature 1</h3>
          <p>Description of feature 1.</p>
        </div>
        <div class="card">
          <h3>Feature 2</h3>
          <p>Description of feature 2.</p>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <p>&copy; 2024 Company Name. All rights reserved.</p>
  </footer>
</div>`;
        break;
      case "broken":
        content = `<html>
<head>
  <title>Broken HTML</title>
<body>
  <h1>Unclosed heading
  <p>Missing closing tags
  <div class="broken">
    <span>Nested content
    <img src="image.jpg" alt="Missing quote>
  </div>
  <p>More content
</body>
</html>`;
        break;
    }
    setCurrentContent(content);
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue(content);
    }
  };

  return (
    <div style={{
      padding: "20px",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
      color: theme === "dark" ? "#f8f9fa" : "#333"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px 0",
        borderBottom: `1px solid ${theme === "dark" ? "#404040" : "#ddd"}`
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Light Code Editor Demo</h1>
          <p style={{ margin: "5px 0 0 0", opacity: 0.7 }}>
            Full-featured code editor with extensions
          </p>
        </div>
        <button
          onClick={toggleFullscreen}
          style={{
            padding: "8px 16px",
            backgroundColor: theme === "dark" ? "#007acc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {/* Controls */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        {/* Content Presets */}
        <div>
          <label style={{ marginRight: "10px", fontWeight: "bold" }}>Load Sample:</label>
          <select
            onChange={(e) => loadSampleContent(e.target.value)}
            style={{
              padding: "5px 10px",
              backgroundColor: theme === "dark" ? "#2d2d2d" : "white",
              color: theme === "dark" ? "#f8f9fa" : "#333",
              border: `1px solid ${theme === "dark" ? "#404040" : "#ddd"}`,
              borderRadius: "4px"
            }}
          >
            <option value="html">Full HTML</option>
            <option value="minimal">Minimal</option>
            <option value="complex">Complex Layout</option>
            <option value="broken">Broken HTML</option>
          </select>
        </div>

        {/* Search Controls */}
        {enableSearch && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#2d2d2d" : "white",
                color: theme === "dark" ? "#f8f9fa" : "#333",
                border: `1px solid ${theme === "dark" ? "#404040" : "#ddd"}`,
                borderRadius: "4px",
                width: "150px"
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#28a745" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Search
            </button>
            <button
              onClick={handleReplace}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#ffc107" : "#ffc107",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Replace All
            </button>
          </div>
        )}

        {/* Content Info */}
        <div style={{ marginLeft: "auto", fontSize: "14px", opacity: 0.7 }}>
          {currentContent.split('\n').length} lines, {currentContent.length} characters
        </div>
      </div>

      {/* Editor Container */}
      <div
        ref={editorRef}
        style={{
          flex: 1,
          border: `1px solid ${theme === "dark" ? "#404040" : "#ddd"}`,
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: theme === "dark" ? "#1e1e1e" : "white",
          minHeight: isFullscreen ? "calc(100vh - 140px)" : "500px"
        }}
      />

      {/* Footer */}
      <div style={{
        marginTop: "20px",
        padding: "10px 0",
        borderTop: `1px solid ${theme === "dark" ? "#404040" : "#ddd"}`,
        fontSize: "14px",
        opacity: 0.7
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            Active Extensions: {[
              showLineNumbers && "Line Numbers",
              syntaxHighlighting && "Syntax Highlighting",
              readOnly && "Read Only",
              enableSearch && "Search",
              bracketMatching && "Bracket Matching",
              codeFolding && "Code Folding"
            ].filter(Boolean).join(", ") || "None"}
          </div>
          <div>
            Theme: {theme} | Mode: {readOnly ? "Read-Only" : "Editable"}
          </div>
        </div>
      </div>
    </div>
  );
};

// Basic Editor Story
export const Basic: Story = {
  render: (args) => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "dark",
    showLineNumbers: true,
    syntaxHighlighting: true,
    readOnly: false,
    enableSearch: true,
    bracketMatching: true,
    codeFolding: true,
  },
};

// Minimal Editor Story
export const Minimal: Story = {
  render: (args) => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "light",
    showLineNumbers: false,
    syntaxHighlighting: false,
    readOnly: false,
    enableSearch: false,
    bracketMatching: false,
    codeFolding: false,
  },
};

// Read-Only Editor Story
export const ReadOnly: Story = {
  render: (args) => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "dark",
    showLineNumbers: true,
    syntaxHighlighting: true,
    readOnly: true,
    enableSearch: true,
    bracketMatching: true,
    codeFolding: true,
  },
};

// Light Theme Story
export const LightTheme: Story = {
  render: (args) => <LightCodeEditorDemo {...args} />,
  args: {
    theme: "light",
    showLineNumbers: true,
    syntaxHighlighting: true,
    readOnly: false,
    enableSearch: true,
    bracketMatching: true,
    codeFolding: true,
  },
};

// Feature Showcase Story
export const FeatureShowcase: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("syntax");

    const tabs = [
      { id: "syntax", label: "Syntax Highlighting", description: "HTML syntax highlighting with VS Code-style colors" },
      { id: "search", label: "Search & Replace", description: "Find and replace functionality across the document" },
      { id: "folding", label: "Code Folding", description: "Collapse and expand code sections" },
      { id: "brackets", label: "Bracket Matching", description: "Automatic bracket pair highlighting" },
      { id: "themes", label: "Themes", description: "Light and dark theme support" },
      { id: "readonly", label: "Read-Only Mode", description: "Prevent text modifications" },
    ];

    const getTabContent = () => {
      switch (activeTab) {
        case "syntax":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} />;
        case "search":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={true} bracketMatching={false} codeFolding={false} />;
        case "folding":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={true} />;
        case "brackets":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={true} codeFolding={false} />;
        case "themes":
          return <LightCodeEditorDemo theme="light" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} />;
        case "readonly":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} readOnly={true} enableSearch={true} bracketMatching={true} codeFolding={true} />;
        default:
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={true} bracketMatching={true} codeFolding={true} />;
      }
    };

    return (
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Tab Navigation */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#f8f9fa",
          padding: "0 20px"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "15px 20px",
                border: "none",
                backgroundColor: activeTab === tab.id ? "white" : "transparent",
                borderBottom: activeTab === tab.id ? "2px solid #007acc" : "2px solid transparent",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? "bold" : "normal",
                color: activeTab === tab.id ? "#007acc" : "#666"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Description */}
        <div style={{
          padding: "10px 20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #ddd",
          fontSize: "14px",
          color: "#666"
        }}>
          {tabs.find(tab => tab.id === activeTab)?.description}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {getTabContent()}
        </div>
      </div>
    );
  },
};