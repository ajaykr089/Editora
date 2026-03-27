import React, { useEffect, useRef } from 'react';
import {
  UIDialogCancelDetail,
  UIDialogCloseDetail,
  UIDialogDismissDetail,
  UIDialogOpenDetail,
  UIDialogRequestCloseReason,
  UIDialogSubmitDetail,
  UIDialogTemplateOptions
} from '@editora/ui-core';

export type DialogRequestCloseDetail = {
  reason: UIDialogRequestCloseReason;
};

export type DialogElement = HTMLElement & {
  open: boolean;
  openDialog: () => void;
  closeDialog: (reason?: UIDialogRequestCloseReason) => void;
  config?: UIDialogTemplateOptions;
};

export type DialogProps = Omit<React.HTMLAttributes<HTMLElement>, 'onOpen' | 'onClose'> & {
  children?: React.ReactNode;
  open?: boolean;
  title?: string;
  description?: string;
  closable?: boolean;
  dismissible?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  lockWhileLoading?: boolean;
  roleType?: 'dialog' | 'alertdialog';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  state?: 'idle' | 'loading' | 'error' | 'success';
  initialFocus?: string;
  submitText?: string;
  cancelText?: string;
  loadingText?: string;
  dialogId?: string;
  config?: UIDialogTemplateOptions;
  headless?: boolean;

  onOpen?: () => void;
  onClose?: () => void;
  onRequestClose?: (detail: DialogRequestCloseDetail) => void;

  onDialogOpen?: (detail: UIDialogOpenDetail) => void;
  onDialogSubmit?: (detail: UIDialogSubmitDetail) => void;
  onDialogCancel?: (detail: UIDialogCancelDetail) => void;
  onDialogDismiss?: (detail: UIDialogDismissDetail) => void;
  onDialogClose?: (detail: UIDialogCloseDetail) => void;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export const Dialog = React.forwardRef<DialogElement, DialogProps>(function Dialog(props, forwardedRef) {
  const {
    open,
    title,
    description,
    closable,
    dismissible,
    closeOnOverlay,
    closeOnEsc,
    lockWhileLoading,
    roleType,
    size,
    state,
    initialFocus,
    submitText,
    cancelText,
    loadingText,
    dialogId,
    config,
    headless,
    onOpen,
    onClose,
    onRequestClose,
    onDialogOpen,
    onDialogSubmit,
    onDialogCancel,
    onDialogDismiss,
    onDialogClose,
    children,
    ...rest
  } = props;

  const ref = useRef<DialogElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as DialogElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const openHandler = () => onOpen?.();
    const closeHandler = () => onClose?.();
    const requestCloseHandler = (event: Event) => {
      const detail = (event as CustomEvent<DialogRequestCloseDetail>).detail;
      if (detail) onRequestClose?.(detail);
    };

    const dialogOpenHandler = (event: Event) => onDialogOpen?.((event as CustomEvent<UIDialogOpenDetail>).detail);
    const dialogSubmitHandler = (event: Event) => onDialogSubmit?.((event as CustomEvent<UIDialogSubmitDetail>).detail);
    const dialogCancelHandler = (event: Event) => onDialogCancel?.((event as CustomEvent<UIDialogCancelDetail>).detail);
    const dialogDismissHandler = (event: Event) => onDialogDismiss?.((event as CustomEvent<UIDialogDismissDetail>).detail);
    const dialogCloseHandler = (event: Event) => onDialogClose?.((event as CustomEvent<UIDialogCloseDetail>).detail);

    el.addEventListener('open', openHandler as EventListener);
    el.addEventListener('close', closeHandler as EventListener);
    el.addEventListener('request-close', requestCloseHandler as EventListener);

    el.addEventListener('ui-open', dialogOpenHandler as EventListener);
    el.addEventListener('ui-submit', dialogSubmitHandler as EventListener);
    el.addEventListener('ui-cancel', dialogCancelHandler as EventListener);
    el.addEventListener('ui-dismiss', dialogDismissHandler as EventListener);
    el.addEventListener('ui-close', dialogCloseHandler as EventListener);

    return () => {
      el.removeEventListener('open', openHandler as EventListener);
      el.removeEventListener('close', closeHandler as EventListener);
      el.removeEventListener('request-close', requestCloseHandler as EventListener);

      el.removeEventListener('ui-open', dialogOpenHandler as EventListener);
      el.removeEventListener('ui-submit', dialogSubmitHandler as EventListener);
      el.removeEventListener('ui-cancel', dialogCancelHandler as EventListener);
      el.removeEventListener('ui-dismiss', dialogDismissHandler as EventListener);
      el.removeEventListener('ui-close', dialogCloseHandler as EventListener);
    };
  }, [onOpen, onClose, onRequestClose, onDialogOpen, onDialogSubmit, onDialogCancel, onDialogDismiss, onDialogClose]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof open === 'boolean') {
      if (open) el.setAttribute('open', '');
      else el.removeAttribute('open');
    }

    if (title) el.setAttribute('title', title);
    else el.removeAttribute('title');

    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');

    const resolvedDismissible = typeof dismissible === 'boolean' ? dismissible : closable;
    if (typeof resolvedDismissible === 'boolean') {
      el.setAttribute('dismissible', String(resolvedDismissible));
      el.setAttribute('closable', String(resolvedDismissible));
    } else {
      el.removeAttribute('dismissible');
      el.removeAttribute('closable');
    }

    if (typeof closeOnOverlay === 'boolean') {
      el.setAttribute('close-on-overlay', String(closeOnOverlay));
      el.setAttribute('close-on-backdrop', String(closeOnOverlay));
    } else {
      el.removeAttribute('close-on-overlay');
      el.removeAttribute('close-on-backdrop');
    }

    if (typeof closeOnEsc === 'boolean') el.setAttribute('close-on-esc', String(closeOnEsc));
    else el.removeAttribute('close-on-esc');

    if (typeof lockWhileLoading === 'boolean') el.setAttribute('lock-while-loading', String(lockWhileLoading));
    else el.removeAttribute('lock-while-loading');

    if (roleType) el.setAttribute('role', roleType);
    else el.removeAttribute('role');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (state && state !== 'idle') el.setAttribute('state', state);
    else el.removeAttribute('state');

    if (initialFocus) el.setAttribute('initial-focus', initialFocus);
    else el.removeAttribute('initial-focus');

    if (submitText) el.setAttribute('submit-text', submitText);
    else el.removeAttribute('submit-text');

    if (cancelText) el.setAttribute('cancel-text', cancelText);
    else el.removeAttribute('cancel-text');

    if (loadingText) el.setAttribute('loading-text', loadingText);
    else el.removeAttribute('loading-text');

    if (dialogId) (el as any).dialogId = dialogId;

    if (config) (el as any).config = config;

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [
    open,
    title,
    description,
    closable,
    dismissible,
    closeOnOverlay,
    closeOnEsc,
    lockWhileLoading,
    roleType,
    size,
    state,
    initialFocus,
    submitText,
    cancelText,
    loadingText,
    dialogId,
    config,
    headless
  ]);

  return React.createElement('ui-dialog', { ref, ...rest }, children);
});

Dialog.displayName = 'Dialog';

export default Dialog;
