import React from 'react';
import { Badge, type BadgeProps } from './Badge';
import { Button } from './Button';

type PageHeaderButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export type PageHeaderStatusChip = {
  label: React.ReactNode;
  tone?: BadgeProps['tone'];
  variant?: BadgeProps['variant'];
  size?: BadgeProps['size'];
  radius?: BadgeProps['radius'];
  pill?: BadgeProps['pill'];
};

export type PageHeaderAction = Pick<
  PageHeaderButtonProps,
  'className' | 'disabled' | 'loading' | 'onClick' | 'size' | 'tone' | 'type' | 'variant'
> & {
  key?: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

export type PageHeaderProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
  as?: keyof JSX.IntrinsicElements;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  statusChip?: PageHeaderStatusChip;
  actions?: readonly PageHeaderAction[] | React.ReactNode;
  actionsLabel?: string;
  children?: React.ReactNode;
};

function renderAction(action: PageHeaderAction, index: number) {
  return (
    <Button
      key={action.key ?? index}
      className={action.className}
      disabled={action.disabled}
      endIcon={action.endIcon}
      loading={action.loading}
      onClick={action.onClick}
      size={action.size || 'sm'}
      startIcon={action.startIcon ?? action.icon}
      tone={action.tone}
      type={action.type}
      variant={action.variant || 'secondary'}
    >
      {action.label}
    </Button>
  );
}

function isActionConfigList(actions: PageHeaderProps['actions']): actions is readonly PageHeaderAction[] {
  return Array.isArray(actions) && actions.every((action) => {
    return !!action && typeof action === 'object' && 'label' in action;
  });
}

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  {
    as = 'section',
    title,
    subtitle,
    eyebrow,
    statusChip,
    actions,
    actionsLabel = 'Page actions',
    children,
    className,
    style,
    ...rest
  },
  forwardedRef
) {
  const Component = as as keyof JSX.IntrinsicElements;
  const actionContent = isActionConfigList(actions) ? actions.map(renderAction) : actions;

  return React.createElement(
    Component,
    {
      ref: forwardedRef,
      className,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minWidth: 0,
        ...style,
      },
      ...rest,
    },
    <div
      style={{
        alignItems: 'flex-start',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
        {eyebrow ? (
          <div
            style={{
              color: 'var(--ui-color-muted, #64748b)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
        ) : null}

        <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, minWidth: 0 }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, minWidth: 0 }}>
            {title}
          </div>
          {statusChip ? (
            <Badge
              pill={statusChip.pill}
              radius={statusChip.radius}
              size={statusChip.size || 'sm'}
              tone={statusChip.tone || 'info'}
              variant={statusChip.variant || 'soft'}
            >
              {statusChip.label}
            </Badge>
          ) : null}
        </div>

        {subtitle ? (
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 14, lineHeight: 1.45, minWidth: 0 }}>
            {subtitle}
          </div>
        ) : null}
      </div>

      {actionContent ? (
        <div
          aria-label={actionsLabel}
          style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}
        >
          {actionContent}
        </div>
      ) : null}
    </div>,
    children ? <div>{children}</div> : null
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
