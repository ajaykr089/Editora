import '@editora/ui-core/announcer';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Announcer as ServerAnnouncer } from './server/Announcer';
export type * from './server/Announcer';
export const Announcer = ServerAnnouncer;
export default ServerAnnouncer;
import {
  announce as coreAnnounce,
  clearAnnouncements as coreClearAnnouncements,
  type AnnounceOptions,
} from '@editora/ui-core/announce';
export type { AnnounceOptions, AnnouncePoliteness } from '@editora/ui-core/announce';

// Local bindings (not a re-export): Rollup would otherwise hoist '@editora/ui-core/announce' into
// the package root, which must reach ui-core only through component chunks.
/** Says `message` to screen-reader users (polite unless `politeness: 'assertive'`). */
export function announce(message: string, options?: AnnounceOptions): void {
  coreAnnounce(message, options);
}

/** Empties the page's announcement regions. */
export function clearAnnouncements(within?: Element | null): void {
  coreClearAnnouncements(within);
}
