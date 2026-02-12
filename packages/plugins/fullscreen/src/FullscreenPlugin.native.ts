import { Plugin } from '@editora/core';

/**
 * Fullscreen Plugin - Native Implementation
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 * 
 * Provides fullscreen editing mode with:
 * - CSS-based fullscreen (no Fullscreen API dependency)
 * - Escape key to exit
 * - Button state tracking
 * - Smooth transitions
 * - Body scroll lock
 * - Multi-instance support
 */

// Track fullscreen state per editor instance
const fullscreenStates = new WeakMap<HTMLElement, {
  isFullscreen: boolean;
  fullscreenButton: HTMLButtonElement | null;
}>();

// CSS classes and styles
const FULLSCREEN_CLASS = 'rte-fullscreen-active';

/**
 * Get or create fullscreen state for an editor element
 */
const getFullscreenState = (editorElement: HTMLElement) => {
  if (!fullscreenStates.has(editorElement)) {
    fullscreenStates.set(editorElement, {
      isFullscreen: false,
      fullscreenButton: null
    });
  }
  return fullscreenStates.get(editorElement)!;
};

/**
 * Apply fullscreen styles to editor
 */
const applyFullscreenStyles = (editorElement: HTMLElement, state: { fullscreenButton: HTMLButtonElement | null }) => {
  // Add fullscreen class
  editorElement.classList.add(FULLSCREEN_CLASS);

  // Apply inline styles for maximum compatibility
  editorElement.style.position = 'fixed';
  editorElement.style.top = '0';
  editorElement.style.left = '0';
  editorElement.style.right = '0';
  editorElement.style.bottom = '0';
  editorElement.style.width = '100%';
  editorElement.style.height = '100%';
  editorElement.style.maxWidth = '100%';
  editorElement.style.maxHeight = '100%';
  editorElement.style.borderRadius = '0';
  editorElement.style.zIndex = '9999';
  editorElement.style.margin = '0';
  editorElement.style.padding = '0';
  editorElement.style.boxShadow = 'none';
  editorElement.style.display = 'flex';
  editorElement.style.flexDirection = 'column';
  editorElement.style.background = 'white';

  // Lock body scroll
  document.body.style.overflow = 'hidden';
  document.body.classList.add('fullscreen-active');

  // Update button state
  if (state.fullscreenButton) {
    state.fullscreenButton.setAttribute('data-active', 'true');
    state.fullscreenButton.style.backgroundColor = 'var(--rte-color-primary, #007bff)';
    state.fullscreenButton.style.color = 'white';
    
    const svg = state.fullscreenButton.querySelector('svg');
    if (svg) {
      svg.style.fill = 'white';
      svg.style.stroke = 'white';
    }
  }
};

/**
 * Remove fullscreen styles from editor
 */
const removeFullscreenStyles = (editorElement: HTMLElement, state: { fullscreenButton: HTMLButtonElement | null }) => {
  // Remove fullscreen class
  editorElement.classList.remove(FULLSCREEN_CLASS);

  // Clear inline styles
  editorElement.style.position = '';
  editorElement.style.top = '';
  editorElement.style.left = '';
  editorElement.style.right = '';
  editorElement.style.bottom = '';
  editorElement.style.width = '';
  editorElement.style.height = '';
  editorElement.style.maxWidth = '';
  editorElement.style.maxHeight = '';
  editorElement.style.borderRadius = '';
  editorElement.style.zIndex = '';
  editorElement.style.margin = '';
  editorElement.style.padding = '';
  editorElement.style.boxShadow = '';
  editorElement.style.display = '';
  editorElement.style.flexDirection = '';
  editorElement.style.background = '';

  // Unlock body scroll
  document.body.style.overflow = '';
  document.body.classList.remove('fullscreen-active');

  // Update button state
  if (state.fullscreenButton) {
    state.fullscreenButton.setAttribute('data-active', 'false');
    state.fullscreenButton.style.backgroundColor = '';
    state.fullscreenButton.style.color = '';
    
    const svg = state.fullscreenButton.querySelector('svg');
    if (svg) {
      svg.style.fill = '';
      svg.style.stroke = '';
    }
  }
};

/**
 * Toggle fullscreen mode for a specific editor
 */
export const toggleFullscreen = (editorElement?: HTMLElement): boolean => {
  try {
    // If no editor element provided, find the currently focused one
    if (!editorElement) {
      const focusedElement = document.activeElement;
      if (focusedElement && focusedElement.closest('[data-editora-editor]')) {
        editorElement = focusedElement.closest('[data-editora-editor]') as HTMLElement;
      }
    }

    // Fallback to any editor if none found
    if (!editorElement) {
      editorElement = document.querySelector('[data-editora-editor]') as HTMLElement;
    }

    if (!editorElement) {
      console.warn('Editor element not found');
      return false;
    }

    const state = getFullscreenState(editorElement);

    // Find button within this editor's toolbar
    if (!state.fullscreenButton) {
      state.fullscreenButton = editorElement.querySelector('[data-command="toggleFullscreen"]') as HTMLButtonElement;
    }

    // Toggle state
    state.isFullscreen = !state.isFullscreen;

    if (state.isFullscreen) {
      applyFullscreenStyles(editorElement, state);
    } else {
      removeFullscreenStyles(editorElement, state);
    }

    return true;
  } catch (error) {
    console.error('Fullscreen toggle failed:', error);
    return false;
  }
};

/**
 * Exit fullscreen mode for a specific editor
 */
export const exitFullscreen = (editorElement?: HTMLElement): void => {
  if (!editorElement) {
    // Find any fullscreen editor
    document.querySelectorAll('[data-editora-editor]').forEach(el => {
      const element = el as HTMLElement;
      const state = getFullscreenState(element);
      if (state.isFullscreen) {
        state.isFullscreen = false;
        removeFullscreenStyles(element, state);
      }
    });
    return;
  }

  const state = getFullscreenState(editorElement);
  if (state.isFullscreen) {
    state.isFullscreen = false;
    removeFullscreenStyles(editorElement, state);
  }
};

/**
 * Check if a specific editor is in fullscreen mode
 */
export const isFullscreenActive = (editorElement: HTMLElement): boolean => {
  const state = getFullscreenState(editorElement);
  return state.isFullscreen;
};

/**
 * Setup fullscreen event listeners
 */
const setupFullscreenListeners = () => {
  // Handle Escape key to exit fullscreen
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      exitFullscreen();
    }
  };

  // Setup listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  // Cleanup function
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
    }
  };
};

// Initialize listeners on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFullscreenListeners);
  } else {
    setupFullscreenListeners();
  }
}

export const FullscreenPlugin = (): Plugin => ({
  name: 'fullscreen',
  
  toolbar: [
    {
      label: 'Fullscreen',
      command: 'toggleFullscreen',
      type: 'button',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>'
    }
  ],
  
  commands: {
    toggleFullscreen
  },
  
  keymap: {
    'Escape': () => {
      // Check if any editor is in fullscreen mode
      const fullscreenEditors = document.querySelectorAll('[data-editora-editor]');
      for (const el of fullscreenEditors) {
        if (isFullscreenActive(el as HTMLElement)) {
          exitFullscreen(el as HTMLElement);
          return true;
        }
      }
      return false;
    }
  }
});
