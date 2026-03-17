import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';
import { Toggle, type ToggleProps } from './Toggle';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type ToggleGroupDetail = {
  value: string | string[];
  values: string[];
  multiple: boolean;
};

type BaseProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> & {
  children?: React.ReactNode;
};

export type ToggleGroupProps = BaseProps & {
  value?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  headless?: boolean;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'soft' | 'contrast' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  density?: 'compact' | 'default' | 'comfortable';
  shape?: 'default' | 'square' | 'pill';
  elevation?: 'default' | 'none';
  allowEmpty?: boolean;
  required?: boolean;
  activation?: 'auto' | 'manual';
  onInput?: (detail: ToggleGroupDetail) => void;
  onChange?: (detail: ToggleGroupDetail) => void;
  onValueChange?: (detail: ToggleGroupDetail) => void;
};

export type ToggleGroupItemProps = ToggleProps;

const ToggleGroupItem = React.forwardRef<HTMLElement, ToggleGroupItemProps>(function ToggleGroupItem(props, ref) {
  return <Toggle ref={ref} {...props} />;
});
ToggleGroupItem.displayName = 'ToggleGroup.Item';

const ToggleGroupRoot = React.forwardRef<HTMLElement, ToggleGroupProps>(function ToggleGroupRoot(
  {
    children,
    value,
    multiple,
    disabled,
    headless,
    orientation,
    variant,
    size,
    density,
    shape,
    elevation,
    allowEmpty,
    required,
    activation,
    onInput,
    onChange,
    onValueChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const inputHandler = (event: Event) => {
      const detail = (event as CustomEvent<ToggleGroupDetail>).detail;
      if (!detail) return;
      onInput?.(detail);
      onValueChange?.(detail);
    };

    const changeHandler = (event: Event) => {
      const detail = (event as CustomEvent<ToggleGroupDetail>).detail;
      if (!detail) return;
      onChange?.(detail);
      onValueChange?.(detail);
    };

    el.addEventListener('input', inputHandler as EventListener);
    el.addEventListener('change', changeHandler as EventListener);

    return () => {
      el.removeEventListener('input', inputHandler as EventListener);
      el.removeEventListener('change', changeHandler as EventListener);
    };
  }, [onInput, onChange, onValueChange]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncAttr = (name: string, next: string | null) => {
      const current = el.getAttribute(name);
      if (next == null) {
        if (current != null) el.removeAttribute(name);
        return;
      }
      if (current !== next) el.setAttribute(name, next);
    };

    const syncBool = (name: string, enabled: boolean | undefined) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    syncBool('multiple', multiple);
    syncBool('disabled', disabled);
    syncBool('headless', headless);
    syncBool('allow-empty', allowEmpty);
    syncBool('required', required);

    if (value == null) {
      syncAttr('value', null);
    } else if (Array.isArray(value)) {
      syncAttr('value', JSON.stringify(value));
    } else {
      syncAttr('value', String(value));
    }

    syncAttr('orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('shape', shape && shape !== 'default' ? shape : null);
    syncAttr('elevation', elevation && elevation !== 'default' ? elevation : null);
    syncAttr('activation', activation && activation !== 'auto' ? activation : null);
  }, [value, multiple, disabled, headless, allowEmpty, required, orientation, variant, size, density, shape, elevation, activation]);

  return React.createElement('ui-toggle-group', { ref, ...rest }, children);
});

ToggleGroupRoot.displayName = 'ToggleGroup';

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: ToggleGroupItem,
});

export default ToggleGroup;
