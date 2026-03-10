import React, { useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type SplitButtonItem = {
  value: string;
  label: string;
  description?: string;
  shortcut?: string;
  tone?: 'default' | 'danger';
  disabled?: boolean;
};

export type SplitButtonProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  label?: string;
  menuLabel?: string;
  menuHeading?: string;
  menuDescription?: string;
  variant?: 'primary' | 'neutral' | 'flat' | 'contrast';
  density?: 'compact' | 'default' | 'comfortable';
  menuDensity?: 'compact' | 'default' | 'airy';
  menuShape?: 'default' | 'flat' | 'soft';
  disabled?: boolean;
  items?: SplitButtonItem[];
  onPrimaryAction?: () => void;
  onSelect?: (detail: { index: number; value?: string; label?: string }) => void;
};

export const SplitButton = React.forwardRef<HTMLElement, SplitButtonProps>(function SplitButton(
  {
    children,
    label,
    menuLabel,
    menuHeading,
    menuDescription,
    variant,
    density,
    menuDensity,
    menuShape,
    disabled,
    items,
    onPrimaryAction,
    onSelect,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onPrimary = () => onPrimaryAction?.();
    const onSelectHandler = (event: Event) => onSelect?.((event as CustomEvent<any>).detail);
    el.addEventListener('primary-action', onPrimary as EventListener);
    el.addEventListener('select', onSelectHandler as EventListener);
    return () => {
      el.removeEventListener('primary-action', onPrimary as EventListener);
      el.removeEventListener('select', onSelectHandler as EventListener);
    };
  }, [onPrimaryAction, onSelect]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (label) el.setAttribute('label', label);
    else el.removeAttribute('label');
    if (menuLabel) el.setAttribute('menu-label', menuLabel);
    else el.removeAttribute('menu-label');
    if (menuHeading) el.setAttribute('menu-heading', menuHeading);
    else el.removeAttribute('menu-heading');
    if (menuDescription) el.setAttribute('menu-description', menuDescription);
    else el.removeAttribute('menu-description');
    if (variant && variant !== 'primary') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');
    if (density && density !== 'default') el.setAttribute('density', density);
    else el.removeAttribute('density');
    if (menuDensity && menuDensity !== 'default') el.setAttribute('menu-density', menuDensity);
    else el.removeAttribute('menu-density');
    if (menuShape && menuShape !== 'default') el.setAttribute('menu-shape', menuShape);
    else el.removeAttribute('menu-shape');
    if (disabled) el.setAttribute('disabled', '');
    else el.removeAttribute('disabled');
  }, [label, menuLabel, menuHeading, menuDescription, variant, density, menuDensity, menuShape, disabled]);

  const itemNodes =
    items?.map((item) =>
      React.createElement(
        'button',
        {
          key: item.value,
          slot: 'menuitem',
          type: 'button',
          'data-value': item.value,
          'data-label': item.label,
          'data-tone': item.tone || 'default',
          disabled: item.disabled
        },
        React.createElement(
          'span',
          { 'data-menu-text': 'true' },
          React.createElement('span', { 'data-menu-label': 'true' }, item.label),
          item.description ? React.createElement('span', { 'data-menu-description': 'true' }, item.description) : null
        ),
        item.shortcut ? React.createElement('span', { 'data-menu-shortcut': 'true' }, item.shortcut) : null
      )
    ) || null;

  return React.createElement('ui-split-button', { ref, ...rest }, itemNodes, children);
});

SplitButton.displayName = 'SplitButton';

export default SplitButton;
