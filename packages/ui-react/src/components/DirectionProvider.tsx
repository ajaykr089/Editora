import '@editora/ui-core/direction-provider';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { DirectionProvider as ServerDirectionProvider } from './server/DirectionProvider';
export type * from './server/DirectionProvider';
export const DirectionProvider = ServerDirectionProvider;
export default ServerDirectionProvider;
