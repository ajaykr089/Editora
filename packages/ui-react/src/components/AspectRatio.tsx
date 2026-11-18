import '@editora/ui-core/aspect-ratio';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { AspectRatio as ServerAspectRatio } from './server/AspectRatio';
export type * from './server/AspectRatio';
export const AspectRatio = ServerAspectRatio;
export default ServerAspectRatio;
