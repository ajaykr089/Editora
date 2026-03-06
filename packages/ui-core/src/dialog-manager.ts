import {
  UIDialog,
  UIDialogCloseDetail,
  UIDialogSubmitDetail,
  UIDialogTemplateOptions
} from './components/ui-dialog';

export type DialogMode = 'queue' | 'replace' | 'stack';
export type DialogAction = 'submit' | 'cancel' | 'dismiss';
export type DialogDismissSource = 'overlay' | 'esc' | 'close-icon' | 'abort' | 'unmount' | 'replace' | 'programmatic';

export type DialogResult = {
  id: string;
  action: DialogAction;
  source?: DialogDismissSource;
  reason?: string;
  formData?: Record<string, string | string[]>;
};

export type DialogSubmitContext = {
  id: string;
  dialog: UIDialog;
  signal?: AbortSignal;
  formData?: Record<string, string | string[]>;
};

export type DialogOptions = {
  id?: string;
  mode?: DialogMode;
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  loadingText?: string;
  errorMessage?: string;
  dismissible?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  lockWhileLoading?: boolean;
  role?: 'dialog' | 'alertdialog';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  initialFocus?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  headless?: boolean;
  showCancel?: boolean;
  showClose?: boolean;
  signal?: AbortSignal;
  onSubmit?: (ctx: DialogSubmitContext) => void | Promise<void>;
};

type Request = {
  id: string;
  mode: DialogMode;
  options: DialogOptions;
  settled: boolean;
  dialog?: UIDialog;
  resultFormData?: Record<string, string | string[]>;
  resolve: (value: DialogResult) => void;
  cleanup: Array<() => void>;
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function normalizeMode(mode?: DialogMode): DialogMode {
  if (mode === 'replace' || mode === 'stack') return mode;
  return 'queue';
}

function nextRequestId(seed: number): string {
  return `ui-dialog-${seed}`;
}

function toErrorMessage(error: unknown): string {
  if (!error) return 'Something went wrong. Please try again.';
  if (typeof error === 'string') return error;
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}

export type DialogManagerApi = {
  open: (options?: DialogOptions) => Promise<DialogResult>;
  confirm: (options?: DialogOptions) => Promise<DialogResult>;
  destroy: (reason?: 'unmount' | 'abort' | 'programmatic') => void;
  setContainer: (container: HTMLElement | null) => void;
};

export class DialogManager implements DialogManagerApi {
  private _container: HTMLElement | null = null;
  private _ownsContainer = false;
  private _queue: Request[] = [];
  private _active: Request[] = [];
  private _disposed = false;
  private _seed = 0;

  constructor(container?: HTMLElement | null) {
    this._container = container ?? null;
  }

  setContainer(container: HTMLElement | null) {
    this._container = container;
    this._ownsContainer = false;
  }

  open(options: DialogOptions = {}): Promise<DialogResult> {
    return this._enqueue(options);
  }

  confirm(options: DialogOptions = {}): Promise<DialogResult> {
    return this._enqueue({ ...options, showCancel: options.showCancel ?? true });
  }

  destroy(reason: 'unmount' | 'abort' | 'programmatic' = 'unmount') {
    this._disposed = true;

    const pending = [...this._active, ...this._queue];
    this._queue = [];

    for (const request of pending) {
      this._settle(request, {
        id: request.id,
        action: 'dismiss',
        source: reason,
        reason
      }, false);
    }

    this._active = [];

    if (this._ownsContainer && this._container && this._container.parentElement) {
      this._container.parentElement.removeChild(this._container);
    }

    this._container = null;
    this._ownsContainer = false;
  }

  private _enqueue(options: DialogOptions): Promise<DialogResult> {
    if (!isBrowser() || this._disposed) {
      return Promise.resolve({
        id: options.id || nextRequestId(++this._seed),
        action: 'dismiss',
        source: 'unmount'
      });
    }

    const id = options.id || nextRequestId(++this._seed);
    const mode = normalizeMode(options.mode);

    return new Promise<DialogResult>((resolve) => {
      const request: Request = {
        id,
        mode,
        options,
        settled: false,
        resolve,
        cleanup: []
      };

      if (options.signal?.aborted) {
        this._settle(request, { id, action: 'dismiss', source: 'abort' }, false);
        return;
      }

      if (mode === 'replace') {
        const current = this._active[this._active.length - 1];
        if (current) {
          this._settle(current, { id: current.id, action: 'dismiss', source: 'replace', reason: 'replace' }, false, false);
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

  private _open(request: Request) {
    const container = this._ensureContainer();
    if (!container) {
      this._settle(request, {
        id: request.id,
        action: 'dismiss',
        source: 'unmount'
      }, false);
      return;
    }

    const dialog = document.createElement('ui-dialog') as UIDialog;
    request.dialog = dialog;

    const config = this._buildConfig(request.options, request.id);
    dialog.dialogId = request.id;
    dialog.config = config;

    const onSubmit = (event: Event) => {
      if (request.settled) return;
      const detail = (event as CustomEvent<UIDialogSubmitDetail>).detail;
      request.resultFormData = detail?.formData;

      if (!request.options.onSubmit) {
        dialog.clearError();
        return;
      }

      event.preventDefault();
      dialog.state = 'loading';
      dialog.clearError();

      Promise.resolve(
        request.options.onSubmit({
          id: request.id,
          dialog,
          signal: request.options.signal,
          formData: detail?.formData
        })
      )
        .then(() => {
          if (request.settled) return;
          dialog.state = 'idle';
          dialog.clearError();
          dialog.close('submit');
        })
        .catch((error: unknown) => {
          dialog.state = 'error';
          dialog.setError(toErrorMessage(error));
        });
    };

    const onClose = (event: Event) => {
      if (request.settled) return;
      const detail = (event as CustomEvent<UIDialogCloseDetail>).detail;
      this._settle(request, {
        id: request.id,
        action: detail.action,
        source: detail.source,
        reason: detail.reason,
        formData: request.resultFormData
      }, true);
    };

    dialog.addEventListener('ui-submit', onSubmit as EventListener);
    dialog.addEventListener('ui-close', onClose as EventListener);

    request.cleanup.push(() => dialog.removeEventListener('ui-submit', onSubmit as EventListener));
    request.cleanup.push(() => dialog.removeEventListener('ui-close', onClose as EventListener));

    if (request.options.signal) {
      const abortHandler = () => {
        if (request.settled) return;
        this._settle(request, {
          id: request.id,
          action: 'dismiss',
          source: 'abort'
        }, false);
      };
      request.options.signal.addEventListener('abort', abortHandler, { once: true });
      request.cleanup.push(() => request.options.signal?.removeEventListener('abort', abortHandler));
    }

    this._active.push(request);
    container.appendChild(dialog);
    dialog.openDialog();
    this._updateStackZIndex();
  }

  private _settle(request: Request, result: DialogResult, fromDialogEvent: boolean, allowQueueDrain = true) {
    if (request.settled) return;
    request.settled = true;

    this._cleanupRequest(request);

    this._active = this._active.filter((item) => item !== request);
    this._queue = this._queue.filter((item) => item !== request);

    if (request.dialog) {
      const dialog = request.dialog;
      if (!fromDialogEvent && dialog.open) {
        dialog.close('dismiss', result.source || 'abort', result.reason);
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

  private _cleanupRequest(request: Request) {
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

  private _buildConfig(options: DialogOptions, id: string): UIDialogTemplateOptions {
    return {
      id,
      title: options.title,
      description: options.description,
      submitText: options.submitText || 'Submit',
      cancelText: options.cancelText || 'Cancel',
      loadingText: options.loadingText,
      errorMessage: options.errorMessage,
      dismissible: options.dismissible ?? true,
      closeOnOverlay: options.closeOnOverlay,
      closeOnEsc: options.closeOnEsc,
      lockWhileLoading: options.lockWhileLoading ?? true,
      role: options.role || 'dialog',
      size: options.size || 'md',
      initialFocus: options.initialFocus,
      ariaLabel: options.ariaLabel,
      ariaLabelledby: options.ariaLabelledby,
      ariaDescribedby: options.ariaDescribedby,
      headless: options.headless,
      showCancel: options.showCancel ?? true,
      showClose: options.showClose ?? (options.dismissible ?? true)
    };
  }

  private _ensureContainer(): HTMLElement | null {
    if (!isBrowser()) return null;
    if (this._container && this._container.isConnected) return this._container;

    let container = document.querySelector<HTMLElement>('[data-ui-dialog-host="true"]');
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('data-ui-dialog-host', 'true');
      container.style.position = 'relative';
      container.style.zIndex = '1200';
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
      request.dialog.style.setProperty('--ui-dialog-backdrop-z', String(1200 + index * 2));
      request.dialog.style.setProperty('--ui-dialog-z', String(1201 + index * 2));
    }
  }
}

let sharedManager: DialogManager | null = null;

export function createDialogManager(options: { container?: HTMLElement | null } = {}): DialogManager {
  return new DialogManager(options.container ?? null);
}

function getSharedManager() {
  if (!sharedManager) {
    sharedManager = createDialogManager();
  }
  return sharedManager;
}

export function showDialog(options: DialogOptions = {}): Promise<DialogResult> {
  return getSharedManager().open(options);
}

export function confirmDialog(options: DialogOptions = {}): Promise<DialogResult> {
  return getSharedManager().confirm(options);
}

export function dismissAllDialogs(reason: 'unmount' | 'abort' | 'programmatic' = 'programmatic') {
  if (!sharedManager) return;
  sharedManager.destroy(reason);
  sharedManager = null;
}
