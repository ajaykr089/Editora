import React from 'react';
import { PageHeader, type PageHeaderProps } from './PageHeader';

export type PageToolbarProps = Omit<PageHeaderProps, 'children'> & {
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  surface?: 'none' | 'card';
};

export const PageToolbar = React.forwardRef<HTMLElement, PageToolbarProps>(function PageToolbar(
  {
    toolbar,
    footer,
    children,
    surface = 'card',
    className,
    style,
    ...pageHeaderProps
  },
  forwardedRef
) {
  return (
    <section
      className={className}
      style={{
        background: surface === 'card' ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%)' : 'transparent',
        border: surface === 'card' ? '1px solid rgba(148, 163, 184, 0.28)' : 'none',
        borderRadius: surface === 'card' ? 20 : 0,
        display: 'grid',
        gap: 12,
        minWidth: 0,
        padding: surface === 'card' ? 16 : 0,
        ...style,
      }}
    >
      <PageHeader {...pageHeaderProps} ref={forwardedRef} />
      {toolbar ? <div>{toolbar}</div> : null}
      {children ? <div>{children}</div> : null}
      {footer ? <div>{footer}</div> : null}
    </section>
  );
});

PageToolbar.displayName = 'PageToolbar';

export default PageToolbar;
