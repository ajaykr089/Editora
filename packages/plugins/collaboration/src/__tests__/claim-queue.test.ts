import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';

// Fakes out the real transport so these tests exercise only the
// claim-queue/scanner bootstrap logic (does init() firing - with or without
// a real editorElement, once or twice - correctly find and bind the right
// DOM element), not actual network sync.
vi.mock('y-websocket', () => {
  class FakeAwareness {
    clientID = Math.floor(Math.random() * 100000);
    private handlers: Record<string, Array<(...args: unknown[]) => void>> = {};
    on(event: string, handler: (...args: unknown[]) => void) {
      (this.handlers[event] ||= []).push(handler);
    }
    off(event: string, handler: (...args: unknown[]) => void) {
      this.handlers[event] = (this.handlers[event] || []).filter((h) => h !== handler);
    }
    setLocalStateField() {}
    setLocalState() {}
    getStates() {
      return new Map();
    }
  }
  class FakeWebsocketProvider {
    awareness = new FakeAwareness();
    synced = true;
    wsconnected = true;
    private handlers: Record<string, Array<(...args: unknown[]) => void>> = {};
    constructor(public url: string, public room: string, public doc: Y.Doc) {}
    on(event: string, handler: (...args: unknown[]) => void) {
      (this.handlers[event] ||= []).push(handler);
      if (event === 'sync') handler(true);
    }
    off(event: string, handler: (...args: unknown[]) => void) {
      this.handlers[event] = (this.handlers[event] || []).filter((h) => h !== handler);
    }
    destroy() {}
  }
  return { WebsocketProvider: FakeWebsocketProvider };
});

async function freshPluginModule() {
  vi.resetModules();
  return import('../CollaborationPlugin.native');
}

function makeEditorRoot(id: string): HTMLElement {
  const root = document.createElement('div');
  const content = document.createElement('div');
  content.className = 'rte-content';
  content.id = id;
  content.setAttribute('contenteditable', 'true');
  root.appendChild(content);
  document.body.appendChild(root);
  return content;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('CollaborationPlugin bootstrap (claim-queue scanner)', () => {
  it('binds via the scanner when init() receives no editorElement at all (the React case)', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    const content = makeEditorRoot('react-like');

    const plugin = CollaborationPlugin({ roomName: 'room-a', provider: undefined });
    // React's PluginManager.register(p) calls plugin.init(pluginConfig) with
    // no element - simulate exactly that.
    (plugin.init as (ctx?: unknown) => void)(undefined);

    await new Promise((r) => setTimeout(r, 0));
    expect(content.previousElementSibling?.className).toBe('editora-collab-presence');
  });

  it('does not double-enqueue when init() fires twice for the same instance (the two-registration-path case)', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    const contentA = makeEditorRoot('editor-a');
    const contentB = makeEditorRoot('editor-b');

    const pluginA = CollaborationPlugin({ roomName: 'room-a' });
    // Simulate RichTextEditorElement's loop, then EditorEngine's separate
    // PluginManager.register() - both fire init() on the *same* instance.
    (pluginA.init as (ctx?: unknown) => void)({ editorElement: contentA });
    (pluginA.init as (ctx?: unknown) => void)(undefined);

    await new Promise((r) => setTimeout(r, 0));

    // A second, independent plugin instance for a second editor must still
    // claim its own element, not get starved by a phantom leftover claim
    // from the first instance's duplicate init() call.
    const pluginB = CollaborationPlugin({ roomName: 'room-b' });
    (pluginB.init as (ctx?: unknown) => void)({ editorElement: contentB });
    await new Promise((r) => setTimeout(r, 0));

    expect(contentA.previousElementSibling?.className).toBe('editora-collab-presence');
    expect(contentB.previousElementSibling?.className).toBe('editora-collab-presence');
  });

  it('matches multiple editors to their own plugin instance in construction/mount order', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    const contentA = makeEditorRoot('multi-a');
    const contentB = makeEditorRoot('multi-b');

    const pluginA = CollaborationPlugin({ roomName: 'room-multi-a' });
    const pluginB = CollaborationPlugin({ roomName: 'room-multi-b' });
    (pluginA.init as (ctx?: unknown) => void)(undefined);
    (pluginB.init as (ctx?: unknown) => void)(undefined);

    await new Promise((r) => setTimeout(r, 0));

    expect(contentA.previousElementSibling?.className).toBe('editora-collab-presence');
    expect(contentB.previousElementSibling?.className).toBe('editora-collab-presence');
  });

  it('binds to an editor that already existed in the DOM before the plugin was constructed', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    // Element mounted first, plugin constructed after - the reverse of the
    // usual ordering, which the scanner's immediate scan-on-enqueue covers.
    const content = makeEditorRoot('pre-existing');

    const plugin = CollaborationPlugin({ roomName: 'room-pre-existing' });
    (plugin.init as (ctx?: unknown) => void)(undefined);

    await new Promise((r) => setTimeout(r, 0));
    expect(content.previousElementSibling?.className).toBe('editora-collab-presence');
  });

  it("destroy() tears down a claimed editor's presence indicator", async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    const content = makeEditorRoot('destroy-me');

    const plugin = CollaborationPlugin({ roomName: 'room-destroy' });
    (plugin.init as (ctx?: unknown) => void)(undefined);
    await new Promise((r) => setTimeout(r, 0));
    expect(content.previousElementSibling?.className).toBe('editora-collab-presence');

    plugin.destroy?.();
    expect(content.previousElementSibling).toBeNull();
  });
});
