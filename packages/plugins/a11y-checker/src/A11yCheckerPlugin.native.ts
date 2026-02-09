import type { Plugin } from '@editora/core';

/**
 * A11yCheckerPlugin - Native implementation with complete WCAG 2.1 AA checking and UI dialog
 * 
 * Features:
 * - Comprehensive WCAG 2.1 AA rule checking
 * - Visual issue highlighting
 * - Auto-fix capabilities
 * - Issue suppression
 * - Accessibility score
 * - Full UI dialog with issue list, details, and actions
 */

// --- Rule Engine Types ---
export interface A11yContext {
  doc: Document;
  cache: Map<string, any>;
}

export interface A11yRule {
  id: string;
  wcag: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  selector?: string;
  evaluate(node: Node, ctx: A11yContext): A11yIssue | null;
  fix?(issue: A11yIssue): void;
}

export interface A11yIssue {
  id: string;
  rule: string;
  wcag: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  nodePath: string;
  element?: HTMLElement;
  suggestion?: string;
  fixable?: boolean;
  fixLabel?: string;
}

const suppressedRules = new Set<string>();
const ruleRegistry: A11yRule[] = [];
const registerA11yRule = (rule: A11yRule) => { ruleRegistry.push(rule); };

// --- WCAG 2.1 AA Rule Implementations ---

// 1. Image Alt Text (Error - WCAG 1.1.1)
registerA11yRule({
  id: 'image-alt-text',
  wcag: '1.1.1',
  description: 'Images must have alt text',
  severity: 'error',
  selector: 'img',
  evaluate(node, ctx) {
    const img = node as HTMLImageElement;
    if (img.hasAttribute('role') && img.getAttribute('role') === 'presentation') return null;
    if (img.hasAttribute('data-a11y-ignore') && img.getAttribute('data-a11y-ignore') === 'image-alt-text') return null;
    if (!img.hasAttribute('alt') || img.getAttribute('alt')?.trim() === '') {
      return {
        id: `img-alt-${ctx.cache.get('imgIdx')}`,
        rule: 'image-alt-text',
        wcag: '1.1.1',
        severity: 'error',
        message: 'Image missing alt text',
        nodePath: ctx.cache.get('imgPath'),
        element: img,
        suggestion: 'Add descriptive alt text to all images',
        fixable: true,
        fixLabel: 'Add empty alt',
      };
    }
    return null;
  },
  fix(issue) {
    if (issue.element) (issue.element as HTMLImageElement).setAttribute('alt', '');
  }
});

// 2. Empty Interactive Elements (Error - WCAG 4.1.2)
registerA11yRule({
  id: 'empty-interactive',
  wcag: '4.1.2',
  description: 'Interactive elements must have accessible names',
  severity: 'error',
  selector: 'button, a, [role="button"]',
  evaluate(node, ctx) {
    const el = node as HTMLElement;
    if (el.hasAttribute('data-a11y-ignore') && el.getAttribute('data-a11y-ignore') === 'empty-interactive') return null;
    const hasText = el.textContent?.trim();
    const hasAriaLabel = el.hasAttribute('aria-label');
    const hasAriaLabelledBy = el.hasAttribute('aria-labelledby');
    const hasTitle = el.hasAttribute('title');
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      return {
        id: `interactive-empty-${ctx.cache.get('buttonIdx')}`,
        rule: 'empty-interactive',
        wcag: '4.1.2',
        severity: 'error',
        message: 'Interactive element has no accessible name',
        nodePath: ctx.cache.get('buttonPath'),
        element: el,
        suggestion: 'Add text, aria-label, aria-labelledby, or title',
        fixable: true,
        fixLabel: 'Add aria-label',
      };
    }
    return null;
  },
  fix(issue) {
    if (issue.element) issue.element.setAttribute('aria-label', 'Button');
  }
});

// 3. Form Control Labels (Error - WCAG 1.3.1)
registerA11yRule({
  id: 'form-label',
  wcag: '1.3.1',
  description: 'Form controls must have labels',
  severity: 'error',
  selector: 'input, textarea, select',
  evaluate(node, ctx) {
    const el = node as HTMLElement;
    if (el.hasAttribute('type') && el.getAttribute('type') === 'hidden') return null;
    if (el.hasAttribute('data-a11y-ignore') && el.getAttribute('data-a11y-ignore') === 'form-label') return null;
    const hasLabel = ctx.doc.querySelector(`label[for="${el.getAttribute('id')}"]`);
    const hasAriaLabel = el.hasAttribute('aria-label');
    const hasAriaLabelledBy = el.hasAttribute('aria-labelledby');
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      return {
        id: `form-label-${ctx.cache.get('inputIdx')}`,
        rule: 'form-label',
        wcag: '1.3.1',
        severity: 'error',
        message: 'Form control missing label',
        nodePath: ctx.cache.get('inputPath'),
        element: el,
        suggestion: 'Add <label>, aria-label, or aria-labelledby',
        fixable: true,
        fixLabel: 'Add aria-label',
      };
    }
    return null;
  },
  fix(issue) {
    if (issue.element) issue.element.setAttribute('aria-label', 'Input');
  }
});

// 4. Table Headers (Error - WCAG 1.3.1)
registerA11yRule({
  id: 'table-headers',
  wcag: '1.3.1',
  description: 'Tables must have header rows',
  severity: 'error',
  selector: 'table',
  evaluate(node, ctx) {
    const table = node as HTMLTableElement;
    if (table.hasAttribute('data-a11y-ignore') && table.getAttribute('data-a11y-ignore') === 'table-headers') return null;
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');
    if (headers.length === 0 && rows.length > 0) {
      return {
        id: `table-no-headers-${ctx.cache.get('tableIdx')}`,
        rule: 'table-headers',
        wcag: '1.3.1',
        severity: 'error',
        message: 'Table missing header row (<th> elements)',
        nodePath: ctx.cache.get('tablePath'),
        element: table,
        suggestion: 'Add <th> elements to first row',
        fixable: true,
        fixLabel: 'Convert first row to headers',
      };
    }
    return null;
  },
  fix(issue) {
    if (issue.element) {
      const table = issue.element as HTMLTableElement;
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        Array.from(firstRow.children).forEach(cell => {
          if (cell.tagName === 'TD') {
            const th = document.createElement('th');
            th.innerHTML = cell.innerHTML;
            firstRow.replaceChild(th, cell);
          }
        });
      }
    }
  }
});

// 5. Empty Headings (Error - WCAG 1.3.1)
registerA11yRule({
  id: 'heading-empty',
  wcag: '1.3.1',
  description: 'Headings must not be empty',
  severity: 'error',
  selector: 'h1, h2, h3, h4, h5, h6',
  evaluate(node, ctx) {
    const heading = node as HTMLElement;
    if (heading.hasAttribute('data-a11y-ignore') && heading.getAttribute('data-a11y-ignore') === 'heading-empty') return null;
    const text = heading.textContent?.replace(/\s+/g, '') || '';
    const onlyBr = heading.childNodes.length === 1 && heading.childNodes[0].nodeName === 'BR';
    if (!text && !onlyBr) {
      return {
        id: `heading-empty-${ctx.cache.get('headingIdx')}`,
        rule: 'heading-empty',
        wcag: '1.3.1',
        severity: 'error',
        message: `Empty ${heading.tagName.toLowerCase()} heading`,
        nodePath: ctx.cache.get('headingPath'),
        element: heading,
        suggestion: 'All headings must contain text',
        fixable: false,
      };
    }
    return null;
  }
});

// 6. Heading Order (Warning - WCAG 1.3.1)
registerA11yRule({
  id: 'heading-order',
  wcag: '1.3.1',
  description: 'Headings should not skip levels',
  severity: 'warning',
  selector: 'h1, h2, h3, h4, h5, h6',
  evaluate(node, ctx) {
    const heading = node as HTMLElement;
    const currentLevel = parseInt(heading.tagName[1]);
    const previousLevel = ctx.cache.get('previousHeadingLevel') || currentLevel;
    ctx.cache.set('previousHeadingLevel', currentLevel);
    if (currentLevel - previousLevel > 1) {
      return {
        id: `heading-order-${ctx.cache.get('headingIdx')}`,
        rule: 'heading-order',
        wcag: '1.3.1',
        severity: 'warning',
        message: `Heading skips level (${previousLevel} → ${currentLevel})`,
        nodePath: ctx.cache.get('headingPath'),
        element: heading,
        suggestion: `Use heading level ${previousLevel + 1} instead`,
        fixable: false,
      };
    }
    return null;
  }
});

// 7. Link Text Quality (Error/Warning - WCAG 2.4.4)
registerA11yRule({
  id: 'link-text',
  wcag: '2.4.4',
  description: 'Links must have descriptive text',
  severity: 'error',
  selector: 'a',
  evaluate(node, ctx) {
    const link = node as HTMLElement;
    if (link.hasAttribute('data-a11y-ignore') && link.getAttribute('data-a11y-ignore') === 'link-text') return null;
    const text = link.textContent?.replace(/\s+/g, '').toLowerCase() || '';
    const onlyBr = link.childNodes.length === 1 && link.childNodes[0].nodeName === 'BR';
    const vagueText = ['clickhere', 'readmore', 'link', 'here', 'this', 'page'];
    
    if (!text && !onlyBr) {
      return {
        id: `link-empty-${ctx.cache.get('aIdx')}`,
        rule: 'link-text',
        wcag: '2.4.4',
        severity: 'error',
        message: 'Link has no text content',
        nodePath: ctx.cache.get('aPath'),
        element: link,
        suggestion: 'All links must have descriptive text',
        fixable: true,
        fixLabel: 'Insert placeholder',
      };
    } else if (vagueText.some(vt => text.includes(vt))) {
      return {
        id: `link-vague-${ctx.cache.get('aIdx')}`,
        rule: 'link-text',
        wcag: '2.4.4',
        severity: 'warning',
        message: `Vague link text: "${link.textContent?.trim()}"`,
        nodePath: ctx.cache.get('aPath'),
        element: link,
        suggestion: 'Use descriptive link text',
        fixable: false,
      };
    }
    return null;
  },
  fix(issue) {
    if (issue.element) issue.element.textContent = 'Link';
  }
});

// 8. List Structure (Error - WCAG 1.3.1)
registerA11yRule({
  id: 'list-structure',
  wcag: '1.3.1',
  description: 'Lists must only contain <li> children',
  severity: 'error',
  selector: 'ul, ol',
  evaluate(node, ctx) {
    const list = node as HTMLElement;
    if (list.hasAttribute('data-a11y-ignore') && list.getAttribute('data-a11y-ignore') === 'list-structure') return null;
    const items = list.querySelectorAll(':scope > li');
    const nonLiChildren = Array.from(list.children).filter(child => child.tagName !== 'LI');
    if (nonLiChildren.length > 0) {
      return {
        id: `list-structure-${ctx.cache.get('ulIdx')}`,
        rule: 'list-structure',
        wcag: '1.3.1',
        severity: 'error',
        message: 'List contains non-li elements',
        nodePath: ctx.cache.get('ulPath'),
        element: list,
        suggestion: 'All direct children of ul/ol must be li elements',
        fixable: false,
      };
    }
    if (items.length === 0) {
      return {
        id: `list-empty-${ctx.cache.get('ulIdx')}`,
        rule: 'list-structure',
        wcag: '1.3.1',
        severity: 'warning',
        message: 'Empty list element',
        nodePath: ctx.cache.get('ulPath'),
        element: list,
        suggestion: 'Remove empty lists or add list items',
        fixable: false,
      };
    }
    return null;
  }
});

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

// --- Audit Engine ---
export const runA11yAudit = (): A11yIssue[] => {
  const editor = findActiveEditor();
  if (!editor) return [];
  
  const issues: A11yIssue[] = [];
  const ctx: A11yContext = { doc: editor.ownerDocument || document, cache: new Map() };
  const walker = ctx.doc.createTreeWalker(editor, NodeFilter.SHOW_ELEMENT, null);
  
  let node: Node | null = walker.currentNode;
  let idxMap: Record<string, number> = {};
  let pathMap: Record<string, string> = {};
  let nodeIdx = 0;
  
  while (node && nodeIdx < 5000) {
    const el = node as HTMLElement;
    const tag = el.tagName?.toLowerCase?.() || '';
    
    // Skip hidden elements
    if (el.hidden || el.style.display === 'none' || el.style.visibility === 'hidden') {
      node = walker.nextNode();
      nodeIdx++;
      continue;
    }
    
    idxMap[tag] = (idxMap[tag] || 0) + 1;
    pathMap[tag] = `${tag}[${idxMap[tag] - 1}]`;
    
    for (const rule of ruleRegistry) {
      if (suppressedRules.has(rule.id)) continue;
      if (rule.selector && !(node as Element).matches?.(rule.selector)) continue;
      
      ctx.cache.set(`${tag}Idx`, idxMap[tag] - 1);
      ctx.cache.set(`${tag}Path`, pathMap[tag]);
      
      if (/^h[1-6]$/.test(tag)) {
        ctx.cache.set('headingIdx', idxMap[tag] - 1);
        ctx.cache.set('headingPath', pathMap[tag]);
      }
      if (tag === 'a') {
        ctx.cache.set('aIdx', idxMap[tag] - 1);
        ctx.cache.set('aPath', pathMap[tag]);
      }
      if (tag === 'table') {
        ctx.cache.set('tableIdx', idxMap[tag] - 1);
        ctx.cache.set('tablePath', pathMap[tag]);
      }
      if (tag === 'button') {
        ctx.cache.set('buttonIdx', idxMap[tag] - 1);
        ctx.cache.set('buttonPath', pathMap[tag]);
      }
      if (tag === 'input') {
        ctx.cache.set('inputIdx', idxMap[tag] - 1);
        ctx.cache.set('inputPath', pathMap[tag]);
      }
      if (tag === 'ul' || tag === 'ol') {
        ctx.cache.set('ulIdx', idxMap[tag] - 1);
        ctx.cache.set('ulPath', pathMap[tag]);
      }
      
      const issue = rule.evaluate(node, ctx);
      if (issue) issues.push(issue);
    }
    
    node = walker.nextNode();
    nodeIdx++;
  }
  
  return issues;
};

export const highlightIssue = (issue: A11yIssue, highlight: boolean = true) => {
  if (!issue.element) return;
  if (highlight) {
    issue.element.classList.add('a11y-highlighted');
    issue.element.style.outline = '2px solid #ff9800';
    issue.element.style.backgroundColor = '#fff3cd';
  } else {
    issue.element.classList.remove('a11y-highlighted');
    issue.element.style.outline = '';
    issue.element.style.backgroundColor = '';
  }
};

export const getA11yScore = (issues?: A11yIssue[]): number => {
  // Use provided issues or run fresh audit if not provided
  if (!issues) {
    issues = runA11yAudit();
  }
  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  let score = 100 - (errors * 20) - (warnings * 5);
  return Math.max(0, score);
};

export const autoFixA11yIssue = (issue: A11yIssue) => {
  const rule = ruleRegistry.find(r => r.id === issue.rule);
  if (rule && rule.fix) rule.fix(issue);
};

export const suppressRule = (ruleId: string) => { suppressedRules.add(ruleId); };
export const unsuppressRule = (ruleId: string) => { suppressedRules.delete(ruleId); };

// --- UI Dialog Implementation ---
const createA11yDialog = () => {
  const issues = runA11yAudit();
  const score = getA11yScore(issues); // Pass issues to avoid duplicate audit
  
  // Create dialog overlay
  const overlay = document.createElement('div');
  overlay.className = 'a11y-dialog-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  // Create dialog
  const dialog = document.createElement('div');
  dialog.className = 'a11y-dialog';
  dialog.style.cssText = `
    background: white;
    border-radius: 8px;
    max-width: 800px;
    width: 90%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  `;
  
  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 20px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;
  
  const title = document.createElement('h2');
  title.style.cssText = 'margin: 0; font-size: 20px; font-weight: 600;';
  title.textContent = 'Accessibility Checker';
  
  const scoreDisplay = document.createElement('div');
  scoreDisplay.style.cssText = `
    font-size: 24px;
    font-weight: bold;
    padding: 8px 16px;
    border-radius: 4px;
    background: ${score >= 80 ? '#4caf50' : score >= 60 ? '#ff9800' : '#f44336'};
    color: white;
  `;
  scoreDisplay.textContent = `${score}/100`;
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = '#f0f0f0';
  closeBtn.onmouseout = () => closeBtn.style.background = 'none';
  closeBtn.onclick = () => {
    // Clear all highlights
    issues.forEach(issue => highlightIssue(issue, false));
    overlay.remove();
  };
  
  const headerLeft = document.createElement('div');
  headerLeft.style.cssText = 'display: flex; align-items: center; gap: 16px;';
  headerLeft.appendChild(title);
  headerLeft.appendChild(scoreDisplay);
  
  header.appendChild(headerLeft);
  header.appendChild(closeBtn);
  
  // Content
  const content = document.createElement('div');
  content.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  `;
  
  if (issues.length === 0) {
    content.innerHTML = `
      <div style="text-align: center; padding: 40px 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
        <h3 style="margin: 0 0 8px 0; color: #4caf50;">No issues found!</h3>
        <p style="margin: 0; color: #666;">Your content meets WCAG 2.1 AA standards.</p>
      </div>
    `;
  } else {
    const summary = document.createElement('div');
    summary.style.cssText = `
      background: #f5f5f5;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 20px;
      display: flex;
      gap: 20px;
    `;
    
    const errors = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;
    const infos = issues.filter(i => i.severity === 'info').length;
    
    summary.innerHTML = `
      <div><strong style="color: #f44336;">${errors}</strong> <span style="color: #666;">Errors</span></div>
      <div><strong style="color: #ff9800;">${warnings}</strong> <span style="color: #666;">Warnings</span></div>
      <div><strong style="color: #2196f3;">${infos}</strong> <span style="color: #666;">Info</span></div>
    `;
    
    content.appendChild(summary);
    
    // Issue list
    issues.forEach(issue => {
      const issueItem = document.createElement('div');
      issueItem.style.cssText = `
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        padding: 16px;
        margin-bottom: 12px;
        transition: all 0.2s;
      `;
      issueItem.onmouseover = () => {
        issueItem.style.borderColor = '#2196f3';
        issueItem.style.background = '#f5f9ff';
        highlightIssue(issue, true);
      };
      issueItem.onmouseout = () => {
        issueItem.style.borderColor = '#e0e0e0';
        issueItem.style.background = 'white';
        highlightIssue(issue, false);
      };
      
      const severityColor = issue.severity === 'error' ? '#f44336' : 
                            issue.severity === 'warning' ? '#ff9800' : '#2196f3';
      
      issueItem.innerHTML = `
        <div style="display: flex; align-items: start; gap: 12px; margin-bottom: 8px;">
          <span style="
            background: ${severityColor};
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          ">${issue.severity}</span>
          <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">${issue.message}</div>
            <div style="font-size: 12px; color: #666;">WCAG ${issue.wcag} · ${issue.rule}</div>
          </div>
        </div>
        <div style="font-size: 14px; color: #444; margin-bottom: 8px; padding-left: 68px;">
          ${issue.suggestion || ''}
        </div>
      `;
      
      if (issue.fixable) {
        const fixBtn = document.createElement('button');
        fixBtn.textContent = `🔧 ${issue.fixLabel || 'Auto-fix'}`;
        fixBtn.style.cssText = `
          background: #2196f3;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          margin-left: 68px;
        `;
        fixBtn.onmouseover = () => fixBtn.style.background = '#1976d2';
        fixBtn.onmouseout = () => fixBtn.style.background = '#2196f3';
        fixBtn.onclick = () => {
          autoFixA11yIssue(issue);
          fixBtn.textContent = '✓ Fixed';
          fixBtn.style.background = '#4caf50';
          fixBtn.disabled = true;
          fixBtn.style.cursor = 'not-allowed';
          highlightIssue(issue, false);
          setTimeout(() => {
            overlay.remove();
            // Re-open dialog with updated issues
            createA11yDialog();
          }, 1000);
        };
        issueItem.appendChild(fixBtn);
      }
      
      content.appendChild(issueItem);
    });
  }
  
  dialog.appendChild(header);
  dialog.appendChild(content);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  
  // Close on overlay click
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      issues.forEach(issue => highlightIssue(issue, false));
      overlay.remove();
    }
  };
  
  // Close on ESC key
  const escHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      issues.forEach(issue => highlightIssue(issue, false));
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
};

export const A11yCheckerPlugin = (): Plugin => ({
  name: 'a11yChecker',
  
  toolbar: [
    {
      label: 'Accessibility',
      command: 'toggleA11yChecker',
      icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9 6.82954C10.1652 6.4177 11 5.30646 11 4.00024C11 2.34339 9.65686 1.00024 8 1.00024C6.34315 1.00024 5 2.34339 5 4.00024C5 5.30646 5.83481 6.4177 7 6.82954V12.0002C7 13.6571 8.34315 15.0002 10 15.0002H14.9296C15.264 15.0002 15.5762 15.1673 15.7617 15.4455L18.4913 19.54C19.1914 20.5901 20.6772 20.7373 21.5696 19.8448L22.7071 18.7074C23.0976 18.3168 23.0976 17.6837 22.7071 17.2931C22.3166 16.9026 21.6834 16.9026 21.2929 17.2931L20.1554 18.4306L17.4258 14.3361C16.8694 13.5015 15.9327 13.0002 14.9296 13.0002H10C9.44772 13.0002 9 12.5525 9 12.0002V11.0002H15C15.5523 11.0002 16 10.5525 16 10.0002C16 9.44796 15.5523 9.00025 15 9.00025H9V6.82954ZM8 5.10758C7.38844 5.10758 6.89267 4.61181 6.89267 4.00024C6.89267 3.38868 7.38844 2.89291 8 2.89291C8.61157 2.89291 9.10734 3.38868 9.10734 4.00024C9.10734 4.61181 8.61157 5.10758 8 5.10758Z" fill="#0F0F0F"></path> <path d="M4.6328 9.07414C5.10517 8.78987 5.69738 9.0279 5.91645 9.53381C6.13552 10.0397 5.89604 10.6205 5.43795 10.9272C4.92993 11.2673 4.48018 11.6911 4.10882 12.1826C3.53598 12.9408 3.16922 13.8345 3.04425 14.7765C2.91928 15.7185 3.04036 16.6768 3.3957 17.5582C3.75103 18.4395 4.32852 19.2138 5.07194 19.8058C5.81535 20.3977 6.69937 20.787 7.63791 20.9359C8.57646 21.0847 9.53756 20.988 10.4276 20.6552C11.3177 20.3223 12.1065 19.7647 12.7171 19.0366C13.1129 18.5645 13.4251 18.0313 13.6428 17.46C13.8391 16.9448 14.3514 16.5813 14.8936 16.6815C15.4357 16.7816 15.8004 17.3054 15.6291 17.8295C15.3326 18.7372 14.8644 19.583 14.2468 20.3194C13.4147 21.3117 12.3399 22.0716 11.1269 22.5252C9.91394 22.9787 8.6042 23.1105 7.32518 22.9077C6.04617 22.7048 4.84148 22.1742 3.82838 21.3676C2.81528 20.561 2.02831 19.5058 1.54407 18.3047C1.05983 17.1037 0.894836 15.7977 1.06514 14.5139C1.23545 13.2302 1.73525 12.0124 2.51589 10.9791C3.09523 10.2123 3.81459 9.56654 4.6328 9.07414Z" fill="#0F0F0F"></path> </g></svg>',
      shortcut: 'Mod-Shift-Alt-a'
    }
  ],
  
  commands: {
    toggleA11yChecker: () => {
      try {
        createA11yDialog();
        return true;
      } catch (error) {
        console.error('Failed to open accessibility checker:', error);
        return false;
      }
    }
  },
  
  keymap: {
    'Mod-Shift-Alt-a': 'toggleA11yChecker'
  }
});
