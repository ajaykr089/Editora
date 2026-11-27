import '@editora/ui-core/heading';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Heading as ServerHeading } from './server/Heading';
export type * from './server/Heading';
export const Heading = ServerHeading;
export default ServerHeading;
