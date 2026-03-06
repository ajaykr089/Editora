import * as React from 'react';
import { warnIfElementNotRegistered } from './_internals';

export type BlockControlsNavigateDetail = {
  fromIndex: number;
  toIndex: number;
  total: number;
  key: string;
  orientation: 'horizontal' | 'vertical';
};

export interface BlockControlsProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'floating' | 'solid' | 'outline' | 'minimal';
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  state?: 'idle' | 'loading' | 'error' | 'success';
  elevation?: 'none' | 'md' | 'high';
  density?: 'compact' | 'comfortable';
  wrap?: boolean;
  loop?: boolean;
  disabled?: boolean;
  activeIndex?: number;
  ariaLabel?: string;
  onNavigate?: (detail: BlockControlsNavigateDetail) => void;
}

export const BlockControls = React.forwardRef<HTMLElement, BlockControlsProps>(function BlockControls(
  {
    children,
    orientation,
    variant,
    tone,
    state,
    elevation,
    density,
    wrap,
    loop,
    disabled,
    activeIndex,
    ariaLabel,
    onNavigate,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    warnIfElementNotRegistered('ui-block-controls', 'BlockControls');
  }, []);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || !onNavigate) return;

    const handleNavigate = (event: Event) => onNavigate((event as CustomEvent<BlockControlsNavigateDetail>).detail);
    element.addEventListener('ui-navigate', handleNavigate as EventListener);
    return () => element.removeEventListener('ui-navigate', handleNavigate as EventListener);
  }, [onNavigate]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (orientation) element.setAttribute('orientation', orientation);
    else element.removeAttribute('orientation');

    if (variant && variant !== 'floating') element.setAttribute('variant', variant);
    else element.removeAttribute('variant');

    if (tone && tone !== 'neutral') element.setAttribute('tone', tone);
    else element.removeAttribute('tone');

    if (state && state !== 'idle') element.setAttribute('state', state);
    else element.removeAttribute('state');

    if (elevation && elevation !== 'md') element.setAttribute('elevation', elevation);
    else element.removeAttribute('elevation');

    if (density) element.setAttribute('density', density);
    else element.removeAttribute('density');

    if (wrap == null) element.removeAttribute('wrap');
    else if (wrap) element.setAttribute('wrap', '');
    else element.removeAttribute('wrap');

    if (loop == null) {
      element.removeAttribute('loop');
      element.removeAttribute('no-loop');
    } else if (loop) {
      element.setAttribute('loop', '');
      element.removeAttribute('no-loop');
    } else {
      element.removeAttribute('loop');
      element.setAttribute('no-loop', '');
    }

    if (disabled == null) element.removeAttribute('disabled');
    else if (disabled) element.setAttribute('disabled', '');
    else element.removeAttribute('disabled');

    if (typeof activeIndex === 'number' && Number.isFinite(activeIndex)) element.setAttribute('active-index', String(activeIndex));
    else element.removeAttribute('active-index');

    if (ariaLabel) element.setAttribute('aria-label', ariaLabel);
    else element.removeAttribute('aria-label');
  }, [orientation, variant, tone, state, elevation, density, wrap, loop, disabled, activeIndex, ariaLabel]);

  return React.createElement('ui-block-controls', { ref, ...rest }, children);
});

BlockControls.displayName = 'BlockControls';

export default BlockControls;
