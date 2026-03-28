import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Next RSC Fixture',
  description: 'Verification fixture for @editora/ui-react server/client entrypoints.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          fontFamily: 'Inter, system-ui, sans-serif',
          background: '#f5f7fb',
          color: '#0f172a',
        }}
      >
        {children}
      </body>
    </html>
  );
}
