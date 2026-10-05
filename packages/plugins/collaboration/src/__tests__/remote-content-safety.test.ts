import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { YjsDomBinding } from '../YjsDomBinding';

// Anyone who can write to the shared document (every client in the room, and on a public
// y-websocket server that is anyone who guesses the room name) controls the Y.XmlFragment that
// remote clients render straight into their contentEditable. These tests drive a hostile fragment
// into a client and check that nothing executable reaches the DOM.

declare global {
  interface Window {
    __pwned?: number;
  }
}

function relay(a: Y.Doc, b: Y.Doc): () => void {
  const onA = (update: Uint8Array, origin: unknown) => {
    if (origin !== 'relay') Y.applyUpdate(b, update, 'relay');
  };
  const onB = (update: Uint8Array, origin: unknown) => {
    if (origin !== 'relay') Y.applyUpdate(a, update, 'relay');
  };
  a.on('update', onA);
  b.on('update', onB);
  return () => {
    a.off('update', onA);
    b.off('update', onB);
  };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

type Peer = { root: HTMLElement; binding: YjsDomBinding; doc: Y.Doc; fragment: Y.XmlFragment };

function makePeer(html: string, doc = new Y.Doc()): Peer {
  const root = document.createElement('div');
  root.setAttribute('contenteditable', 'true');
  root.innerHTML = html;
  document.body.appendChild(root);
  const fragment = doc.getXmlFragment('content');
  return { root, doc, fragment, binding: new YjsDomBinding(root, doc, fragment) };
}

function element(name: string, attrs: Record<string, string> = {}, children: Array<Y.XmlElement | Y.XmlText> = []): Y.XmlElement {
  const el = new Y.XmlElement(name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  if (children.length) el.insert(0, children);
  return el;
}

/** What a hostile peer does: write nodes straight into the shared fragment. */
function injectAsAttacker(victim: Peer, nodes: Array<Y.XmlElement | Y.XmlText>): void {
  const attackerDoc = new Y.Doc();
  const stop = relay(attackerDoc, victim.doc);
  Y.applyUpdate(attackerDoc, Y.encodeStateAsUpdate(victim.doc), 'relay');
  attackerDoc.getXmlFragment('content').insert(victim.fragment.length, nodes);
  stop();
}

afterEach(() => {
  document.body.innerHTML = '';
  delete window.__pwned;
});

describe('remote content is not allowed to execute', () => {
  it('does not run or render a <script> element written by a peer', async () => {
    const victim = makePeer('<p>hello</p>');
    injectAsAttacker(victim, [element('script', {}, [new Y.XmlText('window.__pwned = 1')])]);
    await tick();

    expect(victim.root.querySelector('script')).toBeNull();
    expect(window.__pwned).toBeUndefined();
    expect(victim.root.textContent).toBe('hello');
    victim.binding.destroy();
  });

  it.each(['iframe', 'object', 'embed', 'style', 'link', 'meta', 'base', 'frame', 'frameset', 'noscript', 'template'])(
    'renders a peer-written <%s> as an inert placeholder',
    async (tag) => {
      const victim = makePeer('<p>hello</p>');
      injectAsAttacker(victim, [element(tag, { src: 'https://evil.example/', href: 'https://evil.example/', srcdoc: '<script>1</script>' })]);
      await tick();

      expect(victim.root.querySelector(tag)).toBeNull();
      expect(victim.root.children).toHaveLength(2);
      victim.binding.destroy();
    }
  );

  it('keeps a trusted embed iframe (https src + the embed marker), as core does', async () => {
    const victim = makePeer('<p>hello</p>');
    injectAsAttacker(victim, [
      element('iframe', { 'data-editora-embed': '', src: 'https://www.youtube.com/embed/abc', width: '300' }),
      element('iframe', { 'data-editora-embed': '', src: 'javascript:alert(1)' }),
      element('iframe', { src: 'https://www.youtube.com/embed/abc' }),
    ]);
    await tick();

    const frames = Array.from(victim.root.querySelectorAll('iframe'));
    expect(frames).toHaveLength(1);
    expect(frames[0].getAttribute('src')).toBe('https://www.youtube.com/embed/abc');
    victim.binding.destroy();
  });

  it('drops event-handler attributes and srcdoc from peer-written elements', async () => {
    const victim = makePeer('<p>hello</p>');
    injectAsAttacker(victim, [
      element('img', { src: 'https://example.com/a.png', onerror: 'window.__pwned=1', onload: 'window.__pwned=1', ONCLICK: 'window.__pwned=1' }),
      element('details', { open: '', ontoggle: 'window.__pwned=1' }),
    ]);
    await tick();

    const img = victim.root.querySelector('img') as HTMLElement;
    expect(img.getAttribute('src')).toBe('https://example.com/a.png');
    for (const el of Array.from(victim.root.querySelectorAll('*'))) {
      expect(Array.from(el.attributes).filter((a) => /^on/i.test(a.name))).toEqual([]);
    }
    expect(victim.root.querySelector('details')?.hasAttribute('open')).toBe(true);
    victim.binding.destroy();
  });

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'jav\tascript:alert(1)',
    '  javascript:alert(1)',
    '\u0001javascript:alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html,<script>alert(1)</script>',
  ])('drops the unsafe URL %j from href/src/action-style attributes', async (url) => {
    const victim = makePeer('<p>hello</p>');
    injectAsAttacker(victim, [
      element('a', { href: url }, [new Y.XmlText('link')]),
      element('img', { src: url }),
      element('form', { action: url }),
      element('button', { formaction: url }),
    ]);
    await tick();

    expect(victim.root.querySelector('a')?.hasAttribute('href')).toBe(false);
    expect(victim.root.querySelector('img')?.hasAttribute('src')).toBe(false);
    expect(victim.root.querySelector('form')?.hasAttribute('action')).toBe(false);
    expect(victim.root.querySelector('button')?.hasAttribute('formaction')).toBe(false);
    victim.binding.destroy();
  });

  it.each([
    ['href', 'https://example.com/page'],
    ['href', 'mailto:someone@example.com'],
    ['href', 'tel:+15551234'],
    ['href', '/relative/path?x=1#frag'],
    ['href', '#anchor'],
    ['src', 'data:image/png;base64,iVBORw0KGgo='],
  ])('keeps the safe URL %s=%j', async (name, url) => {
    const victim = makePeer('<p>hello</p>');
    injectAsAttacker(victim, [element(name === 'src' ? 'img' : 'a', { [name]: url })]);
    await tick();

    const el = victim.root.querySelector(name === 'src' ? 'img' : 'a') as HTMLElement;
    expect(el.getAttribute(name)).toBe(url);
    victim.binding.destroy();
  });

  it('survives invalid tag and attribute names instead of throwing out of the sync handler', async () => {
    const victim = makePeer('<p>hello</p>');
    const errors: unknown[] = [];
    const onError = (event: ErrorEvent) => {
      errors.push(event.error ?? event.message);
      event.preventDefault();
    };
    window.addEventListener('error', onError);

    injectAsAttacker(victim, [
      element('1bad'),
      element('a b'),
      element('p', { 'bad name': 'x', '"quote': 'y', 'ok-attr': 'fine' }, [new Y.XmlText('after')]),
    ]);
    await tick();
    window.removeEventListener('error', onError);

    expect(errors).toEqual([]);
    const last = victim.root.lastElementChild as HTMLElement;
    expect(last.tagName).toBe('P');
    expect(last.getAttribute('ok-attr')).toBe('fine');
    expect(last.textContent).toBe('after');
    victim.binding.destroy();
  });

  it('keeps syncing after a placeholder and does not churn the nodes that follow it', async () => {
    const victim = makePeer('<p>one</p>');
    injectAsAttacker(victim, [element('script'), element('p', {}, [new Y.XmlText('two')])]);
    await tick();

    const second = victim.root.lastElementChild as HTMLElement;
    expect(second.textContent).toBe('two');

    // An unrelated later remote edit must update in place rather than rebuild the tail.
    const peerDoc = new Y.Doc();
    Y.applyUpdate(peerDoc, Y.encodeStateAsUpdate(victim.doc), 'relay');
    const stop = relay(peerDoc, victim.doc);
    (peerDoc.getXmlFragment('content').get(0) as Y.XmlElement).insert(0, [new Y.XmlText('!')]);
    stop();
    await tick();

    expect(victim.root.lastElementChild).toBe(second);
    victim.binding.destroy();
  });

  it('does not write the placeholder back as a replacement for the original node', async () => {
    const victim = makePeer('<p>one</p>');
    injectAsAttacker(victim, [element('script', {}, [new Y.XmlText('x')])]);
    await tick();

    // A local edit triggers DOM -> Y reconciliation of the whole tree.
    victim.root.firstElementChild!.textContent = 'one!';
    await tick();
    await tick();

    expect(victim.fragment.toArray().map((node) => (node as Y.XmlElement).nodeName)).toEqual(['p', 'script']);
    victim.binding.destroy();
  });

  it('still round-trips ordinary rich content between two peers', async () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const stop = relay(docA, docB);
    const html =
      '<h2 style="color: red" data-id="1">Title</h2><p>Hello <strong>bold</strong> <a href="https://example.com" target="_blank">link</a></p>' +
      '<ul data-type="checklist"><li><input type="checkbox" checked> task</li></ul><figure><img src="https://example.com/a.png" alt="a"><figcaption>cap</figcaption></figure>';
    const a = makePeer(html, docA);
    const b = makePeer('', docB);
    await tick();

    expect(b.root.innerHTML).toBe(a.root.innerHTML);
    a.binding.destroy();
    b.binding.destroy();
    stop();
  });
});

describe('hostile awareness state', () => {
  it('does not throw when a peer publishes malformed user/cursor data', async () => {
    const { Awareness } = await import('y-protocols/awareness');
    const { CollaborationAwareness } = await import('../awareness');
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const root = document.createElement('div');
    root.innerHTML = '<p>text</p>';
    document.body.appendChild(root);
    const cursors = new CollaborationAwareness(root, awareness, { name: 'me', color: '#000' });

    // jsdom has no layout, so give ranges a rect or every caret is discarded as unmeasurable.
    const rangeProto = Range.prototype as unknown as { getBoundingClientRect?: () => unknown };
    const originalRect = rangeProto.getBoundingClientRect;
    rangeProto.getBoundingClientRect = () => ({ top: 1, left: 2, width: 3, height: 4, right: 5, bottom: 5, x: 2, y: 1 });

    const errors: unknown[] = [];
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const emit = (state: unknown) => {
      awareness.states.set(4242, state as never);
      try {
        awareness.emit('change', [{ added: [4242], updated: [], removed: [] }, 'remote']);
      } catch (error) {
        errors.push(error);
      }
    };

    emit({ user: { name: 5, color: {} }, cursor: { anchorPath: 'nope', anchorOffset: 'x' } });
    emit({ user: { name: 'ok', color: '#f00' }, cursor: { anchorPath: [0, 0], anchorOffset: Number.NaN, focusPath: { length: 1 } } });
    emit({ user: null, cursor: 7 });
    emit({ user: { name: 'ok', color: '#f00' }, cursor: { anchorPath: [0, 0], anchorOffset: 2 } });

    expect(errors).toEqual([]);
    expect(document.querySelectorAll('.editora-collab-caret')).toHaveLength(1);
    cursors.destroy();
    rangeProto.getBoundingClientRect = originalRect;
    spy.mockRestore();
  });
});
