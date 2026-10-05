import type * as Y from 'yjs';
import type { WebsocketProvider } from 'y-websocket';

export interface CollaborationUser {
  name: string;
  color: string;
}

export interface CursorState {
  user: CollaborationUser;
  /** Child-index path from the bound root down to the anchor text node. */
  anchorPath: number[];
  anchorOffset: number;
  /** Same shape as anchorPath; omitted when the selection is collapsed. */
  focusPath?: number[];
  focusOffset?: number;
  clientId: number;
}

export interface CollaborationPluginOptions {
  /** y-websocket server URL, e.g. "wss://demos.yjs.dev". */
  websocketUrl?: string;
  /**
   * Room name shared by every client editing the same document. Accepts a
   * static string or a function of the editor's DOM id, so a single plugin
   * instance can serve multiple editors on one page with distinct rooms.
   */
  roomName?: string | ((editorElement: HTMLElement) => string);
  userName?: string;
  userColor?: string;
  /** Supply an existing Y.Doc instead of letting the plugin create one. */
  doc?: Y.Doc;
  /** Supply an existing provider instead of letting the plugin create one. */
  provider?: WebsocketProvider;
}

export interface EditorCollaborationState {
  doc: Y.Doc;
  provider: WebsocketProvider;
  ownsProvider: boolean;
  ownsDoc: boolean;
  binding: import('./YjsDomBinding').YjsDomBinding;
  undoManager: Y.UndoManager;
  cursorCleanup: () => void;
  connectionIndicator: HTMLElement;
}
