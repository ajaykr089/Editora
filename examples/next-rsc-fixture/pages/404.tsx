import React from 'react';

export default function NotFoundPage() {
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
          404
        </div>
        <h1 style={{ margin: 0, fontSize: 28 }}>This fixture route does not exist.</h1>
      </div>
    </main>
  );
}
