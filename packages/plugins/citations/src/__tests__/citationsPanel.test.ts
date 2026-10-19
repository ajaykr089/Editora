import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CitationsPlugin } from '../CitationsPlugin.native';

// Cycling the style from the toolbar or the shortcut has to show in the panel: the status, the button and the
// Style dropdown all say the same thing.
let editor: HTMLElement;
let plugin: ReturnType<typeof CitationsPlugin>;

const panel = () => document.querySelector('.rte-citations-panel') as HTMLElement;
const dropdown = () => panel().querySelector('select[data-field="style"]') as HTMLSelectElement;

beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = () => {};
  document.body.innerHTML = '<div class="rte-content" contenteditable="true"><p>Cited text</p></div>';
  editor = document.querySelector('.rte-content') as HTMLElement;
  plugin = CitationsPlugin({ defaultStyle: 'apa' });
  plugin.init?.call({}, { editorElement: editor } as never);
  plugin.commands?.toggleCitationsPanel?.(undefined, { contentElement: editor } as never);
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('the citations panel follows the style', () => {
  it('starts on the default style everywhere', () => {
    expect(dropdown().value).toBe('apa');
    expect(panel().querySelector('.rte-citations-status')!.textContent).toContain('APA');
  });

  it('shows the new style in the dropdown, the status and the button after cycling', () => {
    plugin.commands?.cycleCitationStyle?.(undefined, { contentElement: editor } as never);
    expect(dropdown().value).toBe('mla');
    expect(panel().querySelector('.rte-citations-status')!.textContent).toContain('MLA');
    expect(panel().querySelector('[data-action="cycle-style"]')!.textContent).toContain('MLA');

    plugin.commands?.cycleCitationStyle?.(undefined, { contentElement: editor } as never);
    expect(dropdown().value).toBe('chicago');
  });

  it('goes back round to the first style', () => {
    for (let i = 0; i < 3; i++) plugin.commands?.cycleCitationStyle?.(undefined, { contentElement: editor } as never);
    expect(dropdown().value).toBe('apa');
  });

  it('shows a style set by command in the dropdown too', () => {
    plugin.commands?.setCitationStyle?.('chicago', { contentElement: editor } as never);
    expect(dropdown().value).toBe('chicago');
  });
});
