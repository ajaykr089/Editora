import '@editora/ui-core/prose';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Prose as ServerProse } from './server/Prose';
export type * from './server/Prose';
export const Prose = ServerProse;
export default ServerProse;
