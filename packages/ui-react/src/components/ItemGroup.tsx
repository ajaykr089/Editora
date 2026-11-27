import '@editora/ui-core/item-group';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { ItemGroup as ServerItemGroup } from './server/ItemGroup';
export type * from './server/ItemGroup';
export const ItemGroup = ServerItemGroup;
export default ServerItemGroup;
