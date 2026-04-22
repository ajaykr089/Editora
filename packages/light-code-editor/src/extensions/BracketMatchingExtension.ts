/**
 * Bracket Matching Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore, BracketMatch, Position } from '../types';

let BRACKET_MATCH_INSTANCE_COUNTER = 0;

export class BracketMatchingExtension implements EditorExtension {
  public readonly name = 'bracket-matching';
  private editor: EditorCore | null = null;
  private readonly bracketPairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
  };
  private readonly reverseBracketPairs = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
  };
  private readonly highlightId = ++BRACKET_MATCH_INSTANCE_COUNTER;
  private readonly highlightName = `editora-bracket-match-${this.highlightId}`;
  private readonly highlightStyleId = `editora-bracket-match-style-${this.highlightId}`;
  private currentMatch: BracketMatch | null = null;
  private hasCustomHighlightSupport = false;
  private observer: MutationObserver | null = null;
  private pendingUpdateRaf: number | null = null;
  private updateRequestVersion = 0;
  private cursorHandler: (() => void) | null = null;
  private changeHandler: (() => void) | null = null;

  setup(editor: EditorCore): void {
    this.editor = editor;
    this.hasCustomHighlightSupport = this.detectCustomHighlightSupport();
    if (this.hasCustomHighlightSupport) {
      this.ensureHighlightStyles();
      this.observeContentMutations();
    }

    this.cursorHandler = () => {
      this.scheduleBracketUpdate();
    };
    this.changeHandler = () => {
      this.scheduleBracketUpdate();
    };

    editor.on('cursor', this.cursorHandler);
    editor.on('change', this.changeHandler);
    this.scheduleBracketUpdate();
  }

  private scheduleBracketUpdate(): void {
    this.updateRequestVersion += 1;
    const requestVersion = this.updateRequestVersion;
    if (
      this.pendingUpdateRaf !== null &&
      typeof cancelAnimationFrame === 'function'
    ) {
      cancelAnimationFrame(this.pendingUpdateRaf);
      this.pendingUpdateRaf = null;
    }

    const run = () => {
      if (requestVersion !== this.updateRequestVersion) {
        return;
      }
      this.pendingUpdateRaf = null;
      this.updateBracketMatching();
    };

    if (typeof requestAnimationFrame === 'function') {
      this.pendingUpdateRaf = requestAnimationFrame(() => {
        this.pendingUpdateRaf = requestAnimationFrame(run);
      });
      return;
    }

    run();
  }

  private updateBracketMatching(): void {
    if (!this.editor) return;

    const cursor = this.editor.getCursor();
    const text = this.editor.getValue();

    this.clearBracketHighlighting();

    const bracket = this.getBracketNearPosition(text, cursor.position);
    if (!bracket) return;

    const match = this.findMatchingBracket(text, bracket);
    if (match) {
      this.currentMatch = match;
      this.highlightBrackets(match);
    }
  }

  private getBracketNearPosition(text: string, position: Position): { char: string, position: Position } | null {
    const lines = text.split('\n');
    if (position.line < 0 || position.line >= lines.length) return null;

    const candidates: Position[] = [{ line: position.line, column: position.column }];
    if (position.column > 0) {
      candidates.push({ line: position.line, column: position.column - 1 });
    }

    for (const candidate of candidates) {
      const bracket = this.getBracketAtPosition(lines, candidate);
      if (bracket) {
        return bracket;
      }
    }

    return null;
  }

  private getBracketAtPosition(lines: string[], position: Position): { char: string, position: Position } | null {
    if (position.line < 0 || position.line >= lines.length) return null;
    const line = lines[position.line];
    if (position.column < 0 || position.column >= line.length) return null;

    const char = line[position.column];
    if (
      this.bracketPairs[char as keyof typeof this.bracketPairs] ||
      this.reverseBracketPairs[char as keyof typeof this.reverseBracketPairs]
    ) {
      return { char, position };
    }

    return null;
  }

  private findMatchingBracket(text: string, bracket: { char: string, position: Position }): BracketMatch | null {
    const lines = text.split('\n');
    const startLine = bracket.position.line;
    const startCol = bracket.position.column;
    const char = bracket.char;

    if (this.bracketPairs[char as keyof typeof this.bracketPairs]) {
      return this.findClosingBracket(lines, startLine, startCol, char);
    }

    if (this.reverseBracketPairs[char as keyof typeof this.reverseBracketPairs]) {
      return this.findOpeningBracket(lines, startLine, startCol, char);
    }

    return null;
  }

  private findClosingBracket(lines: string[], startLine: number, startCol: number, openChar: string): BracketMatch | null {
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

  private findOpeningBracket(lines: string[], startLine: number, startCol: number, closeChar: string): BracketMatch | null {
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
    if (!this.editor || !this.hasCustomHighlightSupport) return;

    const view = this.editor.getView();
    const openRange = view.createDomRangeFromRange(match.open);
    const closeRange = view.createDomRangeFromRange(match.close);
    if (!openRange || !closeRange) return;

    try {
      const cssAny = CSS as unknown as { highlights?: Map<string, unknown> };
      const highlightCtor = (window as unknown as { Highlight?: new (...ranges: globalThis.Range[]) => unknown }).Highlight;
      if (!cssAny.highlights || !highlightCtor) return;
      cssAny.highlights.set(this.highlightName, new highlightCtor(openRange, closeRange));
    } catch {
      // Ignore highlight failures and keep the logical match state available.
    }
  }

  private clearBracketHighlighting(): void {
    this.currentMatch = null;
    if (!this.hasCustomHighlightSupport) return;

    try {
      const cssAny = CSS as unknown as { highlights?: Map<string, unknown> };
      cssAny.highlights?.delete(this.highlightName);
    } catch {
      // no-op fallback for unsupported runtime paths
    }
  }

  private observeContentMutations(): void {
    if (!this.editor || typeof MutationObserver === 'undefined') return;
    const contentElement = this.editor.getView().getContentElement();
    this.observer = new MutationObserver(() => {
      this.clearBracketHighlighting();
      this.scheduleBracketUpdate();
    });
    this.observer.observe(contentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private detectCustomHighlightSupport(): boolean {
    try {
      if (typeof CSS === 'undefined' || typeof window === 'undefined') {
        return false;
      }
      const cssAny = CSS as unknown as { highlights?: Map<string, unknown> };
      const highlightCtor = (window as unknown as { Highlight?: unknown }).Highlight;
      return !!cssAny.highlights && !!highlightCtor;
    } catch {
      return false;
    }
  }

  private ensureHighlightStyles(): void {
    if (typeof document === 'undefined') return;
    if (document.getElementById(this.highlightStyleId)) return;

    const style = document.createElement('style');
    style.id = this.highlightStyleId;
    style.textContent = `
      ::highlight(${this.highlightName}) {
        background-color: var(--lce-bracket-match-bg, rgba(86, 156, 214, 0.4));
        text-decoration: underline solid var(--lce-bracket-match-border, rgba(156, 220, 254, 0.95)) 2px;
      }
    `;
    document.head.appendChild(style);
  }

  getCurrentMatch(): BracketMatch | null {
    return this.currentMatch;
  }

  destroy(): void {
    if (this.pendingUpdateRaf !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.pendingUpdateRaf);
      this.pendingUpdateRaf = null;
    }
    this.clearBracketHighlighting();
    this.observer?.disconnect();
    this.observer = null;

    if (this.editor && this.cursorHandler) {
      this.editor.off('cursor', this.cursorHandler);
    }
    if (this.editor && this.changeHandler) {
      this.editor.off('change', this.changeHandler);
    }

    if (typeof document !== 'undefined') {
      const styleNode = document.getElementById(this.highlightStyleId);
      if (styleNode?.parentNode) {
        styleNode.parentNode.removeChild(styleNode);
      }
    }

    this.cursorHandler = null;
    this.changeHandler = null;
    this.editor = null;
  }
}
