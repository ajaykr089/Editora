import '@editora/ui-core/visually-hidden';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { VisuallyHidden as ServerVisuallyHidden } from './server/VisuallyHidden';
export type * from './server/VisuallyHidden';
export const VisuallyHidden = ServerVisuallyHidden;
export default ServerVisuallyHidden;
