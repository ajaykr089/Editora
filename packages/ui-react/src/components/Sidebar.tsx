import React, { useEffect, useLayoutEffect, useImperativeHandle, useRef } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type SidebarItemInput = {
  value?: string;
  label?: string;
  icon?: string;
  badge?: string;
  description?: string;
  section?: string;
  disabled?: boolean;
  active?: boolean;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
};

type SidebarSelectDetail = {
  index: number;
  value: string;
  label: string;
  item?: SidebarItemInput;
};

type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  collapsed?: boolean;
  collapsible?: boolean;
  rail?: boolean;
  resizable?: boolean;
  position?: 'left' | 'right';
  value?: string;
  items?: SidebarItemInput[];
  variant?: 'surface' | 'soft' | 'floating' | 'contrast' | 'minimal' | 'split';
  size?: 'sm' | 'md' | 'lg';
  density?: 'compact' | 'default' | 'comfortable';
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
  showIcons?: boolean;
  showBadges?: boolean;
  headless?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  collapsedWidth?: string;
  storageKey?: string;
  autoSave?: boolean;
  onSelect?: (detail: SidebarSelectDetail) => void;
  onChange?: (detail: SidebarSelectDetail) => void;
  onToggle?: (collapsed: boolean) => void;
  onCollapseChange?: (collapsed: boolean) => void;
  onWidthChange?: (detail: { width: number; collapsedWidth: number; minWidth: number; maxWidth: number; source: string }) => void;
};

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    children,
    collapsed,
    collapsible,
    rail,
    resizable,
    position,
    value,
    items,
    variant,
    size,
    density,
    tone,
    showIcons,
    showBadges,
    headless,
    width,
    minWidth,
    maxWidth,
    collapsedWidth,
    storageKey,
    autoSave,
    onSelect,
    onChange,
    onToggle,
    onCollapseChange,
    onWidthChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);

  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleSelect = (event: Event) => {
      const detail = (event as CustomEvent<SidebarSelectDetail>).detail;
      if (detail) onSelect?.(detail);
    };

    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<SidebarSelectDetail>).detail;
      if (detail) onChange?.(detail);
    };

    const handleToggle = (event: Event) => {
      const next = (event as CustomEvent<{ collapsed?: boolean }>).detail?.collapsed;
      if (typeof next === 'boolean') onToggle?.(next);
    };

    const handleCollapseChange = (event: Event) => {
      const next = (event as CustomEvent<{ collapsed?: boolean }>).detail?.collapsed;
      if (typeof next === 'boolean') onCollapseChange?.(next);
    };

    const handleWidthChange = (event: Event) => {
      const detail = (event as CustomEvent<{ width: number; collapsedWidth: number; minWidth: number; maxWidth: number; source: string }>).detail;
      if (detail) onWidthChange?.(detail);
    };

    el.addEventListener('select', handleSelect as EventListener);
    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('toggle', handleToggle as EventListener);
    el.addEventListener('collapse-change', handleCollapseChange as EventListener);
    el.addEventListener('width-change', handleWidthChange as EventListener);

    return () => {
      el.removeEventListener('select', handleSelect as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('toggle', handleToggle as EventListener);
      el.removeEventListener('collapse-change', handleCollapseChange as EventListener);
      el.removeEventListener('width-change', handleWidthChange as EventListener);
    };
  }, [onSelect, onChange, onToggle, onCollapseChange, onWidthChange]);

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

    const syncBool = (name: string, enabled: boolean | undefined, defaultValue?: boolean) => {
      if (enabled == null) {
        if (defaultValue !== undefined && defaultValue === false) syncAttr(name, null);
        return;
      }
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };

    syncBool('collapsed', collapsed);
    syncBool('collapsible', collapsible);
    syncBool('rail', rail);
    syncBool('resizable', resizable);
    syncBool('headless', headless);
    syncBool('auto-save', autoSave);

    syncAttr('position', position && position !== 'left' ? position : null);
    syncAttr('value', value != null && value !== '' ? String(value) : null);
    syncAttr('width', width || null);
    syncAttr('min-width', minWidth || null);
    syncAttr('max-width', maxWidth || null);
    syncAttr('collapsed-width', collapsedWidth || null);
    syncAttr('storage-key', storageKey || null);

    if (items && items.length) {
      try {
        syncAttr('items', JSON.stringify(items));
      } catch {
        syncAttr('items', null);
      }
    } else {
      syncAttr('items', null);
    }

    syncAttr('variant', variant && variant !== 'surface' ? variant : null);
    syncAttr('size', size && size !== 'md' ? size : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('tone', tone && tone !== 'default' ? tone : null);

    if (typeof showIcons === 'boolean') syncAttr('show-icons', showIcons ? 'true' : 'false');
    else syncAttr('show-icons', null);

    if (typeof showBadges === 'boolean') syncAttr('show-badges', showBadges ? 'true' : 'false');
    else syncAttr('show-badges', null);
  }, [collapsed, collapsible, rail, resizable, headless, autoSave, position, value, width, minWidth, maxWidth, collapsedWidth, storageKey, items, variant, size, density, tone, showIcons, showBadges]);

  return React.createElement('ui-sidebar', { ref, ...rest }, children);
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
