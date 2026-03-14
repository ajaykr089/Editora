import React from 'react';

export type AppHeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'onToggle'> & {
  sticky?: boolean;
  bordered?: boolean;
  dense?: boolean;
  headless?: boolean;
  showMenuButton?: boolean;
  variant?: 'surface' | 'soft' | 'outline' | 'solid';
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg' | '1' | '2' | '3';
  radius?: number | string;
  elevation?: 'none' | 'low' | 'high';
  onMenuTrigger?: () => void;
  children?: React.ReactNode;
};

export interface AppHeaderSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

const APP_HEADER_RUNTIME_STYLE_ID = 'editora-ui-react-app-header-runtime-styles';

function ensureAppHeaderRuntimeStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(APP_HEADER_RUNTIME_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = APP_HEADER_RUNTIME_STYLE_ID;
  style.textContent = `
    ui-app-header [data-ui-app-header-start],
    ui-app-header [data-ui-app-header-center],
    ui-app-header [data-ui-app-header-end] {
      min-width: 0;
      display: inline-flex;
      align-items: center;
    }

    ui-app-header [data-ui-app-header-start] {
      gap: 10px;
    }

    ui-app-header [data-ui-app-header-center] {
      gap: 10px;
    }

    ui-app-header [data-ui-app-header-end] {
      gap: 8px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    ui-app-header [data-ui-app-header-title] {
      display: block;
      min-width: 0;
    }

    ui-app-header [data-ui-app-header-subtitle] {
      display: block;
      min-width: 0;
    }
  `;
  document.head.appendChild(style);
}

function setBooleanAttr(el: HTMLElement, name: string, value?: boolean) {
  if (value) el.setAttribute(name, '');
  else el.removeAttribute(name);
}

function setStringAttr(el: HTMLElement, name: string, value?: string | number | null) {
  if (value == null || value === '') el.removeAttribute(name);
  else el.setAttribute(name, String(value));
}

export const AppHeader = React.forwardRef<HTMLElement, AppHeaderProps>(function AppHeader(
  {
    children,
    sticky,
    bordered,
    dense,
    headless,
    showMenuButton,
    variant,
    tone,
    size,
    radius,
    elevation,
    onMenuTrigger,
    ...rest
  },
  forwardedRef
) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);

  React.useEffect(() => {
    ensureAppHeaderRuntimeStyles();
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !onMenuTrigger) return;
    const handler = () => onMenuTrigger();
    el.addEventListener('menu-trigger', handler as EventListener);
    return () => el.removeEventListener('menu-trigger', handler as EventListener);
  }, [onMenuTrigger]);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    setBooleanAttr(el, 'sticky', sticky);
    setBooleanAttr(el, 'bordered', bordered);
    setBooleanAttr(el, 'dense', dense);
    setBooleanAttr(el, 'headless', headless);
    setBooleanAttr(el, 'show-menu-button', showMenuButton);
    setStringAttr(el, 'variant', variant && variant !== 'surface' ? variant : null);
    setStringAttr(el, 'tone', tone && tone !== 'neutral' ? tone : null);
    setStringAttr(el, 'size', size && size !== 'md' ? size : null);
    setStringAttr(el, 'radius', radius == null ? null : radius);
    setStringAttr(el, 'elevation', elevation && elevation !== 'low' ? elevation : null);
  }, [sticky, bordered, dense, headless, showMenuButton, variant, tone, size, radius, elevation]);

  return React.createElement('ui-app-header', { ref, ...rest }, children);
});

function createAppHeaderSection(
  defaultTag: keyof JSX.IntrinsicElements,
  displayName: string,
  slot: string,
  dataAttr?: string
) {
  const Component = React.forwardRef<HTMLElement, AppHeaderSectionProps>(function AppHeaderSection(
    { as, children, ...rest },
    forwardedRef
  ) {
    const Tag = (as || defaultTag) as keyof JSX.IntrinsicElements;
    const props: Record<string, unknown> = { ref: forwardedRef, slot, ...rest };
    if (dataAttr) props[dataAttr] = '';
    return React.createElement(Tag, props, children);
  });
  Component.displayName = displayName;
  return Component;
}

export const AppHeaderStart = createAppHeaderSection('div', 'AppHeaderStart', 'start', 'data-ui-app-header-start');
export const AppHeaderCenter = createAppHeaderSection('div', 'AppHeaderCenter', 'center', 'data-ui-app-header-center');
export const AppHeaderTitle = createAppHeaderSection('div', 'AppHeaderTitle', 'title', 'data-ui-app-header-title');
export const AppHeaderSubtitle = createAppHeaderSection('div', 'AppHeaderSubtitle', 'subtitle', 'data-ui-app-header-subtitle');
export const AppHeaderEnd = createAppHeaderSection('div', 'AppHeaderEnd', 'end', 'data-ui-app-header-end');

AppHeader.displayName = 'AppHeader';

export default AppHeader;
