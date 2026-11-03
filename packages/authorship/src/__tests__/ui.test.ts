import { attachAuthorship } from '../dom/attach.js';
import { readEmbeddedState, toAnnotatedHtml, documentSourceType } from '../dom/export.js';
import { createHighlighter } from '../dom/highlight.js';
import { createAuthorshipPanel } from '../dom/panel.js';
import { openReplayView } from '../dom/replay-view.js';

// jsdom has no layout; browsers do.
Range.prototype.getClientRects ??= function () {
  return [] as unknown as DOMRectList;
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

async function recorded() {
  document.body.innerHTML = '<div class="editora-content" contenteditable="true"><p>Mine. <b>Bold</b></p></div>';
  const root = document.querySelector<HTMLElement>('.editora-content')!;
  const controller = attachAuthorship(root, { author: 'Ana', autoStart: true });
  controller.expect({ kind: 'ai', model: 'gemma4', provider: 'Ollama' });
  root.querySelector('b')!.append(' AI says hi');
  await flush();
  return { root, controller };
}

describe('export', () => {
  it('wraps non-typed text in data-provenance spans and embeds the record', async () => {
    const { root, controller } = await recorded();
    const state = controller.serialize();
    const html = toAnnotatedHtml(root, state, { embed: true });
    expect(html).toContain('<b>Bold<span data-provenance="ai" data-provenance-model="gemma4" data-provenance-provider="Ollama" data-provenance-author="Ana" data-provenance-type="http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"> AI says hi</span></b>');
    const back = readEmbeddedState(html);
    expect(back.state?.runs).toEqual(state.runs);
    expect(back.html).not.toContain('<script');
    expect(root.innerHTML).not.toContain('data-provenance');
    expect(documentSourceType(controller.getReport())).toMatch(/trainedAlgorithmicMedia$/);
    controller.destroy();
  });
});

describe('highlighter, panel and replay', () => {
  it('falls back to an overlay and fills the panel', async () => {
    const { controller } = await recorded();
    const highlighter = createHighlighter(controller, { overlay: true });
    const panel = createAuthorshipPanel(controller, highlighter, { onReplay: () => undefined });
    panel.show();
    expect(highlighter.visible).toBe(true);
    const text = document.querySelector('.eda-panel')!.textContent!;
    expect(text).toContain('Recording authorship');
    expect(text).toContain('Written by gemma4 (Ollama)');
    expect(text).toContain('Replay writing');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    document.querySelector('.eda-panel')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(panel.open).toBe(false);
    expect(highlighter.visible).toBe(false);
    highlighter.destroy();
    controller.destroy();
  });

  it('replays to the final text', async () => {
    const { controller } = await recorded();
    const state = controller.serialize();
    const view = openReplayView(state.log!, { origins: state.origins, autoplay: false });
    view.seek(1);
    expect(view.text).toBe(state.text);
    expect(document.querySelector('.eda-replay-text .eda-overlay-ai')?.textContent).toBe(' AI says hi');
    view.close();
    expect(document.querySelector('.eda-replay')).toBeNull();
    controller.destroy();
  });
});
