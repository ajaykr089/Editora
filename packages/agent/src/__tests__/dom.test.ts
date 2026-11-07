import { callTool, createDocumentTools } from '../core/tools.js';
import { hasPendingSuggestions, readEditor } from '../dom/document.js';
import { commitDraft } from '../dom/edits.js';

function editor(html: string): HTMLElement {
  document.body.innerHTML = `<div class="wrap"><div class="editora-content" contenteditable="true">${html}</div></div>`;
  return document.querySelector<HTMLElement>('.editora-content')!;
}

async function run(root: HTMLElement, calls: Array<[string, Record<string, unknown>]>) {
  const snapshot = readEditor(root);
  const tools = createDocumentTools(snapshot.draft);
  for (const [name, args] of calls) {
    const result = await callTool(tools, name, args);
    if (result.isError) throw new Error(result.text);
  }
  return snapshot;
}

const texts = (root: HTMLElement) => Array.from(root.querySelectorAll('h1,h2,h3,p,li,blockquote')).map((el) => `${el.tagName.toLowerCase()}:${el.textContent}`);

describe('readEditor', () => {
  it('reads blocks with types and ids', () => {
    const root = editor('<h2>Title</h2><p>One <b>two</b></p><ol><li>first</li></ol><blockquote><p>quoted</p></blockquote><p></p>');
    const { draft } = readEditor(root);
    expect(draft.blocks()).toEqual([
      { id: 'b1', type: 'heading', level: 2, ordered: undefined, text: 'Title' },
      { id: 'b2', type: 'paragraph', level: undefined, ordered: undefined, text: 'One two' },
      { id: 'b3', type: 'list-item', level: undefined, ordered: true, text: 'first' },
      { id: 'b4', type: 'quote', level: undefined, ordered: undefined, text: 'quoted' },
    ]);
  });
});

describe('commitDraft', () => {
  it('shows edits as suggestions, keeping formatting of untouched words', async () => {
    const root = editor('<p>The <strong>quick</strong> brown fox.</p><p>Other.</p>');
    const snapshot = await run(root, [['replace_text', { block_id: 'b1', find: 'brown', replace: 'red' }]]);
    const result = commitDraft(root, snapshot, { model: 'gemma4', provider: 'ollama' });
    expect(result.count).toBe(1);
    expect(hasPendingSuggestions(root)).toBe(true);
    expect(root.querySelector('strong')!.textContent).toBe('quick');
    expect(root.querySelector('ins')!.getAttribute('data-provenance-model')).toBe('gemma4');
    result.review!.acceptAll();
    expect(root.innerHTML).toBe('<p>The <strong>quick</strong> red fox.</p><p>Other.</p>');
  });

  it('inserts, deletes and rewrites in one review; reject all restores the page', async () => {
    const html = '<h2>Plan</h2><p>Keep.</p><p>Drop me.</p><ul><li>One</li></ul>';
    const root = editor(html);
    const snapshot = await run(root, [
      ['rewrite_block', { block_id: 'b1', text: 'The plan' }],
      ['delete_blocks', { block_ids: ['b3'] }],
      ['insert_blocks', { after_block_id: 'b2', blocks: [{ type: 'heading', level: 3, text: 'Added' }, { type: 'paragraph', text: 'New text.' }] }],
      ['insert_blocks', { after_block_id: 'b4', blocks: [{ type: 'list-item', text: 'Two' }] }],
    ]);
    const ended: Array<{ beforeHTML: string; afterHTML: string }> = [];
    const result = commitDraft(root, snapshot, { onEnd: (info) => ended.push(info) });
    expect(result.count).toBeGreaterThanOrEqual(5);
    result.review!.rejectAll();
    expect(root.innerHTML).toBe(html);
    expect(ended).toHaveLength(1);
    expect(ended[0].beforeHTML).toBe(html);
  });

  it('accepting places new blocks where the agent asked', async () => {
    const root = editor('<h2>Plan</h2><p>Keep.</p><p>Drop me.</p><ul><li>One</li></ul>');
    const snapshot = await run(root, [
      ['delete_blocks', { block_ids: ['b3'] }],
      ['insert_blocks', { after_block_id: 'b2', blocks: [{ type: 'heading', level: 3, text: 'Added' }, { type: 'paragraph', text: 'New text.' }] }],
      ['insert_blocks', { after_block_id: 'b4', blocks: [{ type: 'list-item', text: 'Two' }] }],
      ['insert_blocks', { after_block_id: 'start', blocks: [{ type: 'paragraph', text: 'Intro.' }] }],
      ['insert_blocks', { after_block_id: 'b1', blocks: [{ type: 'list-item', text: 'A' }, { type: 'list-item', text: 'B' }] }],
    ]);
    commitDraft(root, snapshot, { mode: 'apply' });
    expect(hasPendingSuggestions(root)).toBe(false);
    expect(texts(root)).toEqual(['p:Intro.', 'h2:Plan', 'li:A', 'li:B', 'p:Keep.', 'h3:Added', 'p:New text.', 'li:One', 'li:Two']);
    expect(root.querySelectorAll('ul').length).toBe(2);
    expect(root.querySelector('[data-agent-new]')).toBeNull();
  });

  it('drops edits to blocks the user changed meanwhile', async () => {
    const root = editor('<p>Alpha.</p><p>Beta.</p>');
    const snapshot = await run(root, [
      ['rewrite_block', { block_id: 'b1', text: 'Alpha!' }],
      ['rewrite_block', { block_id: 'b2', text: 'Beta!' }],
    ]);
    root.querySelector('p')!.textContent = 'Alpha, edited by the user.';
    const result = commitDraft(root, snapshot);
    expect(result.conflicts).toEqual(['b1']);
    result.review!.acceptAll();
    expect(texts(root)).toEqual(['p:Alpha, edited by the user.', 'p:Beta!']);
  });

  it('reads pending suggestions as accepted', async () => {
    const root = editor('<p>Old words here.</p>');
    const snapshot = await run(root, [['rewrite_block', { block_id: 'b1', text: 'New words here.' }]]);
    commitDraft(root, snapshot);
    expect(readEditor(root).draft.blocks()[0].text).toBe('New words here.');
  });

  it('does nothing for a run without changes', async () => {
    const root = editor('<p>Same.</p>');
    const snapshot = await run(root, [['rewrite_block', { block_id: 'b1', text: 'Same.' }]]);
    expect(commitDraft(root, snapshot)).toEqual({ review: null, count: 0, conflicts: [] });
    expect(root.innerHTML).toBe('<p>Same.</p>');
  });
});
