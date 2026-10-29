import { AIReview } from '../core/review';
import { applyHunk, htmlWithoutSuggestions, isStale, markBlockReplacement, markInlineHunks, revertHunk } from '../dom/marks';
import { createDomReview } from '../dom/overlay';
import { buildTextMap, targetsForRange, targetText } from '../dom/text';

function editor(html: string): HTMLElement {
  document.body.innerHTML = `<div class="wrap"><div class="editora-content" contenteditable="true">${html}</div></div>`;
  return document.querySelector<HTMLElement>('.editora-content')!;
}

function wholeBlockTargets(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>('p')).map((block) => ({ block, start: 0, end: buildTextMap(block).text.length }));
}

describe('text map', () => {
  it('reads text through formatting, maps <br> to a newline and skips islands', () => {
    const root = editor('<p>Hello <strong>bold</strong>&nbsp;world<br>next <span contenteditable="false">@Ann</span> line<br></p>');
    expect(buildTextMap(root.querySelector('p')!).text).toBe('Hello bold world\nnext  line');
  });

  it('targets the selected words in one block, widened to whole words', () => {
    const root = editor('<p>The quick brown fox.</p>');
    const text = root.querySelector('p')!.firstChild!;
    const range = document.createRange();
    range.setStart(text, 6); // "ick"
    range.setEnd(text, 12); // "bro"
    const [target] = targetsForRange(root, range);
    expect(targetText(target)).toBe('quick brown');
  });

  it('targets the caret paragraph when nothing is selected', () => {
    const root = editor('<p>One.</p><p>Two words.</p>');
    const range = document.createRange();
    range.setStart(root.querySelectorAll('p')[1].firstChild!, 2);
    range.collapse(true);
    expect(targetsForRange(root, range).map(targetText)).toEqual(['Two words.']);
  });
});

describe('marks', () => {
  it('marks changes without losing the formatting of untouched words', () => {
    const root = editor('<p>The <strong>quick</strong> brown fox.</p>');
    const [target] = wholeBlockTargets(root);
    const review = new AIReview([targetText(target)]);
    review.finish('The quick red fox.');
    markInlineHunks(target, [...review.hunks]);

    expect(root.innerHTML).toBe(
      `<p>The <strong>quick</strong> <del class="air-del" data-air-hunk="${review.hunks[0].id}">brown</del><ins class="air-ins" data-air-hunk="${review.hunks[0].id}">red</ins> fox.</p>`,
    );
    expect(isStale(root, review.hunks[0])).toBe(false);

    applyHunk(root, review.hunks[0].id);
    root.normalize();
    expect(root.innerHTML).toBe('<p>The <strong>quick</strong> red fox.</p>');
  });

  it('reverts a rejected change to the exact original HTML', () => {
    const original = '<p>Teh <em>cat</em> sat on teh mat.</p>';
    const root = editor(original);
    const [target] = wholeBlockTargets(root);
    const review = new AIReview([targetText(target)]);
    review.finish('The cat sat on the mat.');
    markInlineHunks(target, [...review.hunks]);
    review.hunks.forEach((hunk) => revertHunk(root, hunk));
    root.normalize();
    expect(root.innerHTML).toBe(original);
  });

  it('notices when someone edited inside a suggestion', () => {
    const root = editor('<p>Hello wrld.</p>');
    const [target] = wholeBlockTargets(root);
    const review = new AIReview([targetText(target)]);
    review.finish('Hello world.');
    markInlineHunks(target, [...review.hunks]);
    root.querySelector('ins')!.textContent = 'there';
    expect(isStale(root, review.hunks[0])).toBe(true);
    // Rejecting keeps what the user typed.
    revertHunk(root, review.hunks[0], true);
    expect(root.textContent).toBe('Hello wrldthere.');
  });

  it('replaces whole paragraphs when the structure changed', () => {
    const root = editor('<p>A one.</p><p>B two.</p>');
    const targets = wholeBlockTargets(root);
    const review = new AIReview(targets.map(targetText));
    review.finish('All in one.\n\nSecond.\n\nThird.');
    markBlockReplacement(targets, review.hunks[0]);
    expect(root.querySelectorAll('p').length).toBe(5);
    expect(htmlWithoutSuggestions(root)).toBe('<p>A one.</p><p>B two.</p>');

    applyHunk(root, review.hunks[0].id);
    expect(root.innerHTML).toBe('<p>All in one.</p><p>Second.</p><p>Third.</p>');
  });
});

describe('createDomReview', () => {
  it('renders streaming output, locks typing, then reviews and reports the result', () => {
    const root = editor('<p>Teh cat sat.</p><p>It is hapy.</p>');
    const ends: any[] = [];
    const dom = createDomReview({ root, targets: wholeBlockTargets(root), onEnd: (info) => ends.push(info) });
    const bar = document.querySelector('.air-bar')!;
    expect(bar.textContent).toContain('Writing');

    dom.review.update('The cat sat.\n\nIt is');
    expect(root.querySelector('ins')!.textContent).toBe('The');
    const blocked = new Event('beforeinput', { cancelable: true });
    root.dispatchEvent(blocked);
    expect(blocked.defaultPrevented).toBe(true);

    dom.review.finish('The cat sat.\n\nIt is happy.');
    expect(bar.textContent).toContain('2 suggestions');
    const typing = new Event('beforeinput', { cancelable: true });
    root.dispatchEvent(typing);
    expect(typing.defaultPrevented).toBe(false);

    dom.accept(dom.review.hunks[0].id);
    dom.reject(dom.review.hunks[1].id);
    expect(root.innerHTML).toBe('<p>The cat sat.</p><p>It is hapy.</p>');
    expect(ends).toHaveLength(1);
    expect(ends[0]).toMatchObject({ accepted: 1, rejected: 1, cancelled: false, beforeHTML: '<p>Teh cat sat.</p><p>It is hapy.</p>' });
    expect(document.querySelector('.air-bar')).toBeNull();
  });

  it('restores the original on failure', () => {
    const original = '<p>Some <b>text</b>.</p>';
    const root = editor(original);
    const dom = createDomReview({ root, targets: wholeBlockTargets(root) });
    dom.review.update('Some new');
    dom.fail('Network down');
    expect(root.innerHTML).toBe(original);
    expect(document.querySelector('.air-bar')!.textContent).toContain('Network down');
  });
});
