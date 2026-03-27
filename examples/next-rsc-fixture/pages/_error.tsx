import type { NextPageContext } from 'next';
import React from 'react';

type ErrorPageProps = {
  statusCode?: number;
};

export default function ErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: '#f5f7fb',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', display: 'grid', gap: 8 }}>
        <div style={{ fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
          Error
        </div>
        <h1 style={{ margin: 0, fontSize: 28 }}>
          {statusCode ? `Request failed with status ${statusCode}` : 'Something went wrong.'}
        </h1>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};
