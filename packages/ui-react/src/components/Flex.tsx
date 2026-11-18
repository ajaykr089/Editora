import '@editora/ui-core/flex';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Flex as ServerFlex } from './server/Flex';
export type * from './server/Flex';
export const Flex = ServerFlex;
export default ServerFlex;
