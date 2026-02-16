/**
 * Bracket Matching Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore, BracketMatch, Position } from '../types';

export class BracketMatchingExtension implements EditorExtension {
  public readonly name = 'bracket-matching';
  private editor: EditorCore | null = null;
  private bracketPairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
  };
  private reverseBracketPairs = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
  };
  private currentMatch: BracketMatch | null = null;

  setup(editor: EditorCore): void {
    this.editor = editor;

    // Listen for cursor changes to update bracket matching
    editor.on('cursor', () => {
      this.updateBracketMatching();
    });

    editor.on('change', () => {
      this.updateBracketMatching();
    });
  }

  private updateBracketMatching(): void {
    if (!this.editor) return;

    const cursor = this.editor.getCursor();
    const text = this.editor.getValue();

    // Clear previous highlighting
    this.clearBracketHighlighting();

    // Find bracket at cursor position
    const bracket = this.getBracketAtPosition(text, cursor.position);
    if (!bracket) return;

    // Find matching bracket
    const match = this.findMatchingBracket(text, bracket);
    if (match) {
      this.currentMatch = match;
      this.highlightBrackets(match);
    }
  }

  private getBracketAtPosition(text: string, position: Position): { char: string, position: Position } | null {
    const lines = text.split('\n');
    if (position.line >= lines.length) return null;

    const line = lines[position.line];
    if (position.column >= line.length) return null;

    const char = line[position.column];

    // Check if it's a bracket
    if (this.bracketPairs[char as keyof typeof this.bracketPairs] || this.reverseBracketPairs[char as keyof typeof this.reverseBracketPairs]) {
      return { char, position };
    }

    return null;
  }

  private findMatchingBracket(text: string, bracket: { char: string, position: Position }): BracketMatch | null {
    const lines = text.split('\n');
    const startLine = bracket.position.line;
    const startCol = bracket.position.column;
    const char = bracket.char;

    // If it's an opening bracket, find closing
    if (this.bracketPairs[char as keyof typeof this.bracketPairs]) {
      return this.findClosingBracket(text, lines, startLine, startCol, char);
    }

    // If it's a closing bracket, find opening
    if (this.reverseBracketPairs[char as keyof typeof this.reverseBracketPairs]) {
      return this.findOpeningBracket(text, lines, startLine, startCol, char);
    }

    return null;
  }

  private findClosingBracket(text: string, lines: string[], startLine: number, startCol: number, openChar: string): BracketMatch | null {
    const closeChar = this.bracketPairs[openChar as keyof typeof this.bracketPairs];
    let depth = 0;

    for (let line = startLine; line < lines.length; line++) {
      const lineText = lines[line];
      const startColForLine = line === startLine ? startCol : 0;

      for (let col = startColForLine; col < lineText.length; col++) {
        const char = lineText[col];

        if (char === openChar) {
          depth++;
        } else if (char === closeChar) {
          depth--;
          if (depth === 0) {
            return {
              open: { start: { line: startLine, column: startCol }, end: { line: startLine, column: startCol + 1 } },
              close: { start: { line, column: col }, end: { line, column: col + 1 } },
              type: openChar as '(' | '[' | '{' | '<'
            };
          }
        }
      }
    }

    return null;
  }

  private findOpeningBracket(text: string, lines: string[], startLine: number, startCol: number, closeChar: string): BracketMatch | null {
    const openChar = this.reverseBracketPairs[closeChar as keyof typeof this.reverseBracketPairs];
    let depth = 0;

    for (let line = startLine; line >= 0; line--) {
      const lineText = lines[line];
      const endColForLine = line === startLine ? startCol : lineText.length - 1;

      for (let col = endColForLine; col >= 0; col--) {
        const char = lineText[col];

        if (char === closeChar) {
          depth++;
        } else if (char === openChar) {
          depth--;
          if (depth === 0) {
            return {
              open: { start: { line, column: col }, end: { line, column: col + 1 } },
              close: { start: { line: startLine, column: startCol }, end: { line: startLine, column: startCol + 1 } },
              type: openChar as '(' | '[' | '{' | '<'
            };
          }
        }
      }
    }

    return null;
  }

  private highlightBrackets(match: BracketMatch): void {
    // This would apply CSS classes or styling to highlight the brackets
    // For now, we'll just log the match for demonstration
  }

  private clearBracketHighlighting(): void {
    this.currentMatch = null;
    // Clear any existing highlighting
  }

  getCurrentMatch(): BracketMatch | null {
    return this.currentMatch;
  }

  destroy(): void {
    this.clearBracketHighlighting();
    this.editor = null;
  }
}
