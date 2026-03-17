import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type TabsDetail = {
  selected: number;
  index: number;
  value: string;
  label: string;
  tabId: string;
  panelId: string;
};

type BaseProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export type TabsTabProps = React.HTMLAttributes<HTMLElement> & {
  value?: string;
  icon?: string;
  disabled?: boolean;
};

export type TabsPanelProps = React.HTMLAttributes<HTMLElement>;

export type TabsProps = BaseProps & {
  selected?: number | string;
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  activation?: 'auto' | 'manual';
  variant?:
    | 'default'
    | 'soft'
    | 'outline'
    | 'solid'
    | 'ghost'
    | 'glass'
    | 'indicator'
    | 'indicator-line'
    | 'contrast'
    | 'minimal'
    | 'underline'
    | 'line'
    | 'segmented'
    | 'cards';
  size?: 'sm' | 'md' | 'lg';
  density?: 'compact' | 'default' | 'comfortable';
  tone?: 'brand' | 'success' | 'warning' | 'danger';
  stretched?: boolean;
  shape?: 'rounded' | 'square' | 'pill';
  elevation?: 'low' | 'none' | 'high';
  loop?: boolean;
  bare?: boolean;
  headless?: boolean;
  onChange?: (index: number) => void;
  onTabChange?: (detail: TabsDetail) => void;
};

const TabsRoot = React.forwardRef<HTMLElement, TabsProps>(function Tabs(
  {
    children,
    selected,
    value,
    orientation,
    activation,
    variant,
    size,
    density,
    tone,
    stretched,
    shape,
    elevation,
    loop,
    bare,
    headless,
    onChange,
    onTabChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handle = (event: Event) => {
      const detail = (event as CustomEvent<TabsDetail>).detail;
      if (!detail) return;
      onChange?.(detail.index);
      onTabChange?.(detail);
    };

    el.addEventListener('change', handle as EventListener);

    return () => {
      el.removeEventListener('change', handle as EventListener);
    };
  }, [onChange, onTabChange]);

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

    syncAttr('selected', selected != null ? String(selected) : null);
    syncAttr('value', value || null);
    syncAttr('orientation', orientation && orientation !== 'horizontal' ? orientation : null);
    syncAttr('activation', activation && activation !== 'auto' ? activation : null);
    syncAttr('variant', variant && variant !== 'default' ? variant : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('tone', tone && tone !== 'brand' ? tone : null);
    syncAttr('shape', shape && shape !== 'rounded' ? shape : null);
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);
    syncAttr('loop', loop === false ? 'false' : loop === true ? '' : null);
    syncBool('stretched', stretched);
    syncBool('bare', bare);
    syncBool('headless', headless);
  }, [selected, value, orientation, activation, variant, size, density, tone, stretched, shape, elevation, loop, bare, headless]);

  return React.createElement('ui-tabs', { ref, ...rest }, children);
});

TabsRoot.displayName = 'Tabs';

const TabsTab = React.forwardRef<HTMLDivElement, TabsTabProps>(
  function TabsTab({ value, icon, disabled, ...props }, ref) {
    return React.createElement('div', {
      ref,
      slot: 'tab',
      'data-value': value,
      'data-icon': icon,
      'data-disabled': disabled ? 'true' : undefined,
      ...props
    });
  }
);
TabsTab.displayName = 'Tabs.Tab';

const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  function TabsPanel({ ...props }, ref) {
    return React.createElement('div', { ref, slot: 'panel', ...props });
  }
);
TabsPanel.displayName = 'Tabs.Panel';

export const Tabs = Object.assign(TabsRoot, {
  Tab: TabsTab,
  Panel: TabsPanel,
});

export default Tabs;
