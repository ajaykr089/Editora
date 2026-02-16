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

  setup(editor: EditorAPI): void {
    this.editor = editor;
  }

  // Extension provides methods that can be called by the editor
  setTheme(theme: string): void {
    this.currentTheme = theme;
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
      text: '#d4d4d4'        // Light gray for normal text
    } : {
      tag: '#0000ff',        // Blue
      comment: '#008000',    // Green
      attrName: '#001080',
      attrValue: '#a31515',  // Red
      styleProp: '#6a00a8',
      styleVal: '#804000',
      doctype: '#444444',
      text: '#000000'        // Black
    };
  }

  // Method to parse and highlight HTML content (returns highlighted HTML string)
  highlightHTML(html: string): string {
    const colors = this.getSyntaxColors();
    // Escape HTML so we render source code instead of parsed elements
    const escapeHTML = (str: string) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    let escaped = escapeHTML(html);

    // Highlight contents of <style>...</style> blocks as CSS first so inner CSS isn't treated as HTML
    const highlightCSS = (cssContent: string) => {
      // cssContent is escaped for HTML entities; unescape quotes for easier parsing
      let css = cssContent.replace(/&quot;/g, '"').replace(/&#39;/g, "'");

      // Highlight CSS comments
      css = css.replace(/(\/\*[\s\S]*?\*\/)/g, `<span style=\"color: ${colors.comment};\">$1</span>`);

      // Highlight properties and values
      css = css.replace(/([a-zA-Z-]+)(\s*:\s*)([^;{]+)(;?)/g, (m, prop, sep, val, semi) => {
        const v = String(val).trim();
        const escVal = escapeHTML(v);
        return `<span style=\"color: ${colors.styleProp};\">${prop}</span>${sep}<span style=\"color: ${colors.styleVal};\">${escVal}</span>${semi}`;
      });

      // Re-escape any stray angle brackets (shouldn't be present in CSS but be safe)
      return css;
    };

    escaped = escaped.replace(/(&lt;style\b[^&]*&gt;)([\s\S]*?)(&lt;\/style&gt;)/gi, (m, open, cssInner, close) => {
      const highlighted = highlightCSS(cssInner);
      return `${open}${highlighted}${close}`;
    });

    // Highlight comments first (escaped form: &lt;!-- ... --&gt;)
    escaped = escaped.replace(/(&lt;!--[\s\S]*?--&gt;)/g,
      `<span style="color: ${colors.comment};">$1</span>`
    );

    // Highlight DOCTYPE
    escaped = escaped.replace(/(&lt;!DOCTYPE[\s\S]*?&gt;)/i,
      `<span style="color: ${colors.doctype};">$1</span>`
    );

    // Safer tag parser: isolate opening entity, tag name, attributes string, and closing entity
    // Pattern groups: 1 = opening (&lt; or &lt;/), 2 = tag name, 3 = attributes (if any), 4 = closing &gt;
    escaped = escaped.replace(/(&lt;\/?\s*)([^\s&>\/]+)([\s\S]*?)(\/?&gt;)/g, (whole, open, name, attrs, close) => {
      // Color the tag name
      const taggedName = `<span style="color: ${colors.tag};">${name}</span>`;

      // Process attributes string (attrs) without touching the surrounding entities
      let processedAttrs = attrs;

      // Replace attribute occurrences inside attrs only
      processedAttrs = processedAttrs.replace(/([\w:-]+)(\s*=\s*)((&quot;[\s\S]*?&quot;|&#39;[\s\S]*?&#39;|[^\s&>]+))/g, (m, aname, aeq, aval) => {
        const nameLower = String(aname).toLowerCase();
        const outName = `<span style="color: ${colors.attrName};">${aname}</span>`;

        // Handle quoted values
        let inner = aval;
        let quote = '';
        if (aval.startsWith('&quot;') && aval.endsWith('&quot;')) {
          inner = aval.slice(6, -6);
          quote = '&quot;';
        } else if (aval.startsWith('&#39;') && aval.endsWith('&#39;')) {
          inner = aval.slice(5, -5);
          quote = '&#39;';
        }

        let outVal = aval;
        if (nameLower === 'style') {
          // Highlight inline CSS properties and values inside inner (which may still contain entities)
          const cssHighlighted = inner.replace(/([\w-]+)\s*:\s*([^;]+)(;?)/g, (cm, prop, v, semi) => {
            return `<span style="color: ${colors.styleProp};">${prop}</span>:<span style="color: ${colors.styleVal};">${v.trim()}</span>${semi}`;
          });
          if (quote) {
            outVal = `${quote}${cssHighlighted}${quote}`;
          } else {
            outVal = cssHighlighted;
          }
          outVal = `<span style="color: ${colors.attrValue};">${outVal}</span>`;
        } else {
          // Regular attribute value
          if (quote) {
            outVal = `${quote}${inner}${quote}`;
          }
          outVal = `<span style="color: ${colors.attrValue};">${outVal}</span>`;
        }

        return `${outName}${aeq}${outVal}`;
      });

      return `${open}${taggedName}${processedAttrs}${close}`;
    });

    // Return escaped string with inline spans
    return escaped;
  }

  // Method to check if content contains syntax that should be highlighted
  shouldHighlight(content: string): boolean {
    return /<\/?[\w:-]+|<!--/.test(content);
  }

  destroy(): void {
    this.editor = null;
  }
}
