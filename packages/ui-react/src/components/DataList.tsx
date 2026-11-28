import '@editora/ui-core/data-list';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { DataList as ServerDataList } from './server/DataList';
export type * from './server/DataList';
export const DataList = ServerDataList;
export default ServerDataList;
