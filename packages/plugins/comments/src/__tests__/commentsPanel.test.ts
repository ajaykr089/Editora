import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

  const item = (name: string) => menu().querySelector<HTMLButtonElement>(`[data-action="${name}"]`)!;

  it('opens on click with the focus on its first item, and Escape closes just the menu', () => {
    comment('Alpha', 'one');
    trigger().click();
    expect(menu().hidden).toBe(false);
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(Array.from(menu().querySelectorAll('[role="menuitem"]')).map((el) => el.textContent)).toEqual(['Edit', 'Delete']);
    expect(document.activeElement).toBe(item('edit'));

    document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(menu().hidden).toBe(true);
    expect(document.activeElement).toBe(trigger());
    expect(panel().classList.contains('is-open')).toBe(true);
  });

  it('Delete removes the thread and the highlight in the text', () => {
    comment('Alpha', 'one');
    trigger().click();
    item('delete').click();
    expect(cards()).toHaveLength(0);
    expect(content.querySelector('.rte-comment-anchor')).toBeNull();
    expect(content.textContent).toContain('Alpha beta');
  });

  it('Delete removes a note for good', () => {
    comment(null, 'note');
    trigger().click();
    item('delete').click();
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
  const emphasis = () => document.getElementById('rte-comments-emphasis')?.textContent ?? '';
  const anchors = () => Array.from(content.querySelectorAll<HTMLElement>('.rte-comment-anchor'));

  it('is a stylesheet rule, so the document itself is never changed or saved with a highlight', () => {
    comment('Alpha', 'one');
    comment('Epsilon', 'two');
    const before = content.innerHTML;

    cards()[0].dispatchEvent(new MouseEvent('mouseenter'));
    expect(emphasis()).toContain(`[id="${anchors()[0].id}"]`);
    expect(content.innerHTML).toBe(before);
    expect(anchors()[0].classList.contains('highlighted')).toBe(false);
  });

  it('goes out with the card that lit it, even if the card is rebuilt under the pointer', () => {
    comment('Alpha', 'one');
    comment('Epsilon', 'two');
    setActive(cards()[1]);
    cards()[0].dispatchEvent(new MouseEvent('mouseenter'));
    const hoverRule = `[id="${anchors()[0].id}"]`;
    expect(emphasis()).toContain(hoverRule);

    (cards()[1].querySelector('[data-action="resolve"]') as HTMLButtonElement).click();
    expect(emphasis()).not.toContain(hoverRule);
  });
});

function setActive(card: HTMLElement): void {
  card.querySelector('.rte-comment-text')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('the active thread', () => {
  const emphasis = () => document.getElementById('rte-comments-emphasis')?.textContent ?? '';
  const anchors = () => Array.from(content.querySelectorAll<HTMLElement>('.rte-comment-anchor'));

  it('is the one whose card you click, and its text is marked in the document', () => {
    comment('Alpha', 'one');
    comment('Epsilon', 'two');
    setActive(cards()[0]);
    expect(cards()[0].classList.contains('is-active')).toBe(true);
    expect(cards()[1].classList.contains('is-active')).toBe(false);
    expect(emphasis()).toContain(`[id="${anchors()[0].id}"]`);

    setActive(cards()[1]);
    expect(cards()[0].classList.contains('is-active')).toBe(false);
    expect(emphasis()).toContain(`[id="${anchors()[1].id}"]`);
    expect(emphasis()).not.toContain(`[id="${anchors()[0].id}"]`);
  });

  it('scrolls the text into view when its card is clicked', () => {
    comment('Alpha', 'one');
    const calls: HTMLElement[] = [];
    HTMLElement.prototype.scrollIntoView = function (this: HTMLElement) {
      calls.push(this);
    };
    setActive(cards()[0]);
    expect(calls).toContain(anchors()[0]);
  });

  it('does not act when the click is on a button, or when text in the card is being selected', () => {
    comment('Alpha', 'one');
    const calls: HTMLElement[] = [];
    HTMLElement.prototype.scrollIntoView = function (this: HTMLElement) {
      calls.push(this);
    };
    cards()[0].querySelector('[data-action="resolve"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(calls).toHaveLength(0);
  });

  it('is cleared when the panel is closed, with its emphasis', () => {
    comment('Alpha', 'one');
    setActive(cards()[0]);
    expect(emphasis()).not.toBe('');
    (panel().querySelector('.rte-comments-close') as HTMLButtonElement).click();
    expect(emphasis()).toBe('');
  });
});

describe('editing', () => {
  const openMenu = (card: HTMLElement) => card.querySelector<HTMLButtonElement>('[data-action="more"]')!.click();
  const choose = (card: HTMLElement, name: string) => card.querySelector<HTMLButtonElement>(`.rte-comment-menu-item[data-action="${name}"]`)!.click();
  const field = () => panel().querySelector<HTMLTextAreaElement>('.rte-comment-edit-textarea')!;
  const press = (el: HTMLElement, key: string) => el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

  it('turns the comment into a field with its text, Enter saves it and marks it edited', () => {
    comment('Alpha', 'first draft');
    openMenu(cards()[0]);
    choose(cards()[0], 'edit');
    expect(field().value).toBe('first draft');
    expect(document.activeElement).toBe(field());

    type(field(), 'second draft');
    press(field(), 'Enter');
    expect(panel().querySelector('.rte-comment-edit')).toBeNull();
    expect(cards()[0].querySelector('.rte-comment-text')!.textContent).toBe('second draft');
    expect(cards()[0].querySelector('.rte-comment-edited')!.textContent).toContain('edited');
    expect(getAllComments()[0].text).toBe('second draft');
  });

  it('puts everything back on Escape, and the panel stays open', () => {
    comment('Alpha', 'keep me');
    openMenu(cards()[0]);
    choose(cards()[0], 'edit');
    type(field(), 'changed my mind');
    press(field(), 'Escape');
    expect(panel().querySelector('.rte-comment-edit')).toBeNull();
    expect(cards()[0].querySelector('.rte-comment-text')!.textContent).toBe('keep me');
    expect(cards()[0].querySelector('.rte-comment-edited')).toBeNull();
    expect(panel().classList.contains('is-open')).toBe(true);
    expect((document.activeElement as HTMLElement).dataset.action).toBe('more');
  });

  it('cannot be saved empty, and saving the same text does not mark it edited', () => {
    comment('Alpha', 'same');
    openMenu(cards()[0]);
    choose(cards()[0], 'edit');
    type(field(), '  ');
    expect(panel().querySelector<HTMLButtonElement>('.rte-comment-edit .primary')!.disabled).toBe(true);
    type(field(), 'same');
    press(field(), 'Enter');
    expect(cards()[0].querySelector('.rte-comment-edited')).toBeNull();
  });

  it('edits a reply the same way', () => {
    comment('Alpha', 'question');
    const reply = cards()[0].querySelector<HTMLTextAreaElement>('.rte-comment-reply-textarea')!;
    type(reply, 'answer');
    press(reply, 'Enter');

    const replyEl = () => cards()[0].querySelector<HTMLElement>('.rte-comment-reply')!;
    openMenu(replyEl());
    choose(replyEl(), 'edit');
    expect(field().value).toBe('answer');
    expect(cards()[0].querySelector('.rte-comment-text')!.textContent).toBe('question');
    type(field(), 'better answer');
    press(field(), 'Enter');
    expect(replyEl().querySelector('.rte-comment-reply-text')!.textContent).toBe('better answer');
    expect(replyEl().querySelector('.rte-comment-edited')).not.toBeNull();
  });
});

describe('deleting, and taking it back', () => {
  const del = (card: HTMLElement) => {
    card.querySelector<HTMLButtonElement>('[data-action="more"]')!.click();
    card.querySelector<HTMLButtonElement>('.rte-comment-menu-item[data-action="delete"]')!.click();
  };
  const toast = () => panel().querySelector<HTMLElement>('.rte-comments-toast')!;
  const undo = () => toast().querySelector<HTMLButtonElement>('.rte-comments-toast-action')!.click();

  it('offers Undo for a thread, and Undo puts the highlight and the thread back', () => {
    comment('beta gamma', 'one');
    del(cards()[0]);
    expect(toast().hidden).toBe(false);
    expect(toast().textContent).toContain('Comment deleted');
    expect(content.querySelector('.rte-comment-anchor')).toBeNull();

    undo();
    expect(toast().hidden).toBe(true);
    expect(content.querySelector('.rte-comment-anchor')!.textContent).toBe('beta gamma');
    expect(cards()).toHaveLength(1);
    expect(cards()[0].querySelector('.rte-comment-text')!.textContent).toBe('one');
  });

  it('offers Undo for a note, and for a reply', () => {
    comment(null, 'a note');
    const reply = cards()[0].querySelector<HTMLTextAreaElement>('.rte-comment-reply-textarea')!;
    type(reply, 'r1');
    reply.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));

    del(cards()[0].querySelector<HTMLElement>('.rte-comment-reply')!);
    expect(toast().textContent).toContain('Reply deleted');
    expect(cards()[0].querySelectorAll('.rte-comment-reply')).toHaveLength(0);
    undo();
    expect(cards()[0].querySelectorAll('.rte-comment-reply')).toHaveLength(1);

    del(cards()[0]);
    expect(toast().textContent).toContain('Note deleted');
    expect(cards()).toHaveLength(0);
    undo();
    expect(cards()).toHaveLength(1);
    expect(cards()[0].querySelector('.rte-comment-reply-text')!.textContent).toBe('r1');
  });

  it('says so, instead of failing silently, when the document has changed too much to put the highlight back', () => {
    comment('beta gamma', 'one');
    del(cards()[0]);
    content.innerHTML = '<p>Something else entirely</p>';
    undo();
    expect(toast().textContent).toContain('Use Undo in the document');
    expect(content.querySelector('.rte-comment-anchor')).toBeNull();
  });

  it('does nothing harmful when the document got the highlight back first', () => {
    comment('beta gamma', 'one');
    const html = content.innerHTML;
    del(cards()[0]);
    content.innerHTML = html; // what the editor's own Undo does
    panel().dispatchEvent(new Event('x'));
    undo();
    expect(content.querySelectorAll('.rte-comment-anchor')).toHaveLength(1);
  });

  it('goes away by itself', () => {
    vi.useFakeTimers();
    try {
      comment(null, 'a note');
      del(cards()[0]);
      expect(toast().hidden).toBe(false);
      vi.advanceTimersByTime(8100);
      expect(toast().hidden).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('the bubble over a selection', () => {
  const bubble = () => document.querySelector<HTMLElement>('.rte-comments-bubble');
  const visible = () => !!bubble() && !bubble()!.hidden;
  const settle = () => new Promise((resolve) => setTimeout(resolve, 80));

  beforeEach(() => {
    // jsdom has no layout: give a selection somewhere to be.
    Range.prototype.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 40, right: 120, width: 80, height: 20, x: 40, y: 100, toJSON: () => ({}) }) as DOMRect;
    Range.prototype.getClientRects = () => [Range.prototype.getBoundingClientRect.call(null)] as unknown as DOMRectList;
  });

  it('appears when text is selected and goes when it is not', async () => {
    select('gamma');
    document.dispatchEvent(new Event('selectionchange'));
    await settle();
    expect(visible()).toBe(true);

    window.getSelection()!.removeAllRanges();
    document.dispatchEvent(new Event('selectionchange'));
    await settle();
    expect(visible()).toBe(false);
  });

  it('starts a comment on that text when clicked', async () => {
    select('gamma');
    document.dispatchEvent(new Event('selectionchange'));
    await settle();
    bubble()!.click();
    expect(panel().querySelector('.rte-comment-composer .rte-comment-selection')!.textContent).toBe('gamma');
    expect(visible()).toBe(false);
  });

  it('waits for the pointer to come up, so it does not chase a drag', async () => {
    document.dispatchEvent(new Event('pointerdown'));
    select('gamma');
    document.dispatchEvent(new Event('selectionchange'));
    await settle();
    expect(visible()).toBe(false);
    document.dispatchEvent(new Event('pointerup'));
    await settle();
    expect(visible()).toBe(true);
  });

  it('is not offered in a read-only document', async () => {
    content.setAttribute('contenteditable', 'false');
    select('gamma');
    document.dispatchEvent(new Event('selectionchange'));
    await settle();
    expect(visible()).toBe(false);
  });

  it('is not offered in an editor that does not have comments', async () => {
    document.body.insertAdjacentHTML('beforeend', '<div class="rte-editor" id="other"><div class="rte-content" contenteditable="true"><p>Plain editor text</p></div></div>');
    const text = document.querySelector('#other p')!.firstChild!;
    const range = document.createRange();
    range.setStart(text, 0);
    range.setEnd(text, 5);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
    await settle();
    expect(visible()).toBe(false);
  });
});

describe('the shortcut', () => {
  const chord = (init: KeyboardEventInit) =>
    content.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyM', key: 'µ', altKey: true, bubbles: true, cancelable: true, ...init }));

  it('Ctrl+Alt+M starts a comment on the selection (by key code, since Alt changes the key on a Mac)', () => {
    select('Epsilon');
    expect(chord({ ctrlKey: true })).toBe(false); // prevented
    expect(panel().querySelector('.rte-comment-composer .rte-comment-selection')!.textContent).toBe('Epsilon');
    expect(document.activeElement).toBe(composerField());
  });

  it('Cmd+Alt+M does the same, and with nothing selected it starts a note', () => {
    expect(chord({ metaKey: true })).toBe(false);
    expect(panel().querySelector('.rte-comment-composer-hint')).not.toBeNull();
  });

  it('ignores the chord without Alt, or with Shift', () => {
    expect(chord({ ctrlKey: true, altKey: false })).toBe(true);
    expect(chord({ ctrlKey: true, shiftKey: true })).toBe(true);
    expect(panel().querySelector('.rte-comment-composer')).toBeNull();
  });
});
