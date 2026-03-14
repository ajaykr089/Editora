import React, { useEffect, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type BadgeRemoveDetail = {
  text: string;
  source: 'button';
};

export type BadgeProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  text?: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'purple';
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

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onRemoveHandler = (event: Event) => onRemove?.((event as CustomEvent<BadgeRemoveDetail>).detail);
    el.addEventListener('remove', onRemoveHandler as EventListener);
    return () => el.removeEventListener('remove', onRemoveHandler as EventListener);
  }, [onRemove]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (text) el.setAttribute('text', text);
    else el.removeAttribute('text');

    if (tone) el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (variant && variant !== 'surface') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (radius != null) el.setAttribute('radius', String(radius));
    else el.removeAttribute('radius');

    if (elevation && elevation !== 'none') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (state && state !== 'idle') el.setAttribute('state', state);
    else el.removeAttribute('state');

    if (pill) el.setAttribute('pill', '');
    else el.removeAttribute('pill');

    if (dot) el.setAttribute('dot', '');
    else el.removeAttribute('dot');

    if (interactive) el.setAttribute('interactive', '');
    else el.removeAttribute('interactive');

    if (truncate) el.setAttribute('truncate', '');
    else el.removeAttribute('truncate');

    if (maxWidth) el.setAttribute('max-width', maxWidth);
    else el.removeAttribute('max-width');

    if (removable) el.setAttribute('removable', '');
    else el.removeAttribute('removable');

    if (autoRemove) el.setAttribute('auto-remove', '');
    else el.removeAttribute('auto-remove');

    if (iconOnly) el.setAttribute('icon-only', '');
    else el.removeAttribute('icon-only');

    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
  }, [text, tone, variant, size, radius, elevation, state, pill, dot, interactive, truncate, maxWidth, removable, autoRemove, iconOnly, disabled]);

  return React.createElement('ui-badge', { ref, ...rest }, children);
}

export default Badge;
