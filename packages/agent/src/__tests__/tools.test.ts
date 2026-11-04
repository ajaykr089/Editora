// @vitest-environment node
import { DraftDocument } from '../core/draft.js';
import { callTool, createDocumentTools } from '../core/tools.js';

function setup() {
  const draft = new DraftDocument(
    [
      { id: 'b1', type: 'heading', level: 2, text: 'Quarterly Update' },
      { id: 'b2', type: 'paragraph', text: 'Signups is up 23% and signups keep growing.' },
      { id: 'b3', type: 'list-item', text: 'Hire two engineers' },
    ],
    { text: 'Signups is up', blockIds: ['b2'] },
  );
  const edits: string[] = [];
  const tools = createDocumentTools(draft, { onEdit: (tool) => edits.push(tool) });
  return { draft, tools, edits, call: (name: string, args: Record<string, unknown> = {}) => callTool(tools, name, args) };
}

describe('document tools', () => {
  it('lists the seven tools with object schemas', () => {
    const { tools } = setup();
    expect(tools.map((tool) => tool.name)).toEqual(['get_document', 'get_selection', 'search', 'replace_text', 'rewrite_block', 'insert_blocks', 'delete_blocks']);
    for (const tool of tools) expect(tool.parameters.type).toBe('object');
  });

  it('reads the document and the selection', async () => {
    const { call } = setup();
    expect((await call('get_document')).text).toBe('3 blocks.\n[b1] heading 2: Quarterly Update\n[b2] paragraph: Signups is up 23% and signups keep growing.\n[b3] bullet item: Hire two engineers');
    expect((await call('get_document', { from: 1, limit: 1 })).text).toContain('(1 more blocks: call again with from=2.)');
    expect((await call('get_selection')).text).toBe('Selected text: "Signups is up"\nIn blocks: b2');
  });

  it('searches case-insensitively, and by regex', async () => {
    const { call } = setup();
    expect((await call('search', { query: 'signups' })).text).toMatch(/^2 matches/);
    expect((await call('search', { query: 'sign\\w+', regex: true, case_sensitive: true })).text).toMatch(/^1 match:/);
    expect((await call('search', { query: '(' , regex: true })).isError).toBe(true);
  });

  it('replaces text, one occurrence or all', async () => {
    const { call, draft, edits } = setup();
    await call('replace_text', { block_id: 'b2', find: 'Signups is', replace: 'Signups are' });
    expect(draft.get('b2').text).toBe('Signups are up 23% and signups keep growing.');
    await call('replace_text', { block_id: 'b2', find: 'ups', replace: 'UPS', occurrence: 2 });
    expect(draft.get('b2').text).toBe('Signups are up 23% and signUPS keep growing.');
    const missing = await call('replace_text', { block_id: 'b2', find: 'nope', replace: 'x' });
    expect(missing).toMatchObject({ isError: true });
    expect(missing.text).toContain('is not in b2');
    expect(edits).toEqual(['replace_text', 'replace_text']);
  });

  it('rewrites, inserts and deletes, and reports the changes', async () => {
    const { call, draft } = setup();
    await call('rewrite_block', { block_id: 'b1', text: 'Quarterly update' });
    const inserted = await call('insert_blocks', { after_block_id: 'b2', blocks: [{ type: 'heading', level: 3, text: 'Next' }, { type: 'paragraph', text: 'More soon.' }] });
    expect(inserted.text).toContain('Inserted 2 blocks: b4, b5.');
    await call('insert_blocks', { after_block_id: 'start', blocks: [{ type: 'paragraph', text: 'Draft' }] });
    await call('delete_blocks', { block_ids: ['b3'] });
    expect(draft.blocks().map((block) => block.id)).toEqual(['b6', 'b1', 'b2', 'b4', 'b5']);
    expect(draft.changes()).toEqual({
      rewritten: [{ id: 'b1', from: 'Quarterly Update', to: 'Quarterly update' }],
      deleted: ['b3'],
      inserted: [
        { id: 'b6', after: null, block: { type: 'paragraph', text: 'Draft', level: undefined } },
        { id: 'b4', after: 'b2', block: { type: 'heading', text: 'Next', level: 3 } },
        { id: 'b5', after: 'b2', block: { type: 'paragraph', text: 'More soon.', level: undefined } },
      ],
    });
  });

  it('turns bad input into error results, not exceptions', async () => {
    const { call } = setup();
    expect(await call('rewrite_block', { block_id: 'b9', text: 'x' })).toMatchObject({ isError: true });
    expect(await call('rewrite_block', { block_id: 'b1', text: '  ' })).toMatchObject({ isError: true });
    expect(await call('insert_blocks', { after_block_id: 'b1', blocks: [{ type: 'table', text: 'x' }] })).toMatchObject({ isError: true });
    expect(await call('delete_blocks', { block_ids: [] })).toMatchObject({ isError: true });
    expect(await call('nope')).toMatchObject({ isError: true });
    await call('delete_blocks', { block_ids: ['b3'] });
    expect((await call('rewrite_block', { block_id: 'b3', text: 'x' })).text).toContain('was deleted');
  });
});
