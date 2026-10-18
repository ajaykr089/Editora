import type { Plugin } from '@editora/core';

type CommandHandler = (...args: any[]) => any;

type TypingGroup = 'insert' | 'delete';

interface DomHistoryEntry {
  undo: () => void;
  redo: () => void;
  /** Set on whole-content transactions so an identical duplicate can be ignored. */
  beforeHTML?: string;
  afterHTML?: string;
  /** Set while the entry is a run of typed or deleted characters that later keystrokes may extend. */
  group?: TypingGroup;
  startedAt?: number;
  updatedAt?: number;
  /** A closed entry is never extended: a word boundary, a click, a caret key, undo or redo ended it. */
  closed?: boolean;
}

/** Details the host passes with a transaction so keystrokes can be grouped into one undo step. */
export interface DomTransactionOptions {
  /** `InputEvent.inputType` of the change. */
  inputType?: string | null;
  /** `InputEvent.data` of the change (the typed text). */
  data?: string | null;
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
const MAX_DOM_HISTORY = 200;
/** Typing, or deleting, stays one undo step until the user pauses this long. */
const TYPING_GROUP_PAUSE_MS = 1000;
/** ...or until the step has been growing this long, so a minute of typing is not one undo. */
const TYPING_GROUP_MAX_MS = 8000;
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';

const domHistoryByEditor = new Map<HTMLElement, EditorHistoryState>();
const commandHandlers: Record<string, CommandHandler> = {};

let commandSystemInitialized = false;
let lastTouchedEditor: HTMLElement | null = null;

function getEditorContentFromHost(host: Element | null): HTMLElement | null {
  if (!host) return null;
  const content = host.querySelector('[contenteditable="true"]');
  return content instanceof HTMLElement ? content : null;
}

function consumeCommandEditorContextEditor(): HTMLElement | null {
  if (typeof window === 'undefined') return null;

  const explicitContext = (window as any)[COMMAND_EDITOR_CONTEXT_KEY] as HTMLElement | null | undefined;
  if (!(explicitContext instanceof HTMLElement)) return null;

  (window as any)[COMMAND_EDITOR_CONTEXT_KEY] = null;

  const root =
    (explicitContext.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor') as HTMLElement | null) ||
    (explicitContext.matches('[data-editora-editor], .rte-editor, .editora-editor, editora-editor')
      ? explicitContext
      : null);

  if (root) {
    const content = getEditorContentFromHost(root);
    if (content) return content;
    if (root.getAttribute('contenteditable') === 'true') return root;
  }

  if (explicitContext.getAttribute('contenteditable') === 'true') {
    return explicitContext;
  }

  const nearestEditable = explicitContext.closest('[contenteditable="true"]');
  return nearestEditable instanceof HTMLElement ? nearestEditable : null;
}

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
  const explicitContextEditor = consumeCommandEditorContextEditor();
  if (explicitContextEditor && document.contains(explicitContextEditor)) {
    return explicitContextEditor;
  }

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

function typingGroupOf(inputType: string | null | undefined): TypingGroup | null {
  if (inputType === 'insertText' || inputType === 'insertCompositionText') return 'insert';
  if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward') return 'delete';
  return null;
}

/** Ends the run of keystrokes the editor's newest history step is collecting. */
function closeTypingGroup(editor: HTMLElement | null): void {
  if (!editor) return;
  const stack = domHistoryByEditor.get(editor)?.undoStack;
  const top = stack && stack[stack.length - 1];
  if (top) top.closed = true;
}

/** The text of some HTML, with a no-break space counted as a space: browsers swap one for the other as you type. */
function textOf(html: string): string {
  const holder = document.createElement('div');
  holder.innerHTML = html;
  return (holder.textContent ?? '').replace(/\u00a0/g, ' ');
}

/**
 * Where the two versions of the content differ, as text offsets: the changed text of `beforeHTML` is
 * `[start, beforeEnd)` and the changed text of `afterHTML` is `[start, afterEnd)`.
 */
function changedRegion(beforeHTML: string, afterHTML: string): { start: number; beforeEnd: number; afterEnd: number } {
  const before = textOf(beforeHTML);
  const after = textOf(afterHTML);
  const limit = Math.min(before.length, after.length);
  let start = 0;
  while (start < limit && before.charCodeAt(start) === after.charCodeAt(start)) start++;
  let suffix = 0;
  while (
    suffix < limit - start &&
    before.charCodeAt(before.length - 1 - suffix) === after.charCodeAt(after.length - 1 - suffix)
  ) {
    suffix++;
  }
  return { start, beforeEnd: before.length - suffix, afterEnd: after.length - suffix };
}

/** Puts the caret at a text offset of the editor's content (setting innerHTML had left it at the start). */
function placeCaretAtTextOffset(editor: HTMLElement, offset: number): void {
  const selection = window.getSelection();
  if (!selection) return;

  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);
  let remaining = Math.max(0, offset);
  let node: Node | null = null;
  let last: Text | null = null;
  while ((node = walker.nextNode())) {
    const text = node as Text;
    last = text;
    if (remaining <= text.data.length) {
      const range = document.createRange();
      range.setStart(text, remaining);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    remaining -= text.data.length;
  }

  const range = document.createRange();
  if (last) {
    range.setStart(last, last.data.length);
  } else {
    range.selectNodeContents(editor);
  }
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function restoreCaretAfterHistory(editor: HTMLElement, beforeHTML: string, afterHTML: string, direction: 'undo' | 'redo'): void {
  const active = document.activeElement;
  const root = editor.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor') as HTMLElement | null;
  // Keep the caret in the editor when undo came from its own toolbar, but never take focus from another field.
  const editorOwnsFocus = !active || active === document.body || editor.contains(active) || !!root?.contains(active);
  if (!editorOwnsFocus) return;

  const region = changedRegion(beforeHTML, afterHTML);
  placeCaretAtTextOffset(editor, direction === 'undo' ? region.beforeEnd : region.afterEnd);
  if (!editor.contains(document.activeElement)) editor.focus({ preventScroll: true });
}

let historyBreakListenersInstalled = false;

/** A click or a caret key moves the insertion point, so what is typed next is a new undo step. */
function installTypingBreakListeners(): void {
  if (historyBreakListenersInstalled || typeof document === 'undefined') return;
  historyBreakListenersInstalled = true;

  document.addEventListener(
    'pointerdown',
    (event) => closeTypingGroup(resolveEditorFromNode(event.target as Node | null)),
    true,
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (!/^(Arrow(Left|Right|Up|Down)|Home|End|Page(Up|Down))$/.test(event.key)) return;
      closeTypingGroup(resolveEditorFromNode(event.target as Node | null));
    },
    true,
  );
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
  installTypingBreakListeners();

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

export const undo = (): boolean => {
  const editor = resolveActiveEditor();
  return undoDom(editor ?? undefined);
};

export const redo = (): boolean => {
  const editor = resolveActiveEditor();
  return redoDom(editor ?? undefined);
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
  options?: DomTransactionOptions,
): boolean => {
  if (!(editor instanceof HTMLElement)) return false;

  const finalAfter = typeof afterHTML === 'string' ? afterHTML : editor.innerHTML;
  if (beforeHTML === finalAfter) return false;

  // A plugin that records explicitly and the host's native-input recorder can
  // both log the same change (browsers that fire beforeinput for execCommand).
  // Ignore the repeat so one action never needs two Undo clicks.
  const state = getEditorHistoryState(editor);
  const topEntry = state.undoStack[state.undoStack.length - 1];
  if (topEntry && topEntry.beforeHTML === beforeHTML && topEntry.afterHTML === finalAfter) {
    return false;
  }

  const now = Date.now();
  const group = typingGroupOf(options?.inputType);
  // The data of a space or a line end is where a word ends: it joins the word before it, and the next key starts a new step.
  const endsWord = group === 'insert' && typeof options?.data === 'string' && /\s/.test(options.data);

  // Keystrokes that continue the previous run (same kind, nothing else changed in between, no long pause)
  // extend its step, so one Undo takes back a word, not a letter.
  if (
    group &&
    topEntry &&
    topEntry.group === group &&
    !topEntry.closed &&
    topEntry.afterHTML === beforeHTML &&
    now - (topEntry.updatedAt ?? 0) <= TYPING_GROUP_PAUSE_MS &&
    now - (topEntry.startedAt ?? 0) <= TYPING_GROUP_MAX_MS
  ) {
    topEntry.afterHTML = finalAfter;
    topEntry.updatedAt = now;
    if (endsWord) topEntry.closed = true;
    state.redoStack.length = 0;
    lastTouchedEditor = editor;
    return true;
  }

  const entry: DomHistoryEntry = {
    beforeHTML,
    afterHTML: finalAfter,
    group: group ?? undefined,
    startedAt: now,
    updatedAt: now,
    closed: endsWord,
    undo: () => {
      if (!editor.isConnected) return;
      editor.innerHTML = entry.beforeHTML as string;
      restoreCaretAfterHistory(editor, entry.beforeHTML as string, entry.afterHTML as string, 'undo');
    },
    redo: () => {
      if (!editor.isConnected) return;
      editor.innerHTML = entry.afterHTML as string;
      restoreCaretAfterHistory(editor, entry.beforeHTML as string, entry.afterHTML as string, 'redo');
    },
  };
  pushDomHistoryEntry(editor, entry);

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
  closeTypingGroup(editor);
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
  closeTypingGroup(editor);
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
