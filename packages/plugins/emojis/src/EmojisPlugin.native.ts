import type { Plugin } from '@editora/core';
import { emojisSets, descriptions, type EmojiCategory } from './Constants';

/**
 * EmojisPlugin - Native implementation for emoji insertion
 * 
 * Features:
 * - Full-featured emoji picker dialog
 * - Categorized emojis (All, Symbols, People, Animals & Nature, Food & Drink, Activity, Travel & Places, Objects, Flags)
 * - Search/filter emojis by name or description
 * - Click to insert
 * - Responsive design
 * - Keyboard shortcut (Mod-Shift-j)
 * 
 * Commands:
 * - openEmojiDialog: Opens the emoji picker dialog
 * - insertEmoji: Inserts a specific emoji
 * 
 * UI/UX Features:
 * - Vertical tabs for categories (or horizontal on mobile)
 * - Search input with real-time filtering
 * - Grid layout with hover effects
 * - No results message when search returns empty
 * - Professional styling matching React design system
 */

let dialogElement: HTMLElement | null = null;
let activeTab: EmojiCategory = 'all';
let searchQuery = '';
// Store the selection range before opening the dialog
let savedSelectionRange: Range | null = null;

export const EmojisPlugin = (): Plugin => {
  return {
    name: "emojis",

    toolbar: [
      {
        label: "Insert Emoji",
        command: "openEmojiDialog",
        icon: '<svg width="24" height="24" focusable="false"><path d="M9 11c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm6 0c.6 0 1-.4 1-1s-.4-1-1-1a1 1 0 0 0-1 1c0 .6.4 1 1 1Zm-3 5.5c2.1 0 4-1.5 4.4-3.5H7.6c.5 2 2.3 3.5 4.4 3.5ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 14.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" fill-rule="nonzero"></path></svg>',
        shortcut: "Mod-Shift-j",
        type: "button",
      },
    ],

    commands: {
      openEmojiDialog: (_args, context) => {
        // Try to get the correct editor content element from context
        const editorContent = context?.contentElement || getActiveEditorContent();
        if (editorContent) {
          createEmojiDialog(editorContent);
          return true;
        }
        return false;
      },

      insertEmoji: (emoji?: string, context?) => {
        if (!emoji) return false;
        const editorContent = context?.contentElement || getActiveEditorContent();
        if (!editorContent) return false;
        try {
          insertEmoji(emoji, editorContent);
          return true;
        } catch (error) {
          // No console log in production
          return false;
        }
      },
    },

    keymap: {
      "Mod-Shift-j": "openEmojiDialog",
    },
  };
};

function createEmojiDialog(editorContent: HTMLElement): void {
  activeTab = 'all';
  searchQuery = '';

  // Save the current selection range before opening the dialog
  const selection = window.getSelection();
  savedSelectionRange = null;
  if (selection && selection.rangeCount > 0 && editorContent.contains(selection.anchorNode)) {
    savedSelectionRange = selection.getRangeAt(0).cloneRange();
  }

  const overlay = document.createElement('div');
  overlay.className = 'emojis-overlay';
  overlay.onclick = closeDialog;

  const dialog = document.createElement('div');
  dialog.className = 'emojis-dialog';
  dialog.onclick = (e) => e.stopPropagation();

  const categories = Object.keys(emojisSets) as EmojiCategory[];

  dialog.innerHTML = `
    <div class="rte-dialog-header emojis-header">
      <h3>Insert Emojis</h3>
      <button class="rte-dialog-close emojis-close">×</button>
    </div>
    <div class="rte-dialog-body emojis-content">
      <div class="emojis-tabs">
        ${categories.map(category => `
          <button class="emojis-tab ${category === activeTab ? 'active' : ''}" data-category="${category}">
            ${emojisSets[category].name}
          </button>
        `).join('')}
      </div>
      <div class="emojis-main-content">
        <div class="emojis-search">
          <svg class="emojis-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search emojis..." 
            class="emojis-search-input"
            id="emoji-search-input"
          />
        </div>
        <div class="emojis-grid" id="emojis-grid">
          ${renderEmojiGrid(activeTab, searchQuery)}
        </div>
      </div>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  dialogElement = overlay;

  // Add event listeners
  setupEmojiDialogEventListeners(dialog, editorContent);

  injectEmojiDialogStyles();

  setTimeout(() => {
    (dialog.querySelector('#emoji-search-input') as HTMLInputElement)?.focus();
  }, 100);
}

function setupEmojiDialogEventListeners(dialog: HTMLElement, editorContent: HTMLElement): void {
  dialog.querySelector('.emojis-close')?.addEventListener('click', closeDialog);

  dialog.querySelectorAll('.emojis-tab').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const category = (e.target as HTMLElement).getAttribute('data-category') as EmojiCategory;
      if (category) switchEmojiTab(dialog, category, editorContent);
    });
  });

  const searchInput = dialog.querySelector('#emoji-search-input') as HTMLInputElement;
  searchInput?.addEventListener('input', (e) => {
    searchQuery = (e.target as HTMLInputElement).value;
    updateEmojiGrid(dialog, editorContent);
  });

  // Initial emoji click handlers
  updateEmojiGrid(dialog, editorContent);
}

function switchEmojiTab(dialog: HTMLElement, category: EmojiCategory, editorContent: HTMLElement): void {
  activeTab = category;
  dialog.querySelectorAll('.emojis-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });
  updateEmojiGrid(dialog, editorContent);
}

function updateEmojiGrid(dialog: HTMLElement, editorContent: HTMLElement): void {
  const grid = dialog.querySelector('#emojis-grid');
  if (grid) {
    grid.innerHTML = renderEmojiGrid(activeTab, searchQuery);
    grid.querySelectorAll('.emojis-item').forEach((item) => {
      item.addEventListener('click', () => {
        const emoji = item.textContent?.trim() || '';
        if (emoji) {
          insertEmoji(emoji, editorContent);
          closeDialog();
        }
      });
    });
  }
}

function renderEmojiGrid(category: EmojiCategory, search: string): string {
  let emojis = emojisSets[category].emojis;

  // Filter by search query
  if (search.trim()) {
    emojis = emojis.filter(emoji => {
      // Search by emoji itself
      if (emoji.toLowerCase().includes(search.toLowerCase())) {
        return true;
      }

      // Search by Unicode name/description
      const description = descriptions[emoji] || '';
      return description.toLowerCase().includes(search.toLowerCase());
    });
  }

  if (emojis.length === 0 && search.trim()) {
    return `<div class="emojis-no-results">No emojis found for "${search}"</div>`;
  }

  return emojis.map((emoji, index) => `
    <button 
      class="emojis-item" 
      title="Insert ${emoji}"
      data-emoji="${emoji}"
    >
      ${emoji}
    </button>
  `).join('');
}

function closeDialog(): void {
  if (dialogElement) {
    document.body.removeChild(dialogElement);
    dialogElement = null;
  }
}

// Helper function to insert emoji at cursor
function insertEmoji(emoji: string, editorContent: HTMLElement): void {
  editorContent.focus();
  let selection = window.getSelection();
  // Restore the saved selection range if available
  if (savedSelectionRange) {
    selection?.removeAllRanges();
    selection?.addRange(savedSelectionRange);
    savedSelectionRange = null;
  }
  selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(emoji);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
// Helper to get the currently focused editor content element (fallback)
function getActiveEditorContent(): HTMLElement | null {
  // Try to find the focused .editora-content or .rte-content
  const active = document.activeElement as HTMLElement | null;
  if (active && (active.classList.contains('editora-content') || active.classList.contains('rte-content'))) {
    return active;
  }
  // Fallback: first editor content in DOM
  return document.querySelector('.editora-content, .rte-content') as HTMLElement | null;
}

function injectEmojiDialogStyles(): void {
  if (document.getElementById('emojis-dialog-styles')) return;

  const style = document.createElement('style');
  style.id = 'emojis-dialog-styles';
  style.textContent = `
    /* Emojis Dialog Styles */
    .emojis-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .emojis-dialog {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      max-width: 800px;
      width: 90%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }

    .emojis-header h3 {
      color: #1a202c;
    }

    .emojis-content {
      display: flex;
      flex: 1;
      overflow: hidden;
      padding: 0;
    }

    .emojis-main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .emojis-search {
      padding: 16px 16px 0 16px;
      position: relative;
    }

    .emojis-search-icon {
      position: absolute;
      left: 28px;
      top: 27px;
      color: #a0aec0;
      pointer-events: none;
      z-index: 1;
    }

    .emojis-search-input {
      width: calc(100% - 24px);
      padding: 10px 12px 10px 40px;
      border: 1px solid #e1e5e9;
      border-radius: 6px;
      font-size: 14px;
      color: #2d3748;
      background-color: #ffffff;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .emojis-search-input:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }

    .emojis-search-input:focus + .emojis-search-icon {
      color: #4299e1;
    }

    .emojis-search-input::placeholder {
      color: #a0aec0;
    }

    .emojis-tabs {
      display: flex;
      flex-direction: column;
      width: 180px;
      border-right: 1px solid #e1e5e9;
      background-color: #f8fafc;
    }

    .emojis-tab {
      padding: 12px 16px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      color: #4a5568;
      border-bottom: 1px solid #e1e5e9;
      transition: all 0.2s ease;
    }

    .emojis-tab:hover {
      background-color: #edf2f7;
      color: #2d3748;
    }

    .emojis-tab.active {
      background-color: #4299e1;
      color: white;
      font-weight: 500;
    }

    .emojis-tab.active:hover {
      background-color: #3182ce;
    }

    .emojis-grid {
      padding: 16px;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
      gap: 8px;
    }

    .emojis-item {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e1e5e9;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.2s ease;
      color: #2d3748;
    }

    .emojis-item:hover {
      background-color: #4299e1;
      border-color: #4299e1;
      color: white;
      transform: scale(1.05);
    }

    .emojis-item:active {
      transform: scale(0.95);
    }

    .emojis-no-results {
      grid-column: 1 / -1;
      text-align: center;
      color: #718096;
      font-size: 14px;
      padding: 40px 20px;
      background-color: #f8fafc;
      border-radius: 6px;
      border: 1px solid #e1e5e9;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .emojis-dialog {
        width: 95%;
        max-height: 90vh;
      }

      .emojis-content {
        flex-direction: column;
      }

      .emojis-tabs {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid #e1e5e9;
        flex-direction: row;
        overflow-x: auto;
      }

      .emojis-tab {
        border-bottom: none;
        border-right: 1px solid #e1e5e9;
        white-space: nowrap;
        min-width: 80px;
      }

      .emojis-grid {
        grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
        gap: 6px;
      }

      .emojis-item {
        width: 36px;
        height: 36px;
        font-size: 16px;
      }
    }
  `;
  
  document.head.appendChild(style);
}
