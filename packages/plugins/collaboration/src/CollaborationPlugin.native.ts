import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { Plugin } from '@editora/core';
import { YjsDomBinding } from './YjsDomBinding';
import { CollaborationAwareness, readUser } from './awareness';
import type { CollaborationPluginOptions, CollaborationUser, EditorCollaborationState } from './types';

const FRAGMENT_NAME = 'editora-content';
const DEFAULT_WEBSOCKET_URL = 'wss://demos.yjs.dev';
const DEFAULT_ROOM_NAME = 'editora-default-room';
const PRESENCE_COLORS = ['#f97316', '#0ea5e9', '#22c55e', '#a855f7', '#ec4899', '#eab308', '#14b8a6', '#ef4444'];

const stateByContent = new WeakMap<HTMLElement, EditorCollaborationState>();
const trackedContentElements = new Set<HTMLElement>();
// Content elements whose provider hasn't finished its initial sync yet, and
// the teardown to run if destroy() is called during that window.
const pendingContentElements = new Set<HTMLElement>();
const pendingCleanup = new Map<HTMLElement, () => void>();

let warnedAboutPublicServer = false;

// With no `websocketUrl` the plugin syncs through the public Yjs demo server, where anyone who
// knows (or guesses) the room name can read and write the document. Fine for a demo, a data leak
// in production - so say so once instead of doing it silently.
function warnAboutPublicServer(room: string): void {
  if (warnedAboutPublicServer) return;
  warnedAboutPublicServer = true;
  // eslint-disable-next-line no-console
  console.warn(
    `[@editora/collaboration] No websocketUrl was provided, so room "${room}" is syncing through the public demo server ` +
      `(${DEFAULT_WEBSOCKET_URL}); anyone who knows the room name can read and edit this document. ` +
      `Pass your own y-websocket server via the websocketUrl option (or a provider) for real use.`
  );
}

function randomUser(): CollaborationUser {
  const id = Math.floor(Math.random() * 10000);
  return {
    name: `Guest ${id}`,
    color: PRESENCE_COLORS[id % PRESENCE_COLORS.length]
  };
}

// @editora/core's web component calls a plugin's init() hook with a real
// { editorElement }. @editora/react's RichTextEditor does not take that
// path at all - its PluginManager.register(p) calls plugin.init(pluginConfig)
// with no element, only whatever config object was attached (undefined
// here) - so an implementation that bootstraps from init()'s argument
// silently never activates in React. Fixing that per-framework would mean
// two divergent code paths that can drift out of sync, so instead every
// CollaborationPlugin(options) call enqueues itself as a "claim" the
// instant it's constructed (matching track-changes' precedent of doing
// setup work before returning the plugin object), and a single
// document-wide scanner - shared across every collaboration plugin
// instance on the page - matches each unclaimed editor root
// (.rte-content/.editora-content, the same selector every other native
// plugin here uses to find "the" contentEditable) to the oldest unclaimed
// construction-order entry in that queue via a MutationObserver, which
// reliably fires once the element mounts regardless of which framework (or
// timing) put it there. init()'s argument is therefore never read - it's
// only used as a signal that this instance exists and should enqueue.
interface PendingClaim {
  id: number;
  options: CollaborationPluginOptions;
  claimed: boolean;
}

let nextClaimId = 1;
const pendingClaims: PendingClaim[] = [];
const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content, [contenteditable]';
let scannerObserver: MutationObserver | null = null;

function isEditorContentElement(node: Element): boolean {
  return node.matches(EDITOR_CONTENT_SELECTOR);
}

function findUnboundEditorRoots(root: ParentNode): HTMLElement[] {
  const found: HTMLElement[] = [];
  if (root instanceof HTMLElement && isEditorContentElement(root) && !stateByContent.has(root) && !pendingContentElements.has(root)) {
    found.push(root);
  }
  root.querySelectorAll(EDITOR_CONTENT_SELECTOR).forEach((el) => {
    if (el instanceof HTMLElement && !stateByContent.has(el) && !pendingContentElements.has(el)) {
      found.push(el);
    }
  });
  return found;
}

function processClaimQueue(): void {
  if (pendingClaims.length === 0 || typeof document === 'undefined') return;
  const roots = findUnboundEditorRoots(document.body);
  for (const root of roots) {
    const claim = pendingClaims.find((c) => !c.claimed);
    if (!claim) break;
    claim.claimed = true;
    setupCollaboration(root, claim.options);
  }
  // Drop satisfied claims so a later, unrelated mutation batch doesn't
  // rescan an already-fully-processed queue on every DOM change.
  while (pendingClaims.length && pendingClaims[0].claimed) pendingClaims.shift();
}

function ensureScanner(): void {
  if (scannerObserver || typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
  scannerObserver = new MutationObserver(() => processClaimQueue());
  scannerObserver.observe(document.body, { childList: true, subtree: true });
}

function enqueueClaim(options: CollaborationPluginOptions): PendingClaim {
  const claim: PendingClaim = { id: nextClaimId++, options, claimed: false };
  pendingClaims.push(claim);
  ensureScanner();
  // The editor may already be in the DOM by the time this plugin instance
  // is constructed (e.g. React already rendered it before this effect ran).
  processClaimQueue();
  return claim;
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
  const states = awareness.getStates() as Map<number, { user?: unknown } | null>;
  states.forEach((state, clientId) => {
    if (clientId === awareness.clientID) return;
    // Peer-supplied: a malformed name/colour must not throw out of the awareness handler.
    const user = readUser(state?.user);
    if (!user) return;
    const avatar = document.createElement('span');
    avatar.className = 'editora-collab-presence__avatar';
    avatar.style.backgroundColor = user.color;
    avatar.title = user.name;
    avatar.textContent = Array.from(user.name)[0].toUpperCase();
    avatars.appendChild(avatar);
  });
}

function setupCollaboration(contentElement: HTMLElement, options: CollaborationPluginOptions): void {
  if (stateByContent.has(contentElement) || pendingContentElements.has(contentElement)) return;
  pendingContentElements.add(contentElement);

  // A supplied provider already owns a doc; binding a fresh, unrelated one would never sync.
  const doc = options.doc ?? options.provider?.doc ?? new Y.Doc();
  const ownsDoc = !options.doc && !options.provider;
  // `||`, not `??`: an element without an id has id === '' (never null/undefined), which would
  // otherwise become an empty room name shared by every id-less editor on the server.
  const room = typeof options.roomName === 'function'
    ? options.roomName(contentElement)
    : options.roomName || contentElement.id || DEFAULT_ROOM_NAME;

  const ownsProvider = !options.provider;
  if (ownsProvider && !options.websocketUrl) warnAboutPublicServer(room);
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
    completeCollaborationSetup(contentElement, doc, provider, ownsProvider, ownsDoc, user, presenceBar, onStatus, onAwarenessChange);
  };
  pendingCleanup.set(contentElement, () => {
    provider.off('sync', onceSynced);
    provider.off('status', onStatus);
    provider.awareness.off('change', onAwarenessChange);
    presenceBar.remove();
    if (ownsProvider) provider.destroy();
    if (ownsDoc) doc.destroy();
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
  ownsDoc: boolean,
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

  stateByContent.set(contentElement, { doc, provider, ownsProvider, ownsDoc, binding, undoManager, cursorCleanup, connectionIndicator: presenceBar });
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
  // Detach from the fragment: with a caller-supplied doc it outlives this editor.
  state.undoManager.destroy();
  if (state.ownsProvider) state.provider.destroy();
  // A doc the caller handed in is theirs: destroying it would break whatever else uses it.
  if (state.ownsDoc) state.doc.destroy();
  stateByContent.delete(contentElement);
  trackedContentElements.delete(contentElement);
}

export const CollaborationPlugin = (options: CollaborationPluginOptions = {}): Plugin => {
  // PluginLoader.load() (the web component's declarative plugins: ['collaboration']
  // path) always calls this factory with zero arguments, then stashes any
  // pluginConfig.collaboration config onto the returned instance as
  // __pluginConfig rather than re-invoking the factory with it - read that
  // here (merged over the direct-construction `options`, since it reflects
  // the consumer's actual declarative config) before enqueueing the claim.
  //
  // @editora/core also calls a plugin's init() hook twice for a single
  // web-component mount, from two separate, independent registration paths
  // (RichTextEditorElement's own loop, and EditorEngine's parallel
  // PluginManager.register()) - guard so this instance only ever enqueues
  // one claim, or a stray second claim would sit in the queue and
  // incorrectly grab a later, unrelated editor's slot.
  let hasEnqueued = false;
  const plugin: Plugin & { __pluginConfig?: CollaborationPluginOptions } = {
    name: 'collaboration',

    init: () => {
      if (hasEnqueued) return;
      hasEnqueued = true;
      enqueueClaim({ ...options, ...(plugin.__pluginConfig ?? {}) });
    },

    commands: {},

    destroy: () => {
      const all = new Set([...trackedContentElements, ...pendingContentElements]);
      Array.from(all).forEach((el) => teardownCollaboration(el));
    }
  };
  return plugin;
};
