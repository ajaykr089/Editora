export {
  CommentsPlugin,
  getCommentThreads,
  setCommentThreads,
  upsertCommentThread,
  removeCommentThread,
  configureComments,
} from './CommentsPlugin.native';
export type {
  CommentReplyData,
  CommentThread,
  CommentUser,
  CommentsChange,
  CommentsChangeReason,
  CommentsOptions,
} from './types';
