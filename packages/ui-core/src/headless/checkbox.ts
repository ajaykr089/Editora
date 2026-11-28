import { createCleanup, setState } from './shared';
import { createHiddenInput, onFormReset } from './form';

export type CheckedState = boolean | 'indeterminate';

export interface CheckboxOptions {
  /** Usually a `<button type="button">`: it gets `role="checkbox"` and `aria-checked`. */
  root: HTMLElement;
  /** `'indeterminate'` shows `aria-checked="mixed"`; a click then checks it. */
  defaultChecked?: CheckedState;
  disabled?: boolean;
  required?: boolean;
  /** Joins the surrounding form under this name. */
  name?: string;
  /** Submitted value when checked (default "on"). */
  value?: string;
  onCheckedChange?: (checked: CheckedState) => void;
}

export interface CheckboxController {
  readonly checked: CheckedState;
  setChecked(checked: CheckedState): void;
  setDisabled(disabled: boolean): void;
  destroy(): void;
}

export type SwitchOptions = Omit<CheckboxOptions, 'defaultChecked' | 'onCheckedChange'> & {
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export interface SwitchController {
  readonly checked: boolean;
  setChecked(checked: boolean): void;
  setDisabled(disabled: boolean): void;
  destroy(): void;
}

function createCheckControl(role: 'checkbox' | 'switch', options: CheckboxOptions): CheckboxController {
  const { root } = options;
  const cleanup = createCleanup();
  const initial: CheckedState = options.defaultChecked ?? false;
  let checked: CheckedState = initial;
  let disabled = !!options.disabled;
  const input = options.name ? createHiddenInput(root, 'checkbox', options.name) : null;
  if (input) {
    input.value = options.value ?? 'on';
    input.defaultChecked = initial === true;
    input.required = !!options.required;
    cleanup.add(() => input.remove());
  }

  root.setAttribute('role', role);
  if (root.tagName === 'BUTTON' && !root.hasAttribute('type')) root.setAttribute('type', 'button');
  if (!root.hasAttribute('tabindex') && root.tagName !== 'BUTTON') root.tabIndex = 0;
  if (options.required) root.setAttribute('aria-required', 'true');

  const sync = () => {
    root.setAttribute('aria-checked', checked === 'indeterminate' ? 'mixed' : String(checked));
    setState(checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked', root);
    if (disabled) {
      root.setAttribute('aria-disabled', 'true');
      root.setAttribute('data-disabled', '');
    } else {
      root.removeAttribute('aria-disabled');
      root.removeAttribute('data-disabled');
    }
    if (input) {
      input.checked = checked === true;
      input.disabled = disabled;
    }
  };

  const set = (next: CheckedState, notify: boolean) => {
    if (next === checked) return;
    checked = next;
    sync();
    if (notify) options.onCheckedChange?.(checked);
  };

  cleanup.listen(root, 'click', (event: MouseEvent) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    set(checked === 'indeterminate' ? true : !checked, true);
  });
  cleanup.listen(root, 'keydown', (event: KeyboardEvent) => {
    // WAI-ARIA: Space toggles, Enter does not (a native button would click on Enter).
    if (event.key === 'Enter') event.preventDefault();
    if (event.key === ' ' && root.tagName !== 'BUTTON') {
      event.preventDefault();
      root.click();
    }
  });
  cleanup.add(onFormReset(root, () => set(initial, true)));

  sync();

  return {
    get checked() {
      return checked;
    },
    setChecked: (next) => set(next, false),
    setDisabled(next) {
      disabled = next;
      sync();
    },
    destroy: () => cleanup.run(),
  };
}

/** Checkbox behaviour on your own element: checked, unchecked or indeterminate, Space to toggle, form value. */
export function createCheckbox(options: CheckboxOptions): CheckboxController {
  return createCheckControl('checkbox', options);
}

/** Switch behaviour (on / off, `role="switch"`) on your own element. */
export function createSwitch(options: SwitchOptions): SwitchController {
  return createCheckControl('switch', options as CheckboxOptions) as SwitchController;
}
