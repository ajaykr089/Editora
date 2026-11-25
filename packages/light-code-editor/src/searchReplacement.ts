import type { SearchResult } from './types';
/**
 * The replacement text for one regular-expression match: `$1`...`$99` and `$<name>` are the capture groups, `$&` and
 * `$0` the whole match, `$$` a dollar sign. (A plain-text search replaces with the text as typed.) Replace used to put
 * "$1" itself into the document.
 */
export function expandSearchReplacement(replacement: string, result: SearchResult): string {
  const groups = result.groups ?? [];
  return replacement.replace(/\$(\$|&|<([^>]+)>|(\d{1,2}))/g, (token, what: string, name?: string, digits?: string) => {
    if (what === '$') return '$';
    if (what === '&') return result.match;
    if (name !== undefined) {
      return result.namedGroups && name in result.namedGroups ? result.namedGroups[name] ?? '' : token;
    }
    // "$12" is group 12 when there is one, else group 1 followed by "2" (as in String.prototype.replace).
    let index = Number(digits);
    let rest = '';
    if (digits!.length === 2 && index > groups.length) {
      index = Number(digits![0]);
      rest = digits![1];
    }
    if (index === 0) return result.match + rest;
    return index <= groups.length ? (groups[index - 1] ?? '') + rest : token;
  });
}
