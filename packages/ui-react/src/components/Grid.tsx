import '@editora/ui-core/grid';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Grid as ServerGrid } from './server/Grid';
export type * from './server/Grid';
export const Grid = ServerGrid;
export default ServerGrid;
