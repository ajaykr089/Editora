import './icons';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AlertDialogProvider } from '@editora/ui-react/AlertDialogProvider';
import { NavigationProvider } from '@editora/ui-react/NavigationProvider';
import { ThemeProvider } from '@editora/ui-react/ThemeProvider';
import { initialMode, tallyhawkTheme } from './theme';
import { Landing } from './site/Landing';
import { AppShell } from './app/AppShell';
import { Dashboard } from './app/Dashboard';
import { Expenses } from './app/Expenses';
import { ExpenseDetail } from './app/ExpenseDetail';
import { NewExpense } from './app/NewExpense';
import { navigate, useRoute } from './app/router';
import './styles.css';
import './app/app.css';

function App() {
  const [mode, setMode] = React.useState(initialMode);
  const route = useRoute();
  const toggleMode = () => setMode((current) => (current === 'dark' ? 'light' : 'dark'));

  React.useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  const screen =
    route.name === 'dashboard' ? <Dashboard /> :
    route.name === 'expenses' ? <Expenses /> :
    route.name === 'expense' ? <ExpenseDetail id={route.id} /> :
    route.name === 'new-expense' ? <NewExpense /> :
    null;

  return (
    <ThemeProvider tokens={tallyhawkTheme(mode)} storageKey={null}>
      {/* Every Editora link (sidebar, breadcrumbs, table rows, pagination) goes through the router. */}
      <NavigationProvider navigate={navigate}>
        <AlertDialogProvider>
          {route.name === 'site' || route.name === 'not-found' ? (
            <Landing mode={mode} onToggleMode={toggleMode} />
          ) : (
            <AppShell route={route} mode={mode} onToggleMode={toggleMode}>{screen}</AppShell>
          )}
        </AlertDialogProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
