import { Button, Input, ThemeProvider } from '@editora/ui-react';

export default function App() {
  return (
    <ThemeProvider>
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <Input name="title" label="Title" placeholder="Untitled" clearable />
        <Button variant="primary">Save</Button>
      </div>
    </ThemeProvider>
  );
}
