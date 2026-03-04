import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const STYLE_ID = 'rte-citations-styles';
const PANEL_CLASS = 'rte-citations-panel';
const CITATION_REF_SELECTOR = '.rte-citation-ref[data-citation-id]';
const BIBLIOGRAPHY_SELECTOR = '.rte-citation-bibliography[data-type="citation-bibliography"]';
const FOOTNOTES_SELECTOR = '.rte-citation-footnotes[data-type="citation-footnotes"]';
const DARK_THEME_SELECTOR = ':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';

export type CitationStyle = 'apa' | 'mla' | 'chicago';

export interface CitationRecord {
  id: string;
  author: string;
  year?: string;
  title: string;
  source?: string;
  url?: string;
  note?: string;
}

export interface CitationInput {
  id?: string;
  author: string;
  year?: string;
  title: string;
  source?: string;
  url?: string;
  note?: string;
}

export interface CitationsLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  styleLabel?: string;
  authorLabel?: string;
  yearLabel?: string;
  titleLabel?: string;
  sourceLabel?: string;
  urlLabel?: string;
  noteLabel?: string;
  insertText?: string;
  refreshText?: string;
  closeText?: string;
  bibliographyTitle?: string;
  footnotesTitle?: string;
  noCitationsText?: string;
  styleButtonPrefix?: string;
  recentHeading?: string;
  deleteRecentText?: string;
  summaryPrefix?: string;
  invalidMessage?: string;
}

export interface CitationsPluginOptions {
  defaultStyle?: CitationStyle;
  enableFootnoteSync?: boolean;
  debounceMs?: number;
  maxRecentCitations?: number;
  labels?: CitationsLabels;
  normalizeText?: (value: string) => string;
  generateCitationId?: (context: { editor: HTMLElement; index: number }) => string;
}

interface ResolvedCitationsOptions {
  defaultStyle: CitationStyle;
  enableFootnoteSync: boolean;
  debounceMs: number;
  maxRecentCitations: number;
  labels: Required<CitationsLabels>;
  normalizeText: (value: string) => string;
  generateCitationId?: (context: { editor: HTMLElement; index: number }) => string;
}

const styleOrder: CitationStyle[] = ['apa', 'mla', 'chicago'];

const defaultLabels: Required<CitationsLabels> = {
  panelTitle: 'Citations',
  panelAriaLabel: 'Citations panel',
  styleLabel: 'Citation style',
  authorLabel: 'Author',
  yearLabel: 'Year',
  titleLabel: 'Title',
  sourceLabel: 'Source',
  urlLabel: 'URL',
  noteLabel: 'Footnote note',
  insertText: 'Insert Citation',
  refreshText: 'Refresh Bibliography',
  closeText: 'Close',
  bibliographyTitle: 'References',
  footnotesTitle: 'Citation Notes',
  noCitationsText: 'No citations inserted yet.',
  styleButtonPrefix: 'Style',
  recentHeading: 'Recent citations',
  deleteRecentText: 'Delete',
  summaryPrefix: 'Citations',
  invalidMessage: 'Author and title are required.',
};

const optionsByEditor = new WeakMap<HTMLElement, ResolvedCitationsOptions>();
const styleByEditor = new WeakMap<HTMLElement, CitationStyle>();
const snapshotByEditor = new WeakMap<HTMLElement, string>();
const recentCitationsByEditor = new WeakMap<HTMLElement, CitationRecord[]>();
const panelByEditor = new Map<HTMLElement, HTMLElement>();
const panelVisibleByEditor = new WeakMap<HTMLElement, boolean>();
const debounceTimerByEditor = new WeakMap<HTMLElement, number>();
const activeDebounceTimers = new Set<number>();

let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let globalInputHandler: ((event: Event) => void) | null = null;
let globalKeydownHandler: ((event: KeyboardEvent) => void) | null = null;
let globalViewportHandler: (() => void) | null = null;

let pluginInstanceCount = 0;
let panelSequence = 0;
let citationSequence = 0;
let fallbackOptions: ResolvedCitationsOptions | null = null;
let lastActiveEditor: HTMLElement | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeTextDefault(value: string): string {
  return value.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeYear(value: string, normalizeText: (value: string) => string): string {
  const normalized = normalizeText(value);
  if (!normalized) return '';
  const matched = normalized.match(/\d{4}/);
  return matched ? matched[0] : normalized;
}

function normalizeUrl(value: string, normalizeText: (value: string) => string): string {
  const normalized = normalizeText(value);
  if (!normalized) return '';
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `https://${normalized}`;
}

function sanitizeCitationId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeCitationRecord(input: CitationInput | CitationRecord, options: ResolvedCitationsOptions): CitationRecord {
  return {
    id: sanitizeCitationId(options.normalizeText(input.id || '')),
    author: options.normalizeText(input.author || ''),
    year: normalizeYear(input.year || '', options.normalizeText) || undefined,
    title: options.normalizeText(input.title || ''),
    source: options.normalizeText(input.source || '') || undefined,
    url: normalizeUrl(input.url || '', options.normalizeText) || undefined,
    note: options.normalizeText(input.note || '') || undefined,
  };
}

function normalizeOptions(raw: CitationsPluginOptions = {}): ResolvedCitationsOptions {
  const style = raw.defaultStyle && styleOrder.includes(raw.defaultStyle) ? raw.defaultStyle : 'apa';
  const labels = {
    ...defaultLabels,
    ...(raw.labels || {}),
  };

  return {
    defaultStyle: style,
    enableFootnoteSync: raw.enableFootnoteSync !== false,
    debounceMs: Math.max(80, Number(raw.debounceMs ?? 220)),
    maxRecentCitations: Math.max(3, Math.min(30, Number(raw.maxRecentCitations ?? 8))),
    labels,
    normalizeText: raw.normalizeText || normalizeTextDefault,
    generateCitationId: typeof raw.generateCitationId === 'function' ? raw.generateCitationId : undefined,
  };
}

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const root = editor.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor');
  return (root as HTMLElement) || editor;
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
  target.classList.remove('rte-citations-theme-dark');
  if (shouldUseDarkTheme(editor)) {
    target.classList.add('rte-citations-theme-dark');
  }
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
  if (lastActiveEditor && !lastActiveEditor.isConnected) lastActiveEditor = null;
  if (!allowFirstMatch) return null;

  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function isEditorReadonly(editor: HTMLElement): boolean {
  return editor.getAttribute('contenteditable') === 'false' || editor.getAttribute('data-readonly') === 'true';
}

function isInManagedSection(node: Node | null): boolean {
  const element = getElementFromNode(node);
  if (!element) return false;
  return Boolean(element.closest(BIBLIOGRAPHY_SELECTOR) || element.closest(FOOTNOTES_SELECTOR));
}

function createCitationId(editor: HTMLElement, options: ResolvedCitationsOptions): string {
  citationSequence += 1;
  if (options.generateCitationId) {
    const generated = options.generateCitationId({ editor, index: citationSequence });
    const normalized = sanitizeCitationId(options.normalizeText(generated || ''));
    if (normalized) return normalized;
  }

  return `cite-${Date.now().toString(36)}-${citationSequence.toString(36)}`;
}

function coalesceText(parts: Array<string | undefined>): string {
  return parts
    .map((part) => (part || '').trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

function formatInlineCitation(record: CitationRecord, style: CitationStyle): string {
  const author = record.author || 'Unknown';
  const year = record.year || 'n.d.';

  if (style === 'mla') return `(${author} ${year})`;
  if (style === 'chicago') return `(${author} ${year})`;
  return `(${author}, ${year})`;
}

function formatBibliographyEntry(record: CitationRecord, style: CitationStyle): string {
  const author = record.author || 'Unknown';
  const year = record.year || 'n.d.';
  const title = record.title || 'Untitled';
  const source = record.source || '';
  const url = record.url || '';

  if (style === 'mla') {
    return coalesceText([
      `${author}.`,
      `"${title}."`,
      source ? `${source},` : '',
      `${year}.`,
      url,
    ]);
  }

  if (style === 'chicago') {
    return coalesceText([
      `${author}.`,
      `${title}.`,
      source ? `${source}.` : '',
      `(${year}).`,
      url,
    ]);
  }

  return coalesceText([
    `${author}.`,
    `(${year}).`,
    `${title}.`,
    source ? `${source}.` : '',
    url,
  ]);
}

function getEditorReferences(editor: HTMLElement): HTMLElement[] {
  return (Array.from(editor.querySelectorAll(CITATION_REF_SELECTOR)) as HTMLElement[]).filter(
    (ref) => !ref.closest(BIBLIOGRAPHY_SELECTOR) && !ref.closest(FOOTNOTES_SELECTOR),
  );
}

function getCitationFromRef(ref: HTMLElement, options: ResolvedCitationsOptions): CitationRecord | null {
  const id = sanitizeCitationId(options.normalizeText(ref.getAttribute('data-citation-id') || ''));
  if (!id) return null;

  const author = options.normalizeText(ref.getAttribute('data-citation-author') || '');
  const title = options.normalizeText(ref.getAttribute('data-citation-title') || '');

  return {
    id,
    author: author || 'Unknown',
    year: normalizeYear(ref.getAttribute('data-citation-year') || '', options.normalizeText) || undefined,
    title: title || 'Untitled',
    source: options.normalizeText(ref.getAttribute('data-citation-source') || '') || undefined,
    url: normalizeUrl(ref.getAttribute('data-citation-url') || '', options.normalizeText) || undefined,
    note: options.normalizeText(ref.getAttribute('data-citation-note') || '') || undefined,
  };
}

function setCitationAttributes(ref: HTMLElement, citation: CitationRecord, style: CitationStyle): void {
  ref.classList.add('rte-citation-ref');
  ref.setAttribute('data-citation-id', citation.id);
  ref.setAttribute('data-citation-author', citation.author || '');
  ref.setAttribute('data-citation-year', citation.year || '');
  ref.setAttribute('data-citation-title', citation.title || '');
  ref.setAttribute('data-citation-source', citation.source || '');
  ref.setAttribute('data-citation-url', citation.url || '');
  ref.setAttribute('data-citation-note', citation.note || '');
  ref.setAttribute('contenteditable', 'false');
  ref.setAttribute('tabindex', '0');
  ref.setAttribute('role', 'doc-biblioref');
  ref.setAttribute('data-style', style);
  ref.textContent = formatInlineCitation(citation, style);
}

function setCommandButtonActiveState(editor: HTMLElement, command: string, active: boolean): void {
  const root = resolveEditorRoot(editor);
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

function getCitationStyle(editor: HTMLElement, options?: ResolvedCitationsOptions): CitationStyle {
  const style = styleByEditor.get(editor);
  if (style && styleOrder.includes(style)) return style;
  return options?.defaultStyle || 'apa';
}

function getOrderedCitationRecords(editor: HTMLElement, options: ResolvedCitationsOptions): CitationRecord[] {
  const refs = getEditorReferences(editor);
  const ordered = new Map<string, CitationRecord>();

  refs.forEach((ref) => {
    const parsed = getCitationFromRef(ref, options);
    if (!parsed) return;

    if (!ordered.has(parsed.id)) {
      ordered.set(parsed.id, parsed);
      return;
    }

    const existing = ordered.get(parsed.id)!;
    ordered.set(parsed.id, {
      ...existing,
      author: existing.author || parsed.author,
      title: existing.title || parsed.title,
      year: existing.year || parsed.year,
      source: existing.source || parsed.source,
      url: existing.url || parsed.url,
      note: existing.note || parsed.note,
    });
  });

  return Array.from(ordered.values());
}

function rememberRecentCitation(editor: HTMLElement, citation: CitationInput | CitationRecord, options: ResolvedCitationsOptions): void {
  const normalized = normalizeCitationRecord(citation, options);
  if (!normalized.id || !normalized.author || !normalized.title) return;

  const existing = recentCitationsByEditor.get(editor) || [];
  const deduped = existing.filter((item) => item.id !== normalized.id);
  recentCitationsByEditor.set(editor, [normalized, ...deduped].slice(0, options.maxRecentCitations));
}

function getRecentCitations(editor: HTMLElement, currentCitations: CitationRecord[], options: ResolvedCitationsOptions): CitationRecord[] {
  const existing = recentCitationsByEditor.get(editor) || [];
  const merged = new Map<string, CitationRecord>();

  currentCitations
    .slice(Math.max(0, currentCitations.length - options.maxRecentCitations))
    .reverse()
    .forEach((citation) => {
      if (!citation.id) return;
      merged.set(citation.id, citation);
    });

  existing.forEach((citation) => {
    if (!citation.id || merged.has(citation.id)) return;
    merged.set(citation.id, citation);
  });

  const recent = Array.from(merged.values()).slice(0, options.maxRecentCitations);
  recentCitationsByEditor.set(editor, recent);
  return recent;
}

function findRecentCitation(
  editor: HTMLElement,
  citationId: string,
  currentCitations: CitationRecord[],
  options: ResolvedCitationsOptions,
): CitationRecord | null {
  const targetId = sanitizeCitationId(options.normalizeText(citationId || ''));
  if (!targetId) return null;

  const recent = getRecentCitations(editor, currentCitations, options);
  return recent.find((citation) => citation.id === targetId) || null;
}

function removeRecentCitation(editor: HTMLElement, citationId: string, options: ResolvedCitationsOptions): boolean {
  const targetId = sanitizeCitationId(options.normalizeText(citationId || ''));
  if (!targetId) return false;

  const existing = recentCitationsByEditor.get(editor) || [];
  const next = existing.filter((citation) => citation.id !== targetId);
  if (next.length === existing.length) return false;

  recentCitationsByEditor.set(editor, next);
  return true;
}

function createManagedSection(className: string, type: string, title: string): HTMLElement {
  const section = document.createElement('section');
  section.className = className;
  section.setAttribute('data-type', type);
  section.setAttribute('contenteditable', 'false');
  section.setAttribute('aria-label', title);
  if (type === 'citation-bibliography') {
    section.setAttribute('role', 'doc-bibliography');
  } else if (type === 'citation-footnotes') {
    section.setAttribute('role', 'doc-endnotes');
  }

  const heading = document.createElement('h3');
  heading.className = 'rte-citation-section-title';
  heading.textContent = title;

  const list = document.createElement('ol');
  list.className = 'rte-citation-list';
  list.setAttribute('role', 'list');

  section.appendChild(heading);
  section.appendChild(list);
  return section;
}

function getOrCreateBibliography(editor: HTMLElement, options: ResolvedCitationsOptions): HTMLElement {
  let section = editor.querySelector(BIBLIOGRAPHY_SELECTOR) as HTMLElement | null;
  if (!section) {
    section = createManagedSection('rte-citation-bibliography', 'citation-bibliography', options.labels.bibliographyTitle);
    editor.appendChild(section);
  }

  const heading = section.querySelector('.rte-citation-section-title') as HTMLElement | null;
  if (heading) heading.textContent = options.labels.bibliographyTitle;
  section.setAttribute('aria-label', options.labels.bibliographyTitle);

  return section;
}

function getOrCreateFootnotes(editor: HTMLElement, options: ResolvedCitationsOptions): HTMLElement {
  let section = editor.querySelector(FOOTNOTES_SELECTOR) as HTMLElement | null;
  if (!section) {
    section = createManagedSection('rte-citation-footnotes', 'citation-footnotes', options.labels.footnotesTitle);
    editor.appendChild(section);
  }

  const heading = section.querySelector('.rte-citation-section-title') as HTMLElement | null;
  if (heading) heading.textContent = options.labels.footnotesTitle;
  section.setAttribute('aria-label', options.labels.footnotesTitle);

  return section;
}

function removeManagedSection(editor: HTMLElement, selector: string): void {
  const section = editor.querySelector(selector) as HTMLElement | null;
  section?.remove();
}

function updateBibliography(editor: HTMLElement, citations: CitationRecord[], options: ResolvedCitationsOptions, style: CitationStyle): void {
  if (citations.length === 0) {
    removeManagedSection(editor, BIBLIOGRAPHY_SELECTOR);
    return;
  }

  const section = getOrCreateBibliography(editor, options);
  const list = section.querySelector('.rte-citation-list') as HTMLOListElement | null;
  if (!list) return;

  const fragment = document.createDocumentFragment();

  citations.forEach((citation, index) => {
    const item = document.createElement('li');
    item.className = 'rte-citation-item';
    item.id = `rte-citation-entry-${citation.id}`;
    item.setAttribute('data-citation-id', citation.id);
    item.setAttribute('data-citation-number', String(index + 1));
    item.textContent = formatBibliographyEntry(citation, style);
    fragment.appendChild(item);
  });

  list.innerHTML = '';
  list.appendChild(fragment);
}

function updateFootnotes(editor: HTMLElement, citations: CitationRecord[], options: ResolvedCitationsOptions, style: CitationStyle): void {
  if (!options.enableFootnoteSync || citations.length === 0) {
    removeManagedSection(editor, FOOTNOTES_SELECTOR);

    getEditorReferences(editor).forEach((ref) => {
      ref.removeAttribute('data-footnote-number');
      ref.removeAttribute('data-footnote-target');
    });
    return;
  }

  const section = getOrCreateFootnotes(editor, options);
  const list = section.querySelector('.rte-citation-list') as HTMLOListElement | null;
  if (!list) return;

  const firstRefIdByCitation = new Map<string, string>();
  const indexByCitation = new Map<string, number>();
  citations.forEach((citation, index) => {
    indexByCitation.set(citation.id, index + 1);
  });

  const occurrenceCount = new Map<string, number>();
  getEditorReferences(editor).forEach((ref) => {
    const citationId = ref.getAttribute('data-citation-id') || '';
    if (!citationId || !indexByCitation.has(citationId)) return;

    const nextOccurrence = (occurrenceCount.get(citationId) || 0) + 1;
    occurrenceCount.set(citationId, nextOccurrence);

    const refId = `rte-citation-ref-${citationId}-${nextOccurrence}`;
    ref.id = refId;

    const footnoteNumber = indexByCitation.get(citationId)!;
    ref.setAttribute('data-footnote-number', String(footnoteNumber));
    ref.setAttribute('data-footnote-target', `rte-citation-note-${citationId}`);

    if (!firstRefIdByCitation.has(citationId)) {
      firstRefIdByCitation.set(citationId, refId);
    }
  });

  const fragment = document.createDocumentFragment();

  citations.forEach((citation, index) => {
    const item = document.createElement('li');
    item.className = 'rte-citation-item rte-citation-footnote-item';
    item.id = `rte-citation-note-${citation.id}`;
    item.setAttribute('data-citation-id', citation.id);

    const number = document.createElement('span');
    number.className = 'rte-citation-footnote-number';
    number.textContent = `${index + 1}. `;

    const text = document.createElement('span');
    text.className = 'rte-citation-footnote-text';
    const notePrefix = citation.note ? `${citation.note}. ` : '';
    text.textContent = `${notePrefix}${formatBibliographyEntry(citation, style)}`;

    item.appendChild(number);
    item.appendChild(text);

    const firstRefId = firstRefIdByCitation.get(citation.id);
    if (firstRefId) {
      const backRef = document.createElement('a');
      backRef.className = 'rte-citation-backref';
      backRef.href = `#${firstRefId}`;
      backRef.setAttribute('aria-label', `Back to citation ${index + 1}`);
      backRef.textContent = 'Back';
      item.appendChild(backRef);
    }

    fragment.appendChild(item);
  });

  list.innerHTML = '';
  list.appendChild(fragment);
}

function updateReferenceAccessibility(ref: HTMLElement, citation: CitationRecord, style: CitationStyle, number: number): void {
  const shortText = formatBibliographyEntry(citation, style);
  ref.setAttribute('data-citation-number', String(number));
  ref.setAttribute('aria-label', `Citation ${number}: ${shortText}`);
}

function computeSnapshot(editor: HTMLElement, style: CitationStyle, footnoteSync: boolean): string {
  const refs = getEditorReferences(editor);
  let seed = `${style}:${footnoteSync ? '1' : '0'}:${refs.length}`;

  refs.forEach((ref) => {
    seed += `|${ref.getAttribute('data-citation-id') || ''}`;
    seed += `|${ref.getAttribute('data-citation-author') || ''}`;
    seed += `|${ref.getAttribute('data-citation-year') || ''}`;
    seed += `|${ref.getAttribute('data-citation-title') || ''}`;
    seed += `|${ref.getAttribute('data-citation-source') || ''}`;
    seed += `|${ref.getAttribute('data-citation-url') || ''}`;
    seed += `|${ref.getAttribute('data-citation-note') || ''}`;
  });

  return seed;
}

function refreshPanel(editor: HTMLElement): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;

  const style = getCitationStyle(editor, options);
  const citations = getOrderedCitationRecords(editor, options);
  const recent = getRecentCitations(editor, citations, options);

  const status = panel.querySelector<HTMLElement>('.rte-citations-status');
  const styleButton = panel.querySelector<HTMLButtonElement>('[data-action="cycle-style"]');
  const recentList = panel.querySelector<HTMLElement>('.rte-citations-recent-list');

  if (status) {
    const count = citations.length;
    status.textContent = `${options.labels.summaryPrefix}: ${count} | Style: ${style.toUpperCase()} | Footnotes: ${
      options.enableFootnoteSync ? 'On' : 'Off'
    }`;
  }

  if (styleButton) {
    styleButton.textContent = `${options.labels.styleButtonPrefix}: ${style.toUpperCase()}`;
    styleButton.setAttribute('aria-label', `${options.labels.styleButtonPrefix}: ${style.toUpperCase()}`);
  }

  if (recentList) {
    if (recent.length === 0) {
      recentList.innerHTML = `<li class="rte-citations-empty">${escapeHtml(options.labels.noCitationsText)}</li>`;
      return;
    }

    recentList.innerHTML = recent
      .map(
        (citation) => `
          <li class="rte-citations-recent-item">
            <div class="rte-citations-recent-row">
              <button
                type="button"
                class="rte-citations-recent-btn"
                data-action="insert-from-recent"
                data-citation-id="${escapeHtml(citation.id)}"
                aria-label="Insert citation: ${escapeHtml(citation.title)}"
              >
                <span class="rte-citations-recent-title">${escapeHtml(citation.title)}</span>
                <span class="rte-citations-recent-meta">${escapeHtml(citation.author)}${citation.year ? ` (${escapeHtml(citation.year)})` : ''}</span>
              </button>
              <button
                type="button"
                class="rte-citations-recent-delete"
                data-action="delete-by-id"
                data-citation-id="${escapeHtml(citation.id)}"
                aria-label="Delete citation: ${escapeHtml(citation.title)}"
              >${escapeHtml(options.labels.deleteRecentText)}</button>
            </div>
          </li>
        `,
      )
      .join('');
  }
}

function refreshCitations(editor: HTMLElement, options: ResolvedCitationsOptions, force = false): CitationRecord[] {
  const style = getCitationStyle(editor, options);
  const snapshot = computeSnapshot(editor, style, options.enableFootnoteSync);

  if (!force && snapshotByEditor.get(editor) === snapshot) {
    return getOrderedCitationRecords(editor, options);
  }

  const refs = getEditorReferences(editor);
  const citationById = new Map<string, CitationRecord>();

  refs.forEach((ref) => {
    const parsed = getCitationFromRef(ref, options);
    if (!parsed) return;
    if (!citationById.has(parsed.id)) citationById.set(parsed.id, parsed);
  });

  const citations = Array.from(citationById.values());
  getRecentCitations(editor, citations, options);
  const citationNumberById = new Map<string, number>();
  citations.forEach((citation, index) => {
    citationNumberById.set(citation.id, index + 1);
  });

  refs.forEach((ref) => {
    const citationId = ref.getAttribute('data-citation-id') || '';
    const citation = citationById.get(citationId);
    if (!citation) return;

    setCitationAttributes(ref, citation, style);
    const number = citationNumberById.get(citation.id) || 1;
    updateReferenceAccessibility(ref, citation, style, Math.max(1, number));
  });

  updateBibliography(editor, citations, options, style);
  updateFootnotes(editor, citations, options, style);

  snapshotByEditor.set(editor, snapshot);

  refreshPanel(editor);

  editor.dispatchEvent(
    new CustomEvent('editora:citations-refreshed', {
      bubbles: true,
      detail: {
        citations,
        style,
        footnoteSync: options.enableFootnoteSync,
      },
    }),
  );

  return citations;
}

function clearDebounceTimer(editor: HTMLElement): void {
  const existing = debounceTimerByEditor.get(editor);
  if (typeof existing !== 'number') return;

  window.clearTimeout(existing);
  activeDebounceTimers.delete(existing);
  debounceTimerByEditor.delete(editor);
}

function scheduleRefresh(editor: HTMLElement): void {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;

  clearDebounceTimer(editor);
  const timer = window.setTimeout(() => {
    activeDebounceTimers.delete(timer);
    debounceTimerByEditor.delete(editor);
    refreshCitations(editor, options, false);
  }, options.debounceMs);

  activeDebounceTimers.add(timer);
  debounceTimerByEditor.set(editor, timer);
}

function getInsertionRange(editor: HTMLElement): Range {
  const selection = window.getSelection();
  if (!selection) throw new Error('Selection unavailable');

  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (editor.contains(range.commonAncestorContainer) && !isInManagedSection(range.commonAncestorContainer)) {
      return range.cloneRange();
    }
  }

  const range = document.createRange();

  const bibliography = editor.querySelector(BIBLIOGRAPHY_SELECTOR);
  const footnotes = editor.querySelector(FOOTNOTES_SELECTOR);
  const anchor = bibliography || footnotes;

  if (anchor) {
    range.setStartBefore(anchor);
    range.collapse(true);
    return range;
  }

  range.selectNodeContents(editor);
  range.collapse(false);
  return range;
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
    // History plugin may not exist in the current editor config.
  }
}

function setCaretAt(parent: Node, offset: number): void {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  if (parent.nodeType === Node.TEXT_NODE) {
    const text = parent as Text;
    const safe = Math.max(0, Math.min(offset, text.length));
    range.setStart(text, safe);
  } else {
    const maxOffset = parent.childNodes.length;
    const safe = Math.max(0, Math.min(offset, maxOffset));
    range.setStart(parent, safe);
  }
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function resolveSelectedCitationReference(range: Range): HTMLElement | null {
  if (range.collapsed) return null;
  if (range.startContainer !== range.endContainer) return null;
  if (range.endOffset !== range.startOffset + 1) return null;
  if (!(range.startContainer instanceof Element || range.startContainer instanceof DocumentFragment)) {
    return null;
  }

  const node = range.startContainer.childNodes[range.startOffset];
  if (!(node instanceof HTMLElement)) return null;
  if (!node.matches(CITATION_REF_SELECTOR)) return null;
  return node;
}

function findAdjacentBoundarySibling(
  range: Range,
  editor: HTMLElement,
  direction: 'previous' | 'next',
): Node | null {
  const { startContainer, startOffset } = range;

  if (startContainer.nodeType === Node.ELEMENT_NODE) {
    const element = startContainer as Element;
    if (direction === 'previous') {
      if (startOffset > 0) return element.childNodes[startOffset - 1] || null;
    } else if (startOffset < element.childNodes.length) {
      return element.childNodes[startOffset] || null;
    }
  }

  if (startContainer.nodeType === Node.TEXT_NODE) {
    const text = startContainer as Text;
    if (direction === 'previous' && startOffset < text.data.length) return null;
    if (direction === 'next' && startOffset > 0) return null;
  }

  let current: Node | null = startContainer;
  while (current && current !== editor) {
    const sibling = direction === 'previous' ? current.previousSibling : current.nextSibling;
    if (sibling) return sibling;
    current = current.parentNode;
  }

  return null;
}

function findCitationReferenceForCaretDeletion(
  range: Range,
  editor: HTMLElement,
  key: 'Backspace' | 'Delete',
): HTMLElement | null {
  if (!range.collapsed) return null;

  const asRef = (node: Node | null): HTMLElement | null => (
    node instanceof HTMLElement && node.matches(CITATION_REF_SELECTOR) ? node : null
  );

  const { startContainer, startOffset } = range;

  if (startContainer.nodeType === Node.ELEMENT_NODE) {
    const element = startContainer as Element;
    if (key === 'Backspace' && startOffset > 0) {
      return asRef(element.childNodes[startOffset - 1] || null);
    }
    if (key === 'Delete') {
      return asRef(element.childNodes[startOffset] || null);
    }
    return null;
  }

  if (startContainer.nodeType === Node.TEXT_NODE) {
    const text = startContainer as Text;
    if (key === 'Backspace' && startOffset === 0) {
      const direct = asRef(text.previousSibling);
      if (direct) return direct;
      return asRef(findAdjacentBoundarySibling(range, editor, 'previous'));
    }
    if (key === 'Delete' && startOffset === text.data.length) {
      const direct = asRef(text.nextSibling);
      if (direct) return direct;
      return asRef(findAdjacentBoundarySibling(range, editor, 'next'));
    }
  }

  if (key === 'Backspace') {
    return asRef(findAdjacentBoundarySibling(range, editor, 'previous'));
  }
  return asRef(findAdjacentBoundarySibling(range, editor, 'next'));
}

function removeCitationReference(
  reference: HTMLElement,
  key: 'Backspace' | 'Delete',
  options: ResolvedCitationsOptions,
): boolean {
  const editor = reference.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
  if (!editor || isInManagedSection(reference)) return false;

  const parent = reference.parentNode;
  if (!parent) return false;

  const beforeHTML = editor.innerHTML;
  const index = Array.from(parent.childNodes).indexOf(reference);
  if (index < 0) return false;

  const nextSibling = reference.nextSibling;
  if (nextSibling instanceof Text) {
    if (nextSibling.data === ' ') {
      nextSibling.remove();
    } else if (nextSibling.data.startsWith(' ')) {
      nextSibling.data = nextSibling.data.slice(1);
    }
  }

  reference.remove();
  setCaretAt(parent, index);

  refreshCitations(editor, options, true);
  recordDomHistoryTransaction(editor, beforeHTML);
  dispatchEditorInput(editor);

  if (key === 'Delete') {
    editor.focus({ preventScroll: true });
  }
  return true;
}

function tryDeleteCitationFromKeyboard(
  event: KeyboardEvent,
  editor: HTMLElement,
  options: ResolvedCitationsOptions,
): boolean {
  if (event.key !== 'Backspace' && event.key !== 'Delete') return false;

  const key = event.key as 'Backspace' | 'Delete';
  const target = event.target as HTMLElement | null;

  if (target?.matches(CITATION_REF_SELECTOR) && editor.contains(target) && !isInManagedSection(target)) {
    event.preventDefault();
    event.stopPropagation();
    return removeCitationReference(target, key, options);
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return false;
  if (isInManagedSection(range.commonAncestorContainer)) return false;

  const selectedRef = resolveSelectedCitationReference(range);
  if (selectedRef) {
    event.preventDefault();
    event.stopPropagation();
    return removeCitationReference(selectedRef, key, options);
  }

  const adjacentRef = findCitationReferenceForCaretDeletion(range, editor, key);
  if (!adjacentRef) return false;

  event.preventDefault();
  event.stopPropagation();
  return removeCitationReference(adjacentRef, key, options);
}

function removeCitationById(editor: HTMLElement, citationId: string, options: ResolvedCitationsOptions): boolean {
  const targetId = sanitizeCitationId(options.normalizeText(citationId || ''));
  if (!targetId) return false;

  const refs = getEditorReferences(editor).filter((item) => item.getAttribute('data-citation-id') === targetId);
  if (refs.length === 0) return false;

  if (refs.length === 1) {
    return removeCitationReference(refs[0], 'Delete', options);
  }

  const beforeHTML = editor.innerHTML;

  refs.forEach((ref) => {
    const nextSibling = ref.nextSibling;
    if (nextSibling instanceof Text) {
      if (nextSibling.data === ' ') {
        nextSibling.remove();
      } else if (nextSibling.data.startsWith(' ')) {
        nextSibling.data = nextSibling.data.slice(1);
      }
    }
    ref.remove();
  });

  setCaretAt(editor, editor.childNodes.length);
  refreshCitations(editor, options, true);
  recordDomHistoryTransaction(editor, beforeHTML);
  dispatchEditorInput(editor);
  editor.focus({ preventScroll: true });
  return true;
}

function removeCitationFromSelection(editor: HTMLElement, options: ResolvedCitationsOptions): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  const range = selection.getRangeAt(0);

  if (!editor.contains(range.commonAncestorContainer)) return false;
  if (isInManagedSection(range.commonAncestorContainer)) return false;

  const selectedRef = resolveSelectedCitationReference(range);
  if (selectedRef) {
    return removeCitationReference(selectedRef, 'Delete', options);
  }

  const adjacentRef = findCitationReferenceForCaretDeletion(range, editor, 'Backspace');
  if (adjacentRef) {
    return removeCitationReference(adjacentRef, 'Backspace', options);
  }

  return false;
}

function insertCitation(editor: HTMLElement, input: CitationInput | CitationRecord, options: ResolvedCitationsOptions): boolean {
  const normalized = normalizeCitationRecord(input, options);
  if (!normalized.author || !normalized.title) return false;

  if (!normalized.id) {
    normalized.id = createCitationId(editor, options);
  }

  const beforeHTML = editor.innerHTML;

  let range: Range;
  try {
    range = getInsertionRange(editor);
  } catch {
    return false;
  }

  const selection = window.getSelection();
  if (!selection) return false;

  if (!range.collapsed) {
    range.deleteContents();
  }

  const reference = document.createElement('span');
  setCitationAttributes(reference, normalized, getCitationStyle(editor, options));

  try {
    range.insertNode(reference);
  } catch {
    return false;
  }

  const spacer = document.createTextNode(' ');
  if (reference.nextSibling) {
    reference.parentNode?.insertBefore(spacer, reference.nextSibling);
  } else {
    reference.parentNode?.appendChild(spacer);
  }

  const caret = document.createRange();
  if (spacer.parentNode) {
    const offset = Array.from(spacer.parentNode.childNodes).indexOf(spacer) + 1;
    caret.setStart(spacer.parentNode, Math.max(0, offset));
  } else {
    caret.setStartAfter(reference);
  }
  caret.collapse(true);
  selection.removeAllRanges();
  selection.addRange(caret);

  rememberRecentCitation(editor, normalized, options);
  refreshCitations(editor, options, true);
  recordDomHistoryTransaction(editor, beforeHTML);
  dispatchEditorInput(editor);
  return true;
}

function locateCitation(editor: HTMLElement, citationId: string): boolean {
  if (!citationId) return false;

  const ref = getEditorReferences(editor).find((item) => item.getAttribute('data-citation-id') === citationId) || null;
  if (!ref) return false;

  ref.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  ref.focus({ preventScroll: true });

  const selection = window.getSelection();
  if (!selection) return true;

  const range = document.createRange();
  range.selectNode(ref);
  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}

function isPanelVisible(editor: HTMLElement): boolean {
  return panelVisibleByEditor.get(editor) === true;
}

function hidePanel(editor: HTMLElement, focusEditor = false): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  panel.classList.remove('show');
  panelVisibleByEditor.set(editor, false);
  setCommandButtonActiveState(editor, 'toggleCitationsPanel', false);

  if (focusEditor) {
    editor.focus({ preventScroll: true });
  }
}

function hidePanelsExcept(editor: HTMLElement): void {
  panelByEditor.forEach((_panel, current) => {
    if (current === editor) return;
    hidePanel(current, false);
  });
}

function positionPanel(editor: HTMLElement, panel: HTMLElement): void {
  if (!panel.classList.contains('show')) return;

  const root = resolveEditorRoot(editor);
  const rect = root.getBoundingClientRect();

  const width = Math.min(window.innerWidth - 20, 380);
  const maxLeft = Math.max(10, window.innerWidth - width - 10);
  const left = Math.min(Math.max(10, rect.right - width), maxLeft);
  const top = Math.max(10, Math.min(window.innerHeight - 10 - 260, rect.top + 10));

  panel.style.width = `${width}px`;
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.maxHeight = `${Math.max(260, window.innerHeight - 24)}px`;
}

function getPanelField(panel: HTMLElement, name: string): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null {
  return panel.querySelector(`[data-field="${name}"]`) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | null;
}

function readCitationFromPanel(panel: HTMLElement): CitationInput {
  const author = (getPanelField(panel, 'author') as HTMLInputElement | null)?.value || '';
  const year = (getPanelField(panel, 'year') as HTMLInputElement | null)?.value || '';
  const title = (getPanelField(panel, 'title') as HTMLInputElement | null)?.value || '';
  const source = (getPanelField(panel, 'source') as HTMLInputElement | null)?.value || '';
  const url = (getPanelField(panel, 'url') as HTMLInputElement | null)?.value || '';
  const note = (getPanelField(panel, 'note') as HTMLTextAreaElement | null)?.value || '';

  return {
    author,
    year,
    title,
    source,
    url,
    note,
  };
}

function setPanelStatus(panel: HTMLElement, message: string): void {
  const live = panel.querySelector<HTMLElement>('.rte-citations-live');
  if (live) {
    live.textContent = message;
  }
}

function updateStyleField(editor: HTMLElement, panel: HTMLElement, options: ResolvedCitationsOptions): void {
  const select = getPanelField(panel, 'style') as HTMLSelectElement | null;
  if (!select) return;
  select.value = getCitationStyle(editor, options);
}

function applyStyle(editor: HTMLElement, style: CitationStyle, options: ResolvedCitationsOptions): CitationStyle {
  const next = styleOrder.includes(style) ? style : options.defaultStyle;
  styleByEditor.set(editor, next);
  refreshCitations(editor, options, true);
  return next;
}

function cycleStyle(editor: HTMLElement, options: ResolvedCitationsOptions): CitationStyle {
  const current = getCitationStyle(editor, options);
  const index = styleOrder.indexOf(current);
  const next = styleOrder[(index + 1) % styleOrder.length];
  styleByEditor.set(editor, next);
  refreshCitations(editor, options, true);
  return next;
}

function ensurePanel(editor: HTMLElement): HTMLElement {
  const existing = panelByEditor.get(editor);
  if (existing) return existing;

  const options = optionsByEditor.get(editor) || fallbackOptions || normalizeOptions();
  const panelId = `rte-citations-panel-${panelSequence++}`;

  const panel = document.createElement('section');
  panel.className = PANEL_CLASS;
  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);
  panel.setAttribute('tabindex', '-1');

  panel.innerHTML = `
    <header class="rte-citations-header">
      <h2 class="rte-citations-title">${escapeHtml(options.labels.panelTitle)}</h2>
      <button type="button" class="rte-citations-icon-btn" data-action="close" aria-label="${escapeHtml(options.labels.closeText)}">X</button>
    </header>
    <div class="rte-citations-body">
      <p class="rte-citations-status" aria-live="polite"></p>

      <div class="rte-citations-grid">
        <label class="rte-citations-label">
          ${escapeHtml(options.labels.styleLabel)}
          <select data-field="style" class="rte-citations-field">
            <option value="apa">APA</option>
            <option value="mla">MLA</option>
            <option value="chicago">Chicago</option>
          </select>
        </label>
        <label class="rte-citations-label">
          ${escapeHtml(options.labels.authorLabel)}
          <input type="text" data-field="author" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${escapeHtml(options.labels.yearLabel)}
          <input type="text" data-field="year" class="rte-citations-field" inputmode="numeric" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${escapeHtml(options.labels.titleLabel)}
          <input type="text" data-field="title" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${escapeHtml(options.labels.sourceLabel)}
          <input type="text" data-field="source" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label">
          ${escapeHtml(options.labels.urlLabel)}
          <input type="url" data-field="url" class="rte-citations-field" autocomplete="off" />
        </label>
        <label class="rte-citations-label rte-citations-label-note">
          ${escapeHtml(options.labels.noteLabel)}
          <textarea data-field="note" class="rte-citations-field" rows="2"></textarea>
        </label>
      </div>

      <div class="rte-citations-controls" role="toolbar" aria-label="Citation actions">
        <button type="button" class="rte-citations-btn rte-citations-btn-primary" data-action="insert">${escapeHtml(options.labels.insertText)}</button>
        <button type="button" class="rte-citations-btn" data-action="refresh">${escapeHtml(options.labels.refreshText)}</button>
        <button type="button" class="rte-citations-btn" data-action="cycle-style"></button>
      </div>

      <section class="rte-citations-recent" aria-label="${escapeHtml(options.labels.recentHeading)}">
        <h3 class="rte-citations-recent-heading">${escapeHtml(options.labels.recentHeading)}</h3>
        <ul class="rte-citations-recent-list" role="list"></ul>
      </section>

      <p class="rte-citations-shortcut">Shortcut: Ctrl/Cmd + Alt + Shift + C</p>
      <span class="rte-citations-live" aria-live="polite"></span>
    </div>
  `;

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const actionElement = target.closest('[data-action]') as HTMLElement | null;
    if (!actionElement) return;

    const action = actionElement.getAttribute('data-action') || '';
    const resolvedOptions = optionsByEditor.get(editor) || fallbackOptions || options;
    optionsByEditor.set(editor, resolvedOptions);

    if (action === 'close') {
      hidePanel(editor, true);
      return;
    }

    if (action === 'insert') {
      if (isEditorReadonly(editor)) return;

      const value = readCitationFromPanel(panel);
      if (!resolvedOptions.normalizeText(value.author) || !resolvedOptions.normalizeText(value.title)) {
        setPanelStatus(panel, resolvedOptions.labels.invalidMessage);
        return;
      }

      const inserted = insertCitation(editor, value, resolvedOptions);
      if (!inserted) {
        setPanelStatus(panel, resolvedOptions.labels.invalidMessage);
        return;
      }

      setPanelStatus(panel, 'Citation inserted.');
      const titleField = getPanelField(panel, 'title') as HTMLInputElement | null;
      const noteField = getPanelField(panel, 'note') as HTMLTextAreaElement | null;
      if (titleField) titleField.value = '';
      if (noteField) noteField.value = '';
      return;
    }

    if (action === 'refresh') {
      const citations = refreshCitations(editor, resolvedOptions, true);
      setPanelStatus(panel, `Refreshed ${citations.length} citation${citations.length === 1 ? '' : 's'}.`);
      return;
    }

    if (action === 'cycle-style') {
      const next = cycleStyle(editor, resolvedOptions);
      updateStyleField(editor, panel, resolvedOptions);
      setPanelStatus(panel, `Style changed to ${next.toUpperCase()}.`);
      return;
    }

    if (action === 'insert-from-recent') {
      if (isEditorReadonly(editor)) return;

      const citationId = actionElement.getAttribute('data-citation-id') || '';
      const citation = findRecentCitation(editor, citationId, getOrderedCitationRecords(editor, resolvedOptions), resolvedOptions);
      if (!citation) return;

      insertCitation(editor, citation, resolvedOptions);
      setPanelStatus(panel, `Inserted citation: ${citation.title}.`);
      return;
    }

    if (action === 'delete-by-id') {
      if (isEditorReadonly(editor)) return;

      const citationId = actionElement.getAttribute('data-citation-id') || '';
      const removed = removeCitationById(editor, citationId, resolvedOptions);
      if (removed) {
        setPanelStatus(panel, 'Citation deleted.');
        return;
      }

      const removedRecent = removeRecentCitation(editor, citationId, resolvedOptions);
      if (removedRecent) {
        refreshPanel(editor);
        setPanelStatus(panel, 'Removed from recent citations.');
      }
    }
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      hidePanel(editor, true);
      return;
    }

    const target = event.target as HTMLElement | null;
    if (!target || !target.matches('.rte-citations-recent-btn')) return;
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

    const buttons = Array.from(panel.querySelectorAll<HTMLButtonElement>('.rte-citations-recent-btn'));
    if (buttons.length === 0) return;

    const currentIndex = buttons.indexOf(target as HTMLButtonElement);
    if (currentIndex < 0) return;

    event.preventDefault();
    const offset = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (currentIndex + offset + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
  });

  const styleSelect = getPanelField(panel, 'style') as HTMLSelectElement | null;
  styleSelect?.addEventListener('change', () => {
    const resolvedOptions = optionsByEditor.get(editor) || fallbackOptions || options;
    const next = styleSelect.value as CitationStyle;
    applyStyle(editor, next, resolvedOptions);
    setPanelStatus(panel, `Style changed to ${next.toUpperCase()}.`);
  });

  applyThemeClass(panel, editor);
  document.body.appendChild(panel);

  panelByEditor.set(editor, panel);
  panelVisibleByEditor.set(editor, false);

  refreshPanel(editor);
  return panel;
}

function showPanel(editor: HTMLElement): void {
  const panel = ensurePanel(editor);
  hidePanelsExcept(editor);

  panel.classList.add('show');
  panelVisibleByEditor.set(editor, true);
  setCommandButtonActiveState(editor, 'toggleCitationsPanel', true);

  applyThemeClass(panel, editor);
  positionPanel(editor, panel);
  refreshPanel(editor);

  const authorField = getPanelField(panel, 'author') as HTMLInputElement | null;
  authorField?.focus();
}

function togglePanel(editor: HTMLElement, explicit?: boolean): boolean {
  const visible = isPanelVisible(editor);
  const next = typeof explicit === 'boolean' ? explicit : !visible;

  if (next) showPanel(editor);
  else hidePanel(editor, false);

  return true;
}

function isOpenShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'c';
}

function isRefreshShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'b';
}

function isStyleShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'j';
}

function bindGlobalHandlers(options: ResolvedCitationsOptions): void {
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
      if (!styleByEditor.has(editor)) {
        styleByEditor.set(editor, options.defaultStyle);
      }

      const panel = panelByEditor.get(editor);
      if (panel) {
        applyThemeClass(panel, editor);
        positionPanel(editor, panel);
      }

      setCommandButtonActiveState(editor, 'toggleCitationsPanel', isPanelVisible(editor));
    };

    document.addEventListener('focusin', globalFocusInHandler, true);
  }

  if (!globalInputHandler) {
    globalInputHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      lastActiveEditor = editor;
      scheduleRefresh(editor);
    };

    document.addEventListener('input', globalInputHandler, true);
  }

  if (!globalKeydownHandler) {
    globalKeydownHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      const inPanelInput = Boolean(target?.closest(`.${PANEL_CLASS} input, .${PANEL_CLASS} textarea, .${PANEL_CLASS} select`));

      const editor = resolveEditorFromContext(undefined, false);
      if (!editor) return;
      if (isEditorReadonly(editor)) return;

      const resolvedOptions = optionsByEditor.get(editor) || fallbackOptions || options;
      optionsByEditor.set(editor, resolvedOptions);
      lastActiveEditor = editor;

      if (event.key === 'Escape' && isPanelVisible(editor)) {
        event.preventDefault();
        hidePanel(editor, true);
        return;
      }

      if (inPanelInput) return;

      if (tryDeleteCitationFromKeyboard(event, editor, resolvedOptions)) {
        return;
      }

      if (isOpenShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        togglePanel(editor);
        return;
      }

      if (isRefreshShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        refreshCitations(editor, resolvedOptions, true);
        showPanel(editor);
        return;
      }

      if (isStyleShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        cycleStyle(editor, resolvedOptions);
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

  panelByEditor.forEach((panel) => panel.remove());
  panelByEditor.clear();

  fallbackOptions = null;
  lastActiveEditor = null;
}

function ensureStylesInjected(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .rte-toolbar-group-items.citations,
    .editora-toolbar-group-items.citations {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
    }

    .rte-toolbar-group-items.citations .rte-toolbar-button,
    .editora-toolbar-group-items.citations .editora-toolbar-button {
      border: none;
      border-radius: 0;
      border-right: 1px solid #ccc;
    }

    .rte-toolbar-group-items.citations .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.citations .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="toggleCitationsPanel"].active,
    .editora-toolbar-button[data-command="toggleCitationsPanel"].active {
      background: #16a34a1a;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.citations,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.citations,
    .${PANEL_CLASS}.rte-citations-theme-dark {
      border-color: rgba(148, 163, 184, 0.34);
    }

    .${PANEL_CLASS} {
      position: fixed;
      z-index: 1500;
      right: 16px;
      top: 16px;
      width: min(380px, calc(100vw - 20px));
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

    .${PANEL_CLASS}.rte-citations-theme-dark {
      background: #0f172a;
      color: #e2e8f0;
      border-color: #334155;
      box-shadow: 0 20px 40px rgba(2, 6, 23, 0.5);
    }

    .rte-citations-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-header {
      border-bottom-color: #334155;
      background: #111827;
    }

    .rte-citations-title {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }

    .rte-citations-icon-btn {
      border: 1px solid #d1d5db;
      background: #fff;
      color: inherit;
      border-radius: 8px;
      cursor: pointer;
      min-width: 30px;
      min-height: 30px;
      font-size: 12px;
      font-weight: 700;
    }

    .rte-citations-icon-btn:hover,
    .rte-citations-icon-btn:focus-visible {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2);
    }

    .rte-citations-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-citations-status {
      margin: 0;
      font-size: 12px;
      color: #475569;
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-status {
      color: #94a3b8;
    }

    .rte-citations-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .rte-citations-label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      color: inherit;
    }

    .rte-citations-label-note {
      grid-column: 1 / -1;
    }

    .rte-citations-field {
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

    .rte-citations-field:focus-visible {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2);
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-field {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-citations-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .rte-citations-btn {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: inherit;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-citations-btn:hover,
    .rte-citations-btn:focus-visible {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.2);
    }

    .rte-citations-btn-primary {
      background: #1d4ed8;
      border-color: #1d4ed8;
      color: #ffffff;
    }

    .rte-citations-btn-primary:hover,
    .rte-citations-btn-primary:focus-visible {
      background: #1e40af;
      border-color: #1e40af;
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-btn {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-btn-primary {
      border-color: #2563eb;
      background: #2563eb;
      color: #ffffff;
    }

    .rte-citations-recent {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-recent {
      border-color: #334155;
    }

    .rte-citations-recent-heading {
      margin: 0 0 8px;
      font-size: 12px;
      font-weight: 700;
    }

    .rte-citations-recent-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 170px;
      overflow: auto;
    }

    .rte-citations-recent-btn {
      width: 100%;
      text-align: left;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: inherit;
      border-radius: 8px;
      padding: 7px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .rte-citations-recent-row {
      display: flex;
      gap: 6px;
      align-items: stretch;
    }

    .rte-citations-recent-delete {
      flex: 0 0 auto;
      border: 1px solid #fecaca;
      background: #fff1f2;
      color: #b91c1c;
      border-radius: 8px;
      padding: 0 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      min-height: 34px;
    }

    .rte-citations-recent-delete:hover,
    .rte-citations-recent-delete:focus-visible {
      outline: none;
      border-color: #f87171;
      box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.2);
    }

    .rte-citations-recent-btn:focus-visible,
    .rte-citations-recent-btn:hover {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.18);
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-recent-btn {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-recent-delete {
      border-color: #7f1d1d;
      background: #2b1218;
      color: #fca5a5;
    }

    .rte-citations-recent-title {
      font-size: 12px;
      font-weight: 700;
      line-height: 1.3;
    }

    .rte-citations-recent-meta {
      font-size: 11px;
      color: #64748b;
      line-height: 1.3;
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-recent-meta {
      color: #94a3b8;
    }

    .rte-citations-empty {
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-empty {
      border-color: #334155;
      color: #94a3b8;
    }

    .rte-citations-shortcut {
      margin: 0;
      font-size: 11px;
      color: #64748b;
    }

    .${PANEL_CLASS}.rte-citations-theme-dark .rte-citations-shortcut {
      color: #94a3b8;
    }

    .rte-citations-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    .rte-citation-ref {
      display: inline-flex;
      align-items: center;
      border-radius: 6px;
      border: 1px solid rgba(29, 78, 216, 0.24);
      background: rgba(29, 78, 216, 0.08);
      color: #1e3a8a;
      padding: 0 4px;
      margin: 0 1px;
      font-size: 0.92em;
      line-height: 1.35;
      white-space: nowrap;
      cursor: pointer;
      user-select: all;
    }

    .rte-citation-ref:focus,
    .rte-citation-ref:focus-visible {
      outline: none;
      border-color: #1d4ed8;
      box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.22);
    }

    .${DARK_THEME_SELECTOR} .rte-citation-ref {
      border-color: rgba(96, 165, 250, 0.45);
      background: rgba(37, 99, 235, 0.22);
      color: #bfdbfe;
    }

    .rte-citation-bibliography,
    .rte-citation-footnotes {
      margin-top: 16px;
      border-top: 1px solid #d1d5db;
      padding-top: 10px;
    }

    .${DARK_THEME_SELECTOR} .rte-citation-bibliography,
    .${DARK_THEME_SELECTOR} .rte-citation-footnotes {
      border-top-color: #475569;
    }

    .rte-citation-section-title {
      margin: 0 0 8px;
      font-size: 1em;
      font-weight: 700;
    }

    .rte-citation-list {
      margin: 0;
      padding-left: 22px;
    }

    .rte-citation-item {
      margin: 0 0 8px;
      line-height: 1.45;
    }

    .rte-citation-backref {
      margin-left: 8px;
      color: #1d4ed8;
      text-decoration: none;
      font-size: 0.9em;
    }

    .rte-citation-backref:hover,
    .rte-citation-backref:focus-visible {
      text-decoration: underline;
      outline: none;
    }

    .${DARK_THEME_SELECTOR} .rte-citation-backref {
      color: #93c5fd;
    }

    @media (max-width: 768px) {
      .${PANEL_CLASS} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }

      .rte-citations-grid {
        grid-template-columns: 1fr;
      }

      .rte-citations-recent-list {
        max-height: 34vh;
      }
    }
  `;

  document.head.appendChild(style);
}

export const CitationsPlugin = (rawOptions: CitationsPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  ensureStylesInjected();

  return {
    name: 'citations',

    toolbar: [
      {
        id: 'citationsGroup',
        label: 'Citations',
        type: 'group',
        command: 'citations',
        items: [
          {
            id: 'citations',
            label: 'Citations',
            command: 'toggleCitationsPanel',
            shortcut: 'Mod-Alt-Shift-c',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 5h12M6 9h12M6 13h8M6 17h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17 14.5a2.5 2.5 0 0 1 2.5 2.5v2H15v-2a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.5"/></svg>',
          },
          {
            id: 'citationsRefresh',
            label: 'Refresh Citations',
            command: 'refreshCitations',
            shortcut: 'Mod-Alt-Shift-b',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M20 4v6h-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          },
          {
            id: 'citationsStyle',
            label: 'Cycle Citation Style',
            command: 'cycleCitationStyle',
            shortcut: 'Mod-Alt-Shift-j',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M5 6h14M5 10h8M5 14h14M5 18h10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="18" cy="10" r="2" stroke="currentColor" stroke-width="1.6"/></svg>',
          },
        ],
      },
    ],

    commands: {
      citations: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);
        styleByEditor.set(editor, getCitationStyle(editor, resolved));

        lastActiveEditor = editor;
        showPanel(editor);
        refreshCitations(editor, resolved, false);
        return true;
      },

      toggleCitationsPanel: (value?: boolean, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        const toggled = togglePanel(editor, typeof value === 'boolean' ? value : undefined);
        if (isPanelVisible(editor)) {
          refreshCitations(editor, resolved, false);
        }
        return toggled;
      },

      insertCitation: (
        value?: CitationInput | CitationRecord,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor) || !value || typeof value !== 'object') return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        const inserted = insertCitation(editor, value, resolved);
        if (inserted) {
          showPanel(editor);
        }

        return inserted;
      },

      refreshCitations: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        refreshCitations(editor, resolved, true);
        showPanel(editor);
        return true;
      },

      setCitationStyle: (
        value?: CitationStyle,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || !value) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        applyStyle(editor, value, resolved);
        return true;
      },

      cycleCitationStyle: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        cycleStyle(editor, resolved);
        refreshPanel(editor);
        return true;
      },

      getCitationRecords: (
        value?: unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        const records = getOrderedCitationRecords(editor, resolved);

        if (typeof value === 'function') {
          try {
            (value as (records: CitationRecord[]) => void)(records);
          } catch {
            // Keep command deterministic if user callback fails.
          }
        }

        (editor as any).__citationRecords = records;
        editor.dispatchEvent(
          new CustomEvent('editora:citations-data', {
            bubbles: true,
            detail: {
              records,
              style: getCitationStyle(editor, resolved),
            },
          }),
        );

        return true;
      },

      setCitationsOptions: (
        value?: Partial<CitationsPluginOptions>,
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
          generateCitationId: value.generateCitationId || current.generateCitationId,
        });

        optionsByEditor.set(editor, merged);

        if (value.defaultStyle && styleOrder.includes(value.defaultStyle)) {
          styleByEditor.set(editor, value.defaultStyle);
        }

        refreshCitations(editor, merged, true);
        refreshPanel(editor);

        return true;
      },

      locateCitation: (
        value?: string,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || typeof value !== 'string') return false;
        return locateCitation(editor, value);
      },

      deleteCitation: (
        value?: string,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);

        if (typeof value === 'string' && value.trim()) {
          return removeCitationById(editor, value, resolved);
        }

        return removeCitationFromSelection(editor, resolved);
      },

      insertRecentCitation: (
        value?: string,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        const resolved = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolved);

        const current = getOrderedCitationRecords(editor, resolved);
        const recent = getRecentCitations(editor, current, resolved);
        if (recent.length === 0) return false;

        const citation =
          typeof value === 'string' && value.trim()
            ? findRecentCitation(editor, value, current, resolved)
            : recent[0];
        if (!citation) return false;

        const inserted = insertCitation(editor, citation, resolved);
        if (inserted) {
          showPanel(editor);
        }

        return inserted;
      },
    },

    keymap: {
      'Mod-Alt-Shift-c': 'toggleCitationsPanel',
      'Mod-Alt-Shift-C': 'toggleCitationsPanel',
      'Mod-Alt-Shift-b': 'refreshCitations',
      'Mod-Alt-Shift-B': 'refreshCitations',
      'Mod-Alt-Shift-j': 'cycleCitationStyle',
      'Mod-Alt-Shift-J': 'cycleCitationStyle',
    },

    init: function init(this: any, context?: { editorElement?: HTMLElement }) {
      pluginInstanceCount += 1;

      const runtimeConfig =
        this && typeof this.__pluginConfig === 'object'
          ? normalizeOptions({ ...options, ...(this.__pluginConfig as CitationsPluginOptions) })
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
      styleByEditor.set(editor, runtimeConfig.defaultStyle);
      setCommandButtonActiveState(editor, 'toggleCitationsPanel', false);

      // Keep generated bibliography/footnotes stable when content changes.
      scheduleRefresh(editor);
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
