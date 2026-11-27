import '@editora/ui-core/bubble';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Bubble as ServerBubble } from './server/Bubble';
export type * from './server/Bubble';
export const Bubble = ServerBubble;
export default ServerBubble;
