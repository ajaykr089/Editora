export interface ToolbarSelectionState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  link: boolean;
  code: boolean;
  blockType: string | null;
  listType: 'bullet' | 'ordered' | 'checklist' | null;
  direction: 'ltr' | 'rtl' | null;
  alignment: 'left' | 'center' | 'right' | 'justify' | null;
}

const EMPTY_STATE: ToolbarSelectionState = {
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  link: false,
  code: false,
  blockType: null,
  listType: null,
  direction: null,
  alignment: null,
};

const BLOCK_SELECTOR = 'p,h1,h2,h3,h4,h5,h6,blockquote,li,pre,div';
const BLOCK_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'LI', 'PRE', 'DIV']);

function getElementForNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? node as HTMLElement : node.parentElement;
}

function getSelectionRangeInEditor(editorContent: HTMLElement): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!editorContent.contains(range.startContainer) || !editorContent.contains(range.endContainer)) {
    return null;
  }

  return range;
}

function rangeIntersectsNode(range: Range, node: Node): boolean {
  try {
    return range.intersectsNode(node);
  } catch {
    return false;
  }
}

function getTextNodesInRange(editorContent: HTMLElement, range: Range): Text[] {
  if (range.collapsed) return [];

  const nodes: Text[] = [];
  const walker = document.createTreeWalker(editorContent, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      return rangeIntersectsNode(range, node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }

  return nodes;
}

function hasAncestor(
  node: Node | null,
  editorContent: HTMLElement,
  predicate: (element: HTMLElement) => boolean,
): boolean {
  let element = getElementForNode(node);

  while (element && editorContent.contains(element)) {
    if (predicate(element)) return true;
    if (element === editorContent) break;
    element = element.parentElement;
  }

  return false;
}

function parseFontWeight(value: string): number {
  if (value === 'bold' || value === 'bolder') return 700;
  const numeric = Number.parseInt(value, 10);
  return Number.isFinite(numeric) ? numeric : 400;
}

function elementHasBold(element: HTMLElement): boolean {
  if (element.matches('b,strong')) return true;
  return Boolean(element.style.fontWeight) && parseFontWeight(element.style.fontWeight) >= 600;
}

function elementHasItalic(element: HTMLElement): boolean {
  if (element.matches('i,em')) return true;
  return element.style.fontStyle === 'italic';
}

function elementHasUnderline(element: HTMLElement): boolean {
  if (element.matches('u')) return true;
  const decoration = `${element.style.textDecoration} ${element.style.textDecorationLine}`;
  return decoration.includes('underline');
}

function elementHasStrikethrough(element: HTMLElement): boolean {
  if (element.matches('s,strike,del')) return true;
  const decoration = `${element.style.textDecoration} ${element.style.textDecorationLine} ${window.getComputedStyle(element).textDecorationLine}`;
  return decoration.includes('line-through');
}

function isActiveAcrossSelection(
  editorContent: HTMLElement,
  range: Range,
  predicate: (element: HTMLElement) => boolean,
): boolean {
  if (range.collapsed) {
    return hasAncestor(range.startContainer, editorContent, predicate);
  }

  const textNodes = getTextNodesInRange(editorContent, range);
  if (textNodes.length === 0) {
    return hasAncestor(range.startContainer, editorContent, predicate);
  }

  return textNodes.every((node) => hasAncestor(node, editorContent, predicate));
}

function getCollapsedInlineCommandState(
  command: string,
  editorContent: HTMLElement,
  range: Range,
): boolean | null {
  try {
    const nativeState = document.queryCommandState(command);
    if (!nativeState) return nativeState;

    if (command === 'bold') {
      const hasExplicitBold = hasAncestor(range.startContainer, editorContent, elementHasBold);
      if (hasExplicitBold) return true;

      const block = getBlockForNode(range.startContainer, editorContent);
      if (block?.matches('h1,h2,h3,h4,h5,h6')) return false;
    }

    if (command === 'underline') {
      const hasExplicitUnderline = hasAncestor(range.startContainer, editorContent, elementHasUnderline);
      if (hasExplicitUnderline) return true;

      const isImplicitLinkUnderline = hasAncestor(
        range.startContainer,
        editorContent,
        (element) => element.matches('a[href]'),
      );
      if (isImplicitLinkUnderline) return false;
    }

    return nativeState;
  } catch {
    return null;
  }
}

function getBlockForNode(node: Node | null, editorContent: HTMLElement): HTMLElement | null {
  const element = getElementForNode(node);
  if (!element || !editorContent.contains(element)) return null;
  if (element === editorContent) return null;

  const block = element.closest(BLOCK_SELECTOR);
  return block instanceof HTMLElement && editorContent.contains(block) ? block : null;
}

function getSelectedBlocks(editorContent: HTMLElement, range: Range): HTMLElement[] {
  const blocks = new Set<HTMLElement>();
  const startBlock = getBlockForNode(range.startContainer, editorContent);
  const endBlock = getBlockForNode(range.endContainer, editorContent);
  if (startBlock) blocks.add(startBlock);
  if (endBlock) blocks.add(endBlock);

  if (!range.collapsed) {
    getTextNodesInRange(editorContent, range).forEach((node) => {
      const block = getBlockForNode(node, editorContent);
      if (block) blocks.add(block);
    });
  }

  return Array.from(blocks).filter((block) => BLOCK_TAGS.has(block.tagName));
}

function uniqueValue<T extends string>(values: Array<T | null>): T | null {
  const realValues = values.filter((value): value is T => Boolean(value));
  if (realValues.length === 0) return null;
  const first = realValues[0];
  return realValues.every((value) => value === first) ? first : null;
}

function getBlockType(blocks: HTMLElement[]): string | null {
  const values = blocks.map((block) => {
    const listItem = block.closest('li');
    const effectiveBlock = listItem instanceof HTMLElement ? listItem : block;
    const tag = effectiveBlock.tagName.toLowerCase();

    if (tag === 'li') {
      const childBlock = effectiveBlock.querySelector(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
      return childBlock instanceof HTMLElement ? childBlock.tagName.toLowerCase() : 'p';
    }

    if (tag === 'div') return 'p';
    return tag;
  });

  return uniqueValue(values);
}

function getListType(blocks: HTMLElement[]): ToolbarSelectionState['listType'] {
  const values = blocks.map((block) => {
    const listItem = block.closest('li');
    if (!(listItem instanceof HTMLElement)) return null;

    if (listItem.getAttribute('data-type') === 'checklist-item') return 'checklist';
    const list = listItem.closest('ul,ol');
    if (!(list instanceof HTMLElement)) return null;
    if (list.getAttribute('data-type') === 'checklist') return 'checklist';
    return list.tagName === 'OL' ? 'ordered' : 'bullet';
  });

  return uniqueValue(values);
}

function getDirection(
  editorContent: HTMLElement,
  blocks: HTMLElement[],
): ToolbarSelectionState['direction'] {
  return uniqueValue(blocks.map((block) => {
    let element: HTMLElement | null = block;
    while (element && element !== editorContent && editorContent.contains(element)) {
      const dir = element.getAttribute('dir')?.toLowerCase();
      if (dir === 'rtl' || dir === 'ltr') return dir;
      element = element.parentElement;
    }

    const dir = block.getAttribute('dir')?.toLowerCase();
    return dir === 'rtl' || dir === 'ltr' ? dir : null;
  }));
}

function normalizeAlignment(value: string): ToolbarSelectionState['alignment'] {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'start') return 'left';
  if (normalized === 'end') return 'right';
  return normalized === 'left' || normalized === 'center' || normalized === 'right' || normalized === 'justify'
    ? normalized
    : null;
}

function getAlignment(blocks: HTMLElement[]): ToolbarSelectionState['alignment'] {
  return uniqueValue(blocks.map((block) => (
    normalizeAlignment(block.style.textAlign || window.getComputedStyle(block).textAlign)
  )));
}

export function getToolbarSelectionState(editorContent: HTMLElement | null): ToolbarSelectionState {
  if (!editorContent || typeof window === 'undefined') return EMPTY_STATE;

  const range = getSelectionRangeInEditor(editorContent);
  if (!range) return EMPTY_STATE;

  const blocks = getSelectedBlocks(editorContent, range);
  const collapsedBold = range.collapsed ? getCollapsedInlineCommandState('bold', editorContent, range) : null;
  const collapsedItalic = range.collapsed ? getCollapsedInlineCommandState('italic', editorContent, range) : null;
  const collapsedUnderline = range.collapsed ? getCollapsedInlineCommandState('underline', editorContent, range) : null;
  const collapsedStrikethrough = range.collapsed ? getCollapsedInlineCommandState('strikeThrough', editorContent, range) : null;

  return {
    bold: collapsedBold ?? isActiveAcrossSelection(editorContent, range, elementHasBold),
    italic: collapsedItalic ?? isActiveAcrossSelection(editorContent, range, elementHasItalic),
    underline: collapsedUnderline ?? isActiveAcrossSelection(editorContent, range, elementHasUnderline),
    strikethrough: collapsedStrikethrough ?? isActiveAcrossSelection(editorContent, range, elementHasStrikethrough),
    link: isActiveAcrossSelection(editorContent, range, (element) => element.matches('a[href]')),
    code: isActiveAcrossSelection(editorContent, range, (element) => element.matches('code')),
    blockType: blocks.length > 0 ? getBlockType(blocks) : null,
    listType: blocks.length > 0 ? getListType(blocks) : null,
    direction: blocks.length > 0 ? getDirection(editorContent, blocks) : null,
    alignment: blocks.length > 0 ? getAlignment(blocks) : null,
  };
}

export function isToolbarCommandActive(command: string, state: ToolbarSelectionState): boolean {
  switch (command) {
    case 'toggleBold':
      return state.bold;
    case 'toggleItalic':
      return state.italic;
    case 'toggleUnderline':
      return state.underline;
    case 'toggleStrikethrough':
      return state.strikethrough;
    case 'openLinkDialog':
    case 'removeLink':
      return state.link;
    case 'toggleCode':
      return state.code;
    case 'toggleBulletList':
      return state.listType === 'bullet';
    case 'toggleOrderedList':
      return state.listType === 'ordered';
    case 'toggleChecklist':
      return state.listType === 'checklist';
    case 'toggleBlockquote':
      return state.blockType === 'blockquote';
    case 'setDirectionLTR':
      return state.direction === 'ltr';
    case 'setDirectionRTL':
      return state.direction === 'rtl';
    case 'setTextAlignment':
      return Boolean(state.alignment && state.alignment !== 'left');
    default:
      return false;
  }
}
