import { Dialog } from '../Dialog';

/**
 * EmojiDialog - Native dialog for emoji insertion
 * 
 * Features:
 * - Categorized emojis
 * - Search/filter emojis
 * - Click to insert
 * - Popular emojis, smileys, objects, symbols
 */

export interface EmojiDialogOptions {
  onSelect: (emoji: string) => void;
}

export class EmojiDialog {
  private dialog: Dialog;
  private searchInput: HTMLInputElement;
  private categorySelect: HTMLSelectElement;
  private emojisGrid: HTMLDivElement;
  private onSelect: (emoji: string) => void;

  private readonly emojis = {
    popular: ['😀', '😃', '😄', '😁', '😊', '😍', '🤩', '😘', '😗', '😚', '😙', '🙂', '🤗', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '👍', '👎', '👌', '✌️', '🤞', '🤝', '👏', '🙌', '👋', '🤚', '✋', '🖐️', '🖖', '👊', '✊', '🤛', '🤜', '💪'],
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔'],
    emotions: ['😳', '😞', '😟', '😠', '😡', '🤬', '😔', '😕', '🙁', '😬', '🥺', '😣', '😖', '😫', '😩', '🥱', '😤', '😮', '😱', '😨', '😰', '😥', '😢', '😭', '😪', '😓', '🤤', '😴', '😷', '🤒'],
    gestures: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '✋', '🖐️', '🖖', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿'],
    people: ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👲', '👳', '🧕', '👮', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️', '👩‍🎓', '👨‍🎓', '👩‍🏫', '👨‍🏫', '👩‍⚖️', '👨‍⚖️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🔧'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗'],
    nature: ['🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '⭐', '🌟'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐'],
    objects: ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🕹️', '💾', '💿', '📀', '📷', '📹', '🎥', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏰', '📡', '🔋', '🔌', '💡'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '✨', '💫', '⭐', '🌟', '✔️', '✅', '❌', '❎', '➕', '➖', '✖️', '➗'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷']
  };

  constructor(options: EmojiDialogOptions) {
    this.onSelect = options.onSelect;

    const content = this.createContent();

    this.dialog = new Dialog({
      title: 'Insert Emoji',
      content,
      buttons: [
        {
          label: 'Close',
          onClick: () => this.dialog.close()
        }
      ]
    });

    this.searchInput = content.querySelector('#emoji-search') as HTMLInputElement;
    this.categorySelect = content.querySelector('#emoji-category') as HTMLSelectElement;
    this.emojisGrid = content.querySelector('#emoji-grid') as HTMLDivElement;

    this.searchInput.addEventListener('input', () => this.filterEmojis());
    this.categorySelect.addEventListener('change', () => this.updateGrid());

    this.updateGrid();
  }

  private createContent(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'emoji-dialog-content';
    container.style.minWidth = '500px';

    container.innerHTML = `
      <style>
        .emoji-dialog-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .emoji-controls {
          display: flex;
          gap: 0.5rem;
        }
        .emoji-search, .emoji-category {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .emoji-search {
          flex: 1;
        }
        .emoji-category {
          min-width: 150px;
        }
        .emoji-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 0.5rem;
          max-height: 350px;
          overflow-y: auto;
          padding: 1rem;
          background: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .emoji-button {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 24px;
          transition: all 0.2s;
        }
        .emoji-button:hover {
          background: #fff3e0;
          border-color: #ff9800;
          transform: scale(1.15);
        }
        .emoji-info {
          padding: 0.5rem;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>

      <div class="emoji-controls">
        <input 
          type="text" 
          id="emoji-search" 
          class="emoji-search" 
          placeholder="Search emojis..."
        />
        <select id="emoji-category" class="emoji-category">
          <option value="all">All Emojis</option>
          <option value="popular">Popular</option>
          <option value="smileys">Smileys & Faces</option>
          <option value="emotions">Emotions</option>
          <option value="gestures">Gestures & Hands</option>
          <option value="people">People</option>
          <option value="animals">Animals</option>
          <option value="nature">Nature</option>
          <option value="food">Food & Drink</option>
          <option value="objects">Objects</option>
          <option value="symbols">Symbols</option>
          <option value="activities">Activities & Sports</option>
        </select>
      </div>

      <div id="emoji-grid" class="emoji-grid"></div>

      <div class="emoji-info">
        Click any emoji to insert it into your document.
      </div>
    `;

    return container;
  }

  private updateGrid(): void {
    const category = this.categorySelect.value;
    this.emojisGrid.innerHTML = '';

    let emojisToShow: string[] = [];

    if (category === 'all') {
      emojisToShow = Object.values(this.emojis).flat();
    } else {
      emojisToShow = this.emojis[category as keyof typeof this.emojis] || [];
    }

    emojisToShow.forEach(emoji => {
      const button = document.createElement('button');
      button.className = 'emoji-button';
      button.textContent = emoji;
      button.title = `Insert ${emoji}`;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSelect(emoji);
      });
      this.emojisGrid.appendChild(button);
    });
  }

  private filterEmojis(): void {
    const searchTerm = this.searchInput.value.toLowerCase();
    const buttons = this.emojisGrid.querySelectorAll('.emoji-button');

    buttons.forEach(button => {
      const emoji = button.textContent || '';
      const visible = !searchTerm || emoji.includes(searchTerm);
      (button as HTMLElement).style.display = visible ? 'flex' : 'none';
    });
  }

  private handleSelect(emoji: string): void {
    this.onSelect(emoji);
    this.dialog.close();
  }

  public show(): void {
    this.dialog.show();
    this.searchInput.value = '';
    this.categorySelect.value = 'popular';
    this.updateGrid();
    
    setTimeout(() => this.searchInput.focus(), 100);
  }

  public close(): void {
    this.dialog.close();
  }
}
