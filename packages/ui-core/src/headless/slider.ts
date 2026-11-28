import { createCleanup } from './shared';
import { createHiddenInput, onFormReset } from './form';

export interface SliderOptions {
  /**
   * The track: contains one `[data-slider-thumb]` per value (two for a range) and optionally a
   * `[data-slider-range]` for the filled part. Make it `position: relative`, the thumbs and range
   * `position: absolute`; the controller sets their position.
   */
  root: HTMLElement;
  min?: number;
  max?: number;
  step?: number;
  /** One value per thumb (default `[min]`). */
  defaultValue?: number[];
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  /** Steps PageUp/PageDown and Shift+Arrow move (default 10). */
  largeStep?: number;
  /** Range: the least number of steps between two thumbs (default 0). */
  minStepsBetweenThumbs?: number;
  /** Joins the surrounding form under this name (one field per thumb). */
  name?: string;
  /** Read out instead of the number, e.g. `(v) => `${v} %``. */
  getValueText?: (value: number, index: number) => string;
  /** Every change, while dragging too. */
  onValueChange?: (value: number[]) => void;
  /** When a drag ends or a key changes the value: the moment to save. */
  onValueCommit?: (value: number[]) => void;
}

export interface SliderController {
  readonly value: number[];
  setValue(value: number[]): void;
  setDisabled(disabled: boolean): void;
  destroy(): void;
}

const decimals = (n: number) => {
  const text = String(n);
  const dot = text.indexOf('.');
  return dot < 0 ? 0 : text.length - dot - 1;
};

/**
 * Slider behaviour (single or range): thumbs are `role="slider"` with `aria-valuenow/min/max`,
 * arrows move one step (Up and Right increase; mirrored in RTL), PageUp/PageDown and Shift+Arrow a
 * large step, Home/End to the ends. Pointer: pressing the track moves the nearest thumb there and
 * drags it. Thumbs get `--slider-percent` and are positioned; the range spans between the values.
 */
export function createSlider(options: SliderOptions): SliderController {
  const { root } = options;
  const cleanup = createCleanup();
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const step = options.step && options.step > 0 ? options.step : 1;
  const vertical = options.orientation === 'vertical';
  const large = (options.largeStep ?? 10) * step;
  const gap = (options.minStepsBetweenThumbs ?? 0) * step;
  const places = decimals(step);
  let disabled = !!options.disabled;

  const thumbs = Array.from(root.querySelectorAll<HTMLElement>('[data-slider-thumb]'));
  const range = root.querySelector<HTMLElement>('[data-slider-range]');
  const snap = (v: number) => {
    const snapped = Math.round((v - min) / step) * step + min;
    return Number(Math.min(max, Math.max(min, snapped)).toFixed(places));
  };
  const initial = thumbs.map((_, i) => snap(options.defaultValue?.[i] ?? options.defaultValue?.[0] ?? min)).sort((a, b) => a - b);
  let value = [...initial];
  const inputs: HTMLInputElement[] = [];
  if (options.name && thumbs.length) {
    // Chained so the fields are in thumb order in FormData.
    let anchor = thumbs[thumbs.length - 1];
    for (let i = 0; i < thumbs.length; i += 1) {
      anchor = createHiddenInput(anchor, 'hidden', thumbs.length > 1 ? `${options.name}[]` : options.name);
      inputs.push(anchor as HTMLInputElement);
    }
  }
  for (const input of inputs) cleanup.add(() => input.remove());

  root.setAttribute('data-orientation', vertical ? 'vertical' : 'horizontal');
  const rtl = () => !vertical && getComputedStyle(root).direction === 'rtl';
  const percent = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100);

  const sync = () => {
    const flip = rtl();
    thumbs.forEach((thumb, i) => {
      const p = percent(value[i]);
      thumb.setAttribute('role', 'slider');
      thumb.tabIndex = disabled ? -1 : 0;
      thumb.setAttribute('aria-valuemin', String(i > 0 ? value[i - 1] + gap : min));
      thumb.setAttribute('aria-valuemax', String(i < thumbs.length - 1 ? value[i + 1] - gap : max));
      thumb.setAttribute('aria-valuenow', String(value[i]));
      thumb.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
      const text = options.getValueText?.(value[i], i);
      if (text) thumb.setAttribute('aria-valuetext', text);
      else thumb.removeAttribute('aria-valuetext');
      if (disabled) thumb.setAttribute('aria-disabled', 'true');
      else thumb.removeAttribute('aria-disabled');
      thumb.style.setProperty('--slider-percent', String(p));
      if (vertical) {
        thumb.style.bottom = `${p}%`;
        thumb.style.transform = 'translateY(50%)';
      } else {
        thumb.style[flip ? 'right' : 'left'] = `${p}%`;
        thumb.style[flip ? 'left' : 'right'] = '';
        thumb.style.transform = flip ? 'translateX(50%)' : 'translateX(-50%)';
      }
    });
    if (range) {
      const start = thumbs.length > 1 ? percent(value[0]) : 0;
      const end = percent(value[value.length - 1]);
      if (vertical) {
        range.style.bottom = `${start}%`;
        range.style.top = `${100 - end}%`;
      } else {
        range.style[flip ? 'right' : 'left'] = `${start}%`;
        range.style[flip ? 'left' : 'right'] = `${100 - end}%`;
      }
    }
    if (disabled) root.setAttribute('data-disabled', '');
    else root.removeAttribute('data-disabled');
    inputs.forEach((input, i) => {
      input.value = String(value[i]);
    });
  };

  /** Sets thumb `i` to `v`, kept between its neighbours. Returns whether it changed. */
  const setThumb = (i: number, v: number): boolean => {
    const low = i > 0 ? value[i - 1] + gap : min;
    const high = i < value.length - 1 ? value[i + 1] - gap : max;
    const next = Math.min(high, Math.max(low, snap(v)));
    if (next === value[i]) return false;
    value = value.map((old, j) => (j === i ? next : old));
    sync();
    options.onValueChange?.([...value]);
    return true;
  };

  cleanup.listen(root, 'keydown', (event: KeyboardEvent) => {
    const i = thumbs.indexOf(event.target as HTMLElement);
    if (i < 0 || disabled) return;
    const flip = rtl();
    const by = event.shiftKey ? large : step;
    let next: number;
    switch (event.key) {
      case 'ArrowUp': next = value[i] + by; break;
      case 'ArrowDown': next = value[i] - by; break;
      case 'ArrowRight': next = value[i] + (flip ? -by : by); break;
      case 'ArrowLeft': next = value[i] + (flip ? by : -by); break;
      case 'PageUp': next = value[i] + large; break;
      case 'PageDown': next = value[i] - large; break;
      case 'Home': next = min; break;
      case 'End': next = max; break;
      default: return;
    }
    event.preventDefault();
    if (setThumb(i, next)) options.onValueCommit?.([...value]);
  });

  const valueAt = (event: PointerEvent): number => {
    const rect = root.getBoundingClientRect();
    let ratio = vertical
      ? (rect.bottom - event.clientY) / (rect.height || 1)
      : (event.clientX - rect.left) / (rect.width || 1);
    if (rtl()) ratio = 1 - ratio;
    return min + Math.min(1, Math.max(0, ratio)) * (max - min);
  };

  let dragging = -1;
  let changed = false;
  cleanup.listen(root, 'pointerdown', (event: PointerEvent) => {
    if (disabled || event.button !== 0) return;
    const v = valueAt(event);
    // The nearest thumb; on a tie (stacked thumbs), the one that can move that way.
    let i = 0;
    let best = Infinity;
    value.forEach((current, j) => {
      const d = Math.abs(current - v);
      if (d < best || (d === best && v > current)) {
        best = d;
        i = j;
      }
    });
    event.preventDefault();
    dragging = i;
    changed = setThumb(i, v);
    thumbs[i].focus();
    try {
      root.setPointerCapture(event.pointerId);
    } catch {
      // not capturable (synthetic event)
    }
  });
  cleanup.listen(root, 'pointermove', (event: PointerEvent) => {
    if (dragging < 0) return;
    if (setThumb(dragging, valueAt(event))) changed = true;
  });
  const end = () => {
    if (dragging < 0) return;
    dragging = -1;
    if (changed) options.onValueCommit?.([...value]);
    changed = false;
  };
  cleanup.listen(root, 'pointerup', end);
  cleanup.listen(root, 'pointercancel', end);
  cleanup.listen(root, 'lostpointercapture', end);
  cleanup.add(onFormReset(root, () => {
    value = [...initial];
    sync();
    options.onValueChange?.([...value]);
  }));

  sync();

  return {
    get value() {
      return [...value];
    },
    setValue(next) {
      value = thumbs.map((_, i) => snap(next[i] ?? value[i])).sort((a, b) => a - b);
      sync();
    },
    setDisabled(next) {
      disabled = next;
      sync();
    },
    destroy: () => cleanup.run(),
  };
}
