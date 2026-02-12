import { Dialog } from '../Dialog';

/**
 * CharacterDialog - Native dialog for special character insertion
 * 
 * Features:
 * - Categorized special characters
 * - Search/filter characters
 * - Click to insert
 * - Common symbols, arrows, currency, math
 */

export interface CharacterDialogOptions {
  onSelect: (character: string) => void;
}

export class CharacterDialog {
  private dialog: Dialog;
  private searchInput: HTMLInputElement;
  private categorySelect: HTMLSelectElement;
  private charactersGrid: HTMLDivElement;
  private onSelect: (character: string) => void;

  private readonly characters = {
    common: ['©', '®', '™', '§', '¶', '†', '‡', '•', '‣', '⁃', '◦', '▪', '▫', '◊', '○', '●', '□', '■', '△', '▲', '▽', '▼', '◇', '◆', '★', '☆'],
    arrows: ['←', '→', '↑', '↓', '↔', '↕', '⇐', '⇒', '⇑', '⇓', '⇔', '⇕', '⟵', '⟶', '⟷', '↖', '↗', '↘', '↙', '⇖', '⇗', '⇘', '⇙'],
    currency: ['$', '€', '£', '¥', '₹', '₽', '₩', '₪', '₦', '฿', '₴', '₡', '₵', '₸', '₫', '₱', '₲', '₳', '₭'],
    math: ['±', '×', '÷', '=', '≠', '≈', '≡', '≤', '≥', '<', '>', '∞', '∑', '∏', '∫', '∂', '√', '∛', '∜', '°', '′', '″', '∠', '∟', '⊥', '∥'],
    greek: ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ'],
    punctuation: ['\u201A', '\u201E', '\u201C', '\u201D', '\u2018', '\u2019', '«', '»', '‹', '›', '—', '–', '…', '·', '¡', '¿', '‰', '′', '″', '‴'],
    superscript: ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁺', '⁻', '⁼', '⁽', '⁾', 'ⁿ', 'ⁱ'],
    subscript: ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉', '₊', '₋', '₌', '₍', '₎']
  };

  constructor(options: CharacterDialogOptions) {
    this.onSelect = options.onSelect;

    const content = this.createContent();

    this.dialog = new Dialog({
      title: 'Insert Special Character',
      content,
      buttons: [
        {
          label: 'Close',
          onClick: () => this.dialog.close()
        }
      ]
    });

    this.searchInput = content.querySelector('#char-search') as HTMLInputElement;
    this.categorySelect = content.querySelector('#char-category') as HTMLSelectElement;
    this.charactersGrid = content.querySelector('#char-grid') as HTMLDivElement;

    // Add event listeners
    this.searchInput.addEventListener('input', () => this.filterCharacters());
    this.categorySelect.addEventListener('change', () => this.updateGrid());

    // Initial render
    this.updateGrid();
  }

  private createContent(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'character-dialog-content';
    container.style.minWidth = '500px';

    container.innerHTML = `
      <style>
        .character-dialog-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .char-controls {
          display: flex;
          gap: 0.5rem;
        }
        .char-search, .char-category {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .char-search {
          flex: 1;
        }
        .char-category {
          min-width: 150px;
        }
        .char-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 0.5rem;
          max-height: 300px;
          overflow-y: auto;
          padding: 1rem;
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .char-button {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.2s;
        }
        .char-button:hover {
          background: #e3f2fd;
          border-color: #2196f3;
          transform: scale(1.1);
        }
        .char-info {
          padding: 0.5rem;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>

      <div class="char-controls">
        <input 
          type="text" 
          id="char-search" 
          class="char-search" 
          placeholder="Search characters..."
        />
        <select id="char-category" class="char-category">
          <option value="all">All Categories</option>
          <option value="common">Common Symbols</option>
          <option value="arrows">Arrows</option>
          <option value="currency">Currency</option>
          <option value="math">Mathematics</option>
          <option value="greek">Greek Letters</option>
          <option value="punctuation">Punctuation</option>
          <option value="superscript">Superscript</option>
          <option value="subscript">Subscript</option>
        </select>
      </div>

      <div id="char-grid" class="char-grid"></div>

      <div class="char-info">
        Click any character to insert it into your document.
      </div>
    `;

    return container;
  }

  private updateGrid(): void {
    const category = this.categorySelect.value;
    this.charactersGrid.innerHTML = '';

    let charactersToShow: string[] = [];

    if (category === 'all') {
      charactersToShow = Object.values(this.characters).flat();
    } else {
      charactersToShow = this.characters[category as keyof typeof this.characters] || [];
    }

    charactersToShow.forEach(char => {
      const button = document.createElement('button');
      button.className = 'char-button';
      button.textContent = char;
      button.title = `Insert ${char} (U+${char.charCodeAt(0).toString(16).toUpperCase()})`;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSelect(char);
      });
      this.charactersGrid.appendChild(button);
    });
  }

  private filterCharacters(): void {
    const searchTerm = this.searchInput.value.toLowerCase();
    const buttons = this.charactersGrid.querySelectorAll('.char-button');

    buttons.forEach(button => {
      const char = button.textContent || '';
      const unicode = `u+${char.charCodeAt(0).toString(16)}`;
      const visible = !searchTerm || char.includes(searchTerm) || unicode.includes(searchTerm);
      (button as HTMLElement).style.display = visible ? 'flex' : 'none';
    });
  }

  private handleSelect(character: string): void {
    this.onSelect(character);
    this.dialog.close();
  }

  public show(): void {
    this.dialog.show();
    this.searchInput.value = '';
    this.categorySelect.value = 'all';
    this.updateGrid();
    
    setTimeout(() => this.searchInput.focus(), 100);
  }

  public close(): void {
    this.dialog.close();
  }
}
