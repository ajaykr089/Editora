import '@editora/ui-core/field';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Field as ServerField } from './server/Field';
export type * from './server/Field';
export const Field = ServerField;
export default ServerField;
