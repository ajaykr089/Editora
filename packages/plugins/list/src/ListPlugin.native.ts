import { Plugin } from '@editora/core';
import { recordDomHistory } from '../../shared/historyHelpers';

/**
 * List Plugin - Native Implementation
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 * 
 * Provides bullet and ordered list functionality with:
 * - Bullet lists (unordered lists with • markers)
 * - Numbered lists (ordered lists with 1, 2, 3... markers)
 * - Toggle on/off behavior
 * - Keyboard shortcuts (Cmd-Shift-8, Cmd-Shift-7)
 * - Global command registration
 */

/**
 * Toggle bullet (unordered) list
 */
export const toggleBulletList = (): boolean => {
  return applyListCommand('insertUnorderedList');
};

/**
 * Toggle numbered (ordered) list
 */
export const toggleOrderedList = (): boolean => {
  return applyListCommand('insertOrderedList');
};

function getActiveContentElement(): HTMLElement | null {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;
    const content = element?.closest('[contenteditable="true"], .rte-content, .editora-content') as HTMLElement | null;
    if (content) return content;
  }

  const active = document.activeElement as HTMLElement | null;
  if (!active) return null;
  if (active.getAttribute('contenteditable') === 'true') return active;
  return active.closest('[contenteditable="true"], .rte-content, .editora-content') as HTMLElement | null;
}

function normalizeListMarkup(root: HTMLElement): void {
  const listNodes = root.querySelectorAll('ul:not([data-type="checklist"]), ol');

  listNodes.forEach((list) => {
    const directChildren = Array.from(list.childNodes);
    directChildren.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = (child.textContent || '').trim();
        if (!text) {
          list.removeChild(child);
          return;
        }

        const li = document.createElement('li');
        li.textContent = text;
        list.replaceChild(li, child);
        return;
      }

      if (!(child instanceof HTMLElement)) {
        list.removeChild(child);
        return;
      }

      if (child.tagName === 'LI') {
        return;
      }

      const li = document.createElement('li');
      while (child.firstChild) {
        li.appendChild(child.firstChild);
      }
      list.replaceChild(li, child);
    });
  });
}

const BLOCK_TAGS = new Set([
  'P', 'DIV', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'TABLE', 'PRE', 'FIGURE', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER',
]);

// The browser's native insertUnorderedList/insertOrderedList toggles off by
// unwrapping the <li> back into bare inline content (a <span>, text, <br>)
// sitting directly under the editable root instead of a <p> - unlike every
// other block toggle in this codebase, which restores a clean paragraph.
// Left alone, that orphaned inline content breaks anything that assumes
// block-level children (styling, further block commands, screen readers).
function wrapOrphanedInlineContent(root: HTMLElement): void {
  let wrapper: HTMLParagraphElement | null = null;

  Array.from(root.childNodes).forEach((child) => {
    const isBlock = child.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.has((child as HTMLElement).tagName);
    if (isBlock) {
      wrapper = null;
      return;
    }

    if (child.nodeType === Node.TEXT_NODE && !(child.textContent || '').trim()) {
      return;
    }

    if (!wrapper) {
      wrapper = document.createElement('p');
      root.insertBefore(wrapper, child);
    }
    wrapper.appendChild(child);
  });
}

function applyListCommand(command: 'insertUnorderedList' | 'insertOrderedList'): boolean {
  const content = getActiveContentElement();
  if (!content) return false;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  if (!content.contains(range.commonAncestorContainer)) return false;

  const beforeHTML = content.innerHTML;
  content.focus({ preventScroll: true });
  const executed = document.execCommand(command, false);

  normalizeListMarkup(content);
  wrapOrphanedInlineContent(content);
  // execCommand edits aren't visible to the history plugin, so Undo would skip them.
  recordDomHistory(content, beforeHTML);
  content.dispatchEvent(new Event('input', { bubbles: true }));
  return executed !== false;
}

/**
 * Register commands globally
 */
const registerCommand = (command: string, handler: () => void): void => {
  if (typeof window !== 'undefined') {
    (window as any).registerEditorCommand?.(command, handler);
  }
};

/**
 * Initialize global command registration
 */
const initializeCommands = (): void => {
  registerCommand('toggleBulletList', toggleBulletList);
  registerCommand('toggleOrderedList', toggleOrderedList);
};

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommands);
  } else {
    initializeCommands();
  }
}

export const ListPlugin = (): Plugin => ({
  name: 'list',

  nodes: {
    bulletList: {
      content: 'listItem+',
      group: 'block',
      parseDOM: [{ tag: 'ul' }],
      toDOM: () => ['ul', 0]
    },
    orderedList: {
      content: 'listItem+',
      group: 'block',
      parseDOM: [{ tag: 'ol' }],
      toDOM: () => ['ol', 0]
    },
    listItem: {
      content: 'paragraph',
      parseDOM: [{ tag: 'li' }],
      toDOM: () => ['li', 0]
    }
  },

  toolbar: [
    {
      label: 'Bullet List',
      command: 'toggleBulletList',
      type: 'button',
      icon: '<svg width="24" height="24" focusable="false"><path d="M11 5h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0 6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2ZM4.5 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Zm0 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Zm0 6c0 .4.1.8.4 1 .3.4.7.5 1.1.5.4 0 .8-.1 1-.4.4-.3.5-.7.5-1.1 0-.4-.1-.8-.4-1-.3-.4-.7-.5-1.1-.5-.4 0-.8.1-1 .4-.4.3-.5.7-.5 1.1Z" fill-rule="evenodd"></path></svg>',
      shortcut: 'Mod-Shift-8'
    },
    {
      label: 'Numbered List',
      command: 'toggleOrderedList',
      type: 'button',
      icon: '<svg width="24" height="24" focusable="false"><path d="M10 17h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 0 1 0-2Zm0-6h8c.6 0 1 .4 1 1s-.4 1-1 1h-8a1 1 0 1 1 0-2ZM6 4v3.5c0 .3-.2.5-.5.5a.5.5 0 0 1-.5-.5V5h-.5a.5.5 0 0 1 0-1H6Zm-1 8.8l.2.2h1.3c.3 0 .5.2.5.5s-.2.5-.5.5H4.9a1 1 0 0 1-.9-1V13c0-.4.3-.8.6-1l1.2-.4.2-.3a.2.2 0 0 0 0-.2l-.7.3a.5.5 0 0 1-.7-.3.5.5 0 0 1 .3-.6l.7-.4c.5-.2 1.1 0 1.4.4.3.5.3 1.1-.1 1.5l-1.2.7Zm0 3.7v.5c0 .3.2.5.5.5h1c.3 0 .5.2.5.5s-.2.5-.5.5h-1a1.5 1.5 0 0 1-1.5-1.5v-.5c0-.3.1-.6.3-.8l1.3-1.4c.3-.4.1-.9-.2-1-.1 0-.2 0-.3.2l-.4.5a.5.5 0 0 1-.7.1.5.5 0 0 1-.1-.7l.4-.5c.5-.5 1.2-.6 1.8-.4.6.3 1 .9 1 1.6 0 .4-.2.8-.5 1.1l-1.3 1.4-.3.4Z" fill-rule="evenodd"></path></svg>',
      shortcut: 'Mod-Shift-7'
    }
  ],

  commands: {
    toggleBulletList,
    toggleOrderedList
  },

  keymap: {
    'Mod-Shift-8': 'toggleBulletList',
    'Mod-Shift-7': 'toggleOrderedList'
  }
});
