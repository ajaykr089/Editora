import '@editora/ui-core/message';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Message as ServerMessage } from './server/Message';
export type * from './server/Message';
export const Message = ServerMessage;
export default ServerMessage;
