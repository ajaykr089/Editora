import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type ButtonProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  recipe?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost';
  radius?: number | string;
  scale?: '1' | '2' | '3' | '4';
  icon?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  state?: 'idle' | 'loading' | 'error' | 'success';
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  block?: boolean;
  headless?: boolean;
  disabled?: boolean;
  animation?: 'scale' | 'pulse' | 'none';
  theme?: 'default' | 'dark' | 'brand';
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
};

function setBooleanAttribute(el: HTMLElement, name: string, value: boolean | undefined) {
  if (value == null || !value) {
    el.removeAttribute(name);
    return;
  }
  el.setAttribute(name, '');
}

function setStringAttribute(el: HTMLElement, name: string, value: string | undefined) {
  if (!value) {
    el.removeAttribute(name);
    return;
  }
  el.setAttribute(name, value);
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    children,
    onClick,
    variant,
    size,
    recipe,
    radius,
    scale,
    icon,
    startIcon,
    endIcon,
    loading,
    loadingLabel,
    state,
    tone,
    block,
    headless,
    disabled,
    animation,
    theme,
    type,
    ariaLabel,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    warnIfElementNotRegistered('ui-button', 'Button');
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !onClick) return;

    const handler = (e: Event) => onClick(e as unknown as React.MouseEvent<HTMLElement>);
    el.addEventListener('click', handler as EventListener);
    return () => el.removeEventListener('click', handler as EventListener);
  }, [onClick]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    setStringAttribute(el, 'variant', variant);

    if (size && size !== 'md') setStringAttribute(el, 'size', size);
    else el.removeAttribute('size');

    setStringAttribute(el, 'icon', icon);

    const resolvedState = state || (loading ? 'loading' : 'idle');
    if (resolvedState === 'idle') el.removeAttribute('state');
    else setStringAttribute(el, 'state', resolvedState);

    setBooleanAttribute(el, 'loading', !!loading);
    setBooleanAttribute(el, 'block', !!block);
    setBooleanAttribute(el, 'headless', !!headless);
    setBooleanAttribute(el, 'disabled', !!disabled);

    setStringAttribute(el, 'animation', animation);

    if (theme && theme !== 'default') setStringAttribute(el, 'theme', theme);
    else el.removeAttribute('theme');

    setStringAttribute(el, 'tone', tone);

    if (type && type !== 'button') setStringAttribute(el, 'type', type);
    else el.removeAttribute('type');

    if (loadingLabel !== undefined) setStringAttribute(el, 'loading-label', loadingLabel);
    if (ariaLabel !== undefined) setStringAttribute(el, 'aria-label', ariaLabel);
    setStringAttribute(el, 'recipe', recipe);
    setStringAttribute(el, 'radius', radius != null ? String(radius) : undefined);
    setStringAttribute(el, 'scale', scale);
  }, [variant, size, recipe, radius, scale, icon, loading, state, block, headless, disabled, animation, theme, tone, type, loadingLabel, ariaLabel]);

  const hostProps: Record<string, unknown> = {
    ref,
    ...rest,
    variant,
    size: size && size !== 'md' ? size : undefined,
    recipe,
    radius: radius != null ? String(radius) : undefined,
    scale,
    icon,
    animation,
    tone,
    type: type && type !== 'button' ? type : undefined,
    loading: loading ? '' : undefined,
    block: block ? '' : undefined,
    headless: headless ? '' : undefined,
    disabled: disabled ? '' : undefined,
    theme: theme && theme !== 'default' ? theme : undefined,
    state: state && state !== 'idle' ? state : undefined,
    'loading-label': loadingLabel,
    'aria-label': ariaLabel,
  };

  const prefix = startIcon == null ? null : React.createElement('span', { slot: 'prefix', 'aria-hidden': 'true' }, startIcon);
  const suffix = endIcon == null ? null : React.createElement('span', { slot: 'suffix', 'aria-hidden': 'true' }, endIcon);

  return React.createElement('ui-button', hostProps, prefix, children, suffix);
});

Button.displayName = 'Button';

export default Button;
