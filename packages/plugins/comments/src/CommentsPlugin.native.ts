import { Plugin } from '@editora/core';
import { focusPanel, keepPanelFocus, panelHasFocus } from '../../shared/dialogHelpers';
import { recordDomHistory } from '../../shared/historyHelpers';
import { formatFullDate, formatRelativeTime, getAvatarColor, getInitials } from './format';
import { COMMENTS_CSS, COMMENTS_STYLE_ID } from './styles';

interface CommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  editedAt?: string;
}

interface Comment {
  id: string;
  anchorId: string;
  selectedText: string;
  author: string;
  text: string;
  createdAt: string;
  editedAt?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  replies: CommentReply[];
}

type CommentsFilter = 'open' | 'resolved' | 'all';

/** The form for a new comment: what it is about (nothing = the whole document) and what went wrong, if anything. */
interface ComposerState {
  range: Range | null;
  quote: string;
  error: string;
}

/** Which text is being edited: a thread's own comment, or one of its replies. */
interface EditingState {
  commentId: string;
  replyId: string | null;
}

/** What the "Undo" in the panel puts back. Returns false when the document has changed too much to do it. */
interface UndoEntry {
  message: string;
  undo: () => boolean;
}

interface CommentsEditorState {
  root: HTMLElement;
  uid: string;
  comments: Map<string, Comment>;
  panelVisible: boolean;
  panelElement: HTMLElement | null;
  filter: CommentsFilter;
  composer: ComposerState | null;
  activeId: string | null;
  hoverId: string | null;
  editing: EditingState | null;
  editDraft: string;
  undoEntry: UndoEntry | null;
  undoTimer: number | null;
  expandedReplies: Set<string>;
  replyTexts: Record<string, string>;
  savedSelection: Range | null;
  newCommentText: string;
  closeMenu: ((returnFocus: boolean) => void) | null;
  timeTimer: number | null;
}

const stateByEditor = new WeakMap<HTMLElement, CommentsEditorState>();

let activeEditorRoot: HTMLElement | null = null;
let globalTrackingInitialized = false;
let idSeed = 0;
const COMMENT_AUTHOR = 'User';
/** A thread shows its latest replies; the earlier ones are one click away. */
const VISIBLE_REPLIES = 2;

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

function setActiveEditorRootFromCommandContext(context: any): void {
  const candidate =
    (context?.editorElement as HTMLElement | undefined) ||
    (context?.contentElement as HTMLElement | undefined) ||
    null;
  if (!(candidate instanceof HTMLElement)) return;

  const root =
    (candidate.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor') as HTMLElement | null) ||
    (candidate.matches('[data-editora-editor], .rte-editor, .editora-editor, editora-editor')
      ? candidate
      : null);
  if (root) {
    activeEditorRoot = root;
  }
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
    uid: nextId('rte-comments'),
    comments: new Map<string, Comment>(),
    panelVisible: false,
    panelElement: null,
    filter: 'open',
    composer: null,
    activeId: null,
    hoverId: null,
    editing: null,
    editDraft: '',
    undoEntry: null,
    undoTimer: null,
    expandedReplies: new Set<string>(),
    replyTexts: {},
    savedSelection: null,
    newCommentText: '',
    closeMenu: null,
    timeTimer: null,
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

function getContentElement(root: HTMLElement): HTMLElement | null {
  return (
    (root.querySelector('.rte-content') as HTMLElement | null) ||
    (root.querySelector('[contenteditable]') as HTMLElement | null)
  );
}

/** The document's text, not the comments panel that is mounted inside the same editor element. */
function isRangeInsideContent(range: Range, root: HTMLElement): boolean {
  const content = getContentElement(root);
  return !!content && content.contains(range.commonAncestorContainer);
}

function cloneActiveSelection(root: HTMLElement): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  if (!isRangeInsideContent(range, root)) return null;

  return range.cloneRange();
}

function findAnchor(state: CommentsEditorState, comment: Comment): HTMLElement | null {
  if (!comment.anchorId) return null;
  return state.root.querySelector(`[id="${comment.anchorId}"]`) as HTMLElement | null;
}

/**
 * Anchors live in the document (and so in undo history) while comment data lives in
 * memory. Treat the document as the source of truth for anchored comments: one whose
 * anchor is gone (deleted, or undone) is hidden - its data is kept, so redo/undo
 * bringing the anchor back brings the thread back - and its resolved state follows
 * the anchor's class so undoing a Resolve flips the thread too.
 */
function syncAnchoredComments(state: CommentsEditorState): Comment[] {
  const visible: Comment[] = [];
  state.comments.forEach((comment) => {
    if (comment.anchorId) {
      const anchor = findAnchor(state, comment);
      if (!anchor) return;
      comment.resolved = anchor.classList.contains('rte-comment-anchor-resolved');
    }
    visible.push(comment);
  });
  return visible;
}

/**
 * Run a comment operation that edits the document (adding/removing an anchor, toggling
 * its resolved class) as one undoable step and tell the host the content changed.
 */
function withDocumentEdit<T>(state: CommentsEditorState, edit: () => T): T {
  const content = getContentElement(state.root);
  const beforeHTML = content ? content.innerHTML : '';
  const result = edit();
  if (content && content.innerHTML !== beforeHTML) {
    recordDomHistory(content, beforeHTML);
    content.dispatchEvent(new Event('input', { bubbles: true }));
  }
  return result;
}

function updateAnchorVisualState(state: CommentsEditorState, comment: Comment): void {
  const anchor = findAnchor(state, comment);
  if (!anchor) return;

  anchor.classList.toggle('rte-comment-anchor-resolved', comment.resolved);
}

/**
 * The thread you point at, and the one you are working on, are lit in the text. That is done with a stylesheet rule
 * for the anchor's id, not a class on the anchor: a class is part of the document, so it would be saved with it and
 * be in undo history, and an emphasis that was on when the document was saved would stay on for good.
 */
const emphasisStates = new Set<CommentsEditorState>();
const EMPHASIS_STYLE_ID = 'rte-comments-emphasis';

function updateEmphasis(state: CommentsEditorState): void {
  if (state.activeId || state.hoverId) emphasisStates.add(state);
  else emphasisStates.delete(state);

  // An editor that has left the page cannot say goodbye either.
  emphasisStates.forEach((item) => {
    if (!item.root.isConnected) emphasisStates.delete(item);
  });

  const rules: string[] = [];
  const anchorIdOf = (state_: CommentsEditorState, commentId: string | null) => {
    const comment = commentId ? state_.comments.get(commentId) : null;
    return comment?.anchorId ? comment.anchorId.replace(/["\\]/g, '') : '';
  };
  emphasisStates.forEach((item) => {
    const hover = anchorIdOf(item, item.hoverId);
    const active = anchorIdOf(item, item.activeId);
    if (hover) rules.push(`.rte-comment-anchor[id="${hover}"] { outline: 2px solid color-mix(in srgb, var(--rte-color-primary, #2563eb) 55%, transparent); outline-offset: 2px; }`);
    if (active) rules.push(`.rte-comment-anchor[id="${active}"] { outline: 2px solid var(--rte-color-primary, #2563eb); outline-offset: 2px; background: rgba(250, 204, 21, 0.55); }`);
  });

  let style = document.getElementById(EMPHASIS_STYLE_ID);
  if (rules.length === 0) {
    style?.remove();
    return;
  }
  if (!style) {
    style = document.createElement('style');
    style.id = EMPHASIS_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = rules.join('\n');
}

function highlightAnchor(state: CommentsEditorState, commentId: string, highlight: boolean): void {
  if (highlight) state.hoverId = commentId;
  else if (state.hoverId === commentId) state.hoverId = null;
  updateEmphasis(state);
}

/** Marks one thread as the one being worked on: its card in the panel and its text in the document. */
function setActiveThread(state: CommentsEditorState, commentId: string | null): void {
  state.activeId = commentId;
  state.panelElement?.querySelectorAll<HTMLElement>('.rte-comment-item').forEach((card) => {
    card.classList.toggle('is-active', card.dataset.commentId === commentId);
  });
  updateEmphasis(state);
}

function unwrapNode(node: HTMLElement): void {
  const parent = node.parentNode;
  if (!parent) return;
  while (node.firstChild) {
    parent.insertBefore(node.firstChild, node);
  }
  node.remove();
}

function focusEditorText(state: CommentsEditorState): void {
  state.root.querySelector<HTMLElement>('[contenteditable="true"]')?.focus({ preventScroll: true });
}

/* ------------------------------------------------------------------------------------------------
 * Panel: open / close
 * ---------------------------------------------------------------------------------------------- */

function setPanelVisibility(state: CommentsEditorState, visible: boolean): void {
  state.panelVisible = visible;
  if (visible) {
    ensurePanelStyles();
    ensurePanel(state);
    state.root.setAttribute('data-rte-comments-open', 'true');
    if (state.panelElement) {
      state.panelElement.classList.add('is-open');
      state.panelElement.setAttribute('aria-hidden', 'false');
    }
    renderPanel(state);
    startTimeTimer(state);
    focusPanel(state.panelElement);
    return;
  }

  state.root.removeAttribute('data-rte-comments-open');
  stopTimeTimer(state);
  state.closeMenu?.(false);
  state.editing = null;
  state.editDraft = '';
  dismissUndo(state);
  state.hoverId = null;
  setActiveThread(state, null);
  if (state.panelElement) {
    // The panel goes with the focus that is in it: hand that back to the text instead of dropping it on the page.
    const hadFocus = panelHasFocus(state.panelElement);
    state.panelElement.remove();
    state.panelElement = null;
    if (hadFocus) focusEditorText(state);
  }
}

function closePanelAndRestoreFocus(state: CommentsEditorState): void {
  setPanelVisibility(state, false);
  // A click does not focus a button in every browser, so the panel may not have held the focus: give it to the text.
  if (!state.root.contains(document.activeElement) || document.activeElement === document.body) {
    focusEditorText(state);
  }
}

const ICONS = {
  check: '<path d="M3.5 8.5l3 3 6-7"/>',
  reopen: '<path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.8v3.2h3.2"/>',
  more: '<circle cx="8" cy="3.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r="1.1" fill="currentColor" stroke="none"/>',
  plus: '<path d="M8 3v10M3 8h10"/>',
  close: '<path d="M4 4l8 8M12 4l-8 8"/>',
  addComment: '<path d="M2.5 3.5h11v7.5H8.5l-3 2.5V11h-3zM8 5.2v3.6M6.2 7h3.6"/>',
  edit: '<path d="M10.5 3.5l2 2-7 7-2.8.8.8-2.8z"/>',
  trash: '<path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 8.5h6l.5-8.5M7 7v4M9 7v4"/>',
  bubble: '<path d="M2.5 3.5h11v7.5H8.5l-3 2.5V11h-3z"/>',
} as const;

/** Static, trusted markup only: never put user text through this. */
function svg(name: keyof typeof ICONS): string {
  return `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}

function createButton(className: string, label: string, icon?: keyof typeof ICONS): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  if (icon) {
    button.innerHTML = svg(icon);
    button.setAttribute('aria-label', label);
    button.title = label;
  } else {
    button.textContent = label;
  }
  return button;
}

function ensurePanel(state: CommentsEditorState): void {
  if (state.panelElement) return;

  const panel = document.createElement('aside');
  panel.className = 'rte-comments-panel';
  panel.setAttribute('role', 'complementary');
  panel.setAttribute('aria-label', 'Comments');
  panel.setAttribute('aria-hidden', 'true');

  const tabs: Array<[CommentsFilter, string]> = [
    ['open', 'Open'],
    ['resolved', 'Resolved'],
    ['all', 'All'],
  ];

  panel.innerHTML = `
    <div class="rte-comments-header">
      <div class="rte-comments-title">
        <h3>Comments</h3>
        <span class="rte-comments-count" aria-hidden="true"></span>
      </div>
      <div class="rte-comments-header-actions">
        <button class="rte-comments-new" type="button" aria-label="New comment">${svg('plus')}<span>New</span></button>
        <button class="rte-comments-close" type="button" aria-label="Close comments panel" title="Close">${svg('close')}</button>
      </div>
    </div>
    <div class="rte-comments-tabs" role="tablist" aria-label="Show comments">
      ${tabs
        .map(
          ([key, label]) =>
            `<button class="rte-comments-tab" type="button" role="tab" id="${state.uid}-tab-${key}" data-filter="${key}" aria-controls="${state.uid}-body"><span>${label}</span><span class="rte-comments-tab-count"></span></button>`,
        )
        .join('')}
    </div>
    <div class="rte-comments-body" id="${state.uid}-body" role="tabpanel"></div>
    <div class="rte-comments-toast" role="status" aria-live="polite" hidden></div>
  `;

  panel.querySelector('.rte-comments-close')?.addEventListener('click', () => closePanelAndRestoreFocus(state));

  panel.querySelector('.rte-comments-new')?.addEventListener('click', () => {
    openComposer(state, state.savedSelection ? state.savedSelection.cloneRange() : null);
  });

  const tabList = panel.querySelector('.rte-comments-tabs') as HTMLElement;
  const tabButtons = Array.from(tabList.querySelectorAll<HTMLButtonElement>('.rte-comments-tab'));
  tabButtons.forEach((tab) => {
    tab.addEventListener('click', () => {
      state.filter = tab.dataset.filter as CommentsFilter;
      renderPanel(state);
    });
  });
  tabList.addEventListener('keydown', (event) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const current = tabButtons.findIndex((tab) => tab === document.activeElement);
    if (current === -1) return;
    event.preventDefault();
    let next = current;
    if (event.key === 'ArrowRight') next = (current + 1) % tabButtons.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabButtons.length - 1;
    state.filter = tabButtons[next].dataset.filter as CommentsFilter;
    renderPanel(state);
    tabButtons[next].focus();
  });

  const computed = window.getComputedStyle(state.root);
  if (computed.position === 'static') {
    state.root.style.position = 'relative';
  }

  state.root.appendChild(panel);
  state.panelElement = panel;
}

/* ------------------------------------------------------------------------------------------------
 * Panel: contents
 * ---------------------------------------------------------------------------------------------- */

/** Threads in the order of the document, then the notes about the whole document, oldest first. */
function getCommentsInDisplayOrder(state: CommentsEditorState): Comment[] {
  const visible = syncAnchoredComments(state);

  const anchored = visible
    .filter((comment) => comment.anchorId)
    .map((comment) => ({ comment, anchor: findAnchor(state, comment) as HTMLElement }));
  anchored.sort((a, b) => {
    if (a.anchor === b.anchor) return 0;
    return a.anchor.compareDocumentPosition(b.anchor) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

  const general = visible
    .filter((comment) => !comment.anchorId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return [...anchored.map((item) => item.comment), ...general];
}

function createAvatar(name: string, small = false): HTMLElement {
  const avatar = document.createElement('span');
  avatar.className = `rte-comment-avatar${small ? ' small' : ''}`;
  avatar.setAttribute('aria-hidden', 'true');
  avatar.style.background = getAvatarColor(name);
  avatar.textContent = getInitials(name);
  return avatar;
}

function createTimeElement(isoDate: string): HTMLTimeElement {
  const time = document.createElement('time');
  time.className = 'rte-comment-date';
  time.dateTime = isoDate;
  time.dataset.created = isoDate;
  time.title = formatFullDate(isoDate);
  time.textContent = formatRelativeTime(isoDate);
  return time;
}

/** The labels say "5 min. ago": keep them true while the panel stays open. */
function refreshTimes(state: CommentsEditorState): void {
  state.panelElement?.querySelectorAll<HTMLTimeElement>('time[data-created]').forEach((time) => {
    time.textContent = formatRelativeTime(time.dataset.created || '');
  });
}

function startTimeTimer(state: CommentsEditorState): void {
  if (state.timeTimer !== null) return;
  state.timeTimer = window.setInterval(() => refreshTimes(state), 60_000);
}

function stopTimeTimer(state: CommentsEditorState): void {
  if (state.timeTimer === null) return;
  window.clearInterval(state.timeTimer);
  state.timeTimer = null;
}

function autosize(textarea: HTMLTextAreaElement): void {
  textarea.style.height = 'auto';
  if (!textarea.scrollHeight) return; // not laid out (hidden, or no layout engine): leave it to the CSS
  // The box is border-box: scrollHeight leaves the border out, and a box short by it grows a scrollbar.
  const border = textarea.offsetHeight - textarea.clientHeight;
  textarea.style.height = `${Math.min(textarea.scrollHeight + border, 160)}px`;
}

function prefersReducedMotion(): boolean {
  return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Scrolls the commented text into view. On a phone the panel is a sheet over the bottom of the screen, and text
 * centred in the window would sit under it: keep it above the sheet.
 */
function scrollToAnchor(state: CommentsEditorState, comment: Comment, flash = true): void {
  const anchor = findAnchor(state, comment);
  if (!anchor) return;
  const sheet = !!state.panelElement && window.getComputedStyle(state.panelElement).position === 'fixed';
  anchor.scrollIntoView({ behavior: sheet || prefersReducedMotion() ? 'auto' : 'smooth', block: 'center', inline: 'nearest' });
  if (sheet && state.panelElement) {
    const sheetTop = state.panelElement.getBoundingClientRect().top;
    const bottom = anchor.getBoundingClientRect().bottom;
    if (bottom > sheetTop - 16) window.scrollBy(0, bottom - sheetTop + 32);
  }
  if (flash) {
    highlightAnchor(state, comment.id, true);
    window.setTimeout(() => highlightAnchor(state, comment.id, false), 1200);
  }
}

/** Shows a thread in the panel: switches to the tab it is on, marks it, scrolls it into view. */
function activateThread(state: CommentsEditorState, commentId: string): void {
  const comment = state.comments.get(commentId);
  if (!comment) return;
  if (state.filter !== 'all') state.filter = comment.resolved ? 'resolved' : 'open';
  setActiveThread(state, commentId);
  renderPanel(state);

  const card = Array.from(state.panelElement?.querySelectorAll<HTMLElement>('.rte-comment-item') ?? []).find(
    (item) => item.dataset.commentId === commentId,
  );
  card?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
}

interface MenuItem {
  label: string;
  icon: keyof typeof ICONS;
  danger?: boolean;
  run: () => void;
}

/** A "more actions" button and the menu it opens. Arrow keys move, Escape closes, a click outside closes. */
function createMenu(state: CommentsEditorState, items: MenuItem[], ids: { commentId: string; replyId?: string }, label: string): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'rte-comment-more';

  const trigger = createButton('rte-comment-icon-btn', label, 'more');
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.dataset.action = 'more';
  trigger.dataset.commentId = ids.commentId;
  if (ids.replyId) trigger.dataset.id = ids.replyId;

  const menu = document.createElement('div');
  menu.className = 'rte-comment-menu';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', label);
  menu.hidden = true;

  items.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `rte-comment-menu-item${item.danger ? ' danger' : ''}`;
    button.setAttribute('role', 'menuitem');
    button.dataset.action = item.label.toLowerCase();
    button.innerHTML = svg(item.icon);
    const text = document.createElement('span');
    text.textContent = item.label;
    button.appendChild(text);
    button.addEventListener('click', () => {
      state.closeMenu?.(false);
      item.run();
    });
    menu.appendChild(button);
  });

  const menuItems = () => Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));

  const close = (returnFocus: boolean) => {
    if (menu.hidden) return;
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', onOutside, true);
    document.removeEventListener('focusin', onOutside, true);
    if (state.closeMenu === close) state.closeMenu = null;
    if (returnFocus && trigger.isConnected) trigger.focus({ preventScroll: true });
  };

  function onOutside(event: Event) {
    if (event.target instanceof Node && wrapper.contains(event.target)) return;
    close(false);
  }

  const open = () => {
    state.closeMenu?.(false);
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    state.closeMenu = close;
    document.addEventListener('pointerdown', onOutside, true);
    document.addEventListener('focusin', onOutside, true);
    menuItems()[0]?.focus({ preventScroll: true });
  };

  trigger.addEventListener('click', () => (menu.hidden ? open() : close(true)));
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && menu.hidden) {
      event.preventDefault();
      open();
    }
  });
  menu.addEventListener('keydown', (event) => {
    const list = menuItems();
    const current = list.indexOf(document.activeElement as HTMLButtonElement);
    let next = -1;
    if (event.key === 'ArrowDown') next = (current + 1) % list.length;
    else if (event.key === 'ArrowUp') next = (current - 1 + list.length) % list.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = list.length - 1;
    else if (event.key === 'Tab') close(false);
    if (next === -1) return;
    event.preventDefault();
    list[next].focus({ preventScroll: true });
  });

  wrapper.append(trigger, menu);
  return wrapper;
}

function createWhen(createdAt: string, editedAt?: string): HTMLElement {
  const when = document.createElement('div');
  when.className = 'rte-comment-when';
  when.appendChild(createTimeElement(createdAt));
  if (editedAt) {
    const edited = document.createElement('span');
    edited.className = 'rte-comment-edited';
    edited.textContent = '· edited';
    edited.title = `Edited ${formatFullDate(editedAt)}`;
    when.appendChild(edited);
  }
  return when;
}

/** Edit a comment or a reply in place. Enter saves, Shift+Enter starts a line, Escape (or Cancel) puts it back. */
function createEditForm(state: CommentsEditorState, editing: EditingState): HTMLElement {
  const form = document.createElement('form');
  form.className = 'rte-comment-edit';
  form.noValidate = true;

  const textarea = document.createElement('textarea');
  textarea.className = 'rte-comment-edit-textarea';
  textarea.rows = 2;
  textarea.setAttribute('aria-label', editing.replyId ? 'Edit reply' : 'Edit comment');
  textarea.dataset.commentId = editing.commentId;
  if (editing.replyId) textarea.dataset.id = editing.replyId;
  textarea.value = state.editDraft;

  const actions = document.createElement('div');
  actions.className = 'rte-comment-form-actions';
  const cancel = createButton('rte-comment-btn ghost', 'Cancel');
  const save = createButton('rte-comment-btn primary', 'Save');
  save.type = 'submit';
  actions.append(cancel, save);

  const sync = () => {
    save.disabled = !textarea.value.trim();
    autosize(textarea);
  };
  sync();

  textarea.addEventListener('input', () => {
    state.editDraft = textarea.value;
    sync();
  });
  textarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  cancel.addEventListener('click', () => cancelEdit(state));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveEdit(state, textarea.value);
  });

  form.append(textarea, actions);
  return form;
}

function startEdit(state: CommentsEditorState, commentId: string, replyId: string | null): void {
  const comment = state.comments.get(commentId);
  if (!comment) return;
  const reply = replyId ? comment.replies.find((item) => item.id === replyId) : null;
  if (replyId && !reply) return;

  state.editing = { commentId, replyId };
  state.editDraft = reply ? reply.text : comment.text;
  if (replyId) state.expandedReplies.add(commentId);
  renderPanel(state);

  const field = state.panelElement?.querySelector<HTMLTextAreaElement>('.rte-comment-edit-textarea');
  if (field) {
    field.focus({ preventScroll: true });
    field.setSelectionRange(field.value.length, field.value.length);
  }
}

function cancelEdit(state: CommentsEditorState): void {
  const editing = state.editing;
  state.editing = null;
  state.editDraft = '';
  renderPanel(state);
  if (!editing) return;
  // Hand the focus back to the button that opened the edit.
  const selector = editing.replyId
    ? `[data-action="more"][data-id="${editing.replyId}"]`
    : `.rte-comment-item[data-comment-id="${editing.commentId}"] > .rte-comment-header [data-action="more"]`;
  state.panelElement?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
}

function saveEdit(state: CommentsEditorState, value: string): void {
  const editing = state.editing;
  const text = value.trim();
  if (!editing || !text) return;
  const comment = state.comments.get(editing.commentId);
  if (!comment) return;

  const target = editing.replyId ? comment.replies.find((item) => item.id === editing.replyId) : comment;
  if (target && target.text !== text) {
    target.text = text;
    target.editedAt = new Date().toISOString();
  }
  cancelEdit(state);
}

function dismissUndo(state: CommentsEditorState): void {
  if (state.undoTimer !== null) window.clearTimeout(state.undoTimer);
  state.undoTimer = null;
  state.undoEntry = null;
  const toast = state.panelElement?.querySelector<HTMLElement>('.rte-comments-toast');
  if (toast) {
    toast.hidden = true;
    toast.replaceChildren();
  }
}

/** "Comment deleted · Undo" at the foot of the panel; it goes by itself after a few seconds. */
function showUndo(state: CommentsEditorState, entry: UndoEntry): void {
  const toast = state.panelElement?.querySelector<HTMLElement>('.rte-comments-toast');
  if (!toast) return;
  dismissUndo(state);
  state.undoEntry = entry;

  const message = document.createElement('span');
  message.textContent = entry.message;
  const undo = createButton('rte-comments-toast-action', 'Undo');
  undo.addEventListener('click', () => {
    const restored = entry.undo();
    dismissUndo(state);
    if (!restored) {
      message.textContent = 'This could not be restored here. Use Undo in the document.';
      toast.replaceChildren(message);
      toast.hidden = false;
      state.undoTimer = window.setTimeout(() => dismissUndo(state), 6000);
    }
  });
  toast.replaceChildren(message, undo);
  toast.hidden = false;
  state.undoTimer = window.setTimeout(() => dismissUndo(state), 8000);
}

function createReplyBox(state: CommentsEditorState, comment: Comment): HTMLElement {
  const box = document.createElement('div');
  box.className = 'rte-comment-reply-box';

  const textarea = document.createElement('textarea');
  textarea.className = 'rte-comment-reply-textarea';
  textarea.rows = 1;
  textarea.placeholder = 'Reply…';
  textarea.setAttribute('aria-label', 'Reply');
  textarea.dataset.commentId = comment.id;
  textarea.value = state.replyTexts[comment.id] || '';

  const actions = document.createElement('div');
  actions.className = 'rte-comment-form-actions';
  const cancel = createButton('rte-comment-btn ghost', 'Cancel');
  const send = createButton('rte-comment-btn primary', 'Reply');
  actions.append(cancel, send);

  const sync = () => {
    const hasText = !!textarea.value.trim();
    send.disabled = !hasText;
    box.classList.toggle('has-text', !!textarea.value);
    autosize(textarea);
  };
  sync();

  const submit = () => {
    const text = textarea.value.trim();
    if (!text) return;
    replyToComment(comment.id, COMMENT_AUTHOR, text);
    delete state.replyTexts[comment.id];
    renderPanel(state);
  };

  textarea.addEventListener('input', () => {
    state.replyTexts[comment.id] = textarea.value;
    sync();
  });
  textarea.addEventListener('focus', () => setActiveThread(state, comment.id));
  textarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      submit();
    }
  });
  send.addEventListener('click', submit);
  cancel.addEventListener('click', () => {
    delete state.replyTexts[comment.id];
    textarea.value = '';
    sync();
    textarea.blur();
  });

  box.append(textarea, actions);
  return box;
}

function createThreadCard(state: CommentsEditorState, comment: Comment): HTMLElement {
  const card = document.createElement('article');
  card.className = `rte-comment-item${comment.resolved ? ' resolved' : ''}${state.activeId === comment.id ? ' is-active' : ''}`;
  card.dataset.commentId = comment.id;

  // Header: who, when, and the two things you do to a thread.
  const header = document.createElement('header');
  header.className = 'rte-comment-header';
  const meta = document.createElement('div');
  meta.className = 'rte-comment-meta';
  const author = document.createElement('strong');
  author.className = 'rte-comment-author';
  author.textContent = comment.author;
  meta.append(author, createWhen(comment.createdAt, comment.editedAt));

  const actions = document.createElement('div');
  actions.className = 'rte-comment-header-actions';
  const resolveBtn = createButton(
    'rte-comment-icon-btn',
    comment.resolved ? 'Reopen thread' : 'Resolve thread',
    comment.resolved ? 'reopen' : 'check',
  );
  resolveBtn.dataset.action = 'resolve';
  resolveBtn.dataset.commentId = comment.id;
  resolveBtn.addEventListener('click', () => {
    if (comment.resolved) reopenComment(comment.id);
    else resolveComment(comment.id, COMMENT_AUTHOR);
  });
  actions.append(
    resolveBtn,
    createMenu(
      state,
      [
        { label: 'Edit', icon: 'edit', run: () => startEdit(state, comment.id, null) },
        { label: 'Delete', icon: 'trash', danger: true, run: () => deleteWithUndo(state, comment.id) },
      ],
      { commentId: comment.id },
      'More actions',
    ),
  );
  header.append(createAvatar(comment.author), meta, actions);
  card.appendChild(header);

  // The text this is about. A button: it takes you there.
  if (comment.anchorId && comment.selectedText) {
    const quote = document.createElement('button');
    quote.type = 'button';
    quote.className = 'rte-comment-selection';
    quote.textContent = comment.selectedText;
    quote.title = 'Go to this text';
    quote.setAttribute('aria-label', `Go to the commented text: ${comment.selectedText}`);
    quote.addEventListener('click', () => {
      setActiveThread(state, comment.id);
      scrollToAnchor(state, comment);
    });
    card.appendChild(quote);
  }

  if (state.editing && state.editing.commentId === comment.id && !state.editing.replyId) {
    card.appendChild(createEditForm(state, state.editing));
  } else {
    const text = document.createElement('div');
    text.className = 'rte-comment-text';
    text.textContent = comment.text;
    card.appendChild(text);
  }

  if (comment.resolved) {
    const status = document.createElement('div');
    status.className = 'rte-comment-status';
    status.innerHTML = svg('check');
    const label = document.createElement('span');
    const by = comment.resolvedBy ? ` by ${comment.resolvedBy}` : '';
    const when = comment.resolvedAt ? ` · ${formatRelativeTime(comment.resolvedAt)}` : '';
    label.textContent = `Resolved${by}${when}`;
    status.appendChild(label);
    card.appendChild(status);
  }

  // Replies are part of the thread, not behind a toggle.
  if (comment.replies.length > 0) {
    const replies = document.createElement('div');
    replies.className = 'rte-comment-replies';

    const expanded = state.expandedReplies.has(comment.id);
    const hidden = expanded ? 0 : Math.max(0, comment.replies.length - VISIBLE_REPLIES);
    if (hidden > 0) {
      const more = createButton(
        'rte-comment-more-replies',
        `Show ${hidden} earlier ${hidden === 1 ? 'reply' : 'replies'}`,
      );
      more.addEventListener('click', () => {
        state.expandedReplies.add(comment.id);
        renderPanel(state);
      });
      replies.appendChild(more);
    }

    comment.replies.slice(hidden).forEach((reply) => {
      const item = document.createElement('div');
      item.className = 'rte-comment-reply';
      item.dataset.replyId = reply.id;
      const replyHeader = document.createElement('div');
      replyHeader.className = 'rte-comment-reply-header';
      const replyMeta = document.createElement('div');
      replyMeta.className = 'rte-comment-meta';
      const replyAuthor = document.createElement('strong');
      replyAuthor.className = 'rte-comment-author';
      replyAuthor.textContent = reply.author;
      replyMeta.append(replyAuthor, createWhen(reply.createdAt, reply.editedAt));
      replyHeader.append(
        createAvatar(reply.author, true),
        replyMeta,
        createMenu(
          state,
          [
            { label: 'Edit', icon: 'edit', run: () => startEdit(state, comment.id, reply.id) },
            { label: 'Delete', icon: 'trash', danger: true, run: () => deleteReplyWithUndo(state, comment.id, reply.id) },
          ],
          { commentId: comment.id, replyId: reply.id },
          'More reply actions',
        ),
      );
      item.appendChild(replyHeader);

      if (state.editing && state.editing.commentId === comment.id && state.editing.replyId === reply.id) {
        item.appendChild(createEditForm(state, state.editing));
      } else {
        const replyText = document.createElement('div');
        replyText.className = 'rte-comment-reply-text';
        replyText.textContent = reply.text;
        item.appendChild(replyText);
      }
      replies.appendChild(item);
    });

    card.appendChild(replies);
  }

  if (!comment.resolved) card.appendChild(createReplyBox(state, comment));

  // Pointing at a card lights its text; clicking the card itself takes you to the text.
  card.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('button, textarea, form, [role="menu"]')) return;
    if (window.getSelection()?.toString()) return; // dragging over the text to copy it is not a click
    setActiveThread(state, comment.id);
    scrollToAnchor(state, comment, false);
  });
  card.addEventListener('mouseenter', () => highlightAnchor(state, comment.id, true));
  card.addEventListener('mouseleave', () => highlightAnchor(state, comment.id, false));
  card.addEventListener('focusin', () => highlightAnchor(state, comment.id, true));
  card.addEventListener('focusout', () => highlightAnchor(state, comment.id, false));

  return card;
}

function createComposer(state: CommentsEditorState, composer: ComposerState): HTMLElement {
  const form = document.createElement('form');
  form.className = 'rte-comment-composer';
  form.noValidate = true;
  form.setAttribute('aria-label', composer.range ? 'New comment on the selected text' : 'New note for the whole document');

  if (composer.range) {
    const quote = document.createElement('div');
    quote.className = 'rte-comment-selection';
    const quoteText = document.createElement('span');
    quoteText.textContent = composer.quote;
    quoteText.title = composer.quote;
    const detach = createButton('rte-comment-icon-btn', 'Comment on the whole document instead', 'close');
    detach.addEventListener('click', () => {
      composer.range = null;
      composer.quote = '';
      renderPanel(state);
      focusComposer(state);
    });
    quote.append(quoteText, detach);
    form.appendChild(quote);
  } else {
    const hint = document.createElement('p');
    hint.className = 'rte-comment-composer-hint';
    hint.textContent = 'A note for the whole document. To comment on a passage, select it first, then click New.';
    form.appendChild(hint);
  }

  const textarea = document.createElement('textarea');
  textarea.className = 'new-comment-textarea';
  textarea.rows = 3;
  textarea.placeholder = composer.range ? 'Add a comment…' : 'Add a note…';
  textarea.setAttribute('aria-label', composer.range ? 'Comment' : 'Note');
  textarea.value = state.newCommentText;
  form.appendChild(textarea);

  if (composer.error) {
    const error = document.createElement('p');
    error.className = 'rte-comment-error';
    error.setAttribute('role', 'alert');
    error.textContent = composer.error;
    form.appendChild(error);
  }

  const actions = document.createElement('div');
  actions.className = 'rte-comment-form-actions';
  const cancel = createButton('rte-comment-btn ghost', 'Cancel');
  const submitBtn = createButton('rte-comment-btn primary', 'Comment');
  submitBtn.type = 'submit';
  actions.append(cancel, submitBtn);
  form.appendChild(actions);

  const sync = () => {
    submitBtn.disabled = !textarea.value.trim();
  };
  sync();

  textarea.addEventListener('input', () => {
    state.newCommentText = textarea.value;
    if (composer.error) {
      composer.error = '';
      form.querySelector('.rte-comment-error')?.remove();
    }
    sync();
  });
  textarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  cancel.addEventListener('click', () => closeComposer(state));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = textarea.value.trim();
    if (!text) return;
    const id = createComment(state, COMMENT_AUTHOR, text, composer.range);
    if (!id) {
      composer.error = 'That text could not be commented on. Select it again and click New.';
      composer.range = null;
      composer.quote = '';
      renderPanel(state);
      return;
    }
    state.newCommentText = '';
    state.composer = null;
    if (state.filter === 'resolved') state.filter = 'open';
    activateThread(state, id);
  });

  return form;
}

function focusComposer(state: CommentsEditorState): void {
  state.panelElement?.querySelector<HTMLTextAreaElement>('.new-comment-textarea')?.focus({ preventScroll: true });
}

function openComposer(state: CommentsEditorState, range: Range | null): void {
  const quote = range ? range.toString().replace(/\s+/g, ' ').trim() : '';
  state.composer = { range: range && quote ? range.cloneRange() : null, quote, error: '' };
  if (state.filter === 'resolved') state.filter = 'open';
  renderPanel(state);
  focusComposer(state);
}

function closeComposer(state: CommentsEditorState): void {
  state.composer = null;
  state.newCommentText = '';
  renderPanel(state);
}

function createEmptyState(filter: CommentsFilter, total: number): HTMLElement {
  const empty = document.createElement('div');
  empty.className = 'rte-comments-empty';

  let title = 'No comments yet';
  let hint = 'Select text in the document and click New to start a discussion.';
  if (total > 0 && filter === 'open') {
    title = 'No open comments';
    hint = 'Every thread has been resolved.';
  } else if (total > 0 && filter === 'resolved') {
    title = 'Nothing resolved yet';
    hint = 'Threads you resolve show up here.';
  }

  empty.innerHTML = svg('bubble');
  const strong = document.createElement('strong');
  strong.textContent = title;
  const paragraph = document.createElement('p');
  paragraph.textContent = hint;
  empty.append(strong, paragraph);
  return empty;
}

function renderPanel(state?: CommentsEditorState): void {
  const targetState = state || getActiveState();
  const panel = targetState?.panelElement;
  if (!targetState || !panel) return;

  const all = getCommentsInDisplayOrder(targetState);
  const counts: Record<CommentsFilter, number> = {
    open: all.filter((comment) => !comment.resolved).length,
    resolved: all.filter((comment) => comment.resolved).length,
    all: all.length,
  };

  const count = panel.querySelector('.rte-comments-count');
  if (count) {
    count.textContent = String(counts.open);
    (count as HTMLElement).hidden = counts.open === 0;
  }
  panel.querySelectorAll<HTMLButtonElement>('.rte-comments-tab').forEach((tab) => {
    const key = tab.dataset.filter as CommentsFilter;
    const selected = key === targetState.filter;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const tabCount = tab.querySelector('.rte-comments-tab-count');
    if (tabCount) tabCount.textContent = String(counts[key]);
  });

  const body = panel.querySelector('.rte-comments-body') as HTMLElement | null;
  if (!body) return;
  body.setAttribute('aria-labelledby', `${targetState.uid}-tab-${targetState.filter}`);

  const shown = all.filter((comment) => {
    if (targetState.filter === 'open') return !comment.resolved;
    if (targetState.filter === 'resolved') return comment.resolved;
    return true;
  });

  // A card that is rebuilt while it has the pointer or the focus never says goodbye, which would leave its text lit.
  if (targetState.hoverId) {
    targetState.hoverId = null;
    updateEmphasis(targetState);
  }

  const scrollTop = body.scrollTop;
  keepPanelFocus(panel, () => {
    const nodes: HTMLElement[] = [];
    if (targetState.composer) nodes.push(createComposer(targetState, targetState.composer));
    shown.forEach((comment) => nodes.push(createThreadCard(targetState, comment)));
    if (shown.length === 0 && !targetState.composer) {
      nodes.push(createEmptyState(targetState.filter, counts.all));
    }
    body.replaceChildren(...nodes);
  });
  body.scrollTop = scrollTop;
  body.querySelectorAll('textarea').forEach((textarea) => autosize(textarea));
}

const pendingRefresh = new WeakMap<CommentsEditorState, number>();

/** Coalesce refreshes triggered by typing so a busy panel isn't rebuilt per keystroke. */
function scheduleCommentsRefresh(state: CommentsEditorState): void {
  if (pendingRefresh.has(state)) return;
  pendingRefresh.set(
    state,
    window.setTimeout(() => {
      pendingRefresh.delete(state);
      if (state.panelVisible) renderPanel(state);
    }, 120),
  );
}

/* ------------------------------------------------------------------------------------------------
 * Starting a comment: the toolbar button, the bubble over a selection, the shortcut
 * ---------------------------------------------------------------------------------------------- */

/** An editor takes comments if its toolbar has the button, or if the plugin has been used in it. */
function isCommentingEnabled(root: HTMLElement): boolean {
  return stateByEditor.has(root) || !!root.querySelector('[data-command="addComment"]');
}

function beginComment(root: HTMLElement): void {
  activeEditorRoot = root;
  const state = getOrCreateState(root);
  const range = cloneActiveSelection(root) || (state.savedSelection ? state.savedSelection.cloneRange() : null);
  // Avoid layout jitter while opening panel: the form keeps the range, so clear the visible
  // DOM selection before the panel width transition starts.
  if (range) window.getSelection()?.removeAllRanges();
  state.savedSelection = null;

  hideBubble();
  setPanelVisibility(state, true);
  openComposer(state, range);
}

let bubble: HTMLButtonElement | null = null;
let bubbleRoot: HTMLElement | null = null;
let bubbleTimer: number | null = null;
let pointerIsDown = false;

function shortcutLabel(): string {
  return /Mac|iPhone|iPad/.test(navigator.platform || '') ? '⌘⌥M' : 'Ctrl+Alt+M';
}

function hideBubble(): void {
  if (bubble) bubble.hidden = true;
  bubbleRoot = null;
}

function ensureBubble(): HTMLButtonElement {
  if (bubble && bubble.isConnected) return bubble;
  ensurePanelStyles();

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'rte-comments-bubble';
  button.hidden = true;
  button.title = `Add a comment (${shortcutLabel()})`;
  button.innerHTML = `${svg('addComment')}<span>Comment</span>`;
  // Pressing it must not take the selection away from the text it is about.
  button.addEventListener('mousedown', (event) => event.preventDefault());
  button.addEventListener('click', () => {
    const root = bubbleRoot;
    hideBubble();
    if (root) beginComment(root);
  });
  document.body.appendChild(button);
  bubble = button;
  return button;
}

function updateBubble(): void {
  bubbleTimer = null;
  if (pointerIsDown) return hideBubble();

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return hideBubble();
  const range = selection.getRangeAt(0);
  const root = getEditorRootFromNode(range.commonAncestorContainer);
  if (!root || !isRangeInsideContent(range, root) || !isCommentingEnabled(root)) return hideBubble();
  // A read-only document cannot take the highlight a comment puts in it.
  if (getContentElement(root)?.closest('[contenteditable="false"]')) return hideBubble();
  if (!range.toString().trim()) return hideBubble();

  const rects = range.getClientRects?.();
  const last = rects && rects.length ? rects[rects.length - 1] : range.getBoundingClientRect?.();
  if (!last || (!last.width && !last.height)) return hideBubble();

  const element = ensureBubble();
  element.hidden = false;
  bubbleRoot = root;
  const width = element.offsetWidth || 96;
  const height = element.offsetHeight || 32;
  let top = last.bottom + 8;
  if (top + height > window.innerHeight - 8) top = Math.max(8, (rects && rects.length ? rects[0] : last).top - height - 8);
  const left = Math.min(Math.max(8, last.right - width), Math.max(8, window.innerWidth - width - 8));
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
}

function scheduleBubbleUpdate(): void {
  if (bubbleTimer !== null) return;
  bubbleTimer = window.setTimeout(updateBubble, 40);
}

/* ------------------------------------------------------------------------------------------------
 * Page-wide listeners (one set, shared by every editor)
 * ---------------------------------------------------------------------------------------------- */

function ensureGlobalTracking(): void {
  if (globalTrackingInitialized) return;
  globalTrackingInitialized = true;

  document.addEventListener('focusin', (event) => {
    const root = getEditorRootFromNode(event.target as Node);
    if (root) activeEditorRoot = root;
  });

  // Anchors are plain spans in the document, so they are rebuilt by undo/redo and
  // by loading saved HTML; a handler bound per element would die with them. Delegate.
  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const anchor = target?.closest('.rte-comment-anchor') as HTMLElement | null;
    if (!anchor) return;

    const root = getEditorRootFromNode(anchor);
    const state = root ? stateByEditor.get(root) : null;
    const commentId = anchor.getAttribute('data-comment-id');
    if (!state || !commentId || !state.comments.has(commentId)) return;

    event.preventDefault();
    event.stopPropagation();
    activeEditorRoot = state.root;
    setPanelVisibility(state, true);
    activateThread(state, commentId);
  });

  // Undo/redo and edits change which anchors exist; keep an open panel in step.
  document.addEventListener('input', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || target.closest('.rte-comments-panel')) return;

    const root = getEditorRootFromNode(target);
    const state = root ? stateByEditor.get(root) : null;
    if (state?.panelVisible) scheduleCommentsRefresh(state);
  });

  // Remember what is selected in the text, so the panel's New button knows what to comment on even though
  // clicking the panel moves the focus out of the text. Clicking back into the text drops the memory.
  document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const root = getEditorRootFromNode(range.commonAncestorContainer);
    if (!root) return;

    activeEditorRoot = root;
    const state = stateByEditor.get(root);
    if (!state || !isRangeInsideContent(range, root)) return;
    state.savedSelection = selection.isCollapsed ? null : range.cloneRange();
  });

  // The bubble that offers "Comment" over a selection. It waits for the pointer to come up, so it does not chase
  // a drag, and follows the text when the page scrolls.
  document.addEventListener('selectionchange', scheduleBubbleUpdate);
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (event.target instanceof Node && bubble?.contains(event.target)) return;
      pointerIsDown = true;
      hideBubble();
    },
    true,
  );
  const pointerUp = () => {
    pointerIsDown = false;
    scheduleBubbleUpdate();
  };
  document.addEventListener('pointerup', pointerUp, true);
  document.addEventListener('pointercancel', pointerUp, true);
  document.addEventListener('scroll', () => bubbleRoot && scheduleBubbleUpdate(), true);
  window.addEventListener('resize', () => bubbleRoot && scheduleBubbleUpdate());

  // Cmd/Ctrl+Alt+M, as in Google Docs. By key code: with Alt held the key produces another character on a Mac.
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.code !== 'KeyM' || !event.altKey || event.shiftKey || !(event.metaKey || event.ctrlKey)) return;
      const root = event.target instanceof Node ? getEditorRootFromNode(event.target) : null;
      if (!root || !isCommentingEnabled(root)) return;
      event.preventDefault();
      event.stopPropagation();
      beginComment(root);
    },
    true,
  );

  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'Escape') return;
      const state = getActiveState();
      if (!state || !state.panelVisible) return;

      // Escape peels off one layer at a time: an open menu, then a draft, then the panel.
      if (state.closeMenu) {
        event.preventDefault();
        event.stopPropagation();
        state.closeMenu(true);
        return;
      }
      const field = event.target instanceof HTMLTextAreaElement && state.panelElement?.contains(event.target) ? event.target : null;
      if (field?.classList.contains('new-comment-textarea')) {
        event.preventDefault();
        event.stopPropagation();
        closeComposer(state);
        return;
      }
      if (field?.classList.contains('rte-comment-edit-textarea')) {
        event.preventDefault();
        event.stopPropagation();
        cancelEdit(state);
        return;
      }
      if (field?.classList.contains('rte-comment-reply-textarea') && field.value) {
        event.preventDefault();
        event.stopPropagation();
        delete state.replyTexts[field.dataset.commentId || ''];
        field.value = '';
        field.dispatchEvent(new Event('input'));
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      closePanelAndRestoreFocus(state);
    },
    true,
  );
}

/* ------------------------------------------------------------------------------------------------
 * Public API
 * ---------------------------------------------------------------------------------------------- */

/**
 * Get all comments for active editor, in document order (notes about the whole document last).
 */
export function getAllComments(): Comment[] {
  const state = getActiveState();
  if (!state) return [];
  return getCommentsInDisplayOrder(state);
}

/**
 * Create a comment on `range` (wrapping it in an anchor, one undoable step) or, with no range, a note about the
 * whole document. Returns the new id, or '' when there was nothing to comment on.
 */
function createComment(state: CommentsEditorState, author: string, text: string, range: Range | null): string {
  const trimmedText = text.trim();
  if (!trimmedText) return '';

  if (!range) {
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
    renderPanel(state);
    return commentId;
  }

  if (!isRangeInsideContent(range, state.root)) return '';

  const selectedText = range.toString().trim();
  if (!selectedText) return '';

  const commentId = nextId('comment');
  const anchorId = nextId('comment-anchor');
  const anchor = document.createElement('span');
  anchor.id = anchorId;
  anchor.className = 'rte-comment-anchor';
  anchor.setAttribute('data-comment-id', commentId);
  anchor.setAttribute('title', 'Commented text');

  const inserted = withDocumentEdit(state, () => {
    try {
      const editableRange = range.cloneRange();
      const fragment = editableRange.extractContents();
      if (!fragment.textContent?.trim()) return false;
      anchor.appendChild(fragment);
      editableRange.insertNode(anchor);
      return true;
    } catch {
      return false;
    }
  });
  if (!inserted) return '';

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
  window.getSelection()?.removeAllRanges();

  renderPanel(state);
  return commentId;
}

/**
 * Add comment (selection-based or general).
 */
export function addCommentCommand(author: string, text: string, general = false): string {
  const state = getActiveState();
  if (!state) return '';
  const range = general ? null : state.savedSelection || cloneActiveSelection(state.root);
  if (!general && !range) return '';
  return createComment(state, author, text, range);
}

export function resolveComment(commentId: string, author: string): void {
  const state = getActiveState();
  if (!state) return;

  const comment = state.comments.get(commentId);
  if (!comment) return;

  comment.resolved = true;
  comment.resolvedBy = author;
  comment.resolvedAt = new Date().toISOString();
  withDocumentEdit(state, () => updateAnchorVisualState(state, comment));
  renderPanel(state);
}

export function reopenComment(commentId: string): void {
  const state = getActiveState();
  if (!state) return;

  const comment = state.comments.get(commentId);
  if (!comment) return;

  comment.resolved = false;
  comment.resolvedBy = undefined;
  comment.resolvedAt = undefined;
  withDocumentEdit(state, () => updateAnchorVisualState(state, comment));
  renderPanel(state);
}

/**
 * Take a thread out. An anchored one has its highlight removed from the text (one undoable document step) and
 * keeps its data, so the document's own Undo brings it back; a note is dropped from memory. Returns what puts it
 * back, for the panel's own Undo.
 */
function deleteThread(state: CommentsEditorState, commentId: string): UndoEntry | null {
  const comment = state.comments.get(commentId);
  if (!comment) return null;
  if (state.activeId === commentId) setActiveThread(state, null);
  if (state.hoverId === commentId) state.hoverId = null;
  if (state.editing?.commentId === commentId) {
    state.editing = null;
    state.editDraft = '';
  }

  let entry: UndoEntry | null = null;
  if (comment.anchorId) {
    const anchor = findAnchor(state, comment);
    if (anchor) {
      const nodes = Array.from(anchor.childNodes);
      const attributes = Array.from(anchor.attributes).map((attribute) => [attribute.name, attribute.value]);
      withDocumentEdit(state, () => unwrapNode(anchor));
      entry = {
        message: 'Comment deleted',
        undo: () => {
          if (findAnchor(state, comment)) return true; // the document's Undo got there first
          const first = nodes[0];
          const parent = first?.parentNode;
          const intact =
            !!first && first.isConnected && !!parent && nodes.every((node, i) => node.parentNode === parent && (i === 0 || nodes[i - 1].nextSibling === node));
          if (!intact || !first || !parent) return false;
          const restored = document.createElement('span');
          attributes.forEach(([name, value]) => restored.setAttribute(name, value));
          withDocumentEdit(state, () => {
            parent.insertBefore(restored, first);
            nodes.forEach((node) => restored.appendChild(node));
          });
          renderPanel(state);
          return true;
        },
      };
    }
  } else {
    state.comments.delete(commentId);
    state.expandedReplies.delete(commentId);
    const draft = state.replyTexts[commentId];
    delete state.replyTexts[commentId];
    entry = {
      message: 'Note deleted',
      undo: () => {
        state.comments.set(commentId, comment);
        if (draft) state.replyTexts[commentId] = draft;
        renderPanel(state);
        return true;
      },
    };
  }
  renderPanel(state);
  return entry;
}

function deleteWithUndo(state: CommentsEditorState, commentId: string): void {
  const entry = deleteThread(state, commentId);
  if (entry) showUndo(state, entry);
}

function deleteReplyWithUndo(state: CommentsEditorState, commentId: string, replyId: string): void {
  const comment = state.comments.get(commentId);
  const index = comment ? comment.replies.findIndex((reply) => reply.id === replyId) : -1;
  if (!comment || index === -1) return;
  const [reply] = comment.replies.splice(index, 1);
  if (state.editing?.replyId === replyId) {
    state.editing = null;
    state.editDraft = '';
  }
  renderPanel(state);
  showUndo(state, {
    message: 'Reply deleted',
    undo: () => {
      comment.replies.splice(Math.min(index, comment.replies.length), 0, reply);
      renderPanel(state);
      return true;
    },
  });
}

export function deleteComment(commentId: string): void {
  const state = getActiveState();
  if (!state) return;
  deleteThread(state, commentId);
}

export function editComment(commentId: string, text: string): void {
  const state = getActiveState();
  const comment = state?.comments.get(commentId);
  const trimmed = text.trim();
  if (!state || !comment || !trimmed || comment.text === trimmed) return;
  comment.text = trimmed;
  comment.editedAt = new Date().toISOString();
  renderPanel(state);
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

  renderPanel(state);
}

export function highlightComment(commentId: string, highlight: boolean): void {
  const state = getActiveState();
  if (!state) return;
  highlightAnchor(state, commentId, highlight);
}

function ensurePanelStyles(): void {
  if (document.getElementById(COMMENTS_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = COMMENTS_STYLE_ID;
  style.textContent = COMMENTS_CSS;
  document.head.appendChild(style);
}

export const CommentsPlugin = (): Plugin => {
  // The bubble over a selection and the shortcut work before the first command has run.
  if (typeof document !== 'undefined') ensureGlobalTracking();
  return buildPlugin();
};

const buildPlugin = (): Plugin => ({
  name: 'comments',

  toolbar: [
    {
      label: 'Add Comment',
      command: 'addComment',
      type: 'button',
      // The upstream SVGRepo export used a class-based <style> block for the
      // transparent bounding rect (`.cls-1{fill:none}`). That's fine when an
      // icon is scoped (shadow DOM, or one icon per page) but this markup is
      // inserted via raw innerHTML into plain light-DOM content alongside
      // every other plugin's icons, so the <style> tag applies document-wide
      // - any other icon reusing the same auto-generated class name would
      // collide with it. Inlined the one declaration it held (fill="none")
      // directly on the rect instead, so there's nothing to leak.
      icon: '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title>add-comment</title><path d="M17.74,30,16,29l4-7h6a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H6A2,2,0,0,0,4,8V20a2,2,0,0,0,2,2h9v2H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H26a4,4,0,0,1,4,4V20a4,4,0,0,1-4,4H21.16Z"></path><polygon points="17 9 15 9 15 13 11 13 11 15 15 15 15 19 17 19 17 15 21 15 21 13 17 13 17 9"></polygon><rect fill="none" width="32" height="32"></rect></svg>',
    },
    {
      label: 'Show / Hide Comments',
      command: 'toggleComments',
      type: 'button',
      icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H4V11H8L10 13L12 11H16V1Z" fill="#000000"></path><path d="M2 5V13H7.17157L8.70711 14.5355L7.29289 15.9497L6.34315 15H0V5H2Z" fill="#000000"></path></svg>',
    },
  ],

  commands: {
    addComment: (_args: unknown, context: any) => {
      setActiveEditorRootFromCommandContext(context);
      ensureGlobalTracking();
      const state = getActiveState();
      if (!state) return false;
      beginComment(state.root);
      return true;
    },

    toggleComments: (_args: unknown, context: any) => {
      setActiveEditorRootFromCommandContext(context);
      ensureGlobalTracking();
      const state = getActiveState();
      if (!state) return false;

      setPanelVisibility(state, !state.panelVisible);
      return true;
    },
  },

  keymap: {},
});
