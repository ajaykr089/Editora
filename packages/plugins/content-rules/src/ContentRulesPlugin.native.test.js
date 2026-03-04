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
      // Ignore readonly event target in newer Node/Event implementations.
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
    this.innerText = '';
    this.textContent = '';
    this.hidden = false;
    this.id = '';
    this.attrs = new Map();
  }

  get isConnected() {
    return this.parentNode !== null || this.tagName === 'BODY' || this.tagName === 'HEAD' || this.tagName === 'HTML';
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

  setAttribute(name, value) {
    if (name === 'class') {
      value
        .split(/\s+/)
        .filter(Boolean)
        .forEach((token) => this.classList.add(token));
    }

    if (name === 'id') {
      this.id = value;
    }

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
    const parts = selector.split(',').map((part) => part.trim()).filter(Boolean);
    return parts.some((part) => this.matchesSingle(part));
  }

  matchesSingle(selector) {
    if (selector === '.rte-content') return this.classList.contains('rte-content');
    if (selector === '.editora-content') return this.classList.contains('editora-content');
    if (selector === '.rte-editor') return this.classList.contains('rte-editor');
    if (selector === '.editora-editor') return this.classList.contains('editora-editor');
    if (selector === 'editora-editor') return this.tagName.toLowerCase() === 'editora-editor';

    if (selector.startsWith('.')) {
      return this.classList.contains(selector.slice(1));
    }

    const attrMatch = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);
    if (attrMatch) {
      const attrName = attrMatch[1];
      const attrValue = attrMatch[2];
      const current = this.getAttribute(attrName);
      if (typeof attrValue === 'string') return current === attrValue;
      return current !== null;
    }

    if (/^h[1-6]$/i.test(selector)) {
      return this.tagName.toLowerCase() === selector.toLowerCase();
    }

    return false;
  }

  closest(selector) {
    return this.matches(selector) ? this : null;
  }

  querySelector() {
    return null;
  }

  querySelectorAll() {
    return [];
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
      right: 610,
      bottom: 410,
      width: 600,
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
    this.editors = [];

    this.documentElement.ownerDocument = this;
    this.head.ownerDocument = this;
    this.body.ownerDocument = this;

    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
  }

  registerEditor(editor) {
    this.editors.push(editor);
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
}

class FakeWindow {
  constructor() {
    this.innerWidth = 1280;
    this.innerHeight = 800;
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
    return null;
  }
}

function installFakeDom() {
  const document = new FakeDocument();
  const window = new FakeWindow();

  globalThis.document = document;
  globalThis.window = window;
  globalThis.HTMLElement = FakeElement;
  globalThis.Element = FakeElement;
  globalThis.Node = { ELEMENT_NODE: 1, TEXT_NODE: 3 };

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

function createEditor(env, text) {
  const editor = env.document.createElement('div');
  editor.classList.add('rte-content');
  editor.setAttribute('contenteditable', 'true');
  editor.textContent = text;
  editor.innerText = text;
  editor.innerHTML = `<p>${text}</p>`;
  env.document.body.appendChild(editor);
  env.document.registerEditor(editor);
  return editor;
}

describe('ContentRulesPlugin', () => {
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
    delete globalThis.Node;
  });

  it('isolates issues per editor instance with different configs', async () => {
    const { ContentRulesPlugin } = require('./ContentRulesPlugin.native.ts');
    const env = { document: globalThis.document, window: globalThis.window };

    const editorA = createEditor(env, 'This is obviously and simply problematic.');
    const editorB = createEditor(env, 'This is obviously and simply problematic.');

    const plugin = ContentRulesPlugin();

    plugin.init?.call(
      { __pluginConfig: { enableRealtime: true, debounceMs: 20, bannedWords: ['obviously'] } },
      { editorElement: editorA },
    );
    plugin.init?.call(
      { __pluginConfig: { enableRealtime: true, debounceMs: 20, bannedWords: ['simply'] } },
      { editorElement: editorB },
    );

    jest.runOnlyPendingTimers();
    await Promise.resolve();

    env.document.emit('input', { target: editorA });
    env.document.emit('input', { target: editorB });

    jest.advanceTimersByTime(25);
    await Promise.resolve();

    let issuesA = [];
    let issuesB = [];

    plugin.commands?.getContentRulesIssues?.((issues) => {
      issuesA = issues;
    }, { contentElement: editorA });

    plugin.commands?.getContentRulesIssues?.((issues) => {
      issuesB = issues;
    }, { contentElement: editorB });

    expect(issuesA.some((issue) => issue.message.includes('obviously'))).toBe(true);
    expect(issuesA.some((issue) => issue.message.includes('simply'))).toBe(false);

    expect(issuesB.some((issue) => issue.message.includes('simply'))).toBe(true);
    expect(issuesB.some((issue) => issue.message.includes('obviously'))).toBe(false);

    plugin.destroy?.();
    plugin.destroy?.();
  });

  it('debounces realtime audits and respects realtime toggle', async () => {
    const { ContentRulesPlugin } = require('./ContentRulesPlugin.native.ts');
    const env = { document: globalThis.document, window: globalThis.window };

    const editor = createEditor(env, 'clean text');
    const plugin = ContentRulesPlugin({ bannedWords: ['obviously'], enableRealtime: true, debounceMs: 100 });

    plugin.init?.call({}, { editorElement: editor });

    jest.runOnlyPendingTimers();
    await Promise.resolve();

    editor.textContent = 'This is obviously bad.';
    editor.innerText = editor.textContent;
    editor.innerHTML = `<p>${editor.textContent}</p>`;

    env.document.emit('input', { target: editor });
    jest.advanceTimersByTime(80);
    await Promise.resolve();

    let before = [];
    plugin.commands?.getContentRulesIssues?.((issues) => {
      before = issues;
    }, { contentElement: editor });
    expect(before.length).toBe(0);

    jest.advanceTimersByTime(30);
    await Promise.resolve();

    let after = [];
    plugin.commands?.getContentRulesIssues?.((issues) => {
      after = issues;
    }, { contentElement: editor });
    expect(after.some((issue) => issue.message.includes('obviously'))).toBe(true);

    plugin.commands?.toggleContentRulesRealtime?.(false, { contentElement: editor });
    editor.textContent = 'clean again';
    editor.innerText = editor.textContent;
    editor.innerHTML = `<p>${editor.textContent}</p>`;

    env.document.emit('input', { target: editor });
    jest.advanceTimersByTime(200);
    await Promise.resolve();

    let whileOff = [];
    plugin.commands?.getContentRulesIssues?.((issues) => {
      whileOff = issues;
    }, { contentElement: editor });
    expect(whileOff.some((issue) => issue.message.includes('obviously'))).toBe(true);

    plugin.commands?.toggleContentRulesRealtime?.(true, { contentElement: editor });
    env.document.emit('input', { target: editor });
    jest.advanceTimersByTime(120);
    await Promise.resolve();

    let afterReenabled = [];
    plugin.commands?.getContentRulesIssues?.((issues) => {
      afterReenabled = issues;
    }, { contentElement: editor });
    expect(afterReenabled.length).toBe(0);

    plugin.destroy?.();
  });

  it('emits audit + issues events and supports callback issue retrieval', async () => {
    const { ContentRulesPlugin } = require('./ContentRulesPlugin.native.ts');
    const env = { document: globalThis.document, window: globalThis.window };

    const editor = createEditor(env, 'This is obviously bad.');
    const plugin = ContentRulesPlugin({ bannedWords: ['obviously'], enableRealtime: false });

    plugin.init?.call({}, { editorElement: editor });

    let auditIssues = [];
    let eventIssues = [];

    editor.addEventListener('editora:content-rules-audit', (event) => {
      auditIssues = event.detail?.issues || [];
    });

    editor.addEventListener('editora:content-rules-issues', (event) => {
      eventIssues = event.detail?.issues || [];
    });

    await plugin.commands?.runContentRulesAudit?.(undefined, { contentElement: editor });

    let callbackIssues = [];
    plugin.commands?.getContentRulesIssues?.((issues) => {
      callbackIssues = issues;
    }, { contentElement: editor });

    expect(auditIssues.length).toBeGreaterThan(0);
    expect(callbackIssues.length).toBe(auditIssues.length);
    expect(eventIssues.length).toBe(callbackIssues.length);
    expect(editor.__contentRulesIssues.length).toBe(callbackIssues.length);

    plugin.destroy?.();
  });
});
