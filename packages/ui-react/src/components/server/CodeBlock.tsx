import React from 'react';

export type CodeBlockProps = React.HTMLAttributes<HTMLElement> & {
  as?: keyof JSX.IntrinsicElements;
  code?: string;
  language?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  wrap?: boolean;
  lineNumbers?: boolean;
  children?: React.ReactNode;
};

function withLineNumbers(code: string): React.ReactNode {
  const lines = code.split('\n');
  return lines.map((line, index) => (
    <span key={index} style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', gap: 16 }}>
      <span
        aria-hidden="true"
        style={{
          color: 'rgba(148, 163, 184, 0.86)',
          textAlign: 'right',
          userSelect: 'none',
          width: 24,
        }}
      >
        {index + 1}
      </span>
      <span>{line || ' '}</span>
    </span>
  ));
}

export const CodeBlock = React.forwardRef<HTMLElement, CodeBlockProps>(function CodeBlock(
  {
    as = 'section',
    code,
    language,
    title,
    description,
    actions,
    footer,
    wrap = false,
    lineNumbers = false,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef
) {
  const Component = as as keyof JSX.IntrinsicElements;
  const content = code ?? children;
  const renderedCode = typeof content === 'string' && lineNumbers ? withLineNumbers(content) : content;

  return React.createElement(
    Component,
    {
      ref: forwardedRef,
      className,
      style: {
        background: '#0f172a',
        border: '1px solid rgba(148, 163, 184, 0.22)',
        borderRadius: 20,
        color: '#e2e8f0',
        display: 'grid',
        gap: 0,
        overflow: 'hidden',
        ...style,
      },
      ...rest,
    },
    title || language || actions || description ? (
      <div
        style={{
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.94)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'space-between',
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
          {title ? (
            <div style={{ color: '#f8fafc', fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
              {title}
            </div>
          ) : null}
          <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, minWidth: 0 }}>
            {language ? (
              <span
                style={{
                  border: '1px solid rgba(148, 163, 184, 0.28)',
                  borderRadius: 999,
                  color: '#cbd5e1',
                  display: 'inline-flex',
                  fontFamily: "var(--ui-font-family-mono, var(--font-mono, ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace))",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '3px 8px',
                  textTransform: 'uppercase',
                }}
              >
                {language}
              </span>
            ) : null}
            {description ? (
              <span style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.4 }}>
                {description}
              </span>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {actions}
          </div>
        ) : null}
      </div>
    ) : null,
    <pre
      style={{
        margin: 0,
        maxWidth: '100%',
        overflowX: wrap ? 'visible' : 'auto',
        padding: '16px',
      }}
    >
      <code
        style={{
          color: 'inherit',
          display: 'grid',
          fontFamily: "var(--ui-font-family-mono, var(--font-mono, ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace))",
          fontSize: 13,
          lineHeight: 1.7,
          whiteSpace: wrap ? 'pre-wrap' : 'pre',
          wordBreak: wrap ? 'break-word' : 'normal',
        }}
      >
        {renderedCode}
      </code>
    </pre>,
    footer ? (
      <div
        style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.14)',
          color: '#94a3b8',
          fontSize: 12,
          lineHeight: 1.5,
          padding: '12px 16px',
        }}
      >
        {footer}
      </div>
    ) : null
  );
});

CodeBlock.displayName = 'CodeBlock';

export default CodeBlock;
