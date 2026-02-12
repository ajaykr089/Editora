import { Plugin } from '@editora/core';

/**
 * History Plugin - Native Implementation
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 * 
 * Provides comprehensive undo/redo functionality:
 * - ContentEditable native undo/redo (Ctrl/Cmd+Z, Ctrl/Cmd+Y)
 * - DOM-level undo/redo stack for A11y auto-fixes
 * - Global command registration system
 * - Attribute and text change tracking
 */

// DOM undo/redo stacks for A11y and other DOM manipulations
const domUndoStack: Array<() => void> = [];
const domRedoStack: Array<() => void> = [];

// Command registry for global access
const commandHandlers: Record<string, (...args: any[]) => void> = {};

/**
 * Register a command globally
 */
const registerCommand = (command: string, handler: (...args: any[]) => void): void => {
  commandHandlers[command] = handler;
  
  // Expose to global window object for external access
  if (typeof window !== 'undefined') {
    if (!(window as any).registerEditorCommand) {
      (window as any).registerEditorCommand = (cmd: string, fn: (...args: any[]) => void) => {
        commandHandlers[cmd] = fn;
      };
    }
    (window as any).registerEditorCommand(command, handler);
  }
};

/**
 * Execute a registered command
 */
const execEditorCommand = (cmd: string, ...args: any[]): void => {
  if (commandHandlers[cmd]) {
    commandHandlers[cmd](...args);
  }
};

/**
 * Undo the last action (ContentEditable)
 */
export const undo = (): boolean => {
  document.execCommand('undo', false);
  return true;
};

/**
 * Redo the last undone action (ContentEditable)
 */
export const redo = (): boolean => {
  document.execCommand('redo', false);
  return true;
};

/**
 * Set an attribute on an element with undo support
 */
export const setAttribute = (el: HTMLElement, attr: string, value: string): void => {
  const prev = el.getAttribute(attr);
  el.setAttribute(attr, value);
  
  // Push undo action to stack
  domUndoStack.push(() => {
    if (prev == null) {
      el.removeAttribute(attr);
    } else {
      el.setAttribute(attr, prev);
    }
  });
  
  // Clear redo stack when new action is performed
  domRedoStack.length = 0;
};

/**
 * Set text content on an element with undo support
 */
export const setText = (el: HTMLElement, value: string): void => {
  const prev = el.textContent;
  el.textContent = value;
  
  // Push undo action to stack
  domUndoStack.push(() => {
    el.textContent = prev ?? '';
  });
  
  // Clear redo stack when new action is performed
  domRedoStack.length = 0;
};

/**
 * Auto-fix an A11y issue with undo support
 */
export const autoFixA11y = (issue: any): void => {
  const el = issue.element;
  if (!el) return;
  
  // Find the A11y rule
  const rule = (window as any).a11yRuleRegistry?.find((r: any) => r.id === issue.rule);
  
  let undoFn: (() => void) | null = null;
  
  if (rule && rule.fix) {
    // Capture current state of all attributes
    const prevAttrs: Record<string, string | null> = {};
    for (const attr of el.getAttributeNames()) {
      prevAttrs[attr] = el.getAttribute(attr);
    }
    
    // Apply the fix
    rule.fix(issue);
    
    // Create undo function
    undoFn = () => {
      for (const attr of Object.keys(prevAttrs)) {
        if (prevAttrs[attr] == null) {
          el.removeAttribute(attr);
        } else {
          el.setAttribute(attr, prevAttrs[attr]!);
        }
      }
    };
  }
  
  if (undoFn) {
    domUndoStack.push(undoFn);
  }
  
  // Clear redo stack when new action is performed
  domRedoStack.length = 0;
};

/**
 * Undo the last DOM change
 */
export const undoDom = (): void => {
  const fn = domUndoStack.pop();
  if (fn) {
    fn();
    domRedoStack.push(fn);
  }
};

/**
 * Redo the last undone DOM change
 */
export const redoDom = (): void => {
  const fn = domRedoStack.pop();
  if (fn) {
    fn();
    domUndoStack.push(fn);
  }
};

/**
 * Initialize global command system
 */
const initializeCommandSystem = (): void => {
  if (typeof window === 'undefined') return;
  
  // Set up global command executor if not already present
  if (!(window as any).execEditorCommand) {
    (window as any).execEditorCommand = execEditorCommand;
  }
  
  // Register all commands
  registerCommand('undo', undo);
  registerCommand('redo', redo);
  registerCommand('setAttribute', setAttribute);
  registerCommand('setText', setText);
  registerCommand('autoFixA11y', autoFixA11y);
  registerCommand('undoDom', undoDom);
  registerCommand('redoDom', redoDom);
};

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommandSystem);
  } else {
    initializeCommandSystem();
  }
}

export const HistoryPlugin = (): Plugin => ({
  name: 'history',
  
  toolbar: [
    {
      label: 'Undo',
      command: 'undo',
      type: 'button',
      icon: '<svg width="24" height="24" focusable="false"><path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 0 1-1-1.8c1.1-.6 1.8-2.7 1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 1.4L6.4 8Z" fill-rule="nonzero"></path></svg>',
      shortcut: 'Mod-z'
    },
    {
      label: 'Redo',
      command: 'redo',
      type: 'button',
      icon: '<svg width="24" height="24" focusable="false"><path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 1 1-1 1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 1 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3Z" fill-rule="nonzero"></path></svg>',
      shortcut: 'Mod-y'
    }
  ],
  
  commands: {
    undo,
    redo,
    setAttribute,
    setText,
    autoFixA11y,
    undoDom,
    redoDom
  },
  
  keymap: {
    'Mod-z': 'undo',
    'Mod-Z': 'undo',
    'Mod-y': 'redo',
    'Mod-Y': 'redo',
    'Mod-Shift-z': 'redo',
    'Mod-Shift-Z': 'redo'
  }
});
