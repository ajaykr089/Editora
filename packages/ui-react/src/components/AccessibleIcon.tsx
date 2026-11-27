import '@editora/ui-core/accessible-icon';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { AccessibleIcon as ServerAccessibleIcon } from './server/AccessibleIcon';
export type * from './server/AccessibleIcon';
export const AccessibleIcon = ServerAccessibleIcon;
export default ServerAccessibleIcon;
