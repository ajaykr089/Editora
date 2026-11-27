import '@editora/ui-core/text';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Text as ServerText } from './server/Text';
export type * from './server/Text';
export const Text = ServerText;
export default ServerText;
