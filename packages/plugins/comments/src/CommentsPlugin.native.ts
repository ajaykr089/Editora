import { Plugin } from '@editora/core';

interface CommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Comment {
  id: string;
  anchorId: string;
  selectedText: string;
  author: string;
  text: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  replies: CommentReply[];
}

interface CommentsEditorState {
  root: HTMLElement;
  comments: Map<string, Comment>;
  panelVisible: boolean;
  panelElement: HTMLElement | null;
  expandedComments: Set<string>;
  replyTexts: Record<string, string>;
  savedSelection: Range | null;
  newCommentText: string;
  selectionChangeListener: (() => void) | null;
}

const stateByEditor = new WeakMap<HTMLElement, CommentsEditorState>();

let activeEditorRoot: HTMLElement | null = null;
let globalTrackingInitialized = false;
let idSeed = 0;
const COMMENT_AUTHOR = 'User';

function nextId(prefix: string): string {
  idSeed += 1;
  return `${prefix}-${Date.now()}-${idSeed}`;
}

function getEditorRootFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  const element = node instanceof Element ? node : node.parentElement;
  if (!element) return null;
  return (
    (element.closest('[data-editora-editor]') as HTMLElement | null) ||
    (element.closest('.rte-editor') as HTMLElement | null) ||
    (element.closest('.editora-editor') as HTMLElement | null)
  );
}

function isRangeInsideEditor(range: Range, root: HTMLElement): boolean {
  return root.contains(range.commonAncestorContainer);
}

function getCurrentEditorRoot(): HTMLElement | null {
  if (typeof window !== 'undefined') {
    const explicitContext = (window as any).__editoraCommandEditorRoot as HTMLElement | null | undefined;
    if (explicitContext instanceof HTMLElement) {
      const explicitRoot =
        (explicitContext.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor') as HTMLElement | null) ||
        (explicitContext.matches('[data-editora-editor], .rte-editor, .editora-editor, editora-editor')
          ? explicitContext
          : null);
      if (explicitRoot) {
        activeEditorRoot = explicitRoot;
        (window as any).__editoraCommandEditorRoot = null;
        return explicitRoot;
      }
    }
  }

  const activeElement = document.activeElement;
  const activeFromFocus = activeElement
    ? getEditorRootFromNode(activeElement as unknown as Node)
    : null;
  if (activeFromFocus) return activeFromFocus;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const fromSelection = getEditorRootFromNode(
      selection.getRangeAt(0).commonAncestorContainer,
    );
    if (fromSelection) return fromSelection;
  }

  return activeEditorRoot;
}

function getOrCreateState(root: HTMLElement): CommentsEditorState {
  const existing = stateByEditor.get(root);
  if (existing) return existing;

  const state: CommentsEditorState = {
    root,
    comments: new Map<string, Comment>(),
    panelVisible: false,
    panelElement: null,
    expandedComments: new Set<string>(),
    replyTexts: {},
    savedSelection: null,
    newCommentText: '',
    selectionChangeListener: null,
  };

  stateByEditor.set(root, state);
  return state;
}

function getActiveState(): CommentsEditorState | null {
  const root = getCurrentEditorRoot();
  if (!root) return null;
  activeEditorRoot = root;
  return getOrCreateState(root);
}

function cloneActiveSelection(root: HTMLElement): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  if (!isRangeInsideEditor(range, root)) return null;

  return range.cloneRange();
}

function updateAnchorVisualState(state: CommentsEditorState, comment: Comment): void {
  if (!comment.anchorId) return;
  const anchor = state.root.querySelector(`#${comment.anchorId}`) as HTMLElement | null;
  if (!anchor) return;

  anchor.classList.toggle('rte-comment-anchor-resolved', comment.resolved);
}

function highlightAnchor(state: CommentsEditorState, commentId: string, highlight: boolean): void {
  const comment = state.comments.get(commentId);
  if (!comment || !comment.anchorId) return;

  const anchor = state.root.querySelector(`#${comment.anchorId}`) as HTMLElement | null;
  if (!anchor) return;
  anchor.classList.toggle('highlighted', highlight);
}

function bindAnchorInteraction(
  state: CommentsEditorState,
  anchor: HTMLElement,
  commentId: string,
): void {
  anchor.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    activeEditorRoot = state.root;
    state.expandedComments.add(commentId);
    setPanelVisibility(state, true);
    refreshCommentsPanel(state);
  };
}

function unwrapNode(node: HTMLElement): void {
  const parent = node.parentNode;
  if (!parent) return;
  while (node.firstChild) {
    parent.insertBefore(node.firstChild, node);
  }
  node.remove();
}

function setPanelVisibility(state: CommentsEditorState, visible: boolean): void {
  ensurePanelStyles();
  ensurePanel(state);

  state.panelVisible = visible;
  state.root.setAttribute('data-rte-comments-open', visible ? 'true' : 'false');

  if (state.panelElement) {
    state.panelElement.classList.toggle('is-open', visible);
    state.panelElement.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  if (visible) {
    startSelectionTracking(state);
  } else {
    stopSelectionTracking(state);
  }
}

function ensurePanel(state: CommentsEditorState): void {
  if (state.panelElement) return;

  const panel = document.createElement('aside');
  panel.className = 'rte-comments-panel';
  panel.setAttribute('role', 'complementary');
  panel.setAttribute('aria-label', 'Comments');
  panel.setAttribute('aria-hidden', 'true');

  const computed = window.getComputedStyle(state.root);
  if (computed.position === 'static') {
    state.root.style.position = 'relative';
  }

  state.root.appendChild(panel);
  state.panelElement = panel;
}

function startSelectionTracking(state: CommentsEditorState): void {
  if (state.selectionChangeListener) return;

  state.selectionChangeListener = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!isRangeInsideEditor(range, state.root)) return;
    state.savedSelection = range.cloneRange();
    activeEditorRoot = state.root;
  };

  document.addEventListener('selectionchange', state.selectionChangeListener);
}

function stopSelectionTracking(state: CommentsEditorState): void {
  if (!state.selectionChangeListener) return;
  document.removeEventListener('selectionchange', state.selectionChangeListener);
  state.selectionChangeListener = null;
}

function getCommentsInDisplayOrder(state: CommentsEditorState): Comment[] {
  return Array.from(state.comments.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString();
}

function createCommentCard(state: CommentsEditorState, comment: Comment): HTMLElement {
  const isExpanded = state.expandedComments.has(comment.id);
  const card = document.createElement('article');
  card.className = `rte-comment-item${comment.resolved ? ' resolved' : ''}`;

  card.innerHTML = `
    <header class="rte-comment-header">
      <div class="rte-comment-meta">
        <strong class="rte-comment-author">${comment.author}</strong>
        <time class="rte-comment-date">${formatDate(comment.createdAt)}</time>
      </div>
      <button class="rte-comment-expand" type="button" aria-label="Toggle details">
        ${isExpanded ? '▾' : '▸'}
      </button>
    </header>
    <div class="rte-comment-text"></div>
    ${
      comment.selectedText
        ? `<blockquote class="rte-comment-selection">${comment.selectedText}</blockquote>`
        : ''
    }
    <section class="rte-comment-expanded${isExpanded ? ' show' : ''}"></section>
  `;

  const textEl = card.querySelector('.rte-comment-text');
  if (textEl) textEl.textContent = comment.text;

  const expandBtn = card.querySelector('.rte-comment-expand') as HTMLButtonElement | null;
  expandBtn?.addEventListener('click', () => {
    if (state.expandedComments.has(comment.id)) {
      state.expandedComments.delete(comment.id);
    } else {
      state.expandedComments.add(comment.id);
    }
    refreshCommentsPanel(state);
  });

  const expanded = card.querySelector('.rte-comment-expanded') as HTMLElement | null;
  if (expanded && isExpanded) {
    if (comment.replies.length > 0) {
      const replies = document.createElement('div');
      replies.className = 'rte-comment-replies';

      comment.replies.forEach((reply) => {
        const replyEl = document.createElement('div');
        replyEl.className = 'rte-comment-reply';
        replyEl.innerHTML = `
          <div class="rte-comment-reply-header">
            <strong>${reply.author}</strong>
            <time>${formatDate(reply.createdAt)}</time>
          </div>
          <div class="rte-comment-reply-text"></div>
        `;
        const replyTextEl = replyEl.querySelector('.rte-comment-reply-text');
        if (replyTextEl) replyTextEl.textContent = reply.text;
        replies.appendChild(replyEl);
      });

      expanded.appendChild(replies);
    }

    if (!comment.resolved) {
      const replyComposer = document.createElement('div');
      replyComposer.className = 'rte-comment-reply-composer';
      replyComposer.innerHTML = `
        <textarea class="rte-comment-reply-textarea" rows="2" placeholder="Reply..."></textarea>
        <button type="button" class="rte-comment-btn primary">Reply</button>
      `;
      const replyTextarea = replyComposer.querySelector(
        '.rte-comment-reply-textarea',
      ) as HTMLTextAreaElement | null;
      const replyBtn = replyComposer.querySelector(
        '.rte-comment-btn.primary',
      ) as HTMLButtonElement | null;

      if (replyTextarea && replyBtn) {
        replyTextarea.value = state.replyTexts[comment.id] || '';
        const updateReplyButtonState = () => {
          const canReply = !!replyTextarea.value.trim();
          replyBtn.disabled = !canReply;
        };
        updateReplyButtonState();

        replyTextarea.addEventListener('input', () => {
          state.replyTexts[comment.id] = replyTextarea.value;
          updateReplyButtonState();
        });

        replyBtn.addEventListener('click', () => {
          const replyText = replyTextarea.value.trim();
          if (!replyText) return;
          replyToComment(comment.id, COMMENT_AUTHOR, replyText);
          state.replyTexts[comment.id] = '';
          refreshCommentsPanel(state);
        });
      }

      expanded.appendChild(replyComposer);
    }

    const actions = document.createElement('div');
    actions.className = 'rte-comment-actions';

    if (comment.anchorId) {
      const jumpBtn = document.createElement('button');
      jumpBtn.type = 'button';
      jumpBtn.className = 'rte-comment-btn ghost';
      jumpBtn.textContent = 'Jump to text';
      jumpBtn.onclick = () => {
        const anchor = state.root.querySelector(`#${comment.anchorId}`) as HTMLElement | null;
        if (!anchor) return;
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        highlightAnchor(state, comment.id, true);
        window.setTimeout(() => highlightAnchor(state, comment.id, false), 1200);
      };
      actions.appendChild(jumpBtn);
    }

    if (!comment.resolved) {
      const resolveBtn = document.createElement('button');
      resolveBtn.type = 'button';
      resolveBtn.className = 'rte-comment-btn success';
      resolveBtn.textContent = 'Resolve';
      resolveBtn.onclick = () => resolveComment(comment.id, COMMENT_AUTHOR);
      actions.appendChild(resolveBtn);
    } else {
      const reopenBtn = document.createElement('button');
      reopenBtn.type = 'button';
      reopenBtn.className = 'rte-comment-btn ghost';
      reopenBtn.textContent = 'Reopen';
      reopenBtn.onclick = () => reopenComment(comment.id);
      actions.appendChild(reopenBtn);
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'rte-comment-btn danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteComment(comment.id);
    actions.appendChild(deleteBtn);

    expanded.appendChild(actions);
  }

  card.addEventListener('mouseenter', () => highlightAnchor(state, comment.id, true));
  card.addEventListener('mouseleave', () => highlightAnchor(state, comment.id, false));

  return card;
}

function refreshCommentsPanel(state?: CommentsEditorState): void {
  const targetState = state || getActiveState();
  if (!targetState?.panelElement) return;

  const comments = getCommentsInDisplayOrder(targetState);

  targetState.panelElement.innerHTML = `
    <div class="rte-comments-header">
      <div>
        <h3>Comments (${comments.length})</h3>
        <p>Select text and add comments, or add a general note.</p>
      </div>
      <button class="rte-comments-close" type="button" aria-label="Close comments panel">✕</button>
    </div>
    <div class="rte-comments-composer">
      <textarea class="new-comment-textarea" rows="3" placeholder="Add a comment..."></textarea>
      <div class="rte-comments-composer-actions">
        <button class="rte-comment-btn primary add-comment-btn" type="button">Add Comment</button>
      </div>
    </div>
    ${
      comments.length === 0
        ? '<div class="rte-comments-empty">No comments yet.</div>'
        : '<div class="rte-comments-list"></div>'
    }
  `;

  const closeBtn = targetState.panelElement.querySelector('.rte-comments-close');
  closeBtn?.addEventListener('click', () => {
    setPanelVisibility(targetState, false);
  });

  const textarea = targetState.panelElement.querySelector(
    '.new-comment-textarea',
  ) as HTMLTextAreaElement | null;
  const addBtn = targetState.panelElement.querySelector(
    '.add-comment-btn',
  ) as HTMLButtonElement | null;

  if (textarea && addBtn) {
    textarea.value = targetState.newCommentText;

    const syncAddButton = () => {
      const enabled = !!textarea.value.trim();
      addBtn.disabled = !enabled;
    };

    syncAddButton();

    textarea.addEventListener('input', () => {
      targetState.newCommentText = textarea.value;
      syncAddButton();
    });

    textarea.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        addBtn.click();
      }
    });

    addBtn.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) return;
      const hasSelection = !!targetState.savedSelection;
      addCommentCommand(COMMENT_AUTHOR, text, !hasSelection);
      targetState.newCommentText = '';
      refreshCommentsPanel(targetState);
    });
  }

  const list = targetState.panelElement.querySelector('.rte-comments-list');
  if (list) {
    comments.forEach((comment) => {
      list.appendChild(createCommentCard(targetState, comment));
    });
  }
}

function ensureGlobalTracking(): void {
  if (globalTrackingInitialized) return;
  globalTrackingInitialized = true;

  document.addEventListener('focusin', (event) => {
    const root = getEditorRootFromNode(event.target as Node);
    if (root) activeEditorRoot = root;
  });

  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const root = getEditorRootFromNode(range.commonAncestorContainer);
    if (!root) return;

    activeEditorRoot = root;
    const state = stateByEditor.get(root);
    if (!state || selection.isCollapsed) return;
    if (!isRangeInsideEditor(range, root)) return;
    state.savedSelection = range.cloneRange();
  });
}

/**
 * Get all comments for active editor.
 */
export function getAllComments(): Comment[] {
  const state = getActiveState();
  if (!state) return [];
  return getCommentsInDisplayOrder(state);
}

/**
 * Add comment (selection-based or general).
 */
export function addCommentCommand(author: string, text: string, general = false): string {
  const state = getActiveState();
  if (!state) return '';

  const trimmedText = text.trim();
  if (!trimmedText) return '';

  if (general) {
    const commentId = nextId('comment');
    state.comments.set(commentId, {
      id: commentId,
      anchorId: '',
      selectedText: '',
      author,
      text: trimmedText,
      createdAt: new Date().toISOString(),
      resolved: false,
      replies: [],
    });
    refreshCommentsPanel(state);
    return commentId;
  }

  const range = state.savedSelection || cloneActiveSelection(state.root);
  if (!range || !isRangeInsideEditor(range, state.root)) return '';

  const selectedText = range.toString().trim();
  if (!selectedText) return '';

  const commentId = nextId('comment');
  const anchorId = nextId('comment-anchor');
  const anchor = document.createElement('span');
  anchor.id = anchorId;
  anchor.className = 'rte-comment-anchor';
  anchor.setAttribute('data-comment-id', commentId);
  anchor.setAttribute('title', 'Commented text');

  try {
    const editableRange = range.cloneRange();
    const fragment = editableRange.extractContents();
    if (!fragment.textContent?.trim()) return '';
    anchor.appendChild(fragment);
    editableRange.insertNode(anchor);
  } catch {
    return '';
  }

  bindAnchorInteraction(state, anchor, commentId);

  state.comments.set(commentId, {
    id: commentId,
    anchorId,
    selectedText,
    author,
    text: trimmedText,
    createdAt: new Date().toISOString(),
    resolved: false,
    replies: [],
  });

  state.savedSelection = null;
  const selection = window.getSelection();
  selection?.removeAllRanges();

  refreshCommentsPanel(state);
  return commentId;
}

export function resolveComment(commentId: string, author: string): void {
  const state = getActiveState();
  if (!state) return;

  const comment = state.comments.get(commentId);
  if (!comment) return;

  comment.resolved = true;
  comment.resolvedBy = author;
  comment.resolvedAt = new Date().toISOString();
  updateAnchorVisualState(state, comment);
  refreshCommentsPanel(state);
}

export function reopenComment(commentId: string): void {
  const state = getActiveState();
  if (!state) return;

  const comment = state.comments.get(commentId);
  if (!comment) return;

  comment.resolved = false;
  comment.resolvedBy = undefined;
  comment.resolvedAt = undefined;
  updateAnchorVisualState(state, comment);
  refreshCommentsPanel(state);
}

export function deleteComment(commentId: string): void {
  const state = getActiveState();
  if (!state) return;

  const comment = state.comments.get(commentId);
  if (!comment) return;

  if (comment.anchorId) {
    const anchor = state.root.querySelector(`#${comment.anchorId}`) as HTMLElement | null;
    if (anchor) unwrapNode(anchor);
  }

  state.comments.delete(commentId);
  state.expandedComments.delete(commentId);
  delete state.replyTexts[commentId];
  refreshCommentsPanel(state);
}

export function replyToComment(commentId: string, author: string, text: string): void {
  const state = getActiveState();
  if (!state) return;

  const comment = state.comments.get(commentId);
  if (!comment) return;

  const replyText = text.trim();
  if (!replyText) return;

  comment.replies.push({
    id: nextId('reply'),
    author,
    text: replyText,
    createdAt: new Date().toISOString(),
  });

  refreshCommentsPanel(state);
}

export function highlightComment(commentId: string, highlight: boolean): void {
  const state = getActiveState();
  if (!state) return;
  highlightAnchor(state, commentId, highlight);
}

function ensurePanelStyles(): void {
  if (document.getElementById('rte-comments-panel-styles')) return;

  const style = document.createElement('style');
  style.id = 'rte-comments-panel-styles';
  style.textContent = `
    .rte-comments-panel {
      --rte-comments-panel-width: min(360px, 42vw);
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: var(--rte-comments-panel-width);
      display: flex;
      flex-direction: column;
      background: var(--rte-color-bg-primary, #ffffff);
      color: var(--rte-color-text-primary, #111827);
      border-left: 1px solid var(--rte-color-border, #d1d5db);
      box-shadow: -12px 0 28px rgba(15, 23, 42, 0.2);
      transform: translateX(100%);
      opacity: 0;
      pointer-events: none;
      transition: transform 180ms ease, opacity 180ms ease;
      z-index: 55;
    }

    .rte-comments-panel.is-open {
      transform: translateX(0);
      opacity: 1;
      pointer-events: auto;
    }

    [data-rte-comments-open="true"] :is(.rte-toolbar, .editora-toolbar, .rte-content, .editora-content, .editora-statusbar, .editora-statusbar-container) {
      margin-right: var(--rte-comments-panel-width);
      transition: margin-right 180ms ease;
    }

    .rte-comments-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 14px 12px;
      border-bottom: 1px solid var(--rte-color-border-light, #e5e7eb);
      background: var(--rte-color-bg-secondary, #f8fafc);
    }

    .rte-comments-header h3 {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
    }

    .rte-comments-header p {
      margin: 6px 0 0;
      font-size: 12px;
      color: var(--rte-color-text-muted, #64748b);
    }

    .rte-comments-close {
      border: 1px solid var(--rte-color-border, #d1d5db);
      background: transparent;
      color: var(--rte-color-text-secondary, #475569);
      border-radius: 6px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }

    .rte-comments-close:hover {
      background: var(--rte-color-bg-hover, #f1f5f9);
      color: var(--rte-color-text-primary, #0f172a);
    }

    .rte-comments-composer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid var(--rte-color-border-light, #e5e7eb);
      background: var(--rte-color-bg-secondary, #f8fafc);
    }

    .new-comment-textarea,
    .rte-comment-reply-textarea {
      width: 100%;
      resize: vertical;
      min-height: 62px;
      font-family: inherit;
      font-size: 13px;
      line-height: 1.35;
      border: 1px solid var(--rte-color-border, #d1d5db);
      border-radius: 8px;
      background: var(--rte-color-bg-primary, #ffffff);
      color: var(--rte-color-text-primary, #0f172a);
      padding: 8px 10px;
      outline: none;
    }

    .new-comment-textarea:focus,
    .rte-comment-reply-textarea:focus {
      border-color: var(--rte-color-border-focus, #2563eb);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--rte-color-border-focus, #2563eb) 20%, transparent);
    }

    .rte-comments-composer-actions {
      display: flex;
      justify-content: flex-end;
    }

    .rte-comments-list {
      flex: 1;
      overflow: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .rte-comments-empty {
      padding: 18px 14px;
      color: var(--rte-color-text-muted, #64748b);
      font-size: 13px;
    }

    .rte-comment-item {
      border: 1px solid var(--rte-color-border-light, #e5e7eb);
      border-radius: 10px;
      background: var(--rte-color-bg-primary, #ffffff);
      padding: 10px;
    }

    .rte-comment-item.resolved {
      opacity: 0.74;
    }

    .rte-comment-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .rte-comment-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .rte-comment-author {
      font-size: 13px;
      color: var(--rte-color-text-primary, #0f172a);
    }

    .rte-comment-date {
      font-size: 11px;
      color: var(--rte-color-text-muted, #64748b);
    }

    .rte-comment-expand {
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--rte-color-text-secondary, #475569);
      font-size: 16px;
      line-height: 1;
      padding: 0;
    }

    .rte-comment-text {
      margin-top: 8px;
      font-size: 13px;
      line-height: 1.45;
      color: var(--rte-color-text-primary, #0f172a);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .rte-comment-selection {
      margin: 8px 0 0;
      border-left: 3px solid var(--rte-color-primary, #2563eb);
      background: var(--rte-color-bg-secondary, #f8fafc);
      color: var(--rte-color-text-secondary, #475569);
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-style: italic;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .rte-comment-expanded {
      display: none;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--rte-color-border-light, #e5e7eb);
    }

    .rte-comment-expanded.show {
      display: block;
    }

    .rte-comment-replies {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }

    .rte-comment-reply {
      border: 1px solid var(--rte-color-border-light, #e5e7eb);
      border-radius: 8px;
      padding: 8px;
      background: var(--rte-color-bg-secondary, #f8fafc);
    }

    .rte-comment-reply-header {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;
      font-size: 11px;
      color: var(--rte-color-text-muted, #64748b);
    }

    .rte-comment-reply-text {
      font-size: 12px;
      color: var(--rte-color-text-secondary, #334155);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .rte-comment-reply-composer {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 10px;
    }

    .rte-comment-actions {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 6px;
    }

    .rte-comment-btn {
      border: 1px solid var(--rte-color-border, #d1d5db);
      border-radius: 7px;
      padding: 5px 9px;
      font-size: 12px;
      cursor: pointer;
      background: var(--rte-color-bg-primary, #ffffff);
      color: var(--rte-color-text-secondary, #334155);
    }

    .rte-comment-btn:hover {
      background: var(--rte-color-bg-hover, #f1f5f9);
      color: var(--rte-color-text-primary, #0f172a);
    }

    .rte-comment-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .rte-comment-btn.primary {
      border-color: var(--rte-color-primary, #2563eb);
      background: var(--rte-color-primary, #2563eb);
      color: var(--rte-color-text-inverse, #ffffff);
    }

    .rte-comment-btn.primary:hover {
      background: var(--rte-color-primary-hover, #1d4ed8);
      border-color: var(--rte-color-primary-hover, #1d4ed8);
      color: var(--rte-color-text-inverse, #ffffff);
    }

    .rte-comment-btn.success {
      border-color: color-mix(in srgb, var(--rte-color-success, #15803d) 60%, transparent);
      color: var(--rte-color-success, #15803d);
    }

    .rte-comment-btn.danger {
      border-color: color-mix(in srgb, var(--rte-color-danger, #b91c1c) 60%, transparent);
      color: var(--rte-color-danger, #b91c1c);
    }

    .rte-comment-anchor {
      background: rgba(250, 204, 21, 0.34);
      border-bottom: 2px solid rgba(217, 119, 6, 0.75);
      border-radius: 2px;
      cursor: pointer;
      transition: outline-color 120ms ease, box-shadow 120ms ease;
    }

    .rte-comment-anchor.rte-comment-anchor-resolved {
      background: rgba(148, 163, 184, 0.2);
      border-bottom-color: rgba(100, 116, 139, 0.6);
    }

    .rte-comment-anchor.highlighted {
      outline: 2px solid var(--rte-color-primary, #2563eb);
      outline-offset: 2px;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-comments-panel {
      box-shadow: -14px 0 30px rgba(0, 0, 0, 0.45);
    }

    @media (max-width: 900px) {
      .rte-comments-panel {
        --rte-comments-panel-width: min(420px, 100%);
      }

      [data-rte-comments-open="true"] :is(.rte-toolbar, .editora-toolbar, .rte-content, .editora-content, .editora-statusbar, .editora-statusbar-container) {
        margin-right: 0;
      }
    }
  `;

  document.head.appendChild(style);
}

export const CommentsPlugin = (): Plugin => ({
  name: 'comments',

  toolbar: [
    {
      label: 'Add Comment',
      command: 'addComment',
      type: 'button',
      icon: '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;}</style></defs><title>add-comment</title><path d="M17.74,30,16,29l4-7h6a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H6A2,2,0,0,0,4,8V20a2,2,0,0,0,2,2h9v2H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H26a4,4,0,0,1,4,4V20a4,4,0,0,1-4,4H21.16Z"></path><polygon points="17 9 15 9 15 13 11 13 11 15 15 15 15 19 17 19 17 15 21 15 21 13 17 13 17 9"></polygon><rect class="cls-1" width="32" height="32"></rect></svg>',
    },
    {
      label: 'Show / Hide Comments',
      command: 'toggleComments',
      type: 'button',
      icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H4V11H8L10 13L12 11H16V1Z" fill="#000000"></path><path d="M2 5V13H7.17157L8.70711 14.5355L7.29289 15.9497L6.34315 15H0V5H2Z" fill="#000000"></path></svg>',
    },
  ],

  commands: {
    addComment: () => {
      ensureGlobalTracking();
      const state = getActiveState();
      if (!state) return false;

      state.savedSelection = cloneActiveSelection(state.root);
      // Avoid layout jitter while opening panel: keep logical selection cached,
      // but clear visible DOM selection before panel width transition starts.
      if (state.savedSelection) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
      }
      setPanelVisibility(state, true);
      refreshCommentsPanel(state);

      const textarea = state.panelElement?.querySelector(
        '.new-comment-textarea',
      ) as HTMLTextAreaElement | null;
      textarea?.focus({ preventScroll: true });
      return true;
    },

    toggleComments: () => {
      ensureGlobalTracking();
      const state = getActiveState();
      if (!state) return false;

      setPanelVisibility(state, !state.panelVisible);
      if (state.panelVisible) {
        refreshCommentsPanel(state);
      }
      return true;
    },
  },

  keymap: {},
});
