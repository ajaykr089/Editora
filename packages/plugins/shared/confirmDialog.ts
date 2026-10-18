import { escapeHtml } from './escapeHtml';
import { initDialogOverlay } from './dialogHelpers';

/**
 * An accessible stand-in for `confirm()` and `prompt()`.
 *
 * The browser's own versions freeze the page, cannot be styled or translated by the host, are announced
 * inconsistently, and are silenced in some embedded contexts (a sandboxed frame, a webview), where `confirm()` just
 * answers "no" and the action it guarded never happens. These are in-page dialogs: a named alert dialog or dialog,
 * focus on the safe choice, Tab kept inside, Escape or the backdrop to decline, and the focus returned to where it was.
 */

export interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  /** The action destroys something: the confirm button is red, and Cancel has the focus. */
  danger?: boolean;
  /** An element in the editor the question is about, used to match its dark theme. */
  context?: Element | null;
}

export interface PromptOptions extends ConfirmOptions {
  /** What the field is for; the question itself is the label when this is left out. */
  label?: string;
  initialValue?: string;
  inputMode?: 'text' | 'numeric';
  placeholder?: string;
  /** Returns a message when the value is not acceptable, or null when it is. */
  validate?: (value: string) => string | null;
}

const STYLE_ID = 'rte-confirm-styles';
const DARK_THEME = '[data-theme="dark"], .dark, .editora-theme-dark';
let sequence = 0;

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .rte-confirm-overlay {
      position: fixed; inset: 0; z-index: 100002; display: flex; align-items: center; justify-content: center;
      padding: 16px; background: rgba(15, 23, 36, 0.56);
      --rte-confirm-bg: #ffffff; --rte-confirm-text: #101828; --rte-confirm-muted: #5f6b7d; --rte-confirm-border: #d6dbe4;
      --rte-confirm-accent: #1f75fe; --rte-confirm-danger: #c62828;
    }
    .rte-confirm-overlay.rte-confirm-dark {
      --rte-confirm-bg: #1f2937; --rte-confirm-text: #e5e7eb; --rte-confirm-muted: #9ca3af; --rte-confirm-border: #3b4657;
      --rte-confirm-accent: #3b82f6; --rte-confirm-danger: #ef4444;
    }
    .rte-confirm-dialog {
      box-sizing: border-box; width: min(100%, 420px); padding: 20px; border-radius: 10px;
      background: var(--rte-confirm-bg); color: var(--rte-confirm-text); border: 1px solid var(--rte-confirm-border);
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35); font-size: 14px; line-height: 1.45;
    }
    .rte-confirm-title { margin: 0 0 8px; font-size: 16px; font-weight: 600; }
    .rte-confirm-message { margin: 0 0 14px; color: var(--rte-confirm-muted); }
    .rte-confirm-field { display: block; margin: 0 0 6px; }
    .rte-confirm-input {
      box-sizing: border-box; width: 100%; padding: 8px 10px; border-radius: 6px; font: inherit;
      border: 1px solid var(--rte-confirm-border); background: transparent; color: inherit;
    }
    .rte-confirm-input[aria-invalid="true"] { border-color: var(--rte-confirm-danger); }
    .rte-confirm-error { margin: 6px 0 0; color: var(--rte-confirm-danger); font-size: 13px; }
    .rte-confirm-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
    .rte-confirm-button {
      padding: 8px 14px; border-radius: 6px; font: inherit; cursor: pointer;
      border: 1px solid var(--rte-confirm-border); background: transparent; color: inherit;
    }
    .rte-confirm-button.primary { background: var(--rte-confirm-accent); border-color: var(--rte-confirm-accent); color: #fff; }
    .rte-confirm-button.danger { background: var(--rte-confirm-danger); border-color: var(--rte-confirm-danger); color: #fff; }
    .rte-confirm-button:focus-visible, .rte-confirm-input:focus-visible { outline: 2px solid var(--rte-confirm-accent); outline-offset: 2px; }
  `;
  document.head.appendChild(style);
}

interface Built {
  overlay: HTMLElement;
  confirmButton: HTMLButtonElement;
  cancelButton: HTMLButtonElement;
  input: HTMLInputElement | null;
  error: HTMLElement | null;
}

function build(message: string, options: ConfirmOptions, prompt: PromptOptions | null): Built {
  injectStyles();
  const id = `rte-confirm-${++sequence}`;
  const overlay = document.createElement('div');
  initDialogOverlay(overlay);
  overlay.className = 'rte-confirm-overlay';
  const opener = options.context ?? (document.activeElement instanceof Element ? document.activeElement : null);
  if (opener?.closest(DARK_THEME)) overlay.classList.add('rte-confirm-dark');

  const title = options.title ?? (prompt ? 'Enter a value' : 'Please confirm');
  const confirmText = options.confirmText ?? (prompt ? 'OK' : 'Confirm');
  const cancelText = options.cancelText ?? 'Cancel';
  const danger = options.danger === true;

  const dialog = document.createElement('div');
  dialog.className = 'rte-confirm-dialog';
  // A question that needs an answer is an alert dialog; a form is a plain dialog.
  dialog.setAttribute('role', prompt ? 'dialog' : 'alertdialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', `${id}-title`);
  dialog.setAttribute('aria-describedby', `${id}-message`);
  // Cancel comes first: it is the choice that does no harm, and the one the focus starts on.
  dialog.innerHTML = `
    <h2 class="rte-confirm-title" id="${id}-title">${escapeHtml(title)}</h2>
    <p class="rte-confirm-message" id="${id}-message">${escapeHtml(message)}</p>
    ${
      prompt
        ? `<label class="rte-confirm-field" for="${id}-input">${escapeHtml(prompt.label ?? message)}</label>
           <input class="rte-confirm-input" id="${id}-input" type="text" inputmode="${prompt.inputMode ?? 'text'}"
             autocomplete="off" value="${escapeHtml(prompt.initialValue ?? '')}" placeholder="${escapeHtml(prompt.placeholder ?? '')}"
             aria-describedby="${id}-error">
           <p class="rte-confirm-error" id="${id}-error" role="alert" hidden></p>`
        : ''
    }
    <div class="rte-confirm-actions">
      <button type="button" class="rte-confirm-button" data-action="cancel">${escapeHtml(cancelText)}</button>
      <button type="button" class="rte-confirm-button ${danger ? 'danger' : 'primary'}" data-action="confirm">${escapeHtml(confirmText)}</button>
    </div>
  `;
  overlay.appendChild(dialog);

  return {
    overlay,
    confirmButton: dialog.querySelector('[data-action="confirm"]') as HTMLButtonElement,
    cancelButton: dialog.querySelector('[data-action="cancel"]') as HTMLButtonElement,
    input: dialog.querySelector('input'),
    error: dialog.querySelector('.rte-confirm-error'),
  };
}

function show<T>(built: Built, decide: (confirmed: boolean) => T | undefined): Promise<T> {
  return new Promise<T>((resolve) => {
    const { overlay, confirmButton, cancelButton } = built;
    let settled = false;

    const finish = (confirmed: boolean) => {
      const value = decide(confirmed);
      // A value that fails validation leaves the dialog open (decide returns undefined).
      if (value === undefined) return;
      if (settled) return;
      settled = true;
      window.removeEventListener('keydown', onKey, true);
      overlay.remove();
      resolve(value);
    };

    // On window, in the capture phase: this runs before the document-level Escape handlers of a dialog this one may
    // have been opened over, which would otherwise close that dialog as well.
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !overlay.isConnected) return;
      event.preventDefault();
      event.stopPropagation();
      finish(false);
    };
    window.addEventListener('keydown', onKey, true);

    cancelButton.addEventListener('click', () => finish(false));
    confirmButton.addEventListener('click', () => finish(true));
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) finish(false);
    });
    built.input?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        finish(true);
      }
    });

    document.body.appendChild(overlay);
  });
}

/** Asks a yes/no question. Resolves true to go ahead, false on Cancel, Escape or a click outside. */
export function confirmAction(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  const built = build(message, options, null);
  return show<boolean>(built, (confirmed) => confirmed);
}

/** Asks for a value. Resolves with what was entered, or null on Cancel, Escape or a click outside. */
export function promptText(message: string, options: PromptOptions = {}): Promise<string | null> {
  const built = build(message, options, options);
  const { input, error } = built;

  const promise = show<string | null>(built, (confirmed) => {
    if (!confirmed) return null;
    const value = input?.value ?? '';
    const problem = options.validate ? options.validate(value) : null;
    if (problem) {
      if (error) {
        error.textContent = problem;
        error.hidden = false;
      }
      input?.setAttribute('aria-invalid', 'true');
      input?.focus();
      input?.select();
      return undefined;
    }
    return value;
  });

  // The field is where someone wants to start typing, not the Cancel button.
  window.setTimeout(() => {
    if (input?.isConnected) {
      input.focus();
      input.select();
    }
  }, 10);
  return promise;
}
