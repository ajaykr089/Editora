import '@editora/ui-core/icon';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Icon as ServerIcon } from './server/Icon';
export type * from './server/Icon';
export const Icon = ServerIcon;
export default ServerIcon;
