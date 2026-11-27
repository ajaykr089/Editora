import '@editora/ui-core/item';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Item as ServerItem } from './server/Item';
export type * from './server/Item';
export const Item = ServerItem;
export default ServerItem;
