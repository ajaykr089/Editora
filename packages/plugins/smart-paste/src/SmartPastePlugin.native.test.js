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
        Object.defineProperty(event, 'target', {
          configurable: true,
          value: this,
        });
      }
    } catch {
      // Ignore readonly target.
    }

    this.listeners.get(event.type)?.forEach((listener) => listener(event));
    return true;
  }
}

class FakeElement extends MiniEventTarget {
  constructor(tagName = 'div') {
    super();
    this.nodeType = 1;
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.ownerDocument = null;
    this.classList = new FakeClassList();
    this.style = {};
    this.innerHTML = '';
    this.textContent = '';
    this.id = '';
    this.attrs = new Map();
  }

  get isConnected() {
    let current = this;
    while (current.parentNode) {
      current = current.parentNode;
    }
    return current.tagName === 'BODY' || current.tagName === 'HEAD' || current.tagName === 'HTML';
  }

  get className() {
    return Array.from(this.classList.classes).join(' ');
  }

  appendChild(child) {
    child.parentNode = this;
    child.ownerDocument = this.ownerDocument;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
      child.parentNode = null;
      if (this.ownerDocument && typeof this.ownerDocument.notifyMutation === 'function') {
        this.ownerDocument.notifyMutation(this, child);
      }
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
      value
        .split(/\s+/)
        .filter(Boolean)
        .forEach((token) => this.classList.add(token));
    }

    if (name === 'id') this.id = value;
    this.attrs.set(name, value);
  }

  getAttribute(name) {
    if (name === 'id' && this.id) return this.id;
    return this.attrs.has(name) ? this.attrs.get(name) : null;
  }

  hasAttribute(name) {
    return this.attrs.has(name) || (name === 'id' && Boolean(this.id));
  }

  removeAttribute(name) {
    if (name === 'id') this.id = '';
    this.attrs.delete(name);
  }

  matches(selector) {
    const selectors = selector
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    return selectors.some((item) => this.matchesSingle(item));
  }

  matchesSingle(selector) {
    if (selector === '.rte-content') return this.classList.contains('rte-content');
    if (selector === '.editora-content') return this.classList.contains('editora-content');
    if (selector === '.rte-editor') return this.classList.contains('rte-editor');
    if (selector === '.editora-editor') return this.classList.contains('editora-editor');
    if (selector === 'editora-editor') return this.tagName.toLowerCase() === 'editora-editor';

    if (selector === '[data-editora-editor]') {
      return this.hasAttribute('data-editora-editor');
    }

    if (selector.startsWith('.')) {
      const classPart = selector.slice(1).split('[')[0];
      if (classPart && !this.classList.contains(classPart)) return false;

      const attrMatch = selector.match(/\[([^=\]]+)=\"([^\"]*)\"\]/);
      if (attrMatch) {
        return this.getAttribute(attrMatch[1]) === attrMatch[2];
      }

      return true;
    }

    const attrMatch = selector.match(/^\[([^=\]]+)(?:=\"([^\"]*)\")?\]$/);
    if (attrMatch) {
      const attrName = attrMatch[1];
      const attrValue = attrMatch[2];
      const current = this.getAttribute(attrName);
      if (typeof attrValue === 'string') return current === attrValue;
      return current !== null;
    }

    return false;
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
      right: 610,
      bottom: 410,
      width: 600,
      height: 400,
      toJSON: () => ({}),
    };
  }
}

class FakeTemplateNode {
  constructor(tagName, attributes = {}) {
    this.nodeType = 1;
    this.tagName = String(tagName || 'div').toUpperCase();
    this._attrs = new Map();
    Object.entries(attributes).forEach(([name, value]) => {
      this._attrs.set(name, String(value));
    });
    this.isConnected = true;
    this.children = [];
    this.textContent = '';
    this.style = {
      cssText: this._attrs.get('style') || '',
    };
    this.parentNode = {
      insertBefore: () => {},
      removeChild: () => {
        this.remove();
      },
    };
  }

  get attributes() {
    return Array.from(this._attrs.entries()).map(([name, value]) => ({ name, value }));
  }

  get className() {
    return this._attrs.get('class') || '';
  }

  get firstChild() {
    return null;
  }

  setAttribute(name, value) {
    this._attrs.set(name, String(value));
    if (name.toLowerCase() === 'style') {
      this.style.cssText = String(value);
    }
  }

  getAttribute(name) {
    return this._attrs.has(name) ? this._attrs.get(name) : null;
  }

  removeAttribute(name) {
    this._attrs.delete(name);
    if (name.toLowerCase() === 'style') {
      this.style.cssText = '';
    }
  }

  remove() {
    this.isConnected = false;
  }

  replaceWith() {
    this.isConnected = false;
  }
}

function parseAttributes(rawAttributes) {
  const attributes = {};
  const attrRegex = /([^\s=/>]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match = attrRegex.exec(rawAttributes);

  while (match) {
    const name = match[1];
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    attributes[name] = value;
    match = attrRegex.exec(rawAttributes);
  }

  return attributes;
}

function createTemplateContent(rawHTML) {
  const nodes = [];
  const tagRegex = /<([a-zA-Z][a-zA-Z0-9:-]*)([^>]*)>/g;
  let match = tagRegex.exec(rawHTML);

  while (match) {
    const tagName = match[1];
    const rawAttributes = match[2] || '';
    nodes.push(new FakeTemplateNode(tagName, parseAttributes(rawAttributes)));
    match = tagRegex.exec(rawHTML);
  }

  return {
    querySelectorAll(selector) {
      if (selector !== '*') return [];
      return nodes.filter((node) => node.isConnected);
    },
    get textContent() {
      return rawHTML.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    },
  };
}

class FakeTemplateElement extends FakeElement {
  constructor() {
    super('template');
    this._rawHTML = '';
    this.content = createTemplateContent('');
  }

  set innerHTML(value) {
    this._rawHTML = String(value || '');
    this.content = createTemplateContent(this._rawHTML);
  }

  get innerHTML() {
    return this._rawHTML;
  }
}

class FakeMutationObserver {
  constructor(callback) {
    this.callback = callback;
    this.document = null;
  }

  observe(target) {
    this.document = target?.ownerDocument || null;
    this.document?.registerMutationObserver(this);
  }

  disconnect() {
    this.document?.unregisterMutationObserver(this);
    this.document = null;
  }

  trigger(records) {
    this.callback(records);
  }
}

class FakeDocument {
  constructor() {
    this.documentElement = new FakeElement('html');
    this.head = new FakeElement('head');
    this.body = new FakeElement('body');
    this.activeElement = null;
    this.listeners = new Map();
    this.editors = [];
    this.mutationObservers = new Set();

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
    if (String(tagName).toLowerCase() === 'template') {
      const template = new FakeTemplateElement();
      template.ownerDocument = this;
      return template;
    }

    const element = new FakeElement(tagName);
    element.ownerDocument = this;
    return element;
  }

  createTextNode(text) {
    return {
      nodeType: 3,
      data: text,
      parentNode: null,
    };
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

  querySelector(selector) {
    if (selector.includes('.rte-content') || selector.includes('.editora-content')) {
      return this.editors[0] || null;
    }
    return null;
  }

  registerMutationObserver(observer) {
    this.mutationObservers.add(observer);
  }

  unregisterMutationObserver(observer) {
    this.mutationObservers.delete(observer);
  }

  notifyMutation(parent, removedNode) {
    const record = {
      type: 'childList',
      target: parent,
      removedNodes: [removedNode],
      addedNodes: [],
    };

    this.mutationObservers.forEach((observer) => observer.trigger([record]));
  }
}

function createEditorPair(document) {
  const hostA = document.createElement('div');
  hostA.setAttribute('data-editora-editor', 'true');
  hostA.classList.add('rte-editor');

  const editorA = document.createElement('div');
  editorA.classList.add('rte-content');
  editorA.innerHTML = '<p>Editor A</p>';

  const hostB = document.createElement('div');
  hostB.setAttribute('data-editora-editor', 'true');
  hostB.classList.add('rte-editor');

  const editorB = document.createElement('div');
  editorB.classList.add('rte-content');
  editorB.innerHTML = '<p>Editor B</p>';

  hostA.appendChild(editorA);
  hostB.appendChild(editorB);
  document.body.appendChild(hostA);
  document.body.appendChild(hostB);

  document.editors = [editorA, editorB];

  return {
    hostA,
    editorA,
    hostB,
    editorB,
  };
}

describe('SmartPastePlugin', () => {
  let fakeDocument;
  let fakeWindow;
  let originalDocument;
  let originalWindow;
  let originalMutationObserver;
  let originalCustomEvent;
  let originalHTMLElement;
  let originalNode;
  let originalEvent;

  beforeEach(() => {
    jest.resetModules();

    fakeDocument = new FakeDocument();
    fakeWindow = {
      getSelection: () => null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      innerWidth: 1280,
      innerHeight: 800,
      executeEditorCommand: jest.fn(),
    };

    originalDocument = global.document;
    originalWindow = global.window;
    originalMutationObserver = global.MutationObserver;
    originalCustomEvent = global.CustomEvent;
    originalHTMLElement = global.HTMLElement;
    originalNode = global.Node;
    originalEvent = global.Event;

    global.document = fakeDocument;
    global.window = fakeWindow;
    global.MutationObserver = FakeMutationObserver;
    global.HTMLElement = FakeElement;
    global.Node = {
      ELEMENT_NODE: 1,
      TEXT_NODE: 3,
    };
    global.Event = class Event {
      constructor(type, init = {}) {
        this.type = type;
        this.bubbles = Boolean(init.bubbles);
      }
    };
    global.CustomEvent = class CustomEvent {
      constructor(type, init = {}) {
        this.type = type;
        this.detail = init.detail;
        this.bubbles = Boolean(init.bubbles);
      }
    };

    fakeDocument.execCommand = jest.fn(() => true);
    global.document.execCommand = fakeDocument.execCommand;
  });

  afterEach(() => {
    global.document = originalDocument;
    global.window = originalWindow;
    global.MutationObserver = originalMutationObserver;
    global.CustomEvent = originalCustomEvent;
    global.HTMLElement = originalHTMLElement;
    global.Node = originalNode;
    global.Event = originalEvent;
  });

  it('cycles profile and toggles enabled state through commands', () => {
    const { SmartPastePlugin } = require('./SmartPastePlugin.native.ts');
    const plugin = SmartPastePlugin();
    const { editorA } = createEditorPair(fakeDocument);

    plugin.init.call({}, { editorElement: editorA });

    let snapshot = null;
    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });

    expect(snapshot.profile).toBe('fidelity');
    expect(snapshot.enabled).toBe(true);

    plugin.commands.cycleSmartPasteProfile(undefined, { contentElement: editorA });
    plugin.commands.toggleSmartPasteEnabled(undefined, { contentElement: editorA });

    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });

    expect(snapshot.profile).toBe('balanced');
    expect(snapshot.enabled).toBe(false);
  });

  it('honors explicit command context for multi-instance editors', () => {
    const { SmartPastePlugin } = require('./SmartPastePlugin.native.ts');
    const plugin = SmartPastePlugin();
    const { hostA, editorA, hostB, editorB } = createEditorPair(fakeDocument);

    plugin.init.call({}, { editorElement: editorA });
    plugin.init.call({}, { editorElement: editorB });

    fakeWindow.__editoraCommandEditorRoot = hostB;
    plugin.commands.setSmartPasteProfile('plain');

    let stateA = null;
    let stateB = null;

    fakeWindow.__editoraCommandEditorRoot = hostA;
    plugin.commands.getSmartPasteState((state) => {
      stateA = state;
    });

    fakeWindow.__editoraCommandEditorRoot = hostB;
    plugin.commands.getSmartPasteState((state) => {
      stateB = state;
    });

    expect(stateA.profile).toBe('fidelity');
    expect(stateB.profile).toBe('plain');
  });

  it('does not resolve to first editor when command context is missing', () => {
    const { SmartPastePlugin } = require('./SmartPastePlugin.native.ts');
    const plugin = SmartPastePlugin();
    const { editorA } = createEditorPair(fakeDocument);

    plugin.init.call({}, { editorElement: editorA });

    const updated = plugin.commands.setSmartPasteProfile('plain');
    expect(updated).toBe(false);

    let snapshot = null;
    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });

    expect(snapshot.profile).toBe('fidelity');
  });

  it('does not apply keyboard shortcuts when focus is outside editor', () => {
    const { SmartPastePlugin } = require('./SmartPastePlugin.native.ts');
    const plugin = SmartPastePlugin();
    const { editorA } = createEditorPair(fakeDocument);

    const outsideInput = fakeDocument.createElement('input');
    fakeDocument.body.appendChild(outsideInput);

    plugin.init.call({}, { editorElement: editorA });

    fakeDocument.emit('keydown', {
      type: 'keydown',
      key: 'v',
      ctrlKey: true,
      metaKey: false,
      altKey: true,
      shiftKey: true,
      target: outsideInput,
      defaultPrevented: false,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });

    let snapshot = null;
    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });

    expect(snapshot.profile).toBe('fidelity');
  });

  it('falls back to plain text when html payload exceeds maxHtmlLength', () => {
    const { SmartPastePlugin } = require('./SmartPastePlugin.native.ts');
    const plugin = SmartPastePlugin({ maxHtmlLength: 8000 });
    const { editorA } = createEditorPair(fakeDocument);

    plugin.init.call({}, { editorElement: editorA });

    const event = {
      type: 'paste',
      defaultPrevented: false,
      clipboardData: {
        getData: (type) => {
          if (type === 'text/html') return `<p>${'x'.repeat(9000)}</p>`;
          if (type === 'text/plain') return 'fallback   content';
          return '';
        },
      },
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
    };

    editorA.dispatchEvent(event);

    let snapshot = null;
    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });

    expect(snapshot.lastReport).toBeTruthy();
    expect(snapshot.lastReport.outputHtmlLength).toBe(0);
    expect(snapshot.lastReport.outputTextLength).toBe('fallback content'.length);
  });

  it('preserves more whitespace in fidelity profile than balanced profile', () => {
    const { SmartPastePlugin } = require('./SmartPastePlugin.native.ts');
    const plugin = SmartPastePlugin();
    const { editorA } = createEditorPair(fakeDocument);

    plugin.init.call({}, { editorElement: editorA });

    const html = '<p>A   B</p>   <p>C</p>';

    const fidelityEvent = {
      type: 'paste',
      defaultPrevented: false,
      clipboardData: {
        getData: (type) => (type === 'text/html' ? html : 'A B C'),
      },
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
    };

    editorA.dispatchEvent(fidelityEvent);

    let snapshot = null;
    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });
    const fidelityLength = snapshot.lastReport.outputHtmlLength;

    plugin.commands.setSmartPasteProfile('balanced', { contentElement: editorA });

    const balancedEvent = {
      type: 'paste',
      defaultPrevented: false,
      clipboardData: {
        getData: (type) => (type === 'text/html' ? html : 'A B C'),
      },
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
    };

    editorA.dispatchEvent(balancedEvent);

    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });
    const balancedLength = snapshot.lastReport.outputHtmlLength;

    expect(fidelityLength).toBeGreaterThan(balancedLength);
  });

  it('reports sanitizer removals for malicious html payloads', () => {
    const { SmartPastePlugin } = require('./SmartPastePlugin.native.ts');
    const plugin = SmartPastePlugin();
    const { editorA } = createEditorPair(fakeDocument);

    plugin.init.call({}, { editorElement: editorA });

    const maliciousHTML = [
      '<script>alert(1)</script>',
      '<p onclick="evil()" style="background-image:url(javascript:alert(1)); color: red">safe text</p>',
      '<img src="javascript:alert(2)" alt="x">',
    ].join('');

    const event = {
      type: 'paste',
      defaultPrevented: false,
      clipboardData: {
        getData: (type) => (type === 'text/html' ? maliciousHTML : 'safe text'),
      },
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
    };

    editorA.dispatchEvent(event);

    let snapshot = null;
    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });

    expect(snapshot.lastReport).toBeTruthy();
    expect(snapshot.lastReport.removedElements).toBeGreaterThanOrEqual(2);
    expect(snapshot.lastReport.removedAttributes).toBeGreaterThanOrEqual(1);
    expect(snapshot.lastReport.normalizedStyles).toBeGreaterThanOrEqual(1);
  });

  it('does not re-handle an already prevented paste event', () => {
    const { SmartPastePlugin } = require('./SmartPastePlugin.native.ts');
    const plugin = SmartPastePlugin();
    const { editorA } = createEditorPair(fakeDocument);

    plugin.init.call({}, { editorElement: editorA });

    const event = {
      type: 'paste',
      defaultPrevented: true,
      clipboardData: {
        getData: () => 'ignored',
      },
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
    };

    editorA.dispatchEvent(event);

    let snapshot = null;
    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });

    expect(snapshot.lastReport).toBeNull();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('handles paste event and records last report', () => {
    const { SmartPastePlugin } = require('./SmartPastePlugin.native.ts');
    const plugin = SmartPastePlugin();
    const { editorA } = createEditorPair(fakeDocument);

    plugin.init.call({}, { editorElement: editorA });

    const event = {
      type: 'paste',
      defaultPrevented: false,
      clipboardData: {
        getData: (type) => (type === 'text/plain' ? 'email: demo@acme.com' : ''),
      },
      preventDefault: jest.fn(),
      stopImmediatePropagation: jest.fn(),
      stopPropagation: jest.fn(),
    };

    editorA.dispatchEvent(event);

    let snapshot = null;
    plugin.commands.getSmartPasteState((state) => {
      snapshot = state;
    }, { contentElement: editorA });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopImmediatePropagation).toHaveBeenCalled();
    expect(event.__editoraSmartPasteHandled).toBe(true);
    expect(snapshot.lastReport).toBeTruthy();
    expect(snapshot.lastReport.profile).toBe('fidelity');
    expect(snapshot.lastReport.outputTextLength).toBeGreaterThan(0);
  });
});
