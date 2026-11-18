import '@editora/ui-core/container';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Container as ServerContainer } from './server/Container';
export type * from './server/Container';
export const Container = ServerContainer;
export default ServerContainer;
