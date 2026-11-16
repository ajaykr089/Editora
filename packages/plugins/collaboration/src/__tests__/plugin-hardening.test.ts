import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';

type FakeProvider = {
  url: string;
  room: string;
  doc: Y.Doc;
  synced: boolean;
  wsconnected: boolean;
  awareness: import('y-protocols/awareness').Awareness;
};

const created = vi.hoisted(() => [] as unknown[]);

// A transport double with a real Awareness, so peer presence can be injected like a real server
// would deliver it. Only the network is faked.
vi.mock('y-websocket', async () => {
  const { Awareness } = await import('y-protocols/awareness');
  class FakeWebsocketProvider {
    awareness: InstanceType<typeof Awareness>;
    synced = true;
    wsconnected = true;
    private handlers: Record<string, Array<(...args: unknown[]) => void>> = {};
    constructor(public url: string, public room: string, public doc: Y.Doc) {
      this.awareness = new Awareness(doc);
      created.push(this);
    }
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

// The plugin only connects to a server it was told about; the transport itself is faked above.
const TEST_SERVER = 'ws://localhost:1234';

async function freshPluginModule() {
  vi.resetModules();
  return import('../CollaborationPlugin.native');
}

function makeEditor(id?: string): HTMLElement {
  const root = document.createElement('div');
  const content = document.createElement('div');
  content.className = 'rte-content';
  if (id) content.id = id;
  content.setAttribute('contenteditable', 'true');
  content.innerHTML = '<p>seed</p>';
  root.appendChild(content);
  document.body.appendChild(root);
  return content;
}

const providers = () => created as FakeProvider[];
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  created.length = 0;
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('room name', () => {
  it.each([
    ['an element without an id', undefined, undefined, 'editora-default-room'],
    ['an element with an id', 'editor-7', undefined, 'editor-7'],
    ['an explicit roomName', 'editor-7', 'team-room', 'team-room'],
  ])('uses the right room for %s', async (_label, id, roomName, expected) => {
    const { CollaborationPlugin } = await freshPluginModule();
    makeEditor(id);
    const plugin = CollaborationPlugin({ websocketUrl: TEST_SERVER, ...(roomName ? { roomName } : {}) });
    (plugin.init as () => void)();
    await tick();

    expect(providers()).toHaveLength(1);
    expect(providers()[0].room).toBe(expected);
    plugin.destroy?.();
  });

  it('falls back to the default room when roomName is an empty string', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    makeEditor();
    const plugin = CollaborationPlugin({ websocketUrl: TEST_SERVER, roomName: '' });
    (plugin.init as () => void)();
    await tick();

    expect(providers()[0].room).toBe('editora-default-room');
    plugin.destroy?.();
  });
});

describe('without a configured server', () => {
  const PUBLIC_DEMO = 'wss://demos.yjs.dev';
  const presenceBars = () => document.querySelectorAll('.editora-collab-presence');

  it('does not open a connection when neither websocketUrl nor provider is given', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { CollaborationPlugin } = await freshPluginModule();
    const content = makeEditor('private-notes');

    const plugin = CollaborationPlugin({});
    (plugin.init as () => void)();
    await tick();

    expect(providers()).toHaveLength(0);
    expect(presenceBars()).toHaveLength(0);
    expect(content.textContent).toBe('seed');
    plugin.destroy?.();
  });

  it('says why, once, and names the options that turn it on', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { CollaborationPlugin } = await freshPluginModule();
    makeEditor('shared-doc');

    const a = CollaborationPlugin({});
    const b = CollaborationPlugin({});
    (a.init as () => void)();
    (a.init as () => void)(); // core calls init() twice per mount
    (b.init as () => void)();
    await tick();

    expect(warn).toHaveBeenCalledTimes(1);
    const message = String(warn.mock.calls[0][0]);
    expect(message).toContain('websocketUrl');
    expect(message).toContain('provider');
    expect(message).toContain('allowPublicDemoServer');
    expect(providers()).toHaveLength(0);
  });

  it.each([['an empty string', ''], ['blank space', '   ']])('treats %s as no websocketUrl', async (_label, websocketUrl) => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { CollaborationPlugin } = await freshPluginModule();
    makeEditor('blank-url');

    const plugin = CollaborationPlugin({ websocketUrl });
    (plugin.init as () => void)();
    await tick();

    expect(providers()).toHaveLength(0);
  });

  it('ignores a websocketUrl that is not a string instead of throwing', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { CollaborationPlugin } = await freshPluginModule();
    makeEditor('odd-url');

    // Declarative config is JSON or attributes; a number there must not reach a string method.
    const plugin: ReturnType<typeof CollaborationPlugin> & { __pluginConfig?: object } = CollaborationPlugin();
    plugin.__pluginConfig = { websocketUrl: 1234 };
    expect(() => (plugin.init as () => void)()).not.toThrow();
    await tick();

    expect(providers()).toHaveLength(0);
  });

  it('stays off when only a doc, room, user or colour is given', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { CollaborationPlugin } = await freshPluginModule();
    makeEditor('doc-only');

    const plugin = CollaborationPlugin({ doc: new Y.Doc(), roomName: 'team', userName: 'Ava', userColor: '#f97316' });
    (plugin.init as () => void)();
    await tick();

    expect(providers()).toHaveLength(0);
  });

  it('reads the declarative config the web component attaches after construction', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { CollaborationPlugin } = await freshPluginModule();
    makeEditor('declarative-off');

    // PluginLoader.load() calls the factory with no arguments, then stashes the consumer's config.
    const unconfigured: ReturnType<typeof CollaborationPlugin> & { __pluginConfig?: object } = CollaborationPlugin();
    unconfigured.__pluginConfig = { roomName: 'team' };
    (unconfigured.init as () => void)();
    await tick();
    expect(providers()).toHaveLength(0);

    const configured: ReturnType<typeof CollaborationPlugin> & { __pluginConfig?: object } = CollaborationPlugin();
    configured.__pluginConfig = { websocketUrl: TEST_SERVER, roomName: 'team' };
    (configured.init as () => void)();
    await tick();
    expect(providers()).toHaveLength(1);
    expect(providers()[0].url).toBe(TEST_SERVER);
    configured.destroy?.();
  });

  it('does not take an editor away from a plugin that is configured', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { CollaborationPlugin } = await freshPluginModule();

    // The unconfigured plugin is constructed first, so a claim it left behind would win the editor.
    const idle = CollaborationPlugin({});
    const live = CollaborationPlugin({ websocketUrl: TEST_SERVER, roomName: 'live-room' });
    (idle.init as () => void)();
    (live.init as () => void)();
    makeEditor('only-editor');
    await tick();

    expect(providers()).toHaveLength(1);
    expect(providers()[0].room).toBe('live-room');
    expect(presenceBars()).toHaveLength(1);
    live.destroy?.();
  });

  describe('opting in', () => {
    it('connects to the server it was given, without a warning', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const { CollaborationPlugin } = await freshPluginModule();
      makeEditor('private-doc');

      const plugin = CollaborationPlugin({ websocketUrl: 'wss://collab.internal.example' });
      (plugin.init as () => void)();
      await tick();

      expect(warn).not.toHaveBeenCalled();
      expect(providers()).toHaveLength(1);
      expect(providers()[0].url).toBe('wss://collab.internal.example');
      plugin.destroy?.();
    });

    it('does not create a connection of its own when a provider is supplied', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const { CollaborationPlugin } = await freshPluginModule();
      const content = makeEditor('provider-doc');
      const doc = new Y.Doc();
      const provider = { doc, synced: true, wsconnected: true, awareness: new (await import('y-protocols/awareness')).Awareness(doc), on() {}, off() {}, destroy() {} };

      const plugin = CollaborationPlugin({ provider: provider as never });
      (plugin.init as () => void)();
      await tick();

      expect(warn).not.toHaveBeenCalled();
      expect(providers()).toHaveLength(0);
      expect(presenceBars()).toHaveLength(1);
      expect(doc.getXmlFragment('editora-content').length).toBeGreaterThan(0);
      expect(content.textContent).toBe('seed');
      plugin.destroy?.();
    });

    it('allowPublicDemoServer: true uses the public demo server and warns once, naming the room', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const { CollaborationPlugin } = await freshPluginModule();
      makeEditor('shared-doc');
      makeEditor('other-doc');

      const a = CollaborationPlugin({ allowPublicDemoServer: true });
      const b = CollaborationPlugin({ allowPublicDemoServer: true });
      (a.init as () => void)();
      (b.init as () => void)();
      await tick();

      expect(providers().map((p) => p.url)).toEqual([PUBLIC_DEMO, PUBLIC_DEMO]);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(String(warn.mock.calls[0][0])).toContain('shared-doc');
      expect(String(warn.mock.calls[0][0])).toContain('websocketUrl');
      a.destroy?.();
    });

    it('only a real boolean true counts for allowPublicDemoServer', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const { CollaborationPlugin } = await freshPluginModule();
      makeEditor('string-flag');

      // Declarative config can carry strings; "false" is truthy and must not switch the demo server on.
      const plugin: ReturnType<typeof CollaborationPlugin> & { __pluginConfig?: object } = CollaborationPlugin();
      plugin.__pluginConfig = { allowPublicDemoServer: 'false' };
      (plugin.init as () => void)();
      await tick();

      expect(providers()).toHaveLength(0);
    });

    it('prefers a configured websocketUrl over the demo server even with the flag set', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const { CollaborationPlugin } = await freshPluginModule();
      makeEditor('both-set');

      const plugin = CollaborationPlugin({ websocketUrl: TEST_SERVER, allowPublicDemoServer: true });
      (plugin.init as () => void)();
      await tick();

      expect(providers().map((p) => p.url)).toEqual([TEST_SERVER]);
      expect(warn).not.toHaveBeenCalled();
      plugin.destroy?.();
    });

    it('still warns when websocketUrl names the public demo server by hand', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const { CollaborationPlugin } = await freshPluginModule();
      makeEditor('typed-by-hand');

      const plugin = CollaborationPlugin({ websocketUrl: `${PUBLIC_DEMO}/` });
      (plugin.init as () => void)();
      await tick();

      expect(providers()).toHaveLength(1);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(String(warn.mock.calls[0][0])).toContain('typed-by-hand');
      plugin.destroy?.();
    });
  });
});

describe('presence indicator', () => {
  it('ignores peers that publish a malformed user instead of throwing', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { CollaborationPlugin } = await freshPluginModule();
    const content = makeEditor('presence-doc');
    const plugin = CollaborationPlugin({ websocketUrl: TEST_SERVER });
    (plugin.init as () => void)();
    await tick();

    const awareness = providers()[0].awareness;
    const errors: unknown[] = [];
    const publish = (clientId: number, state: unknown) => {
      awareness.states.set(clientId, state as never);
      try {
        awareness.emit('change', [{ added: [clientId], updated: [], removed: [] }, 'remote']);
      } catch (error) {
        errors.push(error);
      }
    };

    publish(101, { user: { name: 5, color: {} } });
    publish(102, { user: { name: '', color: '#fff' } });
    publish(103, { user: null });
    publish(104, { user: { name: 'ok', color: 'url(javascript:alert(1))' } });
    publish(105, { user: { name: 'Zed', color: '#0ea5e9' } });

    expect(errors).toEqual([]);
    const avatars = Array.from(content.previousElementSibling!.querySelectorAll<HTMLElement>('.editora-collab-presence__avatar'));
    expect(avatars.map((avatar) => avatar.title)).toEqual(['ok', 'Zed']);
    expect(avatars[0].style.backgroundColor).not.toContain('url');
    plugin.destroy?.();
  });
});

describe('teardown with caller-supplied objects', () => {
  it('does not destroy a doc the caller passed in, but still stops applying remote updates', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { CollaborationPlugin } = await freshPluginModule();
    const content = makeEditor('teardown-doc');
    const doc = new Y.Doc();
    let destroyed = false;
    doc.on('destroy', () => {
      destroyed = true;
    });

    const plugin = CollaborationPlugin({ doc, websocketUrl: TEST_SERVER });
    (plugin.init as () => void)();
    await tick();
    expect(content.textContent).toBe('seed');

    plugin.destroy?.();
    expect(destroyed).toBe(false);

    // The doc is still alive; a peer keeps editing it.
    const peer = new Y.Doc();
    Y.applyUpdate(peer, Y.encodeStateAsUpdate(doc));
    (peer.getXmlFragment('editora-content').get(0) as Y.XmlElement).insert(0, [new Y.XmlText('remote ')]);
    Y.applyUpdate(doc, Y.encodeStateAsUpdate(peer));
    await tick();

    expect(content.textContent).toBe('seed');
  });

  it('releases the undo manager so it stops tracking a doc that outlives the editor', async () => {
    const undoDestroy = vi.spyOn(Y.UndoManager.prototype, 'destroy');
    const { CollaborationPlugin } = await freshPluginModule();
    makeEditor('undo-doc');
    const doc = new Y.Doc();
    const provider = { doc, synced: true, wsconnected: true, awareness: new (await import('y-protocols/awareness')).Awareness(doc), on() {}, off() {}, destroy: vi.fn() };

    const plugin = CollaborationPlugin({ provider: provider as never });
    (plugin.init as () => void)();
    await tick();
    plugin.destroy?.();

    expect(undoDestroy).toHaveBeenCalledTimes(1);
    expect(provider.destroy).not.toHaveBeenCalled();
  });

  it('binds to the supplied provider\'s own doc when no doc is passed', async () => {
    const { CollaborationPlugin } = await freshPluginModule();
    const content = makeEditor('provider-doc');
    const doc = new Y.Doc();
    const provider = { doc, synced: true, wsconnected: true, awareness: new (await import('y-protocols/awareness')).Awareness(doc), on() {}, off() {}, destroy() {} };

    const plugin = CollaborationPlugin({ provider: provider as never });
    (plugin.init as () => void)();
    await tick();

    // The editor's seed content must have landed in the provider's doc, not in a private one.
    expect(doc.getXmlFragment('editora-content').length).toBeGreaterThan(0);
    expect(content.textContent).toBe('seed');
    plugin.destroy?.();
  });
});
