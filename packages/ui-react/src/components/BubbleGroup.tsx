import '@editora/ui-core/bubble-group';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { BubbleGroup as ServerBubbleGroup } from './server/BubbleGroup';
export type * from './server/BubbleGroup';
export const BubbleGroup = ServerBubbleGroup;
export default ServerBubbleGroup;
