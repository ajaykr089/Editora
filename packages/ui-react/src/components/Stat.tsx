// The server implementation draws the icon element for icon names. Define it here, in the client
// entry, as its own chunk (as Dropdown and Menu do) so the wrapper's first load stays small.
// `as string`: tsc would resolve the subpath, whose types only exist after the full ui-core build.
if (typeof window !== 'undefined' && typeof customElements !== 'undefined' && !customElements.get('ui-icon')) {
  void import('@editora/ui-core/icon' as string);
}

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Stat as ServerStat } from './server/Stat';
export type * from './server/Stat';
export const Stat = ServerStat;
export default ServerStat;
