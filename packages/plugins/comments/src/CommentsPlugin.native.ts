import { Plugin } from '@editora/core';

/**
 * Comments Plugin - Native Implementation with Complete UI Parity
 * 
 * Matches React CommentsPluginProvider exactly:
 * - Expandable/collapsible comments
 * - Always-on "Add Comment" textarea at top
 * - Selection preservation with selectionRef
 * - Comment count in header
 * - Inline reply textareas in expanded view
 * - Complete CSS styling
 * - Selection change tracking
 * - General comments support
 */

interface CommentReply {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface Comment {
  id: string;
  anchorId: string;
  selectedText: string;
  author: string;
  text: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  replies: CommentReply[];
}

// State
const commentRegistry = new Map<string, Comment>();
let commentsPanelVisible = false;
let commentsPanelElement: HTMLElement | null = null;
let expandedComments = new Set<string>();
let replyTexts: { [key: string]: string } = {};
let savedSelection: Range | null = null;
let newCommentText = '';
const commentAuthor = 'User';

// Track selection changes while panel is open
let selectionChangeListener: (() => void) | null = null;

/**
 * Get all comments
 */
export function getAllComments(): Comment[] {
  return Array.from(commentRegistry.values());
}

/**
 * Add comment (with or without selection)
 */
export function addCommentCommand(author: string, text: string, general = false): string {
  if (general) {
    const commentId = `comment-${Date.now()}`;
    const comment: Comment = {
      id: commentId,
      anchorId: '',
      selectedText: '',
      author,
      text,
      createdAt: new Date().toISOString(),
      resolved: false,
      replies: []
    };
    commentRegistry.set(commentId, comment);
    refreshCommentsPanel();
    return commentId;
  }

  // Use saved selection if available
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return '';
  
  const range = savedSelection || selection.getRangeAt(0);
  const selectedText = range.toString();
  
  if (!selectedText) return '';

  const commentId = `comment-${Date.now()}`;
  const anchorId = `comment-anchor-${Date.now()}`;

  // Create anchor span
  const anchor = document.createElement('span');
  anchor.id = anchorId;
  anchor.className = 'rte-comment-anchor';
  anchor.setAttribute('data-comment-id', commentId);
  anchor.style.cssText = `
    background-color: #ffeb3b;
    border-bottom: 2px solid #fbc02d;
    cursor: pointer;
    position: relative;
  `;
  anchor.title = 'Click to view comment';

  // Wrap selection
  const clonedRange = range.cloneRange();
  const contents = clonedRange.extractContents();
  anchor.appendChild(contents);
  clonedRange.insertNode(anchor);

  // Create comment
  const comment: Comment = {
    id: commentId,
    anchorId,
    selectedText,
    author,
    text,
    createdAt: new Date().toISOString(),
    resolved: false,
    replies: []
  };

  commentRegistry.set(commentId, comment);

  // Add click handler
  anchor.onclick = () => {
    commentsPanelVisible = true;
    createCommentsPanel();
  };

  refreshCommentsPanel();
  
  // Clear selection
  savedSelection = null;
  selection.removeAllRanges();
  
  return commentId;
}

/**
 * Resolve comment
 */
export function resolveComment(commentId: string, author: string) {
  const comment = commentRegistry.get(commentId);
  if (!comment) return;

  comment.resolved = true;
  comment.resolvedAt = new Date().toISOString();
  comment.resolvedBy = author;

  if (comment.anchorId) {
    const anchor = document.getElementById(comment.anchorId);
    if (anchor) {
      anchor.style.backgroundColor = '#e0e0e0';
      anchor.style.borderBottom = '2px solid #bdbdbd';
      anchor.style.opacity = '0.6';
    }
  }

  refreshCommentsPanel();
}

/**
 * Reopen comment
 */
export function reopenComment(commentId: string) {
  const comment = commentRegistry.get(commentId);
  if (!comment) return;

  comment.resolved = false;
  comment.resolvedAt = undefined;
  comment.resolvedBy = undefined;

  if (comment.anchorId) {
    const anchor = document.getElementById(comment.anchorId);
    if (anchor) {
      anchor.style.backgroundColor = '#ffeb3b';
      anchor.style.borderBottom = '2px solid #fbc02d';
      anchor.style.opacity = '1';
    }
  }

  refreshCommentsPanel();
}

/**
 * Delete comment
 */
export function deleteComment(commentId: string) {
  const comment = commentRegistry.get(commentId);
  if (!comment) return;

  if (comment.anchorId) {
    const anchor = document.getElementById(comment.anchorId);
    if (anchor) {
      const parent = anchor.parentNode;
      while (anchor.firstChild) {
        parent?.insertBefore(anchor.firstChild, anchor);
      }
      anchor.remove();
    }
  }

  commentRegistry.delete(commentId);
  refreshCommentsPanel();
}

/**
 * Reply to comment
 */
export function replyToComment(commentId: string, author: string, text: string) {
  const comment = commentRegistry.get(commentId);
  if (!comment) return;

  const reply: CommentReply = {
    id: `reply-${Date.now()}`,
    author,
    text,
    createdAt: new Date().toISOString()
  };

  comment.replies.push(reply);
  refreshCommentsPanel();
}

/**
 * Highlight comment
 */
export function highlightComment(commentId: string, highlight: boolean) {
  const comment = commentRegistry.get(commentId);
  if (!comment || !comment.anchorId) return;

  const anchor = document.getElementById(comment.anchorId);
  if (anchor) {
    if (highlight) {
      anchor.classList.add('highlighted');
      anchor.style.outline = '2px solid #0066cc';
      anchor.style.outlineOffset = '2px';
    } else {
      anchor.classList.remove('highlighted');
      anchor.style.outline = 'none';
    }
  }
}

/**
 * Create Comments Panel with exact React UI
 */
function createCommentsPanel() {
  if (commentsPanelElement) {
    commentsPanelElement.style.display = commentsPanelVisible ? 'block' : 'none';
    if (commentsPanelVisible) {
      refreshCommentsPanel();
      startSelectionTracking();
    } else {
      stopSelectionTracking();
    }
    return;
  }

  const panel = document.createElement('div');
  panel.className = 'rte-comments-panel';
  
  commentsPanelElement = panel;
  document.body.appendChild(panel);
  
  refreshCommentsPanel();
  startSelectionTracking();
  addCommentsPanelStyles();
}

/**
 * Start tracking selection changes
 */
function startSelectionTracking() {
  if (selectionChangeListener) return;
  
  selectionChangeListener = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      savedSelection = sel.getRangeAt(0).cloneRange();
    }
  };
  
  document.addEventListener('selectionchange', selectionChangeListener);
}

/**
 * Stop tracking selection changes
 */
function stopSelectionTracking() {
  if (selectionChangeListener) {
    document.removeEventListener('selectionchange', selectionChangeListener);
    selectionChangeListener = null;
  }
  savedSelection = null;
}

/**
 * Refresh Comments Panel Content
 */
function refreshCommentsPanel() {
  if (!commentsPanelElement) return;

  const comments = getAllComments();
  
  commentsPanelElement.innerHTML = `
    <div class="comments-header" style="display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0;">Comments (${comments.length})</h3>
      <button class="rte-comments-close" aria-label="Close comments panel">✕</button>
    </div>

    <div class="comment-add-box">
      <textarea class="new-comment-textarea" placeholder="Add a new comment..." rows="2"></textarea>
      <button class="rte-button-small add-comment-btn">Add Comment</button>
    </div>

    ${comments.length === 0 ? 
      '<div class="comments-empty">No comments yet</div>' :
      '<div class="comments-list"></div>'
    }
  `;

  // Close button handler
  const closeBtn = commentsPanelElement.querySelector('.rte-comments-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      commentsPanelVisible = false;
      if (commentsPanelElement) commentsPanelElement.style.display = 'none';
      stopSelectionTracking();
    });
  }

  // New comment handler
  const textarea = commentsPanelElement.querySelector('.new-comment-textarea') as HTMLTextAreaElement;
  const addBtn = commentsPanelElement.querySelector('.add-comment-btn') as HTMLButtonElement;
  
  if (textarea && addBtn) {
    textarea.value = newCommentText;
    textarea.oninput = () => {
      newCommentText = textarea.value;
      addBtn.disabled = !newCommentText.trim();
      addBtn.style.opacity = newCommentText.trim() ? '1' : '0.5';
    };
    
    addBtn.disabled = !newCommentText.trim();
    addBtn.style.opacity = newCommentText.trim() ? '1' : '0.5';
    
    addBtn.onclick = () => {
      if (!newCommentText.trim()) {
        alert('Comment cannot be empty');
        textarea.focus();
        return;
      }
      
      if (savedSelection) {
        addCommentCommand(commentAuthor, newCommentText.trim());
      } else {
        addCommentCommand(commentAuthor, newCommentText.trim(), true);
      }
      
      newCommentText = '';
      textarea.value = '';
      refreshCommentsPanel();
    };
  }

  // Render comment cards
  if (comments.length > 0) {
    const commentsList = commentsPanelElement.querySelector('.comments-list');
    if (commentsList) {
      comments.forEach(comment => {
        const card = createCommentCard(comment);
        commentsList.appendChild(card);
      });
    }
  }
}

/**
 * Create Comment Card
 */
function createCommentCard(comment: Comment): HTMLElement {
  const isExpanded = expandedComments.has(comment.id);
  
  const card = document.createElement('div');
  card.className = `comment-item${comment.resolved ? ' resolved' : ''}`;
  
  // Header
  const header = document.createElement('div');
  header.className = 'comment-header';
  header.innerHTML = `
    <div class="comment-meta">
      <strong>${comment.author}</strong>
      <span class="comment-date">${new Date(comment.createdAt).toLocaleDateString()}</span>
    </div>
    <button class="comment-expand" aria-label="Toggle comment">${isExpanded ? '▼' : '▶'}</button>
  `;
  
  const expandBtn = header.querySelector('.comment-expand');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      if (expandedComments.has(comment.id)) {
        expandedComments.delete(comment.id);
      } else {
        expandedComments.add(comment.id);
      }
      refreshCommentsPanel();
    });
  }
  
  card.appendChild(header);
  
  // Comment text
  const text = document.createElement('div');
  text.className = 'comment-text';
  text.textContent = comment.text;
  card.appendChild(text);
  
  // Selected text
  if (comment.selectedText) {
    const selection = document.createElement('div');
    selection.className = 'comment-selection';
    selection.textContent = `"${comment.selectedText}"`;
    card.appendChild(selection);
  }
  
  // Expanded content
  if (isExpanded) {
    const expanded = document.createElement('div');
    expanded.className = 'comment-expanded';
    
    // Replies
    if (comment.replies.length > 0) {
      const repliesDiv = document.createElement('div');
      repliesDiv.className = 'comment-replies';
      
      comment.replies.forEach(reply => {
        const replyDiv = document.createElement('div');
        replyDiv.className = 'comment-reply';
        replyDiv.innerHTML = `
          <div class="reply-header">
            <strong>${reply.author}</strong>
            <span class="reply-date">${new Date(reply.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="reply-text">${reply.text}</div>
        `;
        repliesDiv.appendChild(replyDiv);
      });
      
      expanded.appendChild(repliesDiv);
    }
    
    // Reply input
    if (!comment.resolved) {
      const replyInput = document.createElement('div');
      replyInput.className = 'comment-reply-input';
      
      const replyTextarea = document.createElement('textarea');
      replyTextarea.placeholder = 'Add a reply...';
      replyTextarea.rows = 2;
      replyTextarea.value = replyTexts[comment.id] || '';
      replyTextarea.oninput = () => {
        replyTexts[comment.id] = replyTextarea.value;
      };
      
      const replyBtn = document.createElement('button');
      replyBtn.className = 'rte-button-small';
      replyBtn.textContent = 'Reply';
      replyBtn.onclick = () => {
        if (replyTexts[comment.id]?.trim()) {
          replyToComment(comment.id, commentAuthor, replyTexts[comment.id]);
          replyTexts[comment.id] = '';
          refreshCommentsPanel();
        }
      };
      
      replyInput.appendChild(replyTextarea);
      replyInput.appendChild(replyBtn);
      expanded.appendChild(replyInput);
    }
    
    // Actions
    const actions = document.createElement('div');
    actions.className = 'comment-actions';
    
    if (!comment.resolved) {
      const resolveBtn = document.createElement('button');
      resolveBtn.className = 'action-button resolve';
      resolveBtn.textContent = '✓ Resolve';
      resolveBtn.onclick = () => resolveComment(comment.id, commentAuthor);
      actions.appendChild(resolveBtn);
    } else {
      const reopenBtn = document.createElement('button');
      reopenBtn.className = 'action-button reopen';
      reopenBtn.textContent = '↻ Reopen';
      reopenBtn.onclick = () => reopenComment(comment.id);
      actions.appendChild(reopenBtn);
    }
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-button delete';
    deleteBtn.textContent = '🗑 Delete';
    deleteBtn.onclick = () => {
      if (confirm('Delete this comment?')) {
        deleteComment(comment.id);
      }
    };
    actions.appendChild(deleteBtn);
    
    expanded.appendChild(actions);
    card.appendChild(expanded);
  }
  
  // Hover highlighting
  card.onmouseenter = () => highlightComment(comment.id, true);
  card.onmouseleave = () => highlightComment(comment.id, false);
  
  return card;
}

/**
 * Add Comments Panel Styles (matching React CSS exactly)
 */
function addCommentsPanelStyles() {
  if (document.getElementById('rte-comments-panel-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'rte-comments-panel-styles';
  style.textContent = `
    .rte-comments-close:hover {
      color: #d32f2f;
    }
    .rte-comments-panel {
      position: fixed;
      right: 0;
      top: 0;
      width: 350px;
      height: 100%;
      background: white;
      border-left: 1px solid #ddd;
      box-shadow: -2px 0 4px rgba(0,0,0,0.1);
      overflow-y: auto;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      flex-direction: column;
    }
    .comments-header {
      padding: 16px;
      border-bottom: 1px solid #eee;
      background-color: #fafafa;
    }
    .comments-header h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }
    .rte-comments-close {
      background: none;
      border: none;
      font-size: 22px;
      cursor: pointer;
      color: #888;
      margin-left: 8px;
      padding: 0;
    }
    .comment-add-box {
      padding: 12px;
      border-bottom: 1px solid #eee;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .new-comment-textarea {
      font-size: 13px;
      padding: 8px;
      border-radius: 3px;
      border: 1px solid #ddd;
      resize: vertical;
      font-family: inherit;
    }
    .comments-empty {
      padding: 16px;
      text-align: center;
      color: #999;
      font-size: 13px;
    }
    .comments-list {
      padding: 12px;
    }
    .comment-item {
      padding: 12px;
      margin-bottom: 12px;
      border: 1px solid #eee;
      border-radius: 4px;
      background-color: white;
      transition: all 0.2s;
    }
    .comment-item:hover {
      border-color: #ddd;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .comment-item.resolved {
      opacity: 0.6;
      background-color: #f5f5f5;
    }
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .comment-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .comment-meta strong {
      font-size: 13px;
      color: #333;
    }
    .comment-date {
      font-size: 11px;
      color: #999;
    }
    .comment-expand {
      background: none;
      border: none;
      cursor: pointer;
      color: #666;
      font-size: 12px;
      padding: 0;
    }
    .comment-text {
      font-size: 13px;
      line-height: 1.4;
      color: #333;
      margin-bottom: 8px;
    }
    .comment-selection {
      font-size: 12px;
      color: #666;
      font-style: italic;
      background-color: #f9f9f9;
      padding: 6px;
      border-radius: 3px;
      margin-bottom: 8px;
    }
    .comment-expanded {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #eee;
    }
    .comment-replies {
      margin-bottom: 12px;
    }
    .comment-reply {
      padding: 8px;
      background-color: #fafafa;
      border-radius: 3px;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .reply-header {
      display: flex;
      gap: 8px;
      margin-bottom: 4px;
    }
    .reply-header strong {
      font-size: 12px;
      color: #333;
    }
    .reply-date {
      font-size: 11px;
      color: #999;
    }
    .reply-text {
      font-size: 12px;
      color: #666;
      line-height: 1.3;
    }
    .comment-reply-input {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 12px;
    }
    .comment-reply-input textarea {
      font-size: 12px;
      padding: 6px;
      border: 1px solid #ddd;
      border-radius: 3px;
      font-family: inherit;
      resize: vertical;
    }
    .rte-button-small {
      font-size: 12px;
      padding: 4px 8px;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      align-self: flex-end;
    }
    .rte-button-small:hover {
      background-color: #1565c0;
    }
    .rte-button-small:disabled {
      opacity: 0.5;
      pointer-events: none;
    }
    .comment-actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
    }
    .action-button {
      font-size: 12px;
      padding: 4px 8px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .action-button:hover {
      background-color: #eeeeee;
    }
    .action-button.resolve {
      color: #2e7d32;
    }
    .action-button.delete {
      color: #c62828;
    }
    .rte-comment-anchor {
      position: relative;
    }
    .rte-comment-anchor.highlighted {
      background-color: #ffeb3b !important;
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);
}

export const CommentsPlugin = (): Plugin => ({
  name: 'comments',
  
  toolbar: [
    {
      label: 'Add Comment',
      command: 'addComment',
      type: 'button',
      icon: '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>add-comment</title><path d="M17.74,30,16,29l4-7h6a2,2,0,0,0,2-2V8a2,2,0,0,0-2-2H6A2,2,0,0,0,4,8V20a2,2,0,0,0,2,2h9v2H6a4,4,0,0,1-4-4V8A4,4,0,0,1,6,4H26a4,4,0,0,1,4,4V20a4,4,0,0,1-4,4H21.16Z" transform="translate(0 0)"></path><polygon points="17 9 15 9 15 13 11 13 11 15 15 15 15 19 17 19 17 15 21 15 21 13 17 13 17 9"></polygon><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect></g></svg>',
    },
    {
      label: 'Show / Hide Comments',
      command: 'toggleComments',
      type: 'button',
      icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 1H4V11H8L10 13L12 11H16V1Z" fill="#000000"></path> <path d="M2 5V13H7.17157L8.70711 14.5355L7.29289 15.9497L6.34315 15H0V5H2Z" fill="#000000"></path> </g></svg>',
    },
  ],
  
  commands: {
    addComment: () => {
      // Save current selection
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        savedSelection = sel.getRangeAt(0).cloneRange();
      } else {
        savedSelection = null;
      }
      
      commentsPanelVisible = true;
      createCommentsPanel();
      return true;
    },
    
    toggleComments: () => {
      commentsPanelVisible = !commentsPanelVisible;
      createCommentsPanel();
      return true;
    }
  },
  
  keymap: {}
});
