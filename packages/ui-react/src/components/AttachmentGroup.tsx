import '@editora/ui-core/attachment-group';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { AttachmentGroup as ServerAttachmentGroup } from './server/AttachmentGroup';
export type * from './server/AttachmentGroup';
export const AttachmentGroup = ServerAttachmentGroup;
export default ServerAttachmentGroup;
