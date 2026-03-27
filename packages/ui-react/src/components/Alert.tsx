import React from 'react';
import {
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
} from './_internals';

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

  const ref = React.useRef<HTMLElement | null>(null);

  const onCloseHandler = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  useElementEventListeners(ref, [{ type: 'close', listener: onCloseHandler as EventListener }], [onCloseHandler]);

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'title', title ?? null);
    syncStringAttribute(el, 'description', description ?? null);
    syncStringAttribute(el, 'tone', tone ?? null);
    syncStringAttribute(el, 'variant', variant ?? null);
    syncStringAttribute(el, 'layout', layout ?? null);
    syncStringAttribute(el, 'size', size && size !== 'md' ? size : null);
    syncStringAttribute(el, 'radius', radius != null ? String(radius) : null);
    syncStringAttribute(el, 'elevation', elevation && elevation !== 'low' ? elevation : null);
    syncStringAttribute(el, 'indicator', indicator && indicator !== 'line' ? indicator : null);
    syncBooleanAttribute(el, 'dismissible', dismissible);
    syncBooleanAttribute(el, 'headless', headless);
    syncBooleanAttribute(el, 'hidden', typeof open === 'boolean' ? !open : undefined);
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
