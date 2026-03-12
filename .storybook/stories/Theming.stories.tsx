import React from 'react';
import { ThemeProvider, useTheme, Button , Box} from '@editora/ui-react';

export default { title: 'UI/Theming', component: ThemeProvider, argTypes: {
  primary: { control: 'color' },
  background: { control: 'color' },
  text: { control: 'color' },
  radius: { control: 'text' },
  fontSizeMd: { control: 'text' }
}};

function Demo() {
  const theme = useTheme() as any;
  const setTokens = theme?.setTokens || (() => {});
  const tokens = theme?.tokens;
  const safeTokens = tokens || {
    colors: { primary: '#2563eb', background: '#ffffff', text: '#111827' }
  };
  const toggle = () => {
    const dark = safeTokens.colors.background === '#111827';
    setTokens({
      ...safeTokens,
      colors: dark
        ? { ...safeTokens.colors, background: '#ffffff', text: '#111827', primary: '#2563eb' }
        : { ...safeTokens.colors, background: '#111827', text: '#f8fafc', primary: '#7c3aed' }
    });
  };
  return (
    <Box style={{ padding: 20, background: 'var(--ui-color-background)', color: 'var(--ui-color-text)' }}>
      <h3>Theme demo</h3>
      <p>Primary color token: <strong style={{ color: 'var(--ui-color-primary)' }}>{safeTokens.colors.primary}</strong></p>
      <Button onClick={toggle}>Toggle theme</Button>
    </Box>
  );
}

export const Interactive = (args: any = {}) => (
  <ThemeProvider tokens={{ colors: { primary: args.primary || '#2563eb', background: args.background || '#ffffff', text: args.text || '#111827' }, radius: args.radius || '6px', typography: { size: { md: args.fontSizeMd || '14px' } } }}>
    <Demo />
  </ThemeProvider>
);
Interactive.args = { primary: '#2563eb', background: '#ffffff', text: '#111827', radius: '6px', fontSizeMd: '14px' };
Interactive.parameters = { controls: { expanded: true } };

export const Default = () => (
  <ThemeProvider>
    <Demo />
  </ThemeProvider>
);
Default.parameters = { controls: { hideNoControlsWarning: true } };
