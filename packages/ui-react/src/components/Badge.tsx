import React from 'react';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
} from './_internals';

export type BadgeRemoveDetail = {
  text: string;
  source: 'button';
};

export type BadgeProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  text?: string;
  tone?: 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'purple';
  variant?: 'surface' | 'solid' | 'soft' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '1' | '2' | '3';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'large' | 'full' | number | string;
  elevation?: 'none' | 'low' | 'high';
  state?: 'idle' | 'loading' | 'error' | 'success';
  pill?: boolean;
  dot?: boolean;
  interactive?: boolean;
  truncate?: boolean;
  maxWidth?: string;
  removable?: boolean;
  autoRemove?: boolean;
  iconOnly?: boolean;
  disabled?: boolean;
  onRemove?: (detail: BadgeRemoveDetail) => void;
};

export function Badge(props: BadgeProps) {
  const {
    text,
    tone,
    variant,
    size,
    radius,
    elevation,
    state,
    pill,
    dot,
    interactive,
    truncate,
    maxWidth,
    removable,
    autoRemove,
    iconOnly,
    disabled,
    onRemove,
    children,
    ...rest
  } = props;

  const ref = React.useRef<HTMLElement | null>(null);

  const onRemoveHandler = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<BadgeRemoveDetail>(event);
    if (detail) onRemove?.(detail);
  }, [onRemove]);

  useElementEventListeners(ref, [{ type: 'remove', listener: onRemoveHandler }], [onRemoveHandler]);

  useElementAttributes(ref, (el) => {
    syncStringAttribute(el, 'text', text ?? null);
    syncStringAttribute(el, 'tone', tone ?? null);
    syncStringAttribute(el, 'variant', variant && variant !== 'surface' ? variant : null);
    syncStringAttribute(el, 'size', size && size !== 'md' && size !== '2' ? size : null);
    syncStringAttribute(el, 'radius', radius != null ? String(radius) : null);
    syncStringAttribute(el, 'elevation', elevation && elevation !== 'none' ? elevation : null);
    syncStringAttribute(el, 'state', state && state !== 'idle' ? state : null);
    syncBooleanAttribute(el, 'pill', pill);
    syncBooleanAttribute(el, 'dot', dot);
    syncBooleanAttribute(el, 'interactive', interactive);
    syncBooleanAttribute(el, 'truncate', truncate);
    syncStringAttribute(el, 'max-width', maxWidth ?? null);
    syncBooleanAttribute(el, 'removable', removable);
    syncBooleanAttribute(el, 'auto-remove', autoRemove);
    syncBooleanAttribute(el, 'icon-only', iconOnly);
    syncBooleanAttribute(el, 'disabled', disabled);
  }, [text, tone, variant, size, radius, elevation, state, pill, dot, interactive, truncate, maxWidth, removable, autoRemove, iconOnly, disabled]);

  return React.createElement('ui-badge', { ref, ...rest }, children);
}

export default Badge;
