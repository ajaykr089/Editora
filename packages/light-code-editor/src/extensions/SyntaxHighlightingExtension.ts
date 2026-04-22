/**
 * Syntax Highlighting Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 *
 * Implements CodeMirror-style syntax highlighting for HTML content
 * Completely isolated extension with no external dependencies
 */

import { EditorExtension, EditorAPI } from '../types';

export class SyntaxHighlightingExtension implements EditorExtension {
  public readonly name = 'syntax-highlighting';
  private editor: EditorAPI | null = null;
  private currentTheme = 'dark';
  private currentLanguage: string | null = null;
  private modes: Map<string, { name: string; highlight: (src: string, colors: Record<string,string>) => string }> = new Map();

  setup(editor: EditorAPI): void {
    this.editor = editor;
    // register built-in modes
    this.registerMode('html', { name: 'html', highlight: (src, colors) => this._highlightHTML(src, colors) });
    this.registerMode('css', { name: 'css', highlight: (src, colors) => this._highlightCSS(src, colors) });
    this.registerMode('javascript', { name: 'javascript', highlight: (src, colors) => this._highlightJS(src, colors) });
    this.registerMode('js', { name: 'javascript', highlight: (src, colors) => this._highlightJS(src, colors) });
    this.registerMode('jsx', { name: 'javascript', highlight: (src, colors) => this._highlightJS(src, colors) });
    this.registerMode('typescript', { name: 'typescript', highlight: (src, colors) => this._highlightJS(src, colors) });
    this.registerMode('ts', { name: 'typescript', highlight: (src, colors) => this._highlightJS(src, colors) });
    this.registerMode('tsx', { name: 'typescript', highlight: (src, colors) => this._highlightJS(src, colors) });
    this.registerMode('json', { name: 'json', highlight: (src, colors) => this._highlightJSON(src, colors) });
    this.registerMode('markdown', { name: 'markdown', highlight: (src, colors) => this._highlightMarkdown(src, colors) });
    this.registerMode('md', { name: 'markdown', highlight: (src, colors) => this._highlightMarkdown(src, colors) });
    this.registerMode('bash', { name: 'bash', highlight: (src, colors) => this._highlightShell(src, colors) });
    this.registerMode('shell', { name: 'bash', highlight: (src, colors) => this._highlightShell(src, colors) });
    this.registerMode('sh', { name: 'bash', highlight: (src, colors) => this._highlightShell(src, colors) });
    this.registerMode('zsh', { name: 'bash', highlight: (src, colors) => this._highlightShell(src, colors) });
    this.registerMode('python', { name: 'python', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'python') });
    this.registerMode('py', { name: 'python', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'python') });
    this.registerMode('go', { name: 'go', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'go') });
    this.registerMode('golang', { name: 'go', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'go') });
    this.registerMode('c', { name: 'c', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'c') });
    this.registerMode('cpp', { name: 'cpp', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'cpp') });
    this.registerMode('c++', { name: 'cpp', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'cpp') });
    this.registerMode('cc', { name: 'cpp', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'cpp') });
    this.registerMode('cxx', { name: 'cpp', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'cpp') });
    this.registerMode('java', { name: 'java', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'java') });
    this.registerMode('csharp', { name: 'csharp', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'csharp') });
    this.registerMode('cs', { name: 'csharp', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'csharp') });
    this.registerMode('rust', { name: 'rust', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'rust') });
    this.registerMode('rs', { name: 'rust', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'rust') });
    this.registerMode('ruby', { name: 'ruby', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'ruby') });
    this.registerMode('rb', { name: 'ruby', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'ruby') });
    this.registerMode('sql', { name: 'sql', highlight: (src, colors) => this._highlightGenericCode(src, colors, 'sql') });
    this.registerMode('yaml', { name: 'yaml', highlight: (src, colors) => this._highlightYAML(src, colors) });
    this.registerMode('yml', { name: 'yaml', highlight: (src, colors) => this._highlightYAML(src, colors) });
    this.registerMode('xml', { name: 'xml', highlight: (src, colors) => this._highlightXML(src, colors) });
    this.registerMode('svg', { name: 'xml', highlight: (src, colors) => this._highlightXML(src, colors) });
    this.registerMode('dockerfile', { name: 'dockerfile', highlight: (src, colors) => this._highlightDockerfile(src, colors) });
    this.registerMode('docker', { name: 'dockerfile', highlight: (src, colors) => this._highlightDockerfile(src, colors) });
    this.registerMode('php', { name: 'php', highlight: (src, colors) => this._highlightPHP(src, colors) });

    editor.registerCommand('setSyntaxLanguage', (language: string | null) => {
      this.setLanguage(language);
      this.refreshEditorHighlight();
    });
  }

  // Extension provides methods that can be called by the editor
  setTheme(theme: string): void {
    this.currentTheme = theme;
  }

  setLanguage(lang: string | null) {
    this.currentLanguage = lang;
  }

  registerMode(lang: string, mode: { name: string; highlight: (src: string, colors: Record<string,string>) => string }) {
    this.modes.set(lang.toLowerCase(), mode);
  }

  // Method to get syntax highlighting colors for a given theme
  getSyntaxColors(): Record<string, string> {
    return this.currentTheme === 'dark' ? {
      tag: '#569cd6',        // Blue
      comment: '#6a9955',    // Green
      attrName: '#9cdcfe',   // Light blue for attribute names
      attrValue: '#ce9178',  // Orange for attribute values
      styleProp: '#c586c0',  // Purple for CSS property names
      styleVal: '#dcdcaa',   // Yellow-ish for CSS values
      doctype: '#808080',    // Gray for doctype
      text: '#d4d4d4',       // Light gray for normal text
      keyword: '#c586c0',    // JS/PHP keywords (purple)
      string: '#ce9178',     // JS strings
      number: '#b5cea8',     // numbers
      variable: '#9cdcfe'    // php variable color
    } : {
      tag: '#0000ff',        // Blue
      comment: '#008000',    // Green
      attrName: '#001080',
      attrValue: '#a31515',  // Red
      styleProp: '#6a00a8',
      styleVal: '#804000',
      doctype: '#444444',
      text: '#000000',       // Black
      keyword: '#000080',
      string: '#a31515',
      number: '#0086b3',
      variable: '#001080'
    };
  }

  // Public API: highlight a source string using the chosen mode (or detect html)
  highlight(src: string, lang?: string): string {
    const colors = this.getSyntaxColors();
    const chosen = this.normalizeLanguageId(
      lang || this.currentLanguage || this.detectLanguage(src) || 'html',
    );
    const mode = this.modes.get(chosen) || this.modes.get('html')!;
    return mode.highlight(src, colors);
  }

  // Backwards-compatible method
  highlightHTML(html: string): string {
    return this.highlight(html, 'html');
  }

  // --- Internal mode implementations ---
  private escapeHTML(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#39;');
  }

  private normalizeLanguageId(language: string): string {
    const normalized = language.trim().toLowerCase().replace(/^\./, '');
    const aliases: Record<string, string> = {
      cjs: 'javascript',
      js: 'javascript',
      javascriptreact: 'javascript',
      jsx: 'javascript',
      mjs: 'javascript',
      mts: 'typescript',
      ts: 'typescript',
      tsx: 'typescript',
      typescriptreact: 'typescript',
      md: 'markdown',
      mdx: 'markdown',
      shell: 'bash',
      sh: 'bash',
      zsh: 'bash',
      console: 'bash',
      terminal: 'bash',
      docker: 'dockerfile',
      dockerfile: 'dockerfile',
      golang: 'go',
      py: 'python',
      cxx: 'cpp',
      cc: 'cpp',
      'c++': 'cpp',
      cs: 'csharp',
      rs: 'rust',
      rb: 'ruby',
      yml: 'yaml',
      svg: 'xml',
    };
    return aliases[normalized] || normalized || 'html';
  }

  private restoreHighlightTokens(value: string, tokens: string[]): string {
    return value.replace(/\u0000([a-z]+)\u0000/g, (_, key) => {
      let idx = 0;
      for (let i = 0; i < key.length; i++) {
        idx = idx * 26 + (key.charCodeAt(i) - 97 + 1);
      }
      idx = idx - 1;
      return tokens[idx] || '';
    });
  }

  private createTokenStore(tokens: string[]): (html: string) => string {
    const alpha = (n: number) => {
      let s = '';
      let v = n;
      do {
        s = String.fromCharCode(97 + (v % 26)) + s;
        v = Math.floor(v / 26) - 1;
      } while (v >= 0);
      return s || 'a';
    };

    return (html: string) => {
      const id = tokens.length;
      tokens.push(html);
      return `\u0000${alpha(id)}\u0000`;
    };
  }

  private refreshEditorHighlight(): void {
    const editor = this.editor as (EditorAPI & {
      renderTextWithHighlight?: (text: string, restoreSelection?: boolean) => void;
    }) | null;
    if (!editor?.renderTextWithHighlight) {
      return;
    }

    editor.renderTextWithHighlight(editor.getValue(), true);
  }

  // Robustly unescape common HTML entities, repeating a few times to handle nested encoding like &amp;amp;...
  private unescapeEntitiesRepeated(s: string) {
    let cur = s || '';
    for (let i = 0; i < 5; i++) {
      const prev = cur;
      cur = cur.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      if (cur === prev) break;
    }
    return cur;
  }

  private detectLanguage(src: string): string | null {
    const trimmed = src.trim();
    if (!trimmed) {
      return null;
    }

    if (
      (/^[\[{]/.test(trimmed) && /[\]}]$/.test(trimmed)) ||
      /"[^"]+"\s*:/.test(trimmed)
    ) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch {
        // Continue with looser language checks below.
      }
    }

    const hasHtmlTag = /<\/?[A-Za-z][\w:-]*(?:\s|>|\/>)/.test(trimmed);
    const hasStrongHtmlSignal =
      /^<!DOCTYPE\s+html\b/i.test(trimmed) ||
      /<\/?(html|head|body|meta|title|style|script)\b/i.test(trimmed);
    const looksLikeCss =
      /[{][\s\S]*[}]/.test(trimmed) &&
      /[A-Za-z_-][\w-]*\s*:\s*[^;{}]+;?/.test(trimmed) &&
      !/\b(function|const|let|var|return|class|interface|type)\b/.test(trimmed);
    if (!hasHtmlTag && looksLikeCss) {
      return 'css';
    }

    const markdownSignals = [
      /^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/.test(trimmed),
      /^#{1,6}\s+\S/m.test(trimmed),
      /^\s*```/m.test(trimmed),
      /^\s*~~~/m.test(trimmed),
      /^\s{0,3}>\s+/m.test(trimmed),
      /^\s{0,3}(?:[-*+]|\d+\.)\s+\S/m.test(trimmed),
      /^\s{0,3}[-*+]\s+\[[ xX]\]\s+\S/m.test(trimmed),
      /\[[^\]\n]+\]\([^)]+\)/.test(trimmed),
      /!\[[^\]\n]*\]\([^)]+\)/.test(trimmed),
      /(^|\n)\s*\|.+\|\s*\n\s*\|[\s:-]+\|/m.test(trimmed),
      /(^|\s)(?:\*\*|__)[^*_]+(?:\*\*|__)(?=\s|$|[.,;:!?])/m.test(trimmed),
    ];
    const markdownScore = markdownSignals.filter(Boolean).length;
    if (markdownScore >= (hasHtmlTag ? 2 : 1)) {
      return 'markdown';
    }

    if (hasStrongHtmlSignal) {
      return 'html';
    }

    const detectedCodeLanguage = this.detectProgrammingLanguage(trimmed);
    if (detectedCodeLanguage) {
      return detectedCodeLanguage;
    }

    return null;
  }

  private detectProgrammingLanguage(src: string): string | null {
    const scores: Record<string, number> = {
      python: 0,
      go: 0,
      cpp: 0,
      c: 0,
      java: 0,
      csharp: 0,
      rust: 0,
      ruby: 0,
      sql: 0,
      yaml: 0,
      dockerfile: 0,
    };

    const add = (language: keyof typeof scores, pattern: RegExp, weight = 1) => {
      if (pattern.test(src)) {
        scores[language] += weight;
      }
    };

    add('python', /^\s*(from\s+\w+\s+import|import\s+\w+|def\s+\w+\s*\(|class\s+\w+|for\s+\w+\s+in\s+.+:|if\s+.+:|while\s+.+:|print\s*\()/m, 2);
    add('python', /^\s*[A-Za-z_]\w*\s*=\s*(?:\[|\{|\(|["']|\d)/m);
    add('python', /\b(True|False|None|self|elif|lambda|yield)\b/);

    add('go', /^\s*package\s+\w+/m, 3);
    add('go', /\bfunc\s+\w+\s*\(/, 2);
    add('go', /\b(import|defer|goroutine|chan|struct|interface)\b/);

    add('cpp', /^\s*#include\s*<[^>]+>/m, 2);
    add('cpp', /\b(std::|template\s*<|namespace\s+\w+|cout\s*<<|cin\s*>>)\b/, 2);
    add('cpp', /\b(class|public|private|protected|virtual|typename)\b/);

    add('c', /^\s*#include\s*[<"][^>"]+[>"]/m);
    add('c', /\b(int|char|float|double|void)\s+\w+\s*\(/);
    add('c', /\bprintf\s*\(/);

    add('java', /^\s*(package|import)\s+[\w.]+;/m, 2);
    add('java', /\b(public|private|protected)\s+(class|interface|enum)\s+\w+/, 2);
    add('java', /\bSystem\.out\.println\s*\(/);

    add('csharp', /^\s*using\s+[\w.]+;/m, 2);
    add('csharp', /\b(namespace|record|var|string|Console\.WriteLine)\b/);
    add('csharp', /\b(public|private|protected)\s+(class|interface|struct)\s+\w+/);

    add('rust', /\bfn\s+\w+\s*\(/, 2);
    add('rust', /\b(let\s+mut|impl\s+\w+|use\s+[\w:]+|println!\s*\()/);
    add('rust', /\b(crate|trait|enum|match|Some|None|Ok|Err)\b/);

    add('ruby', /^\s*(def|class|module)\s+\w+/m, 2);
    add('ruby', /\b(puts|require|attr_reader|elsif|end)\b/);

    add('sql', /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/im, 3);
    add('sql', /\bFROM\s+\w+|\bWHERE\s+/i);

    add('yaml', /^---\s*$/m);
    add('yaml', /^\s*[A-Za-z0-9_.-]+\s*:\s+\S/m, 2);
    add('yaml', /^\s*-\s+[A-Za-z0-9_.-]+\s*:/m);

    add('dockerfile', /^\s*FROM\s+\S+/im, 3);
    add('dockerfile', /^\s*(RUN|COPY|ADD|CMD|ENTRYPOINT|WORKDIR|ENV|ARG)\b/im, 2);

    const [language, score] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0] || ['', 0];
    return score >= 2 ? language : null;
  }

  private _highlightHTML(html: string, colors: Record<string,string>): string {
    const colorsLocal = colors;
    const escapeHTML = (str: string) => this.escapeHTML(str);
    const tokens: string[] = [];
    const store = this.createTokenStore(tokens);
    const incompleteTagTokens: string[] = [];
    const stashIncompleteTag = (value: string) => {
      const index = incompleteTagTokens.length;
      incompleteTagTokens.push(value);
      return `\u0002ht${index}\u0002`;
    };

    let escaped = escapeHTML(html);
    escaped = escaped.replace(
      /&lt;\/?(?:(?!&gt;)[^\n\r<])*?(?=$|[\n\r])/g,
      (segment) => stashIncompleteTag(segment),
    );

    // Extract raw <script> inner contents from the original HTML so we highlight the real source
    const scriptInners: Array<{ attrs: string; inner: string }> = [];
    try {
      html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (m, attrs, inner) => {
        scriptInners.push({ attrs: String(attrs || ''), inner: String(inner || '') });
        return m;
      });
    } catch (e) {
      // ignore
    }

    let scriptIdx = 0;
    escaped = escaped.replace(/(&lt;script\b([^&>]*)&gt;)([\s\S]*?)(&lt;\/script&gt;)/gi, (m, open, attrsEsc, scriptInnerEsc, close) => {
      const raw = scriptInners[scriptIdx++]?.inner ?? this.unescapeEntitiesRepeated(scriptInnerEsc || '');
      const attrStr = (scriptInners[scriptIdx-1]?.attrs || attrsEsc || '').toLowerCase();
      const isTS = /typescript/.test(attrStr) || /application\/typescript/.test(attrStr);
      // Highlight using raw source (mode will escape appropriately)
      const highlighted = this._highlightJS(raw, colorsLocal);
      return `${open}${highlighted}${close}`;
    });

    escaped = escaped.replace(/(&lt;style\b[^&]*&gt;)([\s\S]*?)(&lt;\/style&gt;)/gi, (m, open, cssInner, close) => {
      const highlighted = this._highlightCSS(this.unescapeEntitiesRepeated(cssInner), colorsLocal);
      return `${open}${highlighted}${close}`;
    });

    escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, (match) =>
      store(`<span style="color: ${colorsLocal.comment};">${match}</span>`),
    );
    escaped = escaped.replace(/(&lt;!DOCTYPE[\s\S]*?&gt;)/i, (match) =>
      store(`<span style="color: ${colorsLocal.doctype};">${match}</span>`),
    );

    escaped = escaped.replace(/(&lt;\/?\s*)([^\s&>\/]+)([^<]*?)(\/?&gt;)/g, (whole, open, name, attrs, close) => {
      const taggedName = `<span style="color: ${colorsLocal.tag};">${name}</span>`;
      let processedAttrs = attrs;
      processedAttrs = processedAttrs.replace(
        /([\w:-]+)(\s*=\s*)((&quot;[\s\S]*?&quot;|&#39;[\s\S]*?&#39;|[^\s&>]+))/g,
        (_m: string, aname: string, aeq: string, aval: string) => {
        const nameLower = String(aname).toLowerCase();
        const outName = `<span style="color: ${colorsLocal.attrName};">${aname}</span>`;
        let inner = aval;
        let quote = '';
        if (aval.startsWith('&quot;') && aval.endsWith('&quot;')) { inner = aval.slice(6, -6); quote = '&quot;'; }
        else if (aval.startsWith('&#39;') && aval.endsWith('&#39;')) { inner = aval.slice(5, -5); quote = '&#39;'; }
        let outVal = aval;
        if (nameLower === 'style') {
          const cssHighlighted = inner.replace(/([\w-]+)\s*:\s*([^;]+)(;?)/g, (_cm: string, prop: string, v: string, semi: string) => {
            return `<span style="color: ${colorsLocal.styleProp};">${prop}</span>:<span style="color: ${colorsLocal.styleVal};">${v}</span>${semi}`;
          });
          if (quote) outVal = `${quote}${cssHighlighted}${quote}`; else outVal = cssHighlighted;
          outVal = `<span style=\"color: ${colorsLocal.attrValue};\">${outVal}</span>`;
        } else {
          if (quote) outVal = `${quote}${inner}${quote}`;
          outVal = `<span style=\"color: ${colorsLocal.attrValue};\">${outVal}</span>`;
        }
          return `${outName}${aeq}${outVal}`;
        }
      );
      return `${open}${taggedName}${processedAttrs}${close}`;
    });

    escaped = escaped.replace(/\u0002ht(\d+)\u0002/g, (_whole, index) => {
      return incompleteTagTokens[Number(index)] || '';
    });

    return this.restoreHighlightTokens(escaped, tokens);
  }

  private _highlightCSS(src: string, colors: Record<string,string>): string {
    const rawSrc = this.unescapeEntitiesRepeated(src);
    const tokens: string[] = [];
    const store = this.createTokenStore(tokens);
    const combinedRe = /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
    let last = 0;
    let built = '';
    let match: RegExpExecArray | null;

    while ((match = combinedRe.exec(rawSrc))) {
      if (last < match.index) {
        built += this.escapeHTML(rawSrc.slice(last, match.index));
      }
      const value = match[0];
      const color = value.startsWith('/*') ? colors.comment : colors.string;
      built += store(`<span style="color: ${color};">${this.escapeHTML(value)}</span>`);
      last = combinedRe.lastIndex;
    }

    if (last < rawSrc.length) {
      built += this.escapeHTML(rawSrc.slice(last));
    }

    built = built.replace(/(@[\w-]+)/g, (match) =>
      store(`<span style="color: ${colors.keyword};">${match}</span>`),
    );
    built = built.replace(/([A-Za-z_-][\w-]*)(\s*:)/g, (_match, property, colon) =>
      `${store(`<span style="color: ${colors.styleProp};">${property}</span>`)}${colon}`,
    );
    built = built.replace(/(#(?:[0-9a-fA-F]{3,8})\b)/g, (match) =>
      store(`<span style="color: ${colors.number};">${match}</span>`),
    );
    built = built.replace(/\b(-?\d*\.?\d+(?:px|em|rem|vh|vw|vmin|vmax|%|s|ms|deg|turn|fr)?)\b/g, (match) =>
      store(`<span style="color: ${colors.number};">${match}</span>`),
    );
    built = built.replace(/\b(important|inherit|initial|unset|revert|auto|none|block|inline|flex|grid|absolute|relative|fixed|sticky)\b/g, (match) =>
      store(`<span style="color: ${colors.styleVal};">${match}</span>`),
    );

    return this.restoreHighlightTokens(built, tokens);
  }

  private _highlightJSON(src: string, colors: Record<string,string>): string {
    const rawSrc = this.unescapeEntitiesRepeated(src);
    const tokenRe = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\[\],:]/g;
    let last = 0;
    let built = '';
    let match: RegExpExecArray | null;

    while ((match = tokenRe.exec(rawSrc))) {
      if (last < match.index) {
        built += this.escapeHTML(rawSrc.slice(last, match.index));
      }

      const token = match[0];
      const stringToken = match[1];
      const keySeparator = match[2] || '';
      const literalToken = match[3];

      if (stringToken) {
        const color = keySeparator ? colors.attrName : colors.string;
        built += `<span style="color: ${color};">${this.escapeHTML(stringToken)}</span>${this.escapeHTML(keySeparator)}`;
      } else if (literalToken) {
        built += `<span style="color: ${colors.keyword};">${token}</span>`;
      } else if (/^-?\d/.test(token)) {
        built += `<span style="color: ${colors.number};">${token}</span>`;
      } else {
        built += `<span style="color: ${colors.tag};">${this.escapeHTML(token)}</span>`;
      }

      last = tokenRe.lastIndex;
    }

    if (last < rawSrc.length) {
      built += this.escapeHTML(rawSrc.slice(last));
    }

    return built;
  }

  private _highlightMarkdown(src: string, colors: Record<string,string>): string {
    const rawSrc = this.unescapeEntitiesRepeated(src);
    const lines = rawSrc.split('\n');
    let inFence = false;
    let fenceMarker = '';
    let fenceLanguage = '';
    let inFrontmatter = lines[0]?.trim() === '---';

    return lines
      .map((line, index) => {
        const tokens: string[] = [];
        const store = this.createTokenStore(tokens);

        if (inFrontmatter) {
          const isBoundary = line.trim() === '---';
          const color = isBoundary ? colors.keyword : colors.attrName;
          const highlighted = `<span style="color: ${color};">${this.escapeHTML(line)}</span>`;
          if (index > 0 && isBoundary) {
            inFrontmatter = false;
          }
          return highlighted;
        }

        const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
        if (fenceMatch) {
          const marker = fenceMatch[2];
          const isClosingFence = inFence && marker[0] === fenceMarker[0];
          inFence = !isClosingFence;
          fenceMarker = inFence ? marker : '';
          fenceLanguage = inFence
            ? this.extractMarkdownFenceLanguage(fenceMatch[3] || '')
            : '';
          return [
            this.escapeHTML(fenceMatch[1]),
            `<span style="color: ${colors.keyword}; font-weight: 700;">${this.escapeHTML(marker)}</span>`,
            `<span style="color: ${colors.string};">${this.escapeHTML(fenceMatch[3] || '')}</span>`,
          ].join('');
        }

        if (inFence) {
          return this.highlightMarkdownFenceLine(line, fenceLanguage, colors);
        }

        let escaped = this.escapeHTML(line)
          .replace(/(`[^`]+`)/g, (match) =>
            store(`<span style="color: ${colors.string}; background: rgba(148, 163, 184, 0.16); border-radius: 3px;">${match}</span>`),
          )
          .replace(/(!?\[[^\]\n]*\])(\([^)]+\))/g, (_whole, label, target) =>
            store(`<span style="color: ${colors.attrName};">${label}</span><span style="color: ${colors.attrValue};">${target}</span>`),
          )
          .replace(/(\*\*|__)(.+?)\1/g, (_whole, marker, value) =>
            store(`<span style="color: ${colors.keyword};">${marker}</span><span style="color: ${colors.tag}; font-weight: 700;">${value}</span><span style="color: ${colors.keyword};">${marker}</span>`),
          )
          .replace(/(~~)(.+?)\1/g, (_whole, marker, value) =>
            store(`<span style="color: ${colors.keyword};">${marker}</span><span style="color: ${colors.comment}; text-decoration: line-through;">${value}</span><span style="color: ${colors.keyword};">${marker}</span>`),
          )
          .replace(/(\*|_)([^*_]+?)\1/g, (_whole, marker, value) =>
            store(`<span style="color: ${colors.keyword};">${marker}</span><span style="color: ${colors.styleVal}; font-style: italic;">${value}</span><span style="color: ${colors.keyword};">${marker}</span>`),
          );

        escaped = escaped.replace(/^(\s{0,3}#{1,6})(\s+.*)?$/, (_whole, marker, text = '') =>
          `<span style="color: ${colors.keyword}; font-weight: 700;">${marker}</span><span style="color: ${colors.tag}; font-weight: 700;">${text}</span>`,
        );
        escaped = escaped.replace(/^(\s{0,3})((?:-\s*){3,}|(?:\*\s*){3,}|(?:_\s*){3,})$/, (_whole, indent, rule) =>
          `${indent}<span style="color: ${colors.comment};">${rule}</span>`,
        );
        escaped = escaped.replace(/^(\s{0,3}&gt;)(.*)$/, (_whole, marker, text) =>
          `<span style="color: ${colors.comment};">${marker}</span>${text}`,
        );
        escaped = escaped.replace(/^(\s*)([-*+])(\s+\[[ xX]\])(\s+)/, (_whole, indent, marker, checkbox, space) =>
          `${indent}<span style="color: ${colors.keyword};">${marker}</span><span style="color: ${colors.attrName};">${checkbox}</span>${space}`,
        );
        escaped = escaped.replace(/^(\s*)([-*+]|\d+\.)(\s+)/, (_whole, indent, marker, space) =>
          `${indent}<span style="color: ${colors.keyword};">${marker}</span>${space}`,
        );
        escaped = escaped.replace(/^(\s*\|.*\|\s*)$/, (row) =>
          row.replace(/\|/g, (pipe) => `<span style="color: ${colors.keyword};">${pipe}</span>`),
        );

        return this.restoreHighlightTokens(escaped, tokens);
      })
      .join('\n');
  }

  private extractMarkdownFenceLanguage(info: string): string {
    const language = info.trim().match(/^([A-Za-z0-9_+.#-]+)/)?.[1] || '';
    return language ? this.normalizeLanguageId(language) : '';
  }

  private highlightMarkdownFenceLine(
    line: string,
    language: string,
    colors: Record<string,string>,
  ): string {
    const mode = language ? this.modes.get(language) : undefined;
    if (!mode || mode.name === 'markdown') {
      return `<span style="color: ${colors.text};">${this.escapeHTML(line)}</span>`;
    }
    return mode.highlight(line, colors);
  }

  private _highlightShell(src: string, colors: Record<string,string>): string {
    const rawSrc = this.unescapeEntitiesRepeated(src);
    const tokens: string[] = [];
    const store = this.createTokenStore(tokens);
    const combinedRe = /(#[^\n\r]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\$\{?[A-Za-z_][\w]*\}?|\$[0-9@#?$*!])/g;
    let last = 0;
    let built = '';
    let match: RegExpExecArray | null;

    while ((match = combinedRe.exec(rawSrc))) {
      if (last < match.index) {
        built += this.escapeHTML(rawSrc.slice(last, match.index));
      }

      const value = match[0];
      const color = value.startsWith('#')
        ? colors.comment
        : value.startsWith('$')
          ? colors.variable
          : colors.string;
      built += store(`<span style="color: ${color};">${this.escapeHTML(value)}</span>`);
      last = combinedRe.lastIndex;
    }

    if (last < rawSrc.length) {
      built += this.escapeHTML(rawSrc.slice(last));
    }

    built = built.replace(
      /(^|\s)(--?[A-Za-z0-9][\w-]*)(?=\s|=|$)/g,
      (_whole, prefix, option) =>
        `${prefix}${store(`<span style="color: ${colors.attrName};">${option}</span>`)}`,
    );
    built = built.replace(
      /\b(if|then|else|elif|fi|for|while|until|do|done|case|esac|function|export|unset|alias|source|return|in)\b/g,
      (keyword) => store(`<span style="color: ${colors.keyword};">${keyword}</span>`),
    );
    built = built.replace(
      /(^|\s)(npm|npx|pnpm|yarn|bun|node|git|cd|mkdir|touch|cp|mv|rm|cat|grep|rg|find|curl|wget|echo|printf|sudo|chmod|chown|docker|kubectl)(?=\s|$)/g,
      (_whole, prefix, command) =>
        `${prefix}${store(`<span style="color: ${colors.tag};">${command}</span>`)}`,
    );

    return this.restoreHighlightTokens(built, tokens);
  }

  private getLanguageKeywords(language: string): string[] {
    const common = ['true', 'false', 'null', 'nil', 'none'];
    const keywordMap: Record<string, string[]> = {
      python: ['and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield', 'self', 'True', 'False', 'None'],
      go: ['break', 'case', 'chan', 'const', 'continue', 'defer', 'default', 'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface', 'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var'],
      c: ['auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'inline', 'int', 'long', 'register', 'restrict', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while'],
      cpp: ['alignas', 'alignof', 'auto', 'bool', 'break', 'case', 'catch', 'char', 'class', 'concept', 'const', 'constexpr', 'continue', 'decltype', 'default', 'delete', 'do', 'double', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'if', 'inline', 'int', 'long', 'namespace', 'new', 'noexcept', 'nullptr', 'operator', 'private', 'protected', 'public', 'requires', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'while'],
      java: ['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while'],
      csharp: ['abstract', 'as', 'async', 'await', 'base', 'bool', 'break', 'case', 'catch', 'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else', 'enum', 'event', 'explicit', 'extern', 'false', 'finally', 'fixed', 'float', 'for', 'foreach', 'get', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock', 'long', 'namespace', 'new', 'null', 'object', 'out', 'override', 'params', 'private', 'protected', 'public', 'readonly', 'record', 'ref', 'return', 'sealed', 'set', 'short', 'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'using', 'var', 'virtual', 'void', 'volatile', 'while', 'yield'],
      rust: ['as', 'async', 'await', 'break', 'const', 'continue', 'crate', 'dyn', 'else', 'enum', 'extern', 'false', 'fn', 'for', 'if', 'impl', 'in', 'let', 'loop', 'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self', 'Self', 'static', 'struct', 'super', 'trait', 'true', 'type', 'unsafe', 'use', 'where', 'while'],
      ruby: ['BEGIN', 'END', 'alias', 'and', 'begin', 'break', 'case', 'class', 'def', 'defined?', 'do', 'else', 'elsif', 'end', 'ensure', 'false', 'for', 'if', 'in', 'module', 'next', 'nil', 'not', 'or', 'redo', 'rescue', 'retry', 'return', 'self', 'super', 'then', 'true', 'undef', 'unless', 'until', 'when', 'while', 'yield'],
      sql: ['ADD', 'ALTER', 'AND', 'AS', 'ASC', 'BETWEEN', 'BY', 'CASE', 'CREATE', 'DELETE', 'DESC', 'DISTINCT', 'DROP', 'ELSE', 'END', 'EXISTS', 'FROM', 'GROUP', 'HAVING', 'IN', 'INDEX', 'INNER', 'INSERT', 'INTO', 'IS', 'JOIN', 'LEFT', 'LIKE', 'LIMIT', 'NOT', 'NULL', 'ON', 'OR', 'ORDER', 'OUTER', 'PRIMARY', 'RIGHT', 'SELECT', 'SET', 'TABLE', 'THEN', 'UNION', 'UPDATE', 'VALUES', 'WHEN', 'WHERE'],
    };
    return [...(keywordMap[language] || []), ...common];
  }

  private _highlightGenericCode(
    src: string,
    colors: Record<string,string>,
    language: string,
  ): string {
    const rawSrc = this.unescapeEntitiesRepeated(src);
    const tokens: string[] = [];
    const store = this.createTokenStore(tokens);
    const commentPattern =
      language === 'python' || language === 'ruby' || language === 'sql'
        ? '#[^\\n\\r]*|--[^\\n\\r]*'
        : '\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n\\r]*';
    const combinedRe = new RegExp(
      `(${commentPattern})|("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'|\`(?:\\\\.|[^\`\\\\])*\`)`,
      'g',
    );
    let last = 0;
    let built = '';
    let match: RegExpExecArray | null;

    while ((match = combinedRe.exec(rawSrc))) {
      if (last < match.index) {
        built += this.escapeHTML(rawSrc.slice(last, match.index));
      }
      const value = match[0];
      const color =
        value.startsWith('//') ||
        value.startsWith('/*') ||
        value.startsWith('#') ||
        value.startsWith('--')
          ? colors.comment
          : colors.string;
      built += store(`<span style="color: ${color};">${this.escapeHTML(value)}</span>`);
      last = combinedRe.lastIndex;
    }

    if (last < rawSrc.length) {
      built += this.escapeHTML(rawSrc.slice(last));
    }

    const keywords = Array.from(new Set(this.getLanguageKeywords(language)));
    if (keywords.length > 0) {
      const keywordRe = new RegExp(
        `\\b(${keywords.map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
        language === 'sql' ? 'gi' : 'g',
      );
      built = built.replace(keywordRe, (keyword) =>
        store(`<span style="color: ${colors.keyword};">${keyword}</span>`),
      );
    }

    built = built.replace(/\b([A-Z][A-Za-z0-9_]*|[A-Za-z_][\w]*(?=\s*\())\b/g, (name) =>
      store(`<span style="color: ${colors.tag};">${name}</span>`),
    );
    built = built.replace(/\b(-?0x[0-9a-fA-F]+|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?:[uUlLfFdD]*)\b/g, (number) =>
      store(`<span style="color: ${colors.number};">${number}</span>`),
    );
    built = built.replace(/(@[A-Za-z_][\w]*|#[A-Za-z_][\w]*|::[A-Za-z_][\w]*)/g, (symbol) =>
      store(`<span style="color: ${colors.attrName};">${symbol}</span>`),
    );

    return this.restoreHighlightTokens(built, tokens);
  }

  private _highlightYAML(src: string, colors: Record<string,string>): string {
    const rawSrc = this.unescapeEntitiesRepeated(src);
    const tokens: string[] = [];
    const store = this.createTokenStore(tokens);
    let built = this.escapeHTML(rawSrc)
      .replace(/(#.*)$/gm, (comment) =>
        store(`<span style="color: ${colors.comment};">${comment}</span>`),
      )
      .replace(/^(\s*[-?]?\s*)([A-Za-z0-9_.-]+)(\s*:)/gm, (_whole, prefix, key, colon) =>
        `${prefix}${store(`<span style="color: ${colors.attrName};">${key}</span>`)}${colon}`,
      )
      .replace(/\b(true|false|null|yes|no|on|off)\b/gi, (literal) =>
        store(`<span style="color: ${colors.keyword};">${literal}</span>`),
      )
      .replace(/\b(-?\d+(?:\.\d+)?)\b/g, (number) =>
        store(`<span style="color: ${colors.number};">${number}</span>`),
      );
    built = built.replace(/(&quot;[^&]*?&quot;|&#39;[^&]*?&#39;)/g, (string) =>
      store(`<span style="color: ${colors.string};">${string}</span>`),
    );
    return this.restoreHighlightTokens(built, tokens);
  }

  private _highlightXML(src: string, colors: Record<string,string>): string {
    return this._highlightHTML(src, colors);
  }

  private _highlightDockerfile(src: string, colors: Record<string,string>): string {
    const rawSrc = this.unescapeEntitiesRepeated(src);
    return rawSrc
      .split('\n')
      .map((line) => {
        const escaped = this.escapeHTML(line);
        if (/^\s*#/.test(line)) {
          return `<span style="color: ${colors.comment};">${escaped}</span>`;
        }
        return escaped.replace(
          /^(\s*)(FROM|RUN|CMD|LABEL|MAINTAINER|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)(\b)/i,
          (_whole, indent, instruction, boundary) =>
            `${indent}<span style="color: ${colors.keyword};">${instruction}</span>${boundary}`,
        );
      })
      .join('\n');
  }

  private _highlightJS(src: string, colors: Record<string,string>): string {
    // Tokenize on the raw source, then replace escaped occurrences in the escaped HTML to preserve entities
    const rawSrc = this.unescapeEntitiesRepeated(src);
    let esc = this.escapeHTML(rawSrc);

    const tokens: string[] = [];
    const alpha = (n: number) => {
      let s = '';
      let v = n;
      do {
        s = String.fromCharCode(97 + (v % 26)) + s;
        v = Math.floor(v / 26) - 1;
      } while (v >= 0);
      return s || 'a';
    };
    const placeholder = (id: number) => `\u0000${alpha(id)}\u0000`;
    const store = (html: string) => { const id = tokens.length; tokens.push(html); return placeholder(id); };

    // helper: replace first occurrence of target in esc
    const replaceFirst = (target: string, repl: string) => {
      const idx = esc.indexOf(target);
      if (idx === -1) return false;
      esc = esc.slice(0, idx) + repl + esc.slice(idx + target.length);
      return true;
    };

    // Patterns to extract (operate on rawSrc)
    const commentMultiRe = /\/\*[\s\S]*?\*\//g;
    const commentSingleRe = /\/\/[^\n\r]*/g;
    const stringRe = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;

    let m: RegExpExecArray | null;
    // Single-pass: iterate over rawSrc, capture comments and strings, and build escaped output with placeholders
    const combinedRe = /(\/\*[\s\S]*?\*\/)|(\/\/[^\n\r]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;
    let last = 0;
    let built = '';
    while ((m = combinedRe.exec(rawSrc))) {
      const idx = m.index;
      if (last < idx) {
        built += this.escapeHTML(rawSrc.slice(last, idx));
      }
      const matched = m[0];
      if (/^\/\*/.test(matched) || /^\/\//.test(matched)) {
        built += store(`<span style="color: ${colors.comment};">${this.escapeHTML(matched)}</span>`);
      } else {
        built += store(`<span style="color: ${colors.string};">${this.escapeHTML(matched)}</span>`);
      }
      last = combinedRe.lastIndex;
    }
    if (last < rawSrc.length) built += this.escapeHTML(rawSrc.slice(last));

    // Now built contains escaped text with placeholders for comments/strings; run numbers and keywords on it
    // Replace numbers but avoid touching numeric parts of HTML entities like &#39;
    built = built.replace(/\b(0x[0-9a-fA-F]+|\d+\.?\d*|\d*\.\d+)\b/g, (m, p1, offset) => {
      const charBefore = built[offset - 1] || '';
      const charAfter = built[offset + m.length] || '';
      if (charBefore === '&' || charBefore === '#' || charAfter === ';' || charAfter === '#') {
        return m; // likely part of an HTML entity, skip
      }
      return `<span style="color: ${colors.number};">${m}</span>`;
    });
    built = built.replace(/\b(const|let|var|function|class|if|else|return|for|while|switch|case|break|import|from|export|extends|new|try|catch|finally|throw|await|async|interface|type)\b/g, `<span style=\"color: ${colors.keyword};\">$1</span>`);

    // restore tokens
    const restored = built.replace(/\u0000([a-z]+)\u0000/g, (_, key) => {
      let idx = 0;
      for (let i = 0; i < key.length; i++) { idx = idx * 26 + (key.charCodeAt(i) - 97 + 1); }
      idx = idx - 1;
      return tokens[idx] || '';
    });
    return restored;
  }

  private _highlightPHP(src: string, colors: Record<string,string>): string {
    // Normalize PHP source and tokenize against raw source similar to JS
    const rawSrc = this.unescapeEntitiesRepeated(src);
    let esc = this.escapeHTML(rawSrc);
    const tokens: string[] = [];
    const alpha2 = (n: number) => {
      let s = '';
      let v = n;
      do { s = String.fromCharCode(97 + (v % 26)) + s; v = Math.floor(v / 26) - 1; } while (v >= 0);
      return s || 'a';
    };
    const store = (html: string) => { const id = tokens.length; tokens.push(html); return `\u0000${alpha2(id)}\u0000`; };
    const replaceFirst = (target: string, repl: string) => {
      const idx = esc.indexOf(target);
      if (idx === -1) return false;
      esc = esc.slice(0, idx) + repl + esc.slice(idx + target.length);
      return true;
    };

    let m: RegExpExecArray | null;
    const commentMultiRe = /\/\*[\s\S]*?\*\//g;
    const commentSingleRe = /\/\/[^\n\r]*/g;
    const hashCommentRe = /\#([^\n\r]*)/g;
    const stringRe = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;

    while ((m = commentMultiRe.exec(rawSrc))) {
      const matched = m[0]; replaceFirst(this.escapeHTML(matched), store(`<span style=\"color: ${colors.comment};\">${this.escapeHTML(matched)}</span>`));
    }
    while ((m = commentSingleRe.exec(rawSrc))) { const matched = m[0]; replaceFirst(this.escapeHTML(matched), store(`<span style=\"color: ${colors.comment};\">${this.escapeHTML(matched)}</span>`)); }
    while ((m = hashCommentRe.exec(rawSrc))) { const matched = m[0]; replaceFirst(this.escapeHTML(matched), store(`<span style=\"color: ${colors.comment};\">${this.escapeHTML(matched)}</span>`)); }
    while ((m = stringRe.exec(rawSrc))) { const matched = m[0]; replaceFirst(this.escapeHTML(matched), store(`<span style=\"color: ${colors.string};\">${this.escapeHTML(matched)}</span>`)); }

    esc = esc.replace(/(\$[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*)/g, `<span style=\"color: ${colors.variable};\">$1</span>`);
    esc = esc.replace(/\b(echo|print|function|class|if|else|elseif|foreach|as|return|namespace|use|new|extends|public|protected|private|static)\b/g, `<span style=\"color: ${colors.keyword};\">$1</span>`);

    esc = esc.replace(/\u0000([a-z]+)\u0000/g, (_, key) => {
      let idx = 0; for (let i = 0; i < key.length; i++) { idx = idx * 26 + (key.charCodeAt(i) - 97 + 1); } idx = idx - 1; return tokens[idx] || '';
    });
    return esc;
  }

  // Method to check if content contains syntax that should be highlighted
  shouldHighlight(content: string): boolean {
    return /<\/?[\w:-]+|<!--/.test(content);
  }

  destroy(): void {
    this.editor = null;
    this.modes.clear();
  }
}
