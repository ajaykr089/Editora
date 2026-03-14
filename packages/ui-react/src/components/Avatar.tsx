import * as React from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
import { warnIfElementNotRegistered } from './_internals';

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
  const ref = React.useRef<HTMLElement | null>(null);
  const fallback = React.useMemo(() => toFallback(initials, alt, children), [initials, alt, children]);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-avatar', 'Avatar');
  }, []);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || (!onAvatarLoad && !onAvatarError)) return;

    const handleLoad = (event: Event) => onAvatarLoad?.((event as CustomEvent<{ src: string }>).detail);
    const handleError = (event: Event) => onAvatarError?.((event as CustomEvent<{ src: string }>).detail);

    element.addEventListener('avatar-load', handleLoad as EventListener);
    element.addEventListener('avatar-error', handleError as EventListener);
    return () => {
      element.removeEventListener('avatar-load', handleLoad as EventListener);
      element.removeEventListener('avatar-error', handleError as EventListener);
    };
  }, [onAvatarLoad, onAvatarError]);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (src) element.setAttribute('src', src);
    else element.removeAttribute('src');

    if (alt) element.setAttribute('alt', alt);
    else element.removeAttribute('alt');

    if (initials) element.setAttribute('initials', initials);
    else element.removeAttribute('initials');

    if (size != null) element.setAttribute('size', String(size));
    else element.removeAttribute('size');

    if (bg) element.setAttribute('bg', bg);
    else element.removeAttribute('bg');

    if (color) element.setAttribute('color', color);
    else element.removeAttribute('color');

    if (radius != null) element.setAttribute('radius', String(radius));
    else element.removeAttribute('radius');

    if (fontWeight != null) element.setAttribute('fontweight', String(fontWeight));
    else element.removeAttribute('fontweight');

    if (shape) element.setAttribute('shape', shape);
    else element.removeAttribute('shape');

    if (tone && tone !== 'neutral') element.setAttribute('tone', tone);
    else element.removeAttribute('tone');

    if (variant && variant !== 'surface') element.setAttribute('variant', variant);
    else element.removeAttribute('variant');

    if (elevation && elevation !== 'low') element.setAttribute('elevation', elevation);
    else element.removeAttribute('elevation');

    if (status) element.setAttribute('status', status);
    else element.removeAttribute('status');

    if (state && state !== 'idle') element.setAttribute('state', state);
    else element.removeAttribute('state');

    if (badge) element.setAttribute('badge', badge);
    else element.removeAttribute('badge');

    if (ring == null) element.removeAttribute('ring');
    else if (ring) element.setAttribute('ring', '');
    else element.removeAttribute('ring');

    if (interactive == null) element.removeAttribute('interactive');
    else if (interactive) element.setAttribute('interactive', '');
    else element.removeAttribute('interactive');

    if (disabled == null) element.removeAttribute('disabled');
    else if (disabled) element.setAttribute('disabled', '');
    else element.removeAttribute('disabled');

    const loadingAttr = toLoading(loading);
    if (loadingAttr) element.setAttribute('loading', loadingAttr);
    else element.removeAttribute('loading');
  }, [src, alt, initials, size, bg, color, radius, fontWeight, shape, tone, variant, elevation, status, state, badge, ring, interactive, disabled, loading]);

  return React.createElement('ui-avatar', { ref, ...rest }, fallback);
});

Avatar.displayName = 'Avatar';
