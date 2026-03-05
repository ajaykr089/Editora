import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_HOST_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';
const STYLE_ID = 'rte-approval-workflow-styles';
const PANEL_CLASS = 'rte-approval-panel';
const TOOLBAR_GROUP_CLASS = 'approval';
const LEGACY_TOOLBAR_GROUP_CLASS = 'approvalWorkflow';
const DARK_THEME_SELECTOR = ':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';

export type ApprovalStatus = 'draft' | 'review' | 'approved';

export interface ApprovalComment {
  id: string;
  author: string;
  message: string;
  kind: 'comment' | 'system';
  createdAt: string;
}

export interface ApprovalSignoff {
  id: string;
  author: string;
  comment?: string;
  createdAt: string;
}

export interface ApprovalWorkflowState {
  status: ApprovalStatus;
  locked: boolean;
  comments: ApprovalComment[];
  signoffs: ApprovalSignoff[];
  updatedAt: string;
}

export interface ApprovalWorkflowLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  statusLabel?: string;
  statusDraftText?: string;
  statusReviewText?: string;
  statusApprovedText?: string;
  requestReviewText?: string;
  approveText?: string;
  reopenDraftText?: string;
  addCommentText?: string;
  actorLabel?: string;
  actorPlaceholder?: string;
  commentLabel?: string;
  commentPlaceholder?: string;
  closeText?: string;
  commentsHeading?: string;
  signoffsHeading?: string;
  noCommentsText?: string;
  noSignoffsText?: string;
  summaryPrefix?: string;
  lockedSuffix?: string;
  shortcutText?: string;
  approveCommentRequiredText?: string;
}

export interface ApprovalWorkflowPluginOptions {
  defaultStatus?: ApprovalStatus;
  lockOnApproval?: boolean;
  maxHistoryEntries?: number;
  requireCommentOnApprove?: boolean;
  defaultActor?: string;
  labels?: ApprovalWorkflowLabels;
  normalizeText?: (value: string) => string;
}

interface ResolvedApprovalWorkflowOptions {
  defaultStatus: ApprovalStatus;
  lockOnApproval: boolean;
  maxHistoryEntries: number;
  requireCommentOnApprove: boolean;
  defaultActor: string;
  labels: Required<ApprovalWorkflowLabels>;
  normalizeText: (value: string) => string;
}

interface ApprovalRuntimeState extends ApprovalWorkflowState {
  originalContentEditable: string | null;
  originalReadonly: string | null;
  preApprovalContentEditable: string | null;
  preApprovalReadonly: string | null;
}

const defaultLabels: Required<ApprovalWorkflowLabels> = {
  panelTitle: 'Approval Workflow',
  panelAriaLabel: 'Approval workflow panel',
  statusLabel: 'Status',
  statusDraftText: 'Draft',
  statusReviewText: 'In Review',
  statusApprovedText: 'Approved',
  requestReviewText: 'Request Review',
  approveText: 'Approve',
  reopenDraftText: 'Reopen Draft',
  addCommentText: 'Add Comment',
  actorLabel: 'Actor',
  actorPlaceholder: 'Reviewer name',
  commentLabel: 'Comment',
  commentPlaceholder: 'Add review note or sign-off context',
  closeText: 'Close',
  commentsHeading: 'Comments',
  signoffsHeading: 'Sign-offs',
  noCommentsText: 'No comments yet.',
  noSignoffsText: 'No sign-offs yet.',
  summaryPrefix: 'Workflow',
  lockedSuffix: 'Locked',
  shortcutText: 'Shortcuts: Ctrl/Cmd+Alt+Shift+A/R/P/D',
  approveCommentRequiredText: 'Approval comment is required.',
};

const statusLabelByValue: Record<ApprovalStatus, keyof ApprovalWorkflowLabels> = {
  draft: 'statusDraftText',
  review: 'statusReviewText',
  approved: 'statusApprovedText',
};

const optionsByEditor = new WeakMap<HTMLElement, ResolvedApprovalWorkflowOptions>();
const stateByEditor = new WeakMap<HTMLElement, ApprovalRuntimeState>();
const panelByEditor = new Map<HTMLElement, HTMLElement>();
const panelVisibleByEditor = new WeakMap<HTMLElement, boolean>();
const trackedEditors = new Set<HTMLElement>();

let pluginInstanceCount = 0;
let panelSequence = 0;
let commentSequence = 0;
let signoffSequence = 0;
let fallbackOptions: ResolvedApprovalWorkflowOptions | null = null;
let lastActiveEditor: HTMLElement | null = null;

let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let globalKeydownHandler: ((event: KeyboardEvent) => void) | null = null;
let globalViewportHandler: (() => void) | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function defaultNormalizeText(value: string): string {
  return value.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeStatus(value: unknown): ApprovalStatus {
  if (value === 'review' || value === 'approved') return value;
  return 'draft';
}

function normalizeOptions(raw: ApprovalWorkflowPluginOptions = {}): ResolvedApprovalWorkflowOptions {
  return {
    defaultStatus: normalizeStatus(raw.defaultStatus),
    lockOnApproval: raw.lockOnApproval !== false,
    maxHistoryEntries: Math.max(10, Math.min(500, Number(raw.maxHistoryEntries ?? 120))),
    requireCommentOnApprove: Boolean(raw.requireCommentOnApprove),
    defaultActor: (raw.defaultActor || 'system').trim() || 'system',
    labels: {
      ...defaultLabels,
      ...(raw.labels || {}),
    },
    normalizeText: raw.normalizeText || defaultNormalizeText,
  };
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const root = editor.closest(EDITOR_HOST_SELECTOR);
  return (root as HTMLElement) || editor;
}

function resolveContentFromHost(host: Element | null): HTMLElement | null {
  if (!host) return null;
  if (host.matches(EDITOR_CONTENT_SELECTOR)) return host as HTMLElement;
  const content = host.querySelector(EDITOR_CONTENT_SELECTOR);
  return content instanceof HTMLElement ? content : null;
}

function consumeCommandEditorContext(): HTMLElement | null {
  if (typeof window === 'undefined') return null;
  const explicitContext = (window as any)[COMMAND_EDITOR_CONTEXT_KEY] as HTMLElement | null | undefined;
  if (!(explicitContext instanceof HTMLElement)) return null;
  (window as any)[COMMAND_EDITOR_CONTEXT_KEY] = null;

  const direct = resolveContentFromHost(explicitContext);
  if (direct) return direct;

  const host = explicitContext.closest(EDITOR_HOST_SELECTOR);
  if (host) {
    const content = resolveContentFromHost(host);
    if (content) return content;
  }

  return null;
}

function resolveToolbarScopeRoot(editor: HTMLElement): HTMLElement {
  const dataHost = editor.closest('[data-editora-editor]') as HTMLElement | null;
  if (dataHost && resolveContentFromHost(dataHost) === editor) {
    return dataHost;
  }

  let current: HTMLElement | null = editor;
  while (current) {
    if (current.matches(EDITOR_HOST_SELECTOR)) {
      if (current === editor || resolveContentFromHost(current) === editor) {
        return current;
      }
    }
    current = current.parentElement;
  }

  return resolveEditorRoot(editor);
}

function isThemeDarkFromElement(element: Element | null): boolean {
  if (!element) return false;
  const themeAttr = (element.getAttribute('data-theme') || element.getAttribute('theme') || '').toLowerCase();
  if (themeAttr === 'dark') return true;

  return (
    element.classList.contains('dark') ||
    element.classList.contains('editora-theme-dark') ||
    element.classList.contains('rte-theme-dark')
  );
}

function shouldUseDarkTheme(editor: HTMLElement): boolean {
  const root = resolveEditorRoot(editor);
  if (isThemeDarkFromElement(root)) return true;

  const scoped = root.closest('[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark');
  if (isThemeDarkFromElement(scoped)) return true;

  return isThemeDarkFromElement(document.documentElement) || isThemeDarkFromElement(document.body);
}

function applyThemeClass(target: HTMLElement, editor: HTMLElement): void {
  target.classList.remove('rte-approval-theme-dark');
  if (shouldUseDarkTheme(editor)) {
    target.classList.add('rte-approval-theme-dark');
  }
}

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function resolveEditorFromContext(
  context?: { editorElement?: unknown; contentElement?: unknown },
  allowFirstMatch = true,
): HTMLElement | null {
  pruneDisconnectedEditors();

  if (context?.contentElement instanceof HTMLElement) return context.contentElement;

  if (context?.editorElement instanceof HTMLElement) {
    const host = context.editorElement;
    if (host.matches(EDITOR_CONTENT_SELECTOR)) return host;
    const content = host.querySelector(EDITOR_CONTENT_SELECTOR);
    if (content instanceof HTMLElement) return content;
  }

  const explicitContext = consumeCommandEditorContext();
  if (explicitContext) return explicitContext;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const element = getElementFromNode(selection.getRangeAt(0).startContainer);
    const content = element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    if (active.matches(EDITOR_CONTENT_SELECTOR)) return active;
    const content = active.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  if (lastActiveEditor && lastActiveEditor.isConnected) return lastActiveEditor;
  if (lastActiveEditor && !lastActiveEditor.isConnected) lastActiveEditor = null;

  if (!allowFirstMatch) return null;
  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function pruneDisconnectedEditors(): void {
  const editors = Array.from(trackedEditors);
  editors.forEach((editor) => {
    if (editor.isConnected) return;
    panelByEditor.get(editor)?.remove();
    panelByEditor.delete(editor);
    panelVisibleByEditor.delete(editor);
    optionsByEditor.delete(editor);
    stateByEditor.delete(editor);
    trackedEditors.delete(editor);
    if (lastActiveEditor === editor) {
      lastActiveEditor = null;
    }
  });
}

function isKeyEventInsideEditorScope(target: HTMLElement | null): boolean {
  if (!target) return false;
  if (target.closest(`.${PANEL_CLASS}`)) return true;
  if (target.closest(EDITOR_CONTENT_SELECTOR)) return true;
  if (target.closest(EDITOR_HOST_SELECTOR)) return true;
  return false;
}

function hasSelectionInsideEditor(): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const startContainer = selection.getRangeAt(0).startContainer;
  const element = getElementFromNode(startContainer);
  return Boolean(element?.closest(EDITOR_CONTENT_SELECTOR));
}

function setCommandButtonActiveState(editor: HTMLElement, command: string, active: boolean): void {
  const root = resolveToolbarScopeRoot(editor);
  const buttons = Array.from(
    root.querySelectorAll(
      `.rte-toolbar-button[data-command="${command}"], .editora-toolbar-button[data-command="${command}"]`,
    ),
  ) as HTMLElement[];

  buttons.forEach((button) => {
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.setAttribute('data-active', active ? 'true' : 'false');
  });
}

function restoreEditableAttributes(
  editor: HTMLElement,
  contentEditable: string | null,
  readonlyValue: string | null,
): void {
  if (contentEditable !== null) {
    editor.setAttribute('contenteditable', contentEditable);
  } else {
    editor.setAttribute('contenteditable', 'true');
  }

  if (readonlyValue !== null) {
    editor.setAttribute('data-readonly', readonlyValue);
  } else {
    editor.removeAttribute('data-readonly');
  }
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
    // History plugin may not be loaded in current editor configuration.
  }
}

function makeCommentId(): string {
  commentSequence += 1;
  return `approval-comment-${Date.now().toString(36)}-${commentSequence.toString(36)}`;
}

function makeSignoffId(): string {
  signoffSequence += 1;
  return `approval-signoff-${Date.now().toString(36)}-${signoffSequence.toString(36)}`;
}

function toPublicState(state: ApprovalRuntimeState): ApprovalWorkflowState {
  return {
    status: state.status,
    locked: state.locked,
    comments: state.comments.map((item) => ({ ...item })),
    signoffs: state.signoffs.map((item) => ({ ...item })),
    updatedAt: state.updatedAt,
  };
}

function getStatusText(status: ApprovalStatus, options: ResolvedApprovalWorkflowOptions): string {
  const key = statusLabelByValue[status];
  return options.labels[key] || status;
}

function updateEditorStatusAttributes(editor: HTMLElement, state: ApprovalRuntimeState, options: ResolvedApprovalWorkflowOptions): void {
  editor.setAttribute('data-approval-status', state.status);
  editor.setAttribute('data-approval-locked', state.locked ? 'true' : 'false');
  editor.classList.toggle('rte-approval-locked-editor', state.locked);

  setCommandButtonActiveState(editor, 'toggleApprovalWorkflowPanel', isPanelVisible(editor));
  setCommandButtonActiveState(editor, 'requestApprovalReview', state.status === 'review');
  setCommandButtonActiveState(editor, 'approveDocument', state.status === 'approved');
  setCommandButtonActiveState(editor, 'reopenDraft', state.status === 'draft');

  if (state.status === 'approved' && options.lockOnApproval) {
    if (!state.locked) {
      state.preApprovalContentEditable = editor.getAttribute('contenteditable');
      state.preApprovalReadonly = editor.getAttribute('data-readonly');
    }
    editor.setAttribute('contenteditable', 'false');
    editor.setAttribute('data-readonly', 'true');
    state.locked = true;
    return;
  }

  state.locked = false;
  restoreEditableAttributes(
    editor,
    state.preApprovalContentEditable ?? state.originalContentEditable,
    state.preApprovalReadonly ?? state.originalReadonly,
  );
  state.preApprovalContentEditable = null;
  state.preApprovalReadonly = null;
}

function ensureState(editor: HTMLElement, options: ResolvedApprovalWorkflowOptions): ApprovalRuntimeState {
  let state = stateByEditor.get(editor);
  if (state) return state;

  state = {
    status: options.defaultStatus,
    locked: false,
    comments: [],
    signoffs: [],
    updatedAt: new Date().toISOString(),
    originalContentEditable: editor.getAttribute('contenteditable'),
    originalReadonly: editor.getAttribute('data-readonly'),
    preApprovalContentEditable: null,
    preApprovalReadonly: null,
  };

  stateByEditor.set(editor, state);
  trackedEditors.add(editor);
  updateEditorStatusAttributes(editor, state, options);
  return state;
}

function trimToLimit<T>(items: T[], limit: number): T[] {
  if (items.length <= limit) return items;
  return items.slice(items.length - limit);
}

function setPanelStatus(panel: HTMLElement, message: string): void {
  const live = panel.querySelector<HTMLElement>('.rte-approval-live');
  if (live) live.textContent = message;
}

function emitStateChanged(editor: HTMLElement, state: ApprovalRuntimeState): void {
  const payload = toPublicState(state);
  (editor as any).__approvalWorkflowState = payload;

  editor.dispatchEvent(
    new CustomEvent('editora:approval-state-changed', {
      bubbles: true,
      detail: {
        state: payload,
      },
    }),
  );
}

function refreshPanel(editor: HTMLElement): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;
  const state = ensureState(editor, options);

  const summary = panel.querySelector<HTMLElement>('.rte-approval-summary');
  const requestReviewButton = panel.querySelector<HTMLButtonElement>('[data-action="request-review"]');
  const approveButton = panel.querySelector<HTMLButtonElement>('[data-action="approve"]');
  const reopenButton = panel.querySelector<HTMLButtonElement>('[data-action="reopen-draft"]');
  const commentsList = panel.querySelector<HTMLElement>('.rte-approval-comments-list');
  const signoffsList = panel.querySelector<HTMLElement>('.rte-approval-signoffs-list');

  if (summary) {
    const statusText = getStatusText(state.status, options);
    summary.textContent = `${options.labels.summaryPrefix}: ${statusText} | Comments: ${state.comments.length} | Sign-offs: ${
      state.signoffs.length
    }${state.locked ? ` | ${options.labels.lockedSuffix}` : ''}`;
  }

  if (requestReviewButton) requestReviewButton.disabled = state.status !== 'draft';
  if (approveButton) approveButton.disabled = state.status === 'approved';
  if (reopenButton) reopenButton.disabled = state.status === 'draft';

  if (commentsList) {
    if (state.comments.length === 0) {
      commentsList.innerHTML = `<li class="rte-approval-empty">${escapeHtml(options.labels.noCommentsText)}</li>`;
    } else {
      commentsList.innerHTML = state.comments
        .slice()
        .reverse()
        .map(
          (item) => `
            <li class="rte-approval-item rte-approval-item-${item.kind}" role="listitem">
              <div class="rte-approval-item-head">
                <span class="rte-approval-item-author">${escapeHtml(item.author)}</span>
                <time class="rte-approval-item-time" datetime="${escapeHtml(item.createdAt)}">${escapeHtml(
                  new Date(item.createdAt).toLocaleString(),
                )}</time>
              </div>
              <p class="rte-approval-item-message">${escapeHtml(item.message)}</p>
            </li>
          `,
        )
        .join('');
    }
  }

  if (signoffsList) {
    if (state.signoffs.length === 0) {
      signoffsList.innerHTML = `<li class="rte-approval-empty">${escapeHtml(options.labels.noSignoffsText)}</li>`;
    } else {
      signoffsList.innerHTML = state.signoffs
        .slice()
        .reverse()
        .map(
          (item) => `
            <li class="rte-approval-item" role="listitem">
              <div class="rte-approval-item-head">
                <span class="rte-approval-item-author">${escapeHtml(item.author)}</span>
                <time class="rte-approval-item-time" datetime="${escapeHtml(item.createdAt)}">${escapeHtml(
                  new Date(item.createdAt).toLocaleString(),
                )}</time>
              </div>
              <p class="rte-approval-item-message">${escapeHtml(item.comment || 'Approved')}</p>
            </li>
          `,
        )
        .join('');
    }
  }
}

function updateState(editor: HTMLElement, state: ApprovalRuntimeState, options: ResolvedApprovalWorkflowOptions): void {
  state.updatedAt = new Date().toISOString();
  updateEditorStatusAttributes(editor, state, options);
  refreshPanel(editor);
  emitStateChanged(editor, state);
}

function addSystemComment(state: ApprovalRuntimeState, options: ResolvedApprovalWorkflowOptions, author: string, message: string): void {
  state.comments.push({
    id: makeCommentId(),
    author: author || options.defaultActor,
    message,
    kind: 'system',
    createdAt: new Date().toISOString(),
  });
  state.comments = trimToLimit(state.comments, options.maxHistoryEntries);
}

function setStatus(editor: HTMLElement, status: ApprovalStatus, options: ResolvedApprovalWorkflowOptions, author: string): boolean {
  const state = ensureState(editor, options);
  if (state.status === status) return false;

  const beforeHTML = editor.innerHTML;
  state.status = status;

  if (status === 'review') {
    addSystemComment(state, options, author, 'Review requested.');
  } else if (status === 'draft') {
    addSystemComment(state, options, author, 'Returned to draft.');
  }

  updateState(editor, state, options);
  dispatchEditorInput(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
  return true;
}

function addComment(editor: HTMLElement, message: string, author: string, options: ResolvedApprovalWorkflowOptions): boolean {
  const text = options.normalizeText(message);
  if (!text) return false;

  const actor = options.normalizeText(author) || options.defaultActor;
  const state = ensureState(editor, options);
  const beforeHTML = editor.innerHTML;

  state.comments.push({
    id: makeCommentId(),
    author: actor,
    message: text,
    kind: 'comment',
    createdAt: new Date().toISOString(),
  });
  state.comments = trimToLimit(state.comments, options.maxHistoryEntries);

  updateState(editor, state, options);
  dispatchEditorInput(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
  return true;
}

function approve(editor: HTMLElement, options: ResolvedApprovalWorkflowOptions, author: string, comment: string): boolean {
  const actor = options.normalizeText(author) || options.defaultActor;
  const note = options.normalizeText(comment);
  if (options.requireCommentOnApprove && !note) return false;

  const state = ensureState(editor, options);
  const beforeHTML = editor.innerHTML;

  state.status = 'approved';
  state.signoffs.push({
    id: makeSignoffId(),
    author: actor,
    comment: note || undefined,
    createdAt: new Date().toISOString(),
  });
  state.signoffs = trimToLimit(state.signoffs, options.maxHistoryEntries);

  if (note) {
    state.comments.push({
      id: makeCommentId(),
      author: actor,
      message: note,
      kind: 'system',
      createdAt: new Date().toISOString(),
    });
    state.comments = trimToLimit(state.comments, options.maxHistoryEntries);
  }

  updateState(editor, state, options);
  dispatchEditorInput(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
  return true;
}

function getPanelField(panel: HTMLElement, name: string): HTMLInputElement | HTMLTextAreaElement | null {
  return panel.querySelector(`[data-field="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
}

function readPanelValues(panel: HTMLElement): { actor: string; comment: string } {
  const actor = (getPanelField(panel, 'actor') as HTMLInputElement | null)?.value || '';
  const comment = (getPanelField(panel, 'comment') as HTMLTextAreaElement | null)?.value || '';
  return { actor, comment };
}

function positionPanel(editor: HTMLElement, panel: HTMLElement): void {
  if (!panel.classList.contains('show')) return;
  const root = resolveEditorRoot(editor);
  const rect = root.getBoundingClientRect();

  const width = Math.min(window.innerWidth - 20, 420);
  const maxLeft = Math.max(10, window.innerWidth - width - 10);
  const left = Math.min(Math.max(10, rect.right - width), maxLeft);
  const top = Math.max(10, Math.min(window.innerHeight - 10 - 280, rect.top + 12));

  panel.style.width = `${width}px`;
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.maxHeight = `${Math.max(280, window.innerHeight - 24)}px`;
}

function ensurePanel(editor: HTMLElement): HTMLElement {
  const existing = panelByEditor.get(editor);
  if (existing) return existing;

  const options = optionsByEditor.get(editor) || fallbackOptions || normalizeOptions();
  const panelId = `rte-approval-panel-${panelSequence++}`;

  const panel = document.createElement('section');
  panel.className = PANEL_CLASS;
  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);
  panel.setAttribute('tabindex', '-1');

  panel.innerHTML = `
    <header class="rte-approval-header">
      <h2 class="rte-approval-title">${escapeHtml(options.labels.panelTitle)}</h2>
      <button type="button" class="rte-approval-icon-btn" data-action="close" aria-label="${escapeHtml(
        options.labels.closeText,
      )}">✕</button>
    </header>
    <div class="rte-approval-body">
      <p class="rte-approval-summary" aria-live="polite"></p>

      <div class="rte-approval-controls" role="toolbar" aria-label="Approval actions">
        <button type="button" class="rte-approval-btn" data-action="request-review">${escapeHtml(
          options.labels.requestReviewText,
        )}</button>
        <button type="button" class="rte-approval-btn rte-approval-btn-primary" data-action="approve">${escapeHtml(
          options.labels.approveText,
        )}</button>
        <button type="button" class="rte-approval-btn" data-action="reopen-draft">${escapeHtml(
          options.labels.reopenDraftText,
        )}</button>
      </div>

      <div class="rte-approval-form">
        <label class="rte-approval-label">
          ${escapeHtml(options.labels.actorLabel)}
          <input type="text" data-field="actor" class="rte-approval-field" autocomplete="off" placeholder="${escapeHtml(
            options.labels.actorPlaceholder,
          )}" />
        </label>
        <label class="rte-approval-label">
          ${escapeHtml(options.labels.commentLabel)}
          <textarea data-field="comment" class="rte-approval-field" rows="2" placeholder="${escapeHtml(
            options.labels.commentPlaceholder,
          )}"></textarea>
        </label>
        <button type="button" class="rte-approval-btn" data-action="add-comment">${escapeHtml(
          options.labels.addCommentText,
        )}</button>
      </div>

      <section class="rte-approval-section" aria-label="${escapeHtml(options.labels.commentsHeading)}">
        <h3 class="rte-approval-section-title">${escapeHtml(options.labels.commentsHeading)}</h3>
        <ul class="rte-approval-comments-list" role="list"></ul>
      </section>

      <section class="rte-approval-section" aria-label="${escapeHtml(options.labels.signoffsHeading)}">
        <h3 class="rte-approval-section-title">${escapeHtml(options.labels.signoffsHeading)}</h3>
        <ul class="rte-approval-signoffs-list" role="list"></ul>
      </section>

      <p class="rte-approval-shortcut">${escapeHtml(options.labels.shortcutText)}</p>
      <span class="rte-approval-live" aria-live="polite"></span>
    </div>
  `;

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const actionEl = target.closest('[data-action]') as HTMLElement | null;
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action') || '';
    const resolvedOptions = optionsByEditor.get(editor) || fallbackOptions || options;
    optionsByEditor.set(editor, resolvedOptions);
    ensureState(editor, resolvedOptions);

    if (action === 'close') {
      hidePanel(editor, true);
      return;
    }

    const values = readPanelValues(panel);

    if (action === 'request-review') {
      const changed = setStatus(editor, 'review', resolvedOptions, values.actor || resolvedOptions.defaultActor);
      if (changed) setPanelStatus(panel, 'Status changed to review.');
      return;
    }

    if (action === 'reopen-draft') {
      const changed = setStatus(editor, 'draft', resolvedOptions, values.actor || resolvedOptions.defaultActor);
      if (changed) setPanelStatus(panel, 'Status changed to draft.');
      return;
    }

    if (action === 'approve') {
      const approved = approve(editor, resolvedOptions, values.actor, values.comment);
      if (!approved && resolvedOptions.requireCommentOnApprove) {
        setPanelStatus(panel, resolvedOptions.labels.approveCommentRequiredText);
        return;
      }

      if (approved) {
        const commentField = getPanelField(panel, 'comment') as HTMLTextAreaElement | null;
        if (commentField) commentField.value = '';
        setPanelStatus(panel, 'Document approved and signed off.');
      }
      return;
    }

    if (action === 'add-comment') {
      const added = addComment(editor, values.comment, values.actor, resolvedOptions);
      if (!added) return;
      const commentField = getPanelField(panel, 'comment') as HTMLTextAreaElement | null;
      if (commentField) commentField.value = '';
      setPanelStatus(panel, 'Comment added.');
      return;
    }
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      hidePanel(editor, true);
    }
  });

  applyThemeClass(panel, editor);
  document.body.appendChild(panel);

  panelByEditor.set(editor, panel);
  panelVisibleByEditor.set(editor, false);
  refreshPanel(editor);

  return panel;
}

function isPanelVisible(editor: HTMLElement): boolean {
  return panelVisibleByEditor.get(editor) === true;
}

function showPanel(editor: HTMLElement): void {
  pruneDisconnectedEditors();
  const panel = ensurePanel(editor);

  panelByEditor.forEach((_panel, currentEditor) => {
    if (currentEditor === editor) return;
    hidePanel(currentEditor, false);
  });

  panel.classList.add('show');
  panelVisibleByEditor.set(editor, true);
  setCommandButtonActiveState(editor, 'toggleApprovalWorkflowPanel', true);

  applyThemeClass(panel, editor);
  positionPanel(editor, panel);
  refreshPanel(editor);
}

function hidePanel(editor: HTMLElement, focusEditor = false): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;
  panel.classList.remove('show');
  panelVisibleByEditor.set(editor, false);
  setCommandButtonActiveState(editor, 'toggleApprovalWorkflowPanel', false);

  if (focusEditor) editor.focus({ preventScroll: true });
}

function togglePanel(editor: HTMLElement, explicit?: boolean): boolean {
  const visible = isPanelVisible(editor);
  const next = typeof explicit === 'boolean' ? explicit : !visible;
  if (next) showPanel(editor);
  else hidePanel(editor);
  return true;
}

function isToggleShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'a';
}

function isRequestReviewShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'r';
}

function isApproveShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'p';
}

function isReopenShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'd';
}

function bindGlobalHandlers(options: ResolvedApprovalWorkflowOptions): void {
  fallbackOptions = options;

  if (!globalFocusInHandler) {
    globalFocusInHandler = (event: FocusEvent) => {
      pruneDisconnectedEditors();
      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      lastActiveEditor = editor;
      const resolved = optionsByEditor.get(editor) || options;
      optionsByEditor.set(editor, resolved);
      ensureState(editor, resolved);

      const panel = panelByEditor.get(editor);
      if (panel) {
        applyThemeClass(panel, editor);
        positionPanel(editor, panel);
      }
    };
    document.addEventListener('focusin', globalFocusInHandler, true);
  }

  if (!globalKeydownHandler) {
    globalKeydownHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const isToggle = isToggleShortcut(event);
      const isRequestReview = isRequestReviewShortcut(event);
      const isApprove = isApproveShortcut(event);
      const isReopen = isReopenShortcut(event);
      const isEscape = event.key === 'Escape';

      if (!isEscape && !isToggle && !isRequestReview && !isApprove && !isReopen) {
        return;
      }

      pruneDisconnectedEditors();
      const target = event.target as HTMLElement | null;
      const inPanelInput = Boolean(target?.closest(`.${PANEL_CLASS} input, .${PANEL_CLASS} textarea, .${PANEL_CLASS} select`));
      const keyEventInScope = isKeyEventInsideEditorScope(target);
      if (!keyEventInScope && !hasSelectionInsideEditor()) {
        return;
      }

      const editor = resolveEditorFromContext(undefined, false);
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || fallbackOptions || options;
      optionsByEditor.set(editor, resolved);
      const state = ensureState(editor, resolved);
      lastActiveEditor = editor;

      if (isEscape && isPanelVisible(editor)) {
        event.preventDefault();
        hidePanel(editor, true);
        return;
      }

      if (inPanelInput) return;

      if (isToggle) {
        event.preventDefault();
        event.stopPropagation();
        togglePanel(editor);
        return;
      }

      if (isRequestReview) {
        event.preventDefault();
        event.stopPropagation();
        if (setStatus(editor, 'review', resolved, resolved.defaultActor)) {
          showPanel(editor);
        }
        return;
      }

      if (isApprove) {
        event.preventDefault();
        event.stopPropagation();
        if (approve(editor, resolved, resolved.defaultActor, 'Approved via keyboard shortcut.')) {
          showPanel(editor);
        }
        return;
      }

      if (isReopen) {
        event.preventDefault();
        event.stopPropagation();
        if (state.status !== 'draft' && setStatus(editor, 'draft', resolved, resolved.defaultActor)) {
          showPanel(editor);
        }
      }
    };
    document.addEventListener('keydown', globalKeydownHandler, true);
  }

  if (!globalViewportHandler) {
    globalViewportHandler = () => {
      pruneDisconnectedEditors();
      panelByEditor.forEach((panel, editor) => {
        if (!editor.isConnected || !panel.isConnected) return;
        applyThemeClass(panel, editor);
        positionPanel(editor, panel);
      });
    };
    window.addEventListener('scroll', globalViewportHandler, true);
    window.addEventListener('resize', globalViewportHandler);
  }
}

function restoreEditorRuntimeState(editor: HTMLElement): void {
  const state = stateByEditor.get(editor);
  if (!state) return;

  editor.classList.remove('rte-approval-locked-editor');
  editor.removeAttribute('data-approval-status');
  editor.removeAttribute('data-approval-locked');

  restoreEditableAttributes(
    editor,
    state.preApprovalContentEditable ?? state.originalContentEditable,
    state.preApprovalReadonly ?? state.originalReadonly,
  );
}

function unbindGlobalHandlers(): void {
  if (globalFocusInHandler) {
    document.removeEventListener('focusin', globalFocusInHandler, true);
    globalFocusInHandler = null;
  }

  if (globalKeydownHandler) {
    document.removeEventListener('keydown', globalKeydownHandler, true);
    globalKeydownHandler = null;
  }

  if (globalViewportHandler) {
    window.removeEventListener('scroll', globalViewportHandler, true);
    window.removeEventListener('resize', globalViewportHandler);
    globalViewportHandler = null;
  }

  panelByEditor.forEach((panel) => panel.remove());
  panelByEditor.clear();

  trackedEditors.forEach((editor) => restoreEditorRuntimeState(editor));
  trackedEditors.clear();

  fallbackOptions = null;
  lastActiveEditor = null;
}

function ensureStylesInjected(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-button {
      border: none;
      border-radius: 0;
      border-right: 1px solid #ccc;
    }

    .rte-toolbar-button[data-command="toggleApprovalWorkflowPanel"].active,
    .editora-toolbar-button[data-command="toggleApprovalWorkflowPanel"].active,
    .rte-toolbar-button[data-command="reopenDraft"].active,
    .editora-toolbar-button[data-command="reopenDraft"].active {
      background-color: #ccc;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-button[data-command="toggleApprovalWorkflowPanel"].active,
    ${DARK_THEME_SELECTOR} .editora-toolbar-button[data-command="toggleApprovalWorkflowPanel"].active,
    ${DARK_THEME_SELECTOR} .rte-toolbar-button[data-command="reopenDraft"].active,
    ${DARK_THEME_SELECTOR} .editora-toolbar-button[data-command="reopenDraft"].active {
      background: linear-gradient(180deg, #5eaaf6 0%, #4a95de 100%);
    }

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    .${PANEL_CLASS}.rte-approval-theme-dark {
      border-color: #566275;
    }
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-button svg,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-button svg,
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-button svg,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-button svg
    {
      fill: none;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-button
    {
      border-color: #566275;
    }

    .rte-approval-locked-editor {
      background-image: repeating-linear-gradient(
        -45deg,
        rgba(30, 64, 175, 0.04),
        rgba(30, 64, 175, 0.04) 8px,
        rgba(30, 64, 175, 0.08) 8px,
        rgba(30, 64, 175, 0.08) 16px
      );
    }

    .${PANEL_CLASS} {
      position: fixed;
      z-index: 1500;
      right: 16px;
      top: 16px;
      width: min(420px, calc(100vw - 20px));
      max-height: calc(100vh - 24px);
      display: none;
      flex-direction: column;
      border-radius: 12px;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.16);
      overflow: hidden;
    }

    .${PANEL_CLASS}.show {
      display: flex;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark {
      background: #0f172a;
      color: #e2e8f0;
      border-color: #334155;
      box-shadow: 0 20px 40px rgba(2, 6, 23, 0.5);
    }

    .rte-approval-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-header {
      border-bottom-color: #334155;
      background: #111827;
    }

    .rte-approval-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }

    .rte-approval-icon-btn {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      border-radius: 6px;
      cursor: pointer;
      min-width: 34px;
      min-height: 34px;
      width: 34px;
      height: 34px;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
    }

    .rte-approval-icon-btn:hover,
    .rte-approval-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-icon-btn:hover,
    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-approval-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-approval-summary {
      margin: 0;
      font-size: 12px;
      color: #475569;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-summary {
      color: #94a3b8;
    }

    .rte-approval-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .rte-approval-btn {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-approval-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .rte-approval-btn:hover:not(:disabled),
    .rte-approval-btn:focus-visible:not(:disabled) {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2);
    }

    .rte-approval-btn-primary {
      background: #1d4ed8;
      border-color: #1d4ed8;
      color: #ffffff;
    }

    .rte-approval-btn-primary:hover:not(:disabled),
    .rte-approval-btn-primary:focus-visible:not(:disabled) {
      background: #1e40af;
      border-color: #1e40af;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-btn {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-btn-primary {
      border-color: #2563eb;
      background: #2563eb;
      color: #ffffff;
    }

    .rte-approval-form {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-form {
      border-color: #334155;
    }

    .rte-approval-label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .rte-approval-field {
      width: 100%;
      box-sizing: border-box;
      min-height: 30px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: inherit;
      font-size: 13px;
      padding: 6px 8px;
    }

    .rte-approval-field:focus-visible {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2);
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-field {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-approval-section {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-section {
      border-color: #334155;
    }

    .rte-approval-section-title {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
    }

    .rte-approval-comments-list,
    .rte-approval-signoffs-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 150px;
      overflow: auto;
    }

    .rte-approval-item {
      border: 1px solid #dbeafe;
      background: #eff6ff;
      border-radius: 8px;
      padding: 6px;
    }

    .rte-approval-item-comment {
      border-color: #e2e8f0;
      background: #f8fafc;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-item {
      border-color: #334155;
      background: #111827;
    }

    .rte-approval-item-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 4px;
    }

    .rte-approval-item-author {
      font-size: 12px;
      font-weight: 700;
    }

    .rte-approval-item-time {
      font-size: 11px;
      color: #64748b;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-item-time {
      color: #94a3b8;
    }

    .rte-approval-item-message {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      white-space: pre-wrap;
    }

    .rte-approval-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-empty {
      border-color: #334155;
      color: #94a3b8;
    }

    .rte-approval-shortcut {
      margin: 0;
      font-size: 11px;
      color: #64748b;
    }

    .${PANEL_CLASS}.rte-approval-theme-dark .rte-approval-shortcut {
      color: #94a3b8;
    }

    .rte-approval-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    @media (max-width: 768px) {
      .${PANEL_CLASS} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }
    }
  `;

  document.head.appendChild(style);
}

export const ApprovalWorkflowPlugin = (rawOptions: ApprovalWorkflowPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  ensureStylesInjected();

  return {
    name: 'approvalWorkflow',

    toolbar: [
      {
        id: 'approvalWorkflowGroup',
        label: 'Approval',
        type: 'group',
        command: 'approvalWorkflow',
        items: [
          {
            id: 'approvalWorkflow',
            label: 'Approval Workflow',
            command: 'toggleApprovalWorkflowPanel',
            shortcut: 'Mod-Alt-Shift-a',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M8 10h8M8 14h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="m16.5 16 1.8 1.8 3.2-3.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          },
          {
            id: 'approvalRequestReview',
            label: 'Request Review',
            command: 'requestApprovalReview',
            shortcut: 'Mod-Alt-Shift-r',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.7"/><path d="M11 8v3l2 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17.5 17.5 20 20" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
          },
          {
            id: 'approvalApprove',
            label: 'Approve',
            command: 'approveDocument',
            shortcut: 'Mod-Alt-Shift-p',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M5 12.5 9.5 17 19 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="3.8" y="3.8" width="16.4" height="16.4" rx="3" stroke="currentColor" stroke-width="1.4"/></svg>',
          },
          {
            id: 'approvalReopen',
            label: 'Reopen Draft',
            command: 'reopenDraft',
            shortcut: 'Mod-Alt-Shift-d',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8 8H4v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M5 12a7 7 0 1 0 2-4.95" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
          },
        ],
      },
    ],

    commands: {
      approvalWorkflow: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);
        ensureState(editor, resolved);

        lastActiveEditor = editor;
        showPanel(editor);
        refreshPanel(editor);
        return true;
      },

      toggleApprovalWorkflowPanel: (value?: boolean, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);
        ensureState(editor, resolved);

        lastActiveEditor = editor;
        return togglePanel(editor, typeof value === 'boolean' ? value : undefined);
      },

      requestApprovalReview: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);
        ensureState(editor, resolved);

        const changed = setStatus(editor, 'review', resolved, resolved.defaultActor);
        showPanel(editor);
        return changed;
      },

      approveDocument: (
        value?: { author?: string; comment?: string } | string,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);
        ensureState(editor, resolved);

        const author = typeof value === 'object' && value ? String(value.author || '') : resolved.defaultActor;
        const comment =
          typeof value === 'object' && value
            ? String(value.comment || '')
            : typeof value === 'string'
              ? value
              : '';
        const approved = approve(editor, resolved, author, comment);
        if (approved) showPanel(editor);
        return approved;
      },

      reopenDraft: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);
        ensureState(editor, resolved);

        const changed = setStatus(editor, 'draft', resolved, resolved.defaultActor);
        if (changed) showPanel(editor);
        return changed;
      },

      addApprovalComment: (
        value?: { author?: string; message?: string } | string,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);
        ensureState(editor, resolved);

        const author = typeof value === 'object' && value ? String(value.author || '') : resolved.defaultActor;
        const message =
          typeof value === 'object' && value
            ? String(value.message || '')
            : typeof value === 'string'
              ? value
              : '';

        const added = addComment(editor, message, author, resolved);
        if (added) showPanel(editor);
        return added;
      },

      setApprovalStatus: (
        value?: ApprovalStatus,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || !value) return false;
        const status = normalizeStatus(value);

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);
        ensureState(editor, resolved);

        const changed = setStatus(editor, status, resolved, resolved.defaultActor);
        if (changed) showPanel(editor);
        return changed;
      },

      setApprovalWorkflowOptions: (
        value?: Partial<ApprovalWorkflowPluginOptions>,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || !value || typeof value !== 'object') return false;

        const current = optionsByEditor.get(editor) || options;
        const merged = normalizeOptions({
          ...current,
          ...value,
          labels: {
            ...current.labels,
            ...(value.labels || {}),
          },
          normalizeText: value.normalizeText || current.normalizeText,
        });

        optionsByEditor.set(editor, merged);
        const state = ensureState(editor, merged);
        updateState(editor, state, merged);
        return true;
      },

      getApprovalWorkflowState: (
        value?: unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);
        const state = ensureState(editor, resolved);
        const payload = toPublicState(state);

        if (typeof value === 'function') {
          try {
            (value as (state: ApprovalWorkflowState) => void)(payload);
          } catch {
            // Keep command deterministic if callback fails.
          }
        }

        (editor as any).__approvalWorkflowState = payload;
        editor.dispatchEvent(
          new CustomEvent('editora:approval-state', {
            bubbles: true,
            detail: {
              state: payload,
            },
          }),
        );

        return true;
      },
    },

    keymap: {
      'Mod-Alt-Shift-a': 'toggleApprovalWorkflowPanel',
      'Mod-Alt-Shift-A': 'toggleApprovalWorkflowPanel',
      'Mod-Alt-Shift-r': 'requestApprovalReview',
      'Mod-Alt-Shift-R': 'requestApprovalReview',
      'Mod-Alt-Shift-p': 'approveDocument',
      'Mod-Alt-Shift-P': 'approveDocument',
      'Mod-Alt-Shift-d': 'reopenDraft',
      'Mod-Alt-Shift-D': 'reopenDraft',
    },

    init: function init(this: any, context?: { editorElement?: HTMLElement }) {
      pluginInstanceCount += 1;

      const runtimeConfig =
        this && typeof this.__pluginConfig === 'object'
          ? normalizeOptions({ ...options, ...(this.__pluginConfig as ApprovalWorkflowPluginOptions) })
          : options;

      bindGlobalHandlers(runtimeConfig);

      const editor = resolveEditorFromContext(
        context?.editorElement ? { editorElement: context.editorElement } : undefined,
        false,
      );
      if (!editor) return;

      optionsByEditor.set(editor, runtimeConfig);
      ensureState(editor, runtimeConfig);
      lastActiveEditor = editor;
      refreshPanel(editor);
    },

    destroy: () => {
      pluginInstanceCount = Math.max(0, pluginInstanceCount - 1);
      if (pluginInstanceCount > 0) return;
      unbindGlobalHandlers();
    },
  };
};
