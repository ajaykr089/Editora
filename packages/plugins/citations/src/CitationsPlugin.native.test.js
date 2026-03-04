const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');

class FakeClassList {
  constructor(element) {
    this.element = element;
    this.classes = new Set();
  }

  setFromString(value) {
    this.classes.clear();
    String(value || '')
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => this.classes.add(token));
    this.sync();
  }

  sync() {
    this.element._className = Array.from(this.classes).join(' ');
  }

  add(...tokens) {
    tokens.forEach((token) => this.classes.add(token));
    this.sync();
  }

  remove(...tokens) {
    tokens.forEach((token) => this.classes.delete(token));
    this.sync();
  }

  contains(token) {
    return this.classes.has(token);
  }

  toggle(token, force) {
    if (typeof force === 'boolean') {
      if (force) this.classes.add(token);
      else this.classes.delete(token);
      this.sync();
      return force;
    }

    if (this.classes.has(token)) {
      this.classes.delete(token);
      this.sync();
      return false;
    }

    this.classes.add(token);
    this.sync();
    return true;
  }
}

class MiniEventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event) {
    if (!event || !event.type) return true;

    try {
      if (!event.target) {
        Object.defineProperty(event, 'target', {
          configurable: true,
          value: this,
        });
      }
    } catch {
      // Ignore readonly target from native Event in newer Node versions.
    }

    const listeners = this.listeners.get(event.type);
    if (!listeners) return true;

    listeners.forEach((listener) => listener(event));
    return true;
  }
}

class FakeText extends MiniEventTarget {
  constructor(data = '') {
    super();
    this.nodeType = 3;
    this.data = String(data);
    this.parentNode = null;
    this.ownerDocument = null;
  }

  get textContent() {
    return this.data;
  }

  set textContent(value) {
    this.data = String(value || '');
  }

  get length() {
    return this.data.length;
  }

  remove() {
    this.parentNode?.removeChild(this);
  }

  get previousSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.childNodes;
    const index = siblings.indexOf(this);
    return index > 0 ? siblings[index - 1] : null;
  }

  get nextSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.childNodes;
    const index = siblings.indexOf(this);
    return index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  }
}

function parseSelector(selector) {
  const trimmed = selector.trim();
  const attrs = [];
  const attrRegex = /\[([^=\]]+)(?:="([^"]*)")?\]/g;
  let attrMatch = attrRegex.exec(trimmed);
  while (attrMatch) {
    attrs.push({ name: attrMatch[1], value: typeof attrMatch[2] === 'string' ? attrMatch[2] : undefined });
    attrMatch = attrRegex.exec(trimmed);
  }

  const base = trimmed.replace(/\[[^\]]+\]/g, '').trim();

  let tag = '';
  let id = '';
  const classes = [];

  if (base.startsWith('#')) {
    id = base.slice(1);
  } else if (base.startsWith('.')) {
    base
      .split('.')
      .filter(Boolean)
      .forEach((token) => classes.push(token));
  } else if (base.includes('.')) {
    const [tagToken, ...classTokens] = base.split('.').filter(Boolean);
    tag = tagToken || '';
    classTokens.forEach((token) => classes.push(token));
  } else if (base) {
    tag = base;
  }

  return { tag: tag.toLowerCase(), id, classes, attrs };
}

function elementMatchesSimpleSelector(element, selector) {
  const parsed = parseSelector(selector);

  if (parsed.id && element.id !== parsed.id) return false;

  if (parsed.tag && element.tagName.toLowerCase() !== parsed.tag) return false;

  if (parsed.classes.some((token) => !element.classList.contains(token))) return false;

  for (const attr of parsed.attrs) {
    if (!element.hasAttribute(attr.name)) return false;
    if (typeof attr.value === 'string' && element.getAttribute(attr.name) !== attr.value) return false;
  }

  return true;
}

class FakeElement extends MiniEventTarget {
  constructor(tagName = 'div') {
    super();
    this.nodeType = 1;
    this.tagName = String(tagName).toUpperCase();
    this.parentNode = null;
    this.ownerDocument = null;
    this.childNodes = [];
    this.style = {};
    this.attrs = new Map();
    this.hidden = false;
    this.id = '';
    this._className = '';
    this.classList = new FakeClassList(this);
    this._innerHTML = '';
  }

  get className() {
    return this._className;
  }

  set className(value) {
    this.classList.setFromString(value || '');
  }

  get textContent() {
    return this.childNodes
      .map((node) => (node instanceof FakeText ? node.data : node.textContent || ''))
      .join('');
  }

  set textContent(value) {
    this.childNodes = [];
    if (value !== null && value !== undefined && String(value) !== '') {
      this.appendChild(this.ownerDocument.createTextNode(String(value)));
    }
  }

  get innerText() {
    return this.textContent;
  }

  set innerText(value) {
    this.textContent = value;
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(value) {
    this._innerHTML = String(value || '');
    this.childNodes = [];
  }

  get isConnected() {
    return this.tagName === 'HTML' || this.tagName === 'BODY' || this.tagName === 'HEAD' || this.parentNode !== null;
  }

  get previousSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.childNodes;
    const index = siblings.indexOf(this);
    return index > 0 ? siblings[index - 1] : null;
  }

  get nextSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.childNodes;
    const index = siblings.indexOf(this);
    return index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  }

  appendChild(child) {
    if (!child) return child;

    if (child.nodeType === 11) {
      const fragmentChildren = [...child.childNodes];
      fragmentChildren.forEach((node) => this.appendChild(node));
      child.childNodes = [];
      return child;
    }

    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;
    this.childNodes.push(child);
    return child;
  }

  insertBefore(child, referenceNode) {
    if (!referenceNode) return this.appendChild(child);

    if (child.nodeType === 11) {
      const fragmentChildren = [...child.childNodes];
      fragmentChildren.forEach((node) => this.insertBefore(node, referenceNode));
      child.childNodes = [];
      return child;
    }

    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }

    const index = this.childNodes.indexOf(referenceNode);
    if (index < 0) {
      return this.appendChild(child);
    }

    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;
    this.childNodes.splice(index, 0, child);
    return child;
  }

  removeChild(child) {
    const index = this.childNodes.indexOf(child);
    if (index >= 0) {
      this.childNodes.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  }

  remove() {
    this.parentNode?.removeChild(this);
  }

  setAttribute(name, value) {
    const next = String(value);
    if (name === 'class') {
      this.className = next;
      return;
    }

    if (name === 'id') {
      this.id = next;
    }

    this.attrs.set(name, next);
  }

  getAttribute(name) {
    if (name === 'id') return this.id || null;
    return this.attrs.has(name) ? this.attrs.get(name) : null;
  }

  hasAttribute(name) {
    if (name === 'id') return Boolean(this.id);
    return this.attrs.has(name);
  }

  removeAttribute(name) {
    if (name === 'id') {
      this.id = '';
      return;
    }

    this.attrs.delete(name);
  }

  contains(node) {
    if (!node) return false;
    if (node === this) return true;

    for (const child of this.childNodes) {
      if (child === node) return true;
      if (child.nodeType === 1 && child.contains(node)) return true;
    }

    return false;
  }

  matches(selector) {
    const selectors = selector
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    return selectors.some((simple) => elementMatchesSimpleSelector(this, simple));
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (current.matches(selector)) return current;
      current = current.parentNode;
    }
    return null;
  }

  querySelector(selector) {
    const all = this.querySelectorAll(selector);
    return all.length > 0 ? all[0] : null;
  }

  querySelectorAll(selector) {
    const selectors = selector
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const matches = [];

    const visit = (node) => {
      if (!node || node.nodeType !== 1) return;
      if (selectors.some((simple) => elementMatchesSimpleSelector(node, simple))) {
        matches.push(node);
      }

      node.childNodes.forEach((child) => {
        if (child.nodeType === 1) visit(child);
      });
    };

    this.childNodes.forEach((child) => {
      if (child.nodeType === 1) visit(child);
    });

    return matches;
  }

  focus() {
    if (this.ownerDocument) {
      this.ownerDocument.activeElement = this;
    }
  }

  scrollIntoView() {
    // noop
  }

  getBoundingClientRect() {
    return {
      x: 10,
      y: 10,
      top: 10,
      left: 10,
      right: 740,
      bottom: 520,
      width: 730,
      height: 510,
      toJSON: () => ({}),
    };
  }
}

class FakeDocumentFragment extends MiniEventTarget {
  constructor(ownerDocument) {
    super();
    this.nodeType = 11;
    this.ownerDocument = ownerDocument;
    this.parentNode = null;
    this.childNodes = [];
  }

  appendChild(child) {
    if (child.parentNode) {
      child.parentNode.removeChild(child);
    }
    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;
    this.childNodes.push(child);
    return child;
  }

  removeChild(child) {
    const index = this.childNodes.indexOf(child);
    if (index >= 0) {
      this.childNodes.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  }
}

class FakeRange {
  constructor() {
    this.startContainer = null;
    this.endContainer = null;
    this.startOffset = 0;
    this.endOffset = 0;
    this.collapsed = true;
  }

  setStart(node, offset) {
    this.startContainer = node;
    this.startOffset = offset;
    if (this.endContainer === null) {
      this.endContainer = node;
      this.endOffset = offset;
    }
    this.collapsed = this.startContainer === this.endContainer && this.startOffset === this.endOffset;
  }

  setEnd(node, offset) {
    this.endContainer = node;
    this.endOffset = offset;
    if (this.startContainer === null) {
      this.startContainer = node;
      this.startOffset = offset;
    }
    this.collapsed = this.startContainer === this.endContainer && this.startOffset === this.endOffset;
  }

  collapse(toStart = false) {
    if (toStart) {
      this.endContainer = this.startContainer;
      this.endOffset = this.startOffset;
    } else {
      this.startContainer = this.endContainer;
      this.startOffset = this.endOffset;
    }
    this.collapsed = true;
  }

  cloneRange() {
    const next = new FakeRange();
    next.startContainer = this.startContainer;
    next.endContainer = this.endContainer;
    next.startOffset = this.startOffset;
    next.endOffset = this.endOffset;
    next.collapsed = this.collapsed;
    return next;
  }

  deleteContents() {
    if (
      !this.startContainer ||
      this.startContainer !== this.endContainer ||
      this.startContainer.nodeType !== 1 ||
      this.startOffset === this.endOffset
    ) {
      return;
    }

    const parent = this.startContainer;
    const count = this.endOffset - this.startOffset;
    parent.childNodes.splice(this.startOffset, count).forEach((node) => {
      node.parentNode = null;
    });

    this.endOffset = this.startOffset;
    this.collapsed = true;
  }

  insertNode(node) {
    if (!this.startContainer) return;

    if (this.startContainer.nodeType === 1) {
      const parent = this.startContainer;
      const reference = parent.childNodes[this.startOffset] || null;
      parent.insertBefore(node, reference);
      return;
    }

    if (this.startContainer.nodeType === 3) {
      const parent = this.startContainer.parentNode;
      if (!parent) return;
      parent.insertBefore(node, this.startContainer.nextSibling);
    }
  }

  selectNode(node) {
    const parent = node.parentNode;
    if (!parent) return;

    const index = parent.childNodes.indexOf(node);
    if (index < 0) return;

    this.setStart(parent, index);
    this.setEnd(parent, index + 1);
    this.collapsed = false;
  }

  get commonAncestorContainer() {
    return this.startContainer;
  }
}

class FakeSelection {
  constructor() {
    this.ranges = [];
  }

  get rangeCount() {
    return this.ranges.length;
  }

  getRangeAt(index) {
    return this.ranges[index];
  }

  removeAllRanges() {
    this.ranges = [];
  }

  addRange(range) {
    this.ranges = [range];
  }
}

class FakeDocument {
  constructor() {
    this.documentElement = new FakeElement('html');
    this.head = new FakeElement('head');
    this.body = new FakeElement('body');
    this.activeElement = null;
    this.listeners = new Map();
    this.selection = new FakeSelection();

    this.documentElement.ownerDocument = this;
    this.head.ownerDocument = this;
    this.body.ownerDocument = this;

    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  emit(type, event) {
    const listeners = this.listeners.get(type);
    if (!listeners) return;
    listeners.forEach((listener) => listener(event));
  }

  createElement(tagName) {
    const element = new FakeElement(tagName);
    element.ownerDocument = this;
    return element;
  }

  createTextNode(text) {
    const node = new FakeText(text);
    node.ownerDocument = this;
    return node;
  }

  createDocumentFragment() {
    return new FakeDocumentFragment(this);
  }

  createRange() {
    return new FakeRange();
  }

  querySelector(selector) {
    return this.documentElement.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.documentElement.querySelectorAll(selector);
  }

  getElementById(id) {
    return this.querySelector(`#${id}`);
  }

  contains(node) {
    return this.documentElement.contains(node);
  }
}

class FakeWindow {
  constructor(document) {
    this.document = document;
    this.innerWidth = 1365;
    this.innerHeight = 900;
    this.listeners = new Map();
    this.setTimeout = (...args) => setTimeout(...args);
    this.clearTimeout = (timerId) => clearTimeout(timerId);
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  emit(type, event) {
    this.listeners.get(type)?.forEach((listener) => listener(event));
  }

  getSelection() {
    return this.document.selection;
  }
}

function installFakeDom() {
  const document = new FakeDocument();
  const window = new FakeWindow(document);

  globalThis.document = document;
  globalThis.window = window;
  globalThis.HTMLElement = FakeElement;
  globalThis.Element = FakeElement;
  globalThis.Text = FakeText;
  globalThis.DocumentFragment = FakeDocumentFragment;
  globalThis.Node = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    DOCUMENT_FRAGMENT_NODE: 11,
  };

  if (!globalThis.Event) {
    class EventPolyfill {
      constructor(type, params = {}) {
        this.type = type;
        this.bubbles = Boolean(params.bubbles);
        this.cancelable = Boolean(params.cancelable);
      }
    }
    globalThis.Event = EventPolyfill;
  }

  if (!globalThis.CustomEvent) {
    class CustomEventPolyfill extends globalThis.Event {
      constructor(type, params) {
        super(type, params);
        this.detail = params?.detail;
      }
    }
    globalThis.CustomEvent = CustomEventPolyfill;
  }

  return { document, window };
}

function createEditor(env) {
  const editor = env.document.createElement('div');
  editor.classList.add('rte-content');
  editor.setAttribute('contenteditable', 'true');
  env.document.body.appendChild(editor);
  return editor;
}

function appendCitationRef(editor, citation) {
  const ref = editor.ownerDocument.createElement('span');
  ref.className = 'rte-citation-ref';
  ref.setAttribute('data-citation-id', citation.id);
  ref.setAttribute('data-citation-author', citation.author || 'Unknown');
  ref.setAttribute('data-citation-year', citation.year || '');
  ref.setAttribute('data-citation-title', citation.title || 'Untitled');
  ref.setAttribute('data-citation-source', citation.source || '');
  ref.setAttribute('data-citation-url', citation.url || '');
  ref.setAttribute('data-citation-note', citation.note || '');
  ref.textContent = `(${citation.author || 'Unknown'}, ${citation.year || 'n.d.'})`;

  editor.appendChild(ref);
  editor.appendChild(editor.ownerDocument.createTextNode(' '));
  return ref;
}

describe('CitationsPlugin', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();
    installFakeDom();
  });

  afterEach(() => {
    jest.useRealTimers();
    delete globalThis.document;
    delete globalThis.window;
    delete globalThis.HTMLElement;
    delete globalThis.Element;
    delete globalThis.Text;
    delete globalThis.DocumentFragment;
    delete globalThis.Node;
  });

  it('isolates citation records and style per editor instance', async () => {
    const { CitationsPlugin } = require('./CitationsPlugin.native.ts');
    const env = { document: globalThis.document, window: globalThis.window };

    const editorA = createEditor(env);
    const editorB = createEditor(env);

    appendCitationRef(editorA, {
      id: 'policy-2024',
      author: 'Nielsen',
      year: '2024',
      title: 'Policy Automation at Scale',
    });

    appendCitationRef(editorB, {
      id: 'ops-2025',
      author: 'Miller',
      year: '2025',
      title: 'Operational Checklists in Practice',
    });

    const plugin = CitationsPlugin();

    plugin.init?.call({ __pluginConfig: { defaultStyle: 'mla', debounceMs: 20 } }, { editorElement: editorA });
    plugin.init?.call({ __pluginConfig: { defaultStyle: 'chicago', debounceMs: 20 } }, { editorElement: editorB });

    jest.advanceTimersByTime(100);
    await Promise.resolve();

    let recordsA = [];
    let recordsB = [];
    let styleA = '';
    let styleB = '';

    editorA.addEventListener('editora:citations-data', (event) => {
      styleA = event.detail?.style || '';
    });

    editorB.addEventListener('editora:citations-data', (event) => {
      styleB = event.detail?.style || '';
    });

    plugin.commands?.getCitationRecords?.((records) => {
      recordsA = records;
    }, { contentElement: editorA });

    plugin.commands?.getCitationRecords?.((records) => {
      recordsB = records;
    }, { contentElement: editorB });

    expect(recordsA).toHaveLength(1);
    expect(recordsA[0].title).toContain('Policy Automation');
    expect(styleA).toBe('mla');

    expect(recordsB).toHaveLength(1);
    expect(recordsB[0].title).toContain('Operational Checklists');
    expect(styleB).toBe('chicago');

    plugin.destroy?.();
    plugin.destroy?.();
  });

  it('deleteCitation removes references and supports reinserting from recent cache', async () => {
    const { CitationsPlugin } = require('./CitationsPlugin.native.ts');
    const env = { document: globalThis.document, window: globalThis.window };

    const editor = createEditor(env);
    appendCitationRef(editor, {
      id: 'nielsen-2024',
      author: 'Nielsen',
      year: '2024',
      title: 'Designing Content Workflows',
      note: 'Used in governance section',
    });
    appendCitationRef(editor, {
      id: 'nielsen-2024',
      author: 'Nielsen',
      year: '2024',
      title: 'Designing Content Workflows',
      note: 'Second occurrence',
    });

    const plugin = CitationsPlugin({ debounceMs: 20, enableFootnoteSync: true });
    plugin.init?.call({}, { editorElement: editor });

    jest.advanceTimersByTime(100);
    await Promise.resolve();

    expect(editor.querySelectorAll('.rte-citation-ref[data-citation-id]')).toHaveLength(2);
    expect(editor.querySelector('.rte-citation-bibliography[data-type="citation-bibliography"]')).not.toBeNull();
    expect(editor.querySelector('.rte-citation-footnotes[data-type="citation-footnotes"]')).not.toBeNull();

    const removed = plugin.commands?.deleteCitation?.('nielsen-2024', { contentElement: editor });
    expect(removed).toBe(true);

    expect(editor.querySelectorAll('.rte-citation-ref[data-citation-id]')).toHaveLength(0);
    expect(editor.querySelector('.rte-citation-bibliography[data-type="citation-bibliography"]')).toBeNull();
    expect(editor.querySelector('.rte-citation-footnotes[data-type="citation-footnotes"]')).toBeNull();

    const reinsertedById = plugin.commands?.insertRecentCitation?.('nielsen-2024', { contentElement: editor });
    expect(reinsertedById).toBe(true);
    expect(editor.querySelectorAll('.rte-citation-ref[data-citation-id]')).toHaveLength(1);

    const removedAgain = plugin.commands?.deleteCitation?.('nielsen-2024', { contentElement: editor });
    expect(removedAgain).toBe(true);

    const reinsertedLatest = plugin.commands?.insertRecentCitation?.(undefined, { contentElement: editor });
    expect(reinsertedLatest).toBe(true);
    expect(editor.querySelectorAll('.rte-citation-ref[data-citation-id]')).toHaveLength(1);

    plugin.destroy?.();
  });

  it('supports refresh/data events and runtime option updates', async () => {
    const { CitationsPlugin } = require('./CitationsPlugin.native.ts');
    const env = { document: globalThis.document, window: globalThis.window };

    const editor = createEditor(env);
    appendCitationRef(editor, {
      id: 'same-source',
      author: 'Ng',
      year: '2023',
      title: 'Structured Authoring Patterns',
      source: 'Editorial Engineering Review',
    });

    appendCitationRef(editor, {
      id: 'same-source',
      author: 'Ng',
      year: '2023',
      title: 'Structured Authoring Patterns',
      source: 'Editorial Engineering Review',
    });

    const plugin = CitationsPlugin({ debounceMs: 20, defaultStyle: 'apa', enableFootnoteSync: true });
    plugin.init?.call({}, { editorElement: editor });

    let refreshedCitations = [];
    let refreshedStyle = '';

    editor.addEventListener('editora:citations-refreshed', (event) => {
      refreshedCitations = event.detail?.citations || [];
      refreshedStyle = event.detail?.style || '';
    });

    jest.advanceTimersByTime(100);
    await Promise.resolve();

    const initialRefresh = plugin.commands?.setCitationStyle?.('apa', { contentElement: editor });
    expect(initialRefresh).toBe(true);
    expect(refreshedCitations).toHaveLength(1);
    expect(refreshedStyle).toBe('apa');

    const changedStyle = plugin.commands?.setCitationStyle?.('chicago', { contentElement: editor });
    expect(changedStyle).toBe(true);
    expect(refreshedStyle).toBe('chicago');

    const updatedOptions = plugin.commands?.setCitationsOptions?.({ enableFootnoteSync: false }, { contentElement: editor });
    expect(updatedOptions).toBe(true);
    expect(editor.querySelector('.rte-citation-footnotes[data-type="citation-footnotes"]')).toBeNull();

    let callbackRecords = [];
    let eventRecords = [];
    let eventStyle = '';

    editor.addEventListener('editora:citations-data', (event) => {
      eventRecords = event.detail?.records || [];
      eventStyle = event.detail?.style || '';
    });

    plugin.commands?.getCitationRecords?.((records) => {
      callbackRecords = records;
    }, { contentElement: editor });

    expect(callbackRecords).toHaveLength(1);
    expect(eventRecords).toHaveLength(1);
    expect(eventStyle).toBe('chicago');
    expect(editor.__citationRecords).toHaveLength(1);

    plugin.destroy?.();
  });
});
