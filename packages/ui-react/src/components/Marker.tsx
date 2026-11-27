import '@editora/ui-core/marker';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Marker as ServerMarker } from './server/Marker';
export type * from './server/Marker';
export const Marker = ServerMarker;
export default ServerMarker;
