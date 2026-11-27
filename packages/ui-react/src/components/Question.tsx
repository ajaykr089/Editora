import '@editora/ui-core/question';

// Own bindings, not `export … from './server/…'`: a file that only re-exports lets Rollup skip it and copy its
// top-level imports into every importer, so the package root used to register this element for everyone.
import { Question as ServerQuestion } from './server/Question';
export type * from './server/Question';
export const Question = ServerQuestion;
export default ServerQuestion;
