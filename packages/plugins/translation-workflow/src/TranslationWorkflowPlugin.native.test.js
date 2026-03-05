const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');

class FakeClassList {
  constructor() {
    this.classes = new Set();
  }

  add(...tokens) {
    tokens.forEach((token) => this.classes.add(token));
  }

  remove(...tokens) {
    tokens.forEach((token) => this.classes.delete(token));
  }

  contains(token) {
    return this.classes.has(token);
  }

  toggle(token, force) {
    if (typeof force === 'boolean') {
      if (force) this.classes.add(token);
      else this.classes.delete(token);
      return force;
    }

    if (this.classes.has(token)) {
      this.classes.delete(token);
      return false;
    }

    this.classes.add(token);
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
        Object.defineProperty(event, 'target', { configurable: true, value: this });
      }
    } catch {
      // Ignore readonly target.
    }

    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
    return true;
  }
}

class FakeElement extends MiniEventTarget {
  constructor(tagName = 'div') {
    super();
    this.nodeType = 1;
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.ownerDocument = null;
    this.classList = new FakeClassList();
    this.attrs = new Map();
    this.style = {};
    this.innerHTML = '';
    this.textContent = '';
    this.id = '';
  }

  get className() {
    return Array.from(this.classList.classes).join(' ');
  }

  set className(value) {
    this.classList = new FakeClassList();
    String(value || '')
      .split(/\s+/)
      .filter(Boolean)
      .forEach((token) => this.classList.add(token));
  }

  get childNodes() {
    return this.children;
  }

  get nextSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.children || [];
    const index = siblings.indexOf(this);
    if (index < 0) return null;
    return siblings[index + 1] || null;
  }

  get isConnected() {
    let current = this;
    while (current.parentNode) {
      current = current.parentNode;
    }
    return current.tagName === 'BODY' || current.tagName === 'HTML';
  }

  appendChild(child) {
    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;
    this.children.push(child);
    return child;
  }

  insertBefore(child, referenceNode) {
    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;

    if (!referenceNode) {
      this.children.push(child);
      return child;
    }

    const index = this.children.indexOf(referenceNode);
    if (index < 0) {
      this.children.push(child);
      return child;
    }

    this.children.splice(index, 0, child);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  }

  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }

  contains(node) {
    if (!node) return false;
    if (node === this) return true;
    return this.children.some((child) => child.contains?.(node));
  }

  setAttribute(name, value) {
    if (name === 'class') {
      this.className = value;
      return;
    }
    if (name === 'id') {
      this.id = String(value);
      return;
    }
    this.attrs.set(name, String(value));
  }

  getAttribute(name) {
    if (name === 'id') return this.id || null;
    return this.attrs.has(name) ? this.attrs.get(name) : null;
  }

  hasAttribute(name) {
    return name === 'id' ? Boolean(this.id) : this.attrs.has(name);
  }

  removeAttribute(name) {
    if (name === 'id') {
      this.id = '';
      return;
    }
    this.attrs.delete(name);
  }

  matches(selector) {
    const selectors = String(selector)
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    return selectors.some((entry) => this.matchesSingle(entry));
  }

  matchesSingle(selector) {
    if (!selector) return false;

    if (selector.startsWith('.')) {
      const classMatch = selector.match(/^\.([a-zA-Z0-9_-]+)/);
      if (classMatch && !this.classList.contains(classMatch[1])) return false;

      const attrMatch = selector.match(/\[([^=\]]+)=\"([^\"]*)\"\]/);
      if (attrMatch) {
        return this.getAttribute(attrMatch[1]) === attrMatch[2];
      }
      return true;
    }

    if (selector.startsWith('[')) {
      const attrMatch = selector.match(/^\[([^=\]]+)(?:=\"([^\"]*)\")?\]$/);
      if (!attrMatch) return false;
      const current = this.getAttribute(attrMatch[1]);
      if (typeof attrMatch[2] === 'string') return current === attrMatch[2];
      return current !== null;
    }

    return this.tagName.toLowerCase() === selector.toLowerCase();
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
    const queue = [...this.children];
    while (queue.length > 0) {
      const next = queue.shift();
      if (next.matches && next.matches(selector)) return next;
      if (next.children?.length) queue.push(...next.children);
    }
    return null;
  }

  querySelectorAll(selector) {
    const matched = [];
    const queue = [...this.children];
    while (queue.length > 0) {
      const next = queue.shift();
      if (next.matches && next.matches(selector)) matched.push(next);
      if (next.children?.length) queue.push(...next.children);
    }
    return matched;
  }

  focus() {
    if (this.ownerDocument) {
      this.ownerDocument.activeElement = this;
    }
  }

  getBoundingClientRect() {
    return {
      x: 10,
      y: 10,
      top: 10,
      left: 10,
      right: 620,
      bottom: 420,
      width: 610,
      height: 410,
      toJSON: () => ({}),
    };
  }
}

class FakeDocument {
  constructor() {
    this.documentElement = new FakeElement('html');
    this.head = new FakeElement('head');
    this.body = new FakeElement('body');
    this.activeElement = null;
    this.listeners = new Map();

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

  createElement(tagName) {
    const element = new FakeElement(tagName);
    element.ownerDocument = this;
    return element;
  }

  querySelector(selector) {
    return this.documentElement.querySelector(selector);
  }

  getElementById(id) {
    const queue = [this.head, this.body];
    while (queue.length > 0) {
      const next = queue.shift();
      if (next.id === id) return next;
      queue.push(...next.children);
    }
    return null;
  }

  createRange() {
    return {
      selectNodeContents: () => {},
      collapse: () => {},
    };
  }
}

function createEditorHost(document) {
  const host = document.createElement('div');
  host.classList.add('rte-editor');
  host.setAttribute('data-editora-editor', 'true');

  const editor = document.createElement('div');
  editor.classList.add('rte-content');
  editor.setAttribute('contenteditable', 'true');

  host.appendChild(editor);
  document.body.appendChild(host);
  return { host, editor };
}

function setParagraphs(document, editor, texts) {
  editor.children = [];
  texts.forEach((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    editor.appendChild(paragraph);
  });
}

function setNestedCellWithParagraph(document, editor, text) {
  editor.children = [];
  const tableCell = document.createElement('td');
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  tableCell.appendChild(paragraph);
  editor.appendChild(tableCell);
  return { tableCell, paragraph };
}

function appendToolbarToggle(host, command) {
  const button = host.ownerDocument.createElement('button');
  button.classList.add('rte-toolbar-button');
  button.setAttribute('data-command', command);
  host.appendChild(button);
  return button;
}

describe('TranslationWorkflowPlugin', () => {
  let originalWindow;
  let originalDocument;
  let originalHTMLElement;
  let originalNode;
  let originalCustomEvent;
  let originalEvent;

  beforeEach(() => {
    jest.resetModules();
    originalWindow = global.window;
    originalDocument = global.document;
    originalHTMLElement = global.HTMLElement;
    originalNode = global.Node;
    originalCustomEvent = global.CustomEvent;
    originalEvent = global.Event;
  });

  afterEach(() => {
    global.window = originalWindow;
    global.document = originalDocument;
    global.HTMLElement = originalHTMLElement;
    global.Node = originalNode;
    global.CustomEvent = originalCustomEvent;
    global.Event = originalEvent;
  });

  function setupRuntime() {
    const fakeDocument = new FakeDocument();
    const fakeWindow = {
      getSelection: () => null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      setTimeout,
      clearTimeout,
      innerWidth: 1280,
      innerHeight: 900,
      executeEditorCommand: jest.fn(),
    };

    global.document = fakeDocument;
    global.window = fakeWindow;
    global.HTMLElement = FakeElement;
    global.Node = { ELEMENT_NODE: 1, TEXT_NODE: 3 };
    global.CustomEvent = class CustomEvent {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
        this.bubbles = Boolean(init.bubbles);
      }
    };
    global.Event = class Event {
      constructor(type, init = {}) {
        this.type = type;
        this.bubbles = Boolean(init.bubbles);
      }
    };

    return { fakeDocument };
  }

  it('detects token mismatch against captured source text', () => {
    const { fakeDocument } = setupRuntime();
    const { TranslationWorkflowPlugin } = require('./TranslationWorkflowPlugin.native.ts');

    const plugin = TranslationWorkflowPlugin({
      sourceLocale: 'en-US',
      targetLocale: 'fr-FR',
      enableRealtime: false,
    });

    const { host, editor } = createEditorHost(fakeDocument);
    setParagraphs(fakeDocument, editor, ['Welcome {{name}} to the release notes.']);
    plugin.init.call({}, { editorElement: host });

    editor.children[0].textContent = 'Bienvenue dans les notes de version.';

    expect(plugin.commands.runTranslationLocaleValidation(undefined, { contentElement: editor })).toBe(true);

    let snapshot = null;
    plugin.commands.getTranslationWorkflowState((state) => {
      snapshot = state;
    }, { contentElement: editor });

    expect(snapshot).toBeTruthy();
    expect(snapshot.issues.some((issue) => issue.type === 'token-mismatch')).toBe(true);
  });

  it('locks and unlocks a selected segment', () => {
    const { fakeDocument } = setupRuntime();
    const { TranslationWorkflowPlugin } = require('./TranslationWorkflowPlugin.native.ts');

    const plugin = TranslationWorkflowPlugin({ enableRealtime: false });
    const { host, editor } = createEditorHost(fakeDocument);
    setParagraphs(fakeDocument, editor, ['Segment A', 'Segment B']);
    plugin.init.call({}, { editorElement: host });

    plugin.commands.runTranslationLocaleValidation(undefined, { contentElement: editor });

    const firstSegment = editor.children[0];
    const firstSegmentId = firstSegment.getAttribute('data-translation-segment-id');
    expect(firstSegmentId).toBeTruthy();

    expect(
      plugin.commands.toggleTranslationSegmentLock({ segmentId: firstSegmentId, locked: true }, { contentElement: editor }),
    ).toBe(true);
    expect(firstSegment.getAttribute('data-translation-locked')).toBe('true');
    expect(firstSegment.getAttribute('contenteditable')).toBe('false');

    expect(
      plugin.commands.toggleTranslationSegmentLock({ segmentId: firstSegmentId, locked: false }, { contentElement: editor }),
    ).toBe(true);
    expect(firstSegment.getAttribute('data-translation-locked')).toBe(null);
    expect(firstSegment.getAttribute('contenteditable')).toBe('true');
  });

  it('does not execute panel shortcut from external focused input with stale selection', () => {
    const { fakeDocument } = setupRuntime();
    const { TranslationWorkflowPlugin } = require('./TranslationWorkflowPlugin.native.ts');

    const plugin = TranslationWorkflowPlugin({ enableRealtime: false });
    const { host, editor } = createEditorHost(fakeDocument);
    setParagraphs(fakeDocument, editor, ['Segment A']);
    plugin.init.call({}, { editorElement: host });

    const externalInput = fakeDocument.createElement('input');
    fakeDocument.body.appendChild(externalInput);
    externalInput.focus();

    global.window.getSelection = () => ({
      rangeCount: 1,
      getRangeAt: () => ({ startContainer: editor }),
    });

    const keydownListeners = Array.from(fakeDocument.listeners.get('keydown') || []);
    keydownListeners.forEach((listener) =>
      listener({
        type: 'keydown',
        key: 'l',
        ctrlKey: true,
        metaKey: false,
        altKey: true,
        shiftKey: true,
        target: externalInput,
        defaultPrevented: false,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      }),
    );

    const panel = fakeDocument.body.querySelector('.rte-translation-workflow-panel');
    expect(panel?.classList.contains('show')).not.toBe(true);
  });

  it('keeps realtime toggle active state isolated across editor instances', () => {
    const { fakeDocument } = setupRuntime();
    const { TranslationWorkflowPlugin } = require('./TranslationWorkflowPlugin.native.ts');

    const plugin = TranslationWorkflowPlugin({ enableRealtime: false });

    const { host: hostA, editor: editorA } = createEditorHost(fakeDocument);
    const { host: hostB, editor: editorB } = createEditorHost(fakeDocument);
    const buttonA = appendToolbarToggle(hostA, 'toggleTranslationRealtime');
    const buttonB = appendToolbarToggle(hostB, 'toggleTranslationRealtime');

    setParagraphs(fakeDocument, editorA, ['A1']);
    setParagraphs(fakeDocument, editorB, ['B1']);

    plugin.init.call({}, { editorElement: hostA });
    plugin.init.call({}, { editorElement: hostB });

    expect(buttonA.classList.contains('active')).toBe(false);
    expect(buttonB.classList.contains('active')).toBe(false);

    global.window.__editoraCommandEditorRoot = hostA;
    expect(plugin.commands.toggleTranslationRealtime(true)).toBe(true);
    expect(buttonA.classList.contains('active')).toBe(true);
    expect(buttonB.classList.contains('active')).toBe(false);

    global.window.__editoraCommandEditorRoot = hostB;
    expect(plugin.commands.toggleTranslationRealtime(true)).toBe(true);
    expect(buttonA.classList.contains('active')).toBe(true);
    expect(buttonB.classList.contains('active')).toBe(true);

    global.window.__editoraCommandEditorRoot = hostA;
    expect(plugin.commands.toggleTranslationRealtime(false)).toBe(true);
    expect(buttonA.classList.contains('active')).toBe(false);
    expect(buttonB.classList.contains('active')).toBe(true);

    let stateA = null;
    let stateB = null;
    plugin.commands.getTranslationWorkflowState((state) => {
      stateA = state;
    }, { contentElement: editorA });
    plugin.commands.getTranslationWorkflowState((state) => {
      stateB = state;
    }, { contentElement: editorB });

    expect(stateA.realtimeEnabled).toBe(false);
    expect(stateB.realtimeEnabled).toBe(true);
  });

  it('re-keys duplicate segment ids to unique values', () => {
    const { fakeDocument } = setupRuntime();
    const { TranslationWorkflowPlugin } = require('./TranslationWorkflowPlugin.native.ts');

    const plugin = TranslationWorkflowPlugin({ enableRealtime: false });
    const { host, editor } = createEditorHost(fakeDocument);
    setParagraphs(fakeDocument, editor, ['One', 'Two']);
    editor.children[0].setAttribute('data-translation-segment-id', 'dup-id');
    editor.children[1].setAttribute('data-translation-segment-id', 'dup-id');

    plugin.init.call({}, { editorElement: host });
    plugin.commands.runTranslationLocaleValidation(undefined, { contentElement: editor });

    const firstId = editor.children[0].getAttribute('data-translation-segment-id');
    const secondId = editor.children[1].getAttribute('data-translation-segment-id');
    expect(firstId).toBeTruthy();
    expect(secondId).toBeTruthy();
    expect(firstId).not.toBe(secondId);
  });

  it('keeps only leaf segment nodes when selector matches nested ancestors', () => {
    const { fakeDocument } = setupRuntime();
    const { TranslationWorkflowPlugin } = require('./TranslationWorkflowPlugin.native.ts');

    const plugin = TranslationWorkflowPlugin({ enableRealtime: false });
    const { host, editor } = createEditorHost(fakeDocument);
    setNestedCellWithParagraph(fakeDocument, editor, 'Nested segment');

    plugin.init.call({}, { editorElement: host });
    plugin.commands.runTranslationLocaleValidation(undefined, { contentElement: editor });

    let snapshot = null;
    plugin.commands.getTranslationWorkflowState((state) => {
      snapshot = state;
    }, { contentElement: editor });

    expect(snapshot.segmentCount).toBe(1);
  });

  it('restores locked segment content after external mutation', () => {
    const { fakeDocument } = setupRuntime();
    const { TranslationWorkflowPlugin } = require('./TranslationWorkflowPlugin.native.ts');

    const plugin = TranslationWorkflowPlugin({ enableRealtime: false });
    const { host, editor } = createEditorHost(fakeDocument);
    setParagraphs(fakeDocument, editor, ['Stable text']);

    plugin.init.call({}, { editorElement: host });
    plugin.commands.runTranslationLocaleValidation(undefined, { contentElement: editor });

    const segmentId = editor.children[0].getAttribute('data-translation-segment-id');
    expect(segmentId).toBeTruthy();
    plugin.commands.toggleTranslationSegmentLock({ segmentId, locked: true }, { contentElement: editor });

    const lockedSnapshot = editor.children[0].innerHTML;
    editor.children[0].innerHTML = 'Tampered externally';
    expect(editor.children[0].innerHTML).toBe('Tampered externally');
    plugin.commands.runTranslationLocaleValidation(undefined, { contentElement: editor });
    expect(editor.children[0].innerHTML).toBe(lockedSnapshot);
  });

  it('caps extracted segments by maxSegments for large documents', () => {
    const { fakeDocument } = setupRuntime();
    const { TranslationWorkflowPlugin } = require('./TranslationWorkflowPlugin.native.ts');

    const plugin = TranslationWorkflowPlugin({ enableRealtime: false, maxSegments: 50 });
    const { host, editor } = createEditorHost(fakeDocument);

    const rows = Array.from({ length: 120 }, (_, index) => `Row ${index + 1}`);
    setParagraphs(fakeDocument, editor, rows);

    plugin.init.call({}, { editorElement: host });
    plugin.commands.runTranslationLocaleValidation(undefined, { contentElement: editor });

    let snapshot = null;
    plugin.commands.getTranslationWorkflowState((state) => {
      snapshot = state;
    }, { contentElement: editor });

    expect(snapshot.segmentCount).toBe(50);
  });

  it('prefers explicit command context over stale global editor root', () => {
    const { fakeDocument } = setupRuntime();
    const { TranslationWorkflowPlugin } = require('./TranslationWorkflowPlugin.native.ts');

    const plugin = TranslationWorkflowPlugin({ enableRealtime: false });
    const { host: hostA, editor: editorA } = createEditorHost(fakeDocument);
    const { host: hostB, editor: editorB } = createEditorHost(fakeDocument);
    const buttonA = appendToolbarToggle(hostA, 'toggleTranslationRealtime');
    const buttonB = appendToolbarToggle(hostB, 'toggleTranslationRealtime');
    setParagraphs(fakeDocument, editorA, ['A']);
    setParagraphs(fakeDocument, editorB, ['B']);

    plugin.init.call({}, { editorElement: hostA });
    plugin.init.call({}, { editorElement: hostB });

    global.window.__editoraCommandEditorRoot = hostA;
    expect(plugin.commands.toggleTranslationRealtime(true, { editorElement: hostB })).toBe(true);
    expect(buttonA.classList.contains('active')).toBe(false);
    expect(buttonB.classList.contains('active')).toBe(true);
  });
});
