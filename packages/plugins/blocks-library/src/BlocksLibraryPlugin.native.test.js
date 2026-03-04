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
      x: 12,
      y: 12,
      top: 12,
      left: 12,
      right: 620,
      bottom: 412,
      width: 608,
      height: 400,
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

    this.execCommand = jest.fn(() => true);
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
}

const flush = async (cycles = 1) => {
  for (let index = 0; index < cycles; index += 1) {
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await Promise.resolve();
  }
};

function createEditorHost(document) {
  const host = document.createElement('div');
  host.classList.add('rte-editor');
  host.setAttribute('data-editora-editor', 'true');

  const editor = document.createElement('div');
  editor.classList.add('rte-content');
  editor.setAttribute('contenteditable', 'true');
  editor.innerHTML = '<p>Initial</p>';

  host.appendChild(editor);
  document.body.appendChild(host);

  return { host, editor };
}

describe('BlocksLibraryPlugin', () => {
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

  it('refreshes blocks when getBlocks source changes at runtime', async () => {
    const fakeDocument = new FakeDocument();
    const fakeWindow = {
      getSelection: () => null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
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

    const { BlocksLibraryPlugin } = require('./BlocksLibraryPlugin.native.ts');

    let source = 'alpha';
    const getBlocks = jest.fn(async () => {
      if (source === 'alpha') {
        return [{ id: 'alpha', label: 'Alpha', html: '<p>Alpha</p>' }];
      }
      return [{ id: 'beta', label: 'Beta', html: '<p>Beta</p>' }];
    });

    const plugin = BlocksLibraryPlugin({
      getBlocks,
      sanitizeBlockHtml: (html) => html,
    });

    const { host, editor } = createEditorHost(fakeDocument);
    plugin.init.call({}, { editorElement: host });

    plugin.commands.refreshBlocksLibraryData(undefined, { contentElement: editor });
    await flush(3);

    expect(plugin.commands.insertBlockSnippet('alpha', { contentElement: editor })).toBe(true);

    source = 'beta';
    plugin.commands.setBlocksLibraryOptions(
      {
        getBlocks,
      },
      { contentElement: editor },
    );
    await flush(3);

    expect(plugin.commands.insertBlockSnippet('alpha', { contentElement: editor })).toBe(false);
    expect(plugin.commands.insertBlockSnippet('beta', { contentElement: editor })).toBe(true);
    expect(getBlocks).toHaveBeenCalledTimes(2);
  });

  it('force refresh supersedes an in-flight load request', async () => {
    const fakeDocument = new FakeDocument();
    const fakeWindow = {
      getSelection: () => null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
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

    const { BlocksLibraryPlugin } = require('./BlocksLibraryPlugin.native.ts');

    let callCount = 0;
    let firstRequestAborted = false;
    const getBlocks = jest.fn((context) => {
      callCount += 1;
      if (callCount === 1) {
        return new Promise((resolve) => {
          context.signal.addEventListener('abort', () => {
            firstRequestAborted = true;
            resolve([]);
          });
        });
      }
      return Promise.resolve([{ id: 'fresh', label: 'Fresh', html: '<p>Fresh</p>' }]);
    });

    const plugin = BlocksLibraryPlugin({
      getBlocks,
      sanitizeBlockHtml: (html) => html,
    });

    const { host, editor } = createEditorHost(fakeDocument);
    plugin.init.call({}, { editorElement: host });

    plugin.commands.refreshBlocksLibraryData(undefined, { contentElement: editor });
    await Promise.resolve();
    plugin.commands.refreshBlocksLibraryData(undefined, { contentElement: editor });
    await flush(3);

    expect(getBlocks).toHaveBeenCalledTimes(2);
    expect(firstRequestAborted).toBe(true);
    expect(plugin.commands.insertBlockSnippet('fresh', { contentElement: editor })).toBe(true);
  });

  it('uses configurable results list aria label in panel markup', () => {
    const fakeDocument = new FakeDocument();
    const fakeWindow = {
      getSelection: () => null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
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

    const { BlocksLibraryPlugin } = require('./BlocksLibraryPlugin.native.ts');
    const plugin = BlocksLibraryPlugin({
      blocks: [{ id: 'alpha', label: 'Alpha', html: '<p>Alpha</p>' }],
      labels: { resultsListLabel: 'Snippet choices' },
      sanitizeBlockHtml: (html) => html,
    });

    const { host, editor } = createEditorHost(fakeDocument);
    plugin.init.call({}, { editorElement: host });

    plugin.commands.openBlocksLibraryPanel(undefined, { contentElement: editor });

    const panel = fakeDocument.body.querySelector('.rte-blocks-library-panel');
    expect(panel).toBeTruthy();
    expect(panel.innerHTML).toContain('aria-label="Snippet choices"');
  });

  it('sanitizes dangerous html via non-DOM fallback before insertion', () => {
    global.document = undefined;
    global.window = undefined;

    const { BlocksLibraryPlugin } = require('./BlocksLibraryPlugin.native.ts');

    const plugin = BlocksLibraryPlugin({
      blocks: [
        {
          id: 'danger',
          label: 'Danger',
          html: '<p onclick="evil()">Hello</p><script>alert(1)</script><a href="javascript:alert(2)">x</a>',
        },
      ],
    });

    const fakeDocument = new FakeDocument();
    const fakeWindow = {
      getSelection: () => null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
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

    const { host, editor } = createEditorHost(fakeDocument);
    plugin.init.call({}, { editorElement: host });

    expect(plugin.commands.insertBlockSnippet('danger', { contentElement: editor })).toBe(true);
    const calls = fakeDocument.execCommand.mock.calls;
    const insertedHtml = (calls.length > 0 ? calls[calls.length - 1][2] : '') || '';

    expect(insertedHtml.toLowerCase()).not.toContain('<script');
    expect(insertedHtml.toLowerCase()).not.toContain('onclick=');
    expect(insertedHtml.toLowerCase()).not.toContain('javascript:');
  });
});
