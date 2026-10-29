import { AIReview, type ReviewHunk, type ReviewSnapshot } from '../core/review';
import { applyHunk, DEL_CLASS, HUNK_ATTR, isStale, markBlockReplacement, markInlineHunks, marksFor, NEW_BLOCK_ATTR, revertHunk } from './marks';
import { applyTheme, ensureStyles, ICONS } from './styles';
import { targetText, type ReviewTarget } from './text';

export interface ReviewLabels {
  region: string;
  writing: string;
  noChanges: string;
  suggestions: (count: number) => string;
  restructuring: string;
  stale: string;
  stop: string;
  previous: string;
  next: string;
  acceptAll: string;
  rejectAll: string;
  accept: string;
  reject: string;
  close: string;
  suggestion: string;
}

export const DEFAULT_REVIEW_LABELS: ReviewLabels = {
  region: 'AI suggestions',
  writing: 'Writing suggestions…',
  noChanges: 'No changes suggested.',
  suggestions: (count) => (count === 1 ? '1 suggestion to review' : `${count} suggestions to review`),
  restructuring: 'Writing a restructured version…',
  stale: 'This text was edited after the suggestion was made, so it can only be dismissed.',
  stop: 'Stop',
  previous: 'Previous suggestion',
  next: 'Next suggestion',
  acceptAll: 'Accept all',
  rejectAll: 'Reject all',
  accept: 'Accept suggestion',
  reject: 'Reject suggestion',
  close: 'Close',
  suggestion: 'Suggestion',
};

export interface ReviewEndInfo {
  beforeHTML: string;
  afterHTML: string;
  accepted: number;
  rejected: number;
  /** Ended by Stop, an error or `discard()` rather than by deciding every suggestion. */
  cancelled: boolean;
}

export interface DomReviewOptions {
  root: HTMLElement;
  targets: ReviewTarget[];
  /** Where the review bar goes; by default it is inserted right before `root`. */
  barHost?: { parent: Node; before: Node | null };
  labels?: Partial<ReviewLabels>;
  /** The user pressed Stop while the model was writing. */
  onStop?: () => void;
  onEnd?: (info: ReviewEndInfo) => void;
}

export interface DomReview {
  readonly review: AIReview;
  readonly ended: boolean;
  /** Show an error and restore the original text; `action` adds a button to the message (e.g. open the model settings). */
  fail(message: string, action?: { label: string; run: () => void }): void;
  accept(id: string): boolean;
  reject(id: string): boolean;
  acceptAll(): void;
  rejectAll(): void;
  /** Reject everything and end, also while streaming. */
  discard(): void;
  focusNext(direction?: 1 | -1): void;
}

/** Show `review`'s hunks as inline suggestions inside the contenteditable `root`. */
export function createDomReview(options: DomReviewOptions): DomReview {
  ensureStyles(options.root.ownerDocument);
  const labels = { ...DEFAULT_REVIEW_LABELS, ...options.labels };
  const { root, targets } = options;
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;

  const review = new AIReview(targets.map(targetText));
  const beforeHTML = root.innerHTML;
  const snapshots = targets.map((target) => target.block.innerHTML);
  let finalRendered = false;
  let ended = false;
  let failed = false;
  let activeId: string | null = null;
  let accepted = 0;
  let rejected = 0;
  let message: string | null = null;

  // ---- review bar ------------------------------------------------------
  const bar = doc.createElement('div');
  bar.className = 'air-ui air-bar';
  bar.setAttribute('data-air-ui', '');
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', labels.region);
  bar.contentEditable = 'false';

  const status = doc.createElement('div');
  status.className = 'air-status';
  const statusIcon = doc.createElement('span');
  statusIcon.className = 'air-status-icon';
  const statusText = doc.createElement('span');
  statusText.setAttribute('role', 'status');
  status.append(statusIcon, statusText);

  const button = (label: string, icon: string | null, onClick: () => void, extra = '', iconOnly = false) => {
    const element = doc.createElement('button');
    element.type = 'button';
    element.className = `air-btn ${extra}`.trim();
    element.innerHTML = `${icon ?? ''}${iconOnly ? `<span class="air-sr">${label}</span>` : `<span>${label}</span>`}`;
    if (iconOnly) {
      element.classList.add('air-btn-icon');
      element.title = label;
    }
    // Keep the editor's selection: the buttons act on it.
    element.addEventListener('mousedown', (event) => event.preventDefault());
    element.addEventListener('click', onClick);
    return element;
  };

  const stopButton = button(labels.stop, ICONS.stop, () => options.onStop?.());
  const prevButton = button(labels.previous, ICONS.up, () => focusNext(-1), '', true);
  const nextButton = button(labels.next, ICONS.down, () => focusNext(1), '', true);
  const rejectAllButton = button(labels.rejectAll, ICONS.close, () => rejectAll(), 'air-btn-reject');
  const acceptAllButton = button(labels.acceptAll, ICONS.check, () => acceptAll(), 'air-btn-primary');
  const closeButton = button(labels.close, ICONS.close, () => end(true), '', true);
  bar.append(status, stopButton, prevButton, nextButton, rejectAllButton, acceptAllButton, closeButton);

  const host = options.barHost ?? { parent: root.parentNode!, before: root };
  host.parent.insertBefore(bar, host.before);

  // ---- per-suggestion popover -------------------------------------------
  const pop = doc.createElement('div');
  pop.className = 'air-ui air-pop';
  pop.setAttribute('data-air-ui', '');
  pop.setAttribute('role', 'toolbar');
  pop.setAttribute('aria-label', labels.suggestion);
  pop.hidden = true;
  const popAccept = button(labels.accept, ICONS.check, () => activeId && accept(activeId), 'air-btn-accept', true);
  const popReject = button(labels.reject, ICONS.close, () => activeId && reject(activeId), 'air-btn-reject', true);
  pop.append(popAccept, popReject);
  applyTheme(pop, root);
  doc.body.appendChild(pop);

  // ---- rendering ---------------------------------------------------------
  const pendingHunks = () => review.hunks.filter((hunk) => hunk.status === 'pending' && !hunk.provisional);

  const orderedPendingIds = () => {
    const pending = new Set(pendingHunks().map((hunk) => hunk.id));
    const ids: string[] = [];
    root.querySelectorAll<HTMLElement>(`[${HUNK_ATTR}]`).forEach((mark) => {
      const id = mark.getAttribute(HUNK_ATTR)!;
      if (pending.has(id) && !ids.includes(id)) ids.push(id);
    });
    return ids;
  };

  const renderMarks = (snapshot: ReviewSnapshot) => {
    root.querySelectorAll(`[${NEW_BLOCK_ATTR}]`).forEach((block) => block.remove());
    targets.forEach((target, index) => {
      target.block.innerHTML = snapshots[index];
    });

    const replacement = snapshot.hunks.find((hunk) => hunk.kind === 'blocks');
    if (replacement) {
      markBlockReplacement(targets, replacement);
      return;
    }
    targets.forEach((target, index) => {
      const hunks = snapshot.hunks.filter((hunk) => hunk.block === index);
      if (hunks.length > 0) markInlineHunks(target, hunks);
    });
  };

  const setActiveBlocks = (on: boolean) => {
    targets.forEach((target) => target.block.toggleAttribute('data-air-active-block', on));
    root.toggleAttribute('data-air-streaming', on);
  };

  const updateBar = (snapshot: ReviewSnapshot) => {
    const pending = pendingHunks().length;
    let state = 'review';
    statusIcon.innerHTML = ICONS.sparkle;
    if (failed) {
      state = 'error';
      statusIcon.innerHTML = ICONS.alert;
      statusText.textContent = message ?? '';
    } else if (snapshot.streaming) {
      state = 'streaming';
      statusText.textContent = snapshot.structureChanged ? labels.restructuring : labels.writing;
    } else if (message) {
      statusText.textContent = message;
    } else {
      statusText.textContent = pending === 0 ? labels.noChanges : labels.suggestions(pending);
    }
    bar.dataset.state = state;
    stopButton.hidden = !snapshot.streaming || failed;
    const reviewing = !snapshot.streaming && !failed && pending > 0;
    prevButton.hidden = nextButton.hidden = !reviewing || pending < 2;
    acceptAllButton.hidden = rejectAllButton.hidden = !reviewing;
    closeButton.hidden = !failed;
  };

  const positionPop = () => {
    if (!activeId) {
      pop.hidden = true;
      return;
    }
    const marks = marksFor(root, activeId);
    const last = marks[marks.length - 1];
    if (!last) {
      pop.hidden = true;
      return;
    }
    const rects = last.getClientRects();
    const rect = rects[rects.length - 1] ?? last.getBoundingClientRect();
    pop.hidden = false;
    const width = pop.offsetWidth || 72;
    const left = Math.max(8, Math.min(rect.right - width, view.innerWidth - width - 8));
    pop.style.left = `${left + view.scrollX}px`;
    pop.style.top = `${rect.bottom + view.scrollY + 6}px`;
  };

  const setActive = (id: string | null, scroll = false) => {
    root.querySelectorAll('.air-active').forEach((mark) => mark.classList.remove('air-active'));
    activeId = id && pendingHunks().some((hunk) => hunk.id === id) ? id : null;
    if (activeId) {
      const marks = marksFor(root, activeId);
      marks.forEach((mark) => mark.classList.add('air-active'));
      if (scroll) marks[0]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    positionPop();
  };

  const onReviewChange = (snapshot: ReviewSnapshot) => {
    if (ended) return;
    if (snapshot.streaming || !finalRendered) {
      renderMarks(snapshot);
      if (!snapshot.streaming) {
        finalRendered = true;
        setActiveBlocks(false);
        lockInput(false);
      }
    }
    updateBar(snapshot);
    if (!snapshot.streaming && pendingHunks().length === 0) {
      if (snapshot.hunks.length > 0) {
        end(false);
      } else {
        // Leave "No changes suggested" readable for a moment.
        message = labels.noChanges;
        updateBar(snapshot);
        view.setTimeout(() => end(false), 1600);
      }
    }
  };

  // ---- decisions ----------------------------------------------------------
  const hunkById = (id: string): ReviewHunk | undefined => review.hunks.find((hunk) => hunk.id === id);

  const afterDecision = (id: string) => {
    const ids = orderedPendingIds();
    const next = ids.find((candidate) => candidate !== id) ?? null;
    setActive(next);
  };

  function accept(id: string): boolean {
    const hunk = hunkById(id);
    if (!hunk || hunk.status !== 'pending' || hunk.provisional || ended) return false;
    if (isStale(root, hunk)) {
      marksFor(root, id).forEach((mark) => mark.classList.add('air-stale'));
      message = labels.stale;
      updateBar(review.snapshot());
      return false;
    }
    message = null;
    applyHunk(root, id);
    accepted += 1;
    review.accept(id);
    afterDecision(id);
    return true;
  }

  function reject(id: string): boolean {
    const hunk = hunkById(id);
    if (!hunk || hunk.status !== 'pending' || hunk.provisional || ended) return false;
    message = null;
    revertHunk(root, hunk, isStale(root, hunk));
    rejected += 1;
    review.reject(id);
    afterDecision(id);
    return true;
  }

  function acceptAll(): void {
    const ids = orderedPendingIds();
    // Stale ones stay for the user to dismiss; accept() reports them.
    ids.forEach((id) => {
      const hunk = hunkById(id);
      if (hunk && !isStale(root, hunk)) accept(id);
    });
    if (pendingHunks().length > 0) {
      message = labels.stale;
      updateBar(review.snapshot());
    }
  }

  function rejectAll(): void {
    orderedPendingIds().forEach((id) => reject(id));
  }

  function focusNext(direction: 1 | -1 = 1): void {
    const ids = orderedPendingIds();
    if (ids.length === 0) return;
    const index = activeId ? ids.indexOf(activeId) : -1;
    const next = ids[(index + direction + ids.length) % ids.length] ?? ids[0];
    setActive(next, true);
  }

  function restoreOriginal(): void {
    root.querySelectorAll(`[${NEW_BLOCK_ATTR}]`).forEach((block) => block.remove());
    targets.forEach((target, index) => {
      if (target.block.isConnected) target.block.innerHTML = snapshots[index];
    });
  }

  function discard(): void {
    if (ended) return;
    if (review.isStreaming || !finalRendered) restoreOriginal();
    else orderedPendingIds().forEach((id) => {
      const hunk = hunkById(id);
      if (hunk) revertHunk(root, hunk, isStale(root, hunk));
    });
    end(true);
  }

  function fail(text: string, action?: { label: string; run: () => void }): void {
    if (ended) return;
    failed = true;
    message = text;
    restoreOriginal();
    setActiveBlocks(false);
    lockInput(false);
    setActive(null);
    updateBar(review.snapshot());
    if (action) {
      const actionButton = button(action.label, null, () => {
        end(true);
        action.run();
      });
      bar.insertBefore(actionButton, closeButton);
      actionButton.focus();
    } else {
      closeButton.focus();
    }
  }

  // ---- events ----------------------------------------------------------------
  const blockEdit = (event: Event) => {
    if (review.isStreaming && !failed) event.preventDefault();
  };
  let locked = false;
  function lockInput(on: boolean) {
    if (on === locked) return;
    locked = on;
    const method = on ? 'addEventListener' : 'removeEventListener';
    for (const type of ['beforeinput', 'paste', 'drop', 'cut']) root[method](type, blockEdit, true);
  }

  const onClick = (event: MouseEvent) => {
    const mark = (event.target as Element | null)?.closest?.(`[${HUNK_ATTR}]`);
    if (mark && root.contains(mark)) setActive(mark.getAttribute(HUNK_ATTR));
  };

  const onSelectionChange = () => {
    const selection = doc.getSelection();
    const node = selection?.anchorNode;
    if (!node || !root.contains(node)) return;
    const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
    const mark = element?.closest(`[${HUNK_ATTR}]`);
    if (mark) setActive(mark.getAttribute(HUNK_ATTR));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (ended) return;
    if (event.key === 'Escape') {
      if (review.isStreaming && !failed) {
        event.preventDefault();
        options.onStop?.();
      } else if (activeId) {
        event.preventDefault();
        setActive(null);
      }
      return;
    }
    if (!event.altKey || review.isStreaming) return;
    if (event.key === 'Enter' || event.key === 'Backspace') {
      const id = activeId ?? orderedPendingIds()[0];
      if (!id) return;
      event.preventDefault();
      if (event.key === 'Enter') accept(id);
      else reject(id);
    } else if (event.code === 'BracketRight' || event.code === 'BracketLeft') {
      event.preventDefault();
      focusNext(event.code === 'BracketRight' ? 1 : -1);
    }
  };

  const onViewportChange = () => positionPop();

  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKeyDown);
  bar.addEventListener('keydown', onKeyDown);
  pop.addEventListener('keydown', onKeyDown);
  doc.addEventListener('selectionchange', onSelectionChange);
  view.addEventListener('scroll', onViewportChange, true);
  view.addEventListener('resize', onViewportChange);

  function end(cancelled: boolean): void {
    if (ended) return;
    ended = true;
    lockInput(false);
    setActiveBlocks(false);
    root.querySelectorAll(`.${DEL_CLASS}, [${HUNK_ATTR}]`).forEach((mark) => mark.classList.remove('air-active', 'air-stale'));
    root.removeEventListener('click', onClick);
    root.removeEventListener('keydown', onKeyDown);
    doc.removeEventListener('selectionchange', onSelectionChange);
    view.removeEventListener('scroll', onViewportChange, true);
    view.removeEventListener('resize', onViewportChange);
    unsubscribe();
    bar.remove();
    pop.remove();
    root.normalize();
    options.onEnd?.({
      beforeHTML,
      afterHTML: root.innerHTML,
      accepted,
      rejected,
      cancelled: cancelled || failed,
    });
  }

  const unsubscribe = review.subscribe(onReviewChange);
  setActiveBlocks(true);
  lockInput(true);
  updateBar(review.snapshot());

  return {
    review,
    get ended() {
      return ended;
    },
    fail,
    accept,
    reject,
    acceptAll,
    rejectAll,
    discard,
    focusNext,
  };
}
