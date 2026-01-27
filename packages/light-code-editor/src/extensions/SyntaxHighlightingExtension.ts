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
    console.log('SyntaxHighlightingExtension: Isolated extension loaded - ready for use');
  }

  // Extension provides methods that can be called by the editor
  setTheme(theme: string): void {
    this.currentTheme = theme;
    console.log(`SyntaxHighlightingExtension: Theme changed to ${theme}`);
  }

  // Method to get syntax highlighting colors for a given theme
  getSyntaxColors(): Record<string, string> {
    return this.currentTheme === 'dark' ? {
      tag: '#569cd6',        // Blue
      comment: '#6a9955',    // Green
      attrValue: '#ce9178',  // Orange
      text: '#d4d4d4'        // Light gray
    } : {
      tag: '#0000ff',        // Blue
      comment: '#008000',    // Green
      attrValue: '#a31515',  // Red
      text: '#000000'        // Black
    };
  }

  // Method to parse and highlight HTML content (returns highlighted HTML string)
  highlightHTML(html: string): string {
    const colors = this.getSyntaxColors();
    let highlighted = html;

    // First, highlight HTML tags
    highlighted = highlighted.replace(
      /(<\/?[\w:-]+(?:\s[^>]*?)?\/?>)/g,
      `<span style="color: ${colors.tag};">$1</span>`
    );

    // Then highlight HTML comments
    highlighted = highlighted.replace(
      /(<!--[\s\S]*?-->)/g,
      `<span style="color: ${colors.comment};">$1</span>`
    );

    // Finally highlight attribute values
    highlighted = highlighted.replace(
      /("[^"]*"|'[^']*')/g,
      `<span style="color: ${colors.attrValue};">$1</span>`
    );

    return highlighted;
  }

  // Method to check if content contains syntax that should be highlighted
  shouldHighlight(content: string): boolean {
    return /<\/?[\w:-]+|<!--/.test(content);
  }

  destroy(): void {
    this.editor = null;
    console.log('SyntaxHighlightingExtension: Extension destroyed');
  }
}
