import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type AlertProps = Omit<React.HTMLAttributes<HTMLElement>, 'onClose'> & {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  variant?: 'surface' | 'soft' | 'outline' | 'solid';
  layout?: 'inline' | 'banner';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  indicator?: 'line' | 'none';
  dismissible?: boolean;
  open?: boolean;
  headless?: boolean;
  onClose?: () => void;
};

export interface AlertSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

function Alert(props: AlertProps) {
  const {
    title,
    description,
    tone,
    variant,
    layout,
    size,
    radius,
    elevation,
    indicator,
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

  useIsomorphicLayoutEffect(() => {
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

    if (size && size !== 'md') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (radius != null) el.setAttribute('radius', String(radius));
    else el.removeAttribute('radius');

    if (elevation && elevation !== 'low') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (indicator && indicator !== 'line') el.setAttribute('indicator', indicator);
    else el.removeAttribute('indicator');

    if (dismissible) el.setAttribute('dismissible', '');
    else el.removeAttribute('dismissible');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (typeof open === 'boolean') {
      if (open) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    } else el.removeAttribute('hidden');
  }, [title, description, tone, variant, layout, size, radius, elevation, indicator, dismissible, open, headless]);

  return React.createElement('ui-alert', { ref, ...rest }, children);
}

function createAlertSection(
  defaultTag: keyof JSX.IntrinsicElements,
  displayName: string,
  slot?: string,
  dataAttr?: string
) {
  const Component = React.forwardRef<HTMLElement, AlertSectionProps>(function AlertSection(
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

const AlertIcon = createAlertSection('span', 'AlertIcon', 'icon', 'data-ui-alert-icon');
const AlertTitle = createAlertSection('div', 'AlertTitle', 'title', 'data-ui-alert-title');
const AlertDescription = createAlertSection('div', 'AlertDescription', undefined, 'data-ui-alert-description');
const AlertActions = createAlertSection('div', 'AlertActions', 'actions', 'data-ui-alert-actions');

// Create composed component with sub-components as properties
const ComposedAlert = Object.assign(Alert, {
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
  Actions: AlertActions,
  displayName: 'Alert',
}) as typeof Alert & {
  Icon: typeof AlertIcon;
  Title: typeof AlertTitle;
  Description: typeof AlertDescription;
  Actions: typeof AlertActions;
  displayName: string;
};

export { ComposedAlert as Alert, AlertIcon, AlertTitle, AlertDescription, AlertActions };
export default ComposedAlert;
