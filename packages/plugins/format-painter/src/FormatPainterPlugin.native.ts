import type { Plugin } from '@editora/core';

type InlineFormatName = 'bold' | 'italic' | 'underline' | 'strikethrough';

type InlineFormatSnapshot = {
  marks: Partial<Record<InlineFormatName, boolean>>;
  styles: Record<string, string>;
};

type BlockFormatSnapshot = {
  tagName: string;
  styles: Record<string, string>;
  attrs: Record<string, string>;
};

type ListFormatSnapshot = {
  tagName: 'ul' | 'ol';
  styles: Record<string, string>;
  attrs: Record<string, string>;
  itemAttrs: Record<string, string>;
} | null;

type TableFormatSnapshot = {
  table: {
    styles: Record<string, string>;
    attrs: Record<string, string>;
  } | null;
  cell: {
    styles: Record<string, string>;
    attrs: Record<string, string>;
  } | null;
} | null;

export type FormatPainterSnapshot = {
  inline: InlineFormatSnapshot;
  block: BlockFormatSnapshot | null;
  list: ListFormatSnapshot;
  table: TableFormatSnapshot;
  ignoredFormats: string[];
};

export interface FormatPainterPluginOptions {
  ignoredFormats?: string[];
  keepActiveAfterMouseApply?: boolean;
}

type CommandContext = {
  editorElement?: HTMLElement | null;
  contentElement?: HTMLElement | null;
};

type PainterState = {
  snapshot: FormatPainterSnapshot | null;
  active: boolean;
  options: Required<FormatPainterPluginOptions>;
};

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content, [contenteditable="true"]';
const EDITOR_ROOT_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const BLOCK_SELECTOR = 'p,div,li,h1,h2,h3,h4,h5,h6,blockquote,pre,td,th';
const LIST_SELECTOR = 'ul,ol';
const INLINE_FORMAT_SELECTOR = 'b,strong,i,em,u,s,strike,font,span';
const TABLE_CELL_SELECTOR = 'td,th';
const BOOKMARK_ATTR = 'data-editora-format-painter-bookmark';
const DEFAULT_IGNORED_FORMATS = ['link', 'address', 'comments', 'citations', 'track-changes'];

const INLINE_STYLE_PROPERTIES = [
  'fontFamily',
  'fontSize',
  'color',
  'backgroundColor',
  'textTransform',
] as const;

const BLOCK_STYLE_PROPERTIES = [
  'textAlign',
  'lineHeight',
  'marginLeft',
  'marginRight',
] as const;

const LIST_STYLE_PROPERTIES = ['listStyleType'] as const;

const TABLE_STYLE_PROPERTIES = [
  'borderCollapse',
  'borderSpacing',
  'width',
] as const;

const TABLE_CELL_STYLE_PROPERTIES = [
  'backgroundColor',
  'textAlign',
  'verticalAlign',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
] as const;

const FORMAT_ALIASES: Record<string, string> = {
  background: 'backgroundcolor',
  bgcolor: 'backgroundcolor',
  blockquote: 'block',
  blocks: 'block',
  font: 'fontfamily',
  fontname: 'fontfamily',
  fontsize: 'fontsize',
  foreground: 'color',
  forecolor: 'color',
  heading: 'block',
  headings: 'block',
  liststyle: 'list',
  lists: 'list',
  strike: 'strikethrough',
  tablecell: 'table',
  tablecells: 'table',
  textcolor: 'color',
  texttransform: 'texttransform',
};

const FORMAT_PAINTER_ICON =
  '<svg width="24" height="24" focusable="false" viewBox="0 0 24 24"><path d="M17.8 3.2a2.8 2.8 0 0 1 4 4L14 15l-4-4 7.8-7.8Zm-1.4 4.2L19 10l1.4-1.4-2.6-2.6-1.4 1.4Zm-7.8 5 3 3-1.4 1.4c-.5.5-1.2.8-1.9.8H7.2l-1.6 1.6a2.7 2.7 0 0 1-3.8 0 1 1 0 0 1 0-1.4l6.8-5.4Zm-.2 3.2H9l-4.6 3.7c.2 0 .5-.2.7-.4l1.9-1.9c.2-.2.4-.3.7-.3h1.1c.2 0 .5-.1.6-.3l.2-.2-1.2-1.3ZM5.5 3l.7 1.8L8 5.5l-1.8.7L5.5 8l-.7-1.8L3 5.5l1.8-.7L5.5 3Zm3.8 4.4.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5.5-1.2Z" fill-rule="evenodd"></path></svg>';

const states = new WeakMap<HTMLElement, PainterState>();
let globalSnapshot: FormatPainterSnapshot | null = null;
let globalListenersInstalled = false;
let defaultPluginOptions: Required<FormatPainterPluginOptions> = {
  ignoredFormats: DEFAULT_IGNORED_FORMATS,
  keepActiveAfterMouseApply: false,
};

export const FormatPainterPlugin = (options: FormatPainterPluginOptions = {}): Plugin => {
  const resolvedOptions: Required<FormatPainterPluginOptions> = {
    ignoredFormats: options.ignoredFormats ?? DEFAULT_IGNORED_FORMATS,
    keepActiveAfterMouseApply: options.keepActiveAfterMouseApply ?? false,
  };
  defaultPluginOptions = resolvedOptions;

  return {
    name: 'formatPainter',

    toolbar: [
      {
        label: 'Format Painter',
        command: 'toggleFormatPainter',
        icon: FORMAT_PAINTER_ICON,
        shortcut: 'Ctrl+Alt+C / Ctrl+Alt+V',
      },
    ],

    commands: {
      retrieveFormats: (_args?: unknown, context?: CommandContext) => retrieveFormats(context, resolvedOptions),
      paintFormats: (_args?: unknown, context?: CommandContext) => paintFormats(context, resolvedOptions),
      toggleFormatPainter: (_args?: unknown, context?: CommandContext) =>
        toggleFormatPainter(context, resolvedOptions),
      cancelFormatPainter: (_args?: unknown, context?: CommandContext) => cancelFormatPainter(context),
    },

    initialize: () => {
      installGlobalListeners();
    },
  };
};

function retrieveFormats(
  context?: CommandContext,
  options: Required<FormatPainterPluginOptions> = defaultPluginOptions,
): boolean {
  const editor = resolveEditorContent(context);
  if (!editor) return false;

  const snapshot = captureSnapshot(editor, options);
  if (!snapshot) return false;

  const state = getState(editor);
  state.options = options;
  state.snapshot = snapshot;
  globalSnapshot = snapshot;
  updateToolbarState(editor, false);
  return true;
}

function paintFormats(
  context?: CommandContext,
  options: Required<FormatPainterPluginOptions> = defaultPluginOptions,
): boolean {
  const editor = resolveEditorContent(context);
  if (!editor) return false;

  const state = getState(editor);
  state.options = options;
  const snapshot = state.snapshot || globalSnapshot;
  if (!snapshot) return false;

  return applySnapshotToSelection(editor, snapshot);
}

function toggleFormatPainter(
  context?: CommandContext,
  options: Required<FormatPainterPluginOptions> = defaultPluginOptions,
): boolean {
  const editor = resolveEditorContent(context);
  if (!editor) return false;

  const state = getState(editor);
  state.options = options;
  if (state.active) {
    setFormatPainterActive(editor, false);
    return true;
  }

  const snapshot = captureSnapshot(editor, options);
  if (!snapshot) return false;

  state.snapshot = snapshot;
  globalSnapshot = snapshot;
  setFormatPainterActive(editor, true);
  return true;
}

function cancelFormatPainter(context?: CommandContext): boolean {
  const editor = resolveEditorContent(context);
  if (editor) {
    setFormatPainterActive(editor, false);
    return true;
  }

  document.querySelectorAll(`${EDITOR_CONTENT_SELECTOR}.rte-format-painter-active`).forEach((node) => {
    setFormatPainterActive(node as HTMLElement, false);
  });
  return true;
}

function installGlobalListeners(): void {
  if (globalListenersInstalled || typeof document === 'undefined') return;
  globalListenersInstalled = true;

  document.addEventListener('keydown', handleGlobalKeydown, true);
  document.addEventListener('mouseup', handlePaintPointerRelease, true);
}

function handleGlobalKeydown(event: KeyboardEvent): void {
  const key = event.key.toLowerCase();
  const hasPrimaryModifier = event.ctrlKey || event.metaKey;

  if (event.key === 'Escape') {
    cancelFormatPainter();
    return;
  }

  if (!hasPrimaryModifier || !event.altKey || event.shiftKey) return;

  const editor = resolveEditorFromSelection() || resolveEditorContent();
  if (!editor) return;

  if (key === 'c') {
    if (retrieveFormats({ contentElement: editor }, getState(editor).options)) {
      event.preventDefault();
    }
    return;
  }

  if (key === 'v') {
    if (paintFormats({ contentElement: editor }, getState(editor).options)) {
      event.preventDefault();
    }
  }
}

function handlePaintPointerRelease(event: MouseEvent): void {
  const target = event.target as Element | null;
  if (target?.closest('.rte-toolbar-wrapper, .editora-toolbar-container')) return;

  const editor = target?.closest(EDITOR_CONTENT_SELECTOR);
  if (!(editor instanceof HTMLElement)) return;

  const state = getState(editor);
  if (!state.active || !state.snapshot) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.getRangeAt(0).collapsed) return;

  const applied = applySnapshotToSelection(editor, state.snapshot);
  if (applied && !state.options.keepActiveAfterMouseApply) {
    setFormatPainterActive(editor, false);
  }
}

function getState(editor: HTMLElement): PainterState {
  let state = states.get(editor);
  if (!state) {
    state = { snapshot: null, active: false, options: defaultPluginOptions };
    states.set(editor, state);
  }
  return state;
}

function resolveEditorContent(context?: CommandContext): HTMLElement | null {
  if (context?.contentElement instanceof HTMLElement) return context.contentElement;

  const fromContextRoot = getEditableFromElement(context?.editorElement ?? null);
  if (fromContextRoot) return fromContextRoot;

  const commandRoot = typeof window !== 'undefined'
    ? ((window as any).__editoraCommandEditorRoot as HTMLElement | null)
    : null;
  const fromCommandRoot = getEditableFromElement(commandRoot);
  if (fromCommandRoot) return fromCommandRoot;

  return resolveEditorFromSelection() || resolveEditorFromActiveElement();
}

function getEditableFromElement(element: HTMLElement | null | undefined): HTMLElement | null {
  if (!element) return null;
  if (element.matches(EDITOR_CONTENT_SELECTOR)) return element;
  return element.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function resolveEditorFromSelection(): HTMLElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const element = getElementForNode(range.commonAncestorContainer);
  const editor = element?.closest(EDITOR_CONTENT_SELECTOR);
  return editor instanceof HTMLElement ? editor : null;
}

function resolveEditorFromActiveElement(): HTMLElement | null {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) return null;
  const editor = active.closest(EDITOR_CONTENT_SELECTOR);
  return editor instanceof HTMLElement ? editor : null;
}

function getElementForNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? node as HTMLElement : node.parentElement;
}

function captureSnapshot(
  editor: HTMLElement,
  options: Required<FormatPainterPluginOptions>,
): FormatPainterSnapshot | null {
  const selection = window.getSelection();
  const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  const sourceNode = range ? (range.collapsed ? range.startContainer : range.commonAncestorContainer) : null;
  const sourceElement = getElementForNode(sourceNode) || editor;
  if (!editor.contains(sourceElement)) return null;

  const ignoredFormats = normalizeIgnoredFormats(options.ignoredFormats);
  const blockSource = getClosestBlock(sourceElement, editor);
  const listItem = sourceElement.closest('li');
  const list = listItem?.closest(LIST_SELECTOR) as HTMLElement | null;
  const tableCell = sourceElement.closest(TABLE_CELL_SELECTOR) as HTMLElement | null;
  const table = tableCell?.closest('table') as HTMLElement | null;

  return {
    inline: captureInlineSnapshotForSelection(range, sourceElement, editor, ignoredFormats),
    block: !isFormatIgnored(ignoredFormats, 'block') && blockSource
      ? captureBlockSnapshot(blockSource, ignoredFormats)
      : null,
    list: !isFormatIgnored(ignoredFormats, 'list') && list
      ? captureListSnapshot(list, listItem as HTMLElement | null)
      : null,
    table: !isFormatIgnored(ignoredFormats, 'table')
      ? captureTableSnapshot(table, tableCell, ignoredFormats)
      : null,
    ignoredFormats,
  };
}

function captureInlineSnapshotForSelection(
  range: Range | null,
  sourceElement: HTMLElement,
  editor: HTMLElement,
  ignoredFormats: string[],
): InlineFormatSnapshot {
  if (!range || range.collapsed) {
    return captureInlineSnapshot(sourceElement, ignoredFormats);
  }

  const sources = getInlineSourceElements(range, sourceElement, editor);
  const snapshots = sources.map((source) => captureInlineSnapshot(source, ignoredFormats));
  return mergeInlineSnapshots(snapshots);
}

function getInlineSourceElements(
  range: Range,
  sourceElement: HTMLElement,
  editor: HTMLElement,
): HTMLElement[] {
  const sources: HTMLElement[] = [];
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (!editor.contains(node)) return NodeFilter.FILTER_REJECT;
        if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT;
        return (node.textContent || '').trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    },
  );

  let node = walker.nextNode();
  while (node && sources.length < 64) {
    const element = getElementForNode(node);
    if (element && !sources.includes(element)) {
      sources.push(element);
    }
    node = walker.nextNode();
  }

  return sources.length > 0 ? sources : [sourceElement];
}

function captureInlineSnapshot(source: HTMLElement, ignoredFormats: string[]): InlineFormatSnapshot {
  const computed = window.getComputedStyle(source);
  const marks: InlineFormatSnapshot['marks'] = {};
  if (!isFormatIgnored(ignoredFormats, 'bold')) marks.bold = isBold(source, computed);
  if (!isFormatIgnored(ignoredFormats, 'italic')) marks.italic = isItalic(source, computed);
  if (!isFormatIgnored(ignoredFormats, 'underline')) {
    marks.underline = hasTextDecoration(source, computed, 'underline');
  }
  if (!isFormatIgnored(ignoredFormats, 'strikethrough')) {
    marks.strikethrough = hasTextDecoration(source, computed, 'line-through');
  }

  const styles: Record<string, string> = {};
  INLINE_STYLE_PROPERTIES.forEach((property) => {
    if (isFormatIgnored(ignoredFormats, property)) return;
    const value = computed[property];
    if (isMeaningfulInlineStyle(property, value)) {
      styles[property] = value;
    }
  });

  return { marks, styles };
}

function mergeInlineSnapshots(snapshots: InlineFormatSnapshot[]): InlineFormatSnapshot {
  const marks: InlineFormatSnapshot['marks'] = {};
  const markNames: InlineFormatName[] = ['bold', 'italic', 'underline', 'strikethrough'];
  markNames.forEach((name) => {
    const values = snapshots.map((snapshot) => snapshot.marks[name]).filter((value) => value != null);
    if (values.length === 0) return;
    marks[name] = values.every(Boolean);
  });

  const styles: Record<string, string> = {};
  INLINE_STYLE_PROPERTIES.forEach((property) => {
    const values = snapshots
      .map((snapshot) => snapshot.styles[property])
      .filter((value): value is string => Boolean(value));
    if (values.length === snapshots.length && values.every((value) => value === values[0])) {
      styles[property] = values[0];
    }
  });

  return { marks, styles };
}

function captureBlockSnapshot(block: HTMLElement, ignoredFormats: string[]): BlockFormatSnapshot {
  const computed = window.getComputedStyle(block);
  const styles: Record<string, string> = {};
  BLOCK_STYLE_PROPERTIES.forEach((property) => {
    if (isFormatIgnored(ignoredFormats, property)) return;
    const inlineValue = block.style[property];
    const value = inlineValue || computed[property];
    if (isMeaningfulBlockStyle(property, value)) {
      styles[property] = value;
    }
  });

  const attrs: Record<string, string> = {};
  const dir = block.getAttribute('dir') || block.style.direction;
  if (dir === 'ltr' || dir === 'rtl' || dir === 'auto') {
    attrs.dir = dir;
  }

  return {
    tagName: normalizeBlockTagName(block),
    styles,
    attrs,
  };
}

function captureListSnapshot(list: HTMLElement, item: HTMLElement | null): ListFormatSnapshot {
  const styles: Record<string, string> = {};
  LIST_STYLE_PROPERTIES.forEach((property) => {
    const value = list.style[property] || window.getComputedStyle(list)[property];
    if (value && value !== 'disc' && value !== 'decimal') {
      styles[property] = value;
    }
  });

  const attrs: Record<string, string> = {};
  copyAllowedAttribute(list, attrs, 'data-type');
  copyAllowedAttribute(list, attrs, 'type');

  const itemAttrs: Record<string, string> = {};
  if (item) {
    copyAllowedAttribute(item, itemAttrs, 'data-type');
    copyAllowedAttribute(item, itemAttrs, 'data-checked');
  }

  return {
    tagName: list.tagName.toLowerCase() === 'ol' ? 'ol' : 'ul',
    styles,
    attrs,
    itemAttrs,
  };
}

function captureTableSnapshot(
  table: HTMLElement | null,
  cell: HTMLElement | null,
  ignoredFormats: string[],
): TableFormatSnapshot {
  if (!table && !cell) return null;

  return {
    table: table ? captureStyleSnapshot(table, TABLE_STYLE_PROPERTIES, ignoredFormats) : null,
    cell: cell ? captureStyleSnapshot(cell, TABLE_CELL_STYLE_PROPERTIES, ignoredFormats) : null,
  };
}

function captureStyleSnapshot(
  element: HTMLElement,
  properties: readonly string[],
  ignoredFormats: string[],
): { styles: Record<string, string>; attrs: Record<string, string> } {
  const computed = window.getComputedStyle(element);
  const styles: Record<string, string> = {};

  properties.forEach((property) => {
    if (isFormatIgnored(ignoredFormats, property)) return;
    const inlineValue = element.style[property as any];
    const value = inlineValue || computed[property as any];
    if (isMeaningfulTableStyle(property, value)) {
      styles[property] = value;
    }
  });

  return { styles, attrs: {} };
}

function isBold(source: HTMLElement, computed: CSSStyleDeclaration): boolean {
  if (source.closest('b,strong')) return true;
  const weight = computed.fontWeight;
  return /^(bold|bolder|[5-9]\d{2,})$/.test(weight);
}

function isItalic(source: HTMLElement, computed: CSSStyleDeclaration): boolean {
  return !!source.closest('i,em') || computed.fontStyle === 'italic';
}

function hasTextDecoration(
  source: HTMLElement,
  computed: CSSStyleDeclaration,
  decoration: 'underline' | 'line-through',
): boolean {
  const selector = decoration === 'underline' ? 'u' : 's,strike';
  return !!source.closest(selector) || computed.textDecorationLine.includes(decoration);
}

function isMeaningfulInlineStyle(property: string, value: string): boolean {
  if (!value) return false;
  if (property === 'backgroundColor' && (value === 'rgba(0, 0, 0, 0)' || value === 'transparent')) return false;
  if (property === 'textTransform' && value === 'none') return false;
  return true;
}

function isMeaningfulBlockStyle(property: string, value: string): boolean {
  if (!value) return false;
  if (property === 'textAlign' && value === 'start') return false;
  if (property === 'lineHeight' && value === 'normal') return false;
  if ((property === 'marginLeft' || property === 'marginRight') && value === '0px') return false;
  return true;
}

function isMeaningfulTableStyle(property: string, value: string): boolean {
  if (!value) return false;
  if ((property === 'backgroundColor' || property.endsWith('Color')) &&
    (value === 'rgba(0, 0, 0, 0)' || value === 'transparent')) return false;
  if (property === 'textAlign' && value === 'start') return false;
  if (property === 'verticalAlign' && value === 'middle') return false;
  if (property.endsWith('Width') && value === '0px') return false;
  if (property.endsWith('Style') && value === 'none') return false;
  if (property.startsWith('padding') && value === '0px') return false;
  if (property === 'borderSpacing' && value === '0px') return false;
  if (property === 'width' && value === 'auto') return false;
  return true;
}

function applySnapshotToSelection(editor: HTMLElement, snapshot: FormatPainterSnapshot): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) return false;

  const beforeHTML = editor.innerHTML;
  const shouldApplyInline = !range.collapsed;
  const restoreSelection = bookmarkCurrentSelection(editor);

  applyTableSnapshot(editor, range, snapshot.table);
  applyBlockSnapshot(editor, range, snapshot);
  restoreSelection?.();

  const restoredSelection = window.getSelection();
  const restoredRange =
    restoredSelection && restoredSelection.rangeCount > 0
      ? restoredSelection.getRangeAt(0)
      : null;

  if (
    shouldApplyInline &&
    restoredSelection &&
    restoredRange &&
    editor.contains(restoredRange.startContainer) &&
    editor.contains(restoredRange.endContainer)
  ) {
    applyInlineSnapshot(restoredRange, restoredSelection, snapshot);
  }

  removeBookmarkMarkers(editor);
  normalizeEmptySpans(editor);

  const afterHTML = editor.innerHTML;
  if (beforeHTML === afterHTML) return false;

  recordDomHistoryTransaction(editor, beforeHTML, afterHTML);
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}

function applyBlockSnapshot(
  editor: HTMLElement,
  range: Range,
  snapshot: FormatPainterSnapshot,
): void {
  const blocks = getSelectedBlocks(editor, range);

  if (snapshot.list) {
    applyListSnapshot(blocks, snapshot.list);
  }

  if (!snapshot.block) return;

  blocks.forEach((block) => {
    const current = block.isConnected ? block : null;
    if (!current) return;

    const target = transformBlockTag(current, snapshot.block!.tagName);
    applyStyleMap(target, snapshot.block!.styles);

    if (snapshot.block!.attrs.dir) {
      target.setAttribute('dir', snapshot.block!.attrs.dir);
    } else {
      target.removeAttribute('dir');
    }
  });
}

function applyTableSnapshot(
  editor: HTMLElement,
  range: Range,
  tableSnapshot: TableFormatSnapshot,
): void {
  if (!tableSnapshot) return;

  const selectedCells = getSelectedTableCells(editor, range);
  if (tableSnapshot.cell) {
    selectedCells.forEach((cell) => {
      applyStyleMap(cell, tableSnapshot.cell!.styles);
    });
  }

  if (!tableSnapshot.table) return;

  const selectedTables = new Set<HTMLElement>();
  selectedCells.forEach((cell) => {
    const table = cell.closest('table');
    if (table instanceof HTMLElement) selectedTables.add(table);
  });

  if (selectedTables.size === 0) {
    const fallbackTable = getElementForNode(range.startContainer)?.closest('table');
    if (fallbackTable instanceof HTMLElement && editor.contains(fallbackTable)) {
      selectedTables.add(fallbackTable);
    }
  }

  selectedTables.forEach((table) => {
    applyStyleMap(table, tableSnapshot.table!.styles);
  });
}

function applyInlineSnapshot(
  range: Range,
  selection: Selection,
  snapshot: FormatPainterSnapshot,
): void {
  expandRangeToSelectedInlineAncestors(range);
  const inline = snapshot.inline;
  const selectedContent = range.cloneContents();

  if (containsBlockElement(selectedContent)) {
    applyInlineSnapshotToSelectedTextNodes(range, selection, snapshot);
    return;
  }

  const extractedContent = range.extractContents();
  removeConflictingInlineFormats(extractedContent, snapshot);

  const replacement = document.createDocumentFragment();
  const startMarker = createInlineBookmarkMarker('start');
  const endMarker = createInlineBookmarkMarker('end');
  replacement.appendChild(startMarker);
  replacement.appendChild(wrapContentsWithInlineSnapshot(extractedContent, inline));

  replacement.appendChild(endMarker);
  range.insertNode(replacement);
  removeConflictingInlineAncestors(startMarker, endMarker, snapshot);

  const nextRange = document.createRange();
  nextRange.setStartAfter(startMarker);
  nextRange.setEndBefore(endMarker);
  selection.removeAllRanges();
  selection.addRange(nextRange);
}

function applyInlineSnapshotToSelectedTextNodes(
  range: Range,
  selection: Selection,
  snapshot: FormatPainterSnapshot,
): void {
  const textNodes = getSelectedTextNodes(range);
  const wrappedNodes: Node[] = [];

  textNodes.forEach((textNode) => {
    let selectedText = isolateSelectedTextNode(textNode, range);
    if (!selectedText || !selectedText.data.trim() || isStructuralListWhitespace(selectedText)) return;

    selectedText = removeConflictingInlineAncestorsForTextNode(selectedText, snapshot);
    const wrapper = wrapContentsWithInlineSnapshot(document.createTextNode(selectedText.data), snapshot.inline);
    selectedText.parentNode?.replaceChild(wrapper, selectedText);
    wrappedNodes.push(wrapper);
  });

  if (wrappedNodes.length === 0) return;

  const nextRange = document.createRange();
  nextRange.setStartBefore(wrappedNodes[0]);
  nextRange.setEndAfter(wrappedNodes[wrappedNodes.length - 1]);
  selection.removeAllRanges();
  selection.addRange(nextRange);
}

function getSelectedTextNodes(range: Range): Text[] {
  if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
    return [range.startContainer as Text];
  }

  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      if (!range.intersectsNode(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }

  return textNodes;
}

function isolateSelectedTextNode(textNode: Text, range: Range): Text | null {
  const textLength = textNode.data.length;
  let start = 0;
  let end = textLength;

  if (textNode === range.startContainer) {
    start = Math.max(0, Math.min(range.startOffset, textLength));
  }

  if (textNode === range.endContainer) {
    end = Math.max(0, Math.min(range.endOffset, textLength));
  }

  if (start >= end) return null;

  let selected = textNode;
  if (end < selected.data.length) {
    selected.splitText(end);
  }
  if (start > 0) {
    selected = selected.splitText(start);
  }

  return selected;
}

function removeConflictingInlineAncestorsForTextNode(
  textNode: Text,
  snapshot: FormatPainterSnapshot,
): Text {
  let current: Text = textNode;
  let parent = current.parentElement;

  while (
    parent &&
    parent.matches(INLINE_FORMAT_SELECTOR) &&
    !shouldPreserveInlineElement(parent, snapshot) &&
    shouldRemoveInlineElement(parent, snapshot)
  ) {
    splitInlineAncestorAroundNode(parent, current);
    parent = current.parentElement;
  }

  return current;
}

function splitInlineAncestorAroundNode(ancestor: HTMLElement, child: Node): void {
  const parent = ancestor.parentNode;
  if (!parent || child.parentNode !== ancestor) return;

  const before = ancestor.cloneNode(false) as HTMLElement;
  const after = ancestor.cloneNode(false) as HTMLElement;

  while (ancestor.firstChild && ancestor.firstChild !== child) {
    before.appendChild(ancestor.firstChild);
  }

  while (child.nextSibling) {
    after.appendChild(child.nextSibling);
  }

  if (hasNonEmptyChildren(before)) {
    parent.insertBefore(before, ancestor);
  }
  parent.insertBefore(child, ancestor);
  if (hasNonEmptyChildren(after)) {
    parent.insertBefore(after, ancestor);
  }
  parent.removeChild(ancestor);
}

function hasNonEmptyChildren(element: HTMLElement): boolean {
  return Array.from(element.childNodes).some((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return true;
    return Boolean((node.textContent || '').trim());
  });
}

function expandRangeToSelectedInlineAncestors(range: Range): void {
  let startElement = getElementForNode(range.startContainer);
  let endElement = getElementForNode(range.endContainer);

  while (startElement && startElement === endElement && startElement.matches(INLINE_FORMAT_SELECTOR)) {
    if (!rangeSelectsElementContents(range, startElement)) return;
    range.selectNode(startElement);
    startElement = startElement.parentElement;
    endElement = getElementForNode(range.endContainer);
  }
}

function rangeSelectsElementContents(range: Range, element: HTMLElement): boolean {
  const contents = document.createRange();
  contents.selectNodeContents(element);
  return range.compareBoundaryPoints(Range.START_TO_START, contents) === 0 &&
    range.compareBoundaryPoints(Range.END_TO_END, contents) === 0;
}

function removeConflictingInlineAncestors(
  startMarker: ChildNode,
  endMarker: ChildNode,
  snapshot: FormatPainterSnapshot,
): void {
  let current = getElementForNode(startMarker.parentNode);
  while (current && current.contains(endMarker)) {
    const parent = current.parentElement;
    if (
      current.matches(INLINE_FORMAT_SELECTOR) &&
      !shouldPreserveInlineElement(current, snapshot) &&
      inlineElementFullyCoveredByMarkers(current, startMarker, endMarker) &&
      shouldRemoveInlineElement(current, snapshot)
    ) {
      unwrapElement(current);
    }
    current = parent;
  }
}

function inlineElementFullyCoveredByMarkers(
  element: HTMLElement,
  startMarker: ChildNode,
  endMarker: ChildNode,
): boolean {
  let state: 'before' | 'inside' | 'after' = 'before';

  for (const child of Array.from(element.childNodes)) {
    if (child === startMarker) {
      state = 'inside';
      continue;
    }
    if (child === endMarker) {
      state = 'after';
      continue;
    }
    if (state === 'inside') continue;
    if (isIgnorableBoundaryNode(child)) continue;
    return false;
  }

  return state === 'after';
}

function isIgnorableBoundaryNode(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE) {
    return !(node.textContent || '').replace(/\uFEFF/g, '').trim();
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    return isBookmarkMarker(node);
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return true;
  const element = node as HTMLElement;
  return element.hasAttribute(BOOKMARK_ATTR);
}

function shouldRemoveInlineElement(element: HTMLElement, snapshot: FormatPainterSnapshot): boolean {
  if (element.matches('span')) {
    return INLINE_STYLE_PROPERTIES.some((property) => !isFormatIgnored(snapshot.ignoredFormats, property));
  }
  if (element.matches('b,strong')) return !isFormatIgnored(snapshot.ignoredFormats, 'bold');
  if (element.matches('i,em')) return !isFormatIgnored(snapshot.ignoredFormats, 'italic');
  if (element.matches('u')) return !isFormatIgnored(snapshot.ignoredFormats, 'underline');
  if (element.matches('s,strike')) return !isFormatIgnored(snapshot.ignoredFormats, 'strikethrough');
  return true;
}

function wrapTextNodesInFragment(fragment: DocumentFragment, inline: InlineFormatSnapshot): void {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      if (isStructuralListWhitespace(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    textNodes.push(node as Text);
    node = walker.nextNode();
  }

  textNodes.forEach((textNode) => {
    const wrapper = wrapContentsWithInlineSnapshot(document.createTextNode(textNode.data), inline);
    textNode.parentNode?.replaceChild(wrapper, textNode);
  });
}

function isStructuralListWhitespace(node: Node): boolean {
  if (node.nodeType !== Node.TEXT_NODE || (node.textContent || '').trim()) return false;
  const parent = node.parentElement;
  return !!parent?.matches(LIST_SELECTOR);
}

function wrapContentsWithInlineSnapshot(content: Node, inline: InlineFormatSnapshot): Node {
  let current: Node = content;

  const styleEntries = Object.entries(inline.styles);
  if (styleEntries.length > 0) {
    const span = document.createElement('span');
    span.classList.add('rte-format-painted');
    styleEntries.forEach(([property, value]) => {
      span.style.setProperty(kebabCase(property), value);
    });
    span.appendChild(current);
    current = span;
  }

  if (inline.marks.strikethrough) current = wrapNode('s', current);
  if (inline.marks.underline) current = wrapNode('u', current);
  if (inline.marks.italic) current = wrapNode('i', current);
  if (inline.marks.bold) current = wrapNode('b', current);

  return current;
}

function wrapNode(tagName: string, child: Node): HTMLElement {
  const wrapper = document.createElement(tagName);
  wrapper.appendChild(child);
  return wrapper;
}

function removeConflictingInlineFormats(root: ParentNode, snapshot: FormatPainterSnapshot): void {
  Array.from(root.querySelectorAll(INLINE_FORMAT_SELECTOR)).forEach((element) => {
    if (!(element instanceof HTMLElement)) return;
    if (shouldPreserveInlineElement(element, snapshot)) return;

    if (element.matches('span')) {
      INLINE_STYLE_PROPERTIES.forEach((property) => {
        if (isFormatIgnored(snapshot.ignoredFormats, property)) return;
        element.style.removeProperty(kebabCase(property));
      });
      if (element.getAttribute('style') || element.attributes.length > 0) return;
      unwrapElement(element);
      return;
    }

    if (element.matches('b,strong') && isFormatIgnored(snapshot.ignoredFormats, 'bold')) return;
    if (element.matches('i,em') && isFormatIgnored(snapshot.ignoredFormats, 'italic')) return;
    if (element.matches('u') && isFormatIgnored(snapshot.ignoredFormats, 'underline')) return;
    if (element.matches('s,strike') && isFormatIgnored(snapshot.ignoredFormats, 'strikethrough')) return;
    unwrapElement(element);
  });
}

function shouldPreserveInlineElement(element: HTMLElement, snapshot: FormatPainterSnapshot): boolean {
  if (element.matches('a') && isFormatIgnored(snapshot.ignoredFormats, 'link')) return true;
  if (hasWorkflowMarker(element, 'comment') && isFormatIgnored(snapshot.ignoredFormats, 'comments')) return true;
  if (hasWorkflowMarker(element, 'citation') && isFormatIgnored(snapshot.ignoredFormats, 'citations')) return true;
  if (hasWorkflowMarker(element, 'track') && isFormatIgnored(snapshot.ignoredFormats, 'trackchanges')) return true;
  return false;
}

function hasWorkflowMarker(element: HTMLElement, token: string): boolean {
  const normalizedToken = token.toLowerCase();
  const className = element.className.toString().toLowerCase();
  if (className.includes(normalizedToken)) return true;

  return Array.from(element.attributes).some((attr) => {
    const name = normalizeFormatName(attr.name);
    const value = attr.value.toLowerCase();
    return name.includes(normalizedToken) || value.includes(normalizedToken);
  });
}

function applyListSnapshot(blocks: HTMLElement[], listSnapshot: NonNullable<ListFormatSnapshot>): void {
  const listItems = blocks.filter((block) => block.tagName.toLowerCase() === 'li');
  listItems.forEach((item) => {
    const list = item.closest(LIST_SELECTOR) as HTMLElement | null;
    if (!list) return;

    const targetList = transformListTag(list, listSnapshot.tagName);
    applyStyleMap(targetList, listSnapshot.styles);
    applyAllowedAttributes(targetList, listSnapshot.attrs);
    applyAllowedAttributes(item, listSnapshot.itemAttrs);
  });
}

function getSelectedTableCells(editor: HTMLElement, range: Range): HTMLElement[] {
  const cells = Array.from(editor.querySelectorAll(TABLE_CELL_SELECTOR))
    .filter((element): element is HTMLElement => element instanceof HTMLElement && range.intersectsNode(element));

  if (cells.length > 0) return cells;

  const fallback = getElementForNode(range.startContainer)?.closest(TABLE_CELL_SELECTOR);
  return fallback instanceof HTMLElement && editor.contains(fallback) ? [fallback] : [];
}

function applyStyleMap(target: HTMLElement, styles: Record<string, string>): void {
  Object.entries(styles).forEach(([property, value]) => {
    target.style.setProperty(kebabCase(property), value);
  });
}

function transformBlockTag(block: HTMLElement, tagName: string): HTMLElement {
  const currentTag = normalizeBlockTagName(block);
  if (currentTag === tagName) return block;
  if (currentTag === 'li' || currentTag === 'td' || currentTag === 'th') return block;

  if (tagName === 'blockquote') {
    const quote = document.createElement('blockquote');
    while (block.firstChild) quote.appendChild(block.firstChild);
    copySafeAttributes(block, quote);
    block.parentNode?.replaceChild(quote, block);
    return quote;
  }

  if (!/^(p|div|h[1-6]|pre)$/.test(tagName)) return block;

  const replacement = document.createElement(tagName);
  while (block.firstChild) replacement.appendChild(block.firstChild);
  copySafeAttributes(block, replacement);
  block.parentNode?.replaceChild(replacement, block);
  return replacement;
}

function transformListTag(list: HTMLElement, tagName: 'ul' | 'ol'): HTMLElement {
  if (list.tagName.toLowerCase() === tagName) return list;

  const replacement = document.createElement(tagName);
  while (list.firstChild) replacement.appendChild(list.firstChild);
  copySafeAttributes(list, replacement);
  list.parentNode?.replaceChild(replacement, list);
  return replacement;
}

function getSelectedBlocks(editor: HTMLElement, range: Range): HTMLElement[] {
  const blocks = Array.from(editor.querySelectorAll(BLOCK_SELECTOR))
    .filter((element): element is HTMLElement => element instanceof HTMLElement && range.intersectsNode(element));

  if (blocks.length > 0) {
    return blocks.filter((block) => !blocks.some((other) => other !== block && other.contains(block)));
  }

  const fallback = getClosestBlock(getElementForNode(range.startContainer), editor);
  return fallback ? [fallback] : [];
}

function getClosestBlock(element: HTMLElement | null, editor: HTMLElement): HTMLElement | null {
  const block = element?.closest(BLOCK_SELECTOR);
  return block instanceof HTMLElement && editor.contains(block) ? block : null;
}

function normalizeBlockTagName(block: HTMLElement): string {
  const tag = block.tagName.toLowerCase();
  return tag === 'blockquote' || /^h[1-6]$/.test(tag) || tag === 'pre' || tag === 'li' || tag === 'td' || tag === 'th'
    ? tag
    : 'p';
}

function containsBlockElement(root: ParentNode): boolean {
  return Array.from(root.childNodes).some((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    const element = node as HTMLElement;
    return element.matches(BLOCK_SELECTOR) || !!element.querySelector(BLOCK_SELECTOR);
  });
}

function bookmarkCurrentSelection(editor: HTMLElement): (() => void) | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) return null;

  const wasCollapsed = range.collapsed;
  const startMarker = createSelectionBookmarkMarker('start');
  const endMarker = createSelectionBookmarkMarker('end');
  const bookmarkRange = range.cloneRange();

  if (!wasCollapsed) {
    const endRange = bookmarkRange.cloneRange();
    endRange.collapse(false);
    endRange.insertNode(endMarker);
  }

  const startRange = bookmarkRange.cloneRange();
  startRange.collapse(true);
  startRange.insertNode(startMarker);

  return () => {
    const currentStart = findBookmarkMarker(editor, 'start');
    const currentEnd = findBookmarkMarker(editor, 'end');
    if (!currentStart) return;

    const restored = document.createRange();
    if (wasCollapsed || !currentEnd) {
      restored.setStartAfter(currentStart);
      restored.collapse(true);
    } else {
      restored.setStartAfter(currentStart);
      restored.setEndBefore(currentEnd);
    }

    selection.removeAllRanges();
    selection.addRange(restored);
  };
}

function createSelectionBookmarkMarker(type: 'start' | 'end'): Comment {
  return document.createComment(`${BOOKMARK_ATTR}:selection:${type}`);
}

function createInlineBookmarkMarker(type: 'start' | 'end'): Comment {
  return document.createComment(`${BOOKMARK_ATTR}:inline:${type}`);
}

function isBookmarkMarker(node: Node): boolean {
  return isSelectionBookmarkMarker(node) || isInlineBookmarkMarker(node);
}

function isSelectionBookmarkMarker(node: Node): boolean {
  return node.nodeType === Node.COMMENT_NODE &&
    (node.nodeValue === `${BOOKMARK_ATTR}:selection:start` ||
      node.nodeValue === `${BOOKMARK_ATTR}:selection:end`);
}

function isInlineBookmarkMarker(node: Node): boolean {
  return node.nodeType === Node.COMMENT_NODE &&
    (node.nodeValue === `${BOOKMARK_ATTR}:inline:start` ||
      node.nodeValue === `${BOOKMARK_ATTR}:inline:end`);
}

function findBookmarkMarker(editor: HTMLElement, type: 'start' | 'end'): Comment | null {
  const target = `${BOOKMARK_ATTR}:selection:${type}`;
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_COMMENT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeValue === target) return node as Comment;
    node = walker.nextNode();
  }
  return null;
}

function removeBookmarkMarkers(editor: HTMLElement): void {
  editor.querySelectorAll(`[${BOOKMARK_ATTR}]`).forEach((marker) => marker.remove());
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_COMMENT);
  const markers: Comment[] = [];
  let node = walker.nextNode();
  while (node) {
    if (isBookmarkMarker(node)) markers.push(node as Comment);
    node = walker.nextNode();
  }
  markers.forEach((marker) => marker.remove());
}

function normalizeEmptySpans(editor: HTMLElement): void {
  editor.querySelectorAll('span').forEach((span) => {
    if (!(span instanceof HTMLElement)) return;
    if (span.attributes.length > 0) return;
    unwrapElement(span);
  });
}

function unwrapElement(element: HTMLElement): void {
  const parent = element.parentNode;
  if (!parent) return;
  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  parent.removeChild(element);
}

function copyAllowedAttribute(source: HTMLElement, target: Record<string, string>, name: string): void {
  const value = source.getAttribute(name);
  if (value != null) {
    target[name] = value;
  }
}

function applyAllowedAttributes(target: HTMLElement, attrs: Record<string, string>): void {
  ['data-type', 'data-checked', 'type'].forEach((name) => {
    if (attrs[name] != null) {
      target.setAttribute(name, attrs[name]);
    }
  });
}

function copySafeAttributes(source: HTMLElement, target: HTMLElement): void {
  Array.from(source.attributes).forEach((attr) => {
    if (attr.name === 'style') return;
    target.setAttribute(attr.name, attr.value);
  });
}

function setFormatPainterActive(editor: HTMLElement, active: boolean): void {
  const state = getState(editor);
  if (state.active === active && editor.classList.contains('rte-format-painter-active') === active) {
    updateToolbarState(editor, active);
    return;
  }

  state.active = active;
  editor.classList.toggle('rte-format-painter-active', active);
  updateToolbarState(editor, active);
}

function updateToolbarState(editor: HTMLElement, active: boolean): void {
  const root = editor.closest(EDITOR_ROOT_SELECTOR) || document;
  const buttons = root.querySelectorAll(
    '[data-command="toggleFormatPainter"], [data-command="formatPainter"]',
  );

  buttons.forEach((button) => {
    if (!(button instanceof HTMLElement)) return;
    button.classList.toggle('active', active);
    button.setAttribute('data-active', active ? 'true' : 'false');
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  root.dispatchEvent(
    new CustomEvent('editora:format-painter-toggle', {
      bubbles: true,
      detail: { active },
    }),
  );
}

function recordDomHistoryTransaction(editor: HTMLElement, beforeHTML: string, afterHTML: string): void {
  if (beforeHTML === afterHTML) return;
  const executor = (window as any).execEditorCommand || (window as any).executeEditorCommand;
  if (typeof executor !== 'function') return;

  try {
    executor('recordDomTransaction', { editor, beforeHTML, afterHTML });
  } catch {
    try {
      executor('recordDomTransaction', editor, beforeHTML, afterHTML);
    } catch {
      // History plugin may be unavailable.
    }
  }
}

function normalizeIgnoredFormats(formats: string[] | undefined): string[] {
  return (formats ?? DEFAULT_IGNORED_FORMATS)
    .map(normalizeFormatName)
    .map((format) => FORMAT_ALIASES[format] || format)
    .filter(Boolean);
}

function isFormatIgnored(ignoredFormats: string[], format: string): boolean {
  const normalized = FORMAT_ALIASES[normalizeFormatName(format)] || normalizeFormatName(format);
  return ignoredFormats.includes(normalized);
}

function normalizeFormatName(format: string): string {
  return format.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function kebabCase(property: string): string {
  return property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}
