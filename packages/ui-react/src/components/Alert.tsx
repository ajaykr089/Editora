import React, { useEffect, useRef } from 'react';

export type AlertProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  variant?: 'soft' | 'outline' | 'solid';
  layout?: 'inline' | 'banner';
  dismissible?: boolean;
  open?: boolean;
  headless?: boolean;
  onClose?: () => void;
};

export function Alert(props: AlertProps) {
  const {
    title,
    description,
    tone,
    variant,
    layout,
    dismissible,
    open,
    headless,
    onClose,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCloseHandler = () => onClose?.();
    el.addEventListener('close', onCloseHandler as EventListener);
    return () => el.removeEventListener('close', onCloseHandler as EventListener);
  }, [onClose]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (title) el.setAttribute('title', title);
    else el.removeAttribute('title');

    if (description) el.setAttribute('description', description);
    else el.removeAttribute('description');

    if (tone) el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (variant) el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (layout) el.setAttribute('layout', layout);
    else el.removeAttribute('layout');

    if (dismissible) el.setAttribute('dismissible', '');
    else el.removeAttribute('dismissible');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (typeof open === 'boolean') {
      if (open) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    }
  }, [title, description, tone, variant, layout, dismissible, open, headless]);

  return React.createElement('ui-alert', { ref, ...rest }, children);
}

export default Alert;
