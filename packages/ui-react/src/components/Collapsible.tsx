import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type CollapsibleState = 'idle' | 'loading' | 'error' | 'success';
export type CollapsibleSize = 'sm' | 'md' | 'lg';
export type CollapsibleVariant = 'default' | 'subtle' | 'outline' | 'ghost';
export type CollapsibleTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type CollapsibleIconPosition = 'left' | 'right';
export type CollapsibleToggleDetail = {
  open: boolean;
  previousOpen: boolean;
  source?: 'pointer' | 'keyboard' | 'api';
};

export interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onToggle' | 'onChange'> {
  header?: React.ReactNode;
  caption?: React.ReactNode;
  meta?: React.ReactNode;
  open?: boolean;
  headless?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  state?: CollapsibleState;
  size?: CollapsibleSize;
  variant?: CollapsibleVariant;
  tone?: CollapsibleTone;
  iconPosition?: CollapsibleIconPosition;
  closeOnEscape?: boolean;
  onToggle?: (open: boolean) => void;
  onChangeOpen?: (open: boolean) => void;
  onToggleDetail?: (detail: CollapsibleToggleDetail) => void;
  onChangeDetail?: (detail: CollapsibleToggleDetail) => void;
}

function setBooleanAttribute(element: HTMLElement, name: string, value: boolean | undefined) {
  if (value == null) {
    element.removeAttribute(name);
    return;
  }
  if (value) element.setAttribute(name, '');
  else element.removeAttribute(name);
}

function readDetail(event: Event): CollapsibleToggleDetail | undefined {
  return (event as CustomEvent<CollapsibleToggleDetail>).detail;
}

export const Collapsible = React.forwardRef<HTMLElement, CollapsibleProps>(function Collapsible(
  {
    header,
    caption,
    meta,
    open,
    headless,
    disabled,
    readOnly,
    state,
    size,
    variant,
    tone,
    iconPosition,
    closeOnEscape,
    onToggle,
    onChangeOpen,
    onToggleDetail,
    onChangeDetail,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-collapsible', 'Collapsible');
  }, []);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    setBooleanAttribute(element, 'open', open);
    setBooleanAttribute(element, 'headless', headless);
    setBooleanAttribute(element, 'disabled', disabled);
    setBooleanAttribute(element, 'readonly', readOnly);

    const syncAttr = (name: string, next: string | null) => {
      const current = element.getAttribute(name);
      if (next == null) {
        if (current != null) element.removeAttribute(name);
        return;
      }
      if (current !== next) element.setAttribute(name, next);
    };

    syncAttr('state', state && state !== 'idle' ? state : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('tone', tone && tone !== 'neutral' ? tone : null);
    syncAttr('icon-position', iconPosition && iconPosition !== 'right' ? iconPosition : null);
    syncAttr(
      'close-on-escape',
      typeof closeOnEscape === 'boolean' ? (closeOnEscape ? 'true' : 'false') : null
    );
  }, [open, headless, disabled, readOnly, state, size, variant, tone, iconPosition, closeOnEscape]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || (!onToggle && !onChangeOpen && !onToggleDetail && !onChangeDetail)) return;

    const handleToggle = (event: Event) => {
      const detail = readDetail(event);
      if (!detail) return;
      onToggle?.(detail.open);
      onToggleDetail?.(detail);
    };

    const handleChange = (event: Event) => {
      const detail = readDetail(event);
      if (!detail) return;
      onChangeOpen?.(detail.open);
      onChangeDetail?.(detail);
    };

    element.addEventListener('toggle', handleToggle as EventListener);
    element.addEventListener('change', handleChange as EventListener);
    return () => {
      element.removeEventListener('toggle', handleToggle as EventListener);
      element.removeEventListener('change', handleChange as EventListener);
    };
  }, [onToggle, onChangeOpen, onToggleDetail, onChangeDetail]);

  let headerNode: React.ReactNode = null;
  let captionNode: React.ReactNode = null;
  let metaNode: React.ReactNode = null;

  const toSlottedNode = (node: React.ReactNode, slot: 'header' | 'caption' | 'meta'): React.ReactNode => {
    if (node == null) return null;
    if (typeof node === 'string' || typeof node === 'number') {
      return <span slot={slot}>{node}</span>;
    }
    if (React.isValidElement(node)) {
      return React.cloneElement(node as React.ReactElement<any>, { slot } as any);
    }
    return <span slot={slot}>{node}</span>;
  };

  headerNode = toSlottedNode(header, 'header');
  captionNode = toSlottedNode(caption, 'caption');
  metaNode = toSlottedNode(meta, 'meta');

  return (
    <ui-collapsible ref={ref as any} {...rest}>
      {headerNode}
      {captionNode}
      {metaNode}
      {children}
    </ui-collapsible>
  );
});

Collapsible.displayName = 'Collapsible';
