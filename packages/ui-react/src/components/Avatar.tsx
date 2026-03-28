import * as React from 'react';

import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
  warnIfElementNotRegistered,
} from './_internals';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onLoad' | 'onError'> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: number | string | 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  bg?: string;
  color?: string;
  radius?: number | string;
  fontWeight?: number | string;
  shape?: 'circle' | 'rounded' | 'square';
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  variant?: 'surface' | 'soft' | 'solid' | 'outline';
  elevation?: 'none' | 'low' | 'high';
  status?: 'online' | 'offline' | 'busy' | 'away';
  state?: 'idle' | 'loading' | 'error' | 'success';
  badge?: string;
  ring?: boolean;
  interactive?: boolean;
  disabled?: boolean;
  loading?: 'lazy' | 'eager' | boolean;
  onAvatarLoad?: (detail: { src: string }) => void;
  onAvatarError?: (detail: { src: string }) => void;
}

function deriveInitials(input: string): string {
  const words = input.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] || ''}${words[1][0] || ''}`.toUpperCase();
}

function toLoading(value: AvatarProps['loading']): string | undefined {
  if (value == null) return undefined;
  if (value === 'lazy' || value === 'eager') return value;
  return value ? 'eager' : 'lazy';
}

function toFallback(initials: string | undefined, alt: string | undefined, children: React.ReactNode): string {
  if (initials && initials.trim()) return initials.trim().slice(0, 2).toUpperCase();
  if (alt && alt.trim()) return deriveInitials(alt);
  if (typeof children === 'string' && children.trim()) return deriveInitials(children);
  return '?';
}

export const Avatar = React.forwardRef<HTMLElement, AvatarProps>(function Avatar(
  {
    src,
    alt,
    initials,
    size,
    bg,
    color,
    radius,
    fontWeight,
    shape,
    tone,
    variant,
    elevation,
    status,
    state,
    badge,
    ring,
    interactive,
    disabled,
    loading,
    onAvatarLoad,
    onAvatarError,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<HTMLElement>(forwardedRef);
  const fallback = React.useMemo(() => toFallback(initials, alt, children), [initials, alt, children]);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-avatar', 'Avatar');
  }, []);

  const handleLoad = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ src: string }>(event);
    if (detail) onAvatarLoad?.(detail);
  }, [onAvatarLoad]);

  const handleError = React.useCallback((event: Event) => {
    const detail = getCustomEventDetail<{ src: string }>(event);
    if (detail) onAvatarError?.(detail);
  }, [onAvatarError]);

  useElementEventListeners(
    ref,
    [
      { type: 'avatar-load', listener: handleLoad },
      { type: 'avatar-error', listener: handleError },
    ],
    [handleLoad, handleError]
  );

  useElementAttributes(ref, (element) => {
    syncStringAttribute(element, 'src', src ?? null);
    syncStringAttribute(element, 'alt', alt ?? null);
    syncStringAttribute(element, 'initials', initials ?? null);
    syncStringAttribute(element, 'size', size != null ? String(size) : null);
    syncStringAttribute(element, 'bg', bg ?? null);
    syncStringAttribute(element, 'color', color ?? null);
    syncStringAttribute(element, 'radius', radius != null ? String(radius) : null);
    syncStringAttribute(element, 'fontweight', fontWeight != null ? String(fontWeight) : null);
    syncStringAttribute(element, 'shape', shape ?? null);
    syncStringAttribute(element, 'tone', tone && tone !== 'neutral' ? tone : null);
    syncStringAttribute(element, 'variant', variant && variant !== 'surface' ? variant : null);
    syncStringAttribute(element, 'elevation', elevation && elevation !== 'low' ? elevation : null);
    syncStringAttribute(element, 'status', status ?? null);
    syncStringAttribute(element, 'state', state && state !== 'idle' ? state : null);
    syncStringAttribute(element, 'badge', badge ?? null);
    syncBooleanAttribute(element, 'ring', ring);
    syncBooleanAttribute(element, 'interactive', interactive);
    syncBooleanAttribute(element, 'disabled', disabled);
    syncStringAttribute(element, 'loading', toLoading(loading) ?? null);
  }, [src, alt, initials, size, bg, color, radius, fontWeight, shape, tone, variant, elevation, status, state, badge, ring, interactive, disabled, loading]);

  return React.createElement('ui-avatar', { ref, ...rest }, fallback);
});

Avatar.displayName = 'Avatar';
