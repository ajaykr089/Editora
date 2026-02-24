import { Plugin } from '@editora/core';

/**
 * Strikethrough Plugin - Framework Agnostic
 * 
 * Adds strikethrough formatting support with native command implementation.
 * No React dependency required.
 */
export const StrikethroughPlugin = (): Plugin => ({
  name: 'strikethrough',
  
  // Schema definition for strikethrough mark
  marks: {
    strikethrough: {
      parseDOM: [
        { tag: 's' },
        { tag: 'strike' },
        { tag: 'del' },
        {
          style: 'text-decoration',
          getAttrs: (value: string | HTMLElement) => {
            const decoration = typeof value === 'string' 
              ? value 
              : (value as HTMLElement).style.textDecoration;
            return decoration === 'line-through' && null;
          }
        }
      ],
      toDOM: () => ['s', 0]
    }
  },
  
  // Toolbar button configuration
  toolbar: [
    {
      label: 'Strikethrough',
      command: 'toggleStrikethrough',
      icon: '<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path d="M15.6 8.5c-.5-.7-1-1.1-1.3-1.3-.6-.4-1.3-.6-2-.6-2.7 0-2.8 1.7-2.8 2.1 0 1.6 1.8 2 3.2 2.3 4.4.9 4.6 2.8 4.6 3.9 0 1.4-.7 4.1-5 4.1A6.2 6.2 0 0 1 7 16.4l1.5-1.1c.4.6 1.6 2 3.7 2 1.6 0 2.5-.4 3-1.2.4-.8.3-2-.8-2.6-.7-.4-1.6-.7-2.9-1-1-.2-3.9-.8-3.9-3.6C7.6 6 10.3 5 12.4 5c2.9 0 4.2 1.6 4.7 2.4l-1.5 1.1Z"></path><path d="M5 11h14a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" fill-rule="nonzero"></path></g></svg>',
      shortcut: 'Mod-Shift-x'
    }
  ],
  
  // Native command implementations
  commands: {
    /**
     * Toggle strikethrough formatting on current selection
     */
    toggleStrikethrough: () => {
      const content = getActiveContentElement();
      if (!content) return false;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;

      const range = selection.getRangeAt(0);
      if (!content.contains(range.commonAncestorContainer)) return false;

      content.focus({ preventScroll: true });
      const executed = document.execCommand('strikeThrough', false);

      // Normalize browser-specific markup (<strike>, <del>) to <s>
      normalizeStrikethroughMarkup(content);

      // Notify React/web component bindings about content change.
      content.dispatchEvent(new Event('input', { bubbles: true }));
      return executed !== false;
    }
  },
  
  // Keyboard shortcuts
  keymap: {
    'Mod-Shift-x': 'toggleStrikethrough',
    'Mod-Shift-X': 'toggleStrikethrough'
  }
});

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

function normalizeStrikethroughMarkup(root: HTMLElement): void {
  const legacyNodes = root.querySelectorAll('strike, del');
  legacyNodes.forEach((legacy) => {
    const replacement = document.createElement('s');

    // Preserve classes/ids/data attributes for downstream plugins/styles.
    for (const attr of Array.from(legacy.attributes)) {
      if (attr.name === 'style') continue;
      replacement.setAttribute(attr.name, attr.value);
    }

    while (legacy.firstChild) {
      replacement.appendChild(legacy.firstChild);
    }

    legacy.parentNode?.replaceChild(replacement, legacy);
  });
}
