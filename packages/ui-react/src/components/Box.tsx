import '@editora/ui-core/box';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Box as ServerBox } from './server/Box';
export type * from './server/Box';
export const Box = ServerBox;
export default ServerBox;
