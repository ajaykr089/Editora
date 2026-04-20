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
  CodeFoldingExtension,
  DiagnosticsExtension,
  CompletionExtension,
  FormattingExtension,
  type EditorDecoration,
  type EditorDiagnostic,
  type CompletionContext,
  type CompletionItem,
  type CompletionResult,
  type Formatter
} from "@editora/light-code-editor";
import "../../packages/light-code-editor/dist/light-code-editor.css";
import { Box, Flex} from '@editora/ui-react';


const meta: Meta = {
  title: "UI Components/Light Code Editor",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Light Code Editor - Lightweight Code Editor Library

**Bundle Size**: ~38 KB ES module (8.7 KB gzipped)  
**Features**: Syntax highlighting, themes, search, completion, formatting, folding, extensions  
**Zero Dependencies**: Framework agnostic, works everywhere  

## Features
- ✅ Self-contained library (CSS included)
- ✅ Modular extension system
- ✅ HTML syntax highlighting
- ✅ Light and dark themes
- ✅ Line numbers gutter
- ✅ Search and replace
- ✅ Provider-based completions
- ✅ Pluggable document and selection formatting
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
    showDecorations: {
      control: { type: "boolean" },
      description: "Demonstrate line, gutter, and inline decorations",
    },
    enableDiagnostics: {
      control: { type: "boolean" },
      description: "Enable diagnostics extension demo with gutter markers and inline issues",
    },
    enableCompletions: {
      control: { type: "boolean" },
      description: "Enable autocomplete popup demo with keyboard navigation and insertion",
    },
    enableFormatting: {
      control: { type: "boolean" },
      description: "Enable formatter extension demo with document and selection commands",
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

function findLineIndex(
  lines: string[],
  matchers: string[],
  fallbackIndex = 0,
): number {
  for (const matcher of matchers) {
    const index = lines.findIndex((line) => line.includes(matcher));
    if (index !== -1) {
      return index;
    }
  }

  return Math.max(
    0,
    Math.min(
      fallbackIndex,
      Math.max(0, lines.length - 1),
    ),
  );
}

function buildDecorationDemo(text: string, toggles: {
  line: boolean;
  gutter: boolean;
  inline: boolean;
}): EditorDecoration[] {
  const lines = text.split("\n");
  const activeLine = findLineIndex(lines, [
    '<div class="highlight">',
    "<button",
    "<section id=\"about\">",
    "<h1>Hello World</h1>",
    "Missing closing tags",
  ], 0);
  const issueLine = findLineIndex(lines, [
    "onclick=",
    "Missing closing tags",
    "<img ",
    "Get Started",
    "<button",
  ], activeLine);
  const issueLineText = lines[issueLine] || "";

  const inlineTarget =
    ["alert", "Missing closing tags", "Get Started", "<img", "Click me"]
      .find((candidate) => issueLineText.includes(candidate)) ||
    issueLineText.trim().split(/\s+/)[0] ||
    "";
  const inlineStart = inlineTarget ? issueLineText.indexOf(inlineTarget) : -1;
  const decorations: EditorDecoration[] = [];

  if (toggles.line) {
    decorations.push({
      id: "storybook-active-line",
      type: "line",
      line: activeLine,
      className: "lce-decoration-line--active",
      style: {
        backgroundColor: "rgba(56, 189, 248, 0.12)",
        boxShadow: "inset 0 0 0 1px rgba(56, 189, 248, 0.22)",
      },
    });
  }

  if (toggles.gutter) {
    decorations.push({
      id: "storybook-gutter-warning",
      type: "gutter",
      line: issueLine,
      label: "●",
      title: "Storybook decoration marker",
      className: "lce-decoration-gutter--error",
      style: {
        paddingRight: "8px",
      },
    });
  }

  if (toggles.inline && inlineStart >= 0 && inlineTarget.length > 0) {
    decorations.push({
      id: "storybook-inline-highlight",
      type: "inline",
      range: {
        start: { line: issueLine, column: inlineStart },
        end: { line: issueLine, column: inlineStart + inlineTarget.length },
      },
      style: {
        backgroundColor: "rgba(248, 113, 113, 0.2)",
        textDecoration: "underline wavy rgba(248, 113, 113, 0.95)",
      },
    });
  }

  return decorations;
}

function buildDiagnosticsDemo(text: string): EditorDiagnostic[] {
  const lines = text.split("\n");
  const issueLine = findLineIndex(lines, [
    "onclick=",
    "Missing closing tags",
    "<img ",
    "Get Started",
    "<button",
  ], 0);
  const issueLineText = lines[issueLine] || "";

  const messageTarget =
    ["alert", "Missing closing tags", "Get Started", "<img", "Click me"]
      .find((candidate) => issueLineText.includes(candidate)) ||
    issueLineText.trim().split(/\s+/)[0] ||
    "issue";
  const messageStart = Math.max(0, issueLineText.indexOf(messageTarget));

  const infoLine = findLineIndex(lines, [
    "<div class=\"highlight\">",
    "<section id=\"about\">",
    "<h1>Hello World</h1>",
  ], issueLine);
  const infoLineText = lines[infoLine] || "";
  const infoTarget =
    ["highlight", "About", "Hello World"]
      .find((candidate) => infoLineText.includes(candidate)) ||
    infoLineText.trim().split(/\s+/)[0] ||
    "note";
  const infoStart = Math.max(0, infoLineText.indexOf(infoTarget));

  const diagnostics: EditorDiagnostic[] = [
    {
      id: "story-error",
      severity: "error",
      message: issueLineText.includes("Missing closing tags")
        ? "Unclosed or malformed markup"
        : "Inline handler needs review",
      source: "storybook",
      code: issueLineText.includes("Missing closing tags") ? "HTML001" : "SEC201",
      range: {
        start: { line: issueLine, column: messageStart },
        end: { line: issueLine, column: messageStart + Math.max(1, messageTarget.length) },
      },
    },
  ];

  if (infoLineText.trim().length > 0) {
    diagnostics.push({
      id: "story-info",
      severity: issueLineText.includes("Missing closing tags") ? "warning" : "info",
      message: issueLineText.includes("Missing closing tags")
        ? "Parser recovery may shift following nodes"
        : "Decorative content block worth reviewing",
      source: "storybook",
      code: issueLineText.includes("Missing closing tags") ? "HTML014" : "UX110",
      range: {
        start: { line: infoLine, column: infoStart },
        end: { line: infoLine, column: infoStart + Math.max(1, infoTarget.length) },
      },
    });
  }

  return diagnostics;
}

const htmlTagSuggestions = [
  "article",
  "button",
  "div",
  "footer",
  "form",
  "header",
  "img",
  "input",
  "label",
  "li",
  "main",
  "nav",
  "option",
  "p",
  "section",
  "select",
  "span",
  "strong",
  "textarea",
  "ul",
];

const htmlAttributeSuggestions = [
  "alt",
  "aria-label",
  "class",
  "data-testid",
  "disabled",
  "href",
  "id",
  "name",
  "placeholder",
  "role",
  "src",
  "title",
  "type",
  "value",
];

function buildCompletionDemo(context: CompletionContext): CompletionItem[] | CompletionResult {
  const cursor = context.cursor.position;
  const beforeCursor = context.lineText.slice(0, cursor.column);
  const tagMatch = beforeCursor.match(/<\/?([A-Za-z0-9-]*)$/);

  if (tagMatch) {
    const typedPrefix = (tagMatch[1] || "").toLowerCase();
    return {
      from: {
        start: { line: cursor.line, column: cursor.column - tagMatch[1].length },
        end: { line: cursor.line, column: cursor.column },
      },
      items: htmlTagSuggestions
        .filter((tag) => tag.startsWith(typedPrefix))
        .map((tag) => ({
          label: tag,
          insertText: tag,
          kind: "tag",
          detail: `<${tag}>`,
          description: "HTML tag suggestion from the Storybook completion provider",
        })),
    };
  }

  const openTagMatch = beforeCursor.match(/<([A-Za-z][A-Za-z0-9-]*)([^>]*)$/);
  const attributeMatch = beforeCursor.match(/\s([A-Za-z:_-]*)$/);
  if (openTagMatch && attributeMatch) {
    const typedPrefix = (attributeMatch[1] || "").toLowerCase();
    return {
      from: {
        start: { line: cursor.line, column: cursor.column - attributeMatch[1].length },
        end: { line: cursor.line, column: cursor.column },
      },
      items: htmlAttributeSuggestions
        .filter((attribute) => attribute.startsWith(typedPrefix))
        .map((attribute) => ({
          label: attribute,
          insertText: `${attribute}=""`,
          kind: "attribute",
          detail: openTagMatch[1],
          description: "Press Enter or Tab to insert the attribute template",
        })),
    };
  }

  if (!context.explicit && context.prefix.length === 0) {
    return [];
  }

  return [
    ...htmlTagSuggestions.slice(0, 8).map((tag) => ({
      label: tag,
      insertText: tag,
      kind: "tag" as const,
      detail: `<${tag}>`,
      description: "Manual completion suggestion",
    })),
    ...htmlAttributeSuggestions.slice(0, 6).map((attribute) => ({
      label: attribute,
      insertText: `${attribute}=""`,
      kind: "attribute" as const,
      detail: "attribute",
      description: "Manual completion suggestion",
    })),
  ].filter((item) => {
    const prefix = context.prefix.toLowerCase();
    if (!prefix) {
      return true;
    }
    return item.label.toLowerCase().includes(prefix);
  });
}

const htmlVoidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function formatCssDemo(input: string): string {
  const normalized = input
    .replace(/\r\n?/g, "\n")
    .replace(/\s*{\s*/g, " {\n")
    .replace(/;\s*/g, ";\n")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalized) {
    return "";
  }

  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const output: string[] = [];
  let depth = 0;

  for (const line of lines) {
    if (line === "}") {
      depth = Math.max(0, depth - 1);
    }

    output.push(`${"  ".repeat(depth)}${line}`);

    if (line.endsWith("{")) {
      depth += 1;
    }
  }

  return output.join("\n");
}

function looksLikeCss(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed || /</.test(trimmed)) {
    return false;
  }

  return /{[\s\S]*}/.test(trimmed) && /[A-Za-z-]+\s*:/.test(trimmed);
}

function formatHtmlDemo(input: string): string {
  const normalized = input.replace(/\r\n?/g, "\n").trim();

  if (!normalized) {
    return "";
  }

  const tokens = normalized.match(
    /<!--[\s\S]*?-->|<!DOCTYPE[\s\S]*?>|<style\b[^>]*>[\s\S]*?<\/style>|<script\b[^>]*>[\s\S]*?<\/script>|<\/?[A-Za-z][^>]*?>|[^<]+/gi,
  ) || [];
  const output: string[] = [];
  let depth = 0;

  for (const token of tokens) {
    const line = token.trim();
    if (!line) {
      continue;
    }

    const styleBlockMatch = line.match(/^<style\b([^>]*)>([\s\S]*?)<\/style>$/i);
    if (styleBlockMatch) {
      output.push(`${"  ".repeat(depth)}<style${styleBlockMatch[1]}>`);

      const formattedCss = formatCssDemo(styleBlockMatch[2]);
      if (formattedCss) {
        formattedCss.split("\n").forEach((cssLine) => {
          output.push(`${"  ".repeat(depth + 1)}${cssLine}`);
        });
      }

      output.push(`${"  ".repeat(depth)}</style>`);
      continue;
    }

    const scriptBlockMatch = line.match(/^<script\b([^>]*)>([\s\S]*?)<\/script>$/i);
    if (scriptBlockMatch) {
      output.push(`${"  ".repeat(depth)}<script${scriptBlockMatch[1]}>`);

      const scriptBody = scriptBlockMatch[2]
        .split("\n")
        .map((scriptLine) => scriptLine.trim())
        .filter((scriptLine) => scriptLine.length > 0);
      scriptBody.forEach((scriptLine) => {
        output.push(`${"  ".repeat(depth + 1)}${scriptLine}`);
      });

      output.push(`${"  ".repeat(depth)}</script>`);
      continue;
    }

    if (!/^</.test(line)) {
      line
        .split(/\n+/)
        .map((textLine) => textLine.trim())
        .filter((textLine) => textLine.length > 0)
        .forEach((textLine) => {
          output.push(`${"  ".repeat(depth)}${textLine}`);
        });
      continue;
    }

    const closingTag = /^<\//.test(line);
    const closingBlock = /^<\/(?!html|body)/.test(line);
    if (closingTag || closingBlock) {
      depth = Math.max(0, depth - 1);
    }

    output.push(`${"  ".repeat(depth)}${line}`);

    if (shouldIndentHtmlLine(line)) {
      depth += 1;
    }
  }

  return output.join("\n");
}

function shouldIndentHtmlLine(line: string): boolean {
  if (!/^</.test(line)) {
    return false;
  }

  if (/^<\//.test(line) || /^<!--/.test(line) || /^<!DOCTYPE/i.test(line)) {
    return false;
  }

  if (/\/>$/.test(line)) {
    return false;
  }

  const tagMatch = line.match(/^<([A-Za-z][A-Za-z0-9-]*)/);
  const tagName = tagMatch?.[1]?.toLowerCase();
  if (!tagName || htmlVoidTags.has(tagName)) {
    return false;
  }

  if (new RegExp(`^<${tagName}\\b[^>]*>.*</${tagName}>$`, "i").test(line)) {
    return false;
  }

  return true;
}

const buildFormattingDemo: Formatter = async (context) => {
  await new Promise((resolve) => window.setTimeout(resolve, 120));

  if (context.abortSignal?.aborted) {
    return context.input;
  }

  if (looksLikeCss(context.input)) {
    return formatCssDemo(context.input);
  }

  return formatHtmlDemo(context.input);
};

const LightCodeEditorDemo = ({
  theme = "dark",
  showLineNumbers = true,
  syntaxHighlighting = true,
  readOnly = false,
  enableSearch = true,
  bracketMatching = true,
  codeFolding = true,
  showDecorations = true,
  enableDiagnostics = false,
  enableCompletions = false,
  enableFormatting = false,
}: {
  theme?: string;
  showLineNumbers?: boolean;
  syntaxHighlighting?: boolean;
  readOnly?: boolean;
  enableSearch?: boolean;
  bracketMatching?: boolean;
  codeFolding?: boolean;
  showDecorations?: boolean;
  enableDiagnostics?: boolean;
  enableCompletions?: boolean;
  enableFormatting?: boolean;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const diagnosticsExtensionRef = useRef<DiagnosticsExtension | null>(null);
  const completionExtensionRef = useRef<CompletionExtension | null>(null);
  const formattingExtensionRef = useRef<FormattingExtension | null>(null);
  const [currentContent, setCurrentContent] = useState(sampleHTML);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lineDecorationsEnabled, setLineDecorationsEnabled] = useState(showDecorations);
  const [gutterDecorationsEnabled, setGutterDecorationsEnabled] = useState(showDecorations);
  const [inlineDecorationsEnabled, setInlineDecorationsEnabled] = useState(showDecorations);

  useEffect(() => {
    setLineDecorationsEnabled(showDecorations);
    setGutterDecorationsEnabled(showDecorations);
    setInlineDecorationsEnabled(showDecorations);
  }, [showDecorations]);

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

    if (enableDiagnostics) {
      diagnosticsExtensionRef.current = new DiagnosticsExtension({
        showStatusBar: true,
        clearOnChange: false,
      });
      extensions.push(diagnosticsExtensionRef.current);
    } else {
      diagnosticsExtensionRef.current = null;
    }

    if (enableCompletions) {
      completionExtensionRef.current = new CompletionExtension({
        minPrefixLength: 1,
        triggerCharacters: ["<", "/", ":"],
        providers: [buildCompletionDemo],
      });
      extensions.push(completionExtensionRef.current);
    } else {
      completionExtensionRef.current = null;
    }

    if (enableFormatting) {
      formattingExtensionRef.current = new FormattingExtension({
        formatter: buildFormattingDemo,
        showStatusBar: true,
        timeoutMs: 2500,
      });
      extensions.push(formattingExtensionRef.current);
    } else {
      formattingExtensionRef.current = null;
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
  }, [theme, showLineNumbers, syntaxHighlighting, readOnly, enableSearch, bracketMatching, codeFolding, enableDiagnostics, enableCompletions, enableFormatting]);

  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (!editor) {
      return;
    }

    const layerName = "storybook-demo";
    const hasAnyDecorations =
      lineDecorationsEnabled || gutterDecorationsEnabled || inlineDecorationsEnabled;

    if (!showDecorations || !hasAnyDecorations) {
      editor.clearDecorations?.(layerName);
      return;
    }

    editor.setDecorations?.(
      layerName,
      buildDecorationDemo(currentContent, {
        line: lineDecorationsEnabled,
        gutter: gutterDecorationsEnabled,
        inline: inlineDecorationsEnabled,
      }),
    );
  }, [
    currentContent,
    showDecorations,
    lineDecorationsEnabled,
    gutterDecorationsEnabled,
    inlineDecorationsEnabled,
  ]);

  useEffect(() => {
    if (!enableDiagnostics) {
      diagnosticsExtensionRef.current?.clearDiagnostics();
      return;
    }

    diagnosticsExtensionRef.current?.setDiagnostics(
      buildDiagnosticsDemo(currentContent),
    );
  }, [currentContent, enableDiagnostics]);

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

  const selectFormattingSample = () => {
    const editor = editorInstanceRef.current;
    if (!editor) {
      return;
    }

    const startToken =
      currentContent.includes('<div class="highlight">')
        ? '<div class="highlight">'
        : currentContent.includes('<section id="about">')
          ? '<section id="about">'
          : currentContent.includes("<header>")
            ? "<header>"
            : "";
    if (!startToken) {
      return;
    }

    const startOffset = currentContent.indexOf(startToken);
    const closingTag = startToken.startsWith("<section")
      ? "</section>"
      : startToken === "<header>"
        ? "</header>"
        : "</div>";
    const endTokenOffset = currentContent.indexOf(closingTag, startOffset);
    const endOffset =
      endTokenOffset >= 0 ? endTokenOffset + closingTag.length : startOffset + startToken.length;

    const offsetToPosition = (text: string, offset: number) => {
      const boundedOffset = Math.max(0, Math.min(offset, text.length));
      let line = 0;
      let column = 0;
      for (let index = 0; index < boundedOffset; index++) {
        if (text[index] === "\n") {
          line += 1;
          column = 0;
        } else {
          column += 1;
        }
      }
      return { line, column };
    };

    editor.setSelection({
      start: offsetToPosition(currentContent, startOffset),
      end: offsetToPosition(currentContent, endOffset),
    });
    editor.focus();
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
      case "messy":
        content = `<div class="wrapper"><header><nav><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li></ul></nav></header><main><section id="about"><h2>About Us</h2><div class="grid"><div class="card"><h3>Feature 1</h3><p>Description of feature 1.</p></div><div class="card"><h3>Feature 2</h3><p>Description of feature 2.</p></div></div></section></main></div>`;
        break;
    }
    setCurrentContent(content);
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue(content);
    }
  };

  return (
    <Flex style={{
      padding: "20px",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#f5f5f5",
      color: theme === "dark" ? "#f8f9fa" : "#333"
    }}>
      {/* Header */}
      <Flex style={{
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
      </Flex>

      {/* Controls */}
      <Flex style={{
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
            <option value="messy">Messy Markup</option>
            <option value="broken">Broken HTML</option>
          </select>
        </div>

        {/* Search Controls */}
        {enableSearch && (
          <Flex style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
          </Flex>
        )}

        {showDecorations && (
          <Flex style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontWeight: "bold" }}>Decorations:</span>
            <button
              onClick={() => setLineDecorationsEnabled((prev) => !prev)}
              style={{
                padding: "5px 10px",
                backgroundColor: lineDecorationsEnabled ? "#0ea5e9" : "transparent",
                color: lineDecorationsEnabled ? "white" : theme === "dark" ? "#f8f9fa" : "#333",
                border: `1px solid ${lineDecorationsEnabled ? "#0ea5e9" : theme === "dark" ? "#404040" : "#ddd"}`,
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Line
            </button>
            <button
              onClick={() => setGutterDecorationsEnabled((prev) => !prev)}
              style={{
                padding: "5px 10px",
                backgroundColor: gutterDecorationsEnabled ? "#f97316" : "transparent",
                color: gutterDecorationsEnabled ? "white" : theme === "dark" ? "#f8f9fa" : "#333",
                border: `1px solid ${gutterDecorationsEnabled ? "#f97316" : theme === "dark" ? "#404040" : "#ddd"}`,
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Gutter
            </button>
            <button
              onClick={() => setInlineDecorationsEnabled((prev) => !prev)}
              style={{
                padding: "5px 10px",
                backgroundColor: inlineDecorationsEnabled ? "#ef4444" : "transparent",
                color: inlineDecorationsEnabled ? "white" : theme === "dark" ? "#f8f9fa" : "#333",
                border: `1px solid ${inlineDecorationsEnabled ? "#ef4444" : theme === "dark" ? "#404040" : "#ddd"}`,
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Inline
            </button>
          </Flex>
        )}

        {enableDiagnostics && (
          <Flex style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontWeight: "bold" }}>Diagnostics:</span>
            <button
              onClick={() => editorInstanceRef.current?.executeCommand?.("prevDiagnostic")}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#334155" : "#e2e8f0",
                color: theme === "dark" ? "#f8f9fa" : "#0f172a",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Prev Issue
            </button>
            <button
              onClick={() => editorInstanceRef.current?.executeCommand?.("nextDiagnostic")}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#7c3aed" : "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Next Issue
            </button>
            <button
              onClick={() => diagnosticsExtensionRef.current?.setDiagnostics(buildDiagnosticsDemo(currentContent))}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#0f766e" : "#0d9488",
                color: "white",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Reload Issues
            </button>
            <button
              onClick={() => diagnosticsExtensionRef.current?.clearDiagnostics()}
              style={{
                padding: "5px 10px",
                backgroundColor: "transparent",
                color: theme === "dark" ? "#f8f9fa" : "#333",
                border: `1px solid ${theme === "dark" ? "#404040" : "#ddd"}`,
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Clear Issues
            </button>
          </Flex>
        )}

        {enableCompletions && !readOnly && (
          <Flex style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontWeight: "bold" }}>Completion:</span>
            <button
              onClick={() => editorInstanceRef.current?.executeCommand?.("showCompletions")}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#0f766e" : "#0ea5e9",
                color: "white",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Trigger Completion
            </button>
            <Box style={{ fontSize: "12px", opacity: 0.75 }}>
              Try typing <code>&lt;di</code>, <code>&lt;/</code>, or an attribute like <code>cla</code> inside a tag. Shortcut: Ctrl/Cmd + Space.
            </Box>
          </Flex>
        )}

        {enableFormatting && !readOnly && (
          <Flex style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontWeight: "bold" }}>Formatting:</span>
            <button
              onClick={() => editorInstanceRef.current?.executeCommand?.("formatDocument")}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#0369a1" : "#0284c7",
                color: "white",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Format Document
            </button>
            <button
              onClick={() => editorInstanceRef.current?.executeCommand?.("formatSelection")}
              style={{
                padding: "5px 10px",
                backgroundColor: theme === "dark" ? "#1d4ed8" : "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Format Selection
            </button>
            <button
              onClick={selectFormattingSample}
              style={{
                padding: "5px 10px",
                backgroundColor: "transparent",
                color: theme === "dark" ? "#f8f9fa" : "#333",
                border: `1px solid ${theme === "dark" ? "#404040" : "#ddd"}`,
                borderRadius: "999px",
                cursor: "pointer"
              }}
            >
              Select Demo Block
            </button>
            <Box style={{ fontSize: "12px", opacity: 0.75 }}>
              Try the <code>Messy Markup</code> preset, then use <code>Shift + Alt + F</code> or the buttons above.
            </Box>
          </Flex>
        )}

        {/* Content Info */}
        <Box style={{ marginLeft: "auto", fontSize: "14px", opacity: 0.7 }}>
          {currentContent.split('\n').length} lines, {currentContent.length} characters
        </Box>
      </Flex>

      {/* Editor Container */}
      <Box
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
      <Box style={{
        marginTop: "20px",
        padding: "10px 0",
        borderTop: `1px solid ${theme === "dark" ? "#404040" : "#ddd"}`,
        fontSize: "14px",
        opacity: 0.7
      }}>
        <Flex style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            Active Extensions: {[
              showLineNumbers && "Line Numbers",
              syntaxHighlighting && "Syntax Highlighting",
              readOnly && "Read Only",
              enableSearch && "Search",
              bracketMatching && "Bracket Matching",
              codeFolding && "Code Folding",
              showDecorations && "Decorations Demo",
              enableDiagnostics && "Diagnostics",
              enableCompletions && "Completions",
              enableFormatting && "Formatting"
            ].filter(Boolean).join(", ") || "None"}
          </div>
          <div>
            Theme: {theme} | Mode: {readOnly ? "Read-Only" : "Editable"}{showDecorations ? ` | Decorations: ${[
              lineDecorationsEnabled && "line",
              gutterDecorationsEnabled && "gutter",
              inlineDecorationsEnabled && "inline",
            ].filter(Boolean).join(", ") || "off"}` : ""}
          </div>
        </Flex>
      </Box>
    </Flex>
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
    showDecorations: true,
    enableDiagnostics: false,
    enableCompletions: true,
    enableFormatting: true,
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
    showDecorations: false,
    enableDiagnostics: false,
    enableCompletions: false,
    enableFormatting: false,
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
    showDecorations: true,
    enableDiagnostics: true,
    enableCompletions: false,
    enableFormatting: false,
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
    showDecorations: true,
    enableDiagnostics: true,
    enableCompletions: true,
    enableFormatting: true,
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
      { id: "decorations", label: "Decorations", description: "Line, gutter, and inline annotations rendered without rewriting editor text DOM" },
      { id: "diagnostics", label: "Diagnostics", description: "Gutter markers, inline highlights, active issue navigation, and a status summary" },
      { id: "completion", label: "Completion", description: "Provider-based autocomplete popup with async-safe refresh, keyboard navigation, and insertion commands" },
      { id: "formatting", label: "Formatting", description: "Pluggable document and selection formatting with timeout handling, cancellation, and preserved editor state" },
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
        case "decorations":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} showDecorations={true} />;
        case "diagnostics":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} showDecorations={false} enableDiagnostics={true} />;
        case "completion":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} showDecorations={false} enableDiagnostics={false} enableCompletions={true} />;
        case "formatting":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} showDecorations={false} enableDiagnostics={false} enableCompletions={false} enableFormatting={true} />;
        case "themes":
          return <LightCodeEditorDemo theme="light" showLineNumbers={true} syntaxHighlighting={true} enableSearch={false} bracketMatching={false} codeFolding={false} showDecorations={true} enableDiagnostics={true} enableCompletions={true} enableFormatting={true} />;
        case "readonly":
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} readOnly={true} enableSearch={true} bracketMatching={true} codeFolding={true} showDecorations={true} enableDiagnostics={true} />;
        default:
          return <LightCodeEditorDemo theme="dark" showLineNumbers={true} syntaxHighlighting={true} enableSearch={true} bracketMatching={true} codeFolding={true} showDecorations={true} enableDiagnostics={false} enableCompletions={true} enableFormatting={true} />;
      }
    };

    return (
      <Flex style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Tab Navigation */}
        <Flex style={{
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
        </Flex>

        {/* Tab Description */}
        <Box style={{
          padding: "10px 20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #ddd",
          fontSize: "14px",
          color: "#666"
        }}>
          {tabs.find(tab => tab.id === activeTab)?.description}
        </Box>

        {/* Tab Content */}
        <Box style={{ flex: 1, overflow: "hidden" }}>
          {getTabContent()}
        </Box>
      </Flex>
    );
  },
};
