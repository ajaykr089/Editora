import React, { useEffect, useRef } from 'react';
import {
  UIAlertDialogCancelDetail,
  UIAlertDialogCloseDetail,
  UIAlertDialogConfirmDetail,
  UIAlertDialogDismissDetail,
  UIAlertDialogOpenDetail,
  UIAlertDialogTemplateOptions
} from '@editora/ui-core';

type BaseProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };
type NativeAlertDialogProps = Omit<BaseProps, 'onClose' | 'onChange' | 'onCancel' | 'onOpen'>;

export type AlertDialogElement = HTMLElement & {
  open: boolean;
  config?: UIAlertDialogTemplateOptions;
};

export type AlertDialogProps = NativeAlertDialogProps & {
  open?: boolean;
  headless?: boolean;
  dismissible?: boolean;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  lockWhileLoading?: boolean;
  roleType?: 'alertdialog' | 'dialog';
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  variant?: 'surface' | 'soft' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  indicator?: 'line' | 'none';
  state?: 'idle' | 'loading' | 'error';
  initialFocus?: string;
  dialogId?: string;
  config?: UIAlertDialogTemplateOptions;
  onOpen?: (detail: UIAlertDialogOpenDetail) => void;
  onConfirm?: (detail: UIAlertDialogConfirmDetail) => void;
  onCancel?: (detail: UIAlertDialogCancelDetail) => void;
  onDismiss?: (detail: UIAlertDialogDismissDetail) => void;
  onClose?: (detail: UIAlertDialogCloseDetail) => void;
  onChange?: (detail: { id: string; inputValue?: string; checked?: boolean }) => void;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export const AlertDialog = React.forwardRef<AlertDialogElement, AlertDialogProps>(function AlertDialog(
  {
    children,
    open,
    headless,
    dismissible,
    closeOnEsc,
    closeOnBackdrop,
    lockWhileLoading,
    roleType,
    tone,
    variant,
    size,
    radius,
    elevation,
    indicator,
    state,
    initialFocus,
    dialogId,
    config,
    onOpen,
    onConfirm,
    onCancel,
    onDismiss,
    onClose,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<AlertDialogElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as AlertDialogElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleOpen = (event: Event) => onOpen?.((event as CustomEvent<UIAlertDialogOpenDetail>).detail);
    const handleConfirm = (event: Event) => onConfirm?.((event as CustomEvent<UIAlertDialogConfirmDetail>).detail);
    const handleCancel = (event: Event) => onCancel?.((event as CustomEvent<UIAlertDialogCancelDetail>).detail);
    const handleDismiss = (event: Event) => onDismiss?.((event as CustomEvent<UIAlertDialogDismissDetail>).detail);
    const handleClose = (event: Event) => onClose?.((event as CustomEvent<UIAlertDialogCloseDetail>).detail);
    const handleChange = (event: Event) =>
      onChange?.((event as CustomEvent<{ id: string; inputValue?: string; checked?: boolean }>).detail);

    el.addEventListener('ui-open', handleOpen as EventListener);
    el.addEventListener('ui-confirm', handleConfirm as EventListener);
    el.addEventListener('ui-cancel', handleCancel as EventListener);
    el.addEventListener('ui-dismiss', handleDismiss as EventListener);
    el.addEventListener('ui-close', handleClose as EventListener);
    el.addEventListener('ui-change', handleChange as EventListener);

    return () => {
      el.removeEventListener('ui-open', handleOpen as EventListener);
      el.removeEventListener('ui-confirm', handleConfirm as EventListener);
      el.removeEventListener('ui-cancel', handleCancel as EventListener);
      el.removeEventListener('ui-dismiss', handleDismiss as EventListener);
      el.removeEventListener('ui-close', handleClose as EventListener);
      el.removeEventListener('ui-change', handleChange as EventListener);
    };
  }, [onOpen, onConfirm, onCancel, onDismiss, onClose, onChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (typeof open === 'boolean') {
      if (open) el.setAttribute('open', '');
      else el.removeAttribute('open');
    } else el.removeAttribute('open');

    if (typeof dismissible === 'boolean') el.setAttribute('dismissible', String(dismissible));
    else el.removeAttribute('dismissible');

    if (typeof closeOnEsc === 'boolean') el.setAttribute('close-on-esc', String(closeOnEsc));
    else el.removeAttribute('close-on-esc');

    if (typeof closeOnBackdrop === 'boolean') el.setAttribute('close-on-backdrop', String(closeOnBackdrop));
    else el.removeAttribute('close-on-backdrop');

    if (typeof lockWhileLoading === 'boolean') el.setAttribute('lock-while-loading', String(lockWhileLoading));
    else el.removeAttribute('lock-while-loading');

    if (roleType) el.setAttribute('role', roleType);
    else el.removeAttribute('role');

    if (tone && tone !== 'neutral') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (variant && variant !== 'surface') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (radius != null) el.setAttribute('radius', String(radius));
    else el.removeAttribute('radius');

    if (elevation && elevation !== 'low') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (indicator && indicator !== 'line') el.setAttribute('indicator', indicator);
    else el.removeAttribute('indicator');

    if (state && state !== 'idle') el.setAttribute('state', state);
    else el.removeAttribute('state');

    if (initialFocus) el.setAttribute('initial-focus', initialFocus);
    else el.removeAttribute('initial-focus');

    if (dialogId) (el as any).dialogId = dialogId;

    if (config) (el as any).config = config;
    else (el as any).config = {};
  }, [
    open,
    headless,
    dismissible,
    closeOnEsc,
    closeOnBackdrop,
    lockWhileLoading,
    roleType,
    tone,
    variant,
    size,
    radius,
    elevation,
    indicator,
    state,
    initialFocus,
    dialogId,
    config
  ]);

  return React.createElement('ui-alert-dialog', { ref, ...rest }, children);
});

AlertDialog.displayName = 'AlertDialog';

export interface AlertDialogSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

function createAlertDialogSection(
  defaultTag: keyof JSX.IntrinsicElements,
  displayName: string,
  slot?: string,
  dataAttr?: string
) {
  const Component = React.forwardRef<HTMLElement, AlertDialogSectionProps>(function AlertDialogSection(
    { as, children, style, ...rest },
    forwardedRef
  ) {
    const Tag = (as || defaultTag) as keyof JSX.IntrinsicElements;
    const props: Record<string, unknown> = { ref: forwardedRef, ...rest };
    if (slot) props.slot = slot;
    if (dataAttr) props[dataAttr] = '';
    if (style) props.style = style;
    return React.createElement(Tag, props, children);
  });
  Component.displayName = displayName;
  return Component;
}

export const AlertDialogIcon = createAlertDialogSection('span', 'AlertDialogIcon', 'icon', 'data-ui-alert-dialog-icon');
export const AlertDialogTitle = createAlertDialogSection('div', 'AlertDialogTitle', 'title', 'data-ui-alert-dialog-title');
export const AlertDialogDescription = createAlertDialogSection(
  'div',
  'AlertDialogDescription',
  'description',
  'data-ui-alert-dialog-description'
);
export const AlertDialogContent = createAlertDialogSection(
  'div',
  'AlertDialogContent',
  'content',
  'data-ui-alert-dialog-content'
);
export const AlertDialogActions = createAlertDialogSection(
  'div',
  'AlertDialogActions',
  'footer',
  'data-ui-alert-dialog-actions'
);

export default AlertDialog;
