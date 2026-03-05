import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const TRACK_INSERT_SELECTOR = '.rte-track-insert[data-track-change="insert"]';
const TRACK_DELETE_SELECTOR = '.rte-track-delete[data-track-change="delete"]';
const TRACK_CHANGE_SELECTOR = `${TRACK_INSERT_SELECTOR}, ${TRACK_DELETE_SELECTOR}`;
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';

export interface TrackChangesPluginOptions {
  author?: string;
  enabledByDefault?: boolean;
  includeTimestamp?: boolean;
}

interface EditorTrackState {
  enabled: boolean;
  author: string;
  includeTimestamp: boolean;
}

interface EditorTrackHandlers {
  beforeInput: (event: InputEvent) => void;
  keydown: (event: KeyboardEvent) => void;
  paste: (event: ClipboardEvent) => void;
  cut: (event: ClipboardEvent) => void;
}

const editorStates = new WeakMap<HTMLElement, EditorTrackState>();
const editorHandlers = new WeakMap<HTMLElement, EditorTrackHandlers>();
const lastSelectionRanges = new WeakMap<HTMLElement, Range>();
const trackedEditors = new Set<HTMLElement>();
let stylesInjected = false;
let lastActiveEditor: HTMLElement | null = null;
let autoEnableHandlersBound = false;
let defaultPluginOptions: TrackChangesPluginOptions = {};
let selectionTrackingBound = false;

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

function resolveEditorFromContext(context?: { editorElement?: unknown; contentElement?: unknown }): HTMLElement | null {
  if (context?.contentElement instanceof HTMLElement) return context.contentElement;

  if (context?.editorElement instanceof HTMLElement) {
    const host = context.editorElement;
    if (host.getAttribute('contenteditable') === 'true') return host;
    const content = host.querySelector('[contenteditable="true"]');
    if (content instanceof HTMLElement) return content;
  }

  const explicit = consumeCommandEditorContextEditor();
  if (explicit && document.contains(explicit)) return explicit;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    const content = element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    if (active.matches(EDITOR_CONTENT_SELECTOR)) return active;
    const content = active.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  if (lastActiveEditor?.isConnected) return lastActiveEditor;

  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function ensureState(editor: HTMLElement, options: TrackChangesPluginOptions): EditorTrackState {
  normalizeInsertMarkers(editor);
  normalizeDeleteMarkers(editor);
  let state = editorStates.get(editor);
  if (!state) {
    state = {
      enabled: Boolean(options.enabledByDefault),
      author: options.author?.trim() || 'system',
      includeTimestamp: options.includeTimestamp !== false,
    };
    editorStates.set(editor, state);

    if (state.enabled) {
      attachEditorTracking(editor, state);
      updateEditorTrackingClass(editor, state.enabled);
    }
  }

  setCommandButtonActiveState(editor, 'toggleTrackChanges', state.enabled);

  return state;
}

function updateEditorTrackingClass(editor: HTMLElement, enabled: boolean): void {
  editor.classList.toggle('rte-track-changes-enabled', enabled);
  if (enabled) {
    editor.setAttribute('data-track-changes', 'true');
  } else {
    editor.removeAttribute('data-track-changes');
  }
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const root = editor.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor');
  return (root as HTMLElement) || editor;
}

function setCommandButtonActiveState(editor: HTMLElement, command: string, active: boolean): void {
  const root = resolveEditorRoot(editor);
  const buttons = Array.from(
    root.querySelectorAll(
      `.rte-toolbar-button[data-command="${command}"], .editora-toolbar-button[data-command="${command}"]`,
    ),
  ) as HTMLElement[];

  buttons.forEach((button) => {
    button.classList.toggle('active', active);
    button.setAttribute('data-active', active ? 'true' : 'false');
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.setAttribute('title', active ? 'Track Changes (On)' : 'Track Changes (Off)');
  });
}

function dispatchEditorInput(editor: HTMLElement): void {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function recordDomHistoryTransaction(editor: HTMLElement, beforeHTML: string): void {
  if (beforeHTML === editor.innerHTML) return;
  const executor = (window as any).execEditorCommand || (window as any).executeEditorCommand;
  if (typeof executor !== 'function') return;

  try {
    executor('recordDomTransaction', editor, beforeHTML, editor.innerHTML);
  } catch {
    // History plugin might not be loaded.
  }
}

function finalizeTrackedMutation(editor: HTMLElement, beforeHTML: string): void {
  dispatchEditorInput(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
}

function rangesEqual(a: Range, b: Range): boolean {
  return (
    a.startContainer === b.startContainer &&
    a.startOffset === b.startOffset &&
    a.endContainer === b.endContainer &&
    a.endOffset === b.endOffset
  );
}

function createChangeMeta(state: EditorTrackState): { author: string; timestamp: string } {
  return {
    author: state.author,
    timestamp: state.includeTimestamp ? new Date().toISOString() : '',
  };
}

function createInsertMarker(text: string, state: EditorTrackState): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'rte-track-insert';
  span.setAttribute('data-track-change', 'insert');
  span.setAttribute('contenteditable', 'false');

  const meta = createChangeMeta(state);
  span.setAttribute('data-track-author', meta.author);
  if (meta.timestamp) {
    span.setAttribute('data-track-time', meta.timestamp);
  }

  span.appendChild(document.createTextNode(text));
  return span;
}

function normalizeInsertMarkers(editor: HTMLElement): void {
  const markers = Array.from(editor.querySelectorAll(TRACK_INSERT_SELECTOR)) as HTMLElement[];
  markers.forEach((marker) => {
    marker.setAttribute('contenteditable', 'false');
  });
}

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function findAdjacentInsertMarker(range: Range, editor: HTMLElement): HTMLElement | null {
  const container = range.startContainer;
  const offset = range.startOffset;

  if (container.nodeType === Node.TEXT_NODE) {
    const textNode = container as Text;
    const direct = (textNode.previousSibling || textNode.nextSibling) as HTMLElement | null;
    if (direct instanceof HTMLElement && direct.matches(TRACK_INSERT_SELECTOR) && editor.contains(direct)) {
      return direct;
    }
  }

  if (container.nodeType === Node.ELEMENT_NODE) {
    const element = container as Element;
    const prev = element.childNodes[offset - 1] as HTMLElement | undefined;
    if (prev instanceof HTMLElement && prev.matches(TRACK_INSERT_SELECTOR) && editor.contains(prev)) {
      return prev;
    }
    const next = element.childNodes[offset] as HTMLElement | undefined;
    if (next instanceof HTMLElement && next.matches(TRACK_INSERT_SELECTOR) && editor.contains(next)) {
      return next;
    }
  }

  return null;
}

function appendTextToInsertMarker(editor: HTMLElement, marker: HTMLElement, text: string): void {
  const lastChild = marker.lastChild;
  if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
    (lastChild as Text).data += text;
  } else {
    marker.appendChild(document.createTextNode(text));
  }

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(marker);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  editor.focus({ preventScroll: true });
}

function createDeleteMarker(fragment: DocumentFragment, state: EditorTrackState): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'rte-track-delete';
  span.setAttribute('data-track-change', 'delete');
  span.setAttribute('contenteditable', 'false');

  const meta = createChangeMeta(state);
  span.setAttribute('data-track-author', meta.author);
  if (meta.timestamp) {
    span.setAttribute('data-track-time', meta.timestamp);
  }

  span.appendChild(fragment);
  return span;
}

function getSelectionRangeInEditor(editor: HTMLElement): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return null;
  return range;
}

function bindSelectionTracking(): void {
  if (selectionTrackingBound || typeof document === 'undefined') return;
  selectionTrackingBound = true;

  document.addEventListener(
    'selectionchange',
    () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);

      const element = getElementFromNode(range.startContainer);
      const editor = (element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null) || null;
      if (!editor) return;

      lastSelectionRanges.set(editor, range.cloneRange());
      lastActiveEditor = editor;
    },
    true,
  );
}

function setCaretAfterNode(editor: HTMLElement, node: Node): void {
  if (!node.parentNode) {
    editor.focus({ preventScroll: true });
    return;
  }

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  editor.focus({ preventScroll: true });
}

function setCaretBeforeNode(editor: HTMLElement, node: Node): void {
  if (!node.parentNode) {
    editor.focus({ preventScroll: true });
    return;
  }

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.setStartBefore(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  editor.focus({ preventScroll: true });
}

function setCaretAtOffset(editor: HTMLElement, container: Node, offset: number): void {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.setStart(container, Math.max(0, offset));
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  editor.focus({ preventScroll: true });
}

function moveCaretOutsideActiveInsertMarker(editor: HTMLElement): void {
  let range = getSelectionRangeInEditor(editor);
  if (!range) {
    const saved = lastSelectionRanges.get(editor);
    if (saved && editor.contains(saved.commonAncestorContainer)) {
      range = saved.cloneRange();
    }
  }

  if (!range || !range.collapsed) return;

  const element = getElementFromNode(range.startContainer);
  if (!element) return;

  const marker = element.closest(TRACK_INSERT_SELECTOR) as HTMLElement | null;
  if (!marker || !editor.contains(marker) || !marker.parentNode) return;

  const selection = window.getSelection();
  if (!selection) return;

  const nextRange = document.createRange();
  nextRange.setStartAfter(marker);
  nextRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(nextRange);
  editor.focus({ preventScroll: true });
}

function executeParagraphInsertion(editor: HTMLElement, inputType: string): boolean {
  const beforeHTML = editor.innerHTML;
  normalizeInsertMarkers(editor);
  moveCaretOutsideActiveInsertMarker(editor);

  editor.focus({ preventScroll: true });
  const command = inputType === 'insertLineBreak' ? 'insertLineBreak' : 'insertParagraph';
  const executed = document.execCommand(command, false);
  normalizeInsertMarkers(editor);

  finalizeTrackedMutation(editor, beforeHTML);
  return executed !== false;
}

function createCollapsedRangeAtSelectionEnd(editor: HTMLElement): Range {
  const range = document.createRange();
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    const existing = selection.getRangeAt(0);
    if (editor.contains(existing.commonAncestorContainer)) {
      range.setStart(existing.endContainer, existing.endOffset);
      range.collapse(true);
      return range;
    }
  }

  range.selectNodeContents(editor);
  range.collapse(false);
  return range;
}

function hasRenderableContent(fragment: DocumentFragment): boolean {
  const text = fragment.textContent || '';
  if (text.length > 0) return true;

  return Array.from(fragment.childNodes).some((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    const element = node as HTMLElement;
    return ['BR', 'IMG', 'TABLE', 'VIDEO', 'AUDIO', 'SVG', 'MATH'].includes(element.tagName);
  });
}

function hasRenderableElementContent(element: HTMLElement): boolean {
  return Array.from(element.childNodes).some((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent || '').length > 0;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    const child = node as HTMLElement;
    return ['BR', 'IMG', 'TABLE', 'VIDEO', 'AUDIO', 'SVG', 'MATH'].includes(child.tagName);
  });
}

function getAdjacentInsertMarkerForCollapsedDelete(
  range: Range,
  direction: 'backward' | 'forward',
  editor: HTMLElement,
): HTMLElement | null {
  if (!range.collapsed) return null;

  const container = range.startContainer;
  const offset = range.startOffset;
  let node: Node | null = null;

  if (container.nodeType === Node.TEXT_NODE) {
    const textNode = container as Text;
    if (direction === 'backward' && offset === 0) {
      node = textNode.previousSibling;
    } else if (direction === 'forward' && offset === textNode.length) {
      node = textNode.nextSibling;
    }
  } else if (container.nodeType === Node.ELEMENT_NODE) {
    const element = container as Element;
    if (direction === 'backward' && offset > 0) {
      node = element.childNodes[offset - 1] || null;
    } else if (direction === 'forward' && offset < element.childNodes.length) {
      node = element.childNodes[offset] || null;
    }
  }

  if (!(node instanceof HTMLElement)) return null;
  if (!node.matches(TRACK_INSERT_SELECTOR)) return null;
  if (!editor.contains(node)) return null;
  return node;
}

function findEdgeTextNode(root: HTMLElement, fromEnd: boolean): Text | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    if (textNode.data.length > 0) {
      nodes.push(textNode);
    }
    current = walker.nextNode();
  }

  if (nodes.length === 0) return null;
  return fromEnd ? nodes[nodes.length - 1] : nodes[0];
}

function trimAdjacentInsertMarker(
  editor: HTMLElement,
  range: Range,
  direction: 'backward' | 'forward',
): boolean {
  const marker = getAdjacentInsertMarkerForCollapsedDelete(range, direction, editor);
  if (!marker) return false;

  return trimInsertMarkerByDirection(editor, marker, direction);
}

function trimInsertMarkerByDirection(editor: HTMLElement, marker: HTMLElement, direction: 'backward' | 'forward'): boolean {
  const parent = marker.parentNode;
  if (!parent) return false;

  const markerIndex = Array.prototype.indexOf.call(parent.childNodes, marker) as number;
  const targetTextNode = findEdgeTextNode(marker, direction === 'backward');
  if (!targetTextNode) return false;

  if (direction === 'backward') {
    targetTextNode.data = targetTextNode.data.slice(0, -1);
  } else {
    targetTextNode.data = targetTextNode.data.slice(1);
  }

  if (targetTextNode.data.length === 0) {
    targetTextNode.remove();
  }

  if (!hasRenderableElementContent(marker)) {
    marker.remove();
    setCaretAtOffset(editor, parent, markerIndex);
    return true;
  }

  if (direction === 'backward') {
    setCaretAfterNode(editor, marker);
  } else {
    setCaretBeforeNode(editor, marker);
  }

  return true;
}

function getSingleSelectedNode(range: Range): Node | null {
  if (range.startContainer !== range.endContainer) return null;
  if (range.startContainer.nodeType !== Node.ELEMENT_NODE) return null;

  const container = range.startContainer as Element;
  if (range.endOffset - range.startOffset !== 1) return null;
  return container.childNodes[range.startOffset] || null;
}

function getSelectedDeleteMarker(range: Range, editor: HTMLElement): HTMLElement | null {
  const node = getSingleSelectedNode(range);
  if (!(node instanceof HTMLElement)) return null;
  if (!node.matches(TRACK_DELETE_SELECTOR)) return null;
  if (!editor.contains(node)) return null;
  return node;
}

function getSelectedInsertMarker(range: Range, editor: HTMLElement): HTMLElement | null {
  const node = getSingleSelectedNode(range);
  if (!(node instanceof HTMLElement)) return null;
  if (!node.matches(TRACK_INSERT_SELECTOR)) return null;
  if (!editor.contains(node)) return null;
  return node;
}

function collapseRangeOutsideDeleteMarker(editor: HTMLElement, range: Range): Range {
  if (range.collapsed) {
    const element = getElementFromNode(range.startContainer);
    const deleteMarker = element?.closest(TRACK_DELETE_SELECTOR) as HTMLElement | null;
    if (deleteMarker && editor.contains(deleteMarker)) {
      const collapsed = document.createRange();
      collapsed.setStartAfter(deleteMarker);
      collapsed.collapse(true);
      return collapsed;
    }
    return range;
  }

  const selectedDeleteMarker = getSelectedDeleteMarker(range, editor);
  if (selectedDeleteMarker) {
    const collapsed = document.createRange();
    collapsed.setStartAfter(selectedDeleteMarker);
    collapsed.collapse(true);
    return collapsed;
  }

  const startDelete = getElementFromNode(range.startContainer)?.closest(TRACK_DELETE_SELECTOR) as HTMLElement | null;
  const endDelete = getElementFromNode(range.endContainer)?.closest(TRACK_DELETE_SELECTOR) as HTMLElement | null;
  if (startDelete && endDelete && startDelete === endDelete && editor.contains(startDelete)) {
    const collapsed = document.createRange();
    collapsed.setStartAfter(startDelete);
    collapsed.collapse(true);
    return collapsed;
  }

  return range;
}

function getRangeSingleInsertMarker(range: Range, editor: HTMLElement): HTMLElement | null {
  const markers = Array.from(editor.querySelectorAll(TRACK_INSERT_SELECTOR)) as HTMLElement[];
  const intersecting = markers.filter((marker) => {
    try {
      return range.intersectsNode(marker);
    } catch {
      return false;
    }
  });

  if (intersecting.length !== 1) return null;

  const marker = intersecting[0];
  const rangeText = (range.toString() || '').replace(/\s+/g, '');
  const markerText = (marker.textContent || '').replace(/\s+/g, '');
  if (!markerText || rangeText !== markerText) return null;

  return marker;
}

function trackDeleteRange(editor: HTMLElement, range: Range, state: EditorTrackState): HTMLSpanElement | null {
  if (range.collapsed) return null;

  const content = range.cloneContents();
  if (!hasRenderableContent(content)) return null;

  const marker = createDeleteMarker(content, state);
  range.deleteContents();
  range.insertNode(marker);
  setCaretAfterNode(editor, marker);
  return marker;
}

function expandCollapsedDeletionRange(editor: HTMLElement, range: Range, direction: 'backward' | 'forward'): Range | null {
  if (!range.collapsed) return range;

  const container = range.startContainer;
  const offset = range.startOffset;

  if (container.nodeType === Node.TEXT_NODE) {
    const textNode = container as Text;
    if (direction === 'backward' && offset > 0) {
      const expanded = range.cloneRange();
      expanded.setStart(textNode, offset - 1);
      return expanded;
    }

    if (direction === 'forward' && offset < textNode.length) {
      const expanded = range.cloneRange();
      expanded.setEnd(textNode, offset + 1);
      return expanded;
    }
  }

  if (container.nodeType === Node.ELEMENT_NODE) {
    const element = container as Element;
    if (direction === 'backward' && offset > 0) {
      for (let index = offset - 1; index >= 0; index -= 1) {
        const node = element.childNodes[index];
        if (!node) continue;
        if (node instanceof HTMLElement && node.matches(TRACK_DELETE_SELECTOR)) {
          continue;
        }
        const expanded = range.cloneRange();
        if (node.nodeType === Node.TEXT_NODE) {
          const textNode = node as Text;
          if (textNode.length === 0) continue;
          expanded.setStart(textNode, textNode.length - 1);
          expanded.setEnd(textNode, textNode.length);
        } else {
          expanded.setStartBefore(node);
          expanded.setEndAfter(node);
        }
        return expanded;
      }
    }

    if (direction === 'forward' && offset < element.childNodes.length) {
      for (let index = offset; index < element.childNodes.length; index += 1) {
        const node = element.childNodes[index];
        if (!node) continue;
        if (node instanceof HTMLElement && node.matches(TRACK_DELETE_SELECTOR)) {
          continue;
        }
        const expanded = range.cloneRange();
        if (node.nodeType === Node.TEXT_NODE) {
          const textNode = node as Text;
          if (textNode.length === 0) continue;
          expanded.setStart(textNode, 0);
          expanded.setEnd(textNode, 1);
        } else {
          expanded.setStartBefore(node);
          expanded.setEndAfter(node);
        }
        return expanded;
      }
    }
  }

  const selection = window.getSelection();
  if (!selection || typeof (selection as any).modify !== 'function') {
    return null;
  }

  const original = range.cloneRange();
  selection.removeAllRanges();
  selection.addRange(original);

  try {
    (selection as any).modify('extend', direction, 'character');
    if (selection.rangeCount === 0) {
      return null;
    }

    const expanded = selection.getRangeAt(0).cloneRange();
    if (expanded.collapsed || !editor.contains(expanded.commonAncestorContainer)) {
      return null;
    }

    const selectedDeleteMarker = getSelectedDeleteMarker(expanded, editor);
    if (selectedDeleteMarker) {
      if (direction === 'backward') {
        setCaretBeforeNode(editor, selectedDeleteMarker);
      } else {
        setCaretAfterNode(editor, selectedDeleteMarker);
      }
      return null;
    }

    return expanded;
  } catch {
    return null;
  } finally {
    selection.removeAllRanges();
    selection.addRange(original);
  }
}

function handleInsertText(editor: HTMLElement, state: EditorTrackState, text: string): boolean {
  let range = getSelectionRangeInEditor(editor);
  if (!range) return false;

  const normalized = collapseRangeOutsideDeleteMarker(editor, range.cloneRange());
  if (!rangesEqual(normalized, range)) {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(normalized);
    }
    range = normalized;
  }

  const beforeHTML = editor.innerHTML;

  if (!range.collapsed) {
    trackDeleteRange(editor, range.cloneRange(), state);
  }

  const startElement = getElementFromNode(range.startContainer);
  const withinInsert = startElement?.closest(TRACK_INSERT_SELECTOR) as HTMLElement | null;
  if (range.collapsed && withinInsert && editor.contains(withinInsert)) {
    appendTextToInsertMarker(editor, withinInsert, text);
    finalizeTrackedMutation(editor, beforeHTML);
    return true;
  }

  const adjacentInsert = range.collapsed ? findAdjacentInsertMarker(range, editor) : null;
  if (adjacentInsert) {
    appendTextToInsertMarker(editor, adjacentInsert, text);
    finalizeTrackedMutation(editor, beforeHTML);
    return true;
  }

  const insertionRange = createCollapsedRangeAtSelectionEnd(editor);
  const marker = createInsertMarker(text, state);
  insertionRange.insertNode(marker);
  setCaretAfterNode(editor, marker);

  finalizeTrackedMutation(editor, beforeHTML);
  return true;
}

function handleDeleteInput(editor: HTMLElement, state: EditorTrackState, inputType: string): boolean {
  const range = getSelectionRangeInEditor(editor);
  if (!range) return false;

  const direction = inputType.includes('Backward') ? 'backward' : 'forward';
  const beforeHTML = editor.innerHTML;

  if (range.collapsed && trimAdjacentInsertMarker(editor, range.cloneRange(), direction)) {
    finalizeTrackedMutation(editor, beforeHTML);
    return true;
  }

  const selectedInsertMarker = getSelectedInsertMarker(range, editor);
  if (selectedInsertMarker && trimInsertMarkerByDirection(editor, selectedInsertMarker, direction)) {
    finalizeTrackedMutation(editor, beforeHTML);
    return true;
  }

  if (!range.collapsed) {
    const rangeSingleInsert = getRangeSingleInsertMarker(range, editor);
    if (rangeSingleInsert && trimInsertMarkerByDirection(editor, rangeSingleInsert, direction)) {
      finalizeTrackedMutation(editor, beforeHTML);
      return true;
    }
  }

  const effectiveRange = range.collapsed
    ? expandCollapsedDeletionRange(editor, range.cloneRange(), direction)
    : range.cloneRange();

  if (!effectiveRange) return false;

  const selectedDeleteMarker = getSelectedDeleteMarker(effectiveRange, editor);
  if (selectedDeleteMarker) {
    if (direction === 'backward') {
      setCaretBeforeNode(editor, selectedDeleteMarker);
    } else {
      setCaretAfterNode(editor, selectedDeleteMarker);
    }
    return true;
  }

  const marker = trackDeleteRange(editor, effectiveRange, state);
  if (!marker) return false;
  normalizeDeleteMarkers(editor);

  finalizeTrackedMutation(editor, beforeHTML);
  return true;
}

function unwrapElement(element: HTMLElement): void {
  const parent = element.parentNode;
  if (!parent) return;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
}

function normalizeDeleteMarkers(editor: HTMLElement): void {
  const markers = Array.from(editor.querySelectorAll(TRACK_DELETE_SELECTOR)) as HTMLElement[];
  markers.forEach((marker) => {
    marker.setAttribute('contenteditable', 'false');
    const nestedMarkers = Array.from(marker.querySelectorAll(TRACK_DELETE_SELECTOR)) as HTMLElement[];
    nestedMarkers.forEach((nested) => {
      if (nested !== marker) {
        unwrapElement(nested);
      }
    });
  });

  let changed = true;
  while (changed) {
    changed = false;
    const current = Array.from(editor.querySelectorAll(TRACK_DELETE_SELECTOR)) as HTMLElement[];
    current.forEach((marker) => {
      if (!marker.isConnected) return;

      let next = marker.nextSibling;
      while (next && next.nodeType === Node.TEXT_NODE && !(next.textContent || '').trim()) {
        next = next.nextSibling;
      }

      if (next instanceof HTMLElement && next.matches(TRACK_DELETE_SELECTOR)) {
        while (next.firstChild) {
          marker.appendChild(next.firstChild);
        }
        next.remove();
        changed = true;
      }

      if (!marker.firstChild) {
        marker.remove();
        changed = true;
      }
    });
  }
}

function getAllTrackMarkers(editor: HTMLElement): HTMLElement[] {
  return Array.from(editor.querySelectorAll(TRACK_CHANGE_SELECTOR)) as HTMLElement[];
}

function getSelectionTrackMarkers(editor: HTMLElement): HTMLElement[] {
  const range = getSelectionRangeInEditor(editor);
  if (!range) return [];

  const markers = new Set<HTMLElement>();
  const startElement = range.startContainer.nodeType === Node.ELEMENT_NODE
    ? (range.startContainer as HTMLElement)
    : range.startContainer.parentElement;

  const endElement = range.endContainer.nodeType === Node.ELEMENT_NODE
    ? (range.endContainer as HTMLElement)
    : range.endContainer.parentElement;

  const startMarker = startElement?.closest(TRACK_CHANGE_SELECTOR) as HTMLElement | null;
  if (startMarker && editor.contains(startMarker)) {
    markers.add(startMarker);
  }

  const endMarker = endElement?.closest(TRACK_CHANGE_SELECTOR) as HTMLElement | null;
  if (endMarker && editor.contains(endMarker)) {
    markers.add(endMarker);
  }

  const inRangeMarkers = getAllTrackMarkers(editor).filter((marker) => {
    try {
      return range.intersectsNode(marker);
    } catch {
      return false;
    }
  });

  inRangeMarkers.forEach((marker) => markers.add(marker));
  return Array.from(markers);
}

function applyTrackChangeResolution(
  editor: HTMLElement,
  mode: 'accept' | 'reject',
  scope: 'all' | 'selection',
): boolean {
  const markers = scope === 'all' ? getAllTrackMarkers(editor) : getSelectionTrackMarkers(editor);
  if (markers.length === 0) return false;

  const beforeHTML = editor.innerHTML;

  markers.forEach((marker) => {
    if (!marker.isConnected) return;

    const isInsert = marker.matches(TRACK_INSERT_SELECTOR);
    const isDelete = marker.matches(TRACK_DELETE_SELECTOR);

    if (!isInsert && !isDelete) return;

    if (mode === 'accept') {
      if (isInsert) {
        unwrapElement(marker);
      } else {
        marker.remove();
      }
      return;
    }

    if (isInsert) {
      marker.remove();
    } else {
      marker.removeAttribute('contenteditable');
      unwrapElement(marker);
    }
  });

  normalizeDeleteMarkers(editor);
  finalizeTrackedMutation(editor, beforeHTML);
  return true;
}

function resolveEditorForEventTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Node)) return null;

  const element = target.nodeType === Node.ELEMENT_NODE
    ? (target as HTMLElement)
    : target.parentElement;

  return (element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null) || null;
}

function bindAutoEnableHandlers(): void {
  if (autoEnableHandlersBound || typeof document === 'undefined') return;

  autoEnableHandlersBound = true;

  document.addEventListener(
    'focusin',
    (event) => {
      if (!defaultPluginOptions.enabledByDefault) return;
      const editor = resolveEditorForEventTarget(event.target);
      if (!editor) return;

      lastActiveEditor = editor;
      const state = ensureState(editor, defaultPluginOptions);
      if (state.enabled) {
        attachEditorTracking(editor, state);
        updateEditorTrackingClass(editor, true);
        setCommandButtonActiveState(editor, 'toggleTrackChanges', true);
      } else {
        normalizeInsertMarkers(editor);
      }
    },
    true,
  );
}

function handleBeforeInputFactory(editor: HTMLElement, state: EditorTrackState) {
  return (event: InputEvent): void => {
    if (!state.enabled || editor.getAttribute('data-track-changes') !== 'true') return;

    lastActiveEditor = editor;

    const inputType = event.inputType || '';
    if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
      event.preventDefault();
      executeParagraphInsertion(editor, inputType);
      return;
    }

    if (inputType.startsWith('delete')) {
      event.preventDefault();
      handleDeleteInput(editor, state, inputType);
      return;
    }

    if (inputType === 'insertText' || inputType === 'insertCompositionText') {
      const text = event.data || '';
      if (!text) return;
      event.preventDefault();
      handleInsertText(editor, state, text);
    }
  };
}

function handleKeydownFactory(editor: HTMLElement, state: EditorTrackState) {
  return (event: KeyboardEvent): void => {
    if (!state.enabled || editor.getAttribute('data-track-changes') !== 'true') return;
    if (event.key !== 'Enter') return;

    event.preventDefault();
    event.stopPropagation();

    const inputType = event.shiftKey ? 'insertLineBreak' : 'insertParagraph';
    executeParagraphInsertion(editor, inputType);
  };
}

function handlePasteFactory(editor: HTMLElement, state: EditorTrackState) {
  return (event: ClipboardEvent): void => {
    if ((event as any).__editoraSmartPasteHandled === true || event.defaultPrevented) return;
    if (!state.enabled || editor.getAttribute('data-track-changes') !== 'true') return;
    const text = event.clipboardData?.getData('text/plain') || '';
    if (!text) return;

    event.preventDefault();
    lastActiveEditor = editor;
    handleInsertText(editor, state, text);
  };
}

function handleCutFactory(editor: HTMLElement, state: EditorTrackState) {
  return (event: ClipboardEvent): void => {
    if (!state.enabled || editor.getAttribute('data-track-changes') !== 'true') return;

    const range = getSelectionRangeInEditor(editor);
    if (!range || range.collapsed) return;

    const plainText = range.toString();
    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', plainText);
      event.preventDefault();
    }

    lastActiveEditor = editor;
    handleDeleteInput(editor, state, 'deleteByCut');
  };
}

function attachEditorTracking(editor: HTMLElement, state: EditorTrackState): void {
  if (editorHandlers.has(editor)) return;
  normalizeInsertMarkers(editor);

  const handlers: EditorTrackHandlers = {
    beforeInput: handleBeforeInputFactory(editor, state),
    keydown: handleKeydownFactory(editor, state),
    paste: handlePasteFactory(editor, state),
    cut: handleCutFactory(editor, state),
  };

  editor.addEventListener('beforeinput', handlers.beforeInput as EventListener);
  editor.addEventListener('keydown', handlers.keydown as EventListener);
  editor.addEventListener('paste', handlers.paste as EventListener);
  editor.addEventListener('cut', handlers.cut as EventListener);

  editorHandlers.set(editor, handlers);
  trackedEditors.add(editor);
}

function detachEditorTracking(editor: HTMLElement): void {
  const handlers = editorHandlers.get(editor);
  if (!handlers) return;

  editor.removeEventListener('beforeinput', handlers.beforeInput as EventListener);
  editor.removeEventListener('keydown', handlers.keydown as EventListener);
  editor.removeEventListener('paste', handlers.paste as EventListener);
  editor.removeEventListener('cut', handlers.cut as EventListener);

  editorHandlers.delete(editor);
  trackedEditors.delete(editor);
}

function ensureStylesInjected(): void {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.id = 'rte-track-changes-styles';
  style.textContent = `
    .rte-track-insert[data-track-change="insert"] {
      background: rgba(22, 163, 74, 0.2);
      color: inherit;
      text-decoration: underline;
      text-decoration-color: #16a34a;
      text-decoration-thickness: 2px;
      border-radius: 2px;
      padding: 0 1px;
      white-space: pre-wrap;
    }

    .rte-track-delete[data-track-change="delete"] {
      background: rgba(220, 38, 38, 0.16);
      color: inherit;
      text-decoration: line-through;
      text-decoration-color: #dc2626;
      text-decoration-thickness: 2px;
      border-radius: 2px;
      padding: 0 1px;
      white-space: pre-wrap;
      cursor: pointer;
    }

    .editora-theme-dark .rte-track-insert[data-track-change="insert"],
    .rte-theme-dark .rte-track-insert[data-track-change="insert"] {
      background: rgba(74, 222, 128, 0.2);
      text-decoration-color: #4ade80;
    }

    .editora-theme-dark .rte-track-delete[data-track-change="delete"],
    .rte-theme-dark .rte-track-delete[data-track-change="delete"] {
      background: rgba(248, 113, 113, 0.18);
      text-decoration-color: #f87171;
    }

    .rte-content[data-track-changes="true"],
    .editora-content[data-track-changes="true"] {
      caret-color: currentColor;
    }

    .rte-toolbar-group-items.track-changes,
    .editora-toolbar-group-items.track-changes {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    .rte-toolbar-group-items.track-changes .rte-toolbar-button,
    .editora-toolbar-group-items.track-changes .editora-toolbar-button {
      border: none;
      border-radius: 0px; 
    }
    .rte-toolbar-group-items.track-changes .rte-toolbar-button,
    .editora-toolbar-group-items.track-changes .editora-toolbar-button {
      border-right: 1px solid #ccc;
    }
    .rte-toolbar-group-items.track-changes .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.track-changes .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark) .rte-toolbar-group-items.track-changes,
    :is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark) .editora-toolbar-group-items.track-changes {
      border-color: #566275;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark) .rte-toolbar-group-items.track-changes .rte-toolbar-button,
    :is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark) .editora-toolbar-group-items.track-changes .editora-toolbar-button {
      border-right-color: #566275;
    }

    .rte-toolbar-button[data-command="toggleTrackChanges"].active,
    .editora-toolbar-button[data-command="toggleTrackChanges"].active {
      background-color: rgba(22, 163, 74, 0.1);
    }
  `;

  document.head.appendChild(style);
}

export const TrackChangesPlugin = (options: TrackChangesPluginOptions = {}): Plugin => {
  ensureStylesInjected();
  bindSelectionTracking();
  defaultPluginOptions = { ...defaultPluginOptions, ...options };
  bindAutoEnableHandlers();

  if (defaultPluginOptions.enabledByDefault && typeof document !== 'undefined') {
    const schedule = typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : (cb: FrameRequestCallback) => window.setTimeout(cb, 0);

    schedule(() => {
      const editors = Array.from(document.querySelectorAll(EDITOR_CONTENT_SELECTOR)) as HTMLElement[];
      editors.forEach((editor) => {
        const state = ensureState(editor, defaultPluginOptions);
        if (state.enabled) {
          attachEditorTracking(editor, state);
          updateEditorTrackingClass(editor, true);
          setCommandButtonActiveState(editor, 'toggleTrackChanges', true);
        } else {
          normalizeInsertMarkers(editor);
        }
      });
    });
  }

  const resolveEditor = (context?: { editorElement?: unknown; contentElement?: unknown }): HTMLElement | null => {
    const editor = resolveEditorFromContext(context);
    if (editor) {
      lastActiveEditor = editor;
      return editor;
    }
    return null;
  };

  const ensureEditorState = (context?: { editorElement?: unknown; contentElement?: unknown }): { editor: HTMLElement; state: EditorTrackState } | null => {
    const editor = resolveEditor(context);
    if (!editor) return null;

    const state = ensureState(editor, options);
    return { editor, state };
  };

  return {
    name: 'trackChanges',

    toolbar: [
      {
        label: 'Track Changes',
        command: 'toggleTrackChanges',
        type: 'group',
        items: [
          {
            label: 'Track Changes',
            command: 'toggleTrackChanges',
            icon: '<svg width="24" height="24" focusable="false"><path d="M4 6h10a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm0 5h7a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm0 5h8a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2Zm13.3-3.6 1.3 1.3 2.9-2.9a1 1 0 1 1 1.4 1.4l-3.6 3.6a1 1 0 0 1-1.4 0l-2-2a1 1 0 1 1 1.4-1.4Z"></path></svg>',
            shortcut: 'Mod-Shift-t',
          },
          {
            label: 'Accept All Changes',
            command: 'acceptAllTrackChanges',
            icon: '<svg width="24" height="24" focusable="false"><path d="M9.2 16.2 5.8 12.8a1 1 0 1 1 1.4-1.4l2.1 2.1 7.5-7.5a1 1 0 1 1 1.4 1.4l-8.2 8.2a1 1 0 0 1-1.4 0Z"></path></svg>',
          },
          {
            label: 'Reject All Changes',
            command: 'rejectAllTrackChanges',
            icon: '<svg width="24" height="24" focusable="false"><path d="M7.8 7.8a1 1 0 0 1 1.4 0L12 10.6l2.8-2.8a1 1 0 1 1 1.4 1.4L13.4 12l2.8 2.8a1 1 0 1 1-1.4 1.4L12 13.4l-2.8 2.8a1 1 0 1 1-1.4-1.4l2.8-2.8-2.8-2.8a1 1 0 0 1 0-1.4Z"></path></svg>',
          },
        ],
      },
    ],

    commands: {
      toggleTrackChanges: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const resolved = ensureEditorState(context);
        if (!resolved) return false;

        const { editor, state } = resolved;
        state.enabled = !state.enabled;

        if (state.enabled) {
          attachEditorTracking(editor, state);
        } else {
          detachEditorTracking(editor);
          normalizeInsertMarkers(editor);
          moveCaretOutsideActiveInsertMarker(editor);
        }

        updateEditorTrackingClass(editor, state.enabled);
        setCommandButtonActiveState(editor, 'toggleTrackChanges', state.enabled);
        editor.dispatchEvent(new CustomEvent('editora:track-changes-toggle', {
          bubbles: true,
          detail: {
            enabled: state.enabled,
            author: state.author,
          },
        }));

        return state.enabled;
      },

      acceptAllTrackChanges: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const resolved = ensureEditorState(context);
        if (!resolved) return false;
        return applyTrackChangeResolution(resolved.editor, 'accept', 'all');
      },

      rejectAllTrackChanges: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const resolved = ensureEditorState(context);
        if (!resolved) return false;
        return applyTrackChangeResolution(resolved.editor, 'reject', 'all');
      },

      acceptSelectedTrackChanges: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const resolved = ensureEditorState(context);
        if (!resolved) return false;
        return applyTrackChangeResolution(resolved.editor, 'accept', 'selection');
      },

      rejectSelectedTrackChanges: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const resolved = ensureEditorState(context);
        if (!resolved) return false;
        return applyTrackChangeResolution(resolved.editor, 'reject', 'selection');
      },
    },

    keymap: {
      'Mod-Shift-t': 'toggleTrackChanges',
      'Mod-Shift-T': 'toggleTrackChanges',
    },

    destroy: () => {
      Array.from(trackedEditors).forEach((editor) => detachEditorTracking(editor));
    },
  };
};
