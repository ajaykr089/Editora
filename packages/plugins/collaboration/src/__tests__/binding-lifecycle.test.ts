import { afterEach, describe, expect, it } from 'vitest';
import * as Y from 'yjs';
import { YjsDomBinding } from '../YjsDomBinding';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

function makePeer(html: string, doc = new Y.Doc()) {
  const root = document.createElement('div');
  root.setAttribute('contenteditable', 'true');
  root.innerHTML = html;
  document.body.appendChild(root);
  const fragment = doc.getXmlFragment('content');
  return { root, doc, fragment, binding: new YjsDomBinding(root, doc, fragment) };
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('binding lifecycle', () => {
  it('stops touching the DOM and the doc once destroy() has been called', async () => {
    const doc = new Y.Doc();
    const peer = makePeer('<p>one</p>', doc);
    let inputs = 0;
    peer.root.addEventListener('input', () => inputs++);

    peer.binding.destroy();

    // Remote update after teardown (the doc outlives the binding when the caller supplied it).
    const remote = new Y.Doc();
    Y.applyUpdate(remote, Y.encodeStateAsUpdate(doc));
    (remote.getXmlFragment('content').get(0) as Y.XmlElement).insert(0, [new Y.XmlText('remote ')]);
    Y.applyUpdate(doc, Y.encodeStateAsUpdate(remote));
    await tick();

    expect(peer.root.textContent).toBe('one');
    expect(inputs).toBe(0);

    // And a local edit after teardown is no longer mirrored into the doc.
    const before = Y.encodeStateVector(doc);
    peer.root.innerHTML = '<p>changed locally</p>';
    await tick();
    await tick();
    expect(Y.encodeStateVector(doc)).toEqual(before);
  });

  it('does not sync a mutation that was already queued when destroy() ran', async () => {
    const doc = new Y.Doc();
    const peer = makePeer('<p>one</p>', doc);
    const before = Y.encodeStateVector(doc);

    peer.root.innerHTML = '<p>two</p>';
    peer.binding.destroy();
    await tick();
    await tick();

    expect(Y.encodeStateVector(doc)).toEqual(before);
  });
});
