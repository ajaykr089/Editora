import React, { useRef } from 'react';
import {
  UIDialogCancelDetail,
  UIDialogCloseDetail,
  UIDialogDismissDetail,
  UIDialogOpenDetail,
  UIDialogRequestCloseReason,
  UIDialogSubmitDetail,
  UIDialogTemplateOptions
} from '@editora/ui-core';
import {
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
} from './_internals';

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

function syncBooleanStateAttribute(el: HTMLElement, name: string, value: boolean | undefined): void {
  syncStringAttribute(el, name, typeof value === 'boolean' ? String(value) : null);
}

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

  const ref = useForwardedHostRef<DialogElement>(forwardedRef);

  const openHandler = React.useCallback(() => onOpen?.(), [onOpen]);
  const closeHandler = React.useCallback(() => onClose?.(), [onClose]);
  const requestCloseHandler = React.useCallback((event: Event) => {
    const detail = (event as CustomEvent<DialogRequestCloseDetail>).detail;
    if (detail) onRequestClose?.(detail);
  }, [onRequestClose]);
  const dialogOpenHandler = React.useCallback(
    (event: Event) => onDialogOpen?.((event as CustomEvent<UIDialogOpenDetail>).detail),
    [onDialogOpen]
  );
  const dialogSubmitHandler = React.useCallback(
    (event: Event) => onDialogSubmit?.((event as CustomEvent<UIDialogSubmitDetail>).detail),
    [onDialogSubmit]
  );
  const dialogCancelHandler = React.useCallback(
    (event: Event) => onDialogCancel?.((event as CustomEvent<UIDialogCancelDetail>).detail),
    [onDialogCancel]
  );
  const dialogDismissHandler = React.useCallback(
    (event: Event) => onDialogDismiss?.((event as CustomEvent<UIDialogDismissDetail>).detail),
    [onDialogDismiss]
  );
  const dialogCloseHandler = React.useCallback(
    (event: Event) => onDialogClose?.((event as CustomEvent<UIDialogCloseDetail>).detail),
    [onDialogClose]
  );

  useElementEventListeners(
    ref,
    [
      { type: 'open', listener: openHandler as EventListener },
      { type: 'close', listener: closeHandler as EventListener },
      { type: 'request-close', listener: requestCloseHandler as EventListener },
      { type: 'ui-open', listener: dialogOpenHandler as EventListener },
      { type: 'ui-submit', listener: dialogSubmitHandler as EventListener },
      { type: 'ui-cancel', listener: dialogCancelHandler as EventListener },
      { type: 'ui-dismiss', listener: dialogDismissHandler as EventListener },
      { type: 'ui-close', listener: dialogCloseHandler as EventListener },
    ],
    [openHandler, closeHandler, requestCloseHandler, dialogOpenHandler, dialogSubmitHandler, dialogCancelHandler, dialogDismissHandler, dialogCloseHandler]
  );

  useElementAttributes(ref, (el) => {
    if (typeof open === 'boolean') syncBooleanAttribute(el, 'open', open);
    else syncStringAttribute(el, 'open', null);

    syncStringAttribute(el, 'title', title || null);
    syncStringAttribute(el, 'description', description || null);

    const resolvedDismissible = typeof dismissible === 'boolean' ? dismissible : closable;
    syncBooleanStateAttribute(el, 'dismissible', resolvedDismissible);
    syncBooleanStateAttribute(el, 'closable', resolvedDismissible);

    syncBooleanStateAttribute(el, 'close-on-overlay', closeOnOverlay);
    syncBooleanStateAttribute(el, 'close-on-backdrop', closeOnOverlay);
    syncBooleanStateAttribute(el, 'close-on-esc', closeOnEsc);
    syncBooleanStateAttribute(el, 'lock-while-loading', lockWhileLoading);

    syncStringAttribute(el, 'role', roleType || null);
    syncStringAttribute(el, 'size', size && size !== 'md' && size !== '2' ? size : null);
    syncStringAttribute(el, 'state', state && state !== 'idle' ? state : null);
    syncStringAttribute(el, 'initial-focus', initialFocus || null);
    syncStringAttribute(el, 'submit-text', submitText || null);
    syncStringAttribute(el, 'cancel-text', cancelText || null);
    syncStringAttribute(el, 'loading-text', loadingText || null);

    if ((el as any).dialogId !== dialogId) {
      (el as any).dialogId = dialogId;
    }

    if ((el as any).config !== config) {
      (el as any).config = config;
    }

    syncBooleanAttribute(el, 'headless', headless);
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
