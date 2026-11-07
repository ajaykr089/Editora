/**
 * Form association for elements whose real control lives in a shadow root (or is drawn entirely by
 * the element). Without it a surrounding <form> never sees the field: FormData has no entry,
 * form.reset() does nothing, a disabled <fieldset> does not disable it and `required` does not
 * block submission.
 *
 * The element declares `static formAssociated = true`, creates one of these in its constructor and
 * forwards `formResetCallback` / `formDisabledCallback`. Everything else is observed from the host:
 * its attributes and the `input` / `change` events it dispatches, so a component does not have to
 * call into this from every place its value changes.
 */

export type FormControlValue = string | string[] | null;

export type FormControlValidity = {
  /** A native control in the shadow root whose validity is reported as the element's. */
  control?: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) | null;
  /** Otherwise: true when the element is `required` and empty. */
  valueMissing?: boolean;
  message?: string;
  /** Focusable element the browser points its validation message at. */
  anchor?: HTMLElement | null;
};

export type FormControlOptions = {
  /** The submitted value: a string, several strings (one entry each), or null for "no entry". */
  getValue: () => FormControlValue;
  getValidity?: () => FormControlValidity;
  /**
   * The attribute that holds the state form.reset() restores (`value`, or `checked` as a presence
   * attribute). Its value is remembered until the user changes the field, as `defaultValue` is.
   */
  defaultAttribute: string;
  /** Called when a disabled <fieldset> (or form owner) disables or re-enables the element. */
  onFormDisabled?: (disabled: boolean) => void;
  /** Extra host attributes that affect the value or validity (besides name/required/disabled). */
  observe?: string[];
};

type Internals = ElementInternals & {
  form?: HTMLFormElement | null;
  setFormValue?: (value: string | FormData | null) => void;
  setValidity?: (flags: ValidityStateFlags, message?: string, anchor?: HTMLElement) => void;
};

export class FormControl {
  readonly internals: Internals | null;
  private _default: string | null = null;
  private _dirty = false;
  private _restoring = false;
  private _formDisabled = false;
  private _observer: MutationObserver | null = null;
  private _queued = false;

  constructor(private readonly host: HTMLElement, private readonly options: FormControlOptions) {
    let internals: Internals | null = null;
    try {
      internals = typeof host.attachInternals === 'function' ? (host.attachInternals() as Internals) : null;
    } catch {
      internals = null;
    }
    this.internals = internals;
    this._onUserChange = this._onUserChange.bind(this);
  }

  get form(): HTMLFormElement | null {
    try {
      return this.internals?.form ?? null;
    } catch {
      return null;
    }
  }

  /** True while a disabled fieldset disables the element (its own `disabled` attribute aside). */
  get disabledByForm(): boolean {
    return this._formDisabled;
  }

  /** Call from connectedCallback. */
  connect(): void {
    if (!this._dirty) this._default = this.host.getAttribute(this.options.defaultAttribute);
    this.host.addEventListener('input', this._onUserChange);
    this.host.addEventListener('change', this._onUserChange);
    if (typeof MutationObserver !== 'undefined' && !this._observer) {
      this._observer = new MutationObserver((records) => {
        if (records.some((record) => record.attributeName === this.options.defaultAttribute) && !this._dirty && !this._restoring) {
          this._default = this.host.getAttribute(this.options.defaultAttribute);
        }
        this.sync();
      });
      this._observer.observe(this.host, {
        attributes: true,
        attributeFilter: [this.options.defaultAttribute, 'name', 'required', 'disabled', ...(this.options.observe || [])]
      });
    }
    this.sync();
  }

  /** Call from disconnectedCallback. */
  disconnect(): void {
    this.host.removeEventListener('input', this._onUserChange);
    this.host.removeEventListener('change', this._onUserChange);
    this._observer?.disconnect();
    this._observer = null;
  }

  formResetCallback(): void {
    this._dirty = false;
    this._restoring = true;
    try {
      const attribute = this.options.defaultAttribute;
      if (this._default == null) this.host.removeAttribute(attribute);
      else this.host.setAttribute(attribute, this._default);
    } finally {
      this._restoring = false;
    }
    this.sync();
  }

  formDisabledCallback(disabled: boolean): void {
    if (this._formDisabled === disabled) return;
    this._formDisabled = disabled;
    this.options.onFormDisabled?.(disabled);
  }

  /** Re-reads value and validity on the next microtask (several changes usually come together). */
  sync(): void {
    if (this._queued) return;
    this._queued = true;
    queueMicrotask(() => {
      this._queued = false;
      this.syncNow();
    });
  }

  syncNow(): void {
    const internals = this.internals;
    if (!internals) return;
    try {
      const value = this.options.getValue();
      if (Array.isArray(value)) {
        const name = this.host.getAttribute('name') || '';
        const data = new FormData();
        if (name) value.forEach((entry) => data.append(name, entry));
        internals.setFormValue?.(value.length ? data : null);
      } else {
        internals.setFormValue?.(value);
      }

      if (typeof internals.setValidity !== 'function') return;
      const validity = this.options.getValidity?.() || {};
      const control = validity.control;
      if (control && control.validity && !control.validity.valid) {
        internals.setValidity(control.validity, control.validationMessage, control);
      } else if (!control && validity.valueMissing) {
        internals.setValidity(
          { valueMissing: true },
          validity.message || 'Please fill out this field.',
          validity.anchor || undefined
        );
      } else {
        internals.setValidity({});
      }
    } catch {
      // Environments without full form-associated support keep working without it.
    }
  }

  private _onUserChange(event: Event): void {
    // Only the element's own events count: a child's bubbling change is not this field changing.
    if (event.target !== this.host) return;
    this._dirty = true;
    this.sync();
  }
}

export function isRequired(host: HTMLElement): boolean {
  const value = host.getAttribute('required');
  return value != null && value !== 'false';
}
