import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@editora/ui-react/ThemeProvider';
import { Button } from '@editora/ui-react/Button';
import { Input } from '@editora/ui-react/Input';
import { Select } from '@editora/ui-react/Select';

const density = (new URLSearchParams(location.search).get('density') || 'default') as 'compact' | 'default' | 'comfortable';
createRoot(document.getElementById('root')!).render(
  <ThemeProvider density={density} storageKey={null}>
    <div style={{ display: 'grid', gap: 12, width: 320 }}>
      <Button id="btn">Save</Button>
      <Input id="inp" aria-label="Name" />
      <Select id="sel" aria-label="Kind"><option>A</option></Select>
    </div>
  </ThemeProvider>
);
