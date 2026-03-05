import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_HOST_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';
const STYLE_ID = 'rte-translation-workflow-styles';
const PANEL_CLASS = 'rte-translation-workflow-panel';
const TOOLBAR_GROUP_CLASS = 'translation-workflow';
const LEGACY_TOOLBAR_GROUP_CLASS = 'translationWorkflow';
const DARK_THEME_SELECTOR = ':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';

const DEFAULT_SEGMENT_SELECTOR = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'td',
  'th',
  'blockquote',
  'figcaption',
].join(', ');

const NAVIGATION_KEYS = new Set(['ArrowUp', 'ArrowDown', 'Home', 'End']);

export type TranslationWorkflowIssueType =
  | 'missing-target'
  | 'token-mismatch'
  | 'untranslated'
  | 'length-out-of-range';
export type TranslationWorkflowIssueSeverity = 'error' | 'warning' | 'info';

export interface TranslationWorkflowIssue {
  id: string;
  type: TranslationWorkflowIssueType;
  severity: TranslationWorkflowIssueSeverity;
  message: string;
  segmentId?: string;
  sourceText?: string;
  targetText?: string;
  suggestion?: string;
}

export interface TranslationWorkflowSegment {
  id: string;
  tagName: string;
  index: number;
  text: string;
  sourceText: string;
  locked: boolean;
}

export interface TranslationWorkflowSegmentState {
  id: string;
  tagName: string;
  index: number;
  sourceLength: number;
  targetLength: number;
  locked: boolean;
}

export interface TranslationWorkflowLocaleRule {
  locale: string;
  label?: string;
  minLengthRatio?: number;
  maxLengthRatio?: number;
  requireDifferentFromSource?: boolean;
  preserveTokens?: boolean;
}

export interface TranslationWorkflowLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  sourceLocaleLabel?: string;
  targetLocaleLabel?: string;
  validateText?: string;
  captureSourceText?: string;
  lockSelectedText?: string;
  unlockSelectedText?: string;
  lockSegmentAriaLabel?: string;
  unlockSegmentAriaLabel?: string;
  realtimeOnText?: string;
  realtimeOffText?: string;
  closeText?: string;
  summaryPrefix?: string;
  noIssuesText?: string;
  issuesLabel?: string;
  segmentsLabel?: string;
  sourcePreviewLabel?: string;
  targetPreviewLabel?: string;
  helperText?: string;
  shortcutText?: string;
  readonlySegmentMessage?: string;
  sourceCapturedMessage?: string;
  selectedSegmentPrefix?: string;
  missingTargetMessage?: string;
  tokenMismatchMessage?: string;
  untranslatedMessage?: string;
  lengthOutOfRangeMessage?: string;
}

export interface TranslationWorkflowPluginOptions {
  sourceLocale?: string;
  targetLocale?: string;
  locales?: string[];
  localeRules?: TranslationWorkflowLocaleRule[];
  enableRealtime?: boolean;
  debounceMs?: number;
  maxIssues?: number;
  maxSegments?: number;
  minSourceLengthForRatio?: number;
  segmentSelector?: string;
  labels?: TranslationWorkflowLabels;
  normalizeText?: (value: string) => string;
}

export interface TranslationWorkflowRuntimeState {
  sourceLocale: string;
  targetLocale: string;
  realtimeEnabled: boolean;
  selectedSegmentId: string | null;
  segmentCount: number;
  lockedSegmentCount: number;
  issues: TranslationWorkflowIssue[];
  segments: TranslationWorkflowSegmentState[];
  lastRunAt: string | null;
}

interface ResolvedTranslationWorkflowLocaleRule {
  locale: string;
  label: string;
  minLengthRatio: number;
  maxLengthRatio: number;
  requireDifferentFromSource: boolean;
  preserveTokens: boolean;
}

interface ResolvedTranslationWorkflowOptions {
  sourceLocale: string;
  targetLocale: string;
  locales: string[];
  localeRules: ResolvedTranslationWorkflowLocaleRule[];
  enableRealtime: boolean;
  debounceMs: number;
  maxIssues: number;
  maxSegments: number;
  minSourceLengthForRatio: number;
  segmentSelector: string;
  labels: Required<TranslationWorkflowLabels>;
  normalizeText: (value: string) => string;
}

interface TranslationWorkflowEditorState {
  sourceLocale: string;
  targetLocale: string;
  selectedSegmentId: string | null;
  realtimeEnabled: boolean;
  segments: TranslationWorkflowSegment[];
  issues: TranslationWorkflowIssue[];
  sourceTextBySegmentId: Map<string, string>;
  lockedSegmentIds: Set<string>;
  lockedHtmlBySegmentId: Map<string, string>;
  snapshot: string;
  lastRunAt: string | null;
}

const defaultLocaleRules: ResolvedTranslationWorkflowLocaleRule[] = [
  {
    locale: 'en',
    label: 'English',
    minLengthRatio: 0.6,
    maxLengthRatio: 1.4,
    requireDifferentFromSource: false,
    preserveTokens: true,
  },
  {
    locale: 'fr',
    label: 'French',
    minLengthRatio: 0.75,
    maxLengthRatio: 1.7,
    requireDifferentFromSource: true,
    preserveTokens: true,
  },
  {
    locale: 'de',
    label: 'German',
    minLengthRatio: 0.8,
    maxLengthRatio: 1.9,
    requireDifferentFromSource: true,
    preserveTokens: true,
  },
  {
    locale: 'es',
    label: 'Spanish',
    minLengthRatio: 0.7,
    maxLengthRatio: 1.7,
    requireDifferentFromSource: true,
    preserveTokens: true,
  },
  {
    locale: 'it',
    label: 'Italian',
    minLengthRatio: 0.7,
    maxLengthRatio: 1.7,
    requireDifferentFromSource: true,
    preserveTokens: true,
  },
  {
    locale: 'ja',
    label: 'Japanese',
    minLengthRatio: 0.45,
    maxLengthRatio: 1.2,
    requireDifferentFromSource: true,
    preserveTokens: true,
  },
  {
    locale: 'zh',
    label: 'Chinese',
    minLengthRatio: 0.4,
    maxLengthRatio: 1.2,
    requireDifferentFromSource: true,
    preserveTokens: true,
  },
];

const defaultLabels: Required<TranslationWorkflowLabels> = {
  panelTitle: 'Translation Workflow',
  panelAriaLabel: 'Translation workflow panel',
  sourceLocaleLabel: 'Source Locale',
  targetLocaleLabel: 'Target Locale',
  validateText: 'Validate Locale',
  captureSourceText: 'Capture Source',
  lockSelectedText: 'Lock Selected',
  unlockSelectedText: 'Unlock Selected',
  lockSegmentAriaLabel: 'Lock segment',
  unlockSegmentAriaLabel: 'Unlock segment',
  realtimeOnText: 'Realtime On',
  realtimeOffText: 'Realtime Off',
  closeText: 'Close',
  summaryPrefix: 'Locale QA',
  noIssuesText: 'No locale validation issues.',
  issuesLabel: 'Locale issues',
  segmentsLabel: 'Segments',
  sourcePreviewLabel: 'Source',
  targetPreviewLabel: 'Target',
  helperText: 'Select segments, lock finalized ones, and run locale validation before handoff.',
  shortcutText: 'Shortcuts: Ctrl/Cmd+Alt+Shift+L (panel), Ctrl/Cmd+Alt+Shift+V (validate), Ctrl/Cmd+Alt+Shift+K (lock segment)',
  readonlySegmentMessage: 'This segment is locked. Unlock before editing.',
  sourceCapturedMessage: 'Source snapshot captured from current content.',
  selectedSegmentPrefix: 'Selected Segment',
  missingTargetMessage: 'Segment is empty in target locale.',
  tokenMismatchMessage: 'Tokens/placeholders do not match source segment.',
  untranslatedMessage: 'Segment appears untranslated (same as source).',
  lengthOutOfRangeMessage: 'Translation length is outside expected locale range.',
};

const optionsByEditor = new WeakMap<HTMLElement, ResolvedTranslationWorkflowOptions>();
const rawOptionsByEditor = new WeakMap<HTMLElement, TranslationWorkflowPluginOptions>();
const stateByEditor = new WeakMap<HTMLElement, TranslationWorkflowEditorState>();
const panelByEditor = new Map<HTMLElement, HTMLElement>();
const panelVisibleByEditor = new WeakMap<HTMLElement, boolean>();
const debounceTimerByEditor = new WeakMap<HTMLElement, number>();
const trackedEditors = new Set<HTMLElement>();

let pluginInstanceCount = 0;
let segmentSequence = 0;
let issueSequence = 0;
let panelSequence = 0;
let fallbackOptions: ResolvedTranslationWorkflowOptions | null = null;
let lastActiveEditor: HTMLElement | null = null;

let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let globalInputHandler: ((event: Event) => void) | null = null;
let globalBeforeInputHandler: ((event: Event) => void) | null = null;
let globalKeydownHandler: ((event: KeyboardEvent) => void) | null = null;
let globalViewportHandler: (() => void) | null = null;
let globalMutationObserver: MutationObserver | null = null;

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

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function sanitizeLocale(value: string | undefined): string {
  return (value || '').trim() || 'en-US';
}

function normalizeLocaleKey(value: string): string {
  return value.trim().toLowerCase();
}

function escapeAttributeValue(value: string): string {
  return value.replace(/"/g, '&quot;');
}

function truncateText(value: string, maxLength = 120): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

function extractTokens(text: string): string[] {
  const matches = text.match(/\{\{[^{}]+\}\}|%[A-Z0-9_]+%|\$\{[^{}]+\}/gi);
  if (!matches || matches.length === 0) return [];
  return matches.map((token) => token.trim()).filter(Boolean);
}

function hasSameTokens(sourceText: string, targetText: string): boolean {
  const sourceTokens = extractTokens(sourceText).sort();
  const targetTokens = extractTokens(targetText).sort();
  if (sourceTokens.length !== targetTokens.length) return false;

  for (let index = 0; index < sourceTokens.length; index += 1) {
    if (sourceTokens[index] !== targetTokens[index]) return false;
  }

  return true;
}

function normalizeLocaleRules(
  locales: string[],
  inputRules?: TranslationWorkflowLocaleRule[],
): ResolvedTranslationWorkflowLocaleRule[] {
  const rulesInput = Array.isArray(inputRules) && inputRules.length > 0 ? inputRules : defaultLocaleRules;
  const normalized: ResolvedTranslationWorkflowLocaleRule[] = [];
  const seen = new Set<string>();

  rulesInput.forEach((rule) => {
    const locale = normalizeLocaleKey(rule.locale || '');
    if (!locale) return;

    const normalizedLocale = locale;
    if (seen.has(normalizedLocale)) return;
    seen.add(normalizedLocale);

    normalized.push({
      locale: normalizedLocale,
      label: (rule.label || locale).trim() || locale,
      minLengthRatio: clamp(Number(rule.minLengthRatio ?? 0.5), 0.1, 3),
      maxLengthRatio: clamp(Number(rule.maxLengthRatio ?? 1.8), 0.2, 4),
      requireDifferentFromSource: rule.requireDifferentFromSource !== false,
      preserveTokens: rule.preserveTokens !== false,
    });
  });

  locales.forEach((locale) => {
    const key = normalizeLocaleKey(locale);
    if (seen.has(key)) return;
    const fallback = defaultLocaleRules.find((rule) => key.startsWith(rule.locale));
    normalized.push(
      fallback
        ? { ...fallback, locale: key, label: locale }
        : {
            locale: key,
            label: locale,
            minLengthRatio: 0.5,
            maxLengthRatio: 1.8,
            requireDifferentFromSource: true,
            preserveTokens: true,
          },
    );
  });

  return normalized;
}

function normalizeOptions(raw: TranslationWorkflowPluginOptions = {}): ResolvedTranslationWorkflowOptions {
  const normalizeText = raw.normalizeText || defaultNormalizeText;
  const sourceLocale = sanitizeLocale(raw.sourceLocale || 'en-US');
  const targetLocale = sanitizeLocale(raw.targetLocale || 'fr-FR');

  const localeSet = new Set<string>([sourceLocale, targetLocale]);
  (Array.isArray(raw.locales) ? raw.locales : []).forEach((locale) => {
    if (typeof locale !== 'string') return;
    const normalized = sanitizeLocale(locale);
    if (normalized) localeSet.add(normalized);
  });

  const locales = Array.from(localeSet);
  const localeRules = normalizeLocaleRules(locales, raw.localeRules);

  return {
    sourceLocale,
    targetLocale,
    locales,
    localeRules,
    enableRealtime: raw.enableRealtime !== false,
    debounceMs: clamp(Number(raw.debounceMs ?? 260), 60, 2000),
    maxIssues: clamp(Number(raw.maxIssues ?? 120), 5, 1000),
    maxSegments: clamp(Number(raw.maxSegments ?? 600), 20, 3000),
    minSourceLengthForRatio: clamp(Number(raw.minSourceLengthForRatio ?? 8), 2, 100),
    segmentSelector: (raw.segmentSelector || DEFAULT_SEGMENT_SELECTOR).trim() || DEFAULT_SEGMENT_SELECTOR,
    labels: {
      ...defaultLabels,
      ...(raw.labels || {}),
    },
    normalizeText,
  };
}

function toRawOptions(options: ResolvedTranslationWorkflowOptions): TranslationWorkflowPluginOptions {
  return {
    sourceLocale: options.sourceLocale,
    targetLocale: options.targetLocale,
    locales: [...options.locales],
    localeRules: options.localeRules.map((rule) => ({
      locale: rule.locale,
      label: rule.label,
      minLengthRatio: rule.minLengthRatio,
      maxLengthRatio: rule.maxLengthRatio,
      requireDifferentFromSource: rule.requireDifferentFromSource,
      preserveTokens: rule.preserveTokens,
    })),
    enableRealtime: options.enableRealtime,
    debounceMs: options.debounceMs,
    maxIssues: options.maxIssues,
    maxSegments: options.maxSegments,
    minSourceLengthForRatio: options.minSourceLengthForRatio,
    segmentSelector: options.segmentSelector,
    labels: { ...options.labels },
    normalizeText: options.normalizeText,
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
    const fromHost = resolveContentFromHost(host);
    if (fromHost) return fromHost;
  }

  const nearestEditable = explicitContext.closest(EDITOR_CONTENT_SELECTOR);
  return nearestEditable instanceof HTMLElement ? nearestEditable : null;
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

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
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
  target.classList.remove('rte-translation-workflow-theme-dark');
  if (shouldUseDarkTheme(editor)) {
    target.classList.add('rte-translation-workflow-theme-dark');
  }
}

function mutationTouchesEditorRemoval(records: MutationRecord[]): boolean {
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record.type !== 'childList' || record.removedNodes.length === 0) continue;

    for (let nodeIndex = 0; nodeIndex < record.removedNodes.length; nodeIndex += 1) {
      const node = record.removedNodes[nodeIndex];
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      const element = node as Element;
      if (
        element.matches?.(EDITOR_CONTENT_SELECTOR) ||
        element.matches?.(`.${PANEL_CLASS}`) ||
        element.querySelector?.(EDITOR_CONTENT_SELECTOR) ||
        element.querySelector?.(`.${PANEL_CLASS}`)
      ) {
        return true;
      }
    }
  }

  return false;
}

function pruneDisconnectedEditors(): void {
  const editors = Array.from(trackedEditors);
  editors.forEach((editor) => {
    if (editor.isConnected) return;
    cleanupEditor(editor);
  });
}

function resolveEditorFromContext(
  context?: { editorElement?: unknown; contentElement?: unknown },
  allowFirstMatch = true,
  allowLastActive = true,
): HTMLElement | null {
  pruneDisconnectedEditors();

  if (context?.contentElement instanceof HTMLElement) return context.contentElement;

  if (context?.editorElement instanceof HTMLElement) {
    const content = resolveContentFromHost(context.editorElement);
    if (content) return content;
  }

  const explicit = consumeCommandEditorContext();
  if (explicit) return explicit;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const fromSelection = getElementFromNode(selection.getRangeAt(0).startContainer)?.closest(
      EDITOR_CONTENT_SELECTOR,
    ) as HTMLElement | null;
    if (fromSelection) return fromSelection;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    if (active.matches(EDITOR_CONTENT_SELECTOR)) return active;
    const fromActive = active.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (fromActive) return fromActive;
  }

  if (allowLastActive && lastActiveEditor && lastActiveEditor.isConnected) {
    return lastActiveEditor;
  }

  if (!allowFirstMatch) return null;
  const firstMatch = document.querySelector(EDITOR_CONTENT_SELECTOR);
  return firstMatch instanceof HTMLElement ? firstMatch : null;
}

function resolveEditorFromKeyboardEvent(event: KeyboardEvent): HTMLElement | null {
  const target = event.target as HTMLElement | null;
  if (target) {
    const panel = target.closest(`.${PANEL_CLASS}`) as HTMLElement | null;
    if (panel) {
      const panelEntry = Array.from(panelByEditor.entries()).find(([, candidate]) => candidate === panel);
      if (panelEntry) return panelEntry[0];
    }

    const closest = target.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (closest) return closest;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    const panel = active.closest(`.${PANEL_CLASS}`) as HTMLElement | null;
    if (panel) {
      const panelEntry = Array.from(panelByEditor.entries()).find(([, candidate]) => candidate === panel);
      if (panelEntry) return panelEntry[0];
    }

    const fromActive = active.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (fromActive) return fromActive;
  }

  return null;
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

function clearEditorDebounceTimer(editor: HTMLElement): void {
  const timer = debounceTimerByEditor.get(editor);
  if (typeof timer !== 'number') return;
  window.clearTimeout(timer);
  debounceTimerByEditor.delete(editor);
}

function getLocaleRule(options: ResolvedTranslationWorkflowOptions, locale: string): ResolvedTranslationWorkflowLocaleRule {
  const localeKey = normalizeLocaleKey(locale);
  const exact = options.localeRules.find((rule) => normalizeLocaleKey(rule.locale) === localeKey);
  if (exact) return exact;

  const prefix = localeKey.split('-')[0];
  const matchedByPrefix = options.localeRules.find((rule) => normalizeLocaleKey(rule.locale).split('-')[0] === prefix);
  if (matchedByPrefix) return matchedByPrefix;

  return {
    locale: localeKey,
    label: locale,
    minLengthRatio: 0.5,
    maxLengthRatio: 1.8,
    requireDifferentFromSource: true,
    preserveTokens: true,
  };
}

function isEditorReadonly(editor: HTMLElement): boolean {
  return editor.getAttribute('contenteditable') === 'false' || editor.getAttribute('data-readonly') === 'true';
}

function createIssue(
  type: TranslationWorkflowIssueType,
  severity: TranslationWorkflowIssueSeverity,
  message: string,
  payload: Partial<Omit<TranslationWorkflowIssue, 'id' | 'type' | 'severity' | 'message'>> = {},
): TranslationWorkflowIssue {
  issueSequence += 1;
  return {
    id: `translation-workflow-issue-${issueSequence}`,
    type,
    severity,
    message,
    ...payload,
  };
}

function applySegmentLockDom(segmentElement: HTMLElement, locked: boolean): void {
  if (locked) {
    if (!segmentElement.hasAttribute('data-translation-prev-contenteditable')) {
      segmentElement.setAttribute(
        'data-translation-prev-contenteditable',
        segmentElement.hasAttribute('contenteditable')
          ? segmentElement.getAttribute('contenteditable') || 'inherit'
          : 'inherit',
      );
    }

    segmentElement.setAttribute('data-translation-locked', 'true');
    segmentElement.setAttribute('contenteditable', 'false');
    segmentElement.setAttribute('aria-readonly', 'true');
    segmentElement.classList.add('rte-translation-segment-locked');
    return;
  }

  segmentElement.removeAttribute('data-translation-locked');
  segmentElement.removeAttribute('aria-readonly');
  segmentElement.classList.remove('rte-translation-segment-locked');

  if (segmentElement.hasAttribute('data-translation-prev-contenteditable')) {
    const previous = segmentElement.getAttribute('data-translation-prev-contenteditable') || '';
    if (previous === 'inherit') {
      segmentElement.setAttribute('contenteditable', 'true');
    } else {
      segmentElement.setAttribute('contenteditable', previous);
    }
    segmentElement.removeAttribute('data-translation-prev-contenteditable');
  } else {
    segmentElement.setAttribute('contenteditable', 'true');
  }
}

function getSegmentElementById(editor: HTMLElement, segmentId: string): HTMLElement | null {
  return editor.querySelector(`[data-translation-segment-id="${escapeAttributeValue(segmentId)}"]`) as HTMLElement | null;
}

function getSegmentElementFromSelection(editor: HTMLElement): HTMLElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const startElement = getElementFromNode(selection.getRangeAt(0).startContainer);
  if (!startElement || !editor.contains(startElement)) return null;

  return startElement.closest('[data-translation-segment-id]') as HTMLElement | null;
}

function collectLeafSegmentNodes(editor: HTMLElement, selector: string): HTMLElement[] {
  const rawNodes = Array.from(editor.querySelectorAll(selector)) as HTMLElement[];
  if (rawNodes.length <= 1) return rawNodes;

  const nodeSet = new Set<HTMLElement>(rawNodes);
  return rawNodes.filter((node) => {
    let ancestor = node.parentElement;
    while (ancestor && ancestor !== editor) {
      if (nodeSet.has(ancestor as HTMLElement)) {
        return false;
      }
      ancestor = ancestor.parentElement;
    }
    return true;
  });
}

function resolveUniqueSegmentId(
  node: HTMLElement,
  seenSegmentIds: Set<string>,
  preferredId: string | null,
): string {
  let segmentId = (preferredId || '').trim();
  if (!segmentId || seenSegmentIds.has(segmentId)) {
    do {
      segmentId = `translation-segment-${segmentSequence++}`;
    } while (seenSegmentIds.has(segmentId));
    node.setAttribute('data-translation-segment-id', segmentId);
  }

  return segmentId;
}

function enforceLockedSegmentIntegrity(
  editor: HTMLElement,
  state: TranslationWorkflowEditorState,
): boolean {
  if (state.lockedSegmentIds.size === 0) return false;

  let changed = false;
  state.lockedSegmentIds.forEach((segmentId) => {
    const segmentElement = getSegmentElementById(editor, segmentId);
    if (!segmentElement) return;

    applySegmentLockDom(segmentElement, true);
    const lockedHtml = state.lockedHtmlBySegmentId.get(segmentId);
    if (typeof lockedHtml === 'string') {
      if (segmentElement.innerHTML !== lockedHtml) {
        segmentElement.innerHTML = lockedHtml;
        changed = true;
      }
      return;
    }

    state.lockedHtmlBySegmentId.set(segmentId, segmentElement.innerHTML);
  });

  return changed;
}

function extractSegments(
  editor: HTMLElement,
  options: ResolvedTranslationWorkflowOptions,
  state: TranslationWorkflowEditorState,
): TranslationWorkflowSegment[] {
  const nodes = collectLeafSegmentNodes(editor, options.segmentSelector);
  const segments: TranslationWorkflowSegment[] = [];
  const seenSegmentIds = new Set<string>();

  for (let index = 0; index < nodes.length; index += 1) {
    if (segments.length >= options.maxSegments) break;

    const node = nodes[index];
    const segmentId = resolveUniqueSegmentId(node, seenSegmentIds, node.getAttribute('data-translation-segment-id'));

    const lockedByState = state.lockedSegmentIds.has(segmentId);
    const lockedByDom = node.getAttribute('data-translation-locked') === 'true';
    const locked = lockedByState || lockedByDom;

    if (locked) {
      state.lockedSegmentIds.add(segmentId);
      applySegmentLockDom(node, true);
      if (!state.lockedHtmlBySegmentId.has(segmentId)) {
        state.lockedHtmlBySegmentId.set(segmentId, node.innerHTML);
      } else {
        const lockedHtml = state.lockedHtmlBySegmentId.get(segmentId) || '';
        if (node.innerHTML !== lockedHtml) {
          node.innerHTML = lockedHtml;
        }
      }
    } else {
      state.lockedHtmlBySegmentId.delete(segmentId);
    }

    const text = options.normalizeText(node.textContent || '');
    if (!text) continue;

    if (!state.sourceTextBySegmentId.has(segmentId)) {
      state.sourceTextBySegmentId.set(segmentId, text);
    }

    const sourceText = state.sourceTextBySegmentId.get(segmentId) || text;

    segments.push({
      id: segmentId,
      tagName: node.tagName.toLowerCase(),
      index: segments.length,
      text,
      sourceText,
      locked,
    });

    seenSegmentIds.add(segmentId);
  }

  Array.from(state.sourceTextBySegmentId.keys()).forEach((segmentId) => {
    if (!seenSegmentIds.has(segmentId)) {
      state.sourceTextBySegmentId.delete(segmentId);
    }
  });

  Array.from(state.lockedSegmentIds.keys()).forEach((segmentId) => {
    if (!seenSegmentIds.has(segmentId)) {
      state.lockedSegmentIds.delete(segmentId);
    }
  });
  Array.from(state.lockedHtmlBySegmentId.keys()).forEach((segmentId) => {
    if (!seenSegmentIds.has(segmentId) || !state.lockedSegmentIds.has(segmentId)) {
      state.lockedHtmlBySegmentId.delete(segmentId);
    }
  });

  if (!state.selectedSegmentId || !segments.some((segment) => segment.id === state.selectedSegmentId)) {
    state.selectedSegmentId = segments[0]?.id || null;
  }

  return segments;
}

function ensureState(editor: HTMLElement, options: ResolvedTranslationWorkflowOptions): TranslationWorkflowEditorState {
  if (!optionsByEditor.has(editor)) {
    optionsByEditor.set(editor, options);
  }

  let state = stateByEditor.get(editor);
  if (!state) {
    state = {
      sourceLocale: options.sourceLocale,
      targetLocale: options.targetLocale,
      selectedSegmentId: null,
      realtimeEnabled: options.enableRealtime,
      segments: [],
      issues: [],
      sourceTextBySegmentId: new Map<string, string>(),
      lockedSegmentIds: new Set<string>(),
      lockedHtmlBySegmentId: new Map<string, string>(),
      snapshot: '',
      lastRunAt: null,
    };
    stateByEditor.set(editor, state);
  }

  trackedEditors.add(editor);
  return state;
}

function cleanupEditor(editor: HTMLElement): void {
  clearEditorDebounceTimer(editor);

  const panel = panelByEditor.get(editor);
  if (panel) panel.remove();
  panelByEditor.delete(editor);
  panelVisibleByEditor.delete(editor);

  const state = stateByEditor.get(editor);
  if (state) {
    state.lockedSegmentIds.forEach((segmentId) => {
      const segmentElement = getSegmentElementById(editor, segmentId);
      if (segmentElement) {
        applySegmentLockDom(segmentElement, false);
      }
    });
    state.lockedHtmlBySegmentId.clear();
  }

  optionsByEditor.delete(editor);
  rawOptionsByEditor.delete(editor);
  stateByEditor.delete(editor);
  trackedEditors.delete(editor);

  if (lastActiveEditor === editor) {
    lastActiveEditor = null;
  }
}

function isPanelVisible(editor: HTMLElement): boolean {
  return panelVisibleByEditor.get(editor) === true;
}

function positionPanel(editor: HTMLElement, panel: HTMLElement): void {
  if (!panel.classList.contains('show')) return;

  const rect = resolveEditorRoot(editor).getBoundingClientRect();
  const panelWidth = Math.min(window.innerWidth - 20, 520);
  const maxLeft = Math.max(10, window.innerWidth - panelWidth - 10);
  const left = Math.min(Math.max(10, rect.right - panelWidth), maxLeft);
  const top = Math.max(10, Math.min(window.innerHeight - 10, rect.top + 12));

  panel.style.width = `${panelWidth}px`;
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.maxHeight = `${Math.max(260, window.innerHeight - 20)}px`;
}

function setPanelLiveMessage(panel: HTMLElement, message: string): void {
  const live = panel.querySelector<HTMLElement>('.rte-translation-live');
  if (live) live.textContent = message;
}

function getValidationSnapshotKey(editor: HTMLElement, state: TranslationWorkflowEditorState): string {
  return `${editor.innerHTML}::${state.sourceLocale}::${state.targetLocale}::${Array.from(state.lockedSegmentIds)
    .sort()
    .join('|')}`;
}

function validateSegments(
  segments: TranslationWorkflowSegment[],
  state: TranslationWorkflowEditorState,
  options: ResolvedTranslationWorkflowOptions,
): TranslationWorkflowIssue[] {
  const issues: TranslationWorkflowIssue[] = [];
  const rule = getLocaleRule(options, state.targetLocale);

  for (let index = 0; index < segments.length; index += 1) {
    if (issues.length >= options.maxIssues) break;

    const segment = segments[index];
    const sourceText = options.normalizeText(segment.sourceText || '');
    const targetText = options.normalizeText(segment.text || '');

    if (!targetText) {
      issues.push(
        createIssue('missing-target', 'error', options.labels.missingTargetMessage, {
          segmentId: segment.id,
          sourceText,
          targetText,
          suggestion: 'Provide translated content for this segment before export.',
        }),
      );
      continue;
    }

    if (rule.preserveTokens && sourceText && !hasSameTokens(sourceText, targetText)) {
      issues.push(
        createIssue('token-mismatch', 'error', options.labels.tokenMismatchMessage, {
          segmentId: segment.id,
          sourceText,
          targetText,
          suggestion: 'Preserve placeholders/tokens exactly (for example {{name}}, %ID%, ${value}).',
        }),
      );
      if (issues.length >= options.maxIssues) break;
    }

    if (rule.requireDifferentFromSource && sourceText && options.normalizeText(sourceText) === options.normalizeText(targetText)) {
      issues.push(
        createIssue('untranslated', 'warning', options.labels.untranslatedMessage, {
          segmentId: segment.id,
          sourceText,
          targetText,
          suggestion: 'Translate the segment or mark it intentionally unchanged.',
        }),
      );
      if (issues.length >= options.maxIssues) break;
    }

    if (sourceText.length >= options.minSourceLengthForRatio) {
      const ratio = targetText.length / Math.max(1, sourceText.length);
      if (ratio < rule.minLengthRatio || ratio > rule.maxLengthRatio) {
        issues.push(
          createIssue('length-out-of-range', 'warning', options.labels.lengthOutOfRangeMessage, {
            segmentId: segment.id,
            sourceText,
            targetText,
            suggestion: `Expected ratio for ${rule.label}: ${rule.minLengthRatio.toFixed(2)} - ${rule.maxLengthRatio.toFixed(2)}.`,
          }),
        );
      }
    }
  }

  return issues;
}

function getRuntimeStateSnapshot(editor: HTMLElement): TranslationWorkflowRuntimeState {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  const state = stateByEditor.get(editor);

  return {
    sourceLocale: state?.sourceLocale || options?.sourceLocale || 'en-US',
    targetLocale: state?.targetLocale || options?.targetLocale || 'fr-FR',
    realtimeEnabled: state?.realtimeEnabled === true,
    selectedSegmentId: state?.selectedSegmentId || null,
    segmentCount: state?.segments.length || 0,
    lockedSegmentCount: state ? state.segments.filter((segment) => segment.locked).length : 0,
    issues: state?.issues ? state.issues.map((issue) => ({ ...issue })) : [],
    segments:
      state?.segments.map((segment) => ({
        id: segment.id,
        tagName: segment.tagName,
        index: segment.index,
        sourceLength: segment.sourceText.length,
        targetLength: segment.text.length,
        locked: segment.locked,
      })) || [],
    lastRunAt: state?.lastRunAt || null,
  };
}

function updateToolbarState(editor: HTMLElement): void {
  const state = stateByEditor.get(editor);
  const selectedSegment =
    state && state.selectedSegmentId ? state.segments.find((segment) => segment.id === state.selectedSegmentId) : null;

  setCommandButtonActiveState(editor, 'toggleTranslationWorkflowPanel', isPanelVisible(editor));
  setCommandButtonActiveState(editor, 'toggleTranslationRealtime', state?.realtimeEnabled === true);
  setCommandButtonActiveState(editor, 'toggleTranslationSegmentLock', selectedSegment?.locked === true);
}

function focusSegmentInEditor(editor: HTMLElement, segmentId: string): void {
  const segmentElement = getSegmentElementById(editor, segmentId);
  if (!segmentElement) return;

  try {
    segmentElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  } catch {
    // Ignore scroll errors.
  }

  const selection = window.getSelection();
  if (!selection || typeof document.createRange !== 'function') return;

  try {
    const range = document.createRange();
    range.selectNodeContents(segmentElement);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus({ preventScroll: true });
  } catch {
    // Ignore selection errors.
  }
}

function refreshPanel(editor: HTMLElement): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;

  const state = ensureState(editor, options);

  const sourceLabel = panel.querySelector<HTMLElement>('.rte-translation-source-label');
  if (sourceLabel) sourceLabel.textContent = options.labels.sourceLocaleLabel;

  const targetLabel = panel.querySelector<HTMLElement>('.rte-translation-target-label');
  if (targetLabel) targetLabel.textContent = options.labels.targetLocaleLabel;

  const sourceSelect = panel.querySelector<HTMLSelectElement>('[data-field="source-locale"]');
  const targetSelect = panel.querySelector<HTMLSelectElement>('[data-field="target-locale"]');
  const localeOptions = options.locales
    .map((locale) => `<option value="${escapeHtml(locale)}">${escapeHtml(locale)}</option>`)
    .join('');

  if (sourceSelect) {
    sourceSelect.innerHTML = localeOptions;
    sourceSelect.value = state.sourceLocale;
  }

  if (targetSelect) {
    targetSelect.innerHTML = localeOptions;
    targetSelect.value = state.targetLocale;
  }

  const summary = panel.querySelector<HTMLElement>('.rte-translation-summary');
  if (summary) {
    const issueCount = state.issues.length;
    const selected = state.selectedSegmentId ? ` • ${options.labels.selectedSegmentPrefix}: ${state.selectedSegmentId}` : '';
    summary.textContent = `${options.labels.summaryPrefix}: ${state.sourceLocale} → ${state.targetLocale} • ${issueCount} issue${
      issueCount === 1 ? '' : 's'
    }${selected}`;
  }

  const helper = panel.querySelector<HTMLElement>('.rte-translation-helper');
  if (helper) helper.textContent = options.labels.helperText;

  const shortcut = panel.querySelector<HTMLElement>('.rte-translation-shortcut');
  if (shortcut) shortcut.textContent = options.labels.shortcutText;

  const validateButton = panel.querySelector<HTMLButtonElement>('[data-action="run-validation"]');
  if (validateButton) validateButton.textContent = options.labels.validateText;

  const captureButton = panel.querySelector<HTMLButtonElement>('[data-action="capture-source"]');
  if (captureButton) captureButton.textContent = options.labels.captureSourceText;

  const realtimeButton = panel.querySelector<HTMLButtonElement>('[data-action="toggle-realtime"]');
  if (realtimeButton) {
    realtimeButton.textContent = state.realtimeEnabled ? options.labels.realtimeOnText : options.labels.realtimeOffText;
    realtimeButton.setAttribute('aria-pressed', state.realtimeEnabled ? 'true' : 'false');
  }

  const lockButton = panel.querySelector<HTMLButtonElement>('[data-action="lock-selected"]');
  const selectedSegment =
    state.selectedSegmentId ? state.segments.find((segment) => segment.id === state.selectedSegmentId) || null : null;
  if (lockButton) {
    lockButton.textContent = selectedSegment?.locked ? options.labels.unlockSelectedText : options.labels.lockSelectedText;
    lockButton.disabled = !selectedSegment;
    lockButton.setAttribute('aria-pressed', selectedSegment?.locked ? 'true' : 'false');
  }

  const closeButton = panel.querySelector<HTMLButtonElement>('[data-action="close"]');
  if (closeButton) closeButton.setAttribute('aria-label', options.labels.closeText);

  const issueList = panel.querySelector<HTMLElement>('.rte-translation-issues');
  const noIssues = panel.querySelector<HTMLElement>('.rte-translation-empty');
  if (issueList) {
    issueList.setAttribute('aria-label', options.labels.issuesLabel);
    if (state.issues.length === 0) {
      issueList.innerHTML = '';
      if (noIssues) {
        noIssues.hidden = false;
        noIssues.textContent = options.labels.noIssuesText;
      }
    } else {
      if (noIssues) noIssues.hidden = true;
      issueList.innerHTML = state.issues
        .map((issue) => {
          const severityClass =
            issue.severity === 'error' ? 'error' : issue.severity === 'warning' ? 'warning' : 'info';
          return `
            <li class="rte-translation-issue ${severityClass}" role="listitem" data-segment-id="${escapeHtml(
              issue.segmentId || '',
            )}">
              <p class="rte-translation-issue-message">${escapeHtml(issue.message)}</p>
              ${issue.suggestion ? `<p class="rte-translation-issue-suggestion">${escapeHtml(issue.suggestion)}</p>` : ''}
            </li>
          `;
        })
        .join('');
    }
  }

  const segmentsList = panel.querySelector<HTMLElement>('.rte-translation-segments');
  if (segmentsList) {
    segmentsList.setAttribute('aria-label', options.labels.segmentsLabel);
    segmentsList.innerHTML = state.segments
      .map((segment) => {
        const selectedClass = segment.id === state.selectedSegmentId ? 'selected' : '';
        const lockClass = segment.locked ? 'locked' : '';
        return `
          <li class="rte-translation-segment-item ${selectedClass} ${lockClass}" role="option" aria-selected="${
            segment.id === state.selectedSegmentId ? 'true' : 'false'
          }" data-segment-id="${escapeHtml(segment.id)}">
            <button type="button" class="rte-translation-segment-select" data-action="select-segment" data-segment-id="${escapeHtml(
              segment.id,
            )}" title="${escapeHtml(segment.text)}">
              <span class="rte-translation-segment-meta">#${segment.index + 1} • ${escapeHtml(segment.tagName)}</span>
              <span class="rte-translation-segment-text">${escapeHtml(truncateText(segment.text, 110))}</span>
            </button>
            <button type="button" class="rte-translation-segment-lock" data-action="toggle-lock" data-segment-id="${escapeHtml(
              segment.id,
            )}" aria-label="${segment.locked ? options.labels.unlockSegmentAriaLabel : options.labels.lockSegmentAriaLabel}" aria-pressed="${
              segment.locked ? 'true' : 'false'
            }"></button>
          </li>
        `;
      })
      .join('');
  }

  const sourcePreview = panel.querySelector<HTMLElement>('.rte-translation-source-preview');
  const targetPreview = panel.querySelector<HTMLElement>('.rte-translation-target-preview');

  if (sourcePreview || targetPreview) {
    const selected = state.selectedSegmentId
      ? state.segments.find((segment) => segment.id === state.selectedSegmentId) || null
      : null;

    if (sourcePreview) {
      sourcePreview.textContent = selected?.sourceText || '—';
      sourcePreview.setAttribute('aria-label', options.labels.sourcePreviewLabel);
    }

    if (targetPreview) {
      targetPreview.textContent = selected?.text || '—';
      targetPreview.setAttribute('aria-label', options.labels.targetPreviewLabel);
    }
  }

  panel.setAttribute('aria-label', options.labels.panelAriaLabel);
}

function scheduleRealtimeValidation(editor: HTMLElement): void {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;

  clearEditorDebounceTimer(editor);
  const timer = window.setTimeout(() => {
    debounceTimerByEditor.delete(editor);
    runValidation(editor, 'realtime', false);
  }, options.debounceMs);

  debounceTimerByEditor.set(editor, timer);
}

function runValidation(editor: HTMLElement, reason: string, force: boolean): TranslationWorkflowIssue[] {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return [];

  const state = ensureState(editor, options);
  const hadLockedRestore = enforceLockedSegmentIntegrity(editor, state);
  state.segments = extractSegments(editor, options, state);

  const snapshot = getValidationSnapshotKey(editor, state);
  if (!force && state.snapshot === snapshot) {
    return state.issues;
  }

  state.issues = validateSegments(state.segments, state, options);
  state.lastRunAt = new Date().toISOString();
  state.snapshot = snapshot;

  refreshPanel(editor);
  updateToolbarState(editor);

  editor.dispatchEvent(
    new CustomEvent('editora:translation-workflow-validation', {
      bubbles: true,
      detail: {
        reason,
        state: getRuntimeStateSnapshot(editor),
      },
    }),
  );

  const panel = panelByEditor.get(editor);
  if (panel) {
    if (hadLockedRestore) {
      setPanelLiveMessage(panel, options.labels.readonlySegmentMessage);
      return state.issues;
    }
    setPanelLiveMessage(
      panel,
      state.issues.length === 0
        ? options.labels.noIssuesText
        : `${state.issues.length} issue${state.issues.length === 1 ? '' : 's'} detected.`,
    );
  }

  return state.issues;
}

function captureSourceSnapshot(editor: HTMLElement): boolean {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return false;

  const state = ensureState(editor, options);
  const segments = extractSegments(editor, options, state);
  segments.forEach((segment) => {
    state.sourceTextBySegmentId.set(segment.id, segment.text);
  });

  state.snapshot = '';
  runValidation(editor, 'capture-source', true);

  const panel = panelByEditor.get(editor);
  if (panel) {
    setPanelLiveMessage(panel, options.labels.sourceCapturedMessage);
  }

  editor.dispatchEvent(
    new CustomEvent('editora:translation-source-captured', {
      bubbles: true,
      detail: {
        sourceLocale: state.sourceLocale,
        segmentCount: segments.length,
      },
    }),
  );

  return true;
}

function setSegmentLock(editor: HTMLElement, segmentId?: string, explicit?: boolean): boolean {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return false;

  const state = ensureState(editor, options);
  state.segments = extractSegments(editor, options, state);

  const selectedBySelection = getSegmentElementFromSelection(editor)?.getAttribute('data-translation-segment-id') || null;
  const targetId =
    segmentId || selectedBySelection || state.selectedSegmentId || state.segments[0]?.id || null;
  if (!targetId) return false;

  const segmentElement = getSegmentElementById(editor, targetId);
  if (!segmentElement) return false;

  const nextLocked = typeof explicit === 'boolean' ? explicit : !state.lockedSegmentIds.has(targetId);

  if (nextLocked) {
    state.lockedSegmentIds.add(targetId);
    state.lockedHtmlBySegmentId.set(targetId, segmentElement.innerHTML);
  } else {
    state.lockedSegmentIds.delete(targetId);
    state.lockedHtmlBySegmentId.delete(targetId);
  }

  applySegmentLockDom(segmentElement, nextLocked);
  state.selectedSegmentId = targetId;
  state.snapshot = '';

  runValidation(editor, 'lock-segment', true);

  editor.dispatchEvent(
    new CustomEvent('editora:translation-segment-lock', {
      bubbles: true,
      detail: {
        segmentId: targetId,
        locked: nextLocked,
      },
    }),
  );

  return true;
}

function toggleRealtime(editor: HTMLElement, explicit?: boolean): boolean {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return false;

  const state = ensureState(editor, options);
  const next = typeof explicit === 'boolean' ? explicit : !state.realtimeEnabled;
  state.realtimeEnabled = next;

  if (next) {
    scheduleRealtimeValidation(editor);
  } else {
    clearEditorDebounceTimer(editor);
  }

  refreshPanel(editor);
  updateToolbarState(editor);
  return true;
}

function setSelectedSegment(editor: HTMLElement, segmentId: string, focusEditor = true): boolean {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return false;

  const state = ensureState(editor, options);
  state.segments = extractSegments(editor, options, state);

  if (!state.segments.some((segment) => segment.id === segmentId)) return false;
  state.selectedSegmentId = segmentId;

  refreshPanel(editor);
  updateToolbarState(editor);

  if (focusEditor) {
    focusSegmentInEditor(editor, segmentId);
  }

  return true;
}

function moveSelectedSegment(editor: HTMLElement, direction: 1 | -1 | 'start' | 'end'): boolean {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return false;

  const state = ensureState(editor, options);
  state.segments = extractSegments(editor, options, state);

  if (state.segments.length === 0) return false;

  const currentIndex = Math.max(
    0,
    state.segments.findIndex((segment) => segment.id === state.selectedSegmentId),
  );

  let nextIndex = currentIndex;
  if (direction === 'start') nextIndex = 0;
  else if (direction === 'end') nextIndex = state.segments.length - 1;
  else nextIndex = clamp(currentIndex + direction, 0, state.segments.length - 1);

  const nextSegment = state.segments[nextIndex];
  if (!nextSegment) return false;
  return setSelectedSegment(editor, nextSegment.id, true);
}

function hidePanel(editor: HTMLElement, focusEditor = false): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  panel.classList.remove('show');
  panelVisibleByEditor.set(editor, false);
  updateToolbarState(editor);

  if (focusEditor) {
    editor.focus({ preventScroll: true });
  }
}

function showPanel(editor: HTMLElement): void {
  const panel = ensurePanel(editor);

  panelByEditor.forEach((_panel, currentEditor) => {
    if (currentEditor !== editor) {
      hidePanel(currentEditor, false);
    }
  });

  panel.classList.add('show');
  panelVisibleByEditor.set(editor, true);

  runValidation(editor, 'panel-open', false);
  refreshPanel(editor);
  positionPanel(editor, panel);
  updateToolbarState(editor);

  const localeSelect = panel.querySelector<HTMLSelectElement>('[data-field="target-locale"]');
  localeSelect?.focus();
}

function togglePanel(editor: HTMLElement, explicit?: boolean): boolean {
  const visible = isPanelVisible(editor);
  const nextVisible = typeof explicit === 'boolean' ? explicit : !visible;

  if (nextVisible) showPanel(editor);
  else hidePanel(editor, false);

  return true;
}

function isTogglePanelShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'l';
}

function isRunValidationShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'v';
}

function isToggleLockShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'k';
}

function isEditableKey(event: KeyboardEvent): boolean {
  if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) return true;
  return event.key === 'Backspace' || event.key === 'Delete' || event.key === 'Enter';
}

function getLockedSegmentFromTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null;
  const segment = target.closest('[data-translation-locked="true"]') as HTMLElement | null;
  return segment;
}

function ensurePanel(editor: HTMLElement): HTMLElement {
  const existing = panelByEditor.get(editor);
  if (existing) return existing;

  const options = optionsByEditor.get(editor) || fallbackOptions || normalizeOptions();
  ensureState(editor, options);

  const panelId = `rte-translation-workflow-panel-${panelSequence++}`;
  const sourceSelectId = `${panelId}-source`;
  const targetSelectId = `${panelId}-target`;

  const panel = document.createElement('section');
  panel.className = PANEL_CLASS;
  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);

  panel.innerHTML = `
    <header class="rte-translation-header">
      <h2 class="rte-translation-title">${escapeHtml(options.labels.panelTitle)}</h2>
      <button type="button" class="rte-translation-icon-btn" data-action="close" aria-label="${escapeHtml(
        options.labels.closeText,
      )}">✕</button>
    </header>
    <div class="rte-translation-body">
      <div class="rte-translation-locales">
        <div class="rte-translation-locale-field">
          <label class="rte-translation-source-label" for="${escapeHtml(sourceSelectId)}"></label>
          <select id="${escapeHtml(sourceSelectId)}" class="rte-translation-select" data-field="source-locale"></select>
        </div>
        <div class="rte-translation-locale-field">
          <label class="rte-translation-target-label" for="${escapeHtml(targetSelectId)}"></label>
          <select id="${escapeHtml(targetSelectId)}" class="rte-translation-select" data-field="target-locale"></select>
        </div>
      </div>
      <p class="rte-translation-summary"></p>
      <div class="rte-translation-actions">
        <button type="button" class="rte-translation-btn rte-translation-btn-primary" data-action="run-validation"></button>
        <button type="button" class="rte-translation-btn" data-action="capture-source"></button>
        <button type="button" class="rte-translation-btn" data-action="lock-selected"></button>
        <button type="button" class="rte-translation-btn" data-action="toggle-realtime" aria-pressed="false"></button>
      </div>
      <p class="rte-translation-helper"></p>
      <p class="rte-translation-shortcut"></p>
      <div class="rte-translation-grid">
        <section class="rte-translation-segments-wrap" aria-label="${escapeHtml(options.labels.segmentsLabel)}">
          <h3 class="rte-translation-subtitle">${escapeHtml(options.labels.segmentsLabel)}</h3>
          <ul class="rte-translation-segments" role="listbox" tabindex="0" aria-label="${escapeHtml(
            options.labels.segmentsLabel,
          )}"></ul>
        </section>
        <section class="rte-translation-preview-wrap">
          <h3 class="rte-translation-subtitle">${escapeHtml(options.labels.sourcePreviewLabel)} / ${escapeHtml(
            options.labels.targetPreviewLabel,
          )}</h3>
          <div class="rte-translation-preview-block">
            <p class="rte-translation-preview-label">${escapeHtml(options.labels.sourcePreviewLabel)}</p>
            <p class="rte-translation-source-preview"></p>
          </div>
          <div class="rte-translation-preview-block">
            <p class="rte-translation-preview-label">${escapeHtml(options.labels.targetPreviewLabel)}</p>
            <p class="rte-translation-target-preview"></p>
          </div>
        </section>
      </div>
      <section class="rte-translation-issues-wrap">
        <h3 class="rte-translation-subtitle">${escapeHtml(options.labels.issuesLabel)}</h3>
        <ul class="rte-translation-issues" role="list" aria-label="${escapeHtml(options.labels.issuesLabel)}"></ul>
        <p class="rte-translation-empty" hidden></p>
      </section>
    </div>
    <div class="rte-translation-live" aria-live="polite" aria-atomic="true"></div>
  `;

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const actionEl = target.closest<HTMLElement>('[data-action]');
    if (!actionEl) {
      const issueItem = target.closest<HTMLElement>('.rte-translation-issue[data-segment-id]');
      const issueSegmentId = issueItem?.getAttribute('data-segment-id') || '';
      if (issueSegmentId) {
        setSelectedSegment(editor, issueSegmentId, true);
      }
      return;
    }

    const action = actionEl.getAttribute('data-action');
    if (action === 'close') {
      hidePanel(editor, true);
      return;
    }

    if (action === 'run-validation') {
      runValidation(editor, 'panel-button', true);
      return;
    }

    if (action === 'capture-source') {
      captureSourceSnapshot(editor);
      return;
    }

    if (action === 'lock-selected') {
      setSegmentLock(editor);
      return;
    }

    if (action === 'toggle-realtime') {
      toggleRealtime(editor);
      return;
    }

    if (action === 'select-segment') {
      const segmentId = actionEl.getAttribute('data-segment-id') || '';
      if (segmentId) {
        setSelectedSegment(editor, segmentId, true);
      }
      return;
    }

    if (action === 'toggle-lock') {
      const segmentId = actionEl.getAttribute('data-segment-id') || '';
      if (segmentId) {
        setSegmentLock(editor, segmentId);
      }
    }
  });

  panel.addEventListener('change', (event) => {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLSelectElement)) return;

    const optionsEntry = optionsByEditor.get(editor) || fallbackOptions;
    if (!optionsEntry) return;

    const state = ensureState(editor, optionsEntry);

    if (target.getAttribute('data-field') === 'source-locale') {
      state.sourceLocale = sanitizeLocale(target.value);
      state.snapshot = '';
      runValidation(editor, 'source-locale-change', true);
      return;
    }

    if (target.getAttribute('data-field') === 'target-locale') {
      state.targetLocale = sanitizeLocale(target.value);
      state.snapshot = '';
      runValidation(editor, 'target-locale-change', true);
    }
  });

  panel.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    if (event.key === 'Escape') {
      event.preventDefault();
      hidePanel(editor, true);
      return;
    }

    if (!target?.closest('.rte-translation-segments') || !NAVIGATION_KEYS.has(event.key)) return;

    event.preventDefault();
    if (event.key === 'ArrowUp') moveSelectedSegment(editor, -1);
    else if (event.key === 'ArrowDown') moveSelectedSegment(editor, 1);
    else if (event.key === 'Home') moveSelectedSegment(editor, 'start');
    else if (event.key === 'End') moveSelectedSegment(editor, 'end');
  });

  applyThemeClass(panel, editor);
  document.body.appendChild(panel);

  panelByEditor.set(editor, panel);
  panelVisibleByEditor.set(editor, false);

  refreshPanel(editor);
  return panel;
}

function bindGlobalHandlers(options: ResolvedTranslationWorkflowOptions): void {
  fallbackOptions = options;

  if (!globalFocusInHandler) {
    globalFocusInHandler = (event: FocusEvent) => {
      pruneDisconnectedEditors();

      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || options;
      const state = ensureState(editor, resolved);
      optionsByEditor.set(editor, resolved);
      lastActiveEditor = editor;

      const selectionSegment = getSegmentElementFromSelection(editor)?.getAttribute('data-translation-segment-id') || null;
      if (selectionSegment) {
        state.selectedSegmentId = selectionSegment;
      }

      updateToolbarState(editor);

      const panel = panelByEditor.get(editor);
      if (panel) {
        applyThemeClass(panel, editor);
        positionPanel(editor, panel);
        refreshPanel(editor);
      }
    };

    document.addEventListener('focusin', globalFocusInHandler, true);
  }

  if (!globalInputHandler) {
    globalInputHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || fallbackOptions;
      if (!resolved) return;

      const state = ensureState(editor, resolved);
      const restoredLockedContent = enforceLockedSegmentIntegrity(editor, state);
      state.segments = extractSegments(editor, resolved, state);

      if (!state.realtimeEnabled) {
        if (restoredLockedContent) {
          const panel = panelByEditor.get(editor);
          if (panel) {
            setPanelLiveMessage(panel, resolved.labels.readonlySegmentMessage);
          }
        }
        refreshPanel(editor);
        updateToolbarState(editor);
        return;
      }

      scheduleRealtimeValidation(editor);
    };

    document.addEventListener('input', globalInputHandler, true);
  }

  if (!globalBeforeInputHandler) {
    globalBeforeInputHandler = (event: Event) => {
      const inputEvent = event as InputEvent;
      const target = inputEvent.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      const lockedSegment = getLockedSegmentFromTarget(target);
      if (!lockedSegment || !editor.contains(lockedSegment)) return;

      inputEvent.preventDefault();
      const panel = panelByEditor.get(editor);
      const optionsEntry = optionsByEditor.get(editor) || fallbackOptions;
      if (panel && optionsEntry) {
        setPanelLiveMessage(panel, optionsEntry.labels.readonlySegmentMessage);
      }
    };

    document.addEventListener('beforeinput', globalBeforeInputHandler, true);
  }

  if (!globalKeydownHandler) {
    globalKeydownHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      const targetPanel = target?.closest(`.${PANEL_CLASS}`) as HTMLElement | null;
      if (targetPanel && event.key !== 'Escape' && !NAVIGATION_KEYS.has(event.key)) return;

      const editor = resolveEditorFromKeyboardEvent(event);
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || fallbackOptions || options;
      const state = ensureState(editor, resolved);
      state.segments = extractSegments(editor, resolved, state);
      optionsByEditor.set(editor, resolved);
      lastActiveEditor = editor;

      if (event.key === 'Escape' && isPanelVisible(editor)) {
        event.preventDefault();
        hidePanel(editor, true);
        return;
      }

      const lockedSegment = getLockedSegmentFromTarget(target);
      if (lockedSegment && editor.contains(lockedSegment) && isEditableKey(event)) {
        event.preventDefault();
        const panel = panelByEditor.get(editor);
        if (panel) setPanelLiveMessage(panel, resolved.labels.readonlySegmentMessage);
        return;
      }

      if (isTogglePanelShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        togglePanel(editor);
        return;
      }

      if (isRunValidationShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        runValidation(editor, 'shortcut', true);
        return;
      }

      if (isToggleLockShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        setSegmentLock(editor);
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

  if (!globalMutationObserver && typeof MutationObserver !== 'undefined' && document.body) {
    globalMutationObserver = new MutationObserver((records) => {
      if (mutationTouchesEditorRemoval(records)) {
        pruneDisconnectedEditors();
      }

      const hasContentMutation = records.some((record) => {
        if (record.type === 'characterData') return true;
        return record.type === 'childList' && (record.addedNodes.length > 0 || record.removedNodes.length > 0);
      });
      if (!hasContentMutation) return;

      trackedEditors.forEach((editor) => {
        const state = stateByEditor.get(editor);
        if (!state || state.lockedSegmentIds.size === 0) return;

        const restored = enforceLockedSegmentIntegrity(editor, state);
        if (!restored) return;

        state.snapshot = '';
        const optionsEntry = optionsByEditor.get(editor) || fallbackOptions;
        const panel = panelByEditor.get(editor);
        if (panel && optionsEntry) {
          setPanelLiveMessage(panel, optionsEntry.labels.readonlySegmentMessage);
        }

        if (optionsEntry) {
          state.segments = extractSegments(editor, optionsEntry, state);
          refreshPanel(editor);
          updateToolbarState(editor);
        }
      });
    });

    globalMutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
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

  if (globalBeforeInputHandler) {
    document.removeEventListener('beforeinput', globalBeforeInputHandler, true);
    globalBeforeInputHandler = null;
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

  if (globalMutationObserver) {
    globalMutationObserver.disconnect();
    globalMutationObserver = null;
  }

  panelByEditor.forEach((panel) => panel.remove());
  panelByEditor.clear();

  const editors = Array.from(trackedEditors);
  editors.forEach((editor) => cleanupEditor(editor));

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
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
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
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} {
      border-color: rgba(100, 116, 139, 0.45);
    }
    .rte-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    .editora-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    .rte-toolbar-button[data-command="toggleTranslationSegmentLock"].active,
    .editora-toolbar-button[data-command="toggleTranslationSegmentLock"].active, 
    .rte-toolbar-button[data-command="toggleTranslationRealtime"].active,
    .editora-toolbar-button[data-command="toggleTranslationRealtime"].active {
      background: rgba(15, 118, 110, 0.12);
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

    ${DARK_THEME_SELECTOR} .rte-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    ${DARK_THEME_SELECTOR} .editora-toolbar-button[data-command="toggleTranslationWorkflowPanel"].active,
    ${DARK_THEME_SELECTOR} .rte-toolbar-button[data-command="toggleTranslationSegmentLock"].active,
    ${DARK_THEME_SELECTOR} .editora-toolbar-button[data-command="toggleTranslationSegmentLock"].active, 
    ${DARK_THEME_SELECTOR} .rte-toolbar-button[data-command="toggleTranslationRealtime"].active,
    ${DARK_THEME_SELECTOR} .editora-toolbar-button[data-command="toggleTranslationRealtime"].active {
      background: linear-gradient(180deg, #5eaaf6 0%, #4a95de 100%);
    }

    .${PANEL_CLASS} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(520px, calc(100vw - 20px));
      max-height: calc(100vh - 20px);
      border: 1px solid #d1d5db;
      border-radius: 14px;
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.24);
      overflow: hidden;
    }

    .${PANEL_CLASS}.show {
      display: flex;
      flex-direction: column;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 24px 52px rgba(2, 6, 23, 0.68);
    }

    .rte-translation-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(180deg, #eff6ff 0%, #e2e8f0 100%);
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-translation-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-translation-icon-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 34px;
      width: 34px;
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

    .rte-translation-icon-btn:hover,
    .rte-translation-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-icon-btn {
      border-color: #475569;
      background: #0f172a;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-icon-btn:hover,
    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-translation-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      overflow: auto;
    }

    .rte-translation-locales {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .rte-translation-locale-field {
      display: grid;
      gap: 4px;
    }

    .rte-translation-source-label,
    .rte-translation-target-label {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-source-label,
    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-target-label {
      color: #cbd5e1;
    }

    .rte-translation-select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 10px;
      font-size: 13px;
      background: #ffffff;
      color: inherit;
    }

    .rte-translation-select:focus-visible {
      border-color: #0e7490;
      box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.18);
      outline: none;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-select {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-translation-summary,
    .rte-translation-helper,
    .rte-translation-shortcut {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-summary,
    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-helper,
    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-shortcut {
      color: #94a3b8;
    }

    .rte-translation-actions {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
    }

    .rte-translation-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 8px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .rte-translation-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .rte-translation-btn-primary {
      border-color: #0e7490;
      background: #0e7490;
      color: #f8fafc;
    }

    .rte-translation-btn:hover,
    .rte-translation-btn:focus-visible {
      border-color: #94a3b8;
      outline: none;
    }

    .rte-translation-btn-primary:hover,
    .rte-translation-btn-primary:focus-visible {
      border-color: #155e75;
      background: #155e75;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-btn-primary {
      border-color: #22d3ee;
      background: #0e7490;
      color: #ecfeff;
    }

    .rte-translation-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .rte-translation-segments-wrap,
    .rte-translation-preview-wrap,
    .rte-translation-issues-wrap {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #f8fafc;
      padding: 8px;
      min-height: 120px;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-segments-wrap,
    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-preview-wrap,
    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-issues-wrap {
      border-color: #334155;
      background: #0b1220;
    }

    .rte-translation-subtitle {
      margin: 0 0 6px;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-subtitle {
      color: #cbd5e1;
    }

    .rte-translation-segments {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 6px;
      max-height: 220px;
      overflow: auto;
      outline: none;
    }

    .rte-translation-segment-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 6px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      padding: 6px;
    }

    .rte-translation-segment-item.selected {
      border-color: #0e7490;
      box-shadow: 0 0 0 2px rgba(14, 116, 144, 0.16);
    }

    .rte-translation-segment-item.locked {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-segment-item {
      border-color: #334155;
      background: #111827;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-segment-item.locked {
      border-color: rgba(245, 158, 11, 0.72);
      background: rgba(120, 53, 15, 0.28);
    }

    .rte-translation-segment-select {
      border: none;
      background: transparent;
      color: inherit;
      text-align: left;
      padding: 0;
      cursor: pointer;
      display: grid;
      gap: 2px;
    }

    .rte-translation-segment-meta {
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
    }

    .rte-translation-segment-text {
      font-size: 12px;
      color: #334155;
      line-height: 1.3;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-segment-meta {
      color: #94a3b8;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-segment-text {
      color: #e2e8f0;
    }

    .rte-translation-segment-lock {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      width: 28px;
      min-height: 28px;
      background: #ffffff;
      cursor: pointer;
      position: relative;
      color: inherit;
      font-size: 0;
    }

    .rte-translation-segment-lock::before {
      content: '🔒';
      font-size: 14px;
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      opacity: 0.35;
    }

    .rte-translation-segment-lock[aria-pressed="true"]::before {
      opacity: 1;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-segment-lock {
      border-color: #334155;
      background: #111827;
    }

    .rte-translation-preview-block {
      display: grid;
      gap: 4px;
      margin-bottom: 8px;
    }

    .rte-translation-preview-label {
      margin: 0;
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
    }

    .rte-translation-source-preview,
    .rte-translation-target-preview {
      margin: 0;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      padding: 8px;
      font-size: 12px;
      min-height: 56px;
      white-space: pre-wrap;
      line-height: 1.35;
      color: #1f2937;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-preview-label {
      color: #94a3b8;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-source-preview,
    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-target-preview {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .rte-translation-issues {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 6px;
      max-height: 200px;
      overflow: auto;
    }

    .rte-translation-issue {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      padding: 8px;
      display: grid;
      gap: 4px;
      cursor: pointer;
    }

    .rte-translation-issue.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .rte-translation-issue.warning {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .rte-translation-issue.info {
      border-color: #0ea5e9;
      background: #f0f9ff;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-issue {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-issue.error {
      border-color: rgba(239, 68, 68, 0.7);
      background: rgba(127, 29, 29, 0.28);
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-issue.warning {
      border-color: rgba(245, 158, 11, 0.72);
      background: rgba(120, 53, 15, 0.28);
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-issue.info {
      border-color: rgba(14, 165, 233, 0.7);
      background: rgba(7, 89, 133, 0.28);
    }

    .rte-translation-issue-message,
    .rte-translation-issue-suggestion {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #1f2937;
    }

    .rte-translation-issue-suggestion {
      color: #475569;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-issue-message {
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-translation-workflow-theme-dark .rte-translation-issue-suggestion {
      color: #cbd5e1;
    }

    .rte-translation-empty {
      margin: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .rte-translation-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    [data-translation-locked="true"].rte-translation-segment-locked {
      outline: 2px dashed rgba(245, 158, 11, 0.65);
      outline-offset: 2px;
      background: rgba(255, 251, 235, 0.8);
      border-radius: 4px;
    }

    ${DARK_THEME_SELECTOR} [data-translation-locked="true"].rte-translation-segment-locked {
      outline-color: rgba(245, 158, 11, 0.75);
      background: rgba(120, 53, 15, 0.22);
    }

    @media (max-width: 920px) {
      .${PANEL_CLASS} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }

      .rte-translation-locales,
      .rte-translation-actions,
      .rte-translation-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);
}

export const TranslationWorkflowPlugin = (rawOptions: TranslationWorkflowPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  const instanceEditors = new Set<HTMLElement>();

  ensureStylesInjected();

  return {
    name: 'translationWorkflow',

    toolbar: [
      {
        id: 'translationWorkflowGroup',
        label: 'Translation Workflow',
        type: 'group',
        command: 'translationWorkflow',
        items: [
          {
            id: 'toggleTranslationWorkflowPanel',
            label: 'Translation Workflow',
            command: 'toggleTranslationWorkflowPanel',
            shortcut: 'Mod-Alt-Shift-l',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 6.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8l-4 3V6.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M20 17.5a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-1.5" stroke="currentColor" stroke-width="1.6"/><path d="m13 8 2 2m0 0 2-2m-2 2V4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          },
          {
            id: 'runTranslationLocaleValidation',
            label: 'Run Locale Validation',
            command: 'runTranslationLocaleValidation',
            shortcut: 'Mod-Alt-Shift-v',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4.5" y="4" width="12" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h5.5M8 11h4M8 14h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m15.5 15.5 1.7 1.7 3.3-3.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          },
          {
            id: 'toggleTranslationSegmentLock',
            label: 'Toggle Segment Lock',
            command: 'toggleTranslationSegmentLock',
            shortcut: 'Mod-Alt-Shift-k',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 10V7.5a3.5 3.5 0 1 1 7 0V10" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="15" r="1.2" fill="currentColor"/></svg>',
          },
          {
            id: 'toggleTranslationRealtime',
            label: 'Toggle Translation Realtime',
            command: 'toggleTranslationRealtime',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 1 7.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 19.5H5.5v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8v4l2.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          },
        ],
      },
    ],

    commands: {
      translationWorkflow: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);
        lastActiveEditor = editor;
        showPanel(editor);
        return true;
      },

      openTranslationWorkflowPanel: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);
        lastActiveEditor = editor;
        showPanel(editor);
        return true;
      },

      toggleTranslationWorkflowPanel: (value?: boolean, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);
        lastActiveEditor = editor;
        return togglePanel(editor, typeof value === 'boolean' ? value : undefined);
      },

      runTranslationLocaleValidation: (
        _value?: unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);
        lastActiveEditor = editor;

        runValidation(editor, 'command', true);
        return true;
      },

      toggleTranslationRealtime: (value?: boolean, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);
        lastActiveEditor = editor;

        return toggleRealtime(editor, typeof value === 'boolean' ? value : undefined);
      },

      toggleTranslationSegmentLock: (
        value?: boolean | { locked?: boolean; segmentId?: string },
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);
        lastActiveEditor = editor;

        const explicit = typeof value === 'boolean' ? value : value?.locked;
        const segmentId = typeof value === 'object' ? value?.segmentId : undefined;
        return setSegmentLock(editor, segmentId, explicit);
      },

      setTranslationLocales: (
        value?: { sourceLocale?: string; targetLocale?: string },
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor || !value || typeof value !== 'object') return false;

        const resolved = optionsByEditor.get(editor) || options;
        const state = ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        if (typeof value.sourceLocale === 'string' && value.sourceLocale.trim()) {
          state.sourceLocale = sanitizeLocale(value.sourceLocale);
        }

        if (typeof value.targetLocale === 'string' && value.targetLocale.trim()) {
          state.targetLocale = sanitizeLocale(value.targetLocale);
        }

        state.snapshot = '';
        runValidation(editor, 'set-locales', true);
        return true;
      },

      captureTranslationSourceSnapshot: (
        _value?: unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);
        lastActiveEditor = editor;

        return captureSourceSnapshot(editor);
      },

      setTranslationWorkflowOptions: (
        value?: Partial<TranslationWorkflowPluginOptions>,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor || !value || typeof value !== 'object') return false;

        const current = optionsByEditor.get(editor) || options;
        const currentRaw = rawOptionsByEditor.get(editor) || toRawOptions(current);

        const mergedRaw: TranslationWorkflowPluginOptions = {
          ...currentRaw,
          ...value,
          labels: {
            ...(currentRaw.labels || {}),
            ...(value.labels || {}),
          },
          localeRules: Array.isArray(value.localeRules) ? value.localeRules : currentRaw.localeRules,
          locales: Array.isArray(value.locales) ? value.locales : currentRaw.locales,
          normalizeText: value.normalizeText || current.normalizeText,
        };

        const merged = normalizeOptions(mergedRaw);
        optionsByEditor.set(editor, merged);
        rawOptionsByEditor.set(editor, mergedRaw);

        const state = ensureState(editor, merged);
        if (typeof value.enableRealtime === 'boolean') {
          state.realtimeEnabled = value.enableRealtime;
        }

        if (typeof value.sourceLocale === 'string' && value.sourceLocale.trim()) {
          state.sourceLocale = sanitizeLocale(value.sourceLocale);
        }

        if (typeof value.targetLocale === 'string' && value.targetLocale.trim()) {
          state.targetLocale = sanitizeLocale(value.targetLocale);
        }

        state.snapshot = '';
        runValidation(editor, 'set-options', true);
        refreshPanel(editor);
        updateToolbarState(editor);
        return true;
      },

      getTranslationWorkflowState: (
        value?: ((state: TranslationWorkflowRuntimeState) => void) | unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);

        const snapshot = getRuntimeStateSnapshot(editor);
        if (typeof value === 'function') {
          try {
            (value as (state: TranslationWorkflowRuntimeState) => void)(snapshot);
          } catch {
            // Ignore callback errors.
          }
        }

        (editor as any).__translationWorkflowState = snapshot;
        editor.dispatchEvent(
          new CustomEvent('editora:translation-workflow-state', {
            bubbles: true,
            detail: snapshot,
          }),
        );
        return true;
      },
    },

    keymap: {
      'Mod-Alt-Shift-l': 'toggleTranslationWorkflowPanel',
      'Mod-Alt-Shift-L': 'toggleTranslationWorkflowPanel',
      'Mod-Alt-Shift-v': 'runTranslationLocaleValidation',
      'Mod-Alt-Shift-V': 'runTranslationLocaleValidation',
      'Mod-Alt-Shift-k': 'toggleTranslationSegmentLock',
      'Mod-Alt-Shift-K': 'toggleTranslationSegmentLock',
    },

    init: function init(this: any, context?: { editorElement?: HTMLElement }) {
      pluginInstanceCount += 1;

      const runtimeRaw =
        this && typeof this.__pluginConfig === 'object'
          ? ({ ...rawOptions, ...(this.__pluginConfig as TranslationWorkflowPluginOptions) } as TranslationWorkflowPluginOptions)
          : rawOptions;

      const runtimeConfig = normalizeOptions(runtimeRaw);
      bindGlobalHandlers(runtimeConfig);

      const editor = resolveEditorFromContext(
        context?.editorElement ? { editorElement: context.editorElement } : undefined,
        false,
        false,
      );
      if (!editor) return;

      lastActiveEditor = editor;
      instanceEditors.add(editor);

      const state = ensureState(editor, runtimeConfig);
      optionsByEditor.set(editor, runtimeConfig);
      rawOptionsByEditor.set(editor, runtimeRaw);

      state.segments = extractSegments(editor, runtimeConfig, state);
      runValidation(editor, 'init', true);
      updateToolbarState(editor);
    },

    destroy: () => {
      instanceEditors.forEach((editor) => cleanupEditor(editor));
      instanceEditors.clear();

      pluginInstanceCount = Math.max(0, pluginInstanceCount - 1);
      if (pluginInstanceCount > 0) return;

      unbindGlobalHandlers();
    },
  };
};
