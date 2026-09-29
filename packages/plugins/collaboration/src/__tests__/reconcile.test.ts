import { describe, expect, it } from 'vitest';
import * as Y from 'yjs';
import { diffText, reconcileDomFromY, reconcileYFromDom } from '../reconcile';

describe('diffText', () => {
  it('returns null for identical strings', () => {
    expect(diffText('hello', 'hello')).toBeNull();
  });

  it('finds a minimal insert in the middle', () => {
    expect(diffText('helo', 'hello')).toEqual({ start: 3, deleteCount: 0, insertText: 'l' });
  });

  it('finds a minimal delete', () => {
    expect(diffText('hello', 'helo')).toEqual({ start: 3, deleteCount: 1, insertText: '' });
  });

  it('finds a full replace when there is no common prefix/suffix', () => {
    expect(diffText('cat', 'dog')).toEqual({ start: 0, deleteCount: 3, insertText: 'dog' });
  });

  it('handles empty strings', () => {
    expect(diffText('', 'abc')).toEqual({ start: 0, deleteCount: 0, insertText: 'abc' });
    expect(diffText('abc', '')).toEqual({ start: 0, deleteCount: 3, insertText: '' });
  });
});

describe('reconcileYFromDom + reconcileDomFromY round-trip', () => {
  function makeDoc() {
    const doc = new Y.Doc();
    const fragment = doc.getXmlFragment('content');
    return { doc, fragment };
  }

  it('mirrors a simple paragraph into Y and back to an identical DOM', () => {
    const root = document.createElement('div');
    root.innerHTML = '<p>Hello <strong>world</strong></p>';
    const { doc, fragment } = makeDoc();

    doc.transact(() => reconcileYFromDom(fragment, root));

    const rebuilt = document.createElement('div');
    reconcileDomFromY(rebuilt, fragment, document);

    expect(rebuilt.innerHTML).toBe(root.innerHTML);
  });

  it('applies a minimal text edit as insert/delete rather than a full rebuild', () => {
    const root = document.createElement('div');
    root.innerHTML = '<p>Hello world</p>';
    const { doc, fragment } = makeDoc();
    doc.transact(() => reconcileYFromDom(fragment, root));

    const pText = (fragment.get(0) as Y.XmlElement).get(0) as Y.XmlText;
    let deleteCalls = 0;
    const originalDelete = pText.delete.bind(pText);
    pText.delete = (...args: Parameters<typeof pText.delete>) => {
      deleteCalls++;
      return originalDelete(...args);
    };

    root.innerHTML = '<p>Hello there world</p>';
    doc.transact(() => reconcileYFromDom(fragment, root));

    expect(pText.toString()).toBe('Hello there world');
    // A minimal diff only needs to touch the changed region once, not
    // delete-and-reinsert the whole string.
    expect(deleteCalls).toBeLessThanOrEqual(1);
  });

  it('rebuilds the tail when a new block is inserted', () => {
    const root = document.createElement('div');
    root.innerHTML = '<p>First</p>';
    const { doc, fragment } = makeDoc();
    doc.transact(() => reconcileYFromDom(fragment, root));

    root.innerHTML = '<p>First</p><p>Second</p>';
    doc.transact(() => reconcileYFromDom(fragment, root));

    const rebuilt = document.createElement('div');
    reconcileDomFromY(rebuilt, fragment, document);
    expect(rebuilt.innerHTML).toBe('<p>First</p><p>Second</p>');
  });

  it('syncs attribute changes', () => {
    const root = document.createElement('div');
    root.innerHTML = '<p class="a">Text</p>';
    const { doc, fragment } = makeDoc();
    doc.transact(() => reconcileYFromDom(fragment, root));

    root.innerHTML = '<p class="b" data-x="1">Text</p>';
    doc.transact(() => reconcileYFromDom(fragment, root));

    const rebuilt = document.createElement('div');
    reconcileDomFromY(rebuilt, fragment, document);
    expect(rebuilt.innerHTML).toBe('<p class="b" data-x="1">Text</p>');
  });

  it('propagates a Y-side edit back onto a stale DOM tree', () => {
    const root = document.createElement('div');
    root.innerHTML = '<p>Hello world</p>';
    const { doc, fragment } = makeDoc();
    doc.transact(() => reconcileYFromDom(fragment, root));

    const pText = (fragment.get(0) as Y.XmlElement).get(0) as Y.XmlText;
    doc.transact(() => {
      pText.delete(6, 5);
      pText.insert(6, 'there');
    });

    reconcileDomFromY(root, fragment, document);
    expect(root.innerHTML).toBe('<p>Hello there</p>');
  });
});

describe('two independently-synced docs converge (CRDT property)', () => {
  it('merges non-overlapping concurrent edits from two clients', () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const fragA = docA.getXmlFragment('content');
    const fragB = docB.getXmlFragment('content');

    const rootA = document.createElement('div');
    rootA.innerHTML = '<p>Hello world</p>';
    docA.transact(() => reconcileYFromDom(fragA, rootA));

    // Sync A's initial state to B, then bring B's DOM in line with it.
    Y.applyUpdate(docB, Y.encodeStateAsUpdate(docA));
    const rootB = document.createElement('div');
    reconcileDomFromY(rootB, fragB, document);
    expect(rootB.innerHTML).toBe('<p>Hello world</p>');

    // Concurrent, non-overlapping edits on each client.
    rootA.innerHTML = '<p>Hello brave world</p>';
    docA.transact(() => reconcileYFromDom(fragA, rootA));

    rootB.innerHTML = '<p>Hello world!</p>';
    docB.transact(() => reconcileYFromDom(fragB, rootB));

    // Exchange updates both ways.
    const updateFromA = Y.encodeStateAsUpdate(docA, Y.encodeStateVector(docB));
    const updateFromB = Y.encodeStateAsUpdate(docB, Y.encodeStateVector(docA));
    Y.applyUpdate(docB, updateFromA);
    Y.applyUpdate(docA, updateFromB);

    reconcileDomFromY(rootA, fragA, document);
    reconcileDomFromY(rootB, fragB, document);

    // Both edits are preserved and both clients converge to the same text.
    expect(rootA.innerHTML).toBe(rootB.innerHTML);
    expect(rootA.textContent).toContain('brave');
    expect(rootA.textContent).toContain('!');
  });
});
