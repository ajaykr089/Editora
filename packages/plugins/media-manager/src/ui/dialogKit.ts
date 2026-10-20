import { initDialogOverlay } from '../../../shared/dialogHelpers';
import { DARK_THEME_SELECTOR, injectMediaDialogStyles } from './styles';

/** Closes on Escape, ahead of anything else listening. Returns the function that stops listening. */
export const attachEscapeCloseHandler = (overlay: HTMLElement, closeDialog: () => void): (() => void) => {
  const onEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape' || !overlay.isConnected) return;
    event.preventDefault();
    event.stopPropagation();
    closeDialog();
  };

  document.addEventListener('keydown', onEscape, true);
  return () => {
    document.removeEventListener('keydown', onEscape, true);
  };
};

const getSelectionEditor = (): HTMLElement | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const anchor = selection.anchorNode;
  const anchorElement = anchor instanceof HTMLElement ? anchor : anchor?.parentElement;
  return (anchorElement?.closest('.rte-content, .editora-content') as HTMLElement | null) || null;
};

/** The editor a dialog belongs to: the one it was opened from, else the one holding the selection or the focus. */
export const resolveDialogContext = (contextElement?: HTMLElement | null): HTMLElement | null => {
  if (contextElement) return contextElement;
  const fromSelection = getSelectionEditor();
  if (fromSelection) return fromSelection;
  const active = document.activeElement as HTMLElement | null;
  if (!active) return null;
  return (active.closest('.rte-content, .editora-content') as HTMLElement | null) || active;
};

export const isDarkThemeContext = (contextElement?: HTMLElement | null): boolean => {
  const source = resolveDialogContext(contextElement);
  if (!source) return false;
  return Boolean(source.closest(DARK_THEME_SELECTOR));
};

export const createDialogOverlay = (contextElement?: HTMLElement | null): HTMLDivElement => {
  injectMediaDialogStyles();
  const overlay = document.createElement('div');
  initDialogOverlay(overlay);
  overlay.className = 'rte-media-overlay';
  if (isDarkThemeContext(contextElement)) {
    overlay.classList.add('rte-ui-theme-dark');
  }
  return overlay;
};

/** After a re-render the tab that was clicked is a new element: keep keyboard focus on the tab that is now active. */
export const focusActiveTab = (dialog: HTMLElement, tab: 'upload' | 'url') => {
  dialog.querySelector<HTMLElement>(tab === 'upload' ? '.tab-upload' : '.tab-url')?.focus();
};

/** The dropzone opens the file chooser on click; Enter and Space do the same for someone without a pointer. */
export const makeDropzoneKeyboardAccessible = (dropzone: HTMLElement | null, fileInput: HTMLInputElement | null) => {
  dropzone?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput?.click();
    }
  });
};

export const createDialogShell = (compact = false): HTMLDivElement => {
  const dialog = document.createElement('div');
  dialog.className = compact ? 'rte-media-dialog rte-media-dialog-compact' : 'rte-media-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  return dialog;
};
