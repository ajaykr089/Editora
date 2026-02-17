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
    this.registerMode('javascript', { name: 'javascript', highlight: (src, colors) => this._highlightJS(src, colors) });
    this.registerMode('typescript', { name: 'typescript', highlight: (src, colors) => this._highlightJS(src, colors) });
    this.registerMode('php', { name: 'php', highlight: (src, colors) => this._highlightPHP(src, colors) });
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
    const chosen = (lang || this.currentLanguage || 'html').toLowerCase();
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

  private _highlightHTML(html: string, colors: Record<string,string>): string {
    const colorsLocal = colors;
    const escapeHTML = (str: string) => this.escapeHTML(str);

    let escaped = escapeHTML(html);

    // Highlight contents of <style>...</style> blocks as CSS first so inner CSS isn't treated as HTML
    const highlightCSS = (cssContent: string) => {
      let css = cssContent.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
      css = css.replace(/(\/\*[\s\S]*?\*\/)/g, `<span style=\"color: ${colorsLocal.comment};\">$1</span>`);
      css = css.replace(/([a-zA-Z-]+)(\s*:\s*)([^;{]+)(;?)/g, (m, prop, sep, val, semi) => {
        const v = String(val).trim();
        const escVal = escapeHTML(v);
        return `<span style=\"color: ${colorsLocal.styleProp};\">${prop}</span>${sep}<span style=\"color: ${colorsLocal.styleVal};\">${escVal}</span>${semi}`;
      });
      return css;
    };

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
      const highlighted = highlightCSS(cssInner);
      return `${open}${highlighted}${close}`;
    });

    escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g, `<span style="color: ${colorsLocal.comment};">$1</span>`);
    escaped = escaped.replace(/(&lt;!DOCTYPE[\s\S]*?&gt;)/i, `<span style="color: ${colorsLocal.doctype};">$1</span>`);

    escaped = escaped.replace(/(&lt;\/?\s*)([^\s&>\/]+)([\s\S]*?)(\/?&gt;)/g, (whole, open, name, attrs, close) => {
      const taggedName = `<span style="color: ${colorsLocal.tag};">${name}</span>`;
      let processedAttrs = attrs;
      processedAttrs = processedAttrs.replace(/([\w:-]+)(\s*=\s*)((&quot;[\s\S]*?&quot;|&#39;[\s\S]*?&#39;|[^\s&>]+))/g, (m, aname, aeq, aval) => {
        const nameLower = String(aname).toLowerCase();
        const outName = `<span style="color: ${colorsLocal.attrName};">${aname}</span>`;
        let inner = aval;
        let quote = '';
        if (aval.startsWith('&quot;') && aval.endsWith('&quot;')) { inner = aval.slice(6, -6); quote = '&quot;'; }
        else if (aval.startsWith('&#39;') && aval.endsWith('&#39;')) { inner = aval.slice(5, -5); quote = '&#39;'; }
        let outVal = aval;
        if (nameLower === 'style') {
          const cssHighlighted = inner.replace(/([\w-]+)\s*:\s*([^;]+)(;?)/g, (cm, prop, v, semi) => {
            return `<span style="color: ${colorsLocal.styleProp};">${prop}</span>:<span style="color: ${colorsLocal.styleVal};">${v.trim()}</span>${semi}`;
          });
          if (quote) outVal = `${quote}${cssHighlighted}${quote}`; else outVal = cssHighlighted;
          outVal = `<span style=\"color: ${colorsLocal.attrValue};\">${outVal}</span>`;
        } else {
          if (quote) outVal = `${quote}${inner}${quote}`;
          outVal = `<span style=\"color: ${colorsLocal.attrValue};\">${outVal}</span>`;
        }
        return `${outName}${aeq}${outVal}`;
      });
      return `${open}${taggedName}${processedAttrs}${close}`;
    });

    return escaped;
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
