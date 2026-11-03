/**
 * Replay dialog: plays the log back as text, coloured by origin. Pauses
 * longer than 1.5 s are shortened so a three-hour essay plays in minutes.
 * Formatting is not replayed, only the text.
 */
import { createReplay } from '../core/replay.js';
import type { AuthorshipLog, Origin } from '../core/types.js';
import { mergeLabels, type AuthorshipLabels } from './labels.js';
import { applyTheme, ensureStyles } from './styles.js';

export interface ReplayViewOptions {
  /** Origins, to colour the text (from `serialize().origins`). */
  origins?: Origin[];
  labels?: Partial<AuthorshipLabels>;
  /** Element whose theme (light/dark) the dialog copies. */
  themeFrom?: Element;
  /** Start playing at once (default true). */
  autoplay?: boolean;
  onClose?: () => void;
}

export interface ReplayView {
  close(): void;
  play(): void;
  pause(): void;
  /** Jump to a point, 0 (start) to 1 (end). */
  seek(fraction: number): void;
  /** Text on screen now. */
  readonly text: string;
}

const MAX_GAP_MS = 1500;
// Month as a word: "3/11/2026" reads differently in the US and elsewhere.
const stampFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'medium' });
const SPEEDS = [1, 2, 5, 10, 50];

export function openReplayView(log: AuthorshipLog, options: ReplayViewOptions = {}, doc: Document = document): ReplayView {
  ensureStyles(doc);
  const win = doc.defaultView ?? window;
  const labels = mergeLabels(options.labels);
  const replay = createReplay(log);
  const events = log.events;

  // Compressed clock: each event's start and the real time it maps to.
  const compStart: number[] = [];
  let clock = 0;
  let prevEnd = events.length ? events[0].t : 0;
  for (const event of events) {
    clock += Math.min(Math.max(0, event.t - prevEnd), MAX_GAP_MS);
    compStart.push(clock);
    clock += event.d ?? 0;
    prevEnd = Math.max(prevEnd, event.t + (event.d ?? 0));
  }
  const total = Math.max(clock, 1);
  const realAt = (compressed: number): number => {
    let lo = 0;
    let hi = compStart.length - 1;
    let k = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (compStart[mid] <= compressed) {
        k = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    if (k < 0) return replay.start - 1;
    const event = events[k];
    return event.t + Math.min(compressed - compStart[k], event.d ?? 0);
  };

  const previous = doc.activeElement as HTMLElement | null;
  const backdrop = doc.createElement('div');
  backdrop.className = 'eda-replay-backdrop';
  backdrop.setAttribute('data-authorship-ignore', '');
  const dialog = doc.createElement('div');
  dialog.className = 'eda-replay';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'eda-replay-title');
  if (options.themeFrom) applyTheme(backdrop, options.themeFrom);

  const header = doc.createElement('header');
  const title = doc.createElement('h2');
  title.id = 'eda-replay-title';
  title.textContent = 'Writing replay';
  const closeButton = doc.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'eda-btn';
  closeButton.textContent = 'Close';
  header.append(title, closeButton);

  const textBox = doc.createElement('div');
  textBox.className = 'eda-replay-text';
  textBox.tabIndex = 0;
  textBox.setAttribute('aria-label', 'Replayed text');

  const controls = doc.createElement('div');
  controls.className = 'eda-replay-controls';
  const playButton = doc.createElement('button');
  playButton.type = 'button';
  playButton.className = 'eda-btn eda-btn-primary';
  const slider = doc.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '1000';
  slider.value = '0';
  slider.setAttribute('aria-label', 'Position in the replay');
  const speed = doc.createElement('select');
  speed.setAttribute('aria-label', 'Speed');
  for (const value of SPEEDS) {
    const option = doc.createElement('option');
    option.value = String(value);
    option.textContent = `${value}×`;
    speed.append(option);
  }
  speed.value = '5';
  const colour = doc.createElement('label');
  const colourBox = doc.createElement('input');
  colourBox.type = 'checkbox';
  colourBox.checked = true;
  colour.append(colourBox, doc.createTextNode(' Colour by origin'));
  const time = doc.createElement('span');
  time.className = 'eda-replay-time';
  controls.append(playButton, slider, speed, colour, time);

  dialog.append(header, textBox, controls);
  backdrop.append(dialog);
  doc.body.append(backdrop);

  let position = 0; // compressed ms
  let playing = false;
  let frame = 0;
  let lastTick = 0;
  let shown = '';
  let lastKey = '';

  const render = () => {
    const real = realAt(position);
    const state = position >= total ? replay.after(events.length) : replay.at(real);
    const key = `${state.index}:${state.text.length}:${colourBox.checked}`;
    if (key !== lastKey) {
      lastKey = key;
      shown = state.text;
      textBox.replaceChildren();
      let pos = 0;
      for (const [length, id] of state.runs) {
        const span = doc.createElement('span');
        span.textContent = state.text.slice(pos, pos + length).replace(/\ufffc/g, '▫');
        const origin = options.origins?.[id];
        if (colourBox.checked && origin && origin.kind !== 'typed' && origin.kind !== 'existing') {
          span.className = `eda-overlay-${origin.kind}`;
          span.title = labels.kinds[origin.kind];
        }
        textBox.append(span);
        pos += length;
      }
      if (pos < state.text.length) textBox.append(doc.createTextNode(state.text.slice(pos)));
      const caret = doc.createElement('span');
      caret.className = 'eda-caret-mark';
      textBox.append(caret);
      if (playing) caret.scrollIntoView?.({ block: 'nearest' });
    }
    slider.value = String(Math.round((position / total) * 1000));
    const stamp = Number.isFinite(real) && events.length ? stampFormat.format(Math.max(real, replay.start)) : '';
    time.textContent = `${stamp} · ${state.index}/${events.length}`;
    playButton.textContent = playing ? 'Pause' : position >= total ? 'Replay' : 'Play';
  };

  const tick = (now: number) => {
    frame = 0;
    if (!playing) return;
    const elapsed = lastTick ? now - lastTick : 0;
    lastTick = now;
    position = Math.min(total, position + elapsed * Number(speed.value));
    if (position >= total) playing = false;
    render();
    if (playing) frame = win.requestAnimationFrame(tick);
  };

  const view: ReplayView = {
    get text() {
      return shown;
    },
    play() {
      if (position >= total) position = 0;
      playing = true;
      lastTick = 0;
      if (!frame) frame = win.requestAnimationFrame(tick);
      render();
    },
    pause() {
      playing = false;
      render();
    },
    seek(fraction) {
      position = Math.max(0, Math.min(1, fraction)) * total;
      render();
    },
    close() {
      playing = false;
      if (frame) win.cancelAnimationFrame(frame);
      backdrop.remove();
      doc.removeEventListener('keydown', onKey, true);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
      options.onClose?.();
    },
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      view.close();
    } else if (event.key === 'Tab') {
      // Keep focus inside the dialog.
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button, input, select, [tabindex="0"]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  playButton.addEventListener('click', () => (playing ? view.pause() : view.play()));
  slider.addEventListener('input', () => {
    position = (Number(slider.value) / 1000) * total;
    render();
  });
  colourBox.addEventListener('change', render);
  closeButton.addEventListener('click', () => view.close());
  backdrop.addEventListener('pointerdown', (event) => {
    if (event.target === backdrop) view.close();
  });
  doc.addEventListener('keydown', onKey, true);

  render();
  playButton.focus({ preventScroll: true });
  if (options.autoplay !== false && events.length) view.play();
  return view;
}
