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
  private pendingUpdateRaf: number | null = null;
  private lastSnapshot = '';
  private changeHandler: ((changes: unknown[]) => void) | null = null;

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

    // Listen for content changes and batch expensive indicator updates per frame.
    this.changeHandler = () => {
      this.scheduleFoldIndicatorUpdate();
    };
    editor.on('change', this.changeHandler);

    // Initial setup
    this.createFoldingUI();
    this.scheduleFoldIndicatorUpdate();
  }

  private createFoldingUI(): void {
    if (!this.editor) return;

    // Mount UI against the current editor modal to avoid cross-instance collisions.
    const contentElement = this.editor.getView().getContentElement();
    const container =
      (contentElement.closest('.rte-source-editor-modal') as HTMLElement | null) ||
      contentElement.parentElement;
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

  private scheduleFoldIndicatorUpdate(): void {
    if (this.pendingUpdateRaf !== null) return;
    this.pendingUpdateRaf = requestAnimationFrame(() => {
      this.pendingUpdateRaf = null;
      this.updateFoldIndicators();
    });
  }

  private updateFoldIndicators(): void {
    if (!this.editor || !this.foldingUI) return;
    const text = this.editor.getValue();
    if (text === this.lastSnapshot) return;
    this.lastSnapshot = text;

    // Clear existing indicators
    this.foldingUI.innerHTML = '';
    this.foldIndicators = [];

    const lines = text.split('\n');

    // Find foldable regions (simplified - could be extended for different languages)
    const foldableLines = this.findFoldableLines(lines);
    const fragment = document.createDocumentFragment();

    foldableLines.forEach(lineIndex => {
      const indicator = this.createFoldIndicator(lineIndex);
      fragment.appendChild(indicator);
      this.foldIndicators.push(indicator);
    });
    this.foldingUI.appendChild(fragment);
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

  private createFoldIndicator(lineIndex: number): HTMLElement {
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

    return indicator;
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
    if (this.pendingUpdateRaf !== null) {
      cancelAnimationFrame(this.pendingUpdateRaf);
      this.pendingUpdateRaf = null;
    }
    if (this.editor && this.changeHandler) {
      this.editor.off('change', this.changeHandler);
    }
    if (this.foldingUI && this.foldingUI.parentNode) {
      this.foldingUI.parentNode.removeChild(this.foldingUI);
    }
    this.changeHandler = null;
    this.lastSnapshot = '';
    this.foldingUI = null;
    this.foldIndicators = [];
    this.editor = null;
  }
}
