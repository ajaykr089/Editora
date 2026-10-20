/**
 * What the host application sees of the comments: who wrote what, and the threads as plain data it can store and
 * hand back. No DOM in here, so it can be tested without one.
 */

export interface CommentUser {
  /** Your own id for the person. When it is set on both the user and a comment's author, only that person can edit or delete the comment. */
  id?: string;
  name: string;
  /** URL of a picture (http, https, a data:image URL or a path on the page). Without one, or if it fails to load, the initials are shown. */
  avatar?: string;
}

export interface CommentReplyData {
  id: string;
  author: CommentUser;
  text: string;
  createdAt: string;
  editedAt?: string;
}

/** One discussion. Store it as it is and give it back with `setCommentThreads` or `initialThreads`. */
export interface CommentThread {
  id: string;
  /** The `id` of the highlighted span in the document. Missing for a note about the whole document. */
  anchorId?: string;
  /** The text that was selected when the thread was started. */
  quote?: string;
  author: CommentUser;
  text: string;
  createdAt: string;
  editedAt?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: CommentUser;
  replies: CommentReplyData[];
}

export type CommentsChangeReason = 'create' | 'reply' | 'edit' | 'resolve' | 'reopen' | 'delete' | 'document';

export interface CommentsChange {
  reason: CommentsChangeReason;
  /** The thread the change is about, when there is one. */
  threadId?: string;
}

export interface CommentsOptions {
  /** Who is commenting. New comments, replies and resolutions are signed with this. Default: `{ name: 'User' }`. */
  currentUser?: CommentUser | string;
  /** Threads to show when the editor starts, for example the ones you saved with the document. */
  initialThreads?: CommentThread[];
  /** Called after every change to the comments, with all of them. Store them here. */
  onChange?: (threads: CommentThread[], change: CommentsChange) => void;
  /**
   * Whether `user` may edit or delete something `author` wrote. By default people can change their own comments
   * when both have an id, and anyone can change anything when there are no ids.
   */
  canModify?: (author: CommentUser, user: CommentUser) => boolean;
}

export const DEFAULT_USER: CommentUser = { name: 'User' };

/** Comment anchors are found by id in a selector, so an id that came from outside must not be able to break out of it. */
const SAFE_ID = /^[A-Za-z0-9_:.-]{1,200}$/;

export function isSafeId(value: unknown): value is string {
  return typeof value === 'string' && SAFE_ID.test(value);
}

/** Only addresses that load a picture: no `javascript:` and no other schemes. */
export function isSafeAvatarUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const url = value.trim();
  if (!url) return false;
  // A picture can be written into the address itself; those are long.
  if (/^data:image\/(png|jpe?g|gif|webp|avif);/i.test(url)) return url.length <= 300_000;
  if (url.length > 2000) return false;
  if (/^(https?:)?\/\//i.test(url)) return true;
  // A relative path: anything that does not start with a scheme.
  return !/^[a-z][a-z0-9+.-]*:/i.test(url);
}

export function normalizeUser(value: unknown): CommentUser | null {
  if (typeof value === 'string') {
    const name = value.trim();
    return name ? { name } : null;
  }
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!name) return null;
  const user: CommentUser = { name };
  if (raw.id !== undefined && raw.id !== null && String(raw.id) !== '') user.id = String(raw.id);
  if (isSafeAvatarUrl(raw.avatar)) user.avatar = (raw.avatar as string).trim();
  return user;
}

function isoOrNow(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  return Number.isNaN(new Date(value).getTime()) ? fallback : value;
}

function optionalIso(value: unknown): string | undefined {
  return typeof value === 'string' && !Number.isNaN(new Date(value).getTime()) ? value : undefined;
}

/**
 * Turns whatever the host handed over into well-formed threads: entries that cannot be shown are dropped, text is
 * trimmed, authors written as plain names become users, dates that do not parse are replaced, and ids that could
 * break a selector are rejected. Never throws.
 */
export function normalizeThreads(input: unknown, now: string = new Date().toISOString()): CommentThread[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const threads: CommentThread[] = [];

  for (const item of input) {
    if (!item || typeof item !== 'object') continue;
    const raw = item as Record<string, unknown>;
    if (!isSafeId(raw.id) || seen.has(raw.id)) continue;
    const text = typeof raw.text === 'string' ? raw.text.trim() : '';
    if (!text) continue;
    seen.add(raw.id);

    const thread: CommentThread = {
      id: raw.id,
      author: normalizeUser(raw.author) ?? DEFAULT_USER,
      text,
      createdAt: isoOrNow(raw.createdAt, now),
      resolved: raw.resolved === true,
      replies: [],
    };
    if (isSafeId(raw.anchorId)) thread.anchorId = raw.anchorId;
    if (typeof raw.quote === 'string' && raw.quote.trim()) thread.quote = raw.quote.trim();
    const editedAt = optionalIso(raw.editedAt);
    if (editedAt) thread.editedAt = editedAt;
    if (thread.resolved) {
      const resolvedAt = optionalIso(raw.resolvedAt);
      if (resolvedAt) thread.resolvedAt = resolvedAt;
      const resolvedBy = normalizeUser(raw.resolvedBy);
      if (resolvedBy) thread.resolvedBy = resolvedBy;
    }

    if (Array.isArray(raw.replies)) {
      const replyIds = new Set<string>();
      raw.replies.forEach((entry, index) => {
        if (!entry || typeof entry !== 'object') return;
        const reply = entry as Record<string, unknown>;
        const replyText = typeof reply.text === 'string' ? reply.text.trim() : '';
        if (!replyText) return;
        let id = isSafeId(reply.id) ? reply.id : `${raw.id}-reply-${index + 1}`;
        while (replyIds.has(id)) id = `${id}-x`;
        replyIds.add(id);
        const data: CommentReplyData = {
          id,
          author: normalizeUser(reply.author) ?? DEFAULT_USER,
          text: replyText,
          createdAt: isoOrNow(reply.createdAt, now),
        };
        const replyEdited = optionalIso(reply.editedAt);
        if (replyEdited) data.editedAt = replyEdited;
        thread.replies.push(data);
      });
    }

    threads.push(thread);
  }
  return threads;
}
