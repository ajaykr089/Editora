import React from 'react';
import { PageHeader, type PageHeaderProps } from './PageHeader';

export type RecordHeaderDetail = {
  key?: React.Key;
  label: React.ReactNode;
  value: React.ReactNode;
};

export type RecordHeaderProps = Omit<PageHeaderProps, 'children'> & {
  details?: readonly RecordHeaderDetail[] | React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
};

function isDetailList(details: RecordHeaderProps['details']): details is readonly RecordHeaderDetail[] {
  return Array.isArray(details) && details.every((detail) => !!detail && typeof detail === 'object' && 'label' in detail && 'value' in detail);
}

export const RecordHeader = React.forwardRef<HTMLElement, RecordHeaderProps>(function RecordHeader(
  {
    details,
    footer,
    children,
    className,
    style,
    ...pageHeaderProps
  },
  forwardedRef
) {
  const detailContent = isDetailList(details) ? (
    <div
      style={{
        display: 'grid',
        gap: 10,
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        minWidth: 0,
      }}
    >
      {details.map((detail, index) => (
        <div
          key={detail.key ?? index}
          style={{
            background: 'rgba(248, 250, 252, 0.92)',
            border: '1px solid rgba(203, 213, 225, 0.85)',
            borderRadius: 14,
            display: 'grid',
            gap: 4,
            minWidth: 0,
            padding: '10px 12px',
          }}
        >
          <div
            style={{
              color: 'var(--ui-color-muted, #64748b)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              lineHeight: 1.25,
              textTransform: 'uppercase',
            }}
          >
            {detail.label}
          </div>
          <div
            style={{
              color: 'var(--ui-color-text, #0f172a)',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.4,
              minWidth: 0,
            }}
          >
            {detail.value}
          </div>
        </div>
      ))}
    </div>
  ) : details;

  return (
    <section
      className={className}
      style={{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.96) 100%)',
        border: '1px solid rgba(148, 163, 184, 0.28)',
        borderRadius: 20,
        display: 'grid',
        gap: 14,
        minWidth: 0,
        padding: 16,
        ...style,
      }}
    >
      <PageHeader {...pageHeaderProps} ref={forwardedRef} />
      {detailContent ? <div>{detailContent}</div> : null}
      {children ? <div>{children}</div> : null}
      {footer ? <div>{footer}</div> : null}
    </section>
  );
});

RecordHeader.displayName = 'RecordHeader';

export default RecordHeader;
