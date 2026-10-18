/**
 * Spelling suggestions: the dictionary words closest to a misspelled word, best first.
 *
 * "Closest" is edit distance where swapping two neighbouring letters counts as one edit (the commonest slip: "teh",
 * "recieve", "wrods"). Plain Levenshtein counts that as two, so "tset" was as far from "test" as from "bet" and "net",
 * and the ties came out in dictionary order. Among words equally close, the better guess shares the first letter
 * (people rarely get that wrong); after that the dictionary's own order decides.
 * A word made of the same letters comes first of all: "wrods" is more likely "words" than "woods".
 */

/** Edit distance with insertions, deletions, substitutions and swaps of two neighbouring letters, each one edit. */
export function editDistance(a: string, b: string, limit = Infinity): number {
  if (a === b) return 0;
  const lengthGap = Math.abs(a.length - b.length);
  if (lengthGap > limit) return limit + 1;

  const rows: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    rows[i] = [i];
  }
  for (let j = 1; j <= b.length; j++) rows[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    let rowBest = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      let value = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a.charCodeAt(i - 1) === b.charCodeAt(j - 2) && a.charCodeAt(i - 2) === b.charCodeAt(j - 1)) {
        value = Math.min(value, rows[i - 2][j - 2] + 1);
      }
      rows[i][j] = value;
      if (value < rowBest) rowBest = value;
    }
    // No way back under the limit once a whole row is over it.
    if (rowBest > limit) return limit + 1;
  }
  return rows[a.length][b.length];
}

/** How far a word may be from the misspelling and still be worth offering: shorter words have less room to be wrong. */
export function allowedDistance(wordLength: number): number {
  if (wordLength <= 4) return 1;
  if (wordLength <= 7) return 2;
  return 3;
}

/**
 * @param word the misspelled word
 * @param dictionary the words to choose from; of two equally good words the earlier one comes first
 * @param max how many to return
 */
export function getSuggestions(word: string, dictionary: Iterable<string>, max = 5): string[] {
  const target = word.toLowerCase();
  const allowed = allowedDistance(target.length);
  const candidates: Array<{ word: string; distance: number; notAnagram: number; sameInitial: number; rank: number }> = [];
  const letters = [...target].sort().join('');

  let rank = 0;
  for (const candidate of dictionary) {
    rank += 1;
    if (Math.abs(candidate.length - target.length) > allowed) continue;
    const distance = editDistance(target, candidate, allowed);
    if (distance > allowed) continue;
    candidates.push({
      word: candidate,
      distance,
      notAnagram: [...candidate].sort().join('') === letters ? 0 : 1,
      sameInitial: candidate[0] === target[0] ? 0 : 1,
      rank,
    });
  }

  candidates.sort(
    (x, y) =>
      x.distance - y.distance || x.notAnagram - y.notAnagram || x.sameInitial - y.sameInitial || x.rank - y.rank,
  );
  return candidates.slice(0, max).map((entry) => entry.word);
}
