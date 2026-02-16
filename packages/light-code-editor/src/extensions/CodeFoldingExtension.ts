/**
 * Code Folding Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorAPI } from '../types';

export class CodeFoldingExtension implements EditorExtension {
  public readonly name = 'code-folding';
  private editor: EditorAPI | null = null;
  private foldIndicators: HTMLElement[] = [];
  private foldingUI: HTMLElement | null = null;

  setup(editor: EditorAPI): void {
    this.editor = editor;

    // Register folding commands (basic implementation - just log for now)
    editor.registerCommand('fold', () => {
      this.foldAtCursor();
    });

    editor.registerCommand('unfold', () => {
      this.unfoldAtCursor();
    });

    editor.registerCommand('foldAll', () => {
      this.foldAll();
    });

    editor.registerCommand('unfoldAll', () => {
      this.unfoldAll();
    });

    // Keyboard shortcuts are now handled by KeymapExtension
    // The commands are registered above and will be triggered by the keymap

    // Listen for content changes to update fold indicators
    editor.on('change', () => {
      this.updateFoldIndicators();
    });

    // Initial setup
    this.createFoldingUI();
    this.updateFoldIndicators();
  }

  private createFoldingUI(): void {
    if (!this.editor) return;

    // Find the editor container
    const container = document.querySelector('.rte-source-editor-modal') as HTMLElement;
    if (!container) return;

    this.foldingUI = document.createElement('div');
    this.foldingUI.style.cssText = `
      position: absolute;
      left: 40px;
      top: 0;
      bottom: 0;
      width: 20px;
      pointer-events: none;
      z-index: 2;
    `;

    container.appendChild(this.foldingUI);
  }

  private updateFoldIndicators(): void {
    if (!this.editor || !this.foldingUI) return;

    // Clear existing indicators
    this.foldingUI.innerHTML = '';
    this.foldIndicators = [];

    const text = this.editor.getValue();
    const lines = text.split('\n');

    // Find foldable regions (simplified - could be extended for different languages)
    const foldableLines = this.findFoldableLines(lines);

    foldableLines.forEach(lineIndex => {
      this.createFoldIndicator(lineIndex);
    });
  }

  private findFoldableLines(lines: string[]): number[] {
    const foldableLines: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Simple folding rules - can be extended
      if (line.startsWith('{') || line.startsWith('function') ||
          line.startsWith('class') || line.startsWith('if') ||
          line.includes('=>') || line.startsWith('for') ||
          line.startsWith('while') || line.startsWith('try')) {
        foldableLines.push(i);
      }
    }

    return foldableLines;
  }

  private createFoldIndicator(lineIndex: number): void {
    if (!this.foldingUI) return;

    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: absolute;
      left: 0;
      top: ${lineIndex * 21}px;
      width: 20px;
      height: 21px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
      color: var(--editor-gutter-foreground, #858585);
      font-size: 10px;
      user-select: none;
    `;

    indicator.innerHTML = '▶'; // Right arrow for collapsed state
    indicator.title = 'Code folding not yet implemented - click shows fold indicators';

    indicator.addEventListener('click', () => {
    });

    this.foldingUI.appendChild(indicator);
    this.foldIndicators.push(indicator);
  }

  private foldAtCursor(): void {
    // Placeholder - folding not yet implemented in core
  }

  private unfoldAtCursor(): void {
    // Placeholder - folding not yet implemented in core
  }

  private foldAll(): void {
    // Placeholder - folding not yet implemented in core
  }

  private unfoldAll(): void {
    // Placeholder - folding not yet implemented in core
  }

  destroy(): void {
    if (this.foldingUI && this.foldingUI.parentNode) {
      this.foldingUI.parentNode.removeChild(this.foldingUI);
    }
    this.foldingUI = null;
    this.foldIndicators = [];
    this.editor = null;
  }
}
