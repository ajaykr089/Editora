import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_HOST_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';
const STYLE_ID = 'rte-pii-redaction-styles';
const PANEL_CLASS = 'rte-pii-redaction-panel';
const TOOLBAR_GROUP_CLASS = 'pii-redaction';
const LEGACY_TOOLBAR_GROUP_CLASS = 'piiRedaction';
const DARK_THEME_SELECTOR = ':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';
const SHOW_TEXT_NODE_FILTER = typeof NodeFilter !== 'undefined' ? NodeFilter.SHOW_TEXT : 4;

export type PIIRedactionType = 'email' | 'phone' | 'ssn' | 'credit-card' | 'ipv4' | 'api-key' | 'jwt';
export type PIIRedactionSeverity = 'high' | 'medium' | 'low';
export type PIIRedactionMode = 'token' | 'mask';

export interface PIIFinding {
  id: string;
  type: PIIRedactionType;
  severity: PIIRedactionSeverity;
  match: string;
  masked: string;
  occurrence: number;
  excerpt?: string;
  suggestion?: string;
}

export interface PIIRedactionStats {
  total: number;
  high: number;
  medium: number;
  low: number;
  redactedCount: number;
  byType: Record<PIIRedactionType, number>;
}

export interface PIIRedactionLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  scanText?: string;
  redactAllText?: string;
  redactText?: string;
  locateText?: string;
  realtimeOnText?: string;
  realtimeOffText?: string;
  closeText?: string;
  noFindingsText?: string;
  summaryPrefix?: string;
  shortcutText?: string;
  readonlyRedactionText?: string;
  matchLabel?: string;
  maskedLabel?: string;
  excerptLabel?: string;
}

export interface PIIRedactionDetectorConfig {
  enabled?: boolean;
  severity?: PIIRedactionSeverity;
  pattern?: RegExp;
}

export interface PIIRedactionPluginOptions {
  enableRealtime?: boolean;
  debounceMs?: number;
  maxFindings?: number;
  maskChar?: string;
  revealStart?: number;
  revealEnd?: number;
  redactionMode?: PIIRedactionMode;
  redactionToken?: string;
  detectors?: Partial<Record<PIIRedactionType, boolean | PIIRedactionDetectorConfig>>;
  labels?: PIIRedactionLabels;
  normalizeText?: (value: string) => string;
  skipInCodeBlocks?: boolean;
}

interface PIIRegexDescriptor {
  type: PIIRedactionType;
  label: string;
  severity: PIIRedactionSeverity;
  enabled: boolean;
  pattern: RegExp;
  validator?: (match: string) => boolean;
}

interface ResolvedPIIRedactionOptions {
  enableRealtime: boolean;
  debounceMs: number;
  maxFindings: number;
  maskChar: string;
  revealStart: number;
  revealEnd: number;
  redactionMode: PIIRedactionMode;
  redactionToken: string;
  skipInCodeBlocks: boolean;
  labels: Required<PIIRedactionLabels>;
  normalizeText: (value: string) => string;
  detectors: PIIRegexDescriptor[];
  detectorSignature: string;
}

interface InternalTextMatch {
  type: PIIRedactionType;
  severity: PIIRedactionSeverity;
  value: string;
  start: number;
  end: number;
}

const PII_TYPE_ORDER: PIIRedactionType[] = [
  'email',
  'phone',
  'ssn',
  'credit-card',
  'ipv4',
  'api-key',
  'jwt',
];

const defaultLabels: Required<PIIRedactionLabels> = {
  panelTitle: 'PII Redaction',
  panelAriaLabel: 'PII redaction panel',
  scanText: 'Scan PII',
  redactAllText: 'Redact All',
  redactText: 'Redact',
  locateText: 'Locate',
  realtimeOnText: 'Realtime On',
  realtimeOffText: 'Realtime Off',
  closeText: 'Close',
  noFindingsText: 'No PII detected in the document.',
  summaryPrefix: 'Findings',
  shortcutText: 'Shortcuts: Ctrl/Cmd+Alt+Shift+I/U/M/Y',
  readonlyRedactionText: 'Editor is read-only. Reopen editable mode to redact.',
  matchLabel: 'Detected',
  maskedLabel: 'Masked',
  excerptLabel: 'Context',
};

const defaultDetectors: Record<PIIRedactionType, Omit<PIIRegexDescriptor, 'type' | 'enabled'>> = {
  email: {
    label: 'Email',
    severity: 'medium',
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  phone: {
    label: 'Phone',
    severity: 'medium',
    pattern: /\b(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})\b/g,
  },
  ssn: {
    label: 'SSN',
    severity: 'high',
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
  },
  'credit-card': {
    label: 'Credit Card',
    severity: 'high',
    pattern: /\b(?:\d[ -]*?){13,19}\b/g,
    validator: (match) => isValidCardNumber(match),
  },
  ipv4: {
    label: 'IPv4',
    severity: 'low',
    pattern: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/g,
  },
  'api-key': {
    label: 'API Key',
    severity: 'high',
    pattern: /\b(?:sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z\-_]{35}|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]{10,})\b/g,
  },
  jwt: {
    label: 'JWT',
    severity: 'high',
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
};

const optionsByEditor = new WeakMap<HTMLElement, ResolvedPIIRedactionOptions>();
const findingsByEditor = new WeakMap<HTMLElement, PIIFinding[]>();
const statsByEditor = new WeakMap<HTMLElement, PIIRedactionStats>();
const realtimeEnabledByEditor = new WeakMap<HTMLElement, boolean>();
const debounceTimerByEditor = new WeakMap<HTMLElement, number>();
const snapshotByEditor = new WeakMap<HTMLElement, string>();
const scanVersionByEditor = new WeakMap<HTMLElement, number>();
const panelByEditor = new Map<HTMLElement, HTMLElement>();
const panelVisibleByEditor = new WeakMap<HTMLElement, boolean>();
const trackedEditors = new Set<HTMLElement>();
const activeDebounceTimers = new Set<number>();

let pluginInstanceCount = 0;
let panelSequence = 0;
let findingSequence = 0;
let fallbackOptions: ResolvedPIIRedactionOptions | null = null;
let lastActiveEditor: HTMLElement | null = null;

let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let globalInputHandler: ((event: Event) => void) | null = null;
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

function ensureGlobalRegex(pattern: RegExp): RegExp {
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  return new RegExp(pattern.source, flags);
}

function cloneRegex(pattern: RegExp): RegExp {
  return new RegExp(pattern.source, pattern.flags);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeSeverity(value: unknown, fallback: PIIRedactionSeverity): PIIRedactionSeverity {
  if (value === 'high' || value === 'medium' || value === 'low') return value;
  return fallback;
}

function sanitizeMaskChar(raw: string | undefined): string {
  const candidate = (raw || '*').slice(0, 1) || '*';
  // Keep mask mode idempotent by disallowing chars that can still satisfy core detector patterns.
  if (/[A-Za-z0-9._%+\-\s]/.test(candidate)) return '*';
  return candidate;
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function isValidCardNumber(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function normalizeDetector(
  type: PIIRedactionType,
  value: boolean | PIIRedactionDetectorConfig | undefined,
): PIIRegexDescriptor {
  const fallback = defaultDetectors[type];

  if (typeof value === 'boolean') {
    return {
      type,
      label: fallback.label,
      severity: fallback.severity,
      enabled: value,
      pattern: ensureGlobalRegex(fallback.pattern),
      validator: fallback.validator,
    };
  }

  if (!value) {
    return {
      type,
      label: fallback.label,
      severity: fallback.severity,
      enabled: true,
      pattern: ensureGlobalRegex(fallback.pattern),
      validator: fallback.validator,
    };
  }

  const normalizedPattern = value.pattern instanceof RegExp ? ensureGlobalRegex(value.pattern) : ensureGlobalRegex(fallback.pattern);

  return {
    type,
    label: fallback.label,
    severity: normalizeSeverity(value.severity, fallback.severity),
    enabled: value.enabled !== false,
    pattern: normalizedPattern,
    validator: fallback.validator,
  };
}

function normalizeOptions(raw: PIIRedactionPluginOptions = {}): ResolvedPIIRedactionOptions {
  const detectors = PII_TYPE_ORDER.map((type) => normalizeDetector(type, raw.detectors?.[type]));
  const detectorSignature = detectors
    .map((detector) => `${detector.type}:${detector.enabled ? '1' : '0'}:${detector.severity}:${detector.pattern.source}:${detector.pattern.flags}`)
    .join('|');

  return {
    enableRealtime: raw.enableRealtime !== false,
    debounceMs: clamp(Number(raw.debounceMs ?? 220), 60, 3000),
    maxFindings: clamp(Number(raw.maxFindings ?? 140), 1, 500),
    maskChar: sanitizeMaskChar(raw.maskChar),
    revealStart: clamp(Number(raw.revealStart ?? 2), 0, 12),
    revealEnd: clamp(Number(raw.revealEnd ?? 2), 0, 12),
    redactionMode: raw.redactionMode === 'mask' ? 'mask' : 'token',
    redactionToken: (raw.redactionToken || 'REDACTED').trim() || 'REDACTED',
    skipInCodeBlocks: raw.skipInCodeBlocks !== false,
    labels: {
      ...defaultLabels,
      ...(raw.labels || {}),
    },
    normalizeText: raw.normalizeText || defaultNormalizeText,
    detectors,
    detectorSignature,
  };
}

function toRawOptions(options: ResolvedPIIRedactionOptions): PIIRedactionPluginOptions {
  const detectors: Partial<Record<PIIRedactionType, PIIRedactionDetectorConfig>> = {};
  options.detectors.forEach((detector) => {
    detectors[detector.type] = {
      enabled: detector.enabled,
      severity: detector.severity,
      pattern: detector.pattern,
    };
  });

  return {
    enableRealtime: options.enableRealtime,
    debounceMs: options.debounceMs,
    maxFindings: options.maxFindings,
    maskChar: options.maskChar,
    revealStart: options.revealStart,
    revealEnd: options.revealEnd,
    redactionMode: options.redactionMode,
    redactionToken: options.redactionToken,
    skipInCodeBlocks: options.skipInCodeBlocks,
    labels: { ...options.labels },
    normalizeText: options.normalizeText,
    detectors,
  };
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const root = editor.closest(EDITOR_HOST_SELECTOR);
  return (root as HTMLElement) || editor;
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

  const contentFromHost = resolveContentFromHost(explicitContext);
  if (contentFromHost) return contentFromHost;

  const host = explicitContext.closest(EDITOR_HOST_SELECTOR);
  if (host) {
    const content = resolveContentFromHost(host);
    if (content) return content;
  }

  const nearestEditable = explicitContext.closest(EDITOR_CONTENT_SELECTOR);
  return nearestEditable instanceof HTMLElement ? nearestEditable : null;
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
  target.classList.remove('rte-pii-redaction-theme-dark');
  if (shouldUseDarkTheme(editor)) {
    target.classList.add('rte-pii-redaction-theme-dark');
  }
}

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function clearDebounceTimer(editor: HTMLElement): void {
  const existing = debounceTimerByEditor.get(editor);
  if (typeof existing !== 'number') return;

  window.clearTimeout(existing);
  activeDebounceTimers.delete(existing);
  debounceTimerByEditor.delete(editor);
}

function isEditorReadonly(editor: HTMLElement): boolean {
  return editor.getAttribute('contenteditable') === 'false' || editor.getAttribute('data-readonly') === 'true';
}

function createEmptyStats(redactedCount = 0): PIIRedactionStats {
  return {
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    redactedCount,
    byType: {
      email: 0,
      phone: 0,
      ssn: 0,
      'credit-card': 0,
      ipv4: 0,
      'api-key': 0,
      jwt: 0,
    },
  };
}

function pruneDisconnectedEditors(): void {
  const editors = Array.from(trackedEditors);
  editors.forEach((editor) => {
    if (editor.isConnected) return;
    cleanupEditorState(editor);
  });
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

function resolveEditorFromContext(
  context?: { editorElement?: unknown; contentElement?: unknown },
  allowFirstMatch = true,
): HTMLElement | null {
  pruneDisconnectedEditors();

  if (context?.contentElement instanceof HTMLElement) return context.contentElement;

  if (context?.editorElement instanceof HTMLElement) {
    const host = context.editorElement;
    const content = resolveContentFromHost(host);
    if (content) return content;
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

function cleanupEditorState(editor: HTMLElement): void {
  clearDebounceTimer(editor);
  panelByEditor.get(editor)?.remove();
  panelByEditor.delete(editor);
  panelVisibleByEditor.delete(editor);
  optionsByEditor.delete(editor);
  findingsByEditor.delete(editor);
  statsByEditor.delete(editor);
  realtimeEnabledByEditor.delete(editor);
  snapshotByEditor.delete(editor);
  scanVersionByEditor.delete(editor);
  trackedEditors.delete(editor);

  if (lastActiveEditor === editor) {
    lastActiveEditor = null;
  }
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

function ensureEditorState(editor: HTMLElement, options: ResolvedPIIRedactionOptions): void {
  if (!optionsByEditor.has(editor)) optionsByEditor.set(editor, options);
  if (!findingsByEditor.has(editor)) findingsByEditor.set(editor, []);
  if (!statsByEditor.has(editor)) statsByEditor.set(editor, createEmptyStats(0));
  if (!realtimeEnabledByEditor.has(editor)) realtimeEnabledByEditor.set(editor, options.enableRealtime);
  trackedEditors.add(editor);
}

function isPanelVisible(editor: HTMLElement): boolean {
  return panelVisibleByEditor.get(editor) === true;
}

function maskGeneral(value: string, maskChar: string, revealStart: number, revealEnd: number): string {
  if (!value) return value;
  if (value.length <= revealStart + revealEnd) {
    return maskChar.repeat(value.length);
  }

  const prefix = value.slice(0, revealStart);
  const suffix = revealEnd > 0 ? value.slice(value.length - revealEnd) : '';
  return `${prefix}${maskChar.repeat(Math.max(1, value.length - revealStart - revealEnd))}${suffix}`;
}

function maskDigitsPreservingFormat(value: string, maskChar: string, revealLastDigits: number): string {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length === 0) return value;

  let digitsSeen = 0;
  const digitsToMask = Math.max(0, digitsOnly.length - revealLastDigits);

  return value
    .split('')
    .map((char) => {
      if (!/\d/.test(char)) return char;
      digitsSeen += 1;
      return digitsSeen <= digitsToMask ? maskChar : char;
    })
    .join('');
}

function maskEmail(value: string, maskChar: string): string {
  const atIndex = value.indexOf('@');
  if (atIndex <= 0) return value;

  const localPart = value.slice(0, atIndex);
  const domainPart = value.slice(atIndex + 1);

  if (localPart.length <= 2) {
    return `${localPart[0] || ''}${maskChar}[at]${domainPart}`;
  }

  return `${localPart[0]}${maskChar.repeat(Math.max(1, localPart.length - 2))}${localPart[localPart.length - 1]}[at]${domainPart}`;
}

function maskIPv4(value: string, maskChar: string): string {
  const parts = value.split('.');
  if (parts.length !== 4) return value;

  return `${parts[0]}.${parts[1]}.${parts[2]}.${maskChar.repeat(Math.max(1, parts[3].length))}`;
}

function maskMatchPreview(match: string, type: PIIRedactionType, options: ResolvedPIIRedactionOptions): string {
  if (!match) return match;

  if (type === 'email') return maskEmail(match, options.maskChar);
  if (type === 'phone') return maskDigitsPreservingFormat(match, options.maskChar, 4);
  if (type === 'ssn') return maskDigitsPreservingFormat(match, options.maskChar, 4);
  if (type === 'credit-card') return maskDigitsPreservingFormat(match, options.maskChar, 4);
  if (type === 'ipv4') return maskIPv4(match, options.maskChar);

  if (type === 'api-key' || type === 'jwt') {
    return maskGeneral(match, options.maskChar, 0, 0);
  }

  return maskGeneral(match, options.maskChar, options.revealStart, options.revealEnd);
}

function buildRedactionReplacement(match: string, type: PIIRedactionType, options: ResolvedPIIRedactionOptions): string {
  if (options.redactionMode === 'mask') {
    return maskMatchPreview(match, type, options);
  }

  return `[${options.redactionToken}:${type.toUpperCase()}]`;
}

function createFindingId(type: PIIRedactionType): string {
  findingSequence += 1;
  return `pii-${type}-${Date.now().toString(36)}-${findingSequence.toString(36)}`;
}

function shouldSkipNode(node: Text, options: ResolvedPIIRedactionOptions): boolean {
  if (!options.skipInCodeBlocks) return false;
  return Boolean(node.parentElement?.closest('code, pre, kbd, samp'));
}

function intersectsAny(range: { start: number; end: number }, accepted: InternalTextMatch[]): boolean {
  return accepted.some((item) => range.start < item.end && item.start < range.end);
}

function collectMatchesForText(
  text: string,
  detectors: PIIRegexDescriptor[],
  maxMatches: number,
): InternalTextMatch[] {
  const candidates: InternalTextMatch[] = [];
  const enabled = detectors.filter((detector) => detector.enabled);

  enabled.forEach((detector) => {
    const regex = cloneRegex(detector.pattern);
    let match = regex.exec(text);

    while (match && candidates.length < maxMatches * 5) {
      const value = match[0] || '';
      const start = match.index;
      const end = start + value.length;

      if (value && end > start) {
        if (!detector.validator || detector.validator(value)) {
          candidates.push({
            type: detector.type,
            severity: detector.severity,
            value,
            start,
            end,
          });
        }
      }

      if (regex.lastIndex === match.index) {
        regex.lastIndex += 1;
      }
      match = regex.exec(text);
    }
  });

  candidates.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  const accepted: InternalTextMatch[] = [];
  for (let index = 0; index < candidates.length; index += 1) {
    if (accepted.length >= maxMatches) break;

    const candidate = candidates[index];
    if (intersectsAny({ start: candidate.start, end: candidate.end }, accepted)) continue;
    accepted.push(candidate);
  }

  return accepted;
}

function truncate(value: string, limit = 120): string {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trimEnd()}...`;
}

function buildExcerpt(source: string, start: number, end: number): string {
  const left = Math.max(0, start - 28);
  const right = Math.min(source.length, end + 28);
  return truncate(source.slice(left, right).trim(), 180);
}

function computeStats(findings: PIIFinding[], redactedCount: number): PIIRedactionStats {
  const stats = createEmptyStats(redactedCount);
  stats.total = findings.length;

  findings.forEach((finding) => {
    stats.byType[finding.type] += 1;
    if (finding.severity === 'high') stats.high += 1;
    else if (finding.severity === 'medium') stats.medium += 1;
    else stats.low += 1;
  });

  return stats;
}

function setPanelLiveMessage(panel: HTMLElement, message: string): void {
  const live = panel.querySelector<HTMLElement>('.rte-pii-redaction-live');
  if (live) live.textContent = message;
}

function updateRealtimeButtonText(editor: HTMLElement, panel: HTMLElement, options: ResolvedPIIRedactionOptions): void {
  const button = panel.querySelector<HTMLButtonElement>('[data-action="toggle-realtime"]');
  if (!button) return;

  const enabled = getRealtimeEnabled(editor, options);
  button.textContent = enabled ? options.labels.realtimeOnText : options.labels.realtimeOffText;
  button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  setCommandButtonActiveState(editor, 'togglePIIRealtime', enabled);
}

function applyPanelLabels(panel: HTMLElement, options: ResolvedPIIRedactionOptions): void {
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);

  const title = panel.querySelector<HTMLElement>('.rte-pii-redaction-title');
  if (title) title.textContent = options.labels.panelTitle;

  const close = panel.querySelector<HTMLButtonElement>('[data-action="close"]');
  if (close) close.setAttribute('aria-label', options.labels.closeText);

  const scan = panel.querySelector<HTMLButtonElement>('[data-action="run-scan"]');
  if (scan) scan.textContent = options.labels.scanText;

  const redactAll = panel.querySelector<HTMLButtonElement>('[data-action="redact-all"]');
  if (redactAll) redactAll.textContent = options.labels.redactAllText;

  const shortcut = panel.querySelector<HTMLElement>('.rte-pii-redaction-shortcut');
  if (shortcut) shortcut.textContent = options.labels.shortcutText;
}

function refreshPanel(editor: HTMLElement): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;

  const findings = findingsByEditor.get(editor) || [];
  const stats = statsByEditor.get(editor) || createEmptyStats(0);
  const readonly = isEditorReadonly(editor);

  const countEl = panel.querySelector<HTMLElement>('.rte-pii-redaction-count');
  const summaryEl = panel.querySelector<HTMLElement>('.rte-pii-redaction-summary');
  const listEl = panel.querySelector<HTMLElement>('.rte-pii-redaction-list');
  const redactAllButton = panel.querySelector<HTMLButtonElement>('[data-action="redact-all"]');

  if (!countEl || !summaryEl || !listEl || !redactAllButton) return;

  countEl.textContent = String(stats.total);
  summaryEl.textContent = `${options.labels.summaryPrefix}: ${stats.total} | High ${stats.high} | Medium ${stats.medium} | Low ${stats.low} | Redacted ${stats.redactedCount}`;
  redactAllButton.disabled = readonly || findings.length === 0;

  if (readonly) {
    setPanelLiveMessage(panel, options.labels.readonlyRedactionText);
  } else {
    setPanelLiveMessage(panel, `${stats.total} PII findings detected.`);
  }

  updateRealtimeButtonText(editor, panel, options);

  if (findings.length === 0) {
    listEl.innerHTML = `<li class="rte-pii-redaction-empty">${escapeHtml(options.labels.noFindingsText)}</li>`;
    return;
  }

  listEl.innerHTML = findings
    .map((finding) => {
      const typeName = finding.type.toUpperCase();
      const suggestion = finding.suggestion || 'Redact this finding before export/share.';
      const locateLabel = `${options.labels.locateText}: ${finding.match}`;
      const redactLabel = `${options.labels.redactText}: ${finding.match}`;
      const disabledAttr = readonly ? 'disabled aria-disabled="true"' : '';

      return `
        <li class="rte-pii-redaction-item rte-pii-redaction-item-${finding.severity}">
          <button
            type="button"
            class="rte-pii-redaction-item-btn"
            data-action="locate-finding"
            data-finding-id="${escapeHtml(finding.id)}"
            data-role="finding-button"
            aria-label="${escapeHtml(locateLabel)}"
          >
            <span class="rte-pii-redaction-badge">${escapeHtml(finding.severity.toUpperCase())}</span>
            <span class="rte-pii-redaction-type">${escapeHtml(typeName)}</span>
          </button>
          <p class="rte-pii-redaction-line"><strong>${escapeHtml(options.labels.matchLabel)}:</strong> ${escapeHtml(truncate(finding.match, 80))}</p>
          <p class="rte-pii-redaction-line"><strong>${escapeHtml(options.labels.maskedLabel)}:</strong> ${escapeHtml(truncate(finding.masked, 80))}</p>
          ${finding.excerpt ? `<p class="rte-pii-redaction-line"><strong>${escapeHtml(options.labels.excerptLabel)}:</strong> ${escapeHtml(finding.excerpt)}</p>` : ''}
          <p class="rte-pii-redaction-help">${escapeHtml(suggestion)}</p>
          <div class="rte-pii-redaction-item-actions">
            <button type="button" class="rte-pii-redaction-btn" data-action="redact-finding" data-finding-id="${escapeHtml(
              finding.id,
            )}" aria-label="${escapeHtml(redactLabel)}" ${disabledAttr}>${escapeHtml(options.labels.redactText)}</button>
          </div>
        </li>
      `;
    })
    .join('');
}

function positionPanel(editor: HTMLElement, panel: HTMLElement): void {
  if (!panel.classList.contains('show')) return;

  const root = resolveEditorRoot(editor);
  const rect = root.getBoundingClientRect();
  const panelWidth = Math.min(window.innerWidth - 20, 390);
  const maxLeft = Math.max(10, window.innerWidth - panelWidth - 10);
  const left = Math.min(Math.max(10, rect.right - panelWidth), maxLeft);
  const top = Math.max(10, Math.min(window.innerHeight - 10 - 280, rect.top + 10));

  panel.style.width = `${panelWidth}px`;
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.maxHeight = `${Math.max(260, window.innerHeight - 20)}px`;
}

function getRealtimeEnabled(editor: HTMLElement, options?: ResolvedPIIRedactionOptions): boolean {
  const stored = realtimeEnabledByEditor.get(editor);
  if (typeof stored === 'boolean') return stored;
  return options ? options.enableRealtime : true;
}

function recordDomHistoryTransaction(editor: HTMLElement, beforeHTML: string): void {
  if (beforeHTML === editor.innerHTML) return;
  const executor = (window as any).execEditorCommand || (window as any).executeEditorCommand;
  if (typeof executor !== 'function') return;

  try {
    executor('recordDomTransaction', editor, beforeHTML, editor.innerHTML);
  } catch {
    // History plugin may not be loaded.
  }
}

function dispatchEditorInput(editor: HTMLElement): void {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function emitRedactedEvent(editor: HTMLElement, count: number): void {
  editor.dispatchEvent(
    new CustomEvent('editora:pii-redacted', {
      bubbles: true,
      detail: {
        redactedCount: count,
      },
    }),
  );
}

function getFindingById(editor: HTMLElement, findingId: string): PIIFinding | undefined {
  const findings = findingsByEditor.get(editor) || [];
  return findings.find((item) => item.id === findingId);
}

function ensurePanel(editor: HTMLElement): HTMLElement {
  const existing = panelByEditor.get(editor);
  if (existing) return existing;

  const options = optionsByEditor.get(editor) || fallbackOptions || normalizeOptions();
  const panelId = `rte-pii-redaction-panel-${panelSequence++}`;

  const panel = document.createElement('section');
  panel.className = PANEL_CLASS;
  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);

  panel.innerHTML = `
    <header class="rte-pii-redaction-header">
      <h2 class="rte-pii-redaction-title">${escapeHtml(options.labels.panelTitle)}</h2>
      <button type="button" class="rte-pii-redaction-icon-btn" data-action="close" aria-label="${escapeHtml(
        options.labels.closeText,
      )}">✕</button>
    </header>
    <div class="rte-pii-redaction-body">
      <div class="rte-pii-redaction-topline">
        <p class="rte-pii-redaction-summary" aria-live="polite"></p>
        <span class="rte-pii-redaction-count" aria-hidden="true">0</span>
      </div>
      <div class="rte-pii-redaction-controls" role="toolbar" aria-label="PII redaction controls">
        <button type="button" class="rte-pii-redaction-btn rte-pii-redaction-btn-primary" data-action="run-scan">${escapeHtml(
          options.labels.scanText,
        )}</button>
        <button type="button" class="rte-pii-redaction-btn" data-action="redact-all">${escapeHtml(
          options.labels.redactAllText,
        )}</button>
        <button type="button" class="rte-pii-redaction-btn" data-action="toggle-realtime" aria-pressed="false"></button>
      </div>
      <ul class="rte-pii-redaction-list" role="list" aria-label="Detected PII findings"></ul>
      <p class="rte-pii-redaction-shortcut">${escapeHtml(options.labels.shortcutText)}</p>
      <span class="rte-pii-redaction-live" aria-live="polite"></span>
    </div>
  `;

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const actionEl = target?.closest<HTMLElement>('[data-action]');
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action') || '';
    const resolved = optionsByEditor.get(editor) || fallbackOptions || options;
    optionsByEditor.set(editor, resolved);
    ensureEditorState(editor, resolved);

    if (action === 'close') {
      hidePanel(editor, true);
      return;
    }

    if (action === 'run-scan') {
      void runPIIScan(editor, resolved, true);
      return;
    }

    if (action === 'toggle-realtime') {
      const next = !getRealtimeEnabled(editor, resolved);
      realtimeEnabledByEditor.set(editor, next);
      updateRealtimeButtonText(editor, panel, resolved);
      if (next) {
        void runPIIScan(editor, resolved, true);
      }
      return;
    }

    if (action === 'redact-all') {
      void redactAllFindings(editor, resolved);
      return;
    }

    if (action === 'locate-finding') {
      const findingId = actionEl.getAttribute('data-finding-id') || '';
      const finding = getFindingById(editor, findingId);
      if (!finding) return;
      locateFinding(editor, finding, resolved);
      return;
    }

    if (action === 'redact-finding') {
      const findingId = actionEl.getAttribute('data-finding-id') || '';
      void redactSingleFinding(editor, findingId, resolved);
    }
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      hidePanel(editor, true);
      return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    const focusable = Array.from(panel.querySelectorAll<HTMLButtonElement>('[data-role="finding-button"]'));
    if (focusable.length === 0) return;

    const active = document.activeElement as HTMLElement | null;
    const currentIndex = focusable.findIndex((button) => button === active);
    if (currentIndex === -1) return;

    event.preventDefault();
    const offset = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + offset + focusable.length) % focusable.length;
    focusable[nextIndex].focus();
  });

  applyThemeClass(panel, editor);
  document.body.appendChild(panel);
  panelByEditor.set(editor, panel);
  panelVisibleByEditor.set(editor, false);
  refreshPanel(editor);

  return panel;
}

function hidePanel(editor: HTMLElement, focusEditor = false): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  panel.classList.remove('show');
  panelVisibleByEditor.set(editor, false);
  setCommandButtonActiveState(editor, 'togglePIIRedactionPanel', false);

  if (focusEditor) {
    editor.focus({ preventScroll: true });
  }
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
  setCommandButtonActiveState(editor, 'togglePIIRedactionPanel', true);
  applyThemeClass(panel, editor);
  positionPanel(editor, panel);
  refreshPanel(editor);

  const firstButton = panel.querySelector<HTMLButtonElement>('[data-action="run-scan"]');
  firstButton?.focus();
}

function togglePanel(editor: HTMLElement, explicit?: boolean): boolean {
  const visible = isPanelVisible(editor);
  const next = typeof explicit === 'boolean' ? explicit : !visible;
  if (next) showPanel(editor);
  else hidePanel(editor);
  return true;
}

function getEditorTextSnapshot(editor: HTMLElement, options: ResolvedPIIRedactionOptions): string {
  const text = options.normalizeText(editor.innerText || editor.textContent || '');
  const html = editor.innerHTML;
  return `${text.length}:${hashString(text)}:${html.length}:${hashString(html)}:${options.detectorSignature}`;
}

function runDetectorInText(detector: PIIRegexDescriptor, text: string): Array<{ value: string; start: number; end: number }> {
  const results: Array<{ value: string; start: number; end: number }> = [];
  const regex = cloneRegex(detector.pattern);
  let match = regex.exec(text);

  while (match) {
    const value = match[0] || '';
    const start = match.index;
    const end = start + value.length;

    if (value && end > start) {
      if (!detector.validator || detector.validator(value)) {
        results.push({ value, start, end });
      }
    }

    if (regex.lastIndex === match.index) {
      regex.lastIndex += 1;
    }
    match = regex.exec(text);
  }

  return results;
}

function findFindingRange(
  editor: HTMLElement,
  finding: PIIFinding,
  options: ResolvedPIIRedactionOptions,
): Range | null {
  const detector = options.detectors.find((item) => item.type === finding.type && item.enabled);
  if (!detector) return null;

  const target = finding.match.toLowerCase();
  let counter = 0;
  const walker = document.createTreeWalker(editor, SHOW_TEXT_NODE_FILTER, null);
  let node = walker.nextNode() as Text | null;

  while (node) {
    if (!shouldSkipNode(node, options)) {
      const matches = runDetectorInText(detector, node.data);
      for (let index = 0; index < matches.length; index += 1) {
        const item = matches[index];
        if (item.value.toLowerCase() !== target) continue;

        counter += 1;
        if (counter === finding.occurrence) {
          const range = document.createRange();
          range.setStart(node, item.start);
          range.setEnd(node, item.end);
          return range;
        }
      }
    }

    node = walker.nextNode() as Text | null;
  }

  return null;
}

function locateFinding(editor: HTMLElement, finding: PIIFinding, options: ResolvedPIIRedactionOptions): boolean {
  const range = findFindingRange(editor, finding, options);
  if (!range) return false;

  const selection = window.getSelection();
  if (!selection) return false;

  selection.removeAllRanges();
  selection.addRange(range);

  const target = getElementFromNode(range.startContainer);
  target?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  editor.focus({ preventScroll: true });
  return true;
}

async function runPIIScan(editor: HTMLElement, options: ResolvedPIIRedactionOptions, force = false): Promise<PIIFinding[]> {
  ensureEditorState(editor, options);

  const snapshot = getEditorTextSnapshot(editor, options);
  if (!force && snapshotByEditor.get(editor) === snapshot) {
    return findingsByEditor.get(editor) || [];
  }

  const version = (scanVersionByEditor.get(editor) || 0) + 1;
  scanVersionByEditor.set(editor, version);

  const nextFindings: PIIFinding[] = [];
  const occurrenceByKey = new Map<string, number>();

  const walker = document.createTreeWalker(editor, SHOW_TEXT_NODE_FILTER, null);
  let node = walker.nextNode() as Text | null;

  while (node && nextFindings.length < options.maxFindings) {
    const text = node.data || '';
    if (text.trim() && !shouldSkipNode(node, options)) {
      const matches = collectMatchesForText(text, options.detectors, options.maxFindings - nextFindings.length);

      for (let index = 0; index < matches.length; index += 1) {
        if (nextFindings.length >= options.maxFindings) break;
        const match = matches[index];

        const occurrenceKey = `${match.type}:${match.value.toLowerCase()}`;
        const occurrence = (occurrenceByKey.get(occurrenceKey) || 0) + 1;
        occurrenceByKey.set(occurrenceKey, occurrence);

        nextFindings.push({
          id: createFindingId(match.type),
          type: match.type,
          severity: match.severity,
          match: match.value,
          masked: maskMatchPreview(match.value, match.type, options),
          occurrence,
          excerpt: buildExcerpt(text, match.start, match.end),
          suggestion: 'Review and redact this value before external sharing.',
        });
      }
    }

    node = walker.nextNode() as Text | null;
  }

  if (scanVersionByEditor.get(editor) !== version) {
    return findingsByEditor.get(editor) || [];
  }

  const previousRedacted = statsByEditor.get(editor)?.redactedCount || 0;
  const nextStats = computeStats(nextFindings, previousRedacted);

  snapshotByEditor.set(editor, snapshot);
  findingsByEditor.set(editor, nextFindings);
  statsByEditor.set(editor, nextStats);
  refreshPanel(editor);

  editor.dispatchEvent(
    new CustomEvent('editora:pii-scan', {
      bubbles: true,
      detail: {
        findings: nextFindings,
        stats: nextStats,
      },
    }),
  );

  return nextFindings;
}

function redactTextWithDetectors(
  text: string,
  options: ResolvedPIIRedactionOptions,
): { nextValue: string; count: number } {
  let nextValue = text;
  let count = 0;

  const enabledDetectors = options.detectors.filter((detector) => detector.enabled);
  enabledDetectors.forEach((detector) => {
    const regex = cloneRegex(detector.pattern);
    nextValue = nextValue.replace(regex, (match) => {
      if (detector.validator && !detector.validator(match)) {
        return match;
      }
      count += 1;
      return buildRedactionReplacement(match, detector.type, options);
    });
  });

  return { nextValue, count };
}

async function redactSingleFinding(
  editor: HTMLElement,
  findingId: string,
  options: ResolvedPIIRedactionOptions,
): Promise<boolean> {
  if (isEditorReadonly(editor)) {
    const panel = panelByEditor.get(editor);
    if (panel) setPanelLiveMessage(panel, options.labels.readonlyRedactionText);
    return false;
  }

  const finding = getFindingById(editor, findingId);
  if (!finding) return false;

  const range = findFindingRange(editor, finding, options);
  if (!range) return false;

  const beforeHTML = editor.innerHTML;
  const replacement = buildRedactionReplacement(finding.match, finding.type, options);

  if (range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
    const textNode = range.startContainer as Text;
    const value = textNode.data;
    const start = range.startOffset;
    const end = range.endOffset;
    textNode.data = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
  } else {
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
  }

  dispatchEditorInput(editor);
  recordDomHistoryTransaction(editor, beforeHTML);

  const previous = statsByEditor.get(editor)?.redactedCount || 0;
  await runPIIScan(editor, options, true);

  const stats = statsByEditor.get(editor);
  if (stats) {
    stats.redactedCount = previous + 1;
    refreshPanel(editor);
  }

  emitRedactedEvent(editor, 1);
  return true;
}

async function redactAllFindings(editor: HTMLElement, options: ResolvedPIIRedactionOptions): Promise<number> {
  if (isEditorReadonly(editor)) {
    const panel = panelByEditor.get(editor);
    if (panel) setPanelLiveMessage(panel, options.labels.readonlyRedactionText);
    return 0;
  }

  const currentFindings = findingsByEditor.get(editor) || [];
  if (currentFindings.length === 0) {
    await runPIIScan(editor, options, true);
  }

  const beforeHTML = editor.innerHTML;
  let total = 0;

  const walker = document.createTreeWalker(editor, SHOW_TEXT_NODE_FILTER, null);
  let node = walker.nextNode() as Text | null;

  while (node) {
    if (shouldSkipNode(node, options)) {
      node = walker.nextNode() as Text | null;
      continue;
    }

    const value = node.data || '';
    if (!value) {
      node = walker.nextNode() as Text | null;
      continue;
    }

    const result = redactTextWithDetectors(value, options);
    if (result.count > 0 && result.nextValue !== value) {
      node.data = result.nextValue;
      total += result.count;
    }

    node = walker.nextNode() as Text | null;
  }

  if (total === 0) return 0;

  dispatchEditorInput(editor);
  recordDomHistoryTransaction(editor, beforeHTML);

  const previous = statsByEditor.get(editor)?.redactedCount || 0;
  await runPIIScan(editor, options, true);

  const stats = statsByEditor.get(editor);
  if (stats) {
    stats.redactedCount = previous + total;
    refreshPanel(editor);
  }

  emitRedactedEvent(editor, total);
  return total;
}

function scheduleRealtimeScan(editor: HTMLElement): void {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;
  if (!getRealtimeEnabled(editor, options)) return;
  if (isEditorReadonly(editor)) return;

  clearDebounceTimer(editor);
  const timer = window.setTimeout(() => {
    activeDebounceTimers.delete(timer);
    debounceTimerByEditor.delete(editor);
    void runPIIScan(editor, options, false);
  }, options.debounceMs);

  activeDebounceTimers.add(timer);
  debounceTimerByEditor.set(editor, timer);
}

function isTogglePanelShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'i';
}

function isScanShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'u';
}

function isRedactShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'm';
}

function isRealtimeShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'y';
}

function resolveEditorFromKeyboardEvent(event: KeyboardEvent): HTMLElement | null {
  const targetElement = getElementFromNode(event.target as Node | null);

  if (targetElement) {
    const directContent = targetElement.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (directContent) return directContent;

    const host = targetElement.closest(EDITOR_HOST_SELECTOR);
    if (host) {
      const hostContent = resolveContentFromHost(host);
      if (hostContent) return hostContent;
    }

    const panel = targetElement.closest(`.${PANEL_CLASS}`);
    if (panel) {
      const entry = Array.from(panelByEditor.entries()).find(([, candidatePanel]) => candidatePanel === panel);
      if (entry) return entry[0];
    }
  }

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const fromSelection = getElementFromNode(selection.getRangeAt(0).startContainer)?.closest(
      EDITOR_CONTENT_SELECTOR,
    ) as HTMLElement | null;
    if (fromSelection) return fromSelection;
  }

  return null;
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

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="togglePIIRealtime"].active,
    .editora-toolbar-button[data-command="togglePIIRealtime"].active {
      background-color: #ccc;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    .${PANEL_CLASS}.rte-pii-redaction-theme-dark {
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
    .${PANEL_CLASS} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(390px, calc(100vw - 20px));
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

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 20px 46px rgba(2, 6, 23, 0.68);
    }

    .rte-pii-redaction-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-pii-redaction-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-pii-redaction-icon-btn {
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

    .rte-pii-redaction-icon-btn:hover,
    .rte-pii-redaction-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-icon-btn:hover,
    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-pii-redaction-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-pii-redaction-topline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .rte-pii-redaction-summary {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
      flex: 1;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-summary {
      color: #94a3b8;
    }

    .rte-pii-redaction-count {
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

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-count {
      border-color: #334155;
      background: #111827;
      color: #cbd5e1;
    }

    .rte-pii-redaction-controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .rte-pii-redaction-btn {
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

    .rte-pii-redaction-btn:hover,
    .rte-pii-redaction-btn:focus-visible {
      border-color: #94a3b8;
      background: #f8fafc;
      outline: none;
    }

    .rte-pii-redaction-btn:disabled {
      opacity: 0.56;
      cursor: not-allowed;
    }

    .rte-pii-redaction-btn-primary {
      border-color: #0284c7;
      background: #0ea5e9;
      color: #f8fafc;
    }

    .rte-pii-redaction-btn-primary:hover,
    .rte-pii-redaction-btn-primary:focus-visible {
      border-color: #0369a1;
      background: #0284c7;
      color: #ffffff;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-btn:hover,
    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-btn:focus-visible {
      border-color: #475569;
      background: #1e293b;
    }

    .rte-pii-redaction-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: min(55vh, 420px);
      overflow: auto;
    }

    .rte-pii-redaction-item {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
      background: #ffffff;
      display: grid;
      gap: 6px;
    }

    .rte-pii-redaction-item-high {
      border-color: #fca5a5;
      background: #fef2f2;
    }

    .rte-pii-redaction-item-medium {
      border-color: #fcd34d;
      background: #fffbeb;
    }

    .rte-pii-redaction-item-low {
      border-color: #93c5fd;
      background: #eff6ff;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-item {
      border-color: #334155;
      background: #0b1220;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-item-high {
      border-color: #7f1d1d;
      background: #2b0b11;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-item-medium {
      border-color: #78350f;
      background: #2b1907;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-item-low {
      border-color: #1d4ed8;
      background: #0a162f;
    }

    .rte-pii-redaction-item-btn {
      border: none;
      background: transparent;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: left;
      padding: 0;
      color: inherit;
      cursor: pointer;
    }

    .rte-pii-redaction-item-btn:focus-visible {
      outline: 2px solid #0284c7;
      outline-offset: 3px;
      border-radius: 6px;
    }

    .rte-pii-redaction-badge {
      border-radius: 999px;
      border: 1px solid currentColor;
      padding: 1px 8px;
      font-size: 10px;
      font-weight: 700;
      line-height: 1.3;
      text-transform: uppercase;
      opacity: 0.86;
    }

    .rte-pii-redaction-type {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.03em;
    }

    .rte-pii-redaction-line,
    .rte-pii-redaction-help {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #334155;
      word-break: break-word;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-line,
    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-help {
      color: #94a3b8;
    }

    .rte-pii-redaction-item-actions {
      display: flex;
      justify-content: flex-end;
    }

    .rte-pii-redaction-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 10px;
      font-size: 13px;
      color: #475569;
      background: #f8fafc;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-empty {
      border-color: #334155;
      background: #0b1220;
      color: #94a3b8;
    }

    .rte-pii-redaction-shortcut {
      margin: 2px 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .${PANEL_CLASS}.rte-pii-redaction-theme-dark .rte-pii-redaction-shortcut {
      color: #94a3b8;
    }

    .rte-pii-redaction-live {
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

      .rte-pii-redaction-list {
        max-height: 45vh;
      }
    }
  `;

  document.head.appendChild(style);
}

function bindGlobalHandlers(options: ResolvedPIIRedactionOptions): void {
  fallbackOptions = options;

  if (!globalFocusInHandler) {
    globalFocusInHandler = (event: FocusEvent) => {
      pruneDisconnectedEditors();

      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      lastActiveEditor = editor;
      const resolved = optionsByEditor.get(editor) || options;
      ensureEditorState(editor, resolved);
      optionsByEditor.set(editor, resolved);

      setCommandButtonActiveState(editor, 'togglePIIRedactionPanel', isPanelVisible(editor));
      setCommandButtonActiveState(editor, 'togglePIIRealtime', getRealtimeEnabled(editor, resolved));

      const panel = panelByEditor.get(editor);
      if (panel) {
        applyThemeClass(panel, editor);
        positionPanel(editor, panel);
        updateRealtimeButtonText(editor, panel, resolved);
      }
    };

    document.addEventListener('focusin', globalFocusInHandler, true);
  }

  if (!globalInputHandler) {
    globalInputHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      lastActiveEditor = editor;
      scheduleRealtimeScan(editor);
    };

    document.addEventListener('input', globalInputHandler, true);
  }

  if (!globalKeydownHandler) {
    globalKeydownHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest(`.${PANEL_CLASS} input, .${PANEL_CLASS} textarea, .${PANEL_CLASS} select`)) return;

      const editor = resolveEditorFromKeyboardEvent(event);
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || fallbackOptions || options;
      ensureEditorState(editor, resolved);
      optionsByEditor.set(editor, resolved);
      lastActiveEditor = editor;

      if (event.key === 'Escape' && isPanelVisible(editor)) {
        event.preventDefault();
        hidePanel(editor, true);
        return;
      }

      if (isTogglePanelShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        togglePanel(editor);
        return;
      }

      if (isScanShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        void runPIIScan(editor, resolved, true);
        showPanel(editor);
        return;
      }

      if (isRedactShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        if (!isEditorReadonly(editor)) {
          void redactAllFindings(editor, resolved);
          showPanel(editor);
        }
        return;
      }

      if (isRealtimeShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        const next = !getRealtimeEnabled(editor, resolved);
        realtimeEnabledByEditor.set(editor, next);

        const panel = panelByEditor.get(editor);
        if (panel) {
          updateRealtimeButtonText(editor, panel, resolved);
        }

        setCommandButtonActiveState(editor, 'togglePIIRealtime', next);
        if (next) {
          void runPIIScan(editor, resolved, true);
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

  if (!globalMutationObserver && typeof MutationObserver !== 'undefined' && document.body) {
    globalMutationObserver = new MutationObserver((records) => {
      if (!mutationTouchesEditorRemoval(records)) return;
      pruneDisconnectedEditors();
    });

    globalMutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
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

  trackedEditors.forEach((editor) => clearDebounceTimer(editor));
  trackedEditors.clear();

  fallbackOptions = null;
  lastActiveEditor = null;
}

export const PIIRedactionPlugin = (rawOptions: PIIRedactionPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  const instanceEditors = new Set<HTMLElement>();
  ensureStylesInjected();

  return {
    name: 'piiRedaction',

    toolbar: [
      {
        id: 'piiRedactionGroup',
        label: 'PII Redaction',
        type: 'group',
        command: 'piiRedaction',
        items: [
          {
            id: 'piiRedaction',
            label: 'PII Redaction',
            command: 'togglePIIRedactionPanel',
            shortcut: 'Mod-Alt-Shift-i',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3.5 19 6.5v4.8c0 4.4-2.7 8.1-7 9.2-4.3-1.1-7-4.8-7-9.2V6.5l7-3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.8 11.6h6.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="11.6" r="1.2" fill="currentColor"/></svg>',
          },
          {
            id: 'piiScan',
            label: 'Scan PII',
            command: 'runPIIScan',
            shortcut: 'Mod-Alt-Shift-u',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4.5" y="3.5" width="11" height="15" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 8.2h5M7.5 11.2h5M7.5 14.2h3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16.8" cy="16.8" r="2.8" stroke="currentColor" stroke-width="1.6"/><path d="m18.8 18.8 2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
          },
          {
            id: 'piiRedactAll',
            label: 'Redact All PII',
            command: 'redactAllPII',
            shortcut: 'Mod-Alt-Shift-m',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M5 18h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M7 6h10l-1 8H8L7 6Z" stroke="currentColor" stroke-width="1.7"/><path d="m9 9 6 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
          },
          {
            id: 'piiRealtime',
            label: 'Toggle Realtime PII Scan',
            command: 'togglePIIRealtime',
            shortcut: 'Mod-Alt-Shift-y',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3v4M12 17v4M4 12h4M16 12h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/></svg>',
          },
        ],
      },
    ],

    commands: {
      piiRedaction: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        showPanel(editor);
        void runPIIScan(editor, resolved, false);
        return true;
      },

      togglePIIRedactionPanel: (value?: boolean, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        const toggled = togglePanel(editor, typeof value === 'boolean' ? value : undefined);

        if (isPanelVisible(editor)) {
          void runPIIScan(editor, resolved, false);
        }

        return toggled;
      },

      runPIIScan: async (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        await runPIIScan(editor, resolved, true);
        showPanel(editor);
        return true;
      },

      redactAllPII: async (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        const total = await redactAllFindings(editor, resolved);
        if (total > 0) showPanel(editor);
        return total > 0;
      },

      redactPIIFinding: async (
        value?: string,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || typeof value !== 'string' || !value) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        return redactSingleFinding(editor, value, resolved);
      },

      togglePIIRealtime: (value?: boolean, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        const next = typeof value === 'boolean' ? value : !getRealtimeEnabled(editor, resolved);
        realtimeEnabledByEditor.set(editor, next);

        const panel = panelByEditor.get(editor);
        if (panel) {
          updateRealtimeButtonText(editor, panel, resolved);
        }

        setCommandButtonActiveState(editor, 'togglePIIRealtime', next);

        if (next) {
          void runPIIScan(editor, resolved, true);
        }

        return true;
      },

      getPIIRedactionFindings: (
        value?: unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const findings = findingsByEditor.get(editor) || [];
        const stats = statsByEditor.get(editor) || createEmptyStats(0);
        const findingsSnapshot = findings.map((finding) => ({ ...finding }));
        const statsSnapshot: PIIRedactionStats = {
          ...stats,
          byType: { ...stats.byType },
        };

        if (typeof value === 'function') {
          try {
            (value as (findings: PIIFinding[], stats: PIIRedactionStats) => void)(findingsSnapshot, statsSnapshot);
          } catch {
            // Ignore callback errors.
          }
        }

        (editor as any).__piiRedactionFindings = findingsSnapshot;
        editor.dispatchEvent(
          new CustomEvent('editora:pii-findings', {
            bubbles: true,
            detail: { findings: findingsSnapshot, stats: statsSnapshot },
          }),
        );

        return true;
      },

      setPIIRedactionOptions: (
        value?: Partial<PIIRedactionPluginOptions>,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || !value || typeof value !== 'object') return false;

        const current = optionsByEditor.get(editor) || options;
        const merged = normalizeOptions({
          ...toRawOptions(current),
          ...value,
          labels: {
            ...current.labels,
            ...(value.labels || {}),
          },
          detectors: {
            ...(toRawOptions(current).detectors || {}),
            ...(value.detectors || {}),
          },
          normalizeText: value.normalizeText || current.normalizeText,
        });

        optionsByEditor.set(editor, merged);
        if (typeof value.enableRealtime === 'boolean') {
          realtimeEnabledByEditor.set(editor, value.enableRealtime);
        }

        const panel = panelByEditor.get(editor);
        if (panel) {
          applyPanelLabels(panel, merged);
          refreshPanel(editor);
          updateRealtimeButtonText(editor, panel, merged);
        }

        void runPIIScan(editor, merged, true);
        return true;
      },
    },

    keymap: {
      'Mod-Alt-Shift-i': 'togglePIIRedactionPanel',
      'Mod-Alt-Shift-I': 'togglePIIRedactionPanel',
      'Mod-Alt-Shift-u': 'runPIIScan',
      'Mod-Alt-Shift-U': 'runPIIScan',
      'Mod-Alt-Shift-m': 'redactAllPII',
      'Mod-Alt-Shift-M': 'redactAllPII',
      'Mod-Alt-Shift-y': 'togglePIIRealtime',
      'Mod-Alt-Shift-Y': 'togglePIIRealtime',
    },

    init: function init(this: any, context?: { editorElement?: HTMLElement }) {
      pluginInstanceCount += 1;

      const runtimeConfig =
        this && typeof this.__pluginConfig === 'object'
          ? normalizeOptions({ ...toRawOptions(options), ...(this.__pluginConfig as PIIRedactionPluginOptions) })
          : options;

      bindGlobalHandlers(runtimeConfig);

      const editor = resolveEditorFromContext(
        context?.editorElement ? { editorElement: context.editorElement } : undefined,
        false,
      );
      if (!editor) return;

      lastActiveEditor = editor;
      instanceEditors.add(editor);
      ensureEditorState(editor, runtimeConfig);
      optionsByEditor.set(editor, runtimeConfig);
      setCommandButtonActiveState(editor, 'togglePIIRedactionPanel', false);
      setCommandButtonActiveState(editor, 'togglePIIRealtime', runtimeConfig.enableRealtime);

      if (runtimeConfig.enableRealtime) {
        scheduleRealtimeScan(editor);
      }
    },

    destroy: () => {
      instanceEditors.forEach((editor) => cleanupEditorState(editor));
      instanceEditors.clear();

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
