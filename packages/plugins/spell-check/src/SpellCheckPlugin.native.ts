import { Plugin } from '@editora/core';

/**
 * Spell Check Plugin - Native Implementation
 * 
 * Features:
 * - Real-time spell checking with visual highlights (red wavy underline)
 * - Dictionary-based word validation (English words + custom dictionary)
 * - Edit distance algorithm for intelligent suggestions
 * - Right-click context menu on misspelled words with suggestions
 * - Side panel with spell check stats and misspellings list
 * - Ignore/Add to dictionary functionality
 * - Protected contexts (code, comments, merge tags, URLs, emails)
 * - Incremental spell checking with debouncing
 * - MutationObserver for automatic re-checking
 */

// ===== Core Data Structures =====

interface SpellCheckIssue {
  id: string;
  node: Text;
  startOffset: number;
  endOffset: number;
  word: string;
  suggestions: string[];
  ignored?: boolean;
}

// English dictionary with common words
const ENGLISH_DICTIONARY = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'be', 'was', 'were', 'have',
  'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'what',
  'which', 'who', 'whom', 'where', 'when', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'same', 'such', 'no',
  'nor', 'not', 'only', 'own', 'so', 'than', 'too', 'very', 'just', 'as',
  'if', 'because', 'while', 'although', 'though', 'it', 'its', 'their',
  'them', 'they', 'you', 'he', 'she', 'we', 'me', 'him', 'her', 'us', 'our',
  'i', 'my', 'your', 'his', 'hers', 'ours', 'yours', 'theirs', 'editor',
  'document', 'text', 'word', 'paragraph', 'line', 'page', 'content',
  'hello', 'world', 'test', 'example', 'sample', 'demo', 'lorem', 'ipsum'
]);

const customDictionary = new Set<string>();
const ignoredWords = new Set<string>();

// Module-level state
let isSpellCheckEnabled = false;
let mutationObserver: MutationObserver | null = null;
let debounceTimeout: number | null = null;
let sidePanelElement: HTMLElement | null = null;
let activeEditorElement: HTMLElement | null = null;
let contextMenuListener: ((e: MouseEvent) => void) | null = null;
let isContextMenuAttached = false;
let pendingToggleEditorElement: HTMLElement | null = null;
let isToggleTriggerTrackingAttached = false;
let observerSuspendDepth = 0;

const MUTATION_OBSERVER_OPTIONS: MutationObserverInit = {
  characterData: true,
  childList: true,
  subtree: true
};

const SPELLCHECK_STYLE_ID = 'rte-spellcheck-styles';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';

function consumeCommandEditorContextEditor(): HTMLElement | null {
  if (typeof window === 'undefined') return null;

  const explicitContext = (window as any)[COMMAND_EDITOR_CONTEXT_KEY] as HTMLElement | null | undefined;
  if (!(explicitContext instanceof HTMLElement)) return null;

  (window as any)[COMMAND_EDITOR_CONTEXT_KEY] = null;

  const root =
    (explicitContext.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor') as HTMLElement | null) ||
    (explicitContext.matches('[data-editora-editor], .rte-editor, .editora-editor, editora-editor')
      ? explicitContext
      : null);

  if (root) {
    const content = getEditorContentFromHost(root);
    if (content) return content;
    if (root.getAttribute('contenteditable') === 'true') return root;
  }

  if (explicitContext.getAttribute('contenteditable') === 'true') {
    return explicitContext;
  }

  const nearestEditable = explicitContext.closest('[contenteditable="true"]');
  return nearestEditable instanceof HTMLElement ? nearestEditable : null;
}

function ensureSpellCheckStyles(): void {
  let style = document.getElementById(SPELLCHECK_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = SPELLCHECK_STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = `
    .rte-spell-check-panel {
      position: absolute;
      top: 12px;
      right: 12px;
      width: min(360px, calc(100% - 24px));
      max-height: min(560px, calc(100% - 24px));
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      border: 1px solid #d7dbe3;
      background: #ffffff;
      color: #1f2937;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
      z-index: 1200;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .rte-spell-check-panel,
    .rte-spell-check-panel * {
      box-sizing: border-box;
    }

    .editora-theme-dark .rte-spell-check-panel {
      border-color: #4b5563;
      background: #1f2937;
      color: #e5e7eb;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }

    .rte-spellcheck-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px 12px;
      border-bottom: 1px solid #eceff5;
    }

    .editora-theme-dark .rte-spellcheck-header {
      border-bottom-color: #374151;
    }

    .rte-spellcheck-title {
      margin: 0;
      font-size: 15px;
      font-weight: 650;
    }

    .rte-spellcheck-subtitle {
      margin: 2px 0 0;
      font-size: 12px;
      color: #64748b;
    }

    .editora-theme-dark .rte-spellcheck-subtitle {
      color: #9ca3af;
    }

    .rte-spellcheck-close {
      appearance: none;
      border: none;
      background: transparent;
      font-size: 20px;
      line-height: 1;
      color: #6b7280;
      cursor: pointer;
      border-radius: 8px;
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
    }

    .rte-spellcheck-close:hover {
      background: rgba(15, 23, 42, 0.06);
      color: #0f172a;
    }

    .editora-theme-dark .rte-spellcheck-close {
      color: #9ca3af;
    }

    .editora-theme-dark .rte-spellcheck-close:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #f3f4f6;
    }

    .rte-spellcheck-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid #eceff5;
    }

    .editora-theme-dark .rte-spellcheck-stats {
      border-bottom-color: #374151;
    }

    .rte-spellcheck-stat {
      border-radius: 10px;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      padding: 8px 10px;
      display: grid;
      gap: 2px;
    }

    .editora-theme-dark .rte-spellcheck-stat {
      background: #111827;
      border-color: #374151;
    }

    .rte-spellcheck-stat-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .editora-theme-dark .rte-spellcheck-stat-label {
      color: #9ca3af;
    }

    .rte-spellcheck-stat-value {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
    }

    .editora-theme-dark .rte-spellcheck-stat-value {
      color: #f3f4f6;
    }

    .rte-spellcheck-list {
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      padding: 10px 12px 12px;
      display: grid;
      gap: 8px;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }

    .rte-spellcheck-list::-webkit-scrollbar {
      width: 10px;
    }

    .rte-spellcheck-list::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 999px;
    }

    .rte-spellcheck-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 999px;
      border: 2px solid #f1f5f9;
    }

    .rte-spellcheck-list::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .rte-spellcheck-empty {
      padding: 18px 14px;
      text-align: center;
      color: #64748b;
      font-size: 13px;
      border-radius: 10px;
      border: 1px dashed #d1d5db;
      background: #f8fafc;
    }

    .editora-theme-dark .rte-spellcheck-empty {
      color: #9ca3af;
      border-color: #4b5563;
      background: #111827;
    }

    .editora-theme-dark .rte-spellcheck-list {
      scrollbar-color: #4b5563 #1f2937;
    }

    .editora-theme-dark .rte-spellcheck-list::-webkit-scrollbar-track {
      background: #1f2937;
    }

    .editora-theme-dark .rte-spellcheck-list::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-color: #1f2937;
    }

    .editora-theme-dark .rte-spellcheck-list::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }

    .rte-spellcheck-item {
      border-radius: 10px;
      border: 1px solid #e5e7eb;
      background: #f8fafc;
      overflow: visible;
    }

    .editora-theme-dark .rte-spellcheck-item {
      border-color: #4b5563;
      background: #111827;
    }

    .rte-spell-check-panel .rte-spellcheck-word-header {
      all: unset;
      width: 100%;
      padding: 10px 11px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      cursor: pointer;
      text-align: left;
      color: #111827;
      font-size: 14px;
      line-height: 1.35;
      user-select: none;
      opacity: 1;
      visibility: visible;
    }

    .rte-spell-check-panel .rte-spellcheck-word {
      font-weight: 700;
      color: #c62828;
      word-break: break-word;
      flex: 1;
      opacity: 1;
      visibility: visible;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-word-header {
      color: #e5e7eb !important;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-word {
      color: #f87171 !important;
    }

    .rte-spell-check-panel .rte-spellcheck-caret {
      color: #64748b;
      font-size: 12px;
      min-width: 12px;
      text-align: right;
      opacity: 1;
      visibility: visible;
    }

    .rte-spell-check-panel .rte-spellcheck-suggestions {
      display: none;
      border-top: 1px solid #e5e7eb;
      padding: 9px 11px 11px;
      color: #334155;
      font-size: 12px;
      line-height: 1.4;
      opacity: 1;
      visibility: visible;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-suggestions {
      border-top-color: #374151;
      color: #d1d5db !important;
    }

    .rte-spell-check-panel .rte-spellcheck-suggestions.show {
      display: block;
    }

    .rte-spell-check-panel .rte-spellcheck-actions {
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .rte-spell-check-panel .rte-spellcheck-btn {
      all: unset;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      background: #fff;
      color: #1f2937;
      font-size: 12px;
      font-weight: 550;
      padding: 5px 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      opacity: 1;
      visibility: visible;
    }

    .rte-spell-check-panel .rte-spellcheck-btn:hover {
      background: #f3f4f6;
    }

    .rte-spell-check-panel .rte-spellcheck-btn.primary {
      border-color: #2563eb;
      background: #2563eb;
      color: #fff;
    }

    .rte-spell-check-panel .rte-spellcheck-btn.primary:hover {
      background: #1d4ed8;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-btn {
      border-color: #4b5563;
      background: #1f2937;
      color: #f3f4f6 !important;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-btn:hover {
      background: #374151;
    }

    .editora-theme-dark .rte-spell-check-panel .rte-spellcheck-btn.primary {
      border-color: #60a5fa;
      background: #2563eb;
      color: #fff;
    }

    .rte-spellcheck-menu {
      position: fixed;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 10px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.2);
      z-index: 1300;
      padding: 6px 0;
      min-width: 180px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      color: #111827;
    }

    .rte-spellcheck-menu-item {
      padding: 8px 14px;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .rte-spellcheck-menu-item:hover {
      background: #f3f4f6;
    }

    .rte-spellcheck-menu-item.meta {
      color: #64748b;
    }

    .rte-spellcheck-menu-item.positive {
      color: #1d4ed8;
    }

    .editora-theme-dark .rte-spellcheck-menu {
      background: #1f2937;
      border-color: #4b5563;
      color: #e5e7eb;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
    }

    .editora-theme-dark .rte-spellcheck-menu-item:hover {
      background: #374151;
    }

    .editora-theme-dark .rte-spellcheck-menu-item.meta {
      color: #9ca3af;
    }

    .editora-theme-dark .rte-spellcheck-menu-item.positive {
      color: #93c5fd;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel {
      border-color: #4b5563;
      background: #1f2937;
      color: #e5e7eb;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-header {
      border-bottom-color: #374151;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-subtitle {
      color: #9ca3af;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-item {
      border-color: #4b5563;
      background: #111827;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-list {
      scrollbar-color: #4b5563 #1f2937;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-list::-webkit-scrollbar-track {
      background: #1f2937;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-list::-webkit-scrollbar-thumb {
      background: #4b5563;
      border-color: #1f2937;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-list::-webkit-scrollbar-thumb:hover {
      background: #64748b;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-word-header {
      color: #e5e7eb !important;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-word {
      color: #f87171 !important;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-suggestions {
      border-top-color: #374151;
      color: #d1d5db !important;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-btn {
      border-color: #4b5563;
      background: #1f2937;
      color: #f3f4f6 !important;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-btn:hover {
      background: #374151;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spell-check-panel .rte-spellcheck-btn.primary {
      border-color: #60a5fa;
      background: #2563eb;
      color: #fff;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-menu {
      background: #1f2937;
      border-color: #4b5563;
      color: #e5e7eb;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-menu-item:hover {
      background: #374151;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-menu-item.meta {
      color: #9ca3af;
    }

    :is([theme="dark"], [data-theme="dark"], .dark, .editora-theme-dark) .rte-spellcheck-menu-item.positive {
      color: #93c5fd;
    }
  `;
}

function getSpellcheckEditor(): HTMLElement | null {
  if (activeEditorElement && document.contains(activeEditorElement)) {
    return activeEditorElement;
  }
  const resolved = findActiveEditor();
  if (resolved) activeEditorElement = resolved;
  return resolved;
}

function setActiveEditorFromNode(node: Node | null): void {
  if (!node) return;
  const element = (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement) as HTMLElement | null;
  const editor = element?.closest('[contenteditable="true"]') as HTMLElement | null;
  if (editor) {
    activeEditorElement = editor;
  }
}

function getEditorContentFromHost(host: Element | null): HTMLElement | null {
  if (!host) return null;
  const content = host.querySelector('[contenteditable="true"]');
  return content instanceof HTMLElement ? content : null;
}

function attachToggleTriggerTracking(): void {
  if (isToggleTriggerTrackingAttached) return;

  const handler = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const trigger = target.closest(
      '.editora-toolbar-button[data-command="toggleSpellCheck"], .rte-toolbar-button[data-command="toggleSpellCheck"]'
    ) as HTMLElement | null;
    if (!trigger) return;

    const host = trigger.closest('[data-editora-editor]');
    const editor = getEditorContentFromHost(host);
    if (editor) {
      pendingToggleEditorElement = editor;
      activeEditorElement = editor;
    }
  };

  document.addEventListener('pointerdown', handler, true);
  isToggleTriggerTrackingAttached = true;
}

function resolveEditorForSpellCheckToggle(): HTMLElement | null {
  const explicitContextEditor = consumeCommandEditorContextEditor();
  if (explicitContextEditor && document.contains(explicitContextEditor)) {
    activeEditorElement = explicitContextEditor;
    pendingToggleEditorElement = null;
    return explicitContextEditor;
  }

  if (pendingToggleEditorElement && document.contains(pendingToggleEditorElement)) {
    const editor = pendingToggleEditorElement;
    pendingToggleEditorElement = null;
    activeEditorElement = editor;
    return editor;
  }
  return findActiveEditor();
}

function suspendMutationObserver(): void {
  observerSuspendDepth += 1;
  if (observerSuspendDepth === 1 && mutationObserver) {
    mutationObserver.disconnect();
  }
}

function resumeMutationObserver(): void {
  if (observerSuspendDepth === 0) return;
  observerSuspendDepth -= 1;
  if (observerSuspendDepth > 0) return;
  if (!mutationObserver) return;

  const editor = getSpellcheckEditor();
  if (editor) {
    mutationObserver.observe(editor, MUTATION_OBSERVER_OPTIONS);
  }
}

function runWithObserverSuspended<T>(operation: () => T): T {
  suspendMutationObserver();
  try {
    return operation();
  } finally {
    resumeMutationObserver();
  }
}

// Load custom dictionary from localStorage
const loadCustomDictionary = () => {
  try {
    const saved = localStorage.getItem('rte-custom-dictionary');
    if (saved) {
      const words = JSON.parse(saved) as string[];
      words.forEach(word => customDictionary.add(word.toLowerCase()));
    }
  } catch (e) {
    console.warn('Failed to load custom dictionary:', e);
  }
};

// Save custom dictionary to localStorage
const saveCustomDictionary = () => {
  try {
    const words = Array.from(customDictionary);
    localStorage.setItem('rte-custom-dictionary', JSON.stringify(words));
  } catch (e) {
    console.warn('Failed to save custom dictionary:', e);
  }
};

// ===== Spell Check Engine =====

/**
 * Edit distance algorithm (Levenshtein distance) for suggestions
 */
function editDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Check if word is in dictionary
 */
function checkWord(word: string): boolean {
  const w = word.toLowerCase();
  return ENGLISH_DICTIONARY.has(w) || customDictionary.has(w) || ignoredWords.has(w);
}

/**
 * Get spelling suggestions using edit distance
 */
function getSuggestions(word: string, maxSuggestions = 5): string[] {
  const wordLower = word.toLowerCase();
  const words = Array.from(ENGLISH_DICTIONARY);
  const distances = words.map(w => ({ word: w, distance: editDistance(wordLower, w) }));
  distances.sort((a, b) => a.distance - b.distance);
  return distances.filter(d => d.distance <= 3).slice(0, maxSuggestions).map(d => d.word);
}

/**
 * Check if a node is in a protected context (code, comments, etc.)
 */
function isProtected(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const el = node as HTMLElement;
  if (
    el.closest('code, pre, [contenteditable="false"], .rte-widget, .rte-template, .rte-comment, .rte-merge-tag') ||
    el.hasAttribute('data-comment-id') ||
    el.hasAttribute('data-template') ||
    el.hasAttribute('data-merge-tag')
  ) return true;
  return false;
}

/**
 * Tokenize a text node and find misspellings
 */
function tokenizeTextNode(node: Text): SpellCheckIssue[] {
  const issues: SpellCheckIssue[] = [];
  const wordRegex = /([\p{L}\p{M}\p{N}\p{Emoji_Presentation}\u200d'-]+|[\uD800-\uDBFF][\uDC00-\uDFFF])/gu;
  let match;
  
  while ((match = wordRegex.exec(node.data)) !== null) {
    const word = match[0];
    const start = match.index;
    const end = start + word.length;
    
    // Skip URLs, emails, merge tags, and numbers
    if (/https?:\/\//.test(word) || /@/.test(word) || /\{\{.*\}\}/.test(word) || /^\d+$/.test(word)) continue;
    
    // Skip already correct words
    if (checkWord(word)) continue;
    
    // Skip camelCase, hyphenated words, and proper nouns (capitalized)
    if (/[a-z][A-Z]/.test(word) || /-/.test(word) || (word[0] === word[0].toUpperCase() && word.length > 1)) continue;
    
    issues.push({
      id: `${word}-${start}`,
      node,
      startOffset: start,
      endOffset: end,
      word,
      suggestions: getSuggestions(word),
      ignored: false
    });
  }
  
  return issues;
}

/**
 * Find the active editor element
 */
const findActiveEditor = (): HTMLElement | null => {
  const explicitContextEditor = consumeCommandEditorContextEditor();
  if (explicitContextEditor && document.contains(explicitContextEditor)) {
    activeEditorElement = explicitContextEditor;
    return explicitContextEditor;
  }

  // Try to find editor from current selection
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let node: Node | null = selection.getRangeAt(0).startContainer;
    while (node && node !== document.body) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.getAttribute('contenteditable') === 'true') {
          return element;
        }
      }
      node = node.parentNode;
    }
  }
  
  // Try active element
  const activeElement = document.activeElement;
  if (activeElement) {
    if (activeElement.getAttribute('contenteditable') === 'true') {
      return activeElement as HTMLElement;
    }
    const editor = activeElement.closest('[contenteditable="true"]');
    if (editor) return editor as HTMLElement;

    // If focus is on toolbar controls, resolve the editor inside the same host.
    const hostEditor = activeElement.closest('[data-editora-editor]');
    if (hostEditor) {
      const content = hostEditor.querySelector('[contenteditable="true"]');
      if (content) return content as HTMLElement;
    }
  }
  
  // Fallback to first editor
  return document.querySelector('[contenteditable="true"]');
};

/**
 * Scan entire document for misspellings
 */
function scanDocumentForMisspellings(): SpellCheckIssue[] {
  const editor = getSpellcheckEditor();
  if (!editor) return [];
  
  const issues: SpellCheckIssue[] = [];
  const walker = document.createTreeWalker(
    editor,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentNode && isProtected(node.parentNode)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  let textNode = walker.nextNode() as Text;
  while (textNode) {
    issues.push(...tokenizeTextNode(textNode));
    textNode = walker.nextNode() as Text;
  }
  
  return issues;
}

/**
 * Highlight misspelled words with red wavy underline
 */
function highlightMisspelledWords(issues?: SpellCheckIssue[]): void {
  const editor = getSpellcheckEditor();
  if (!editor) return;

  if (!issues) issues = scanDocumentForMisspellings();

  runWithObserverSuspended(() => {
    // Clear existing highlights
    editor.querySelectorAll('.rte-misspelled').forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      }
    });

    // Add new highlights
    issues!.forEach(issue => {
      if (ignoredWords.has(issue.word.toLowerCase())) return;

      // Defensive check: ensure offsets are within bounds
      const nodeLength = issue.node.data.length;
      if (
        issue.startOffset < 0 ||
        issue.endOffset > nodeLength ||
        issue.startOffset >= issue.endOffset
      ) {
        return;
      }

      try {
        const range = document.createRange();
        range.setStart(issue.node, issue.startOffset);
        range.setEnd(issue.node, issue.endOffset);

        const span = document.createElement('span');
        span.className = 'rte-misspelled';
        span.setAttribute('data-word', issue.word);
        span.setAttribute('data-suggestions', issue.suggestions.join(','));
        span.setAttribute('title', `Suggestions: ${issue.suggestions.join(', ')}`);
        span.style.borderBottom = '2px wavy red';
        span.style.cursor = 'pointer';

        range.surroundContents(span);
      } catch (e) {
        // Skip if range surroundContents fails
      }
    });
  });
  
  // Update side panel with precomputed issues to avoid an extra scan
  updateSidePanel(issues);
}

/**
 * Clear all spell check highlights
 */
function clearSpellCheckHighlights(): void {
  const editor = getSpellcheckEditor();
  if (!editor) return;

  runWithObserverSuspended(() => {
    editor.querySelectorAll('.rte-misspelled').forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      }
    });
  });
}

/**
 * Replace a misspelled word with a suggestion
 */
function replaceWord(issue: SpellCheckIssue, replacement: string): void {
  runWithObserverSuspended(() => {
    const range = document.createRange();
    range.setStart(issue.node, issue.startOffset);
    range.setEnd(issue.node, issue.endOffset);

    const textNode = document.createTextNode(replacement);
    range.deleteContents();
    range.insertNode(textNode);
  });
}

/**
 * Ignore a word (session only)
 */
function ignoreWord(word: string): void {
  ignoredWords.add(word.toLowerCase());
  clearSpellCheckHighlights();
  highlightMisspelledWords();
}

/**
 * Add word to custom dictionary (persistent)
 */
function addToDictionary(word: string): void {
  customDictionary.add(word.toLowerCase());
  saveCustomDictionary(); // Save to localStorage
  clearSpellCheckHighlights();
  highlightMisspelledWords();
}

/**
 * Get spell check statistics
 */
function getSpellCheckStats(issues?: SpellCheckIssue[]): { total: number; misspelled: number; accuracy: number } {
  const editor = getSpellcheckEditor();
  if (!editor) return { total: 0, misspelled: 0, accuracy: 100 };
  
  // Use provided issues or scan if not provided
  if (!issues) {
    issues = scanDocumentForMisspellings();
  }
  const misspelled = issues.filter(i => !ignoredWords.has(i.word.toLowerCase())).length;
  
  // Count total words
  const text = editor.textContent || '';
  const words = text.match(/[\p{L}\p{M}\p{N}]+/gu) || [];
  const total = words.length;
  
  return {
    total,
    misspelled,
    accuracy: total > 0 ? ((total - misspelled) / total) * 100 : 100
  };
}

function replaceMisspelledTarget(target: HTMLElement, replacement: string): void {
  const textNode = document.createTextNode(replacement);
  target.replaceWith(textNode);
}

function ignoreMisspelledTargetOnce(target: HTMLElement): void {
  target.classList.remove('rte-misspelled');
  target.removeAttribute('data-word');
  target.removeAttribute('data-suggestions');
  target.removeAttribute('title');
  target.style.borderBottom = '';
  target.style.cursor = '';
}

// ===== Context Menu =====

/**
 * Show context menu for misspelled word
 */
function showSpellCheckContextMenu(x: number, y: number, word: string, suggestions: string[], target: HTMLElement): void {
  setActiveEditorFromNode(target);

  // Remove existing menus
  document.querySelectorAll('.rte-spellcheck-menu').forEach(el => el.remove());
  
  const menu = document.createElement('div');
  menu.className = 'rte-spellcheck-menu';
  
  // Add suggestions
  suggestions.slice(0, 5).forEach(suggestion => {
    const item = document.createElement('div');
    item.className = 'rte-spellcheck-menu-item';
    item.textContent = suggestion;
    item.onclick = () => {
      replaceMisspelledTarget(target, suggestion);
      window.setTimeout(() => {
        if (isSpellCheckEnabled) {
          highlightMisspelledWords();
          updateSidePanel();
        }
      }, 0);
      menu.remove();
    };
    menu.appendChild(item);
  });
  
  // Separator
  if (suggestions.length > 0) {
    const separator = document.createElement('div');
    separator.style.cssText = 'height: 1px; background: #ddd; margin: 4px 0;';
    menu.appendChild(separator);
  }
  
  // Ignore Once
  const ignoreOnce = document.createElement('div');
  ignoreOnce.className = 'rte-spellcheck-menu-item meta';
  ignoreOnce.textContent = 'Ignore Once';
  ignoreOnce.onclick = () => {
    ignoreMisspelledTargetOnce(target);
    menu.remove();
  };
  menu.appendChild(ignoreOnce);
  
  // Ignore All
  const ignoreAll = document.createElement('div');
  ignoreAll.className = 'rte-spellcheck-menu-item meta';
  ignoreAll.textContent = 'Ignore All';
  ignoreAll.onclick = () => {
    ignoreWord(word);
    menu.remove();
  };
  menu.appendChild(ignoreAll);
  
  // Add to Dictionary
  const addToDict = document.createElement('div');
  addToDict.className = 'rte-spellcheck-menu-item positive';
  addToDict.textContent = 'Add to Dictionary';
  addToDict.onclick = () => {
    addToDictionary(word);
    menu.remove();
  };
  menu.appendChild(addToDict);
  
  document.body.appendChild(menu);

  const menuRect = menu.getBoundingClientRect();
  const maxLeft = window.innerWidth - menuRect.width - 8;
  const maxTop = window.innerHeight - menuRect.height - 8;
  menu.style.left = `${Math.max(8, Math.min(x, maxLeft))}px`;
  menu.style.top = `${Math.max(8, Math.min(y, maxTop))}px`;
  
  // Close on click outside
  const dismiss = (ev: MouseEvent) => {
    if (!menu.contains(ev.target as Node)) {
      menu.remove();
      document.removeEventListener('mousedown', dismiss);
    }
  };
  setTimeout(() => document.addEventListener('mousedown', dismiss), 0);
}

/**
 * Attach context menu to document
 */
function attachSpellCheckContextMenu(): void {
  if (isContextMenuAttached) return;

  contextMenuListener = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains('rte-misspelled')) {
      e.preventDefault();
      setActiveEditorFromNode(target);
      const word = target.getAttribute('data-word')!;
      const suggestions = (target.getAttribute('data-suggestions') || '').split(',').filter(s => s);
      showSpellCheckContextMenu(e.clientX, e.clientY, word, suggestions, target);
    }
  };

  document.addEventListener('contextmenu', contextMenuListener);
  isContextMenuAttached = true;
}

function detachSpellCheckContextMenu(): void {
  if (!isContextMenuAttached || !contextMenuListener) return;
  document.removeEventListener('contextmenu', contextMenuListener);
  contextMenuListener = null;
  isContextMenuAttached = false;
}

// ===== Side Panel =====

function getEditorHost(editor: HTMLElement): HTMLElement {
  const host = editor.closest('[data-editora-editor]') as HTMLElement | null;
  return host || editor.parentElement || editor;
}

/**
 * Create and show side panel
 */
function createSidePanel(): HTMLElement {
  const editor = getSpellcheckEditor();
  if (!editor) {
    throw new Error('Spell check panel requested without active editor');
  }

  const host = getEditorHost(editor);
  ensureSpellCheckStyles();

  const panel = document.createElement('div');
  panel.className = 'rte-spell-check-panel';

  const computedHostStyle = window.getComputedStyle(host);
  if (computedHostStyle.position === 'static') {
    host.style.position = 'relative';
  }

  host.appendChild(panel);
  return panel;
}

/**
 * Update side panel content
 */
function updateSidePanel(precomputedIssues?: SpellCheckIssue[]): void {
  if (!sidePanelElement) return;
  
  const issues = precomputedIssues || scanDocumentForMisspellings();
  const stats = getSpellCheckStats(issues); // Pass issues to avoid duplicate scan
  
  sidePanelElement.innerHTML = `
    <div class="rte-spellcheck-header">
      <div>
        <h3 class="rte-spellcheck-title">Spell Check</h3>
        <p class="rte-spellcheck-subtitle">Review suggestions and resolve issues quickly</p>
      </div>
      <button class="rte-spellcheck-close" aria-label="Close spell check panel">✕</button>
    </div>
    
    <div class="rte-spellcheck-stats">
      <div class="rte-spellcheck-stat">
        <span class="rte-spellcheck-stat-label">Total</span>
        <strong class="rte-spellcheck-stat-value">${stats.total}</strong>
      </div>
      <div class="rte-spellcheck-stat">
        <span class="rte-spellcheck-stat-label">Misspelled</span>
        <strong class="rte-spellcheck-stat-value">${stats.misspelled}</strong>
      </div>
      <div class="rte-spellcheck-stat">
        <span class="rte-spellcheck-stat-label">Accuracy</span>
        <strong class="rte-spellcheck-stat-value">${stats.accuracy.toFixed(1)}%</strong>
      </div>
    </div>
    
    <div class="rte-spellcheck-list">
      ${issues.length === 0 
        ? '<div class="rte-spellcheck-empty">No spelling errors found in this editor.</div>'
        : issues.map((issue, idx) => `
            <div class="rte-spellcheck-item" data-word="${issue.word}" data-index="${idx}">
              <button class="rte-spellcheck-word-header" type="button">
                <span class="rte-spellcheck-word">${issue.word}</span>
                <span class="rte-spellcheck-caret">▶</span>
              </button>
              <div class="rte-spellcheck-suggestions">
                ${issue.suggestions.length > 0 
                  ? `<div class="rte-spellcheck-actions">
                       ${issue.suggestions.map(s => `<button class="rte-spellcheck-btn primary suggestion-btn" data-suggestion="${s}" type="button">${s}</button>`).join('')}
                     </div>`
                  : '<div class="rte-spellcheck-subtitle">No suggestions available</div>'
                }
                <div class="rte-spellcheck-actions">
                  <button class="rte-spellcheck-btn ignore-btn" type="button">Ignore</button>
                  <button class="rte-spellcheck-btn add-btn" type="button">Add to Dictionary</button>
                </div>
              </div>
            </div>
          `).join('')
      }
    </div>
  `;
  
  // Event listeners
  const closeBtn = sidePanelElement.querySelector('.rte-spellcheck-close');
  closeBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    disableSpellCheck();
  });
  
  // Toggle expand/collapse
  sidePanelElement.querySelectorAll('.rte-spellcheck-word-header').forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.closest('.rte-spellcheck-item');
      const suggestions = item?.querySelector('.rte-spellcheck-suggestions') as HTMLElement;
      const expandBtn = header.querySelector('.rte-spellcheck-caret');
      if (suggestions && expandBtn) {
        if (!suggestions.classList.contains('show')) {
          suggestions.classList.add('show');
          expandBtn.textContent = '▼';
        } else {
          suggestions.classList.remove('show');
          expandBtn.textContent = '▶';
        }
      }
    });
  });
  
  // Suggestion buttons
  sidePanelElement.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const suggestion = btn.getAttribute('data-suggestion')!;
      const item = btn.closest('.rte-spellcheck-item');
      const word = item?.getAttribute('data-word')!;
      const issueIndex = parseInt(item?.getAttribute('data-index') || '0');
      
      if (issues[issueIndex]) {
        replaceWord(issues[issueIndex], suggestion);
        highlightMisspelledWords();
      }
    });
  });
  
  // Ignore buttons
  sidePanelElement.querySelectorAll('.ignore-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.rte-spellcheck-item');
      const word = item?.getAttribute('data-word')!;
      ignoreWord(word);
    });
  });
  
  // Add to dictionary buttons
  sidePanelElement.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.rte-spellcheck-item');
      const word = item?.getAttribute('data-word')!;
      addToDictionary(word);
    });
  });
}

// ===== MutationObserver for incremental spell check =====

function startMutationObserver(): void {
  const editor = getSpellcheckEditor();
  if (!editor) return;
  
  if (mutationObserver) mutationObserver.disconnect();
  
  mutationObserver = new MutationObserver((mutations) => {
    if (observerSuspendDepth > 0) return;

    // Only trigger on text/content changes
    if (mutations.some(m => m.type === 'characterData' || m.type === 'childList')) {
      // Debounce the highlight function
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = window.setTimeout(() => {
        if (isSpellCheckEnabled) {
          highlightMisspelledWords();
        }
      }, 350);
    }
  });
  
  mutationObserver.observe(editor, {
    ...MUTATION_OBSERVER_OPTIONS
  });
}

function stopMutationObserver(): void {
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
    debounceTimeout = null;
  }
}

function removeSpellcheckMenus(): void {
  document.querySelectorAll('.rte-spellcheck-menu').forEach(el => el.remove());
}

function disableSpellCheck(): boolean {
  if (!isSpellCheckEnabled) return false;

  clearSpellCheckHighlights();
  stopMutationObserver();
  detachSpellCheckContextMenu();
  removeSpellcheckMenus();

  if (sidePanelElement) {
    sidePanelElement.remove();
    sidePanelElement = null;
  }

  activeEditorElement = null;
  pendingToggleEditorElement = null;
  isSpellCheckEnabled = false;
  return false;
}

// ===== Main Toggle Function =====

function toggleSpellCheck(): boolean {
  const targetEditor = resolveEditorForSpellCheckToggle();
  if (!targetEditor) return false;

  // If spell check is already enabled on another editor, switch instance
  // in one action instead of forcing disable + enable.
  if (isSpellCheckEnabled && activeEditorElement && activeEditorElement !== targetEditor) {
    clearSpellCheckHighlights();
    stopMutationObserver();
    removeSpellcheckMenus();

    if (sidePanelElement) {
      sidePanelElement.remove();
      sidePanelElement = null;
    }

    activeEditorElement = targetEditor;
    ensureSpellCheckStyles();
    attachSpellCheckContextMenu();
    highlightMisspelledWords();
    startMutationObserver();
    sidePanelElement = createSidePanel();
    updateSidePanel();
    return true;
  }

  // Toggle off when already enabled on the same editor
  if (isSpellCheckEnabled) {
    return disableSpellCheck();
  }

  // Enable on resolved target editor
  activeEditorElement = targetEditor;
  isSpellCheckEnabled = true;
  ensureSpellCheckStyles();
  attachSpellCheckContextMenu();
  highlightMisspelledWords();
  startMutationObserver();

  if (sidePanelElement) {
    sidePanelElement.remove();
    sidePanelElement = null;
  }
  sidePanelElement = createSidePanel();
  updateSidePanel();
  return true;
}

// ===== Plugin Export =====

export const SpellCheckPlugin = (): Plugin => ({
  name: 'spellCheck',
  
  init: () => {
    // Load custom dictionary from localStorage on plugin initialization
    loadCustomDictionary();
    attachToggleTriggerTracking();
  },
  
  toolbar: [
    {
      label: 'Spell Check',
      command: 'toggleSpellCheck',
      icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 12.5L3.84375 9.5M3.84375 9.5L5 5.38889C5 5.38889 5.25 4.5 6 4.5C6.75 4.5 7 5.38889 7 5.38889L8.15625 9.5M3.84375 9.5H8.15625M9 12.5L8.15625 9.5M13 16.8333L15.4615 19.5L21 13.5M12 8.5H15C16.1046 8.5 17 7.60457 17 6.5C17 5.39543 16.1046 4.5 15 4.5H12V8.5ZM12 8.5H16C17.1046 8.5 18 9.39543 18 10.5C18 11.6046 17.1046 12.5 16 12.5H12V8.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
      shortcut: 'F7'
    }
  ],
  
  commands: {
    toggleSpellCheck: () => {
      toggleSpellCheck();
      return true;
    }
  },
  
  keymap: {
    'F7': 'toggleSpellCheck'
  }
});
