import '@editora/ui-core/button-group';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { ButtonGroup as ServerButtonGroup } from './server/ButtonGroup';
export type * from './server/ButtonGroup';
export const ButtonGroup = ServerButtonGroup;
export default ServerButtonGroup;
