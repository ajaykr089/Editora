import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_HOST_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';
const STYLE_ID = 'rte-doc-schema-styles';
const PANEL_CLASS = 'rte-doc-schema-panel';
const TOOLBAR_GROUP_CLASS = 'document-schema';
const LEGACY_TOOLBAR_GROUP_CLASS = 'doc-schema';
const LEGACY_TOOLBAR_GROUP_CLASS_CAMEL = 'docSchema';
const DARK_THEME_SELECTOR = ':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';

export type DocSchemaIssueType = 'missing-section' | 'duplicate-section' | 'out-of-order' | 'unknown-heading';
export type DocSchemaIssueSeverity = 'error' | 'warning' | 'info';

export interface DocSchemaIssue {
  id: string;
  type: DocSchemaIssueType;
  severity: DocSchemaIssueSeverity;
  message: string;
  sectionId?: string;
  sectionTitle?: string;
  headingText?: string;
  suggestion?: string;
}

export interface DocSchemaSection {
  id?: string;
  title: string;
  aliases?: string[];
  minOccurrences?: number;
  maxOccurrences?: number;
  placeholder?: string;
}

export interface DocSchemaDefinition {
  id?: string;
  label: string;
  description?: string;
  strictOrder?: boolean;
  allowUnknownHeadings?: boolean;
  sections: DocSchemaSection[];
}

export interface DocSchemaLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  schemaLabel?: string;
  schemaDescriptionPrefix?: string;
  validateText?: string;
  insertMissingText?: string;
  realtimeOnText?: string;
  realtimeOffText?: string;
  closeText?: string;
  noIssuesText?: string;
  summaryPrefix?: string;
  issueListLabel?: string;
  shortcutText?: string;
  helperText?: string;
  readonlyMessage?: string;
  defaultPlaceholderText?: string;
  missingSectionMessage?: string;
  duplicateSectionMessage?: string;
  outOfOrderMessage?: string;
  unknownHeadingMessage?: string;
  insertedSummaryPrefix?: string;
}

export interface DocSchemaPluginOptions {
  schemas?: DocSchemaDefinition[];
  defaultSchemaId?: string;
  enableRealtime?: boolean;
  debounceMs?: number;
  maxIssues?: number;
  labels?: DocSchemaLabels;
  normalizeText?: (value: string) => string;
}

export interface DocSchemaRuntimeState {
  activeSchemaId: string | null;
  activeSchemaLabel: string | null;
  realtimeEnabled: boolean;
  issues: DocSchemaIssue[];
  headingCount: number;
  recognizedHeadingCount: number;
  missingCount: number;
  lastRunAt: string | null;
}

interface ResolvedDocSchemaSection {
  id: string;
  title: string;
  minOccurrences: number;
  maxOccurrences: number;
  placeholder: string;
  matchKeys: string[];
}

interface ResolvedDocSchemaDefinition {
  id: string;
  label: string;
  description: string;
  strictOrder: boolean;
  allowUnknownHeadings: boolean;
  sections: ResolvedDocSchemaSection[];
  matchKeyToSection: Map<string, ResolvedDocSchemaSection>;
  orderBySectionId: Map<string, number>;
}

interface ResolvedDocSchemaOptions {
  schemas: ResolvedDocSchemaDefinition[];
  defaultSchemaId: string | null;
  enableRealtime: boolean;
  debounceMs: number;
  maxIssues: number;
  labels: Required<DocSchemaLabels>;
  normalizeText: (value: string) => string;
}

interface DocSchemaEditorState {
  activeSchemaId: string | null;
  realtimeEnabled: boolean;
  issues: DocSchemaIssue[];
  headingCount: number;
  recognizedHeadingCount: number;
  missingCount: number;
  lastRunAt: string | null;
  snapshot: string;
}

interface HeadingEntry {
  text: string;
  key: string;
  index: number;
  level: number;
}

interface HeadingPlacementEntry {
  element: HTMLHeadingElement;
  level: number;
  section: ResolvedDocSchemaSection | null;
  order: number | null;
}

const defaultLabels: Required<DocSchemaLabels> = {
  panelTitle: 'Document Schema',
  panelAriaLabel: 'Document schema panel',
  schemaLabel: 'Schema',
  schemaDescriptionPrefix: 'Description',
  validateText: 'Run Validation',
  insertMissingText: 'Insert Missing Sections',
  realtimeOnText: 'Realtime On',
  realtimeOffText: 'Realtime Off',
  closeText: 'Close',
  noIssuesText: 'No schema violations detected.',
  summaryPrefix: 'Schema',
  issueListLabel: 'Schema issues',
  shortcutText: 'Shortcuts: Ctrl/Cmd+Alt+Shift+G (panel), Ctrl/Cmd+Alt+Shift+J (validate)',
  helperText: 'Choose a schema, validate structure, then insert missing sections safely.',
  readonlyMessage: 'Editor is read-only. Missing sections cannot be inserted.',
  defaultPlaceholderText: 'Add section content.',
  missingSectionMessage: 'Missing required section',
  duplicateSectionMessage: 'Section appears too many times',
  outOfOrderMessage: 'Section appears out of required order',
  unknownHeadingMessage: 'Heading is not part of selected schema',
  insertedSummaryPrefix: 'Inserted missing sections',
};

const optionsByEditor = new WeakMap<HTMLElement, ResolvedDocSchemaOptions>();
const rawOptionsByEditor = new WeakMap<HTMLElement, DocSchemaPluginOptions>();
const stateByEditor = new WeakMap<HTMLElement, DocSchemaEditorState>();
const panelByEditor = new Map<HTMLElement, HTMLElement>();
const panelVisibleByEditor = new WeakMap<HTMLElement, boolean>();
const debounceTimerByEditor = new WeakMap<HTMLElement, number>();
const trackedEditors = new Set<HTMLElement>();

let pluginInstanceCount = 0;
let panelSequence = 0;
let issueSequence = 0;
let fallbackOptions: ResolvedDocSchemaOptions | null = null;
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

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function sanitizeId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeHeadingMatchKey(value: string, normalizeText: (value: string) => string): string {
  const normalized = normalizeText(value).toLowerCase();
  return normalized
    .replace(/^[\s\-\u2022]*(?:[0-9]+(?:\.[0-9]+)*)[\)\.\-:\s]+/, '')
    .replace(/^[\s\-\u2022]*(?:[ivxlcdm]+)[\)\.\-:\s]+/i, '')
    .replace(/[：:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function createDefaultSchemas(): DocSchemaDefinition[] {
  return [
    {
      id: 'contract',
      label: 'Contract',
      description: 'Template for legal/commercial agreements with strict section ordering.',
      strictOrder: true,
      allowUnknownHeadings: false,
      sections: [
        { id: 'summary', title: 'Executive Summary', aliases: ['Overview'] },
        { id: 'scope', title: 'Scope' },
        { id: 'terms', title: 'Terms and Conditions', aliases: ['Terms'] },
        { id: 'responsibilities', title: 'Responsibilities' },
        { id: 'sla', title: 'Service Levels', aliases: ['SLA', 'Service Level Agreement'] },
        { id: 'termination', title: 'Termination' },
      ],
    },
    {
      id: 'sop',
      label: 'SOP',
      description: 'Standard operating procedure with clear implementation and governance sections.',
      strictOrder: true,
      allowUnknownHeadings: true,
      sections: [
        { id: 'purpose', title: 'Purpose' },
        { id: 'scope', title: 'Scope' },
        { id: 'procedure', title: 'Procedure', maxOccurrences: 10 },
        { id: 'roles', title: 'Roles and Responsibilities', aliases: ['Responsibilities'] },
        { id: 'validation', title: 'Validation' },
        { id: 'revision-history', title: 'Revision History', aliases: ['Change History'] },
      ],
    },
    {
      id: 'policy',
      label: 'Policy',
      description: 'Policy document with control ownership, exception handling, and enforcement.',
      strictOrder: true,
      allowUnknownHeadings: true,
      sections: [
        { id: 'statement', title: 'Policy Statement' },
        { id: 'applicability', title: 'Applicability', aliases: ['Scope'] },
        { id: 'controls', title: 'Controls' },
        { id: 'exceptions', title: 'Exceptions' },
        { id: 'enforcement', title: 'Enforcement' },
      ],
    },
  ];
}

function normalizeSection(
  raw: DocSchemaSection,
  index: number,
  normalizeText: (value: string) => string,
): ResolvedDocSchemaSection | null {
  const title = normalizeText(raw.title || '');
  if (!title) return null;

  const id = sanitizeId(normalizeText(raw.id || title)) || `section-${index + 1}`;
  const minOccurrences = clamp(Number(raw.minOccurrences ?? 1), 0, 20);
  const fallbackMax = Math.max(1, minOccurrences);
  const maxOccurrences = clamp(Number(raw.maxOccurrences ?? fallbackMax), minOccurrences, 40);
  const placeholder = normalizeText(raw.placeholder || '');

  const aliases = Array.isArray(raw.aliases)
    ? raw.aliases.map((item) => normalizeText(item)).filter(Boolean)
    : [];

  const matchKeys = [title, ...aliases]
    .map((value) => normalizeHeadingMatchKey(value, normalizeText))
    .filter(Boolean);

  return {
    id,
    title,
    minOccurrences,
    maxOccurrences,
    placeholder,
    matchKeys: Array.from(new Set(matchKeys)),
  };
}

function normalizeSchemas(
  rawSchemas: DocSchemaDefinition[] | undefined,
  normalizeText: (value: string) => string,
): ResolvedDocSchemaDefinition[] {
  const input = Array.isArray(rawSchemas) && rawSchemas.length > 0 ? rawSchemas : createDefaultSchemas();
  const normalized: ResolvedDocSchemaDefinition[] = [];
  const seenSchemaIds = new Set<string>();

  input.forEach((schema, schemaIndex) => {
    const label = normalizeText(schema.label || '');
    if (!label) return;

    const baseSchemaId = sanitizeId(normalizeText(schema.id || label)) || `schema-${schemaIndex + 1}`;
    let schemaId = baseSchemaId;
    let duplicateCounter = 1;
    while (seenSchemaIds.has(schemaId)) {
      schemaId = `${baseSchemaId}-${duplicateCounter++}`;
    }
    seenSchemaIds.add(schemaId);

    const sectionsInput = Array.isArray(schema.sections) ? schema.sections : [];
    const sections: ResolvedDocSchemaSection[] = [];
    const seenSectionIds = new Set<string>();

    sectionsInput.forEach((section, sectionIndex) => {
      const resolved = normalizeSection(section, sectionIndex, normalizeText);
      if (!resolved) return;

      let sectionId = resolved.id;
      let sectionDuplicateCounter = 1;
      while (seenSectionIds.has(sectionId)) {
        sectionId = `${resolved.id}-${sectionDuplicateCounter++}`;
      }
      seenSectionIds.add(sectionId);

      sections.push({
        ...resolved,
        id: sectionId,
      });
    });

    if (sections.length === 0) return;

    const matchKeyToSection = new Map<string, ResolvedDocSchemaSection>();
    const orderBySectionId = new Map<string, number>();

    sections.forEach((section, sectionIndex) => {
      orderBySectionId.set(section.id, sectionIndex);
      section.matchKeys.forEach((matchKey) => {
        if (!matchKeyToSection.has(matchKey)) {
          matchKeyToSection.set(matchKey, section);
        }
      });
    });

    normalized.push({
      id: schemaId,
      label,
      description: normalizeText(schema.description || ''),
      strictOrder: schema.strictOrder !== false,
      allowUnknownHeadings: Boolean(schema.allowUnknownHeadings),
      sections,
      matchKeyToSection,
      orderBySectionId,
    });
  });

  if (normalized.length > 0) return normalized;
  return normalizeSchemas(createDefaultSchemas(), normalizeText);
}

function normalizeOptions(raw: DocSchemaPluginOptions = {}): ResolvedDocSchemaOptions {
  const normalizeText = raw.normalizeText || defaultNormalizeText;
  const schemas = normalizeSchemas(raw.schemas, normalizeText);
  const defaultSchemaCandidate = normalizeText(raw.defaultSchemaId || '');
  const defaultSchemaId = schemas.some((schema) => schema.id === defaultSchemaCandidate)
    ? defaultSchemaCandidate
    : schemas[0]?.id || null;

  return {
    schemas,
    defaultSchemaId,
    enableRealtime: raw.enableRealtime !== false,
    debounceMs: clamp(Number(raw.debounceMs ?? 260), 60, 2000),
    maxIssues: clamp(Number(raw.maxIssues ?? 80), 5, 500),
    labels: {
      ...defaultLabels,
      ...(raw.labels || {}),
    },
    normalizeText,
  };
}

function toRawOptions(options: ResolvedDocSchemaOptions): DocSchemaPluginOptions {
  return {
    schemas: options.schemas.map((schema) => ({
      id: schema.id,
      label: schema.label,
      description: schema.description || undefined,
      strictOrder: schema.strictOrder,
      allowUnknownHeadings: schema.allowUnknownHeadings,
      sections: schema.sections.map((section) => ({
        id: section.id,
        title: section.title,
        minOccurrences: section.minOccurrences,
        maxOccurrences: section.maxOccurrences,
        placeholder: section.placeholder || undefined,
      })),
    })),
    defaultSchemaId: options.defaultSchemaId || undefined,
    enableRealtime: options.enableRealtime,
    debounceMs: options.debounceMs,
    maxIssues: options.maxIssues,
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
  target.classList.remove('rte-doc-schema-theme-dark');
  if (shouldUseDarkTheme(editor)) {
    target.classList.add('rte-doc-schema-theme-dark');
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

function getSchemaById(options: ResolvedDocSchemaOptions, schemaId: string | null): ResolvedDocSchemaDefinition | null {
  if (!schemaId) return null;
  return options.schemas.find((schema) => schema.id === schemaId) || null;
}

function getDefaultSchemaId(options: ResolvedDocSchemaOptions): string | null {
  return options.defaultSchemaId || options.schemas[0]?.id || null;
}

function ensureState(editor: HTMLElement, options: ResolvedDocSchemaOptions): DocSchemaEditorState {
  if (!optionsByEditor.has(editor)) {
    optionsByEditor.set(editor, options);
  }

  let state = stateByEditor.get(editor);
  if (!state) {
    state = {
      activeSchemaId: getDefaultSchemaId(options),
      realtimeEnabled: options.enableRealtime,
      issues: [],
      headingCount: 0,
      recognizedHeadingCount: 0,
      missingCount: 0,
      lastRunAt: null,
      snapshot: '',
    };
    stateByEditor.set(editor, state);
  }

  if (!state.activeSchemaId || !getSchemaById(options, state.activeSchemaId)) {
    state.activeSchemaId = getDefaultSchemaId(options);
  }

  trackedEditors.add(editor);
  return state;
}

function cleanupEditor(editor: HTMLElement): void {
  clearEditorDebounceTimer(editor);

  panelByEditor.get(editor)?.remove();
  panelByEditor.delete(editor);
  panelVisibleByEditor.delete(editor);

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

function isEditorReadonly(editor: HTMLElement): boolean {
  return editor.getAttribute('contenteditable') === 'false' || editor.getAttribute('data-readonly') === 'true';
}

function positionPanel(editor: HTMLElement, panel: HTMLElement): void {
  if (!panel.classList.contains('show')) return;

  const rect = resolveEditorRoot(editor).getBoundingClientRect();
  const panelWidth = Math.min(window.innerWidth - 20, 440);
  const maxLeft = Math.max(10, window.innerWidth - panelWidth - 10);
  const left = Math.min(Math.max(10, rect.right - panelWidth), maxLeft);
  const top = Math.max(10, Math.min(window.innerHeight - 10, rect.top + 12));

  panel.style.width = `${panelWidth}px`;
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.maxHeight = `${Math.max(260, window.innerHeight - 20)}px`;
}

function setPanelLiveMessage(panel: HTMLElement, message: string): void {
  const live = panel.querySelector<HTMLElement>('.rte-doc-schema-live');
  if (live) {
    live.textContent = message;
  }
}

function extractHeadingEntries(editor: HTMLElement, normalizeText: (value: string) => string): HeadingEntry[] {
  const headings = Array.from(editor.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const entries: HeadingEntry[] = [];

  headings.forEach((element, index) => {
    const text = normalizeText(element.textContent || '');
    if (!text) return;
    const level = Number(element.tagName.slice(1)) || 0;
    const key = normalizeHeadingMatchKey(text, normalizeText);
    entries.push({
      text,
      key,
      index,
      level,
    });
  });

  return entries;
}

function collectHeadingPlacementEntries(
  editor: HTMLElement,
  schema: ResolvedDocSchemaDefinition,
  normalizeText: (value: string) => string,
): HeadingPlacementEntry[] {
  const headings = Array.from(editor.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLHeadingElement[];
  const entries: HeadingPlacementEntry[] = [];

  headings.forEach((heading) => {
    const text = normalizeText(heading.textContent || '');
    if (!text) return;

    const key = normalizeHeadingMatchKey(text, normalizeText);
    const section = key ? schema.matchKeyToSection.get(key) || null : null;
    const order = section ? (schema.orderBySectionId.get(section.id) ?? null) : null;
    const level = clamp(Number(heading.tagName.slice(1)) || 0, 1, 6);

    entries.push({
      element: heading,
      level,
      section,
      order,
    });
  });

  return entries;
}

function resolveInsertionHeadingLevel(
  placementEntries: HeadingPlacementEntry[],
  fallbackLevel = 2,
): number {
  const levelSource = placementEntries.filter((entry) => entry.section).map((entry) => entry.level);
  const levels = levelSource.length > 0 ? levelSource : placementEntries.map((entry) => entry.level);
  if (levels.length === 0) return fallbackLevel;

  const stats = new Map<number, { count: number; firstIndex: number }>();
  levels.forEach((level, index) => {
    if (!stats.has(level)) {
      stats.set(level, { count: 0, firstIndex: index });
    }
    const current = stats.get(level)!;
    current.count += 1;
  });

  let bestLevel = fallbackLevel;
  let bestCount = -1;
  let bestFirstIndex = Number.MAX_SAFE_INTEGER;
  stats.forEach((value, level) => {
    if (
      value.count > bestCount ||
      (value.count === bestCount && value.firstIndex < bestFirstIndex) ||
      (value.count === bestCount && value.firstIndex === bestFirstIndex && level < bestLevel)
    ) {
      bestLevel = level;
      bestCount = value.count;
      bestFirstIndex = value.firstIndex;
    }
  });

  return clamp(bestLevel, 1, 6);
}

function resolveSelectionInsertionPoint(editor: HTMLElement): { parent: Node; referenceNode: Node | null } | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const anchorElement = getElementFromNode(range.startContainer)?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
  if (anchorElement !== editor) return null;

  if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
    const parent = range.startContainer as Element;
    const referenceNode = parent.childNodes[range.startOffset] || null;
    return { parent, referenceNode };
  }

  const parent = range.startContainer.parentNode;
  if (!parent) return null;

  return {
    parent,
    referenceNode: range.startContainer.nextSibling || null,
  };
}

function resolveStrictOrderInsertionPoint(
  editor: HTMLElement,
  section: ResolvedDocSchemaSection,
  schema: ResolvedDocSchemaDefinition,
  normalizeText: (value: string) => string,
): { parent: Node; referenceNode: Node | null } {
  const placementEntries = collectHeadingPlacementEntries(editor, schema, normalizeText);
  const targetOrder = schema.orderBySectionId.get(section.id);
  if (typeof targetOrder !== 'number' || placementEntries.length === 0) {
    return { parent: editor, referenceNode: null };
  }

  const nextHigher = placementEntries.find((entry) => typeof entry.order === 'number' && entry.order > targetOrder);
  if (nextHigher && nextHigher.element.parentNode) {
    return {
      parent: nextHigher.element.parentNode,
      referenceNode: nextHigher.element,
    };
  }

  let lastLowerIndex = -1;
  for (let index = 0; index < placementEntries.length; index += 1) {
    const entry = placementEntries[index];
    if (typeof entry.order === 'number' && entry.order < targetOrder) {
      lastLowerIndex = index;
    }
  }

  if (lastLowerIndex >= 0) {
    const nextHeading = placementEntries[lastLowerIndex + 1]?.element || null;
    const parent = (nextHeading?.parentNode || placementEntries[lastLowerIndex].element.parentNode || editor) as Node;
    return {
      parent,
      referenceNode: nextHeading,
    };
  }

  return { parent: editor, referenceNode: null };
}

function createMissingSectionNodes(
  editor: HTMLElement,
  section: ResolvedDocSchemaSection,
  options: ResolvedDocSchemaOptions,
  headingLevel: number,
): [HTMLElement, HTMLElement] {
  const documentRef = editor.ownerDocument || document;
  const headingTag = `h${clamp(headingLevel, 1, 6)}` as keyof HTMLElementTagNameMap;
  const heading = documentRef.createElement(headingTag);
  heading.setAttribute('data-doc-schema-section', section.id);
  heading.textContent = section.title;

  const paragraph = documentRef.createElement('p');
  paragraph.textContent = section.placeholder || options.labels.defaultPlaceholderText;

  return [heading, paragraph];
}

function createIssue(
  type: DocSchemaIssueType,
  severity: DocSchemaIssueSeverity,
  message: string,
  payload: Partial<Omit<DocSchemaIssue, 'id' | 'type' | 'severity' | 'message'>> = {},
): DocSchemaIssue {
  issueSequence += 1;
  return {
    id: `doc-schema-issue-${issueSequence}`,
    type,
    severity,
    message,
    ...payload,
  };
}

function createSchemaIssueMessage(
  template: string,
  sectionTitle: string | null,
  headingText: string | null,
): string {
  return template
    .replace(/\{section\}/g, sectionTitle || '')
    .replace(/\{heading\}/g, headingText || '')
    .trim();
}

function validateAgainstSchema(
  editor: HTMLElement,
  schema: ResolvedDocSchemaDefinition,
  options: ResolvedDocSchemaOptions,
): {
  issues: DocSchemaIssue[];
  headingCount: number;
  recognizedHeadingCount: number;
  missingCount: number;
} {
  const headings = extractHeadingEntries(editor, options.normalizeText);
  const issues: DocSchemaIssue[] = [];
  const sectionCounts = new Map<string, number>();
  const recognizedSequence: Array<{ section: ResolvedDocSchemaSection; heading: HeadingEntry }> = [];

  for (let index = 0; index < headings.length; index += 1) {
    if (issues.length >= options.maxIssues) break;

    const heading = headings[index];
    if (!heading.key) continue;

    const section = schema.matchKeyToSection.get(heading.key);
    if (section) {
      sectionCounts.set(section.id, (sectionCounts.get(section.id) || 0) + 1);
      recognizedSequence.push({ section, heading });
      continue;
    }

    if (!schema.allowUnknownHeadings) {
      issues.push(
        createIssue(
          'unknown-heading',
          'warning',
          createSchemaIssueMessage(options.labels.unknownHeadingMessage, null, heading.text),
          {
            headingText: heading.text,
            suggestion: `Map this heading to a schema alias or remove it from strict structure mode.`,
          },
        ),
      );
    }
  }

  let missingCount = 0;
  for (let index = 0; index < schema.sections.length; index += 1) {
    if (issues.length >= options.maxIssues) break;

    const section = schema.sections[index];
    const count = sectionCounts.get(section.id) || 0;

    if (count < section.minOccurrences) {
      missingCount += 1;
      issues.push(
        createIssue(
          'missing-section',
          'error',
          createSchemaIssueMessage(options.labels.missingSectionMessage, section.title, null),
          {
            sectionId: section.id,
            sectionTitle: section.title,
            suggestion: `Add heading "${section.title}" to satisfy schema requirements.`,
          },
        ),
      );
    }

    if (count > section.maxOccurrences && issues.length < options.maxIssues) {
      issues.push(
        createIssue(
          'duplicate-section',
          'warning',
          createSchemaIssueMessage(options.labels.duplicateSectionMessage, section.title, null),
          {
            sectionId: section.id,
            sectionTitle: section.title,
            suggestion: `Keep at most ${section.maxOccurrences} instance(s) of "${section.title}".`,
          },
        ),
      );
    }
  }

  if (schema.strictOrder && issues.length < options.maxIssues) {
    let highestOrderSeen = -1;
    for (let index = 0; index < recognizedSequence.length; index += 1) {
      if (issues.length >= options.maxIssues) break;

      const entry = recognizedSequence[index];
      const currentOrder = schema.orderBySectionId.get(entry.section.id) ?? index;
      if (currentOrder < highestOrderSeen) {
        issues.push(
          createIssue(
            'out-of-order',
            'warning',
            createSchemaIssueMessage(options.labels.outOfOrderMessage, entry.section.title, entry.heading.text),
            {
              sectionId: entry.section.id,
              sectionTitle: entry.section.title,
              headingText: entry.heading.text,
              suggestion: `Move "${entry.section.title}" after earlier required sections.`,
            },
          ),
        );
      } else {
        highestOrderSeen = currentOrder;
      }
    }
  }

  return {
    issues,
    headingCount: headings.length,
    recognizedHeadingCount: recognizedSequence.length,
    missingCount,
  };
}

function getRuntimeStateSnapshot(editor: HTMLElement): DocSchemaRuntimeState {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  const state = stateByEditor.get(editor);
  const activeSchema = options ? getSchemaById(options, state?.activeSchemaId || null) : null;

  return {
    activeSchemaId: state?.activeSchemaId || null,
    activeSchemaLabel: activeSchema?.label || null,
    realtimeEnabled: state?.realtimeEnabled === true,
    issues: state?.issues ? state.issues.map((issue) => ({ ...issue })) : [],
    headingCount: state?.headingCount || 0,
    recognizedHeadingCount: state?.recognizedHeadingCount || 0,
    missingCount: state?.missingCount || 0,
    lastRunAt: state?.lastRunAt || null,
  };
}

function updateToolbarState(editor: HTMLElement): void {
  const state = stateByEditor.get(editor);
  setCommandButtonActiveState(editor, 'toggleDocSchemaPanel', isPanelVisible(editor));
  setCommandButtonActiveState(editor, 'toggleDocSchemaRealtime', state?.realtimeEnabled === true);
}

function refreshPanel(editor: HTMLElement): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;

  const state = ensureState(editor, options);
  const schema = getSchemaById(options, state.activeSchemaId);

  const schemaLabel = panel.querySelector<HTMLLabelElement>('.rte-doc-schema-label');
  if (schemaLabel) {
    schemaLabel.textContent = options.labels.schemaLabel;
  }

  const schemaSelect = panel.querySelector<HTMLSelectElement>('[data-field="schema"]');
  if (schemaSelect) {
    schemaSelect.innerHTML = options.schemas
      .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`)
      .join('');
    schemaSelect.value = state.activeSchemaId || '';
  }

  const schemaDescription = panel.querySelector<HTMLElement>('.rte-doc-schema-description');
  if (schemaDescription) {
    const description = schema?.description || '';
    schemaDescription.textContent = description
      ? `${options.labels.schemaDescriptionPrefix}: ${description}`
      : '';
    schemaDescription.hidden = !description;
  }

  const summary = panel.querySelector<HTMLElement>('.rte-doc-schema-summary');
  if (summary) {
    const schemaText = schema?.label || 'N/A';
    const issueCount = state.issues.length;
    summary.textContent = `${options.labels.summaryPrefix}: ${schemaText} • ${issueCount} issue${
      issueCount === 1 ? '' : 's'
    }`;
  }

  const helper = panel.querySelector<HTMLElement>('.rte-doc-schema-helper');
  if (helper) {
    helper.textContent = options.labels.helperText;
  }

  const shortcut = panel.querySelector<HTMLElement>('.rte-doc-schema-shortcut');
  if (shortcut) {
    shortcut.textContent = options.labels.shortcutText;
  }

  const runButton = panel.querySelector<HTMLButtonElement>('[data-action="run-validation"]');
  if (runButton) {
    runButton.textContent = options.labels.validateText;
  }

  const insertButton = panel.querySelector<HTMLButtonElement>('[data-action="insert-missing"]');
  if (insertButton) {
    insertButton.textContent = options.labels.insertMissingText;
    const hasMissing = state.issues.some((issue) => issue.type === 'missing-section');
    insertButton.disabled = !hasMissing || isEditorReadonly(editor);
  }

  const realtimeButton = panel.querySelector<HTMLButtonElement>('[data-action="toggle-realtime"]');
  if (realtimeButton) {
    realtimeButton.textContent = state.realtimeEnabled ? options.labels.realtimeOnText : options.labels.realtimeOffText;
    realtimeButton.setAttribute('aria-pressed', state.realtimeEnabled ? 'true' : 'false');
  }

  const closeButton = panel.querySelector<HTMLButtonElement>('[data-action="close"]');
  if (closeButton) {
    closeButton.setAttribute('aria-label', options.labels.closeText);
  }

  const issueList = panel.querySelector<HTMLElement>('.rte-doc-schema-issues');
  const noIssues = panel.querySelector<HTMLElement>('.rte-doc-schema-empty');
  if (issueList) {
    issueList.setAttribute('aria-label', options.labels.issueListLabel);
    if (state.issues.length === 0) {
      issueList.innerHTML = '';
      if (noIssues) {
        noIssues.hidden = false;
        noIssues.textContent = options.labels.noIssuesText;
      }
    } else {
      if (noIssues) {
        noIssues.hidden = true;
      }

      issueList.innerHTML = state.issues
        .map((issue) => {
          const severityClass =
            issue.severity === 'error'
              ? 'error'
              : issue.severity === 'warning'
                ? 'warning'
                : 'info';
          const sectionText = issue.sectionTitle || issue.headingText || '';
          return `
            <li class="rte-doc-schema-issue ${severityClass}" role="listitem">
              <p class="rte-doc-schema-issue-message">${escapeHtml(issue.message)}${
                sectionText ? `: <strong>${escapeHtml(sectionText)}</strong>` : ''
              }</p>
              ${issue.suggestion ? `<p class="rte-doc-schema-issue-suggestion">${escapeHtml(issue.suggestion)}</p>` : ''}
            </li>
          `;
        })
        .join('');
    }
  }

  panel.setAttribute('aria-label', options.labels.panelAriaLabel);
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

  panelByEditor.forEach((_currentPanel, currentEditor) => {
    if (currentEditor !== editor) {
      hidePanel(currentEditor, false);
    }
  });

  panel.classList.add('show');
  panelVisibleByEditor.set(editor, true);

  refreshPanel(editor);
  positionPanel(editor, panel);
  updateToolbarState(editor);

  const schemaSelect = panel.querySelector<HTMLSelectElement>('[data-field="schema"]');
  schemaSelect?.focus();

  void runValidation(editor, 'panel-open', false);
}

function togglePanel(editor: HTMLElement, explicit?: boolean): boolean {
  const visible = isPanelVisible(editor);
  const nextVisible = typeof explicit === 'boolean' ? explicit : !visible;

  if (nextVisible) {
    showPanel(editor);
  } else {
    hidePanel(editor, false);
  }

  return true;
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

function runValidation(editor: HTMLElement, reason: string, force: boolean): DocSchemaIssue[] {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return [];

  const state = ensureState(editor, options);
  const panel = panelByEditor.get(editor);
  const snapshot = editor.innerHTML;

  if (!force && state.snapshot === snapshot) {
    return state.issues;
  }

  const schema = getSchemaById(options, state.activeSchemaId);
  if (!schema) {
    state.issues = [
      createIssue('missing-section', 'error', 'No active schema is configured for this editor.', {
        suggestion: 'Set `defaultSchemaId` or update schema options.',
      }),
    ];
    state.headingCount = 0;
    state.recognizedHeadingCount = 0;
    state.missingCount = 1;
    state.lastRunAt = new Date().toISOString();
    state.snapshot = snapshot;
    refreshPanel(editor);
    updateToolbarState(editor);
    return state.issues;
  }

  const result = validateAgainstSchema(editor, schema, options);
  state.issues = result.issues;
  state.headingCount = result.headingCount;
  state.recognizedHeadingCount = result.recognizedHeadingCount;
  state.missingCount = result.missingCount;
  state.lastRunAt = new Date().toISOString();
  state.snapshot = snapshot;

  refreshPanel(editor);
  updateToolbarState(editor);

  editor.dispatchEvent(
    new CustomEvent('editora:doc-schema-validation', {
      bubbles: true,
      detail: {
        reason,
        state: getRuntimeStateSnapshot(editor),
      },
    }),
  );

  if (panel) {
    setPanelLiveMessage(
      panel,
      result.issues.length === 0
        ? options.labels.noIssuesText
        : `${result.issues.length} issue${result.issues.length === 1 ? '' : 's'} detected.`,
    );
  }

  return state.issues;
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

function insertMissingSections(editor: HTMLElement): boolean {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return false;

  const state = ensureState(editor, options);
  const panel = panelByEditor.get(editor);

  if (isEditorReadonly(editor)) {
    if (panel) {
      setPanelLiveMessage(panel, options.labels.readonlyMessage);
    }
    return false;
  }

  const schema = getSchemaById(options, state.activeSchemaId);
  if (!schema) return false;

  runValidation(editor, 'insert-missing-pre', true);

  const missingIds = Array.from(
    new Set(
      state.issues
        .filter((issue) => issue.type === 'missing-section' && issue.sectionId)
        .map((issue) => issue.sectionId as string),
    ),
  );

  const missingSections = schema.sections.filter((section) => missingIds.includes(section.id));
  if (missingSections.length === 0) {
    if (panel) {
      setPanelLiveMessage(panel, options.labels.noIssuesText);
    }
    return false;
  }

  const beforeHTML = editor.innerHTML;
  const placementEntries = collectHeadingPlacementEntries(editor, schema, options.normalizeText);
  const headingLevel = resolveInsertionHeadingLevel(placementEntries, 2);
  const selectionPoint = resolveSelectionInsertionPoint(editor);

  missingSections.forEach((section) => {
    const insertionPoint = schema.strictOrder
      ? resolveStrictOrderInsertionPoint(editor, section, schema, options.normalizeText)
      : selectionPoint || { parent: editor, referenceNode: null };
    const [heading, paragraph] = createMissingSectionNodes(editor, section, options, headingLevel);

    insertionPoint.parent.insertBefore(heading, insertionPoint.referenceNode);
    insertionPoint.parent.insertBefore(paragraph, insertionPoint.referenceNode);
  });

  recordDomHistoryTransaction(editor, beforeHTML);
  dispatchEditorInput(editor);

  runValidation(editor, 'insert-missing-post', true);
  const insertedNames = missingSections.map((section) => section.title).join(', ');

  editor.dispatchEvent(
    new CustomEvent('editora:doc-schema-insert-missing', {
      bubbles: true,
      detail: {
        schemaId: schema.id,
        sectionIds: missingSections.map((section) => section.id),
      },
    }),
  );

  if (panel) {
    setPanelLiveMessage(panel, `${options.labels.insertedSummaryPrefix}: ${insertedNames}`);
  }

  return true;
}

function ensurePanel(editor: HTMLElement): HTMLElement {
  const existing = panelByEditor.get(editor);
  if (existing) return existing;

  const options = optionsByEditor.get(editor) || fallbackOptions || normalizeOptions();
  ensureState(editor, options);

  const panelId = `rte-doc-schema-panel-${panelSequence++}`;
  const schemaSelectId = `${panelId}-schema`;

  const panel = document.createElement('section');
  panel.className = PANEL_CLASS;
  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);

  panel.innerHTML = `
    <header class="rte-doc-schema-header">
      <h2 class="rte-doc-schema-title">${escapeHtml(options.labels.panelTitle)}</h2>
      <button type="button" class="rte-doc-schema-icon-btn" data-action="close" aria-label="${escapeHtml(
        options.labels.closeText,
      )}"></button>
    </header>
    <div class="rte-doc-schema-body">
      <label class="rte-doc-schema-label" for="${escapeHtml(schemaSelectId)}"></label>
      <select id="${escapeHtml(schemaSelectId)}" class="rte-doc-schema-select" data-field="schema"></select>
      <p class="rte-doc-schema-description" hidden></p>
      <p class="rte-doc-schema-summary"></p>
      <div class="rte-doc-schema-actions">
        <button type="button" class="rte-doc-schema-btn rte-doc-schema-btn-primary" data-action="run-validation"></button>
        <button type="button" class="rte-doc-schema-btn" data-action="insert-missing"></button>
        <button type="button" class="rte-doc-schema-btn" data-action="toggle-realtime" aria-pressed="false"></button>
      </div>
      <p class="rte-doc-schema-helper"></p>
      <p class="rte-doc-schema-shortcut"></p>
      <div class="rte-doc-schema-issues-wrap">
        <ul class="rte-doc-schema-issues" role="list" aria-label="${escapeHtml(options.labels.issueListLabel)}"></ul>
        <p class="rte-doc-schema-empty" hidden></p>
      </div>
    </div>
    <div class="rte-doc-schema-live" aria-live="polite" aria-atomic="true"></div>
  `;

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const actionEl = target?.closest<HTMLElement>('[data-action]');
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action');
    if (action === 'close') {
      hidePanel(editor, true);
      return;
    }

    if (action === 'run-validation') {
      runValidation(editor, 'panel-button', true);
      return;
    }

    if (action === 'insert-missing') {
      insertMissingSections(editor);
      return;
    }

    if (action === 'toggle-realtime') {
      toggleRealtime(editor);
    }
  });

  panel.addEventListener('change', (event) => {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLSelectElement) || target.getAttribute('data-field') !== 'schema') return;

    const optionsEntry = optionsByEditor.get(editor) || fallbackOptions;
    if (!optionsEntry) return;

    const state = ensureState(editor, optionsEntry);
    const nextSchemaId = target.value;
    if (!getSchemaById(optionsEntry, nextSchemaId)) return;

    state.activeSchemaId = nextSchemaId;
    state.snapshot = '';
    runValidation(editor, 'schema-change', true);
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

function isTogglePanelShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'g';
}

function isRunValidationShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'j';
}

function bindGlobalHandlers(options: ResolvedDocSchemaOptions): void {
  fallbackOptions = options;

  if (!globalFocusInHandler) {
    globalFocusInHandler = (event: FocusEvent) => {
      pruneDisconnectedEditors();

      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || options;
      ensureState(editor, resolved);
      optionsByEditor.set(editor, resolved);
      lastActiveEditor = editor;

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
      if (!state.realtimeEnabled) return;

      scheduleRealtimeValidation(editor);
    };

    document.addEventListener('input', globalInputHandler, true);
  }

  if (!globalKeydownHandler) {
    globalKeydownHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest(`.${PANEL_CLASS}`) && event.key !== 'Escape') return;

      const editor = resolveEditorFromKeyboardEvent(event);
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || fallbackOptions || options;
      ensureState(editor, resolved);
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

      if (isRunValidationShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        runValidation(editor, 'shortcut', true);
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
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS_CAMEL},
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS_CAMEL} {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS_CAMEL} .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS_CAMEL} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS_CAMEL} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS_CAMEL} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS_CAMEL},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS_CAMEL} {
      border-color: rgba(100, 116, 139, 0.45);
    }
    .rte-toolbar-button[data-command="toggleDocSchemaRealtime"].active,
    .editora-toolbar-button[data-command="toggleDocSchemaRealtime"].active {
      background-color: rgba(22, 163, 74, 0.12);
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
      width: min(440px, calc(100vw - 20px));
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

    .${PANEL_CLASS}.rte-doc-schema-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 24px 52px rgba(2, 6, 23, 0.68);
    }

    .rte-doc-schema-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-doc-schema-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-doc-schema-icon-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 30px;
      width: 30px;
      background: #ffffff;
      color: inherit;
      font-size: 0;
      cursor: pointer;
      position: relative;
    }

    .rte-doc-schema-icon-btn::before {
      content: '×';
      font-size: 18px;
      line-height: 1;
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
    }

    .rte-doc-schema-icon-btn:hover,
    .rte-doc-schema-icon-btn:focus-visible {
      border-color: #94a3b8;
      background: #f8fafc;
      outline: none;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-icon-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-icon-btn:hover,
    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-icon-btn:focus-visible {
      border-color: #475569;
      background: #1e293b;
    }

    .rte-doc-schema-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      overflow: auto;
    }

    .rte-doc-schema-label {
      font-size: 12px;
      line-height: 1.3;
      font-weight: 700;
      color: #334155;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-label {
      color: #cbd5e1;
    }

    .rte-doc-schema-select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 10px;
      font-size: 13px;
      background: #ffffff;
      color: inherit;
    }

    .rte-doc-schema-select:focus-visible {
      border-color: #0f766e;
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
      outline: none;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-select {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-doc-schema-description,
    .rte-doc-schema-summary,
    .rte-doc-schema-helper,
    .rte-doc-schema-shortcut {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-description,
    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-summary,
    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-helper,
    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-shortcut {
      color: #94a3b8;
    }

    .rte-doc-schema-actions {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .rte-doc-schema-btn {
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

    .rte-doc-schema-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .rte-doc-schema-btn-primary {
      border-color: #0f766e;
      background: #0f766e;
      color: #f8fafc;
    }

    .rte-doc-schema-btn:hover,
    .rte-doc-schema-btn:focus-visible {
      border-color: #94a3b8;
      outline: none;
    }

    .rte-doc-schema-btn-primary:hover,
    .rte-doc-schema-btn-primary:focus-visible {
      border-color: #115e59;
      background: #115e59;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-btn-primary {
      border-color: #14b8a6;
      background: #0f766e;
      color: #f0fdfa;
    }

    .rte-doc-schema-issues-wrap {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 6px;
      background: #f8fafc;
      max-height: min(40vh, 320px);
      overflow: auto;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-issues-wrap {
      border-color: #334155;
      background: #0b1220;
    }

    .rte-doc-schema-issues {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 6px;
    }

    .rte-doc-schema-issue {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      padding: 8px;
      display: grid;
      gap: 4px;
    }

    .rte-doc-schema-issue.error {
      border-color: #ef4444;
      background: #fef2f2;
    }

    .rte-doc-schema-issue.warning {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .rte-doc-schema-issue.info {
      border-color: #0ea5e9;
      background: #f0f9ff;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-issue {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-issue.error {
      border-color: rgba(239, 68, 68, 0.7);
      background: rgba(127, 29, 29, 0.28);
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-issue.warning {
      border-color: rgba(245, 158, 11, 0.72);
      background: rgba(120, 53, 15, 0.28);
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-issue.info {
      border-color: rgba(14, 165, 233, 0.7);
      background: rgba(7, 89, 133, 0.28);
    }

    .rte-doc-schema-issue-message,
    .rte-doc-schema-issue-suggestion {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #1f2937;
    }

    .rte-doc-schema-issue-suggestion {
      color: #475569;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-issue-message {
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-doc-schema-theme-dark .rte-doc-schema-issue-suggestion {
      color: #cbd5e1;
    }

    .rte-doc-schema-empty {
      margin: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .rte-doc-schema-live {
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

      .rte-doc-schema-actions {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);
}

export const DocSchemaPlugin = (rawOptions: DocSchemaPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  const instanceEditors = new Set<HTMLElement>();

  ensureStylesInjected();

  return {
    name: 'docSchema',

    toolbar: [
      {
        id: 'docSchemaGroup',
        label: 'Document Schema',
        type: 'group',
        command: 'docSchema',
        items: [
          {
            id: 'toggleDocSchemaPanel',
            label: 'Document Schema',
            command: 'toggleDocSchemaPanel',
            shortcut: 'Mod-Alt-Shift-g',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
          },
          {
            id: 'runDocSchemaValidation',
            label: 'Run Schema Validation',
            command: 'runDocSchemaValidation',
            shortcut: 'Mod-Alt-Shift-j',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3.5 4.5 6.5v5c0 4.8 3.1 8.9 7.5 10 4.4-1.1 7.5-5.2 7.5-10v-5L12 3.5Z" stroke="currentColor" stroke-width="1.6"/><path d="m9 12.5 2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          },
          {
            id: 'toggleDocSchemaRealtime',
            label: 'Toggle Schema Realtime',
            command: 'toggleDocSchemaRealtime',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 1 7.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.5 19.5H5.5v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>',
          },
        ],
      },
    ],

    commands: {
      docSchema: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        showPanel(editor);
        return true;
      },

      openDocSchemaPanel: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        showPanel(editor);
        return true;
      },

      toggleDocSchemaPanel: (value?: boolean, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        return togglePanel(editor, typeof value === 'boolean' ? value : undefined);
      },

      runDocSchemaValidation: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        runValidation(editor, 'command', true);
        return true;
      },

      insertMissingDocSchemaSections: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        return insertMissingSections(editor);
      },

      toggleDocSchemaRealtime: (value?: boolean, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        return toggleRealtime(editor, typeof value === 'boolean' ? value : undefined);
      },

      setDocSchemaMode: (
        value?: string | { schemaId?: string; id?: string },
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        const state = ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        const nextSchemaId = typeof value === 'string' ? value : value?.schemaId || value?.id;
        if (!nextSchemaId || !getSchemaById(resolved, nextSchemaId)) return false;

        state.activeSchemaId = nextSchemaId;
        state.snapshot = '';
        runValidation(editor, 'set-mode', true);
        return true;
      },

      setDocSchemaOptions: (
        value?: Partial<DocSchemaPluginOptions>,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor || !value || typeof value !== 'object') return false;

        const current = optionsByEditor.get(editor) || options;
        const currentRaw = rawOptionsByEditor.get(editor) || toRawOptions(current);

        const mergedRaw: DocSchemaPluginOptions = {
          ...currentRaw,
          ...value,
          labels: {
            ...(currentRaw.labels || {}),
            ...(value.labels || {}),
          },
          schemas: Array.isArray(value.schemas) ? value.schemas : currentRaw.schemas,
          normalizeText: value.normalizeText || current.normalizeText,
        };

        const merged = normalizeOptions(mergedRaw);
        optionsByEditor.set(editor, merged);
        rawOptionsByEditor.set(editor, mergedRaw);

        const state = ensureState(editor, merged);
        if (typeof value.enableRealtime === 'boolean') {
          state.realtimeEnabled = value.enableRealtime;
        }

        if (!state.activeSchemaId || !getSchemaById(merged, state.activeSchemaId)) {
          state.activeSchemaId = getDefaultSchemaId(merged);
        }
        if (typeof value.defaultSchemaId === 'string' && getSchemaById(merged, value.defaultSchemaId)) {
          state.activeSchemaId = value.defaultSchemaId;
        }

        state.snapshot = '';
        runValidation(editor, 'set-options', true);
        refreshPanel(editor);
        updateToolbarState(editor);
        return true;
      },

      getDocSchemaState: (
        value?: ((state: DocSchemaRuntimeState) => void) | unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);

        const snapshot = getRuntimeStateSnapshot(editor);
        if (typeof value === 'function') {
          try {
            (value as (state: DocSchemaRuntimeState) => void)(snapshot);
          } catch {
            // Ignore callback errors.
          }
        }

        (editor as any).__docSchemaState = snapshot;
        editor.dispatchEvent(
          new CustomEvent('editora:doc-schema-state', {
            bubbles: true,
            detail: snapshot,
          }),
        );
        return true;
      },
    },

    keymap: {
      'Mod-Alt-Shift-g': 'toggleDocSchemaPanel',
      'Mod-Alt-Shift-G': 'toggleDocSchemaPanel',
      'Mod-Alt-Shift-j': 'runDocSchemaValidation',
      'Mod-Alt-Shift-J': 'runDocSchemaValidation',
    },

    init: function init(this: any, context?: { editorElement?: HTMLElement }) {
      pluginInstanceCount += 1;

      const runtimeRaw =
        this && typeof this.__pluginConfig === 'object'
          ? ({ ...rawOptions, ...(this.__pluginConfig as DocSchemaPluginOptions) } as DocSchemaPluginOptions)
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

      ensureState(editor, runtimeConfig);
      optionsByEditor.set(editor, runtimeConfig);
      rawOptionsByEditor.set(editor, runtimeRaw);
      updateToolbarState(editor);
      runValidation(editor, 'init', true);
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
