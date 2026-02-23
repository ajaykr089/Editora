import React from 'react';
import {
  Alert,
  AppHeader,
  Badge,
  Box,
  Breadcrumb,
  Button,
  CommandPalette,
  Flex,
  Grid,
  Input,
  Sidebar
} from '@editora/ui-react';
import { Icon } from '@editora/react-icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { navItems } from '@/app/layout/nav';
import { useAuth } from '@/app/auth/useAuth';
import { mockApi } from '@/shared/api/mockApi';
import { toastAdvanced } from '@editora/toast';

const sidebarStyle = { '--ui-sidebar-radius': 0 } as React.CSSProperties;

function breadcrumbForPath(pathname: string): string[] {
  const tokens = pathname.split('/').filter(Boolean);
  if (tokens.length === 0 || (tokens.length === 1 && tokens[0] === 'dashboard')) return ['Dashboard'];
  return ['Dashboard', ...tokens.filter((token, index) => !(index === 0 && token === 'dashboard')).map((token) => token.replace(/-/g, ' '))];
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const [collapsed, setCollapsed] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [offlineMode, setOfflineMode] = React.useState(false);
  const [globalSearch, setGlobalSearch] = React.useState('');

  const visibleItems = React.useMemo(
    () => navItems.filter((item) => !item.roles || item.roles.includes(auth.user?.role || 'admin')),
    [auth.user?.role]
  );

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeValue = React.useMemo(() => {
    const found = visibleItems.find((item) => location.pathname.startsWith(item.to));
    return found?.value || 'dashboard';
  }, [visibleItems, location.pathname]);

  const quickActions = [
    { label: 'Add patient', to: '/patients', icon: 'user-plus' },
    { label: 'Create appointment', to: '/appointments', icon: 'calendar' },
    { label: 'Create invoice', to: '/billing', icon: 'receipt' },
    { label: 'Add staff', to: '/staff', icon: 'users' },
    { label: 'Create lab order', to: '/laboratory', icon: 'activity' }
  ];

  const handleOfflineToggle = async () => {
    const enable = !offlineMode;
    setOfflineMode(enable);
    document.body.toggleAttribute('data-offline-mode', enable);

    try {
      await mockApi.setOfflineMode(enable);
      toastAdvanced.info(enable ? 'Offline mode enabled' : 'Offline mode disabled', {
        position: 'top-right',
        theme: 'light'
      });
    } catch (error) {
      toastAdvanced.error((error as Error).message, { position: 'top-right', theme: 'light' });
    }
  };

  return (
    <Grid
      columns="auto 1fr"
      style={{ minHeight: "100dvh", background: "var(--app-bg)" }}
    >
      <Sidebar
        value={activeValue}
        items={visibleItems.map((item) => ({
          value: item.value,
          label: item.label,
          icon: item.icon,
          badge: item.badge,
          section: item.section,
          description: item.description,
          active: location.pathname.startsWith(item.to),
        }))}
        collapsed={collapsed}
        collapsible
        variant="surface"
        density="compact"
        style={sidebarStyle}
        onSelect={(detail) => {
          const nextValue = (detail as any).value as string;
          const target = visibleItems.find((item) => item.value === nextValue);
          if (target) navigate(target.to);
        }}
        onToggle={setCollapsed}
      >
        <Box slot="header" style={{ fontWeight: 700 }}>
          Northstar HMS
        </Box>
        <Box
          slot="search"
          style={{ color: "var(--ui-color-muted, #64748b)", fontSize: 12 }}
        >
          Press Cmd/Ctrl+K
        </Box>
        <Box slot="footer" style={{ fontSize: 12 }}>
          Signed in as {auth.user?.email}
        </Box>
      </Sidebar>

      <Grid rows="auto auto 1fr" style={{ minWidth: 0 }}>
        <AppHeader
          sticky
          bordered
        >
          <Flex slot="start" align="center" style={{ gap: 8 }}>
            <Badge tone="info" variant="soft" size="sm">
              {auth.user?.role}
            </Badge>
          </Flex>

          <Box slot="title">Hospital Management System</Box>

          <Flex slot="end" align="center" style={{ gap: 8, flexWrap: "wrap" }}>
            <Input
              value={globalSearch}
              onChange={(next) =>
                setGlobalSearch(String((next as any)?.target?.value ?? next))
              }
              placeholder="Search patients, appointments..."
              clearable
              size="sm"
              style={{ maxInlineSize: 150 }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setCommandOpen(true)}
            >
              <Icon name="search" size={14} aria-hidden="true" />
              Quick actions
            </Button>
            <Button size="sm" variant="ghost" onClick={handleOfflineToggle}>
              <Icon name="wifi-off" size={14} aria-hidden="true" />
              {offlineMode ? "Online" : "Offline"}
            </Button>
            <Button size="sm" variant="ghost" onClick={auth.logout}>
              <Icon name="logout" size={14} aria-hidden="true" />
              Logout
            </Button>
          </Flex>
        </AppHeader>

        <Box style={{ padding: "8px 18px 0" }}>
          {offlineMode ? (
            <Alert
              tone="warning"
              title="Offline mode enabled"
              description="Mutations are blocked in mock API mode. Disable offline mode to resume writes."
              style={{ marginBottom: 8 }}
            />
          ) : null}
          <Breadcrumb separator="/" maxItems={6}>
            {breadcrumbForPath(location.pathname).map((crumb, idx) => (
              <span key={`${crumb}-${idx}`} slot="item">
                {idx === 0 ? <Link to="/dashboard">Dashboard</Link> : crumb}
              </span>
            ))}
          </Breadcrumb>
        </Box>

        <Box style={{ padding: 18, minHeight: 0 }}>
          <Outlet />
        </Box>
      </Grid>

      <CommandPalette
        open={commandOpen}
        onSelect={(index) => {
          const action = quickActions[index as number];
          if (action) navigate(action.to);
          setCommandOpen(false);
        }}
      >
        {quickActions.map((action) => (
          <Box key={action.label} slot="command">
            {action.label}
          </Box>
        ))}
      </CommandPalette>
    </Grid>
  );
}

export default AppShell;
