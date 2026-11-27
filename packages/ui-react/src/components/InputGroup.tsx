import '@editora/ui-core/input-group';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { InputGroup as ServerInputGroup } from './server/InputGroup';
export type * from './server/InputGroup';
export const InputGroup = ServerInputGroup;
export default ServerInputGroup;
