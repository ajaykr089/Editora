import './lib/icons';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AlertDialogProvider } from '@editora/ui-react/AlertDialogProvider';
import { NavigationProvider } from '@editora/ui-react/NavigationProvider';
import { ThemeProvider } from '@editora/ui-react/ThemeProvider';
import { initialMode, larkspurTheme, type Density } from './lib/theme';
import { navigate, useRoute, type Route } from './lib/router';
import { Shell } from './Shell';
import { Commerce } from './pages/Commerce';
import { Analytics } from './pages/Analytics';
import { Crm } from './pages/Crm';
import { Projects } from './pages/Projects';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { Customers } from './pages/Customers';
import { CustomerDetail } from './pages/CustomerDetail';
import { Products } from './pages/Products';
import { Invoices } from './pages/Invoices';
import { InvoiceDetail } from './pages/InvoiceDetail';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Pricing } from './pages/Pricing';
import { UiKit } from './pages/UiKit';
import { NotFound } from './pages/NotFound';
import { Mail } from './apps/Mail';
import { CalendarApp } from './apps/Calendar';
import { Kanban } from './apps/Kanban';
import { Journal } from './apps/Journal';
import { JournalEditor } from './apps/JournalEditor';
import { Auth } from './pages/Auth';
// Toast styles: toastApi needs them, and they are not loaded for you.
import '@editora/toast/toast.css';
import './styles.css';

function screenFor(route: Route): React.ReactNode {
  const [first, second] = route.parts;
  switch (first) {
    case undefined: return <Commerce />;
    case 'analytics': return <Analytics />;
    case 'crm': return <Crm />;
    case 'projects': return <Projects />;
    case 'orders': return second ? <OrderDetail id={second} /> : <Orders />;
    case 'customers': return second ? <CustomerDetail id={second} /> : <Customers />;
    case 'products': return <Products />;
    case 'invoices': return second ? <InvoiceDetail id={second} /> : <Invoices />;
    case 'mail': return <Mail folder={second} />;
    case 'calendar': return <CalendarApp />;
    case 'kanban': return <Kanban />;
    case 'journal': return second ? <JournalEditor id={second === 'new' ? null : second} /> : <Journal />;
    case 'profile': return <Profile />;
    case 'settings': return <Settings tab={second} />;
    case 'pricing': return <Pricing />;
    case 'ui': return <UiKit />;
    default: return <NotFound path={route.path} />;
  }
}

function App() {
  const [mode, setMode] = React.useState(initialMode);
  const [density, setDensity] = React.useState<Density>('default');
  const route = useRoute();
  const tokens = React.useMemo(() => larkspurTheme(mode, density), [mode, density]);

  React.useEffect(() => {
    // The rich-text editor's own theme follows data-theme on an ancestor.
    document.documentElement.dataset.theme = mode;
    try { localStorage.setItem('larkspur-mode', mode); } catch { /* storage blocked */ }
  }, [mode]);

  const toggleMode = () => setMode((current) => (current === 'dark' ? 'light' : 'dark'));
  const isAuth = route.parts[0] === 'auth';

  return (
    <ThemeProvider tokens={tokens} storageKey={null}>
      {/* Every Editora link (sidebar, breadcrumbs, table rows, tabs, pagination) goes through the router. */}
      <NavigationProvider navigate={navigate}>
        <AlertDialogProvider>
          {isAuth ? (
            <Auth screen={route.parts[1] || 'sign-in'} mode={mode} onToggleMode={toggleMode} />
          ) : (
            <Shell route={route} mode={mode} density={density} onToggleMode={toggleMode} onDensity={setDensity}>
              {/* key: each screen starts fresh when the path changes */}
              <React.Fragment key={route.path}>{screenFor(route)}</React.Fragment>
            </Shell>
          )}
        </AlertDialogProvider>
      </NavigationProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
