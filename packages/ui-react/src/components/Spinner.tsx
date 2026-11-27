import '@editora/ui-core/spinner';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Spinner as ServerSpinner } from './server/Spinner';
export type * from './server/Spinner';
export const Spinner = ServerSpinner;
export default ServerSpinner;
