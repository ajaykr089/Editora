import { Plugin } from '@editora/core';
import { AnchorPluginProvider } from './AnchorPluginProvider';
import { toast } from '@editora/toast';

/**
 * Anchor Plugin for Rich Text Editor
 *
 * Creates named navigation targets with:
 * - ID uniqueness enforcement
 * - Automatic ID validation and sanitization
 * - URL-safe ID generation
 * - Duplicate collision detection
 * - Reference update on rename
 * - Safe deletion handling
 *
 * Rules:
 * - Anchors must have valid URL-safe IDs
 * - Cannot duplicate existing IDs
 * - Renaming must update references (planned)
 * - IDs must be unique per document
 *
 * Integrations:
 * - Print: IDs preserved but inert
 * - Footnote: Anchors allowed inside
 * - Page Break: Anchors can exist adjacent
 * - Code Sample: Anchors not allowed inside <code>
 *
 * Edge Cases:
 * - Pasted content with duplicate IDs
 * - Deleting anchor targets
 * - Exporting/importing HTML with external references
 */
export const AnchorPlugin = (): Plugin => {
  // Initialize mutation observer for DOM changes
  if (typeof window !== 'undefined') {
    initializeAnchorObserver();
  }

  return {
    name: 'anchor',
    toolbar: [
      {
        label: 'Anchor',
        command: 'insertAnchor',
        type: 'button',
        icon: '⚓'
      }
    ],
    context: {
      provider: AnchorPluginProvider
    }
  };
};

/**
 * Anchor registry
 * Tracks all anchors and their IDs for uniqueness validation
 */
const anchorRegistry = new Set<string>();

/**
 * Initialize mutation observer to track anchor deletions
 * When user deletes an anchor element from the DOM, remove it from registry
 */
function initializeAnchorObserver() {
  // Check if observer already exists to avoid multiple observers
  if ((window as any).__anchorObserverInitialized) {
    return;
  }
  (window as any).__anchorObserverInitialized = true;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Check for removed anchor nodes
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          
          // Check if removed node is an anchor
          if (element.classList?.contains('rte-anchor')) {
            const anchorId = element.id;
            if (anchorId) {
              anchorRegistry.delete(anchorId);
            }
          }
          
          // Also check if removed node contains anchors
          const anchors = element.querySelectorAll?.('.rte-anchor');
          anchors?.forEach((anchor: Element) => {
            const anchorId = (anchor as HTMLElement).id;
            if (anchorId) {
              anchorRegistry.delete(anchorId);
            }
          });
        }
      });
    });
  });

  // Start observing the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Insert Anchor Command
 *
 * Creates a new anchor at the current cursor position with:
 * - Unique ID generation
 * - ID sanitization
 * - Duplicate collision detection
 */
export const insertAnchorCommand = (customId: string = '') => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // Sync registry with DOM to catch any deletions
  syncAnchorRegistry();

  // Generate or validate ID
  const anchorId = customId 
    ? sanitizeAndValidateId(customId)
    : generateUniqueId();

  // Check for duplicates
  if (anchorRegistry.has(anchorId)) {
    toast.error(`Anchor ID already exists: ${anchorId}`);
    return;
  }

  // Create anchor element
  const anchor = document.createElement('span');
  anchor.id = anchorId;
  anchor.className = 'rte-anchor';
  anchor.setAttribute('data-type', 'anchor');
  anchor.setAttribute('data-anchor-id', anchorId);
  anchor.setAttribute('title', `Anchor: ${anchorId}`);

  // Insert at cursor
  range.insertNode(anchor);

  // Register anchor
  anchorRegistry.add(anchorId);

  // Move cursor after anchor
  range.setStart(anchor.nextSibling || anchor.parentNode, 0);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);

  console.log(`Anchor created: ${anchorId}`);
};

/**
 * Generate unique anchor ID
 * Format: anchor-{timestamp}-{random}
 */
function generateUniqueId(): string {
  let id: string;
  let counter = 0;

  do {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    id = `anchor-${timestamp}-${random}`;
    counter++;

    if (counter > 100) {
      toast.error('Could not generate unique anchor ID');
      return '';
    }
  } while (anchorRegistry.has(id));

  return id;
}

/**
 * Sanitize and validate anchor ID
 * Rules:
 * - Must start with a letter or underscore
 * - Can contain letters, numbers, hyphens, underscores
 * - Must be URL-safe
 * - Max 256 characters
 */
function sanitizeAndValidateId(id: string): string {
  // Remove/replace invalid characters
  let sanitized = id
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-_]/g, '-')
    .replace(/^[^a-z_]/, `a-${Math.random().toString(36).substr(2, 5)}`)
    .substring(0, 256);

  return sanitized;
}

/**
 * Rename anchor
 * Updates anchor ID and all references (planned feature)
 */
export const renameAnchorCommand = (oldId: string, newId: string) => {
  const sanitizedNewId = sanitizeAndValidateId(newId);

  // Check for duplicates
  if (sanitizedNewId !== oldId && anchorRegistry.has(sanitizedNewId)) {
    toast.error(`Anchor ID already exists: ${sanitizedNewId}`);
    return false;
  }

  const anchor = document.getElementById(oldId);
  if (!anchor) {
    toast.error(`Anchor not found: ${oldId}`);
    return false;
  }

  // Update anchor element
  anchor.id = sanitizedNewId;
  anchor.setAttribute('data-anchor-id', sanitizedNewId);
  anchor.setAttribute('title', `Anchor: ${sanitizedNewId}`);

  // Update registry
  anchorRegistry.delete(oldId);
  anchorRegistry.add(sanitizedNewId);

  // TODO: Update all references pointing to this anchor
  // This would require finding <a> elements with href="#oldId" and updating them

  toast.success(`Anchor renamed: ${oldId} -> ${sanitizedNewId}`);
  return true;
};

/**
 * Delete anchor
 * Safely removes an anchor element
 */
export const deleteAnchorCommand = (anchorId: string) => {
  const anchor = document.getElementById(anchorId);
  if (!anchor) return;

  anchor.remove();
  anchorRegistry.delete(anchorId);
  toast.info(`Anchor deleted: ${anchorId}`);
};

/**
 * Handle anchor deletion
 * When user deletes an anchor, remove it from registry
 */
export const handleAnchorDeletion = (element: HTMLElement) => {
  if (element.classList.contains('rte-anchor')) {
    const anchorId = element.id;
    if (anchorId) {
      anchorRegistry.delete(anchorId);
      return true;
    }
  }
  return false;
};

/**
 * Get all anchors
 * Returns array of all anchor IDs in the document
 */
export const getAllAnchors = (): string[] => {
  return Array.from(anchorRegistry);
};

/**
 * Check ID uniqueness
 * Verifies if an ID is available
 */
export const isAnchorIdUnique = (id: string): boolean => {
  // Sync registry with DOM state before checking
  syncAnchorRegistry();
  return !anchorRegistry.has(id);
};

/**
 * Sync anchor registry with DOM
 * Rebuilds registry based on actual anchors in document
 * This ensures registry stays consistent with DOM state
 */
function syncAnchorRegistry() {
  const anchors = document.querySelectorAll('.rte-anchor');
  const domAnchors = new Set<string>();

  anchors.forEach((anchor) => {
    const id = anchor.id;
    if (id) {
      domAnchors.add(id);
    }
  });

  // Update registry to match DOM
  anchorRegistry.clear();
  domAnchors.forEach((id) => anchorRegistry.add(id));
}

/**
 * Sanitize pasted anchors
 * When content with anchors is pasted, resolve ID collisions
 */
export const sanitizeAnchorsPaste = (pastedHTML: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(pastedHTML, 'text/html');

  const anchors = doc.querySelectorAll('.rte-anchor');
  const idMap = new Map<string, string>();

  anchors.forEach(anchor => {
    const oldId = anchor.id;
    if (oldId) {
      let newId = oldId;
      let counter = 0;

      // Generate new ID if collision detected
      while (anchorRegistry.has(newId) && counter < 100) {
        newId = `${oldId}-copy-${counter}`;
        counter++;
      }

      if (newId !== oldId) {
        idMap.set(oldId, newId);
        anchor.id = newId;
        anchor.setAttribute('data-anchor-id', newId);
      } else {
        anchorRegistry.add(newId);
      }
    }
  });

  return doc.body.innerHTML;
};

/**
 * Validate anchor integrity
 * Ensures anchors are properly formed and unique
 */
export const validateAnchors = (): boolean => {
  const anchors = document.querySelectorAll('.rte-anchor');
  const ids = new Set<string>();
  let isValid = true;

  anchors.forEach(anchor => {
    const id = anchor.id;

    if (!id) {
      toast.error('Anchor without ID found');
      isValid = false;
    } else if (ids.has(id)) {
      toast.error(`Duplicate anchor ID found: ${id}`);
      isValid = false;
    } else {
      ids.add(id);
    }
  });

  return isValid;
};
