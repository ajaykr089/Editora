export { SpellCheckPlugin } from './SpellCheckPlugin';
export type { SpellCheckIssue, DictionaryProvider } from './SpellCheckPlugin';
export {
  getSuggestions,
  scanDocumentForMisspellings,
  addToDictionary,
  ignoreWord,
  replaceWord,
  highlightMisspelledWords,
  clearSpellCheckHighlights,
  getSpellCheckStats
} from './SpellCheckPlugin';
export { SpellCheckPluginProvider } from './SpellCheckPluginProvider';
