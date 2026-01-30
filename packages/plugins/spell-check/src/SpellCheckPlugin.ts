// --- Clean, modern DOM-based spell check engine and API ---
import { Plugin } from '@editora/core';
import { SpellCheckPluginProvider } from './SpellCheckPluginProvider';

export interface SpellCheckIssue {
  id: string;
  node: Text;
  startOffset: number;
  endOffset: number;
  word: string;
  suggestions: string[];
  ignored?: boolean;
}

export interface DictionaryProvider {
  check(word: string, lang: string): boolean;
  suggest(word: string, lang: string): string[];
  add?(word: string, lang: string): void;
}

const ENGLISH_DICTIONARY = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'be', 'was', 'were', 'have',
  'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'what',
  'which', 'who', 'whom', 'where', 'when', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'same', 'such', 'no',
  'nor', 'not', 'only', 'own', 'so', 'than', 'too', 'very', 'just', 'as',
  'if', 'because', 'as', 'while', 'although', 'though', 'it', 'its', 'their',
  'them', 'they', 'you', 'he', 'she', 'we', 'me', 'him', 'her', 'us', 'our',
  'i', 'my', 'your', 'his', 'hers', 'ours', 'yours', 'theirs', 'editor',
  'document', 'text', 'word', 'paragraph', 'line', 'page', 'content',
  'hello', 'world', 'test', 'example', 'sample', 'demo', 'lorem', 'ipsum'
]);
const customDictionary = new Set<string>();
const ignoredWords = new Set<string>();

export const DefaultDictionaryProvider: DictionaryProvider = {
  check(word: string, lang: string) {
    const w = word.toLowerCase();
    return ENGLISH_DICTIONARY.has(w) || customDictionary.has(w) || ignoredWords.has(w);
  },
  suggest(word: string, lang: string) {
    const wordLower = word.toLowerCase();
    const words = Array.from(ENGLISH_DICTIONARY);
    const distances = words.map(w => ({ word: w, distance: editDistance(wordLower, w) }));
    distances.sort((a, b) => a.distance - b.distance);
    return distances.filter(d => d.distance <= 3).slice(0, 5).map(d => d.word);
  },
  add(word: string, lang: string) {
    customDictionary.add(word.toLowerCase());
  }
};

function editDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(
        matrix[i - 1][j - 1] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j] + 1
      );
    }
  }
  return matrix[b.length][a.length];
}

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

export function tokenizeTextNode(node: Text, lang: string, dict: DictionaryProvider): SpellCheckIssue[] {
  const issues: SpellCheckIssue[] = [];
  const wordRegex = /([\p{L}\p{M}\p{N}\p{Emoji_Presentation}\u200d'-]+|[\uD800-\uDBFF][\uDC00-\uDFFF])/gu;
  let match;
  while ((match = wordRegex.exec(node.data)) !== null) {
    const word = match[0];
    const start = match.index;
    const end = start + word.length;
    if (/https?:\/\//.test(word) || /@/.test(word) || /\{\{.*\}\}/.test(word) || /\d/.test(word)) continue;
    if (dict.check(word, lang)) continue;
    if (/[a-z][A-Z]/.test(word) || /-/.test(word) || (word[0] === word[0].toUpperCase() && word.length > 1)) continue;
    issues.push({
      id: `${word}-${start}`,
      node,
      startOffset: start,
      endOffset: end,
      word,
      suggestions: dict.suggest(word, lang),
      ignored: false
    });
  }
  return issues;
}

export function scanDocumentForMisspellings(options?: { lang?: string; dict?: DictionaryProvider; viewportOnly?: boolean }): SpellCheckIssue[] {
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor) return [];
  const lang = options?.lang || editor.getAttribute('lang') || 'en';
  const dict = options?.dict || DefaultDictionaryProvider;
  const issues: SpellCheckIssue[] = [];
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.data.trim()) return NodeFilter.FILTER_REJECT;
      if (isProtected(node.parentNode!)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let textNode: Text | null = walker.nextNode() as Text;
  while (textNode) {
    issues.push(...tokenizeTextNode(textNode, lang, dict));
    textNode = walker.nextNode() as Text;
  }
  return issues;
}

export function highlightMisspelledWords(issues?: SpellCheckIssue[]) {
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor) return;
  if (!issues) issues = scanDocumentForMisspellings();
  editor.querySelectorAll('.rte-misspelled').forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    }
  });
  issues.forEach(issue => {
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
    const range = document.createRange();
    range.setStart(issue.node, issue.startOffset);
    range.setEnd(issue.node, issue.endOffset);
    const span = document.createElement('span');
    span.className = 'rte-misspelled';
    span.setAttribute('data-word', issue.word);
    span.setAttribute('data-suggestions', issue.suggestions.join(','));
    span.setAttribute('title', `Suggestions: ${issue.suggestions.join(', ')}`);
    span.style.borderBottom = '2px wavy red';
    range.surroundContents(span);
  });
}

export function clearSpellCheckHighlights() {
  const editor = document.querySelector('[contenteditable="true"]');
  if (!editor) return;
  editor.querySelectorAll('.rte-misspelled').forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    }
  });
}

export function replaceWord(issue: SpellCheckIssue, replacement: string) {
  const range = document.createRange();
  range.setStart(issue.node, issue.startOffset);
  range.setEnd(issue.node, issue.endOffset);
  const sel = window.getSelection();
  const active = sel && sel.rangeCount > 0 && sel.getRangeAt(0).intersectsNode(issue.node);
  const textNode = document.createTextNode(replacement);
  range.deleteContents();
  range.insertNode(textNode);
  if (active) {
    const after = document.createRange();
    after.setStartAfter(textNode);
    after.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(after);
  }
}

export function ignoreWord(word: string) {
  ignoredWords.add(word.toLowerCase());
}
export function addToDictionary(word: string) {
  customDictionary.add(word.toLowerCase());
}

export function getSuggestions(word: string, maxSuggestions = 5): string[] {
  return DefaultDictionaryProvider.suggest(word, 'en').slice(0, maxSuggestions);
}

export function getSpellCheckStats(): { total: number; misspelled: number; accuracy: number } {
  const issues = scanDocumentForMisspellings();
  const total = issues.length;
  const misspelled = issues.filter(i => !i.ignored).length;
  return {
    total,
    misspelled,
    accuracy: total > 0 ? ((total - misspelled) / total) * 100 : 100
  };
}

export function attachSpellCheckContextMenu() {
  document.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains('rte-misspelled')) {
      e.preventDefault();
      const word = target.getAttribute('data-word')!;
      const suggestions = (target.getAttribute('data-suggestions') || '').split(',');
      showSpellCheckContextMenu(e.clientX, e.clientY, word, suggestions, target);
    }
  });
}

function showSpellCheckContextMenu(x: number, y: number, word: string, suggestions: string[], target: HTMLElement) {
  document.querySelectorAll('.rte-spellcheck-menu').forEach(el => el.remove());
  const menu = document.createElement('div');
  menu.className = 'rte-spellcheck-menu';
  menu.style.position = 'fixed';
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.background = '#fff';
  menu.style.border = '1px solid #ccc';
  menu.style.zIndex = '99999';
  menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  menu.style.padding = '4px 0';
  menu.style.minWidth = '160px';
  suggestions.slice(0, 5).forEach(suggestion => {
    const item = document.createElement('div');
    item.className = 'rte-spellcheck-menu-item';
    item.textContent = suggestion;
    item.style.padding = '6px 16px';
    item.style.cursor = 'pointer';
    item.onclick = () => {
      const issue = findIssueForElement(target);
      if (issue) replaceWord(issue, suggestion);
      clearSpellCheckHighlights();
      highlightMisspelledWords();
      menu.remove();
    };
    menu.appendChild(item);
  });
  const ignoreOnce = document.createElement('div');
  ignoreOnce.className = 'rte-spellcheck-menu-item';
  ignoreOnce.textContent = 'Ignore Once';
  ignoreOnce.style.padding = '6px 16px';
  ignoreOnce.style.cursor = 'pointer';
  ignoreOnce.onclick = () => {
    target.classList.remove('rte-misspelled');
    menu.remove();
  };
  menu.appendChild(ignoreOnce);
  const ignoreAll = document.createElement('div');
  ignoreAll.className = 'rte-spellcheck-menu-item';
  ignoreAll.textContent = 'Ignore All';
  ignoreAll.style.padding = '6px 16px';
  ignoreAll.style.cursor = 'pointer';
  ignoreAll.onclick = () => {
    ignoreWord(word);
    clearSpellCheckHighlights();
    highlightMisspelledWords();
    menu.remove();
  };
  menu.appendChild(ignoreAll);
  const addToDict = document.createElement('div');
  addToDict.className = 'rte-spellcheck-menu-item';
  addToDict.textContent = 'Add to Dictionary';
  addToDict.style.padding = '6px 16px';
  addToDict.style.cursor = 'pointer';
  addToDict.onclick = () => {
    addToDictionary(word);
    clearSpellCheckHighlights();
    highlightMisspelledWords();
    menu.remove();
  };
  menu.appendChild(addToDict);
  document.body.appendChild(menu);
  const dismiss = (ev: MouseEvent) => {
    if (!menu.contains(ev.target as Node)) {
      menu.remove();
      document.removeEventListener('mousedown', dismiss);
    }
  };
  setTimeout(() => document.addEventListener('mousedown', dismiss), 0);
}

function findIssueForElement(el: HTMLElement): SpellCheckIssue | null {
  const word = el.getAttribute('data-word');
  if (!word) return null;
  const parent = el.parentNode;
  if (!parent) return null;
  for (const node of parent.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.includes(word)) {
      const idx = node.textContent.indexOf(word);
      return {
        id: `${word}-${idx}`,
        node: node as Text,
        startOffset: idx,
        endOffset: idx + word.length,
        word,
        suggestions: DefaultDictionaryProvider.suggest(word, 'en'),
        ignored: false
      };
    }
  }
  return null;
}

export const SpellCheckPlugin = (): Plugin => ({
  name: 'spellCheck',
  toolbar: [
    {
      label: 'Spell Check',
      command: 'toggleSpellCheck',
      type: 'button',
      icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 12.5L3.84375 9.5M3.84375 9.5L5 5.38889C5 5.38889 5.25 4.5 6 4.5C6.75 4.5 7 5.38889 7 5.38889L8.15625 9.5M3.84375 9.5H8.15625M9 12.5L8.15625 9.5M13 16.8333L15.4615 19.5L21 13.5M12 8.5H15C16.1046 8.5 17 7.60457 17 6.5C17 5.39543 16.1046 4.5 15 4.5H12V8.5ZM12 8.5H16C17.1046 8.5 18 9.39543 18 10.5C18 11.6046 17.1046 12.5 16 12.5H12V8.5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>'
    }
  ],
  context: {
    provider: SpellCheckPluginProvider
  }
});
