import '@editora/ui-core/anchor';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Anchor as ServerAnchor } from './server/Anchor';
export type * from './server/Anchor';
export const Anchor = ServerAnchor;
export default ServerAnchor;
