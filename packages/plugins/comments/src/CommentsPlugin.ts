import { Plugin } from '@editora/core';
import { getScopedElementById, findEditorContainer, findContentElement, findEditorContainerFromSelection } from '../../shared/editorContainerHelpers';
// Use toast if available for error notification
let toast: any = undefined;
try {
  // @ts-ignore
  toast = require('@editora/toast').toast;
} catch {}

/**
 * Comments Plugin for Rich Text Editor
 *
 * Enables inline threaded comments without modifying document content:
 * - Comments stored separately from DOM
 * - Anchor markers placed on selected text
 * - Side panel for viewing/editing/resolving
 * - Thread replies support
 * - Keyboard accessible
 * - Screen reader compatible
 *
 * Rules:
 * - Comments attached via range serialization
 * - Anchors are atomic (non-editable)
 * - Content changes may orphan comments
 * - Undo/redo maintains anchors
 * - Export with/without comments option
 * - Read-only mode support
 */
export const CommentsPlugin = (): Plugin => ({
  name: "comments",
  toolbar: [
    {
      label: "Add Comment",
      command: "addComment",
      type: "button",
      icon: '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>add-comment</title><path d="M17.74,30,16,29l4-7h6a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H6A2,2,0,0,0,4,8V20a2,2,0,0,0,2,2h9v2H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H26a4,4,0,0,1,4,4V20a4,4,0,0,1-4,4H21.16Z" transform="translate(0 0)"></path><polygon points="17 9 15 9 15 13 11 13 11 15 15 15 15 19 17 19 17 15 21 15 21 13 17 13 17 9"></polygon><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect></g></svg>',
    },
    {
      label: "Show / Hide Comments",
      command: "toggleComments",
      type: "button",
      icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 1H4V11H8L10 13L12 11H16V1Z" fill="#000000"></path> <path d="M2 5V13H7.17157L8.70711 14.5355L7.29289 15.9497L6.34315 15H0V5H2Z" fill="#000000"></path> </g></svg>',
    },
  ],
  // context: {
  //   provider: CommentsPluginProvider,
  // },
});

/**
 * Serialized Range for Comment Positioning
 * Allows recovery of text range even after DOM changes
 */
export interface SerializedRange {
  startContainer: string;   // XPath or node identifier
  startOffset: number;
  endContainer: string;
  endOffset: number;
}

/**
 * Comment Reply (Thread)
 */
export interface CommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  edited?: boolean;
  editedAt?: string;
}

/**
 * Comment Data Model
 */
export interface Comment {
  id: string;
  anchorId: string;           // Reference to DOM anchor element
  range: SerializedRange;     // Original range for recovery
  selectedText: string;       // Text that was commented on
  author: string;
  text: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  replies: CommentReply[];
}

/**
 * Comment registry
 */
const commentRegistry = new Map<string, Comment>();

/**
 * Serialize Range to allow recovery later
 */
function serializeRange(range: Range): SerializedRange {
  const startContainer = range.startContainer.parentElement?.id || 'root';
  const endContainer = range.endContainer.parentElement?.id || 'root';

  return {
    startContainer,
    startOffset: range.startOffset,
    endContainer,
    endOffset: range.endOffset
  };
}

/**
 * Attempt to deserialize and recover a range
 */
function deserializeRange(serialized: SerializedRange): Range | null {
  try {
    const range = document.createRange();
    const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;
    const startEl = getScopedElementById(editorContainer, serialized.startContainer) || document.body;
    const endEl = getScopedElementById(editorContainer, serialized.endContainer) || document.body;

    range.setStart(startEl, serialized.startOffset);
    range.setEnd(endEl, serialized.endOffset);

    return range;
  } catch (e) {
    console.warn('Failed to deserialize range:', e);
    return null;
  }
}

/**
 * Add Comment Command
 *
 * Creates comment anchor and opens editor
 */

// If general is true, add a general comment (no selection/anchor)
export const addCommentCommand = (author: string = 'Anonymous', text: string = '', general?: boolean): string => {
  if (general) {
    const commentId = `comment-${Date.now()}`;
    const comment: Comment = {
      id: commentId,
      anchorId: '',
      range: { startContainer: '', startOffset: 0, endContainer: '', endOffset: 0 },
      selectedText: '',
      author,
      text,
      createdAt: new Date().toISOString(),
      resolved: false,
      replies: []
    };
    commentRegistry.set(commentId, comment);
    return commentId;
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.toString().length === 0) {
    if (toast) toast.error('Please select some text in the editor to comment on.');
    return '';
  }

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();
  const commentId = `comment-${Date.now()}`;
  const anchorId = `comment-anchor-${Date.now()}`;

  // Create comment anchor span (invisible marker)
  const anchor = document.createElement('span');
  anchor.id = anchorId;
  anchor.className = 'rte-comment-anchor';
  anchor.setAttribute('data-comment-id', commentId);
  anchor.setAttribute('contenteditable', 'false');
  anchor.style.display = 'none';

  // Insert anchor at start of selection
  const startOffset = range.startOffset;
  const startContainer = range.startContainer;
  const clonedRange = range.cloneRange();
  clonedRange.collapse(true);
  clonedRange.insertNode(anchor);

  // Create comment object
  const comment: Comment = {
    id: commentId,
    anchorId,
    range: serializeRange(range),
    selectedText,
    author,
    text,
    createdAt: new Date().toISOString(),
    resolved: false,
    replies: []
  };

  // Register comment
  commentRegistry.set(commentId, comment);

  return commentId;
};

/**
 * Add Reply to Comment
 */
export const replyToComment = (commentId: string, author: string, text: string) => {
  const comment = commentRegistry.get(commentId);
  if (!comment) return;

  const reply: CommentReply = {
    id: `reply-${Date.now()}`,
    author,
    text,
    createdAt: new Date().toISOString()
  };

  comment.replies.push(reply);
};

/**
 * Resolve Comment
 */
export const resolveComment = (commentId: string, author: string) => {
  const comment = commentRegistry.get(commentId);
  if (comment) {
    comment.resolved = true;
    comment.resolvedAt = new Date().toISOString();
    comment.resolvedBy = author;
  }
};

/**
 * Reopen Comment
 */
export const reopenComment = (commentId: string) => {
  const comment = commentRegistry.get(commentId);
  if (comment) {
    comment.resolved = false;
    comment.resolvedAt = undefined;
    comment.resolvedBy = undefined;
  }
};

/**
 * Delete Comment
 */
export const deleteComment = (commentId: string) => {
  const comment = commentRegistry.get(commentId);
  if (comment) {
    const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;
    const anchor = getScopedElementById(editorContainer, comment.anchorId);
    if (anchor) anchor.remove();
    commentRegistry.delete(commentId);
  }
};

/**
 * Get all comments
 */
export const getAllComments = (): Comment[] => {
  return Array.from(commentRegistry.values());
};

/**
 * Get comments for specific range
 */
export const getCommentsForRange = (range: Range): Comment[] => {
  return Array.from(commentRegistry.values()).filter(comment => {
    const recoveredRange = deserializeRange(comment.range);
    if (!recoveredRange) return false;

    return (
      recoveredRange.startContainer === range.startContainer &&
      recoveredRange.startOffset === range.startOffset
    );
  });
};

/**
 * Update comment text
 */
export const updateCommentText = (commentId: string, text: string) => {
  const comment = commentRegistry.get(commentId);
  if (comment) {
    comment.text = text;
  }
};

/**
 * Export document with/without comments
 */
export const exportDocumentWithComments = (includeComments: boolean = false): string => {
  const editor = findContentElement(document.activeElement as HTMLElement);
  if (!editor) return '';

  const clone = editor.cloneNode(true) as HTMLElement;

  if (!includeComments) {
    // Remove comment anchors
    clone.querySelectorAll('.rte-comment-anchor').forEach(el => el.remove());
  }

  return clone.innerHTML;
};

/**
 * Highlight comment anchor
 */
export const highlightComment = (commentId: string, highlight: boolean = true) => {
  const comment = commentRegistry.get(commentId);
  if (!comment) return;

  const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;
  const anchor = getScopedElementById(editorContainer, comment.anchorId);
  if (anchor) {
    if (highlight) {
      anchor.classList.add('highlighted');
      anchor.style.display = 'inline';
      anchor.style.backgroundColor = '#ffeb3b';
      anchor.style.borderRadius = '3px';
    } else {
      anchor.classList.remove('highlighted');
      anchor.style.display = 'none';
    }
  }
};

/**
 * Validate comment integrity
 */
export const validateComments = (): boolean => {
  let isValid = true;
  const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;

  commentRegistry.forEach(comment => {
    const anchor = getScopedElementById(editorContainer, comment.anchorId);
    if (!anchor) {
      console.warn(`Comment anchor not found: ${comment.anchorId}`);
      isValid = false;
    }
  });

  return isValid;
};
