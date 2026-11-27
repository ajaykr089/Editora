import '@editora/ui-core/trace';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Trace as ServerTrace } from './server/Trace';
export type * from './server/Trace';
export const Trace = ServerTrace;
export default ServerTrace;
