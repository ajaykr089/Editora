import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CommentsPlugin, getAllComments } from '../CommentsPlugin.native';

let root: HTMLElement;
let content: HTMLElement;
let plugin: ReturnType<typeof CommentsPlugin>;

const ctx = () => ({ editorElement: root, contentElement: content }) as never;
const panel = () => root.querySelector('.rte-comments-panel') as HTMLElement;
const cards = () => Array.from(panel().querySelectorAll<HTMLElement>('.rte-comment-item'));
const tab = (name: string) => panel().querySelector<HTMLButtonElement>(`.rte-comments-tab[data-filter="${name}"]`)!;
const composerField = () => panel().querySelector<HTMLTextAreaElement>('.new-comment-textarea')!;

function select(text: string): void {
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const at = node.textContent!.indexOf(text);
    if (at === -1) continue;
    const range = document.createRange();
    range.setStart(node, at);
    range.setEnd(node, at + text.length);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    return;
  }
  throw new Error(`no text "${text}" in the document`);
}

function type(field: HTMLTextAreaElement, value: string): void {
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

function submitComposer(text: string): void {
  type(composerField(), text);
  (panel().querySelector('.rte-comment-composer') as HTMLFormElement).requestSubmit();
}

function comment(selected: string | null, text: string): void {
  if (selected) select(selected);
  plugin.commands?.addComment?.(undefined, ctx());
  submitComposer(text);
}

beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = () => {};
  document.body.innerHTML =
    '<div class="rte-editor"><div class="rte-content" contenteditable="true"><p>Alpha beta gamma delta</p><p>Epsilon zeta eta</p></div></div>';
  root = document.querySelector('.rte-editor') as HTMLElement;
  content = document.querySelector('.rte-content') as HTMLElement;
  plugin = CommentsPlugin();
  plugin.commands?.toggleComments?.(undefined, ctx());
});

afterEach(() => {
  window.getSelection()?.removeAllRanges();
  document.body.innerHTML = '';
});

describe('opening the panel', () => {
  it('shows an empty state and no form, until a comment is started', () => {
    expect(panel().classList.contains('is-open')).toBe(true);
    expect(panel().querySelector('.rte-comments-empty')).not.toBeNull();
    expect(panel().querySelector('.rte-comment-composer')).toBeNull();
    expect(tab('open').getAttribute('aria-selected')).toBe('true');
  });

  it('the textarea does not overflow the panel (border-box)', () => {
    plugin.commands?.addComment?.(undefined, ctx());
    expect(document.getElementById('rte-comments-panel-styles')!.textContent).toContain('box-sizing: border-box');
  });
});

describe('a new comment', () => {
  it('quotes the selected text in the form and anchors the comment to it', () => {
    select('beta gamma');
    plugin.commands?.addComment?.(undefined, ctx());

    const quote = panel().querySelector('.rte-comment-composer .rte-comment-selection')!;
    expect(quote.textContent).toBe('beta gamma');

    submitComposer('Rephrase this');
    expect(content.querySelector('.rte-comment-anchor')!.textContent).toBe('beta gamma');
    expect(cards()).toHaveLength(1);
    expect(cards()[0].querySelector('.rte-comment-text')!.textContent).toBe('Rephrase this');
    expect(cards()[0].querySelector('.rte-comment-selection')!.textContent).toBe('beta gamma');
    // Posting closes the form and the new thread is the active one.
    expect(panel().querySelector('.rte-comment-composer')).toBeNull();
    expect(cards()[0].classList.contains('is-active')).toBe(true);
  });

  it('is a note about the whole document when nothing is selected, and says so', () => {
    plugin.commands?.addComment?.(undefined, ctx());
    expect(panel().querySelector('.rte-comment-composer .rte-comment-selection')).toBeNull();
    expect(panel().querySelector('.rte-comment-composer-hint')!.textContent).toContain('whole document');

    submitComposer('Needs a conclusion');
    expect(content.querySelector('.rte-comment-anchor')).toBeNull();
    expect(cards()[0].querySelector('.rte-comment-selection')).toBeNull();
  });

  it('can be switched to a note with the x on the quote', () => {
    select('Epsilon');
    plugin.commands?.addComment?.(undefined, ctx());
    (panel().querySelector('.rte-comment-composer .rte-comment-icon-btn') as HTMLButtonElement).click();
    expect(panel().querySelector('.rte-comment-composer .rte-comment-selection')).toBeNull();
    submitComposer('General');
    expect(content.querySelector('.rte-comment-anchor')).toBeNull();
  });

  it('keeps the posted text as text, never as markup', () => {
    comment(null, '<img src=x onerror="window.__pwned=1"><b>bold</b>');
    const text = cards()[0].querySelector('.rte-comment-text')!;
    expect(text.querySelector('img, b')).toBeNull();
    expect(text.textContent).toContain('<img src=x');
  });

  it('cannot be posted empty', () => {
    plugin.commands?.addComment?.(undefined, ctx());
    expect(panel().querySelector<HTMLButtonElement>('.rte-comment-composer .primary')!.disabled).toBe(true);
    type(composerField(), '   ');
    expect(panel().querySelector<HTMLButtonElement>('.rte-comment-composer .primary')!.disabled).toBe(true);
  });

  it('is cancelled by Escape, and the panel stays open', () => {
    plugin.commands?.addComment?.(undefined, ctx());
    type(composerField(), 'draft');
    composerField().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(panel().querySelector('.rte-comment-composer')).toBeNull();
    expect(panel().classList.contains('is-open')).toBe(true);
  });
});

describe('the list', () => {
  it('follows the order of the document, not the order of posting', () => {
    comment('Epsilon', 'second paragraph');
    comment('Alpha', 'first paragraph');
    comment(null, 'a note');
    expect(cards().map((card) => card.querySelector('.rte-comment-text')!.textContent)).toEqual([
      'first paragraph',
      'second paragraph',
      'a note',
    ]);
    expect(getAllComments().map((c) => c.text)).toEqual(['first paragraph', 'second paragraph', 'a note']);
  });

  it('moves a resolved thread to the Resolved tab and back', () => {
    comment('Alpha', 'one');
    comment('Epsilon', 'two');
    expect(tab('open').textContent).toContain('2');

    (cards()[0].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();
    expect(cards()).toHaveLength(1);
    expect(tab('open').textContent).toContain('1');
    expect(tab('resolved').textContent).toContain('1');

    tab('resolved').click();
    expect(cards()).toHaveLength(1);
    expect(cards()[0].querySelector('.rte-comment-status')!.textContent).toContain('Resolved by User');
    expect(cards()[0].querySelector('.rte-comment-reply-box')).toBeNull();

    (cards()[0].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();
    expect(panel().querySelector('.rte-comments-empty strong')!.textContent).toBe('Nothing resolved yet');
    tab('open').click();
    expect(cards()).toHaveLength(2);
  });

  it('says every thread is resolved, rather than "no comments", when only resolved ones exist', () => {
    comment('Alpha', 'one');
    (cards()[0].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();
    expect(panel().querySelector('.rte-comments-empty strong')!.textContent).toBe('No open comments');
  });

  it('changes tabs with the arrow keys', () => {
    tab('open').focus();
    tab('open').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(tab('resolved').getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tab('resolved'));
    expect(tab('open').tabIndex).toBe(-1);
  });
});

describe('replies', () => {
  const reply = (card: HTMLElement, text: string) => {
    const field = card.querySelector<HTMLTextAreaElement>('.rte-comment-reply-textarea')!;
    type(field, text);
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
  };

  it('Enter sends, and the reply is shown in the thread without opening anything', () => {
    comment('Alpha', 'question');
    reply(cards()[0], 'answer');
    expect(cards()[0].querySelectorAll('.rte-comment-reply')).toHaveLength(1);
    expect(cards()[0].querySelector('.rte-comment-reply-text')!.textContent).toBe('answer');
  });

  it('Shift+Enter does not send', () => {
    comment('Alpha', 'question');
    const field = cards()[0].querySelector<HTMLTextAreaElement>('.rte-comment-reply-textarea')!;
    type(field, 'line one');
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true, cancelable: true }));
    expect(cards()[0].querySelectorAll('.rte-comment-reply')).toHaveLength(0);
  });

  it('shows the latest two and folds the earlier ones behind one button', () => {
    comment('Alpha', 'question');
    for (const text of ['r1', 'r2', 'r3']) reply(cards()[0], text);

    const texts = () => Array.from(cards()[0].querySelectorAll('.rte-comment-reply-text')).map((el) => el.textContent);
    expect(texts()).toEqual(['r2', 'r3']);
    const more = cards()[0].querySelector<HTMLButtonElement>('.rte-comment-more-replies')!;
    expect(more.textContent).toBe('Show 1 earlier reply');

    more.click();
    expect(texts()).toEqual(['r1', 'r2', 'r3']);
    expect(cards()[0].querySelector('.rte-comment-more-replies')).toBeNull();
  });

  it('keeps an unsent reply when the panel redraws', () => {
    comment('Alpha', 'one');
    comment('Epsilon', 'two');
    const field = cards()[0].querySelector<HTMLTextAreaElement>('.rte-comment-reply-textarea')!;
    type(field, 'half-written');
    (cards()[1].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();
    expect(cards()[0].querySelector<HTMLTextAreaElement>('.rte-comment-reply-textarea')!.value).toBe('half-written');
  });
});

describe('the more menu', () => {
  const trigger = () => cards()[0].querySelector<HTMLButtonElement>('[data-action="more"]')!;
  const menu = () => cards()[0].querySelector<HTMLElement>('.rte-comment-menu')!;

  it('opens on click with the focus on its first item, and Escape closes just the menu', () => {
    comment('Alpha', 'one');
    trigger().click();
    expect(menu().hidden).toBe(false);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(menu().querySelector('[role="menuitem"]'));

    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(menu().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
    expect(panel().classList.contains('is-open')).toBe(true);
  });

  it('Delete removes the thread and the highlight in the text', () => {
    comment('Alpha', 'one');
    trigger().click();
    (menu().querySelector('[role="menuitem"]') as HTMLButtonElement).click();
    expect(cards()).toHaveLength(0);
    expect(content.querySelector('.rte-comment-anchor')).toBeNull();
    expect(content.textContent).toContain('Alpha beta');
  });

  it('Delete removes a note for good', () => {
    comment(null, 'note');
    trigger().click();
    (menu().querySelector('[role="menuitem"]') as HTMLButtonElement).click();
    expect(cards()).toHaveLength(0);
    expect(getAllComments()).toHaveLength(0);
  });
});

describe('clicking the highlighted text', () => {
  it('opens the panel on that thread, on the right tab', () => {
    comment('Alpha', 'one');
    comment('Epsilon', 'two');
    (cards()[1].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();
    plugin.commands?.toggleComments?.(undefined, ctx());
    expect(root.querySelector('.rte-comments-panel')).toBeNull();

    content.querySelectorAll<HTMLElement>('.rte-comment-anchor')[1].click();
    expect(tab('resolved').getAttribute('aria-selected')).toBe('true');
    expect(cards()[0].classList.contains('is-active')).toBe(true);
    expect(cards()[0].querySelector('.rte-comment-text')!.textContent).toBe('two');
  });
});

describe('the highlight in the text', () => {
  it('goes out with the card that lit it, even if the card is rebuilt under the pointer', () => {
    comment('Alpha', 'one');
    comment('Epsilon', 'two');
    const anchors = () => Array.from(content.querySelectorAll<HTMLElement>('.rte-comment-anchor'));

    cards()[0].dispatchEvent(new MouseEvent('mouseenter'));
    expect(anchors()[0].classList.contains('highlighted')).toBe(true);

    (cards()[1].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();
    expect(anchors().some((anchor) => anchor.classList.contains('highlighted'))).toBe(false);
  });
});
