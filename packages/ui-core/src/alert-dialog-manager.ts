import {
  UIAlertDialog,
  UIAlertDialogCloseDetail,
  UIAlertDialogConfirmDetail,
  UIAlertDialogTemplateOptions
} from './components/ui-alert-dialog';

export type AlertDialogMode = 'queue' | 'replace' | 'stack';
export type AlertDialogAction = 'confirm' | 'cancel' | 'dismiss';
export type AlertDialogDismissSource =
  | 'esc'
  | 'backdrop'
  | 'close-icon'
  | 'abort'
  | 'unmount'
  | 'replace'
  | 'programmatic';

export type AlertDialogBaseResult = {
  id: string;
  action: AlertDialogAction;
  checked?: boolean;
  source?: AlertDialogDismissSource;
  reason?: string;
};

export type AlertResult = AlertDialogBaseResult & {
  action: 'confirm' | 'dismiss';
  value?: unknown;
};

export type ConfirmResult = AlertDialogBaseResult & {
  action: 'confirm' | 'cancel' | 'dismiss';
  value?: unknown;
};

export type PromptResult = AlertDialogBaseResult & {
  action: 'confirm' | 'cancel' | 'dismiss';
  value?: string;
};

export type PromptInputOptions = {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  validate?: (value: string) => string | null;
};

export type AlertDialogCheckboxOptions = {
  enabled?: boolean;
  label?: string;
  defaultChecked?: boolean;
};

export type AlertDialogConfirmContext = {
  id: string;
  value?: string;
  checked?: boolean;
  dialog: UIAlertDialog;
  signal?: AbortSignal;
};

export type AlertDialogCancelContext = {
  id: string;
  value?: string;
  checked?: boolean;
  dialog: UIAlertDialog;
  signal?: AbortSignal;
};

export type AlertDialogDismissContext = {
  id: string;
  value?: string;
  checked?: boolean;
  dialog: UIAlertDialog;
  signal?: AbortSignal;
  source: AlertDialogDismissSource;
  reason?: string;
};

export type AlertDialogCommonOptions = {
  id?: string;
  mode?: AlertDialogMode;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  errorMessage?: string;
  dismissible?: boolean;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  lockWhileLoading?: boolean;
  role?: 'alertdialog' | 'dialog';
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  variant?: 'surface' | 'soft' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: string | number;
  elevation?: 'none' | 'low' | 'high';
  indicator?: 'line' | 'none';
  initialFocus?: string;
  checkbox?: AlertDialogCheckboxOptions;
  signal?: AbortSignal;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  headless?: boolean;
  onConfirm?: (ctx: AlertDialogConfirmContext) => void | Promise<void>;
  onCancel?: (ctx: AlertDialogCancelContext) => void | Promise<void>;
  onDismiss?: (ctx: AlertDialogDismissContext) => void | Promise<void>;
};

export type AlertDialogAlertOptions = AlertDialogCommonOptions;

export type AlertDialogConfirmOptions = AlertDialogCommonOptions;

export type AlertDialogPromptOptions = AlertDialogCommonOptions & {
  input?: PromptInputOptions;
};

type DialogKind = 'alert' | 'confirm' | 'prompt';

type AnyDialogOptions = AlertDialogAlertOptions | AlertDialogConfirmOptions | AlertDialogPromptOptions;

type AnyResult = AlertResult | ConfirmResult | PromptResult;

type Request<T extends AnyResult> = {
  id: string;
  kind: DialogKind;
  mode: AlertDialogMode;
  options: AnyDialogOptions;
  settled: boolean;
  processing: boolean;
  value?: string;
  checked?: boolean;
  dialog?: UIAlertDialog;
  resolve: (value: T) => void;
  cleanup: Array<() => void>;
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function toErrorMessage(error: unknown): string {
  if (!error) return 'Something went wrong. Please try again.';
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

function normalizeMode(mode?: AlertDialogMode): AlertDialogMode {
  if (mode === 'replace' || mode === 'stack') return mode;
  return 'queue';
}

function nextRequestId(seed: number): string {
  return `ui-alert-dialog-${seed}`;
}

function resultFromClose<T extends AnyResult>(
  request: Request<T>,
  detail: UIAlertDialogCloseDetail
): T {
  const action = request.kind === 'alert' && detail.action === 'cancel' ? 'dismiss' : detail.action;
  const checked = request.dialog?.getChecked();

  if (request.kind === 'prompt') {
    const value = request.dialog?.getInputValue() ?? request.value ?? '';
    return {
      id: request.id,
      action: action as T['action'],
      value,
      checked,
      source: detail.source as AlertDialogDismissSource | undefined,
      reason: detail.reason
    } as T;
  }

  return {
    id: request.id,
    action: action as T['action'],
    value: request.value,
    checked,
    source: detail.source as AlertDialogDismissSource | undefined,
    reason: detail.reason
  } as T;
}

function createDismissResult<T extends AnyResult>(
  request: Request<T>,
  source: AlertDialogDismissSource,
  reason?: string
): T {
  if (request.kind === 'prompt') {
    return {
      id: request.id,
      action: 'dismiss',
      value: request.dialog?.getInputValue() ?? request.value ?? '',
      checked: request.dialog?.getChecked(),
      source,
      reason
    } as T;
  }

  return {
    id: request.id,
    action: 'dismiss',
    value: request.value,
    checked: request.dialog?.getChecked(),
    source,
    reason
  } as T;
}

function normalizeDialogDismissSource(source?: AlertDialogDismissSource):
  | 'esc'
  | 'backdrop'
  | 'close-icon'
  | 'abort'
  | 'unmount'
  | 'replace'
  | 'programmatic' {
  if (
    source === 'esc' ||
    source === 'backdrop' ||
    source === 'close-icon' ||
    source === 'abort' ||
    source === 'unmount' ||
    source === 'replace' ||
    source === 'programmatic'
  ) {
    return source;
  }
  return 'abort';
}

export type AlertDialogManagerApi = {
  alert: (options?: AlertDialogAlertOptions) => Promise<AlertResult>;
  confirm: (options?: AlertDialogConfirmOptions) => Promise<ConfirmResult>;
  prompt: (options?: AlertDialogPromptOptions) => Promise<PromptResult>;
  destroy: (reason?: 'unmount' | 'abort' | 'programmatic') => void;
  setContainer: (container: HTMLElement | null) => void;
  setDefaults: (defaults: Partial<AlertDialogCommonOptions> | null) => void;
};

export class AlertDialogManager implements AlertDialogManagerApi {
  private _container: HTMLElement | null = null;
  private _ownsContainer = false;
  private _queue: Array<Request<any>> = [];
  private _active: Array<Request<any>> = [];
  private _disposed = false;
  private _seed = 0;
  private _defaults: Partial<AlertDialogCommonOptions> = {};

  constructor(container?: HTMLElement | null) {
    this._container = container ?? null;
  }

  setContainer(container: HTMLElement | null) {
    this._container = container;
    this._ownsContainer = false;
  }

  setDefaults(defaults: Partial<AlertDialogCommonOptions> | null) {
    this._defaults = defaults ? { ...defaults } : {};
  }

  alert(options: AlertDialogAlertOptions = {}): Promise<AlertResult> {
    return this._enqueue<AlertResult>('alert', options);
  }

  confirm(options: AlertDialogConfirmOptions = {}): Promise<ConfirmResult> {
    return this._enqueue<ConfirmResult>('confirm', options);
  }

  prompt(options: AlertDialogPromptOptions = {}): Promise<PromptResult> {
    return this._enqueue<PromptResult>('prompt', options);
  }

  destroy(reason: 'unmount' | 'abort' | 'programmatic' = 'unmount') {
    this._disposed = true;

    const pending = [...this._active, ...this._queue];
    this._queue = [];

    for (const request of pending) {
      this._settle(request, createDismissResult(request, reason), false);
    }

    this._active = [];

    if (this._ownsContainer && this._container && this._container.parentElement) {
      this._container.parentElement.removeChild(this._container);
    }
    this._container = null;
    this._ownsContainer = false;
  }

  private _enqueue<T extends AnyResult>(kind: DialogKind, options: AnyDialogOptions): Promise<T> {
    const mergedOptions = this._mergeOptions(options);
    if (!isBrowser() || this._disposed) {
      const immediate = {
        id: mergedOptions.id || nextRequestId(++this._seed),
        action: 'dismiss',
        source: 'unmount'
      } as T;
      return Promise.resolve(immediate);
    }

    const id = mergedOptions.id || nextRequestId(++this._seed);
    const mode = normalizeMode(mergedOptions.mode);

    return new Promise<T>((resolve) => {
      const request: Request<T> = {
        id,
        kind,
        mode,
        options: mergedOptions,
        settled: false,
        processing: false,
        resolve,
        cleanup: []
      };

      if (mergedOptions.signal?.aborted) {
        this._settle(request, createDismissResult(request, 'abort'), false);
        return;
      }

      if (mode === 'replace') {
        const current = this._active[this._active.length - 1];
        if (current) {
          this._settle(current, createDismissResult(current, 'replace', 'replace'), false, false);
        }
        this._open(request);
        return;
      }

      if (mode === 'stack') {
        this._open(request);
        return;
      }

      if (this._active.length > 0) {
        this._queue.push(request);
        return;
      }

      this._open(request);
    });
  }

  private _open<T extends AnyResult>(request: Request<T>) {
    const container = this._ensureContainer();
    if (!container) {
      this._settle(request, createDismissResult(request, 'unmount'), false);
      return;
    }

    const dialog = document.createElement('ui-alert-dialog') as UIAlertDialog;
    request.dialog = dialog;
    request.checked = Boolean(request.options.checkbox?.defaultChecked);

    const config = this._buildConfig(request);
    dialog.dialogId = request.id;
    dialog.config = config;

    const onConfirm = (event: Event) => {
      if (request.settled) return;

      const detail = (event as CustomEvent<UIAlertDialogConfirmDetail>).detail;
      request.value = detail?.inputValue;
      request.checked = detail?.checked;

      const validationError = this._validatePrompt(request);
      if (validationError) {
        event.preventDefault();
        dialog.setError(validationError);
        return;
      }

      if (!request.options.onConfirm) {
        dialog.clearError();
        return;
      }

      event.preventDefault();
      request.processing = true;
      dialog.state = 'loading';
      dialog.clearError();

      Promise.resolve(
        request.options.onConfirm({
          id: request.id,
          value: request.value,
          checked: request.checked,
          dialog,
          signal: request.options.signal
        })
      )
        .then(() => {
          request.processing = false;
          dialog.state = 'idle';
          dialog.clearError();
          if (!request.settled) dialog.close('confirm');
        })
        .catch((error: unknown) => {
          request.processing = false;
          dialog.state = 'error';
          dialog.setError(toErrorMessage(error));
        });
    };

    const onChange = () => {
      if (request.settled) return;
      request.value = dialog.getInputValue();
      request.checked = dialog.getChecked();

      if (dialog.state === 'error') {
        dialog.clearError();
      }
    };

    const onClose = (event: Event) => {
      if (request.settled) return;
      const detail = (event as CustomEvent<UIAlertDialogCloseDetail>).detail;
      this._handleClose(request, detail);
    };

    dialog.addEventListener('ui-confirm', onConfirm as EventListener);
    dialog.addEventListener('ui-change', onChange as EventListener);
    dialog.addEventListener('ui-close', onClose as EventListener);

    request.cleanup.push(() => dialog.removeEventListener('ui-confirm', onConfirm as EventListener));
    request.cleanup.push(() => dialog.removeEventListener('ui-change', onChange as EventListener));
    request.cleanup.push(() => dialog.removeEventListener('ui-close', onClose as EventListener));

    if (request.options.signal) {
      const abortHandler = () => {
        if (request.settled) return;
        this._settle(request, createDismissResult(request, 'abort'), false);
      };
      request.options.signal.addEventListener('abort', abortHandler, { once: true });
      request.cleanup.push(() => request.options.signal?.removeEventListener('abort', abortHandler));
    }

    this._active.push(request);
    container.appendChild(dialog);
    dialog.open = true;
    this._updateStackZIndex();
  }

  private _validatePrompt<T extends AnyResult>(request: Request<T>): string | null {
    if (request.kind !== 'prompt') return null;

    const options = request.options as AlertDialogPromptOptions;
    const inputOptions = options.input;
    const value = request.dialog?.getInputValue() ?? request.value ?? '';

    if (inputOptions?.required && !value.trim()) {
      return 'Please enter a value.';
    }

    if (inputOptions?.validate) {
      return inputOptions.validate(value);
    }

    return null;
  }

  private _settle<T extends AnyResult>(
    request: Request<T>,
    result: T,
    fromDialogEvent: boolean,
    allowQueueDrain = true
  ) {
    if (request.settled) return;
    request.settled = true;

    this._cleanupRequest(request);

    this._active = this._active.filter((item) => item !== request);
    this._queue = this._queue.filter((item) => item !== request);

    if (request.dialog) {
      const dialog = request.dialog;
      if (!fromDialogEvent && dialog.open) {
        const dismissSource = normalizeDialogDismissSource(result.source);
        dialog.close('dismiss', dismissSource, result.reason);
      }
      if (dialog.parentElement) {
        dialog.parentElement.removeChild(dialog);
      }
    }

    request.resolve(result);

    this._updateStackZIndex();

    if (!this._disposed && allowQueueDrain) {
      this._drainQueue();
    }
  }

  private _cleanupRequest(request: Request<any>) {
    for (const cleanup of request.cleanup.splice(0)) {
      try {
        cleanup();
      } catch {
        // noop
      }
    }
  }

  private _drainQueue() {
    if (this._active.length > 0) return;
    const next = this._queue.shift();
    if (!next) return;
    this._open(next);
  }

  private _buildConfig<T extends AnyResult>(request: Request<T>): UIAlertDialogTemplateOptions {
    const options = request.options;
    const isPrompt = request.kind === 'prompt';
    const isAlert = request.kind === 'alert';

    const promptOptions = isPrompt ? (options as AlertDialogPromptOptions).input : undefined;

    return {
      id: request.id,
      title: options.title,
      description: options.description,
      confirmText: options.confirmText || (isAlert ? 'OK' : 'Confirm'),
      cancelText: options.cancelText || 'Cancel',
      loadingText: options.loadingText,
      errorMessage: options.errorMessage,
      dismissible: options.dismissible ?? true,
      closeOnEsc: options.closeOnEsc,
      closeOnBackdrop: options.closeOnBackdrop,
      lockWhileLoading: options.lockWhileLoading ?? true,
      role: options.role || 'alertdialog',
      tone: options.tone || (isAlert ? 'info' : isPrompt ? 'neutral' : 'warning'),
      size: options.size || 'md',
      variant: options.variant || 'surface',
      radius: options.radius,
      elevation: options.elevation || 'low',
      indicator: options.indicator || 'line',
      initialFocus: options.initialFocus,
      ariaLabel: options.ariaLabel,
      ariaLabelledby: options.ariaLabelledby,
      ariaDescribedby: options.ariaDescribedby,
      headless: options.headless,
      showCancel: !isAlert,
      showClose: options.dismissible ?? true,
      input: {
        enabled: isPrompt,
        label: promptOptions?.label,
        placeholder: promptOptions?.placeholder,
        value: promptOptions?.defaultValue || '',
        required: promptOptions?.required
      },
      checkbox: {
        enabled: Boolean(options.checkbox?.enabled),
        label: options.checkbox?.label,
        checked: options.checkbox?.defaultChecked
      }
    };
  }

  private _buildLifecycleContext<T extends AnyResult>(request: Request<T>) {
    return {
      id: request.id,
      value: request.dialog?.getInputValue() ?? request.value,
      checked: request.dialog?.getChecked() ?? request.checked,
      dialog: request.dialog as UIAlertDialog,
      signal: request.options.signal
    };
  }

  private _handleClose<T extends AnyResult>(request: Request<T>, detail: UIAlertDialogCloseDetail) {
    const result = resultFromClose(request, detail);

    if (detail.action === 'cancel' && request.options.onCancel) {
      Promise.resolve(request.options.onCancel(this._buildLifecycleContext(request)))
        .finally(() => {
          this._settle(request, result, true);
        });
      return;
    }

    if (detail.action === 'dismiss' && request.options.onDismiss) {
      Promise.resolve(
        request.options.onDismiss({
          ...this._buildLifecycleContext(request),
          source: (detail.source || 'programmatic') as AlertDialogDismissSource,
          reason: detail.reason
        })
      ).finally(() => {
        this._settle(request, result, true);
      });
      return;
    }

    this._settle(request, result, true);
  }

  private _mergeOptions<T extends AnyDialogOptions>(options: T): T {
    const defaults = this._defaults;
    return {
      ...defaults,
      ...options,
      checkbox: {
        ...(defaults.checkbox || {}),
        ...(options.checkbox || {})
      }
    } as T;
  }

  private _ensureContainer(): HTMLElement | null {
    if (!isBrowser()) return null;
    if (this._container && this._container.isConnected) return this._container;

    let container = document.querySelector<HTMLElement>('[data-ui-alert-dialog-host="true"]');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('data-ui-alert-dialog-host', 'true');
      container.style.position = 'relative';
      container.style.zIndex = '1000';
      document.body.appendChild(container);
      this._ownsContainer = true;
    } else {
      this._ownsContainer = false;
    }

    this._container = container;
    return container;
  }

  private _updateStackZIndex() {
    for (let index = 0; index < this._active.length; index += 1) {
      const request = this._active[index];
      if (!request.dialog) continue;
      request.dialog.style.setProperty('--ui-alert-backdrop-z', String(1000 + index * 2));
      request.dialog.style.setProperty('--ui-alert-z', String(1001 + index * 2));
    }
  }
}

let sharedManager: AlertDialogManager | null = null;

export function createAlertDialogManager(options: { container?: HTMLElement | null } = {}): AlertDialogManager {
  return new AlertDialogManager(options.container ?? null);
}

function getSharedManager() {
  if (!sharedManager) {
    sharedManager = createAlertDialogManager();
  }
  return sharedManager;
}

export function alert(options: AlertDialogAlertOptions = {}): Promise<AlertResult> {
  return getSharedManager().alert(options);
}

export function confirm(options: AlertDialogConfirmOptions = {}): Promise<ConfirmResult> {
  return getSharedManager().confirm(options);
}

export function prompt(options: AlertDialogPromptOptions = {}): Promise<PromptResult> {
  return getSharedManager().prompt(options);
}

export function dismissAllAlertDialogs(reason: 'unmount' | 'abort' | 'programmatic' = 'programmatic') {
  if (!sharedManager) return;
  sharedManager.destroy(reason);
  sharedManager = null;
}
