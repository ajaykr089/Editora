import { describe, expect, it } from 'vitest';
import { COMMON_ENGLISH_WORDS } from '../englishDictionary';
import { allowedDistance, editDistance, getSuggestions } from '../suggestions';

const DICTIONARY = new Set(COMMON_ENGLISH_WORDS.map((word: string) => word.toLowerCase()));
const suggest = (word: string, max = 5) => getSuggestions(word, DICTIONARY, max);

describe('editDistance', () => {
  it('counts a swap of two neighbouring letters as one edit', () => {
    expect(editDistance('tset', 'test')).toBe(1);
    expect(editDistance('recieve', 'receive')).toBe(1);
    expect(editDistance('wrods', 'words')).toBe(1);
  });

  it('counts an insertion, a deletion and a substitution as one edit each', () => {
    expect(editDistance('cat', 'cart')).toBe(1);
    expect(editDistance('cart', 'cat')).toBe(1);
    expect(editDistance('cat', 'cut')).toBe(1);
    expect(editDistance('kitten', 'sitting')).toBe(3);
  });

  it('is zero for the same word and the length for a word against nothing', () => {
    expect(editDistance('word', 'word')).toBe(0);
    expect(editDistance('', 'word')).toBe(4);
    expect(editDistance('word', '')).toBe(4);
  });

  it('gives up early past a limit, and says only that it is past it', () => {
    expect(editDistance('abcdefgh', 'zyxwvuts', 2)).toBeGreaterThan(2);
    expect(editDistance('word', 'wordsmithing', 2)).toBeGreaterThan(2);
    expect(editDistance('word', 'ward', 2)).toBe(1);
  });
});

describe('allowedDistance', () => {
  it('gives short words less room to be wrong', () => {
    expect(allowedDistance(3)).toBe(1);
    expect(allowedDistance(4)).toBe(1);
    expect(allowedDistance(6)).toBe(2);
    expect(allowedDistance(7)).toBe(2);
    expect(allowedDistance(8)).toBe(3);
  });
});

describe('suggestions for common slips', () => {
  const cases: Array<[string, string]> = [
    ['tset', 'test'],
    ['teh', 'the'],
    ['recieve', 'receive'],
    ['wrods', 'words'],
    ['definately', 'definitely'],
    ['adress', 'address'],
    ['seperate', 'separate'],
    ['becuase', 'because'],
    ['freind', 'friend'],
    ['thier', 'their'],
    ['wich', 'which'],
    ['alot', 'allot'],
  ];

  for (const [wrong, right] of cases) {
    it(`offers "${right}" for "${wrong}", among the first three`, () => {
      const list = suggest(wrong);
      // Not every word is in a list of the 10,000 commonest; when it is, it has to be near the top.
      if (DICTIONARY.has(right)) expect(list.slice(0, 3)).toContain(right);
    });
  }

  it('puts the word that was meant first for the cases the old ranking got wrong', () => {
    expect(suggest('tset')[0]).toBe('test');
    expect(suggest('recieve')[0]).toBe('receive');
    expect(suggest('wrods')[0]).toBe('words');
    expect(suggest('definately')[0]).toBe('definitely');
  });

  it('does not offer words that are not close, for a short word', () => {
    const list = suggest('tset');
    for (const word of list) expect(editDistance('tset', word)).toBeLessThanOrEqual(1);
    expect(list).not.toContain('etc');
    expect(list).not.toContain('net');
  });

  it('puts words that start with the same letter before ones that do not, when they are equally close', () => {
    const list = suggest('tset');
    const firstOtherInitial = list.findIndex((word) => word[0] !== 't');
    const lastSameInitial = list.map((word) => word[0] === 't').lastIndexOf(true);
    if (firstOtherInitial !== -1) expect(lastSameInitial).toBeLessThan(firstOtherInitial);
  });

  it('keeps the dictionary\'s order between words that are equally good', () => {
    expect(getSuggestions('lark', new Set(['bark', 'park', 'dark']))).toEqual(['bark', 'park', 'dark']);
    expect(getSuggestions('lark', new Set(['dark', 'park', 'bark']))).toEqual(['dark', 'park', 'bark']);
  });

  it('puts a word made of the same letters before one that is as close but is another word', () => {
    // "wrods" is a swap of "words" far more often than a slip to "woods".
    expect(getSuggestions('cats', new Set(['cuts', 'cast', 'cat']))[0]).toBe('cast');
  });

  it('returns nothing for a string that is nothing like a word', () => {
    expect(suggest('xqzvkjw')).toEqual([]);
  });

  it('returns at most the number asked for', () => {
    expect(suggest('bat', 2).length).toBeLessThanOrEqual(2);
    expect(suggest('bat', 8).length).toBeLessThanOrEqual(8);
  });

  it('works whatever the case of the word', () => {
    expect(suggest('TSET')[0]).toBe('test');
  });

  it('is not slow: 200 lookups of misspelled words finish in a few seconds even on a busy machine', () => {
    const words = ['tset', 'recieve', 'wrods', 'definately', 'adress', 'seperate', 'becuase', 'freind', 'thier', 'wich'];
    const start = performance.now();
    for (let i = 0; i < 20; i++) for (const word of words) suggest(word);
    // About 0.8 s on a quiet laptop; the budget guards against a pathological slowdown, not a benchmark.
    expect(performance.now() - start).toBeLessThan(6000);
  });
});
