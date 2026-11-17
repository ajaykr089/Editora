import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';

// <editora-editor> rebuilds itself (an attribute change, setConfig(), a move in the DOM) by
// clearing its children and running init() again on whatever plugin instance its loader hands
// back - and it never calls the plugin's destroy() on the way. These tests replay that sequence
// and count the providers (one provider = one WebSocket) that are still alive afterwards.
const providers: FakeWebsocketProvider[] = [];

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
  destroyed = false;
  constructor(public url: string, public room: string, public doc: Y.Doc) {
    providers.push(this);
  }
  on(event: string, handler: (...args: unknown[]) => void) {
    if (event === 'sync') handler(true);
  }
  off() {}
  destroy() {
    this.destroyed = true;
  }
}

vi.mock('y-websocket', () => ({ WebsocketProvider: FakeWebsocketProvider }));

const TEST_SERVER = 'ws://localhost:1234';
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const liveRooms = () => providers.filter((p) => !p.destroyed).map((p) => p.room);

async function freshPluginModule() {
  vi.resetModules();
  return import('../CollaborationPlugin.native');
}

// Mirrors what RichTextEditorElement.initialize() builds: chrome plus one editable content element.
function mountEditorContent(host: HTMLElement): HTMLElement {
  const content = document.createElement('div');
  content.className = 'editora-content rte-content';
  content.setAttribute('contenteditable', 'true');
  host.appendChild(content);
  return content;
}

// One web-component mount fires init() twice: its own loop, then EditorEngine's PluginManager.
function initLikeWebComponent(plugin: { init?: (ctx?: unknown) => void }, host: HTMLElement): void {
  plugin.init?.({ editorElement: host });
  plugin.init?.(undefined);
}

afterEach(() => {
  document.body.innerHTML = '';
  providers.length = 0;
});

describe('collaboration across an editor rebuild', () => {
  it('keeps one connection when the rebuild gets a fresh plugin instance', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const options = { websocketUrl: TEST_SERVER, roomName: 'room-rebuild' };

    // First build.
    initLikeWebComponent(CollaborationPlugin(options), host);
    mountEditorContent(host);
    await tick();
    expect(liveRooms()).toEqual(['room-rebuild']);

    // Rebuild: destroy() empties the element (no plugin.destroy()), then two concurrent plugin
    // loads leave a new instance in the loader's cache, which the next build initialises.
    host.innerHTML = '';
    initLikeWebComponent(CollaborationPlugin(options), host);
    const content = mountEditorContent(host);
    await tick();

    expect(liveRooms()).toEqual(['room-rebuild']);
    expect(content.previousElementSibling?.className).toBe('editora-collab-presence');
  });

  it('reconnects (once) when the rebuild gets the same plugin instance back', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const plugin = CollaborationPlugin({ websocketUrl: TEST_SERVER, roomName: 'room-same' });

    initLikeWebComponent(plugin, host);
    mountEditorContent(host);
    await tick();

    host.innerHTML = '';
    initLikeWebComponent(plugin, host);
    const content = mountEditorContent(host);
    await tick();

    expect(liveRooms()).toEqual(['room-same']);
    expect(content.previousElementSibling?.className).toBe('editora-collab-presence');
  });

  it('closes the connection when the editor is removed from the page', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    const host = document.createElement('div');
    document.body.appendChild(host);

    initLikeWebComponent(CollaborationPlugin({ websocketUrl: TEST_SERVER, roomName: 'room-removed' }), host);
    mountEditorContent(host);
    await tick();
    expect(liveRooms()).toEqual(['room-removed']);

    host.remove();
    await tick();
    expect(liveRooms()).toEqual([]);
  });

  it('still binds a single editor once when init() fires twice in one mount', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    const host = document.createElement('div');
    document.body.appendChild(host);

    initLikeWebComponent(CollaborationPlugin({ websocketUrl: TEST_SERVER, roomName: 'room-once' }), host);
    mountEditorContent(host);
    await tick();
    // A later, unrelated editable must not be grabbed by a leftover second claim.
    const other = document.createElement('div');
    other.setAttribute('contenteditable', 'true');
    document.body.appendChild(other);
    await tick();

    expect(liveRooms()).toEqual(['room-once']);
    expect(other.previousElementSibling?.className).not.toBe('editora-collab-presence');
  });
});
