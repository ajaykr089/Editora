import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type NavigationMenuChangeDetail = {
  selected: number;
  previous: number;
  reason: 'click' | 'keyboard' | 'programmatic';
};

export type NavigationMenuProps = Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'onSelect'> & {
  children?: React.ReactNode;
  selected?: number;
  orientation?: 'horizontal' | 'vertical';
  activation?: 'automatic' | 'manual';
  variant?: 'surface' | 'soft' | 'solid' | 'outline' | 'flat' | 'contrast';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  tone?: 'default' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  loop?: boolean;
  collapsible?: boolean;
  headless?: boolean;
  onChange?: (detail: NavigationMenuChangeDetail) => void;
  onSelect?: (selected: number) => void;
};

export type NavigationMenuListProps = {
  children?: React.ReactNode;
};

export type NavigationMenuItemProps = {
  children?: React.ReactNode;
};

export type NavigationMenuTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type NavigationMenuLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
export type NavigationMenuContentProps = React.HTMLAttributes<HTMLElement>;

type NavigationMenuItemContextValue = {
  itemKey: string;
  hasContent: boolean;
  setHasContent: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationMenuItemContext = React.createContext<NavigationMenuItemContextValue | null>(null);

function NavigationMenuRoot(props: NavigationMenuProps) {
  const {
    selected,
    orientation,
    activation,
    variant,
    size,
    radius,
    elevation,
    tone,
    loop,
    collapsible,
    headless,
    onChange,
    onSelect,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onChangeHandler = (event: Event) => {
      const detail = (event as CustomEvent<NavigationMenuChangeDetail>).detail;
      if (!detail) return;
      onChange?.(detail);
      onSelect?.(detail.selected);
    };

    el.addEventListener('change', onChangeHandler as EventListener);
    return () => el.removeEventListener('change', onChangeHandler as EventListener);
  }, [onChange, onSelect]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof selected === 'number') el.setAttribute('selected', String(selected));
    else el.removeAttribute('selected');

    if (orientation) el.setAttribute('orientation', orientation);
    else el.removeAttribute('orientation');

    if (activation) el.setAttribute('activation', activation);
    else el.removeAttribute('activation');

    if (variant && variant !== 'surface') el.setAttribute('variant', variant);
    else el.removeAttribute('variant');

    if (size && size !== 'md' && size !== '2') el.setAttribute('size', size);
    else el.removeAttribute('size');

    if (radius == null || radius === '' || radius === 'default') el.removeAttribute('radius');
    else el.setAttribute('radius', String(radius));

    if (elevation && elevation !== 'low') el.setAttribute('elevation', elevation);
    else el.removeAttribute('elevation');

    if (tone && tone !== 'default') el.setAttribute('tone', tone);
    else el.removeAttribute('tone');

    if (typeof loop === 'boolean') el.setAttribute('loop', String(loop));
    else el.removeAttribute('loop');

    if (collapsible) el.setAttribute('collapsible', '');
    else el.removeAttribute('collapsible');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');
  }, [selected, orientation, activation, variant, size, radius, elevation, tone, loop, collapsible, headless]);

  return React.createElement('ui-navigation-menu', { ref, ...rest }, children);
}

function NavigationMenuList({ children }: NavigationMenuListProps) {
  return <>{children}</>;
}

function NavigationMenuItem({ children }: NavigationMenuItemProps) {
  const keyRef = useRef(`ui-nav-item-${Math.random().toString(36).slice(2, 10)}`);
  const [hasContent, setHasContent] = useState(false);

  return (
    <NavigationMenuItemContext.Provider value={{ itemKey: keyRef.current, hasContent, setHasContent }}>
      {children}
    </NavigationMenuItemContext.Provider>
  );
}

function NavigationMenuTrigger({ children, ...rest }: NavigationMenuTriggerProps) {
  const itemContext = React.useContext(NavigationMenuItemContext);
  const ref = useRef<HTMLButtonElement | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const syncExpanded = () => {
      setExpanded(el.getAttribute('aria-expanded') === 'true');
    };

    syncExpanded();

    const observer = new MutationObserver(syncExpanded);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ['aria-expanded']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <button type="button" ref={ref} slot="item" data-nav-key={itemContext?.itemKey ?? undefined} {...rest}>
      {children}
      {itemContext?.hasContent ? (
        <span aria-hidden="true" style={{ marginLeft: 6, display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: 'block',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 180ms cubic-bezier(0.2, 0.9, 0.24, 1)'
            }}
          >
            <path
              d="M3 4.75L6 7.25L9 4.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </button>
  );
}

function NavigationMenuLink({ children, ...rest }: NavigationMenuLinkProps) {
  const itemContext = React.useContext(NavigationMenuItemContext);
  return (
    <a slot="item" data-nav-key={itemContext?.itemKey ?? undefined} {...rest}>
      {children}
    </a>
  );
}

function NavigationMenuContent({ children, ...rest }: NavigationMenuContentProps) {
  const itemContext = React.useContext(NavigationMenuItemContext);

  useEffect(() => {
    if (!itemContext) return;
    itemContext.setHasContent(true);
    return () => itemContext.setHasContent(false);
  }, [itemContext]);

  return (
    <section slot="panel" data-nav-panel-for={itemContext?.itemKey ?? undefined} {...rest}>
      {children}
    </section>
  );
}

function NavigationMenuIndicator() {
  return null;
}

function NavigationMenuViewport() {
  return null;
}

export const NavigationMenu = Object.assign(NavigationMenuRoot, {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Link: NavigationMenuLink,
  Content: NavigationMenuContent,
  Indicator: NavigationMenuIndicator,
  Viewport: NavigationMenuViewport,
});

export {
  NavigationMenuRoot,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};

export default NavigationMenu;
