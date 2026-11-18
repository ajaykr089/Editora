import '@editora/ui-core/label';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Label as ServerLabel } from './server/Label';
export type * from './server/Label';
export const Label = ServerLabel;
export default ServerLabel;
