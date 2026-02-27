import type { Plugin } from '@editora/core';

type CommandHandler = (...args: any[]) => any;

interface DomHistoryEntry {
  undo: () => void;
  redo: () => void;
}

interface EditorHistoryState {
  undoStack: DomHistoryEntry[];
  redoStack: DomHistoryEntry[];
}

interface ElementSnapshot {
  attributes: Record<string, string>;
  innerHTML: string;
  value: string | null;
  checked: boolean | null;
}

const ROOT_EDITOR_SELECTOR = '.rte-content, .editora-content';
const MAX_DOM_HISTORY = 100;

const domHistoryByEditor = new Map<HTMLElement, EditorHistoryState>();
const commandHandlers: Record<string, CommandHandler> = {};

let commandSystemInitialized = false;
let lastTouchedEditor: HTMLElement | null = null;

function getElementForNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  if (node.nodeType === Node.ELEMENT_NODE) return node as HTMLElement;
  return node.parentElement;
}

function resolveEditorFromNode(node: Node | null): HTMLElement | null {
  const element = getElementForNode(node);
  if (!element) return null;

  const rootEditor = element.closest(ROOT_EDITOR_SELECTOR) as HTMLElement | null;
  if (rootEditor) return rootEditor;

  const nearestEditable = element.closest('[contenteditable="true"]') as HTMLElement | null;
  if (!nearestEditable) return null;

  let outermost = nearestEditable;
  let parent = outermost.parentElement;
  while (parent) {
    if (parent.getAttribute('contenteditable') === 'true') {
      outermost = parent;
    }
    parent = parent.parentElement;
  }

  return outermost;
}

function resolveActiveEditor(): HTMLElement | null {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const fromSelection = resolveEditorFromNode(selection.getRangeAt(0).startContainer);
    if (fromSelection) return fromSelection;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    const fromActive = resolveEditorFromNode(active);
    if (fromActive) return fromActive;
  }

  if (lastTouchedEditor?.isConnected) return lastTouchedEditor;

  const firstConnectedEditor = Array.from(domHistoryByEditor.keys()).find((editor) => editor.isConnected);
  if (firstConnectedEditor) return firstConnectedEditor;

  const rootEditor = document.querySelector(ROOT_EDITOR_SELECTOR) as HTMLElement | null;
  if (rootEditor) return rootEditor;

  return document.querySelector('[contenteditable="true"]') as HTMLElement | null;
}

function cleanupDisconnectedEditors(): void {
  for (const editor of domHistoryByEditor.keys()) {
    if (!editor.isConnected) {
      domHistoryByEditor.delete(editor);
      if (lastTouchedEditor === editor) {
        lastTouchedEditor = null;
      }
    }
  }
}

function getEditorHistoryState(editor: HTMLElement): EditorHistoryState {
  cleanupDisconnectedEditors();

  let state = domHistoryByEditor.get(editor);
  if (!state) {
    state = { undoStack: [], redoStack: [] };
    domHistoryByEditor.set(editor, state);
  }
  return state;
}

function dispatchEditorInput(editor: HTMLElement | null): void {
  if (!editor) return;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function getEditorContentSnapshot(editor: HTMLElement | null): string {
  if (!editor) return '';
  return editor.innerHTML;
}

function pushDomHistoryEntry(editor: HTMLElement | null, entry: DomHistoryEntry): void {
  if (!editor) return;

  const state = getEditorHistoryState(editor);
  state.undoStack.push(entry);
  state.redoStack.length = 0;

  if (state.undoStack.length > MAX_DOM_HISTORY) {
    state.undoStack.splice(0, state.undoStack.length - MAX_DOM_HISTORY);
  }

  lastTouchedEditor = editor;
}

function getHistoryTargetEditor(preferredEditor?: HTMLElement | null, action: 'undo' | 'redo' = 'undo'): HTMLElement | null {
  cleanupDisconnectedEditors();

  if (preferredEditor?.isConnected) {
    return preferredEditor;
  }

  const active = resolveActiveEditor();
  if (active?.isConnected) {
    return active;
  }

  if (lastTouchedEditor?.isConnected) {
    return lastTouchedEditor;
  }

  const hasActionEntries = (state: EditorHistoryState): boolean => (
    action === 'undo' ? state.undoStack.length > 0 : state.redoStack.length > 0
  );

  for (const [editor, state] of domHistoryByEditor.entries()) {
    if (editor.isConnected && hasActionEntries(state)) {
      return editor;
    }
  }

  return null;
}

function snapshotElement(el: HTMLElement): ElementSnapshot {
  const attributes: Record<string, string> = {};
  for (const name of el.getAttributeNames()) {
    const value = el.getAttribute(name);
    if (value !== null) {
      attributes[name] = value;
    }
  }

  const supportsValue = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
  const supportsChecked = el instanceof HTMLInputElement;

  return {
    attributes,
    innerHTML: el.innerHTML,
    value: supportsValue ? el.value : null,
    checked: supportsChecked ? (el as HTMLInputElement).checked : null,
  };
}

function applyElementSnapshot(el: HTMLElement, snapshot: ElementSnapshot): void {
  const currentNames = new Set(el.getAttributeNames());
  Object.keys(snapshot.attributes).forEach((name) => currentNames.delete(name));
  currentNames.forEach((name) => el.removeAttribute(name));

  Object.entries(snapshot.attributes).forEach(([name, value]) => {
    el.setAttribute(name, value);
  });

  if (el.innerHTML !== snapshot.innerHTML) {
    el.innerHTML = snapshot.innerHTML;
  }

  if (
    snapshot.value !== null
    && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)
  ) {
    el.value = snapshot.value;
  }

  if (snapshot.checked !== null && el instanceof HTMLInputElement) {
    el.checked = snapshot.checked;
  }
}

function registerCommand(command: string, handler: CommandHandler): void {
  commandHandlers[command] = handler;

  if (typeof window === 'undefined') return;

  const registerGlobal = (window as any).registerEditorCommand as ((cmd: string, fn: CommandHandler) => void) | undefined;
  if (typeof registerGlobal === 'function') {
    registerGlobal(command, handler);
  } else {
    (window as any).registerEditorCommand = (cmd: string, fn: CommandHandler) => {
      commandHandlers[cmd] = fn;
    };
    (window as any).registerEditorCommand(command, handler);
  }
}

const execEditorCommand = (cmd: string, ...args: any[]): any => {
  const fn = commandHandlers[cmd];
  if (!fn) return false;
  return fn(...args);
};

function initializeCommandSystem(): void {
  if (commandSystemInitialized || typeof window === 'undefined') return;
  commandSystemInitialized = true;

  if (!(window as any).execEditorCommand) {
    (window as any).execEditorCommand = execEditorCommand;
  }

  if (!(window as any).executeEditorCommand) {
    (window as any).executeEditorCommand = execEditorCommand;
  }

  registerCommand('undo', undo);
  registerCommand('redo', redo);
  registerCommand('setAttribute', setAttribute);
  registerCommand('setText', setText);
  registerCommand('autoFixA11y', autoFixA11y);
  registerCommand('recordDomTransaction', recordDomTransaction);
  registerCommand('undoDom', undoDom);
  registerCommand('redoDom', redoDom);
}

function executeNativeHistoryCommand(
  command: 'undo' | 'redo',
  editor?: HTMLElement | null,
): { executed: boolean; changed: boolean } {
  const resolvedEditor = editor || resolveActiveEditor();
  const beforeSnapshot = getEditorContentSnapshot(resolvedEditor);
  resolvedEditor?.focus({ preventScroll: true });

  let executed = false;
  try {
    executed = !!document.execCommand(command, false);
  } catch {
    executed = false;
  }

  const afterSnapshot = getEditorContentSnapshot(resolvedEditor);
  const changed = beforeSnapshot !== afterSnapshot;

  if (changed) {
    dispatchEditorInput(resolvedEditor);
  }

  return { executed, changed };
}

export const undo = (): boolean => {
  const editor = resolveActiveEditor();
  const native = executeNativeHistoryCommand('undo', editor);
  if (native.changed) return true;
  return undoDom(editor);
};

export const redo = (): boolean => {
  const editor = resolveActiveEditor();
  const native = executeNativeHistoryCommand('redo', editor);
  if (native.changed) return true;
  return redoDom(editor);
};

export const setAttribute = (el: HTMLElement, attr: string, value: string): void => {
  if (!(el instanceof HTMLElement)) return;

  const editor = resolveEditorFromNode(el);
  const hadAttribute = el.hasAttribute(attr);
  const previousValue = el.getAttribute(attr);

  el.setAttribute(attr, value);

  pushDomHistoryEntry(editor, {
    undo: () => {
      if (!el.isConnected) return;
      if (hadAttribute && previousValue !== null) {
        el.setAttribute(attr, previousValue);
      } else {
        el.removeAttribute(attr);
      }
    },
    redo: () => {
      if (!el.isConnected) return;
      el.setAttribute(attr, value);
    },
  });

  dispatchEditorInput(editor);
};

export const setText = (el: HTMLElement, value: string): void => {
  if (!(el instanceof HTMLElement)) return;

  const editor = resolveEditorFromNode(el);
  const previousText = el.textContent ?? '';

  el.textContent = value;

  pushDomHistoryEntry(editor, {
    undo: () => {
      if (!el.isConnected) return;
      el.textContent = previousText;
    },
    redo: () => {
      if (!el.isConnected) return;
      el.textContent = value;
    },
  });

  dispatchEditorInput(editor);
};

export const autoFixA11y = (issue: any): void => {
  const el = issue?.element;
  if (!(el instanceof HTMLElement)) return;

  const editor = resolveEditorFromNode(el);
  const rule = (window as any).a11yRuleRegistry?.find((candidate: any) => candidate.id === issue.rule);
  if (!rule || typeof rule.fix !== 'function') return;

  const before = snapshotElement(el);
  rule.fix(issue);
  const after = snapshotElement(el);

  pushDomHistoryEntry(editor, {
    undo: () => {
      if (!el.isConnected) return;
      applyElementSnapshot(el, before);
    },
    redo: () => {
      if (!el.isConnected) return;
      applyElementSnapshot(el, after);
    },
  });

  dispatchEditorInput(editor);
};

export const recordDomTransaction = (
  editor: HTMLElement,
  beforeHTML: string,
  afterHTML?: string,
): boolean => {
  if (!(editor instanceof HTMLElement)) return false;

  const finalAfter = typeof afterHTML === 'string' ? afterHTML : editor.innerHTML;
  if (beforeHTML === finalAfter) return false;

  pushDomHistoryEntry(editor, {
    undo: () => {
      if (!editor.isConnected) return;
      editor.innerHTML = beforeHTML;
    },
    redo: () => {
      if (!editor.isConnected) return;
      editor.innerHTML = finalAfter;
    },
  });

  return true;
};

export const undoDom = (targetEditor?: HTMLElement): boolean => {
  const editor = getHistoryTargetEditor(targetEditor, 'undo');
  if (!editor) return false;

  const state = getEditorHistoryState(editor);
  const entry = state.undoStack.pop();
  if (!entry) return false;

  entry.undo();
  state.redoStack.push(entry);
  lastTouchedEditor = editor;
  dispatchEditorInput(editor);
  return true;
};

export const redoDom = (targetEditor?: HTMLElement): boolean => {
  const editor = getHistoryTargetEditor(targetEditor, 'redo');
  if (!editor) return false;

  const state = getEditorHistoryState(editor);
  const entry = state.redoStack.pop();
  if (!entry) return false;

  entry.redo();
  state.undoStack.push(entry);
  lastTouchedEditor = editor;
  dispatchEditorInput(editor);
  return true;
};

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommandSystem, { once: true });
  } else {
    initializeCommandSystem();
  }
}

export const HistoryPlugin = (): Plugin => {
  initializeCommandSystem();

  return {
    name: 'history',
    toolbar: [
      {
        label: 'Undo',
        command: 'undo',
        type: 'button',
        icon: '<svg width="24" height="24" focusable="false"><path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 0 1-1-1.8c1.1-.6 1.8-2.7 1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 1.4L6.4 8Z" fill-rule="nonzero"></path></svg>',
        shortcut: 'Mod-z',
      },
      {
        label: 'Redo',
        command: 'redo',
        type: 'button',
        icon: '<svg width="24" height="24" focusable="false"><path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 1 1-1 1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 1 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3Z" fill-rule="nonzero"></path></svg>',
        shortcut: 'Mod-y',
      },
    ],
    commands: {
      undo,
      redo,
      setAttribute,
      setText,
      autoFixA11y,
      recordDomTransaction,
      undoDom,
      redoDom,
    },
    keymap: {
      'Mod-z': 'undo',
      'Mod-Z': 'undo',
      'Mod-y': 'redo',
      'Mod-Y': 'redo',
      'Mod-Shift-z': 'redo',
      'Mod-Shift-Z': 'redo',
    },
  };
};
