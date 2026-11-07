import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@editora/ui-react/ThemeProvider';
import { initialMode, tallyhawkTheme } from './theme';
import { Landing } from './site/Landing';
import './styles.css';

function App() {
  const [mode, setMode] = React.useState(initialMode);
  React.useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);
  return (
    <ThemeProvider tokens={tallyhawkTheme(mode)} storageKey={null}>
      <Landing mode={mode} onToggleMode={() => setMode((current) => (current === 'dark' ? 'light' : 'dark'))} />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
