import React, { useState } from 'react';
import { AppHeader, Box, Button, Drawer, Flex, Sidebar } from '@editora/ui-react';

export default {
  title: 'UI/AppHeader',
  component: AppHeader,
  argTypes: {
    sticky: { control: 'boolean' },
    bordered: { control: 'boolean' },
    dense: { control: 'boolean' },
    showMenuButton: { control: 'boolean' }
  }
};

export const Default = (args: any) => {
  const [menuCount, setMenuCount] = useState(0);

  return (
    <Box style={{ minHeight: 220 }}>
      <AppHeader
        sticky={args.sticky}
        bordered={args.bordered}
        dense={args.dense}
        showMenuButton={args.showMenuButton}
        onMenuTrigger={() => setMenuCount((v) => v + 1)}
      >
        <Box slot="start" style={{ fontWeight: 700 }}>Editora Admin</Box>
        <Box slot="title">Workspace</Box>
        <Flex slot="end" style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary">Search</Button>
          <Button size="sm">Create</Button>
        </Flex>
      </AppHeader>

      <Box style={{ padding: 16, color: '#475569', fontSize: 13 }}>
        Menu trigger count: {menuCount}
      </Box>
    </Box>
  );
};
Default.args = { sticky: false, bordered: true, dense: false, showMenuButton: true };

export const MobileShell = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('dashboard');

  return (
    <Box style={{ minHeight: 360, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <AppHeader bordered showMenuButton onMenuTrigger={() => setOpen(true)}>
        <Box slot="title">Admin Shell</Box>
        <Box slot="end">
          <Button size="sm" variant="secondary">Profile</Button>
        </Box>
      </AppHeader>

      <main style={{ padding: 16, background: '#f8fafc', minHeight: 280 }}>
        <h3 style={{ marginTop: 0 }}>Page: {active}</h3>
        <p style={{ color: '#475569' }}>This pattern combines AppHeader + Drawer + Sidebar for mobile nav.</p>
      </main>

      <Drawer open={open} side="left" dismissible onChange={setOpen}>
        <Box slot="header" style={{ fontWeight: 700 }}>Navigation</Box>
        <Sidebar value={active} onSelect={(detail) => { setActive(detail.value); setOpen(false); }}>
          <Box slot="item" data-value="dashboard" data-icon="🏠" data-active>Dashboard</Box>
          <Box slot="item" data-value="users" data-icon="👥">Users</Box>
          <Box slot="item" data-value="reports" data-icon="📊">Reports</Box>
          <Box slot="item" data-value="settings" data-icon="⚙️">Settings</Box>
        </Sidebar>
      </Drawer>
    </Box>
  );
};
