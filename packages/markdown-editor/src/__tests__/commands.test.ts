import { describe, expect, it } from 'vitest';
import {
  applyEdit,
  continueMarkdownList,
  headingLevelAt,
  offsetToPosition,
  runMarkdownCommand,
  setHeadingLevel,
  type MarkdownCommand,
  type TextEdit,
  type TextState,
} from '../source/commands';

// Tests are written with the selection drawn in the text: «selected» for a range, ¦ for a caret.
const parse = (marked: string): TextState => {
  const open = marked.indexOf('«');
  if (open !== -1) {
    const close = marked.indexOf('»');
    const text = marked.slice(0, open) + marked.slice(open + 1, close) + marked.slice(close + 1);
    return { text, start: open, end: close - 1 };
  }
  const caret = marked.indexOf('¦');
  const text = marked.replace('¦', '');
  return { text, start: caret, end: caret };
};

const show = (state: TextState, edit: TextEdit | null): string => {
  if (!edit) return 'NO EDIT';
  const text = applyEdit(state.text, edit);
  return edit.selectionStart === edit.selectionEnd
    ? `${text.slice(0, edit.selectionStart)}¦${text.slice(edit.selectionStart)}`
    : `${text.slice(0, edit.selectionStart)}«${text.slice(edit.selectionStart, edit.selectionEnd)}»${text.slice(edit.selectionEnd)}`;
};

const run = (command: MarkdownCommand, marked: string): string => {
  const state = parse(marked);
  return show(state, runMarkdownCommand(command, state));
};
const heading = (level: number, marked: string): string => {
  const state = parse(marked);
  return show(state, setHeadingLevel(state, level));
};
const enter = (marked: string): string => {
  const state = parse(marked);
  return show(state, continueMarkdownList(state));
};

describe('inline formatting', () => {
  it('wraps the selection and keeps the text selected', () => {
    expect(run('bold', 'a «word» b')).toBe('a **«word»** b');
    expect(run('italic', 'a «word» b')).toBe('a *«word»* b');
    expect(run('strikethrough', 'a «word» b')).toBe('a ~~«word»~~ b');
    expect(run('inlineCode', 'a «word» b')).toBe('a `«word»` b');
  });

  it('inserts a selected placeholder when nothing is selected', () => {
    expect(run('bold', 'a ¦b')).toBe('a **«bold text»**b');
    expect(run('italic', '¦')).toBe('*«italic text»*');
    expect(run('inlineCode', 'x¦')).toBe('x`«code»`');
  });

  it('keeps spaces outside the markers, since "** x **" is not emphasis', () => {
    expect(run('bold', '«  word  »')).toBe('  **«word»**  ');
    expect(run('bold', 'a« »b')).toBe('a**«bold text»**b');
  });

  it('toggles off when the markers are inside the selection', () => {
    expect(run('bold', '«**word**»')).toBe('«word»');
    expect(run('italic', '«*word*»')).toBe('«word»');
    expect(run('strikethrough', '«~~word~~»')).toBe('«word»');
    expect(run('inlineCode', '«`word`»')).toBe('«word»');
  });

  it('toggles off when the markers are just outside the selection', () => {
    expect(run('bold', '**«word»**')).toBe('«word»');
    expect(run('italic', 'a *«word»* b')).toBe('a «word» b');
    expect(run('strikethrough', '~~«word»~~')).toBe('«word»');
    expect(run('inlineCode', '`«word»`')).toBe('«word»');
  });

  it('tells italic from bold, which share the asterisk', () => {
    // bold text is not already italic...
    expect(run('italic', '**«word»**')).toBe('***«word»***');
    expect(run('italic', '«**word**»')).toBe('*«**word**»*');
    // ...italic text is not already bold...
    expect(run('bold', '*«word»*')).toBe('***«word»***');
    // ...and each can be taken off bold-italic text without touching the other.
    expect(run('bold', '***«word»***')).toBe('*«word»*');
    expect(run('italic', '***«word»***')).toBe('**«word»**');
  });

  it('removes an empty pair of markers', () => {
    expect(run('bold', '«****»')).toBe('¦');
    expect(run('strikethrough', 'a«~~~~»b')).toBe('a¦b');
  });

  it('wraps and unwraps each line of a multi-line selection, so emphasis never spans a blank line', () => {
    expect(run('bold', '«one\n\ntwo»')).toBe('«**one**\n\n**two**»');
    expect(run('bold', '«**one**\n\n**two**»')).toBe('«one\n\ntwo»');
    expect(run('italic', '«  one\ntwo  »')).toBe('«  *one*\n*two*  »');
  });

  it('wraps only the unwrapped lines when the selection mixes them', () => {
    expect(run('bold', '«**one**\ntwo»')).toBe('«****one****\n**two**»');
  });
});

describe('links', () => {
  it('inserts a link with the text selected when nothing is selected', () => {
    expect(run('link', 'a ¦b')).toBe('a [«link text»](url)b');
  });

  it('turns the selection into the link text and selects the url placeholder', () => {
    expect(run('link', 'see «the docs» now')).toBe('see [the docs](«url») now');
  });

  it('uses a selected URL as the destination', () => {
    expect(run('link', '«https://example.com/a»')).toBe('[«link text»](https://example.com/a)');
    expect(run('link', '« www.example.com »')).toBe('[«link text»](www.example.com)');
  });
});

describe('quotes', () => {
  it('quotes the lines and takes the quote off again', () => {
    expect(run('quote', '«one\ntwo»')).toBe('«> one\n> two»');
    expect(run('quote', '«> one\n> two»')).toBe('«one\ntwo»');
  });

  it('keeps blank lines inside a quote as ">" so it stays one quote', () => {
    expect(run('quote', '«one\n\ntwo»')).toBe('«> one\n>\n> two»');
    expect(run('quote', '«> one\n>\n> two»')).toBe('«one\n\ntwo»');
  });

  it('keeps a caret where it was in the text', () => {
    expect(run('quote', 'a¦b')).toBe('> a¦b');
    expect(run('quote', '> a¦b')).toBe('a¦b');
    expect(run('quote', '¦')).toBe('> ¦');
  });

  it('acts on whole lines even when the selection starts or ends mid-line', () => {
    expect(run('quote', 'x\non«e\ntw»o\ny')).toBe('x\n«> one\n> two»\ny');
  });

  it('does not include the next line when the selection ends at its very start', () => {
    expect(run('quote', '«one\n»two')).toBe('«> one»\ntwo');
  });
});

describe('lists', () => {
  it('makes bullet lists, indentation kept, and takes them off again', () => {
    expect(run('bulletList', '«one\n  two»')).toBe('«- one\n  - two»');
    expect(run('bulletList', '«- one\n  - two»')).toBe('«one\n  two»');
  });

  it('skips blank lines', () => {
    expect(run('bulletList', '«one\n\ntwo»')).toBe('«- one\n\n- two»');
  });

  it('converts between list kinds instead of nesting markers', () => {
    expect(run('bulletList', '«1. one\n2. two»')).toBe('«- one\n- two»');
    expect(run('orderedList', '«- one\n- two»')).toBe('«1. one\n2. two»');
    expect(run('taskList', '«- one\n1. two»')).toBe('«- [ ] one\n- [ ] two»');
    expect(run('bulletList', '«- [ ] one\n- [x] two»')).toBe('«- one\n- two»');
  });

  it('numbers ordered lists from 1, skipping blank lines, and takes them off again', () => {
    expect(run('orderedList', '«a\nb\n\nc»')).toBe('«1. a\n2. b\n\n3. c»');
    expect(run('orderedList', '«1. a\n2) b»')).toBe('«a\nb»');
  });

  it('toggles task lists, keeping a box that is already there', () => {
    expect(run('taskList', '«a\nb»')).toBe('«- [ ] a\n- [ ] b»');
    expect(run('taskList', '«- [ ] a\n- [x] b»')).toBe('«a\nb»');
    expect(run('taskList', '«- [x] a\nb»')).toBe('«- [x] a\n- [ ] b»');
  });

  it('starts a list on an empty line with the caret after the marker', () => {
    expect(run('bulletList', '¦')).toBe('- ¦');
    expect(run('orderedList', '¦')).toBe('1. ¦');
    expect(run('taskList', '¦')).toBe('- [ ] ¦');
  });

  it('keeps the caret in the text', () => {
    expect(run('bulletList', 'ab¦c')).toBe('- ab¦c');
    expect(run('bulletList', '- ab¦c')).toBe('ab¦c');
  });
});

describe('headings', () => {
  it('sets, changes and removes the heading level', () => {
    expect(heading(2, 'Title¦')).toBe('## Title¦');
    expect(heading(3, '# Ti¦tle')).toBe('### Ti¦tle');
    expect(heading(0, '## Ti¦tle')).toBe('Ti¦tle');
  });

  it('sets a heading on each non-blank selected line', () => {
    expect(heading(2, '«one\n\ntwo»')).toBe('«## one\n\n## two»');
  });

  it('starts a heading on an empty line', () => {
    expect(heading(1, '¦')).toBe('# ¦');
    expect(heading(0, '¦')).toBe('¦');
  });

  it('reads the level at a position', () => {
    const text = '# One\n\n### Three\n\nplain\n####### seven';
    expect(headingLevelAt(text, 2)).toBe(1);
    expect(headingLevelAt(text, text.indexOf('Three'))).toBe(3);
    expect(headingLevelAt(text, text.indexOf('plain'))).toBe(0);
    expect(headingLevelAt(text, text.indexOf('seven'))).toBe(0);
    // A lone "#" is an (empty) heading in CommonMark; "#hashtag" is not one.
    expect(headingLevelAt('#', 1)).toBe(1);
    expect(headingLevelAt('#hashtag', 3)).toBe(0);
  });
});

describe('code blocks', () => {
  it('fences the selected lines and keeps the code selected', () => {
    expect(run('codeBlock', 'x\n«one\ntwo»\ny')).toBe('x\n```\n«one\ntwo»\n```\ny');
  });

  it('opens an empty block with the caret inside on an empty line', () => {
    expect(run('codeBlock', '¦')).toBe('```\n¦\n```');
  });

  it('uses a longer fence when the code contains backticks', () => {
    expect(run('codeBlock', '«use ``` here»')).toBe('````\n«use ``` here»\n````');
  });

  it('takes the fences off when the caret is inside the block', () => {
    expect(run('codeBlock', 'a\n```ts\nco¦de\n```\nb')).toBe('a\n«code»\nb');
  });

  it('takes the fences off when the whole block is selected', () => {
    expect(run('codeBlock', '«```\nx\ny\n```»')).toBe('«x\ny»');
  });

  it('takes the fence off a block that is never closed', () => {
    expect(run('codeBlock', '```\nco¦de')).toBe('«code»');
  });

  it('does not mistake text after a closed block for being inside one', () => {
    expect(run('codeBlock', '```\nx\n```\nab¦c')).toBe('```\nx\n```\n```\n«abc»\n```');
  });

  it('matches the closing fence by character and length', () => {
    expect(run('codeBlock', '````\n```\nin¦side\n```\n````')).toBe('«```\ninside\n```»');
    expect(run('codeBlock', '~~~\nin¦side\n~~~')).toBe('«inside»');
  });
});

describe('horizontal rules', () => {
  it('goes after the current line with a blank line on each side, so it cannot make a heading', () => {
    expect(run('horizontalRule', 'text¦')).toBe('text\n\n---\n\n¦');
  });

  it('replaces an empty line', () => {
    expect(run('horizontalRule', '¦')).toBe('---\n\n¦');
    expect(run('horizontalRule', 'a\n\n¦')).toBe('a\n\n---\n\n¦');
  });

  it('adds the blank line above when the previous line is text', () => {
    expect(run('horizontalRule', 'a\n¦')).toBe('a\n\n---\n\n¦');
  });
});

describe('Enter', () => {
  it('continues bullet, numbered and task lists', () => {
    expect(enter('- one¦')).toBe('- one\n- ¦');
    expect(enter('* one¦')).toBe('* one\n* ¦');
    expect(enter('1. one¦')).toBe('1. one\n2. ¦');
    expect(enter('9) one¦')).toBe('9) one\n10) ¦');
    expect(enter('- [x] done¦')).toBe('- [x] done\n- [ ] ¦');
    expect(enter('- [ ] todo¦')).toBe('- [ ] todo\n- [ ] ¦');
  });

  it('keeps the indentation of a nested item', () => {
    expect(enter('- a\n  - b¦')).toBe('- a\n  - b\n  - ¦');
    expect(enter('   1. b¦')).toBe('   1. b\n   2. ¦');
  });

  it('ends the list on an empty item, leaving a blank line so the next text is not read as part of the list', () => {
    expect(enter('- one\n- ¦')).toBe('- one\n\n¦');
    expect(enter('1. one\n2. ¦')).toBe('1. one\n\n¦');
    expect(enter('- [ ] ¦')).toBe('¦');
    expect(enter('- one\n\n- ¦')).toBe('- one\n\n¦');
  });

  it('moves an empty nested item out one level instead of ending the list', () => {
    expect(enter('- a\n  - ¦')).toBe('- a\n- ¦');
    expect(enter('- a\n  - b\n    - ¦')).toBe('- a\n  - b\n  - ¦');
    expect(enter('1. a\n   1. ¦')).toBe('1. a\n1. ¦');
  });

  it('ends the list on an empty nested item that has no parent item above it', () => {
    expect(enter('text\n\n  - ¦')).toBe('text\n\n¦');
  });

  it('continues quotes and ends them on an empty line', () => {
    expect(enter('> one¦')).toBe('> one\n> ¦');
    expect(enter('>> one¦')).toBe('>> one\n>> ¦');
    expect(enter('>one¦')).toBe('>one\n> ¦');
    expect(enter('> one\n> ¦')).toBe('> one\n\n¦');
  });

  it('splits an item when Enter is pressed in the middle of it, taking the rest of the text along', () => {
    expect(enter('- on¦e')).toBe('- on\n- ¦e');
    expect(enter('1. on¦e')).toBe('1. on\n2. ¦e');
    expect(enter('- [x] on¦e')).toBe('- [x] on\n- [ ] ¦e');
    expect(enter('> on¦e')).toBe('> on\n> ¦e');
    expect(enter('- ¦one')).toBe('- \n- ¦one');
  });

  it('leaves Enter alone inside the marker and anywhere else', () => {
    expect(enter('-¦ one')).toBe('NO EDIT');
    expect(enter('¦- one')).toBe('NO EDIT');
    expect(enter('1¦. one')).toBe('NO EDIT');
    expect(enter('plain¦')).toBe('NO EDIT');
    expect(enter('---¦')).toBe('NO EDIT');
    expect(enter('«- one»')).toBe('NO EDIT');
    expect(enter('# head¦')).toBe('NO EDIT');
  });

  it('ends the list on an empty item, wherever the item is in the document', () => {
    expect(enter('- one\n- ¦\n\nafter')).toBe('- one\n\n¦\n\nafter');
    expect(enter('1. one\n2. ¦\n3. three')).toBe('1. one\n\n¦\n3. three');
  });
});

describe('offsetToPosition', () => {
  it('converts an offset to a zero-based line and column', () => {
    expect(offsetToPosition('ab\ncd\n\nef', 0)).toEqual({ line: 0, column: 0 });
    expect(offsetToPosition('ab\ncd\n\nef', 2)).toEqual({ line: 0, column: 2 });
    expect(offsetToPosition('ab\ncd\n\nef', 3)).toEqual({ line: 1, column: 0 });
    expect(offsetToPosition('ab\ncd\n\nef', 6)).toEqual({ line: 2, column: 0 });
    expect(offsetToPosition('ab\ncd\n\nef', 8)).toEqual({ line: 3, column: 1 });
  });

  it('clamps out-of-range offsets', () => {
    expect(offsetToPosition('ab', -5)).toEqual({ line: 0, column: 0 });
    expect(offsetToPosition('ab\ncd', 99)).toEqual({ line: 1, column: 2 });
  });
});
