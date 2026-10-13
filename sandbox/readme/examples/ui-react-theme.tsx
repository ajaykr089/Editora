import { Button, ThemeProvider } from '@editora/ui-react';

export default function Themed() {
  return (
    <ThemeProvider
      tokens={{
        colors: { primary: '#0f766e', text: '#0f172a', background: '#ffffff' },
        radius: '10px'
      }}
      storageKey="my-app.theme"
    >
      <Button variant="primary">Save</Button>
    </ThemeProvider>
  );
}
