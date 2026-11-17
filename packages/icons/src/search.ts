import { getIcon, listIcons } from './registry';
import type { IconDefinition } from './types';

/** Where a search result matched: its name, one of its aliases, a tag or a category. */
export type IconSearchField = 'name' | 'alias' | 'tag' | 'category';

export type IconSearchResult = {
  /** The icon's name, to pass to `renderIconSvg` or `<Icon name>`. */
  name: string;
  /** Higher is better. Results come sorted by it. */
  score: number;
  /** What matched best. */
  matchedBy: IconSearchField;
  /** The name, alias, tag or category that matched (`tick` when searching "tic" finds `check`). */
  matched: string;
};

export type IconSearchOptions = {
  /** At most this many results. */
  limit?: number;
  /** Only icons in this category, or in any of these. */
  category?: string | string[];
};

// The kind of match counts most (an exact tag beats a name that only starts with the word: "ai" finds
// `sparkles` before `airplane`); the field breaks ties between matches of the same kind.
const FIELD_BONUS: Record<IconSearchField, number> = { name: 10, alias: 8, tag: 5, category: 0 };
const EXACT = 100;
const PREFIX = 70;
const WORD_PREFIX = 50;
const SUBSTRING = 20;

function normalize(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');
}

function tokenize(query: string): string[] {
  return normalize(query).split('-').filter(Boolean);
}

// How well one query word matches one term: exactly, as its start, as the start of one of its words
// (`line` in `chart-line`), or anywhere inside it (only for words of 4 letters or more: `tic` would match `vertical`).
function termScore(term: string, token: string): number {
  if (term === token) return EXACT;
  if (term.startsWith(token)) return PREFIX;
  if (term.split('-').some((part) => part.startsWith(token))) return WORD_PREFIX;
  if (token.length >= 4 && term.includes(token)) return SUBSTRING;
  return 0;
}

type Best = { score: number; field: IconSearchField; term: string };

function fieldsOf(definition: IconDefinition): Array<[IconSearchField, string[]]> {
  return [
    ['name', [definition.name]],
    ['alias', (definition.aliases || []).map(normalize)],
    ['tag', (definition.tags || []).map(normalize)],
    ['category', (definition.categories || []).map(normalize)],
  ];
}

function bestMatch(fields: Array<[IconSearchField, string[]]>, token: string): Best | undefined {
  let best: Best | undefined;
  for (const [field, terms] of fields) {
    for (const term of terms) {
      const kind = termScore(term, token);
      const score = kind ? kind + FIELD_BONUS[field] : 0;
      if (score > 0 && (!best || score > best.score)) best = { score, field, term };
    }
  }
  return best;
}

/**
 * Finds icons by name, alias, tag or category, best match first. A name or alias equal to the whole query
 * comes first. Then come the icons that match every word of the query ("arrow left" finds `arrow-left` and
 * `chevron-left`); when none does, the ones that match the most words ("delete file" finds `trash` and the
 * file icons). An empty query lists every icon (in the category, if one is given) by name. Icons added with
 * `registerIcon` are searched too.
 */
export function searchIcons(query: string, options: IconSearchOptions = {}): IconSearchResult[] {
  const wanted = options.category == null ? undefined : new Set((Array.isArray(options.category) ? options.category : [options.category]).map(normalize));
  const whole = normalize(query);
  const tokens = tokenize(query);
  const results: Array<IconSearchResult & { words: number }> = [];

  for (const name of listIcons()) {
    const definition = getIcon(name);
    if (!definition) continue;
    if (wanted && !(definition.categories || []).some((category) => wanted.has(normalize(category)))) continue;

    if (!tokens.length) {
      results.push({ name, score: 0, matchedBy: 'name', matched: name, words: 0 });
      continue;
    }

    const fields = fieldsOf(definition);
    if (whole === name) {
      results.push({ name, score: 1000, matchedBy: 'name', matched: name, words: tokens.length });
      continue;
    }
    const alias = fields[1][1].find((term) => term === whole);
    if (alias) {
      results.push({ name, score: 900, matchedBy: 'alias', matched: alias, words: tokens.length });
      continue;
    }

    let total = 0;
    let words = 0;
    let top: Best | undefined;
    for (const token of tokens) {
      const best = bestMatch(fields, token);
      if (!best) continue;
      words += 1;
      total += best.score;
      if (!top || best.score > top.score) top = best;
    }
    if (top) results.push({ name, score: Math.round((total / tokens.length) * 100) / 100, matchedBy: top.field, matched: top.term, words });
  }

  const mostWords = results.reduce((most, result) => Math.max(most, result.words), 0);
  const kept = results.filter((result) => result.words === mostWords).map(({ words: _words, ...result }) => result);
  // Ties: the shorter name (`arrow-left` before `arrow-left-circle`), then alphabetical.
  kept.sort((a, b) => b.score - a.score || a.name.length - b.name.length || a.name.localeCompare(b.name));
  const limit = options.limit;
  return typeof limit === 'number' && Number.isFinite(limit) && limit >= 0 ? kept.slice(0, Math.floor(limit)) : kept;
}

/** Every category in use, with how many icons are in it, sorted by name: for the filters of an icon picker. */
export function listIconCategories(): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const name of listIcons()) {
    for (const category of getIcon(name)?.categories || []) {
      const key = normalize(category);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
}
