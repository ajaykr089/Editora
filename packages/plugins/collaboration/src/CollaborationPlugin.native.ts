import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { Plugin } from '@editora/core';
import { YjsDomBinding } from './YjsDomBinding';
import { CollaborationAwareness } from './awareness';
import type { CollaborationPluginOptions, CollaborationUser, EditorCollaborationState } from './types';

const FRAGMENT_NAME = 'editora-content';
const DEFAULT_WEBSOCKET_URL = 'wss://demos.yjs.dev';
const PRESENCE_COLORS = ['#f97316', '#0ea5e9', '#22c55e', '#a855f7', '#ec4899', '#eab308', '#14b8a6', '#ef4444'];

const stateByContent = new WeakMap<HTMLElement, EditorCollaborationState>();
const trackedContentElements = new Set<HTMLElement>();
// Content elements whose provider hasn't finished its initial sync yet, and
// the teardown to run if destroy() is called during that window.
const pendingContentElements = new Set<HTMLElement>();
const pendingCleanup = new Map<HTMLElement, () => void>();

function randomUser(): CollaborationUser {
  const id = Math.floor(Math.random() * 10000);
  return {
    name: `Guest ${id}`,
    color: PRESENCE_COLORS[id % PRESENCE_COLORS.length]
  };
}

function waitForContentElement(editorElement: HTMLElement, onReady: (contentElement: HTMLElement) => void, attemptsLeft = 120): void {
  const contentElement = editorElement.querySelector<HTMLElement>('[contenteditable]');
  if (contentElement) {
    onReady(contentElement);
    return;
  }
  if (attemptsLeft <= 0) {
    console.warn('[CollaborationPlugin] Timed out waiting for a contentEditable element to mount.');
    return;
  }
  requestAnimationFrame(() => waitForContentElement(editorElement, onReady, attemptsLeft - 1));
}

function ensurePresenceStyles(): void {
  const id = 'editora-collaboration-presence-styles';
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    .editora-collab-presence {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: system-ui, sans-serif;
      font-size: 12px;
      padding: 4px 8px;
    }
    .editora-collab-presence__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #94a3b8;
      flex-shrink: 0;
    }
    .editora-collab-presence__dot[data-status="connected"] { background: #22c55e; }
    .editora-collab-presence__dot[data-status="connecting"] { background: #eab308; }
    .editora-collab-presence__dot[data-status="disconnected"] { background: #ef4444; }
    .editora-collab-presence__avatars {
      display: inline-flex;
    }
    .editora-collab-presence__avatar {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      margin-left: -6px;
      border: 1.5px solid var(--rte-color-bg-primary, #ffffff);
    }
  `;
  document.head.appendChild(style);
}

function createPresenceIndicator(): HTMLElement {
  ensurePresenceStyles();
  const bar = document.createElement('div');
  bar.className = 'editora-collab-presence';
  const dot = document.createElement('span');
  dot.className = 'editora-collab-presence__dot';
  dot.dataset.status = 'connecting';
  const avatars = document.createElement('span');
  avatars.className = 'editora-collab-presence__avatars';
  bar.appendChild(dot);
  bar.appendChild(avatars);
  return bar;
}

function updatePresenceIndicator(bar: HTMLElement, status: string, awareness: WebsocketProvider['awareness']): void {
  const dot = bar.querySelector<HTMLElement>('.editora-collab-presence__dot');
  if (dot) dot.dataset.status = status;

  const avatars = bar.querySelector<HTMLElement>('.editora-collab-presence__avatars');
  if (!avatars) return;
  avatars.innerHTML = '';
  const states = awareness.getStates() as Map<number, { user?: CollaborationUser }>;
  states.forEach((state, clientId) => {
    if (clientId === awareness.clientID || !state.user) return;
    const avatar = document.createElement('span');
    avatar.className = 'editora-collab-presence__avatar';
    avatar.style.backgroundColor = state.user.color;
    avatar.title = state.user.name;
    avatar.textContent = state.user.name.charAt(0).toUpperCase();
    avatars.appendChild(avatar);
  });
}

function setupCollaboration(contentElement: HTMLElement, options: CollaborationPluginOptions): void {
  if (stateByContent.has(contentElement) || pendingContentElements.has(contentElement)) return;
  pendingContentElements.add(contentElement);

  const doc = options.doc ?? new Y.Doc();
  const room = typeof options.roomName === 'function'
    ? options.roomName(contentElement)
    : options.roomName ?? contentElement.id ?? 'editora-default-room';

  const ownsProvider = !options.provider;
  const provider = options.provider ?? new WebsocketProvider(options.websocketUrl ?? DEFAULT_WEBSOCKET_URL, room, doc);

  const user: CollaborationUser = {
    name: options.userName ?? randomUser().name,
    color: options.userColor ?? randomUser().color
  };

  const presenceBar = createPresenceIndicator();
  contentElement.insertAdjacentElement('beforebegin', presenceBar);
  updatePresenceIndicator(presenceBar, 'connecting', provider.awareness);

  const onStatus = ({ status }: { status: string }) => updatePresenceIndicator(presenceBar, status, provider.awareness);
  const onAwarenessChange = () => updatePresenceIndicator(presenceBar, provider.wsconnected ? 'connected' : 'connecting', provider.awareness);
  provider.on('status', onStatus);
  provider.awareness.on('change', onAwarenessChange);

  // The very first thing a binding does is decide, from the fragment's
  // current length, whether this client is seeding a brand-new room or
  // adopting an existing one - a decision that's only meaningful once the
  // provider has actually finished exchanging state with the server.
  // Deciding from a Y.Doc that's still empty because sync hasn't landed
  // yet caused duplicate content: two clients, both mid-connect, would
  // each conclude "I'm first" and seed their own copy.
  const onceSynced = (isSynced: boolean) => {
    if (!isSynced) return;
    provider.off('sync', onceSynced);
    pendingCleanup.delete(contentElement);
    completeCollaborationSetup(contentElement, doc, provider, ownsProvider, user, presenceBar, onStatus, onAwarenessChange);
  };
  pendingCleanup.set(contentElement, () => {
    provider.off('sync', onceSynced);
    provider.off('status', onStatus);
    provider.awareness.off('change', onAwarenessChange);
    presenceBar.remove();
    if (ownsProvider) {
      provider.destroy();
      doc.destroy();
    }
  });
  if (provider.synced) {
    onceSynced(true);
  } else {
    provider.on('sync', onceSynced);
  }
}

function completeCollaborationSetup(
  contentElement: HTMLElement,
  doc: Y.Doc,
  provider: WebsocketProvider,
  ownsProvider: boolean,
  user: CollaborationUser,
  presenceBar: HTMLElement,
  onStatus: (e: { status: string }) => void,
  onAwarenessChange: () => void
): void {
  pendingContentElements.delete(contentElement);
  if (stateByContent.has(contentElement)) return; // torn down while we were waiting to sync

  const fragment = doc.getXmlFragment(FRAGMENT_NAME);
  const binding = new YjsDomBinding(contentElement, doc, fragment);
  const cursors = new CollaborationAwareness(contentElement, provider.awareness, user);
  const undoManager = new Y.UndoManager(fragment, { trackedOrigins: new Set([binding]) });
  updatePresenceIndicator(presenceBar, provider.wsconnected ? 'connected' : 'connecting', provider.awareness);

  const onKeydown = (event: KeyboardEvent) => {
    const isMod = event.metaKey || event.ctrlKey;
    if (!isMod) return;
    if (event.key.toLowerCase() === 'z' && !event.shiftKey) {
      event.preventDefault();
      event.stopImmediatePropagation();
      undoManager.undo();
    } else if ((event.key.toLowerCase() === 'z' && event.shiftKey) || event.key.toLowerCase() === 'y') {
      event.preventDefault();
      event.stopImmediatePropagation();
      undoManager.redo();
    }
  };
  contentElement.addEventListener('keydown', onKeydown, { capture: true });

  const cursorCleanup = () => {
    contentElement.removeEventListener('keydown', onKeydown, { capture: true });
    provider.off('status', onStatus);
    provider.awareness.off('change', onAwarenessChange);
    presenceBar.remove();
    cursors.destroy();
  };

  stateByContent.set(contentElement, { doc, provider, ownsProvider, binding, undoManager, cursorCleanup, connectionIndicator: presenceBar });
  trackedContentElements.add(contentElement);
}

function teardownCollaboration(contentElement: HTMLElement): void {
  const pendingTeardown = pendingCleanup.get(contentElement);
  if (pendingTeardown) {
    pendingTeardown();
    pendingCleanup.delete(contentElement);
    pendingContentElements.delete(contentElement);
  }

  const state = stateByContent.get(contentElement);
  if (!state) return;
  state.cursorCleanup();
  state.binding.destroy();
  if (state.ownsProvider) {
    state.provider.destroy();
    state.doc.destroy();
  }
  stateByContent.delete(contentElement);
  trackedContentElements.delete(contentElement);
}

export const CollaborationPlugin = (options: CollaborationPluginOptions = {}): Plugin => {
  const plugin: Plugin & { __pluginConfig?: CollaborationPluginOptions } = {
    name: 'collaboration',

    // PluginLoader.load() always calls the registry factory with zero
    // arguments, then stashes any declarative `pluginConfig.collaboration`
    // config onto the returned instance as `__pluginConfig` rather than
    // re-invoking the factory with it - so options passed directly to
    // CollaborationPlugin({...}) (the documented direct-construction path)
    // are only the fallback; __pluginConfig, read here at init time, wins.
    //
    // init() is also called a second time, with no useful context at all,
    // by PluginManager.register() (EditorEngine's separate, parallel plugin
    // registration path - `plugin.init(pluginConfig)`, no editorElement).
    // Only the RichTextEditorElement-driven call passes a real
    // editorElement; the other is a no-op here.
    init: (context?: { editorElement?: HTMLElement }) => {
      if (!context?.editorElement) return;
      const resolvedOptions = { ...options, ...(plugin.__pluginConfig ?? {}) };
      waitForContentElement(context.editorElement, (contentElement) => {
        setupCollaboration(contentElement, resolvedOptions);
      });
    },

    commands: {},

    destroy: () => {
      const all = new Set([...trackedContentElements, ...pendingContentElements]);
      Array.from(all).forEach((el) => teardownCollaboration(el));
    }
  };
  return plugin;
};
