import '@editora/ui-core/separator';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Separator as ServerSeparator } from './server/Separator';
export type * from './server/Separator';
export const Separator = ServerSeparator;
export default ServerSeparator;
