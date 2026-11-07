import React from 'react';
import { createRoot } from 'react-dom/client';
import { Stat } from '@editora/ui-react/Stat';
import { MetricCard } from '@editora/ui-react/MetricCard';
import { Kbd } from '@editora/ui-react/Kbd';
import { applyTheme, defaultTokens } from '@editora/ui-core';
const w = window as any;
w.apply = (primary: string) => applyTheme({ ...defaultTokens, colors: { ...defaultTokens.colors, primary } } as any);
createRoot(document.getElementById('root')!).render(<>
  <Stat id="s" tone="brand" label="Revenue" value="42" icon={<span>$</span>} />
  <MetricCard id="m" tone="success" label="Paid" value="12" icon={<span>✓</span>} />
  <Kbd id="k" tone="brand">⌘K</Kbd>
</>);
