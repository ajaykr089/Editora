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
  }
  
  // Fallback to first editor
  return document.querySelector('[contenteditable="true"]');
};

/**
 * Scan entire document for misspellings
 */
function scanDocumentForMisspellings(): SpellCheckIssue[] {
  const editor = findActiveEditor();
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
  const editor = findActiveEditor();
  if (!editor) return;
  
  if (!issues) issues = scanDocumentForMisspellings();
  
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
  
  // Update side panel
  updateSidePanel();
}

/**
 * Clear all spell check highlights
 */
function clearSpellCheckHighlights(): void {
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

/**
 * Replace a misspelled word with a suggestion
 */
function replaceWord(issue: SpellCheckIssue, replacement: string): void {
  const range = document.createRange();
  range.setStart(issue.node, issue.startOffset);
  range.setEnd(issue.node, issue.endOffset);
  
  const textNode = document.createTextNode(replacement);
  range.deleteContents();
  range.insertNode(textNode);
  
  // MutationObserver will trigger highlight and panel update
}

/**
 * Ignore a word (session only)
 */
function ignoreWord(word: string): void {
  ignoredWords.add(word.toLowerCase());
  clearSpellCheckHighlights();
  highlightMisspelledWords();
  updateSidePanel(); // Immediate update needed since no DOM change
}

/**
 * Add word to custom dictionary (persistent)
 */
function addToDictionary(word: string): void {
  customDictionary.add(word.toLowerCase());
  saveCustomDictionary(); // Save to localStorage
  clearSpellCheckHighlights();
  highlightMisspelledWords();
  updateSidePanel(); // Immediate update needed since no DOM change
}

/**
 * Get spell check statistics
 */
function getSpellCheckStats(issues?: SpellingIssue[]): { total: number; misspelled: number; accuracy: number } {
  const editor = findActiveEditor();
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

// ===== Context Menu =====

/**
 * Show context menu for misspelled word
 */
function showSpellCheckContextMenu(x: number, y: number, word: string, suggestions: string[], target: HTMLElement): void {
  // Remove existing menus
  document.querySelectorAll('.rte-spellcheck-menu').forEach(el => el.remove());
  
  const menu = document.createElement('div');
  menu.className = 'rte-spellcheck-menu';
  menu.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    z-index: 99999;
    padding: 4px 0;
    min-width: 160px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
  `;
  
  // Add suggestions
  suggestions.slice(0, 5).forEach(suggestion => {
    const item = document.createElement('div');
    item.className = 'rte-spellcheck-menu-item';
    item.textContent = suggestion;
    item.style.cssText = 'padding: 6px 16px; cursor: pointer; transition: background 0.2s;';
    item.onmouseenter = () => item.style.backgroundColor = '#f0f0f0';
    item.onmouseleave = () => item.style.backgroundColor = 'transparent';
    item.onclick = () => {
      // Find the text node and create issue
      const parent = target.parentNode;
      if (parent) {
        for (const node of parent.childNodes) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.includes(word)) {
            const idx = node.textContent.indexOf(word);
            const issue: SpellCheckIssue = {
              id: `${word}-${idx}`,
              node: node as Text,
              startOffset: idx,
              endOffset: idx + word.length,
              word,
              suggestions,
              ignored: false
            };
            replaceWord(issue, suggestion);
            break;
          }
        }
      }
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
  ignoreOnce.className = 'rte-spellcheck-menu-item';
  ignoreOnce.textContent = 'Ignore Once';
  ignoreOnce.style.cssText = 'padding: 6px 16px; cursor: pointer; color: #666;';
  ignoreOnce.onmouseenter = () => ignoreOnce.style.backgroundColor = '#f0f0f0';
  ignoreOnce.onmouseleave = () => ignoreOnce.style.backgroundColor = 'transparent';
  ignoreOnce.onclick = () => {
    target.remove();
    menu.remove();
  };
  menu.appendChild(ignoreOnce);
  
  // Ignore All
  const ignoreAll = document.createElement('div');
  ignoreAll.className = 'rte-spellcheck-menu-item';
  ignoreAll.textContent = 'Ignore All';
  ignoreAll.style.cssText = 'padding: 6px 16px; cursor: pointer; color: #666;';
  ignoreAll.onmouseenter = () => ignoreAll.style.backgroundColor = '#f0f0f0';
  ignoreAll.onmouseleave = () => ignoreAll.style.backgroundColor = 'transparent';
  ignoreAll.onclick = () => {
    ignoreWord(word);
    menu.remove();
  };
  menu.appendChild(ignoreAll);
  
  // Add to Dictionary
  const addToDict = document.createElement('div');
  addToDict.className = 'rte-spellcheck-menu-item';
  addToDict.textContent = 'Add to Dictionary';
  addToDict.style.cssText = 'padding: 6px 16px; cursor: pointer; color: #1976d2;';
  addToDict.onmouseenter = () => addToDict.style.backgroundColor = '#f0f0f0';
  addToDict.onmouseleave = () => addToDict.style.backgroundColor = 'transparent';
  addToDict.onclick = () => {
    addToDictionary(word);
    menu.remove();
  };
  menu.appendChild(addToDict);
  
  document.body.appendChild(menu);
  
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
  document.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains('rte-misspelled')) {
      e.preventDefault();
      const word = target.getAttribute('data-word')!;
      const suggestions = (target.getAttribute('data-suggestions') || '').split(',').filter(s => s);
      showSpellCheckContextMenu(e.clientX, e.clientY, word, suggestions, target);
    }
  });
}

// ===== Side Panel =====

/**
 * Create and show side panel
 */
function createSidePanel(): HTMLElement {
  const panel = document.createElement('div');
  panel.className = 'rte-spell-check-panel';
  panel.style.cssText = `
    position: fixed;
    right: 0;
    top: 0;
    width: 350px;
    height: 100vh;
    background: white;
    border-left: 1px solid #ddd;
    box-shadow: -2px 0 4px rgba(0,0,0,0.1);
    overflow-y: auto;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding: 16px;
  `;
  
  document.body.appendChild(panel);
  return panel;
}

/**
 * Update side panel content
 */
function updateSidePanel(): void {
  if (!sidePanelElement) return;
  
  const issues = scanDocumentForMisspellings();
  const stats = getSpellCheckStats(issues); // Pass issues to avoid duplicate scan
  
  sidePanelElement.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Spell Check</h3>
      <button class="rte-spellcheck-close" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #888;">✕</button>
    </div>
    
    <div style="display: flex; gap: 24px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eee;">
      <div>
        <div style="font-size: 12px; color: #999;">Total Words</div>
        <div style="font-size: 16px; font-weight: 600; color: #333;">${stats.total}</div>
      </div>
      <div>
        <div style="font-size: 12px; color: #999;">Misspelled</div>
        <div style="font-size: 16px; font-weight: 600; color: #d32f2f;">${stats.misspelled}</div>
      </div>
      <div>
        <div style="font-size: 12px; color: #999;">Accuracy</div>
        <div style="font-size: 16px; font-weight: 600; color: #388e3c;">${stats.accuracy.toFixed(1)}%</div>
      </div>
    </div>
    
    <div class="misspellings-list">
      ${issues.length === 0 
        ? '<div style="padding: 12px; text-align: center; color: #999; font-size: 13px;">No spelling errors found</div>'
        : issues.map((issue, idx) => `
            <div class="misspelling-item" data-word="${issue.word}" data-index="${idx}" style="padding: 8px; margin-bottom: 8px; background-color: #f5f5f5; border-radius: 4px;">
              <div class="word-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <span style="font-weight: 600; color: #d32f2f;">${issue.word}</span>
                <button class="expand-btn" style="background: none; border: none; cursor: pointer; font-size: 12px; color: #666;">▶</button>
              </div>
              <div class="suggestions" style="display: none; margin-top: 8px; padding-top: 8px; border-top: 1px solid #ddd;">
                ${issue.suggestions.length > 0 
                  ? `<div style="font-size: 12px; font-weight: 600; color: #333; margin-bottom: 6px;">Suggestions:</div>
                     ${issue.suggestions.map(s => `<button class="suggestion-btn" data-suggestion="${s}" style="display: inline-block; margin-right: 6px; margin-bottom: 6px; padding: 4px 8px; background-color: #1976d2; color: white; border: none; border-radius: 3px; font-size: 12px; cursor: pointer;">${s}</button>`).join('')}`
                  : '<div style="font-size: 12px; color: #999; margin-bottom: 8px;">No suggestions</div>'
                }
                <div style="margin-top: 8px; display: flex; gap: 6px;">
                  <button class="ignore-btn" style="font-size: 12px; padding: 4px 8px; background-color: white; border: 1px solid #ddd; border-radius: 3px; cursor: pointer;">Ignore</button>
                  <button class="add-btn" style="font-size: 12px; padding: 4px 8px; background-color: white; border: 1px solid #ddd; border-radius: 3px; cursor: pointer;">Add to Dictionary</button>
                </div>
              </div>
            </div>
          `).join('')
      }
    </div>
  `;
  
  // Event listeners
  const closeBtn = sidePanelElement.querySelector('.rte-spellcheck-close');
  closeBtn?.addEventListener('click', () => {
    toggleSpellCheck();
  });
  
  // Toggle expand/collapse
  sidePanelElement.querySelectorAll('.word-header').forEach((header, idx) => {
    header.addEventListener('click', () => {
      const item = header.closest('.misspelling-item');
      const suggestions = item?.querySelector('.suggestions') as HTMLElement;
      const expandBtn = header.querySelector('.expand-btn');
      if (suggestions && expandBtn) {
        if (suggestions.style.display === 'none') {
          suggestions.style.display = 'block';
          expandBtn.textContent = '▼';
        } else {
          suggestions.style.display = 'none';
          expandBtn.textContent = '▶';
        }
      }
    });
  });
  
  // Suggestion buttons
  sidePanelElement.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const suggestion = btn.getAttribute('data-suggestion')!;
      const item = btn.closest('.misspelling-item');
      const word = item?.getAttribute('data-word')!;
      const issueIndex = parseInt(item?.getAttribute('data-index') || '0');
      
      if (issues[issueIndex]) {
        replaceWord(issues[issueIndex], suggestion);
      }
    });
  });
  
  // Ignore buttons
  sidePanelElement.querySelectorAll('.ignore-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.misspelling-item');
      const word = item?.getAttribute('data-word')!;
      ignoreWord(word);
    });
  });
  
  // Add to dictionary buttons
  sidePanelElement.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.misspelling-item');
      const word = item?.getAttribute('data-word')!;
      addToDictionary(word);
    });
  });
}

// ===== MutationObserver for incremental spell check =====

function startMutationObserver(): void {
  const editor = findActiveEditor();
  if (!editor) return;
  
  if (mutationObserver) mutationObserver.disconnect();
  
  mutationObserver = new MutationObserver((mutations) => {
    // Only trigger on text/content changes
    if (mutations.some(m => m.type === 'characterData' || m.type === 'childList')) {
      // Debounce the highlight function
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = window.setTimeout(() => {
        if (isSpellCheckEnabled) {
          highlightMisspelledWords();
          updateSidePanel(); // Update side panel when content changes
        }
      }, 350);
    }
  });
  
  mutationObserver.observe(editor, {
    characterData: true,
    childList: true,
    subtree: true
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

// ===== Main Toggle Function =====

function toggleSpellCheck(): void {
  isSpellCheckEnabled = !isSpellCheckEnabled;
  
  if (isSpellCheckEnabled) {
    // Enable spell check
    highlightMisspelledWords();
    attachSpellCheckContextMenu();
    startMutationObserver();
    
    // Create and show side panel
    if (!sidePanelElement) {
      sidePanelElement = createSidePanel();
      updateSidePanel();
    }
  } else {
    // Disable spell check
    clearSpellCheckHighlights();
    stopMutationObserver();
    
    // Remove side panel
    if (sidePanelElement) {
      sidePanelElement.remove();
      sidePanelElement = null;
    }
  }
  
  return isSpellCheckEnabled;
}

// ===== Plugin Export =====

export const SpellCheckPlugin = (): Plugin => ({
  name: 'spellCheck',
  
  init: () => {
    // Load custom dictionary from localStorage on plugin initialization
    loadCustomDictionary();
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
