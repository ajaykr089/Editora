import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_HOST_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';
const STYLE_ID = 'rte-content-rules-styles';
const PANEL_CLASS = 'rte-content-rules-panel';
const DARK_THEME_SELECTOR = ':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';

export type ContentRulesSeverity = 'error' | 'warning' | 'info';

export interface ContentRuleIssue {
  id: string;
  ruleId: string;
  severity: ContentRulesSeverity;
  message: string;
  excerpt?: string;
  suggestion?: string;
  locateText?: string;
  selector?: string;
}

export interface ContentRulesLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  runAuditText?: string;
  realtimeOnText?: string;
  realtimeOffText?: string;
  closeText?: string;
  noIssuesText?: string;
  summaryPrefix?: string;
  locateText?: string;
  bannedWordMessage?: string;
  requiredHeadingMessage?: string;
  sentenceLengthMessage?: string;
  readabilityMessage?: string;
}

export interface ContentRulesContext {
  editor: HTMLElement;
  editorRoot: HTMLElement;
  text: string;
  html: string;
  wordCount: number;
  sentenceCount: number;
  readabilityScore: number;
}

export interface ContentRuleDefinition {
  id: string;
  severity?: ContentRulesSeverity;
  evaluate: (context: ContentRulesContext) => ContentRuleIssue[] | Promise<ContentRuleIssue[]>;
}

export interface ContentRulesPluginOptions {
  bannedWords?: string[];
  requiredHeadings?: string[];
  maxSentenceWords?: number;
  minReadabilityScore?: number;
  maxIssues?: number;
  debounceMs?: number;
  enableRealtime?: boolean;
  labels?: ContentRulesLabels;
  normalizeText?: (value: string) => string;
  customRules?: ContentRuleDefinition[];
}

interface ResolvedContentRulesOptions {
  bannedWords: string[];
  requiredHeadings: string[];
  maxSentenceWords: number;
  minReadabilityScore: number;
  maxIssues: number;
  debounceMs: number;
  enableRealtime: boolean;
  labels: Required<ContentRulesLabels>;
  normalizeText: (value: string) => string;
  customRules: ContentRuleDefinition[];
}

interface AuditMetrics {
  readabilityScore: number;
  wordCount: number;
  sentenceCount: number;
}

const defaultLabels: Required<ContentRulesLabels> = {
  panelTitle: 'Content Rules',
  panelAriaLabel: 'Content rules panel',
  runAuditText: 'Run Audit',
  realtimeOnText: 'Realtime On',
  realtimeOffText: 'Realtime Off',
  closeText: 'Close',
  noIssuesText: 'No rule violations detected.',
  summaryPrefix: 'Issues',
  locateText: 'Locate',
  bannedWordMessage: 'Banned word found',
  requiredHeadingMessage: 'Missing required heading',
  sentenceLengthMessage: 'Sentence is too long',
  readabilityMessage: 'Readability score is below threshold',
};

const optionsByEditor = new WeakMap<HTMLElement, ResolvedContentRulesOptions>();
const issuesByEditor = new WeakMap<HTMLElement, ContentRuleIssue[]>();
const auditMetricsByEditor = new WeakMap<HTMLElement, AuditMetrics>();
const realtimeEnabledByEditor = new WeakMap<HTMLElement, boolean>();
const debounceTimerByEditor = new WeakMap<HTMLElement, number>();
const snapshotByEditor = new WeakMap<HTMLElement, string>();
const scanVersionByEditor = new WeakMap<HTMLElement, number>();
const panelByEditor = new Map<HTMLElement, HTMLElement>();
const panelVisibleByEditor = new WeakMap<HTMLElement, boolean>();
const activeDebounceTimers = new Set<number>();

let pluginInstanceCount = 0;
let panelSequence = 0;
let fallbackOptions: ResolvedContentRulesOptions | null = null;
let lastActiveEditor: HTMLElement | null = null;

let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let globalInputHandler: ((event: Event) => void) | null = null;
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

function mergeLabels(labels?: ContentRulesLabels): Required<ContentRulesLabels> {
  return {
    ...defaultLabels,
    ...(labels || {}),
  };
}

function defaultNormalizeText(value: string): string {
  return value.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeList(values?: string[]): string[] {
  if (!values) return [];
  const unique = new Set<string>();

  values.forEach((value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    unique.add(trimmed);
  });

  return Array.from(unique);
}

function normalizeOptions(raw: ContentRulesPluginOptions = {}): ResolvedContentRulesOptions {
  return {
    bannedWords: normalizeList(raw.bannedWords),
    requiredHeadings: normalizeList(raw.requiredHeadings),
    maxSentenceWords: Math.max(8, Number(raw.maxSentenceWords ?? 32)),
    minReadabilityScore: Math.max(0, Math.min(120, Number(raw.minReadabilityScore ?? 55))),
    maxIssues: Math.max(1, Number(raw.maxIssues ?? 100)),
    debounceMs: Math.max(50, Number(raw.debounceMs ?? 220)),
    enableRealtime: raw.enableRealtime !== false,
    labels: mergeLabels(raw.labels),
    normalizeText: raw.normalizeText || defaultNormalizeText,
    customRules: Array.isArray(raw.customRules) ? raw.customRules : [],
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
  target.classList.remove('rte-content-rules-theme-dark');
  if (shouldUseDarkTheme(editor)) {
    target.classList.add('rte-content-rules-theme-dark');
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
    const node = selection.getRangeAt(0).startContainer;
    const element = getElementFromNode(node);
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
  if (lastActiveEditor && !lastActiveEditor.isConnected) {
    lastActiveEditor = null;
  }
  if (!allowFirstMatch) return null;

  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function isEditorReadonly(editor: HTMLElement): boolean {
  return editor.getAttribute('contenteditable') === 'false' || editor.getAttribute('data-readonly') === 'true';
}

function getEditorPlainText(editor: HTMLElement, normalizeText: (value: string) => string): string {
  const source = editor.innerText || editor.textContent || '';
  return normalizeText(source);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function countWords(text: string): number {
  const words = text.match(/\b[\w'-]+\b/g);
  return words ? words.length : 0;
}

function countSentences(text: string): number {
  const matches = text.match(/[^.!?]+[.!?]*/g);
  if (!matches) return 0;
  return matches.map((part) => part.trim()).filter(Boolean).length;
}

function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  const vowelGroups = clean.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;

  if (clean.endsWith('e')) {
    count -= 1;
  }

  return Math.max(1, count);
}

function computeReadabilityScore(text: string): number {
  const words: string[] = text.match(/\b[\w'-]+\b/g) || [];
  const wordCount = words.length;
  if (wordCount === 0) return 100;

  const sentenceCount = Math.max(1, countSentences(text));
  const syllableCount = words.reduce((total, word) => total + countSyllables(word), 0);

  const score =
    206.835 -
    1.015 * (wordCount / sentenceCount) -
    84.6 * (syllableCount / Math.max(1, wordCount));

  return Number.isFinite(score) ? Math.max(0, Math.min(120, score)) : 0;
}

function createIssueId(ruleId: string, index: number): string {
  return `${ruleId}-${index}`;
}

function limitReached(issues: ContentRuleIssue[], maxIssues: number): boolean {
  return issues.length >= maxIssues;
}

function pushIssue(issues: ContentRuleIssue[], issue: ContentRuleIssue, maxIssues: number): void {
  if (limitReached(issues, maxIssues)) return;
  issues.push(issue);
}

function truncate(value: string, limit = 140): string {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trimEnd()}...`;
}

function normalizeIssue(
  issue: ContentRuleIssue,
  fallbackRuleId: string,
  fallbackSeverity: ContentRulesSeverity,
  index: number,
): ContentRuleIssue {
  return {
    id: issue.id || createIssueId(fallbackRuleId, index),
    ruleId: issue.ruleId || fallbackRuleId,
    severity: issue.severity || fallbackSeverity,
    message: issue.message || fallbackRuleId,
    excerpt: issue.excerpt ? truncate(issue.excerpt, 220) : undefined,
    suggestion: issue.suggestion,
    locateText: issue.locateText,
    selector: issue.selector,
  };
}

function collectHeadingSet(editor: HTMLElement, normalizeText: (value: string) => string): Set<string> {
  const headings = Array.from(editor.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6'));
  const set = new Set<string>();

  headings.forEach((heading) => {
    const value = normalizeText(heading.textContent || '').toLowerCase();
    if (!value) return;
    set.add(value);
  });

  return set;
}

function getSentenceCandidates(text: string): string[] {
  const candidates = text.match(/[^.!?\n]+[.!?]?/g);
  if (!candidates) return [];
  return candidates.map((item) => item.trim()).filter(Boolean);
}

async function runAudit(editor: HTMLElement, options: ResolvedContentRulesOptions, force = false): Promise<ContentRuleIssue[]> {
  const text = getEditorPlainText(editor, options.normalizeText);
  const html = editor.innerHTML;
  const snapshot = `${text.length}:${hashString(text)}:${html.length}:${hashString(html)}`;

  if (!force && snapshotByEditor.get(editor) === snapshot) {
    return issuesByEditor.get(editor) || [];
  }

  const nextVersion = (scanVersionByEditor.get(editor) || 0) + 1;
  scanVersionByEditor.set(editor, nextVersion);

  const wordCount = countWords(text);
  const sentenceCount = countSentences(text);
  const readabilityScore = computeReadabilityScore(text);

  const issues: ContentRuleIssue[] = [];
  const labels = options.labels;

  if (options.bannedWords.length > 0) {
    let bannedIndex = 0;

    for (const bannedWord of options.bannedWords) {
      const regex = new RegExp(`\\b${escapeRegex(bannedWord)}\\b`, 'gi');
      let match = regex.exec(text);
      while (match && !limitReached(issues, options.maxIssues)) {
        const located = match[0];
        pushIssue(
          issues,
          {
            id: createIssueId('banned-word', bannedIndex),
            ruleId: 'banned-word',
            severity: 'error',
            message: `${labels.bannedWordMessage}: "${located}"`,
            locateText: located,
            suggestion: 'Replace or remove banned terms.',
          },
          options.maxIssues,
        );
        bannedIndex += 1;
        match = regex.exec(text);
      }

      if (limitReached(issues, options.maxIssues)) break;
    }
  }

  if (!limitReached(issues, options.maxIssues) && options.requiredHeadings.length > 0) {
    const headingSet = collectHeadingSet(editor, options.normalizeText);
    let missingIndex = 0;

    options.requiredHeadings.forEach((heading) => {
      if (limitReached(issues, options.maxIssues)) return;
      const normalized = options.normalizeText(heading).toLowerCase();
      if (!normalized || headingSet.has(normalized)) return;

      pushIssue(
        issues,
        {
          id: createIssueId('required-heading', missingIndex),
          ruleId: 'required-heading',
          severity: 'warning',
          message: `${labels.requiredHeadingMessage}: "${heading}"`,
          suggestion: `Add a heading named "${heading}".`,
        },
        options.maxIssues,
      );
      missingIndex += 1;
    });
  }

  if (!limitReached(issues, options.maxIssues)) {
    const sentences = getSentenceCandidates(text);
    let longSentenceIndex = 0;

    for (const sentence of sentences) {
      if (limitReached(issues, options.maxIssues)) break;
      const sentenceWords = countWords(sentence);
      if (sentenceWords <= options.maxSentenceWords) continue;

      pushIssue(
        issues,
        {
          id: createIssueId('sentence-length', longSentenceIndex),
          ruleId: 'sentence-length',
          severity: 'warning',
          message: `${labels.sentenceLengthMessage} (${sentenceWords}/${options.maxSentenceWords} words)`,
          excerpt: truncate(sentence, 200),
          locateText: sentence.slice(0, 64),
          suggestion: 'Split into shorter sentences for readability.',
        },
        options.maxIssues,
      );
      longSentenceIndex += 1;
    }
  }

  if (!limitReached(issues, options.maxIssues) && wordCount > 0 && readabilityScore < options.minReadabilityScore) {
    pushIssue(
      issues,
      {
        id: createIssueId('readability', 0),
        ruleId: 'readability',
        severity: 'info',
        message: `${labels.readabilityMessage}: ${readabilityScore.toFixed(1)} < ${options.minReadabilityScore}`,
        suggestion: 'Use shorter sentences and simpler wording.',
      },
      options.maxIssues,
    );
  }

  if (!limitReached(issues, options.maxIssues) && options.customRules.length > 0) {
    const context: ContentRulesContext = {
      editor,
      editorRoot: resolveEditorRoot(editor),
      text,
      html,
      wordCount,
      sentenceCount,
      readabilityScore,
    };

    for (const rule of options.customRules) {
      if (limitReached(issues, options.maxIssues)) break;

      try {
        const result = await rule.evaluate(context);
        if (!Array.isArray(result)) continue;

        for (let index = 0; index < result.length; index += 1) {
          if (limitReached(issues, options.maxIssues)) break;
          pushIssue(
            issues,
            normalizeIssue(result[index], rule.id, rule.severity || 'warning', index),
            options.maxIssues,
          );
        }
      } catch {
        // Ignore custom rule failures so base auditing remains stable.
      }
    }
  }

  if (scanVersionByEditor.get(editor) !== nextVersion) {
    return issuesByEditor.get(editor) || [];
  }

  const metrics: AuditMetrics = {
    readabilityScore,
    wordCount,
    sentenceCount,
  };

  snapshotByEditor.set(editor, snapshot);
  issuesByEditor.set(editor, issues);
  auditMetricsByEditor.set(editor, metrics);
  refreshPanel(editor);

  editor.dispatchEvent(
    new CustomEvent('editora:content-rules-audit', {
      bubbles: true,
      detail: {
        issues,
        metrics,
      },
    }),
  );

  return issues;
}

function getSeverityCounts(issues: ContentRuleIssue[]): { error: number; warning: number; info: number } {
  return issues.reduce(
    (counts, issue) => {
      counts[issue.severity] += 1;
      return counts;
    },
    { error: 0, warning: 0, info: 0 },
  );
}

function severityLabel(severity: ContentRulesSeverity): string {
  if (severity === 'error') return 'Error';
  if (severity === 'warning') return 'Warning';
  return 'Info';
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
    button.setAttribute('data-active', active ? 'true' : 'false');
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function isPanelVisible(editor: HTMLElement): boolean {
  return panelVisibleByEditor.get(editor) === true;
}

function positionPanel(editor: HTMLElement, panel: HTMLElement): void {
  if (!panel.classList.contains('show')) return;

  const root = resolveEditorRoot(editor);
  const rootRect = root.getBoundingClientRect();
  const panelWidth = Math.min(window.innerWidth - 20, 360);

  panel.style.width = `${panelWidth}px`;
  panel.style.maxHeight = `${Math.max(220, window.innerHeight - 24)}px`;

  const preferredLeft = Math.max(10, rootRect.right - panelWidth);
  const maxLeft = Math.max(10, window.innerWidth - panelWidth - 10);
  const left = Math.min(preferredLeft, maxLeft);
  const top = Math.max(10, Math.min(window.innerHeight - 10 - 240, rootRect.top + 10));

  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function locateTextInEditor(editor: HTMLElement, text: string): boolean {
  const targetText = text.trim().toLowerCase();
  if (!targetText) return false;

  const selection = window.getSelection();
  if (!selection) return false;

  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null);
  let node = walker.nextNode() as Text | null;

  while (node) {
    const value = node.data;
    const index = value.toLowerCase().indexOf(targetText);
    if (index !== -1) {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, Math.min(node.length, index + targetText.length));

      selection.removeAllRanges();
      selection.addRange(range);

      const parent = node.parentElement;
      if (parent) {
        parent.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }

      editor.focus({ preventScroll: true });
      return true;
    }

    node = walker.nextNode() as Text | null;
  }

  return false;
}

function locateIssue(editor: HTMLElement, issue: ContentRuleIssue): boolean {
  if (issue.selector) {
    const target = editor.querySelector(issue.selector) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      target.focus({ preventScroll: true });
      return true;
    }
  }

  if (issue.locateText && locateTextInEditor(editor, issue.locateText)) {
    return true;
  }

  if (issue.excerpt && locateTextInEditor(editor, issue.excerpt.slice(0, 64))) {
    return true;
  }

  return false;
}

function getIssueById(editor: HTMLElement, issueId: string): ContentRuleIssue | undefined {
  const issues = issuesByEditor.get(editor) || [];
  return issues.find((item) => item.id === issueId);
}

function getRealtimeEnabled(editor: HTMLElement, options?: ResolvedContentRulesOptions): boolean {
  const stored = realtimeEnabledByEditor.get(editor);
  if (typeof stored === 'boolean') return stored;
  return options ? options.enableRealtime : true;
}

function updateRealtimeButtonText(editor: HTMLElement, panel: HTMLElement, options: ResolvedContentRulesOptions): void {
  const realtimeButton = panel.querySelector<HTMLButtonElement>('[data-action="toggle-realtime"]');
  if (!realtimeButton) return;

  const enabled = getRealtimeEnabled(editor, options);
  realtimeButton.textContent = enabled ? options.labels.realtimeOnText : options.labels.realtimeOffText;
  realtimeButton.setAttribute('aria-pressed', enabled ? 'true' : 'false');

  setCommandButtonActiveState(editor, 'toggleContentRulesRealtime', enabled);
}

function refreshPanel(editor: HTMLElement): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;

  const issues = issuesByEditor.get(editor) || [];
  const metrics = auditMetricsByEditor.get(editor) || {
    readabilityScore: 100,
    wordCount: 0,
    sentenceCount: 0,
  };

  const countEl = panel.querySelector<HTMLElement>('.rte-content-rules-count');
  const summaryEl = panel.querySelector<HTMLElement>('.rte-content-rules-summary');
  const listEl = panel.querySelector<HTMLElement>('.rte-content-rules-list');
  const liveEl = panel.querySelector<HTMLElement>('.rte-content-rules-live');

  if (!countEl || !summaryEl || !listEl || !liveEl) return;

  const counts = getSeverityCounts(issues);
  countEl.textContent = String(issues.length);
  summaryEl.textContent = `${options.labels.summaryPrefix}: ${issues.length} | Error ${counts.error} | Warning ${counts.warning} | Info ${counts.info} | Readability ${metrics.readabilityScore.toFixed(1)}`;
  liveEl.textContent = `${issues.length} issues. ${counts.error} errors, ${counts.warning} warnings, ${counts.info} info.`;

  if (issues.length === 0) {
    listEl.innerHTML = `<li class="rte-content-rules-empty">${escapeHtml(options.labels.noIssuesText)}</li>`;
    return;
  }

  listEl.innerHTML = issues
    .map((issue) => {
      const excerpt = issue.excerpt ? `<p class="rte-content-rules-excerpt">${escapeHtml(issue.excerpt)}</p>` : '';
      const suggestion = issue.suggestion ? `<p class="rte-content-rules-suggestion">${escapeHtml(issue.suggestion)}</p>` : '';
      const locateLabel = `${options.labels.locateText}: ${issue.message}`;

      return `
        <li class="rte-content-rules-item rte-content-rules-item-${issue.severity}">
          <button
            type="button"
            class="rte-content-rules-item-btn"
            data-action="focus-issue"
            data-issue-id="${escapeHtml(issue.id)}"
            data-role="issue-button"
            aria-label="${escapeHtml(locateLabel)}"
          >
            <span class="rte-content-rules-badge">${escapeHtml(severityLabel(issue.severity))}</span>
            <span class="rte-content-rules-message">${escapeHtml(issue.message)}</span>
          </button>
          ${excerpt}
          ${suggestion}
        </li>
      `;
    })
    .join('');
}

function hidePanel(editor: HTMLElement, focusEditor = false): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  panel.classList.remove('show');
  panelVisibleByEditor.set(editor, false);
  setCommandButtonActiveState(editor, 'toggleContentRulesPanel', false);

  if (focusEditor) {
    editor.focus({ preventScroll: true });
  }
}

function hidePanelsExcept(activeEditor: HTMLElement): void {
  panelByEditor.forEach((_panel, editor) => {
    if (editor === activeEditor) return;
    hidePanel(editor, false);
  });
}

function ensurePanel(editor: HTMLElement): HTMLElement {
  const existing = panelByEditor.get(editor);
  if (existing) return existing;

  const options = optionsByEditor.get(editor) || fallbackOptions || normalizeOptions();
  const panelId = `rte-content-rules-panel-${panelSequence++}`;

  const panel = document.createElement('section');
  panel.className = PANEL_CLASS;
  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);
  panel.innerHTML = `
    <header class="rte-content-rules-header">
      <h2 class="rte-content-rules-title">${escapeHtml(options.labels.panelTitle)}</h2>
      <button type="button" class="rte-content-rules-icon-btn" data-action="close" aria-label="${escapeHtml(options.labels.closeText)}">✕</button>
    </header>
    <div class="rte-content-rules-body">
      <div class="rte-content-rules-topline">
        <p class="rte-content-rules-summary" aria-live="polite"></p>
        <span class="rte-content-rules-count" aria-hidden="true">0</span>
      </div>
      <div class="rte-content-rules-controls" role="toolbar" aria-label="Content rules controls">
        <button type="button" class="rte-content-rules-btn rte-content-rules-btn-primary" data-action="run-audit">${escapeHtml(options.labels.runAuditText)}</button>
        <button type="button" class="rte-content-rules-btn" data-action="toggle-realtime" aria-pressed="false"></button>
      </div>
      <ul class="rte-content-rules-list" role="list" aria-label="Detected content rule issues"></ul>
      <p class="rte-content-rules-shortcut">Shortcut: Ctrl/Cmd + Alt + Shift + R</p>
      <span class="rte-content-rules-live" aria-live="polite"></span>
    </div>
  `;

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const actionElement = target?.closest<HTMLElement>('[data-action]');
    if (!actionElement) return;

    const action = actionElement.getAttribute('data-action');
    if (!action) return;

    if (action === 'close') {
      hidePanel(editor, true);
      return;
    }

    if (action === 'run-audit') {
      const resolved = optionsByEditor.get(editor) || fallbackOptions || options;
      void runAudit(editor, resolved, true);
      return;
    }

    if (action === 'toggle-realtime') {
      const current = getRealtimeEnabled(editor, optionsByEditor.get(editor) || fallbackOptions || options);
      const next = !current;
      realtimeEnabledByEditor.set(editor, next);
      updateRealtimeButtonText(editor, panel, optionsByEditor.get(editor) || fallbackOptions || options);
      if (next) {
        const resolved = optionsByEditor.get(editor) || fallbackOptions || options;
        void runAudit(editor, resolved, true);
      }
      return;
    }

    if (action === 'focus-issue') {
      const issueId = actionElement.getAttribute('data-issue-id') || '';
      const issue = getIssueById(editor, issueId);
      if (!issue) return;

      locateIssue(editor, issue);
      hidePanel(editor, false);
    }
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      hidePanel(editor, true);
      return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    const focusableIssues = Array.from(panel.querySelectorAll<HTMLButtonElement>('[data-role="issue-button"]'));
    if (focusableIssues.length === 0) return;

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = focusableIssues.findIndex((button) => button === active);
    if (currentIndex === -1) return;

    event.preventDefault();
    const offset = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + offset + focusableIssues.length) % focusableIssues.length;
    focusableIssues[nextIndex].focus();
  });

  applyThemeClass(panel, editor);
  document.body.appendChild(panel);

  panelByEditor.set(editor, panel);
  panelVisibleByEditor.set(editor, false);
  updateRealtimeButtonText(editor, panel, options);

  return panel;
}

function showPanel(editor: HTMLElement): void {
  const panel = ensurePanel(editor);
  hidePanelsExcept(editor);

  panel.classList.add('show');
  panelVisibleByEditor.set(editor, true);
  applyThemeClass(panel, editor);
  positionPanel(editor, panel);

  refreshPanel(editor);
  setCommandButtonActiveState(editor, 'toggleContentRulesPanel', true);

  const firstButton = panel.querySelector<HTMLButtonElement>('[data-action="run-audit"]');
  firstButton?.focus();
}

function togglePanel(editor: HTMLElement, explicitValue?: boolean): boolean {
  const currentlyVisible = isPanelVisible(editor);
  const nextVisible = typeof explicitValue === 'boolean' ? explicitValue : !currentlyVisible;

  if (nextVisible) {
    showPanel(editor);
  } else {
    hidePanel(editor, false);
  }

  return true;
}

function clearDebounceTimer(editor: HTMLElement): void {
  const existing = debounceTimerByEditor.get(editor);
  if (typeof existing === 'number') {
    window.clearTimeout(existing);
    activeDebounceTimers.delete(existing);
    debounceTimerByEditor.delete(editor);
  }
}

function scheduleRealtimeAudit(editor: HTMLElement): void {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;
  if (!getRealtimeEnabled(editor, options)) return;

  clearDebounceTimer(editor);
  const timer = window.setTimeout(() => {
    activeDebounceTimers.delete(timer);
    debounceTimerByEditor.delete(editor);
    void runAudit(editor, options, false);
  }, options.debounceMs);

  activeDebounceTimers.add(timer);
  debounceTimerByEditor.set(editor, timer);
}

function isOpenPanelShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'r';
}

function isRunAuditShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'l';
}

function isToggleRealtimeShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 't';
}

function ensureStylesInjected(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .rte-toolbar-group-items.content-rules,
    .editora-toolbar-group-items.content-rules {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
    }

    .rte-toolbar-group-items.content-rules .rte-toolbar-button,
    .editora-toolbar-group-items.content-rules .editora-toolbar-button {
      border: none;
      border-radius: 0px; 
    }

    .rte-toolbar-group-items.content-rules .rte-toolbar-button,
    .editora-toolbar-group-items.content-rules .editora-toolbar-button {
      border-right: 1px solid #ccc;
    }
    .rte-toolbar-group-items.content-rules .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.content-rules .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }
    .rte-toolbar-button[data-command="toggleContentRulesRealtime"].active,
    .editora-toolbar-button[data-command="toggleContentRulesRealtime"].active {
      background-color: rgba(22, 163, 74, 0.1);
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.content-rules,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.content-rules,
    .${PANEL_CLASS}.rte-content-rules-theme-dark {
      border-color: rgba(148, 163, 184, 0.34);
      background: rgba(30, 41, 59, 0.9);
    }
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.content-rules .rte-toolbar-button,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.content-rules .editora-toolbar-button
    {
      border-color: #566275;
    }
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.content-rules .rte-toolbar-button svg{
      fill: none;
    }
    .${PANEL_CLASS} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(360px, calc(100vw - 20px));
      max-height: calc(100vh - 20px);
      border: 1px solid #d1d5db;
      border-radius: 14px;
      background: #ffffff;
      color: #111827;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.25);
      overflow: hidden;
    }

    .${PANEL_CLASS}.show {
      display: flex;
      flex-direction: column;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 20px 46px rgba(2, 6, 23, 0.68);
    }

    .rte-content-rules-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-content-rules-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-content-rules-icon-btn {
      width: 34px;
      height: 34px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      color: #0f172a;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .rte-content-rules-icon-btn:hover,
    .rte-content-rules-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-icon-btn:hover,
    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-content-rules-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-content-rules-topline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .rte-content-rules-summary {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
      flex: 1;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-summary {
      color: #94a3b8;
    }

    .rte-content-rules-count {
      min-width: 32px;
      height: 32px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-count {
      border-color: #334155;
      background: #111827;
      color: #cbd5e1;
    }

    .rte-content-rules-controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .rte-content-rules-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      height: 34px;
      padding: 0 10px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-content-rules-btn:hover,
    .rte-content-rules-btn:focus-visible {
      border-color: #94a3b8;
      background: #f8fafc;
      outline: none;
    }

    .rte-content-rules-btn-primary {
      border-color: #0284c7;
      background: #0ea5e9;
      color: #f8fafc;
    }

    .rte-content-rules-btn-primary:hover,
    .rte-content-rules-btn-primary:focus-visible {
      border-color: #0369a1;
      background: #0284c7;
      color: #ffffff;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-btn:hover,
    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-btn:focus-visible {
      border-color: #475569;
      background: #1e293b;
    }

    .rte-content-rules-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: min(55vh, 420px);
      overflow: auto;
    }

    .rte-content-rules-item {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
      background: #ffffff;
    }

    .rte-content-rules-item-error {
      border-color: #fca5a5;
      background: #fef2f2;
    }

    .rte-content-rules-item-warning {
      border-color: #fcd34d;
      background: #fffbeb;
    }

    .rte-content-rules-item-info {
      border-color: #93c5fd;
      background: #eff6ff;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-item {
      border-color: #334155;
      background: #0b1220;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-item-error {
      border-color: #7f1d1d;
      background: #2b0b11;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-item-warning {
      border-color: #78350f;
      background: #2b1907;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-item-info {
      border-color: #1d4ed8;
      background: #0a162f;
    }

    .rte-content-rules-item-btn {
      width: 100%;
      border: none;
      background: transparent;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      text-align: left;
      padding: 0;
      color: inherit;
      cursor: pointer;
    }

    .rte-content-rules-item-btn:focus-visible {
      outline: 2px solid #0284c7;
      outline-offset: 3px;
      border-radius: 6px;
    }

    .rte-content-rules-badge {
      flex: 0 0 auto;
      margin-top: 1px;
      border-radius: 999px;
      border: 1px solid currentColor;
      padding: 1px 8px;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.3;
      text-transform: uppercase;
      opacity: 0.86;
    }

    .rte-content-rules-message {
      font-size: 13px;
      line-height: 1.35;
      font-weight: 600;
    }

    .rte-content-rules-excerpt,
    .rte-content-rules-suggestion {
      margin: 8px 0 0;
      font-size: 12px;
      line-height: 1.35;
      color: #334155;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-excerpt,
    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-suggestion {
      color: #94a3b8;
    }

    .rte-content-rules-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 10px;
      font-size: 13px;
      color: #475569;
      background: #f8fafc;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-empty {
      border-color: #334155;
      background: #0b1220;
      color: #94a3b8;
    }

    .rte-content-rules-shortcut {
      margin: 2px 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .${PANEL_CLASS}.rte-content-rules-theme-dark .rte-content-rules-shortcut {
      color: #94a3b8;
    }

    .rte-content-rules-live {
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

      .rte-content-rules-list {
        max-height: 45vh;
      }
    }
  `;

  document.head.appendChild(style);
}

function bindGlobalHandlers(options: ResolvedContentRulesOptions): void {
  fallbackOptions = options;

  if (!globalFocusInHandler) {
    globalFocusInHandler = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      lastActiveEditor = editor;

      if (!optionsByEditor.has(editor)) {
        optionsByEditor.set(editor, options);
      }

      if (!issuesByEditor.has(editor)) {
        issuesByEditor.set(editor, []);
      }

      if (!realtimeEnabledByEditor.has(editor)) {
        realtimeEnabledByEditor.set(editor, options.enableRealtime);
      }

      const panel = panelByEditor.get(editor);
      if (panel) {
        applyThemeClass(panel, editor);
        positionPanel(editor, panel);
        updateRealtimeButtonText(editor, panel, optionsByEditor.get(editor) || options);
      }

      setCommandButtonActiveState(editor, 'toggleContentRulesPanel', isPanelVisible(editor));
      setCommandButtonActiveState(editor, 'toggleContentRulesRealtime', getRealtimeEnabled(editor, options));
    };

    document.addEventListener('focusin', globalFocusInHandler, true);
  }

  if (!globalInputHandler) {
    globalInputHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      lastActiveEditor = editor;
      scheduleRealtimeAudit(editor);
    };

    document.addEventListener('input', globalInputHandler, true);
  }

  if (!globalKeydownHandler) {
    globalKeydownHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;

      const editor = resolveEditorFromContext(undefined, false);
      if (!editor || isEditorReadonly(editor)) return;

      const resolvedOptions = optionsByEditor.get(editor) || fallbackOptions || options;
      optionsByEditor.set(editor, resolvedOptions);
      lastActiveEditor = editor;

      if (event.key === 'Escape' && isPanelVisible(editor)) {
        event.preventDefault();
        hidePanel(editor, true);
        return;
      }

      if (isOpenPanelShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        togglePanel(editor);
        return;
      }

      if (isRunAuditShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        void runAudit(editor, resolvedOptions, true);
        showPanel(editor);
        return;
      }

      if (isToggleRealtimeShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        const next = !getRealtimeEnabled(editor, resolvedOptions);
        realtimeEnabledByEditor.set(editor, next);

        const panel = panelByEditor.get(editor);
        if (panel) {
          updateRealtimeButtonText(editor, panel, resolvedOptions);
        }

        setCommandButtonActiveState(editor, 'toggleContentRulesRealtime', next);

        if (next) {
          void runAudit(editor, resolvedOptions, true);
        }
      }
    };

    document.addEventListener('keydown', globalKeydownHandler, true);
  }

  if (!globalViewportHandler) {
    globalViewportHandler = () => {
      panelByEditor.forEach((panel, editor) => {
        if (!editor.isConnected || !panel.isConnected) {
          clearDebounceTimer(editor);
          panel.remove();
          panelByEditor.delete(editor);
          panelVisibleByEditor.delete(editor);
          return;
        }

        applyThemeClass(panel, editor);
        positionPanel(editor, panel);
      });
    };

    window.addEventListener('scroll', globalViewportHandler, true);
    window.addEventListener('resize', globalViewportHandler);
  }
}

function unbindGlobalHandlers(): void {
  if (globalFocusInHandler) {
    document.removeEventListener('focusin', globalFocusInHandler, true);
    globalFocusInHandler = null;
  }

  if (globalInputHandler) {
    document.removeEventListener('input', globalInputHandler, true);
    globalInputHandler = null;
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

  panelByEditor.forEach((panel) => {
    panel.remove();
  });
  panelByEditor.clear();

  fallbackOptions = null;
  lastActiveEditor = null;
}

export const ContentRulesPlugin = (rawOptions: ContentRulesPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  ensureStylesInjected();

  return {
    name: 'contentRules',

    toolbar: [
      {
        id: 'contentRulesGroup',
        label: 'Content Rules',
        type: 'group',
        command: 'contentRules',
        items: [
          {
            id: 'contentRules',
            label: 'Content Rules',
            command: 'toggleContentRulesPanel',
            shortcut: 'Mod-Alt-Shift-r',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 3h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 2v4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 11h8M8 15h8M8 19h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
          },
          {
            id: 'contentRulesAudit',
            label: 'Run Rules Audit',
            command: 'runContentRulesAudit',
            shortcut: 'Mod-Alt-Shift-l',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 12h4l2 5 4-10 2 5h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>',
          },
          {
            id: 'contentRulesRealtime',
            label: 'Toggle Realtime Rules',
            command: 'toggleContentRulesRealtime',
            shortcut: 'Mod-Alt-Shift-t',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/></svg>',
          },
        ],
      },
    ],

    commands: {
      contentRules: (_args?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        const resolvedOptions = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolvedOptions);

        lastActiveEditor = editor;
        togglePanel(editor, true);
        void runAudit(editor, resolvedOptions, false);
        return true;
      },

      toggleContentRulesPanel: (
        value?: boolean,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        lastActiveEditor = editor;

        const resolvedOptions = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolvedOptions);

        const toggled = togglePanel(editor, typeof value === 'boolean' ? value : undefined);

        if (isPanelVisible(editor)) {
          void runAudit(editor, resolvedOptions, false);
        }

        return toggled;
      },

      runContentRulesAudit: async (
        _value?: unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        lastActiveEditor = editor;
        const resolvedOptions = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolvedOptions);

        await runAudit(editor, resolvedOptions, true);
        showPanel(editor);
        return true;
      },

      toggleContentRulesRealtime: (
        value?: boolean,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        lastActiveEditor = editor;
        const resolvedOptions = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolvedOptions);
        const next = typeof value === 'boolean' ? value : !getRealtimeEnabled(editor, resolvedOptions);
        realtimeEnabledByEditor.set(editor, next);

        const panel = panelByEditor.get(editor);
        if (panel) {
          updateRealtimeButtonText(editor, panel, resolvedOptions);
        }

        setCommandButtonActiveState(editor, 'toggleContentRulesRealtime', next);

        if (next) {
          void runAudit(editor, resolvedOptions, true);
        }

        return true;
      },

      getContentRulesIssues: (
        value?: unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const issues = issuesByEditor.get(editor) || [];
        if (typeof value === 'function') {
          try {
            (value as (issues: ContentRuleIssue[]) => void)(issues);
          } catch {
            // Ignore callback errors to keep command deterministic.
          }
        }
        (editor as any).__contentRulesIssues = issues;
        editor.dispatchEvent(
          new CustomEvent('editora:content-rules-issues', {
            bubbles: true,
            detail: { issues },
          }),
        );

        return true;
      },

      setContentRulesOptions: (
        value?: Partial<ContentRulesPluginOptions>,
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
        });

        optionsByEditor.set(editor, merged);
        if (typeof value.enableRealtime === 'boolean') {
          realtimeEnabledByEditor.set(editor, value.enableRealtime);
        }

        if (getRealtimeEnabled(editor, merged)) {
          void runAudit(editor, merged, true);
        }

        const panel = panelByEditor.get(editor);
        if (panel) {
          panel.setAttribute('aria-label', merged.labels.panelAriaLabel);
          const title = panel.querySelector<HTMLElement>('.rte-content-rules-title');
          if (title) title.textContent = merged.labels.panelTitle;
          updateRealtimeButtonText(editor, panel, merged);
          refreshPanel(editor);
        }

        return true;
      },
    },

    keymap: {
      'Mod-Alt-Shift-r': 'toggleContentRulesPanel',
      'Mod-Alt-Shift-R': 'toggleContentRulesPanel',
      'Mod-Alt-Shift-l': 'runContentRulesAudit',
      'Mod-Alt-Shift-L': 'runContentRulesAudit',
      'Mod-Alt-Shift-t': 'toggleContentRulesRealtime',
      'Mod-Alt-Shift-T': 'toggleContentRulesRealtime',
    },

    init: function init(this: any, context?: { editorElement?: HTMLElement }) {
      pluginInstanceCount += 1;

      const runtimeConfig =
        this && typeof this.__pluginConfig === 'object'
          ? normalizeOptions({ ...options, ...(this.__pluginConfig as ContentRulesPluginOptions) })
          : options;

      bindGlobalHandlers(runtimeConfig);

      const editor = resolveEditorFromContext(
        context && context.editorElement
          ? { editorElement: context.editorElement }
          : undefined,
        false,
      );

      if (!editor) return;

      lastActiveEditor = editor;
      optionsByEditor.set(editor, runtimeConfig);
      realtimeEnabledByEditor.set(editor, runtimeConfig.enableRealtime);
      issuesByEditor.set(editor, []);
      setCommandButtonActiveState(editor, 'toggleContentRulesPanel', false);
      setCommandButtonActiveState(editor, 'toggleContentRulesRealtime', runtimeConfig.enableRealtime);

      if (runtimeConfig.enableRealtime) {
        scheduleRealtimeAudit(editor);
      }
    },

    destroy: () => {
      pluginInstanceCount = Math.max(0, pluginInstanceCount - 1);

      if (pluginInstanceCount > 0) return;

      activeDebounceTimers.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      activeDebounceTimers.clear();

      unbindGlobalHandlers();
    },
  };
};
