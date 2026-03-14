import React, {
  Children,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type SidebarTone = 'default' | 'brand' | 'success' | 'warning' | 'danger';

type SidebarItemInput = {
  value?: string;
  label?: string;
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode | string;
  iconHtml?: string;
  contentHtml?: string;
  badge?: string;
  description?: string;
  section?: string;
  disabled?: boolean;
  active?: boolean;
  tone?: SidebarTone;
  children?: SidebarItemInput[];
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
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  density?: 'compact' | 'default' | 'comfortable';
  tone?: SidebarTone;
  radius?: number | string;
  itemRadius?: number | string;
  itemGap?: number | string;
  itemPaddingX?: number | string;
  itemPaddingY?: number | string;
  itemHeight?: number | string;
  itemFontSize?: number | string;
  itemLineHeight?: number | string;
  sectionLabelTransform?: 'uppercase' | 'none' | 'capitalize';
  searchQuery?: string;
  elevation?: 'none' | 'low' | 'high';
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
  onSearchChange?: (query: string) => void;
};

type SidebarGroupProps = {
  title?: string;
  children?: React.ReactNode;
};

type SidebarItemProps = {
  value: string;
  label?: string;
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode | string;
  badge?: string;
  description?: string;
  section?: string;
  disabled?: boolean;
  active?: boolean;
  tone?: SidebarTone;
  children?: React.ReactNode;
};

type SidebarSlotProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

type SidebarSearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  icon?: React.ReactNode;
};

const SIDEBAR_GROUP_MARKER = 'SidebarGroup';
const SIDEBAR_ITEM_MARKER = 'SidebarItem';

type SidebarMarkerComponent<P> = React.FC<P> & {
  __sidebarMarker?: string;
};

function isSidebarMarker<P>(node: React.ReactNode, marker: string): node is React.ReactElement<P> {
  return isValidElement(node) && (node.type as SidebarMarkerComponent<P>).__sidebarMarker === marker;
}

function splitSidebarItemChildren(children: React.ReactNode): {
  submenuChildren: React.ReactNode[];
  contentChildren: React.ReactNode[];
} {
  const submenuChildren: React.ReactNode[] = [];
  const contentChildren: React.ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (
      isSidebarMarker<SidebarGroupProps>(child, SIDEBAR_GROUP_MARKER) ||
      isSidebarMarker<SidebarItemProps>(child, SIDEBAR_ITEM_MARKER)
    ) {
      submenuChildren.push(child);
      return;
    }
    if (child != null && child !== false) contentChildren.push(child);
  });
  return { submenuChildren, contentChildren };
}

function splitSidebarIconAndContent(
  icon: React.ReactNode | string | undefined,
  contentChildren: React.ReactNode[]
): {
  iconHtml?: string;
  contentChildren: React.ReactNode[];
} {
  if (typeof icon === 'string') return { contentChildren };
  if (icon) return { iconHtml: serializeSidebarIcon(icon), contentChildren };
  const [first, ...rest] = contentChildren;
  if (
    isValidElement(first) &&
    ((typeof first.type !== 'string') || first.type === 'svg')
  ) {
    return {
      iconHtml: serializeSidebarIcon(first),
      contentChildren: rest
    };
  }
  return { contentChildren };
}

function flattenSidebarItems(children: React.ReactNode, inheritedSection = ''): SidebarItemInput[] {
  const result: SidebarItemInput[] = [];
  Children.forEach(children, (child) => {
    if (isSidebarMarker<SidebarGroupProps>(child, SIDEBAR_GROUP_MARKER)) {
      const nextSection = child.props.title || inheritedSection;
      result.push(...flattenSidebarItems(child.props.children, nextSection));
      return;
    }

    if (isSidebarMarker<SidebarItemProps>(child, SIDEBAR_ITEM_MARKER)) {
      const nextSection = child.props.section || inheritedSection;
      const icon = child.props.icon;
      const { submenuChildren, contentChildren } = splitSidebarItemChildren(child.props.children);
      const { iconHtml, contentChildren: itemContentChildren } = splitSidebarIconAndContent(icon, contentChildren);
      result.push({
        value: child.props.value,
        label: child.props.label,
        href: child.props.href,
        target: child.props.target,
        rel: child.props.rel,
        icon: typeof icon === 'string' ? icon : undefined,
        iconHtml,
        contentHtml: serializeSidebarContent(itemContentChildren),
        badge: child.props.badge,
        description: child.props.description,
        section: nextSection,
        disabled: child.props.disabled,
        active: child.props.active,
        tone: child.props.tone,
        children: flattenSidebarItems(submenuChildren, nextSection)
      });
    }
  });
  return result;
}

function serializeSidebarItems(items: SidebarItemInput[]): SidebarItemInput[] {
  return items.map((item) => ({
    ...item,
    icon: typeof item.icon === 'string' ? item.icon : undefined,
    iconHtml: item.iconHtml || serializeSidebarIcon(item.icon),
    contentHtml: item.contentHtml,
    children: item.children ? serializeSidebarItems(item.children) : undefined
  }));
}

function normalizeMetric(value: number | string | undefined): string | null {
  if (value == null || value === '') return null;
  return typeof value === 'number' ? `${value}px` : String(value);
}

function serializeSidebarIcon(icon: React.ReactNode | string | undefined): string | undefined {
  if (!icon || typeof icon === 'string') return undefined;
  if (!isValidElement(icon)) return undefined;
  return renderToStaticMarkup(
    React.cloneElement(icon as React.ReactElement<any>, {
      width: (icon as React.ReactElement<any>).props.width ?? 18,
      height: (icon as React.ReactElement<any>).props.height ?? 18,
      'aria-hidden': true,
      focusable: 'false'
    })
  );
}

function serializeSidebarContent(children: React.ReactNode[]): string | undefined {
  if (!children.length) return undefined;
  return renderToStaticMarkup(<>{children}</>);
}

function renderSidebarItems(children: React.ReactNode, inheritedSection = ''): React.ReactNode[] {
  return flattenSidebarItems(children, inheritedSection).map((item, index) => {
    const props: Record<string, unknown> = {
      slot: 'item',
      key: `${item.section || 'group'}:${item.value}:${index}`,
      'data-value': item.value,
      'data-label': item.label,
      'data-href': item.href || undefined,
      'data-target': item.target || undefined,
      'data-rel': item.rel || undefined,
      'data-section': item.section || undefined,
      'data-icon': item.icon || undefined,
      'data-icon-html': item.iconHtml || undefined,
      'data-content-html': item.contentHtml || undefined,
      'data-badge': item.badge || undefined,
      'data-description': item.description || undefined,
      'data-tone': item.tone && item.tone !== 'default' ? item.tone : undefined
    };

    if (item.disabled) props['data-disabled'] = '';
    if (item.active) props['data-active'] = '';
    if (item.children?.length) props['data-children'] = JSON.stringify(item.children);

    return React.createElement('div', props, item.label);
  });
}

const SidebarHeader: React.FC<SidebarSlotProps> = ({ children, ...rest }) => (
  <div slot="header" {...rest}>
    {children}
  </div>
);

const SidebarSearch: React.FC<SidebarSlotProps> = ({ children, ...rest }) => (
  <div slot="search" {...rest}>
    {children}
  </div>
);

const SidebarSearchInput: React.FC<SidebarSearchInputProps> = ({
  icon,
  style,
  placeholder = 'Search…',
  ...rest
}) => (
  <div
    slot="search"
    style={{
      display: 'grid',
      gridTemplateColumns: '16px minmax(0, 1fr)',
      alignItems: 'center',
      gap: 10,
      minHeight: 44,
      padding: '0 14px',
      borderRadius: 16,
      border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent)',
      background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)))',
      color: 'var(--ui-color-muted, #64748b)',
      boxSizing: 'border-box',
      ...style
    }}
  >
    <span
      aria-hidden="true"
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: 16,
        height: 16,
        color: 'currentColor'
      }}
    >
      {icon || (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </span>
    <input
      type="search"
      placeholder={placeholder}
      style={{
        width: '100%',
        minWidth: 0,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        color: 'inherit',
        font: 'inherit',
        lineHeight: 'inherit'
      }}
      {...rest}
    />
  </div>
);

const SidebarPromo: React.FC<SidebarSlotProps> = ({ children, ...rest }) => (
  <div slot="promo" {...rest}>
    {children}
  </div>
);

const SidebarFooter: React.FC<SidebarSlotProps> = ({ children, ...rest }) => (
  <div slot="footer" {...rest}>
    {children}
  </div>
);

const SidebarGroup: SidebarMarkerComponent<SidebarGroupProps> = ({ children }) => <>{children}</>;
SidebarGroup.__sidebarMarker = SIDEBAR_GROUP_MARKER;

const SidebarItem: SidebarMarkerComponent<SidebarItemProps> = () => null;
SidebarItem.__sidebarMarker = SIDEBAR_ITEM_MARKER;

const SidebarContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{renderSidebarItems(children)}</>;

type SidebarComponent = React.ForwardRefExoticComponent<SidebarProps & React.RefAttributes<HTMLElement>> & {
  Header: typeof SidebarHeader;
  Search: typeof SidebarSearch;
  SearchInput: typeof SidebarSearchInput;
  Content: typeof SidebarContent;
  Group: typeof SidebarGroup;
  Item: typeof SidebarItem;
  Promo: typeof SidebarPromo;
  Footer: typeof SidebarFooter;
};

const SidebarRoot = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    children,
    collapsed,
    collapsible,
    rail,
    resizable,
    position,
    value,
    items,
    searchQuery,
    variant,
    size,
    density,
    tone,
    radius,
    itemRadius,
    itemGap,
    itemPaddingX,
    itemPaddingY,
      itemHeight,
      itemFontSize,
      itemLineHeight,
      sectionLabelTransform,
      elevation,
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
    onSearchChange,
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

    const handleSearchChange = (event: Event) => {
      const query = (event as CustomEvent<{ query?: string }>).detail?.query;
      if (typeof query === 'string') onSearchChange?.(query);
    };

    el.addEventListener('select', handleSelect as EventListener);
    el.addEventListener('change', handleChange as EventListener);
    el.addEventListener('toggle', handleToggle as EventListener);
    el.addEventListener('collapse-change', handleCollapseChange as EventListener);
    el.addEventListener('width-change', handleWidthChange as EventListener);
    el.addEventListener('search-change', handleSearchChange as EventListener);

    return () => {
      el.removeEventListener('select', handleSelect as EventListener);
      el.removeEventListener('change', handleChange as EventListener);
      el.removeEventListener('toggle', handleToggle as EventListener);
      el.removeEventListener('collapse-change', handleCollapseChange as EventListener);
      el.removeEventListener('width-change', handleWidthChange as EventListener);
      el.removeEventListener('search-change', handleSearchChange as EventListener);
    };
  }, [onSelect, onChange, onToggle, onCollapseChange, onWidthChange, onSearchChange]);

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
      if (enabled == null) return;
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
    syncAttr('search-query', typeof searchQuery === 'string' && searchQuery !== '' ? searchQuery : null);
    syncAttr('width', width || null);
    syncAttr('min-width', minWidth || null);
    syncAttr('max-width', maxWidth || null);
    syncAttr('collapsed-width', collapsedWidth || null);
    syncAttr('storage-key', storageKey || null);

    if (items && items.length) {
      try {
        syncAttr('items', JSON.stringify(serializeSidebarItems(items)));
      } catch {
        syncAttr('items', null);
      }
    } else {
      syncAttr('items', null);
    }

    syncAttr('variant', variant && variant !== 'surface' ? variant : null);
    syncAttr('size', size && size !== 'md' && size !== '2' ? size : null);
    syncAttr('density', density && density !== 'default' ? density : null);
    syncAttr('tone', tone && tone !== 'default' ? tone : null);
    syncAttr('radius', radius == null || radius === '' ? null : String(radius));
    syncAttr('item-radius', normalizeMetric(itemRadius));
    syncAttr('item-gap', normalizeMetric(itemGap));
    syncAttr('item-padding-x', normalizeMetric(itemPaddingX));
    syncAttr('item-padding-y', normalizeMetric(itemPaddingY));
    syncAttr('item-height', normalizeMetric(itemHeight));
    syncAttr('item-font-size', normalizeMetric(itemFontSize));
    syncAttr('item-line-height', normalizeMetric(itemLineHeight));
    syncAttr(
      'section-label-transform',
      sectionLabelTransform && sectionLabelTransform !== 'none' ? sectionLabelTransform : null
    );
    syncAttr('elevation', elevation && elevation !== 'low' ? elevation : null);

    if (typeof showIcons === 'boolean') syncAttr('show-icons', showIcons ? 'true' : 'false');
    else syncAttr('show-icons', null);

    if (typeof showBadges === 'boolean') syncAttr('show-badges', showBadges ? 'true' : 'false');
    else syncAttr('show-badges', null);
  }, [
    collapsed,
    collapsible,
    rail,
    resizable,
    headless,
    autoSave,
    position,
    value,
    width,
    minWidth,
    maxWidth,
    collapsedWidth,
    storageKey,
    items,
    variant,
    size,
    density,
    tone,
    radius,
    itemRadius,
    itemGap,
    itemPaddingX,
    itemPaddingY,
    itemHeight,
    itemFontSize,
    itemLineHeight,
    sectionLabelTransform,
    searchQuery,
    elevation,
    showIcons,
    showBadges
  ]);

  return React.createElement('ui-sidebar', { ref, ...rest }, children);
});

const Sidebar = SidebarRoot as SidebarComponent;

Sidebar.Header = SidebarHeader;
Sidebar.Search = SidebarSearch;
Sidebar.SearchInput = SidebarSearchInput;
Sidebar.Content = SidebarContent;
Sidebar.Group = SidebarGroup;
Sidebar.Item = SidebarItem;
Sidebar.Promo = SidebarPromo;
Sidebar.Footer = SidebarFooter;

Sidebar.displayName = 'Sidebar';
SidebarHeader.displayName = 'SidebarHeader';
SidebarSearch.displayName = 'SidebarSearch';
SidebarSearchInput.displayName = 'SidebarSearchInput';
SidebarContent.displayName = 'SidebarContent';
SidebarGroup.displayName = 'SidebarGroup';
SidebarItem.displayName = 'SidebarItem';
SidebarPromo.displayName = 'SidebarPromo';
SidebarFooter.displayName = 'SidebarFooter';

export {
  Sidebar,
  SidebarHeader,
  SidebarSearch,
  SidebarSearchInput,
  SidebarContent,
  SidebarGroup,
  SidebarItem,
  SidebarPromo,
  SidebarFooter
};

export default Sidebar;
