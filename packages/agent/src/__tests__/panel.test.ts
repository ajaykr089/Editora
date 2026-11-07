import { attachAgent, AgentBusyError } from '../dom/attach.js';
import { createAgentPanel } from '../dom/panel.js';
import type { AgentProvider, ChatTurn } from '../core/loop.js';

function editor(html: string): HTMLElement {
  document.body.innerHTML = `<div class="editora-editor"><div class="editora-content" contenteditable="true">${html}</div></div>`;
  return document.querySelector<HTMLElement>('.editora-content')!;
}

const call = (id: string, name: string, args: Record<string, unknown>) => ({ id, name, arguments: args });

function scripted(turns: ChatTurn[], model = 'test-model'): AgentProvider {
  return { id: 'fake', model, chat: async () => turns.shift() ?? { content: 'done', toolCalls: [], stop: 'end' } };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('attachAgent', () => {
  it('runs, shows one review with the model on the marks, and records the run on accept', async () => {
    const root = editor('<h2>Quarterly Update</h2><p>Signups is up.</p>');
    const ended: string[] = [];
    const agent = attachAgent(root, {
      provider: scripted([
        { content: '', toolCalls: [call('1', 'get_document', {})], stop: 'tool_use' },
        { content: '', toolCalls: [call('2', 'rewrite_block', { block_id: 'b1', text: 'Quarterly update' }), call('3', 'replace_text', { block_id: 'b2', find: 'is', replace: 'are' })], stop: 'tool_use' },
        { content: 'Fixed the heading and the verb.', toolCalls: [], stop: 'end' },
      ]),
      onReviewEnd: (info) => ended.push(info.afterHTML),
    });
    const summary = await agent.run('Fix it');
    expect(summary).toMatchObject({ suggestions: 2, conflicts: [], result: { stopped: 'done' } });
    expect(agent.reviewing).toBe(true);
    expect(root.querySelector('ins')!.getAttribute('data-provenance-model')).toBe('test-model');
    await expect(agent.run('again')).rejects.toBeInstanceOf(AgentBusyError);
    document.querySelector<HTMLButtonElement>('.air-bar button.air-btn-primary')!.click();
    expect(agent.reviewing).toBe(false);
    expect(ended).toEqual(['<h2>Quarterly update</h2><p>Signups are up.</p>']);
  });

  it('leaves the page alone when stopped', async () => {
    const root = editor('<p>Text.</p>');
    let release!: () => void;
    const provider: AgentProvider = {
      id: 'slow',
      chat: () => new Promise((resolve) => (release = () => resolve({ content: '', toolCalls: [call('1', 'rewrite_block', { block_id: 'b1', text: 'Changed.' })], stop: 'tool_use' }))),
    };
    const agent = attachAgent(root, { provider });
    const running = agent.run('Change it');
    await flush();
    expect(agent.busy).toBe(true);
    agent.stop();
    release();
    const summary = await running;
    expect(summary.result.stopped).toBe('aborted');
    expect(root.innerHTML).toBe('<p>Text.</p>');
    expect(agent.busy).toBe(false);
  });

  it('applies at once in apply mode', async () => {
    const root = editor('<p>Old.</p>');
    const agent = attachAgent(root, { mode: 'apply', provider: scripted([{ content: '', toolCalls: [call('1', 'rewrite_block', { block_id: 'b1', text: 'New.' })], stop: 'tool_use' }]) });
    await agent.run('x');
    expect(root.innerHTML).toBe('<p>New.</p>');
    expect(agent.reviewing).toBe(false);
  });
});

describe('createAgentPanel', () => {
  it('runs a preset, logs the steps and reports the suggestions', async () => {
    const root = editor('<p>teh cat.</p>');
    const agent = attachAgent(root, {
      providers: [
        { id: 'a', label: 'Model A', create: () => scripted([{ content: '', toolCalls: [call('1', 'get_document', {}), call('2', 'replace_text', { block_id: 'b1', find: 'teh', replace: 'the' }), call('3', 'rewrite_block', { block_id: 'b7', text: 'x' })], stop: 'tool_use' }, { content: 'Fixed a typo.', toolCalls: [], stop: 'end' }]) },
        { id: 'b', label: 'Model B', create: () => scripted([]) },
      ],
    });
    const panel = createAgentPanel(agent);
    panel.show();
    const dialog = document.querySelector<HTMLElement>('.eag-panel')!;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(document.activeElement).toBe(dialog.querySelector('textarea'));
    expect(Array.from(dialog.querySelectorAll('option')).map((o) => o.textContent)).toEqual(['Model A', 'Model B']);
    dialog.querySelector<HTMLButtonElement>('.eag-chip')!.click();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const log = Array.from(dialog.querySelectorAll('.eag-log li')).map((li) => `${(li as HTMLElement).dataset.kind}:${li.textContent}`);
    expect(log).toEqual(['user:Fix spelling and grammar', 'tool:Reading the document', 'tool:Editing b1', 'error:Rewriting b7: There is no block "b7". Call get_document to see the current ids.', 'answer:Fixed a typo.']);
    expect(dialog.querySelector('.eag-status')!.textContent).toContain('1 suggestion in the editor');
    expect(dialog.querySelector<HTMLButtonElement>('button[type=submit]')!.disabled).toBe(true);
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(panel.open).toBe(false);
  });
});
