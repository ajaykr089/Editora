import { describe, expect, it } from 'vitest';
import * as Y from 'yjs';
import { YjsDomBinding } from '../YjsDomBinding';

function relay(a: Y.Doc, b: Y.Doc): () => void {
  const onA = (update: Uint8Array, origin: unknown) => {
    if (origin === 'relay') return;
    Y.applyUpdate(b, update, 'relay');
  };
  const onB = (update: Uint8Array, origin: unknown) => {
    if (origin === 'relay') return;
    Y.applyUpdate(a, update, 'relay');
  };
  a.on('update', onA);
  b.on('update', onB);
  return () => {
    a.off('update', onA);
    b.off('update', onB);
  };
}

describe('YjsDomBinding onChange propagation', () => {
  it('fires a native "input" event on the root when a remote update is applied', async () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();
    const stopRelay = relay(docA, docB);

    const rootA = document.createElement('div');
    rootA.innerHTML = '<p>Hello</p>';
    const bindingA = new YjsDomBinding(rootA, docA, docA.getXmlFragment('content'));

    // The relay above means docB already has docA's content by the time
    // bindingB's constructor runs its adopt-vs-seed check, and that adopt
    // path dispatches the event synchronously during construction - so the
    // listener must be attached first via an existing DOM ancestor, not
    // added after `new YjsDomBinding(...)` returns.
    const rootB = document.createElement('div');
    let inputEventCount = 0;
    rootB.addEventListener('input', () => inputEventCount++);
    const bindingB = new YjsDomBinding(rootB, docB, docB.getXmlFragment('content'));

    // B adopts A's initial content - this alone should fire the event once.
    await new Promise((r) => setTimeout(r, 0));
    expect(inputEventCount).toBeGreaterThanOrEqual(1);
    expect(rootB.textContent).toBe('Hello');

    // A live edit on A, relayed to B, should also fire it on B.
    inputEventCount = 0;
    rootA.innerHTML = '<p>Hello there</p>';
    rootA.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));

    expect(rootB.textContent).toBe('Hello there');
    expect(inputEventCount).toBeGreaterThanOrEqual(1);

    bindingA.destroy();
    bindingB.destroy();
    stopRelay();
  });

  it("does not fire a spurious 'input' event on the side that made the local edit", async () => {
    const doc = new Y.Doc();
    const root = document.createElement('div');
    root.innerHTML = '<p>Hi</p>';
    const binding = new YjsDomBinding(root, doc, doc.getXmlFragment('content'));

    let inputEventCount = 0;
    root.addEventListener('input', () => inputEventCount++);

    // Simulate a real local edit (the way a user typing would): mutate the
    // DOM, then the browser's own native 'input' event fires - the binding
    // itself must not additionally dispatch one for its own local->Yjs sync.
    root.innerHTML = '<p>Hi there</p>';
    root.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 0));

    expect(inputEventCount).toBe(1);
    binding.destroy();
  });
});
