/**
 * Turn a run's draft into ai-review suggestions: every touched block becomes
 * a review target, deletions propose an empty block, and inserted blocks go
 * in as empty placeholders that the suggestion fills (and that disappear
 * again when rejected). One review per run, with Accept all / Reject all.
 */
import { buildTextMap, createDomReview, type DomReview, type ReviewEndInfo, type ReviewLabels } from '@editora/ai-review';
import type { DraftBlock } from '../core/draft.js';
import { blockText, type EditorSnapshot } from './document.js';

/** Root attributes ai-review copies onto its marks as data-provenance-model / -provider. */
const MODEL_ATTR = 'data-air-model';
const PROVIDER_ATTR = 'data-air-provider';
const PLACEHOLDER_ATTR = 'data-agent-new';

export interface CommitOptions {
  /** "suggest" (default) shows the edits for review; "apply" accepts them at once. */
  mode?: 'suggest' | 'apply';
  /** Model and provider recorded on the suggestions (for @editora/authorship). */
  model?: string;
  provider?: string;
  labels?: Partial<ReviewLabels>;
  barHost?: { parent: Node; before: Node | null };
  /** Called when every suggestion is decided (or the review is discarded). `beforeHTML` is the content before the run. */
  onEnd?: (info: ReviewEndInfo) => void;
}

export interface CommitResult {
  review: DomReview | null;
  /** Suggestions shown. */
  count: number;
  /** Ids whose block changed in the page while the agent worked; their edits were dropped. */
  conflicts: string[];
}

function newElement(doc: Document, block: DraftBlock, anchor: Element | null): { element: HTMLElement; host: HTMLElement } {
  if (block.type === 'heading') {
    const element = doc.createElement(`h${block.level ?? 2}`);
    return { element, host: element };
  }
  if (block.type === 'list-item') {
    const item = doc.createElement('li');
    if (anchor?.tagName === 'LI') return { element: item, host: item };
    const list = doc.createElement('ul');
    list.appendChild(item);
    return { element: item, host: list };
  }
  if (block.type === 'quote') {
    const element = doc.createElement('blockquote');
    return { element, host: element };
  }
  const element = doc.createElement('p');
  return { element, host: element };
}

/** The element a new block goes after: a whole list when the anchor is a list item but the new block is not one. */
function placeAfter(anchor: Element, host: HTMLElement, isListItem: boolean): void {
  let ref: Element = anchor;
  if (!isListItem && anchor.tagName === 'LI') ref = anchor.closest('ul,ol') ?? anchor;
  ref.parentNode!.insertBefore(host, ref.nextSibling);
}

export function commitDraft(root: HTMLElement, snapshot: EditorSnapshot, options: CommitOptions = {}): CommitResult {
  const doc = root.ownerDocument;
  const beforeHTML = root.innerHTML;
  const entries = snapshot.draft.entries();
  const conflicts: string[] = [];
  const targets: Array<{ block: HTMLElement; start: number; end: number }> = [];
  const proposals: string[] = [];
  const placeholders: HTMLElement[] = [];
  const hosts: HTMLElement[] = [];

  // A block the user changed while the agent worked keeps the user's text.
  const usable = (block: DraftBlock): HTMLElement | null => {
    const element = snapshot.elements.get(block.id);
    if (!element || !element.isConnected || blockText(element) !== block.original) {
      conflicts.push(block.id);
      return null;
    }
    return element;
  };

  let cursor: Element | null = null; // last block placed, for inserts
  let lastNewList: HTMLElement | null = null;
  for (const block of entries) {
    if (block.original !== undefined) {
      const changed = block.deleted || block.text !== block.original;
      const element = changed ? usable(block) : snapshot.elements.get(block.id) ?? null;
      if (element) cursor = element;
      lastNewList = null;
      if (!changed || !element) continue;
      targets.push({ block: element, start: 0, end: buildTextMap(element).text.length });
      proposals.push(block.deleted ? '' : block.text);
      continue;
    }
    // Inserted block.
    let element: HTMLElement;
    if (block.type === 'list-item' && lastNewList) {
      element = doc.createElement('li');
      lastNewList.appendChild(element);
    } else {
      const made = newElement(doc, block, cursor);
      element = made.element;
      if (cursor) placeAfter(cursor, made.host, block.type === 'list-item');
      else root.insertBefore(made.host, root.firstChild);
      lastNewList = made.host !== element ? made.host : null;
      hosts.push(made.host);
    }
    element.setAttribute(PLACEHOLDER_ATTR, '');
    placeholders.push(element);
    cursor = element;
    targets.push({ block: element, start: 0, end: 0 });
    proposals.push(block.text);
  }

  if (!targets.length) return { review: null, count: 0, conflicts };

  if (options.model) root.setAttribute(MODEL_ATTR, options.model);
  if (options.provider) root.setAttribute(PROVIDER_ATTR, options.provider);

  const cleanUp = () => {
    for (const element of placeholders) {
      element.removeAttribute(PLACEHOLDER_ATTR);
      if (!element.isConnected) continue;
      if (!element.textContent?.trim()) element.remove();
    }
    for (const host of hosts) if (host.isConnected && !host.textContent?.trim()) host.remove();
  };

  const review = createDomReview({
    root,
    targets,
    labels: options.labels,
    barHost: options.barHost,
    onEnd: (info) => {
      cleanUp();
      options.onEnd?.({ ...info, beforeHTML, afterHTML: root.innerHTML });
    },
  });
  review.review.finish(proposals);
  const count = review.review.hunks.length;
  if (count === 0) {
    review.discard();
    return { review: null, count: 0, conflicts };
  }
  if (options.mode === 'apply') review.acceptAll();
  return { review, count, conflicts };
}
