import { Dialog } from '../Dialog';

/**
 * MathDialog - Native dialog for mathematical equation insertion
 * 
 * Features:
 * - LaTeX input with preview
 * - Common math symbols palette
 * - Insert equations as inline or block
 * - Support for basic math notation
 */

export interface MathDialogOptions {
  onSubmit: (data: { latex: string; display: 'inline' | 'block' }) => void;
}

export class MathDialog {
  private dialog: Dialog;
  private latexInput: HTMLTextAreaElement;
  private previewDiv: HTMLDivElement;
  private displayTypeSelect: HTMLSelectElement;
  private onSubmit: (data: { latex: string; display: 'inline' | 'block' }) => void;

  constructor(options: MathDialogOptions) {
    this.onSubmit = options.onSubmit;

    // Create dialog content
    const content = this.createContent();

    // Initialize dialog
    this.dialog = new Dialog({
      title: 'Insert Math Equation',
      content,
      buttons: [
        {
          label: 'Cancel',
          onClick: () => this.dialog.close()
        },
        {
          label: 'Insert',
          onClick: () => this.handleSubmit(),
          primary: true
        }
      ]
    });

    // Get references to form elements
    this.latexInput = content.querySelector('#math-latex') as HTMLTextAreaElement;
    this.previewDiv = content.querySelector('#math-preview') as HTMLDivElement;
    this.displayTypeSelect = content.querySelector('#math-display-type') as HTMLSelectElement;

    // Add event listeners
    this.latexInput.addEventListener('input', () => this.updatePreview());
  }

  private createContent(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'math-dialog-content';
    container.style.minWidth = '500px';

    container.innerHTML = `
      <style>
        .math-dialog-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .math-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .math-form-group label {
          font-weight: 500;
          color: #333;
        }
        .math-latex-input {
          width: 100%;
          min-height: 80px;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          resize: vertical;
        }
        .math-preview {
          padding: 1rem;
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
          min-height: 60px;
          font-size: 18px;
          text-align: center;
        }
        .math-preview:empty::before {
          content: 'Preview will appear here...';
          color: #999;
          font-style: italic;
        }
        .math-symbols {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .math-symbol-btn {
          padding: 0.5rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
        }
        .math-symbol-btn:hover {
          background: #e3f2fd;
          border-color: #2196f3;
        }
        .math-display-select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
      </style>

      <div class="math-form-group">
        <label for="math-latex">LaTeX Expression:</label>
        <textarea 
          id="math-latex" 
          class="math-latex-input"
          placeholder="Enter LaTeX (e.g., x^2 + y^2 = r^2)"
        ></textarea>
      </div>

      <div class="math-form-group">
        <label>Common Symbols:</label>
        <div class="math-symbols">
          <button class="math-symbol-btn" data-symbol="\\frac{a}{b}" title="Fraction">a/b</button>
          <button class="math-symbol-btn" data-symbol="x^{2}" title="Superscript">x²</button>
          <button class="math-symbol-btn" data-symbol="x_{i}" title="Subscript">xᵢ</button>
          <button class="math-symbol-btn" data-symbol="\\sqrt{x}" title="Square root">√x</button>
          <button class="math-symbol-btn" data-symbol="\\sum" title="Sum">∑</button>
          <button class="math-symbol-btn" data-symbol="\\int" title="Integral">∫</button>
          <button class="math-symbol-btn" data-symbol="\\pi" title="Pi">π</button>
          <button class="math-symbol-btn" data-symbol="\\alpha" title="Alpha">α</button>
          <button class="math-symbol-btn" data-symbol="\\beta" title="Beta">β</button>
          <button class="math-symbol-btn" data-symbol="\\gamma" title="Gamma">γ</button>
          <button class="math-symbol-btn" data-symbol="\\theta" title="Theta">θ</button>
          <button class="math-symbol-btn" data-symbol="\\lambda" title="Lambda">λ</button>
          <button class="math-symbol-btn" data-symbol="\\infty" title="Infinity">∞</button>
          <button class="math-symbol-btn" data-symbol="\\leq" title="Less or equal">≤</button>
          <button class="math-symbol-btn" data-symbol="\\geq" title="Greater or equal">≥</button>
          <button class="math-symbol-btn" data-symbol="\\neq" title="Not equal">≠</button>
        </div>
      </div>

      <div class="math-form-group">
        <label for="math-preview">Preview:</label>
        <div id="math-preview" class="math-preview"></div>
      </div>

      <div class="math-form-group">
        <label for="math-display-type">Display Type:</label>
        <select id="math-display-type" class="math-display-select">
          <option value="inline">Inline (within text)</option>
          <option value="block">Block (centered, new line)</option>
        </select>
      </div>
    `;

    // Add symbol button handlers
    const symbolButtons = container.querySelectorAll('.math-symbol-btn');
    symbolButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const symbol = (btn as HTMLElement).getAttribute('data-symbol');
        if (symbol && this.latexInput) {
          const start = this.latexInput.selectionStart;
          const end = this.latexInput.selectionEnd;
          const text = this.latexInput.value;
          
          this.latexInput.value = text.substring(0, start) + symbol + text.substring(end);
          this.latexInput.focus();
          this.latexInput.selectionStart = this.latexInput.selectionEnd = start + symbol.length;
          
          this.updatePreview();
        }
      });
    });

    return container;
  }

  private updatePreview(): void {
    const latex = this.latexInput.value.trim();
    
    if (!latex) {
      this.previewDiv.textContent = '';
      return;
    }

    // Simple LaTeX to Unicode conversion for preview
    // In production, you'd use MathJax or KaTeX here
    let preview = latex
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
      .replace(/\^\{([^}]+)\}/g, '^$1')
      .replace(/\_\{([^}]+)\}/g, '_$1')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\sum/g, '∑')
      .replace(/\\int/g, '∫')
      .replace(/\\pi/g, 'π')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\theta/g, 'θ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\infty/g, '∞')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠');

    this.previewDiv.textContent = preview;
  }

  private handleSubmit(): void {
    const latex = this.latexInput.value.trim();
    
    if (!latex) {
      alert('Please enter a LaTeX expression.');
      return;
    }

    const displayType = this.displayTypeSelect.value as 'inline' | 'block';

    this.onSubmit({ latex, display: displayType });
    this.dialog.close();
  }

  public show(): void {
    this.dialog.show();
    this.latexInput.value = '';
    this.previewDiv.textContent = '';
    this.displayTypeSelect.value = 'inline';
    
    // Focus the input after dialog opens
    setTimeout(() => this.latexInput.focus(), 100);
  }

  public close(): void {
    this.dialog.close();
  }
}
