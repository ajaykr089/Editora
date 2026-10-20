import { resolveMediaManagerConfig } from '../constants';
import type { MediaManagerConfig } from '../types/media';
import { icons } from './picker/icons';

export const canSuggestAlt = (config?: Partial<MediaManagerConfig>): boolean =>
  typeof resolveMediaManagerConfig(config).generateAltText === 'function';

/** What the service sent back, tidied: one paragraph, no wrapping quotes, not longer than alt text should be. */
export const tidyAltText = (value: unknown): string => {
  const text = (typeof value === 'string' ? value : '').replace(/\s+/g, ' ').trim().replace(/^["'“”]+|["'“”]+$/g, '').trim();
  return text.length > 500 ? `${text.slice(0, 497).trimEnd()}…` : text;
};

/**
 * A "Suggest" button for an alt text field. It asks the function given as `generateAltText` and puts what comes
 * back in the field, for the person to read and change: nothing is inserted into the document by it. A failure
 * is said next to the button. Returns the button and a status line to put under the field; they are not in the
 * DOM yet.
 */
export const createSuggestControl = (options: {
  config?: Partial<MediaManagerConfig>;
  image: () => { src: string; name?: string };
  input: HTMLTextAreaElement | HTMLInputElement;
  /** Called after the field has been filled, so that what listens for typing hears it. */
  onFilled?: () => void;
  /** The words on the button (its accessible name stays "Suggest alt text"). */
  label?: string;
}): { button: HTMLButtonElement; status: HTMLElement; abort: () => void } => {
  const generate = resolveMediaManagerConfig(options.config).generateAltText;
  let controller: AbortController | null = null;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'rte-mp-suggest';
  const idle = options.label ?? 'Suggest';
  button.innerHTML = `${icons.sparkle}<span></span>`;
  button.querySelector('span')!.textContent = idle;
  button.setAttribute('aria-label', 'Suggest alt text');

  const status = document.createElement('p');
  status.className = 'rte-mp-hint';
  status.setAttribute('role', 'status');
  status.hidden = true;

  const say = (text: string, isError = false) => {
    status.hidden = !text;
    status.textContent = text;
    status.classList.toggle('is-warning', isError);
    status.setAttribute('role', isError ? 'alert' : 'status');
  };
  const label = button.querySelector('span')!;

  button.addEventListener('click', async () => {
    if (!generate || controller) return;
    controller = new AbortController();
    const mine = controller;
    button.disabled = true;
    label.textContent = 'Describing…';
    say('');
    try {
      const text = tidyAltText(await generate(options.image(), { signal: mine.signal }));
      if (mine.signal.aborted) return;
      if (!text) throw new Error('No description came back.');
      options.input.value = text;
      options.input.dispatchEvent(new Event('input', { bubbles: true }));
      options.onFilled?.();
      say('Suggested for you. Read it and change it if it is not right.');
    } catch (error) {
      if (mine.signal.aborted) return;
      say(error instanceof Error && error.message ? error.message : "Couldn't suggest a description.", true);
    } finally {
      if (controller === mine) controller = null;
      button.disabled = false;
      label.textContent = idle;
    }
  });

  return { button, status, abort: () => controller?.abort() };
};
