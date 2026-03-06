import React from 'react';
import type { Meta } from '@storybook/react';
import { AppHeader, Box, Button, Drawer, Flex, Grid, Sidebar } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  BellIcon,
  ClockIcon,
  MenuIcon,
  SearchIcon,
  ShieldIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof AppHeader> = {
  title: 'UI/AppHeader',
  component: AppHeader,
};

export default meta;

function EnterpriseOpsHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [active, setActive] = React.useState('dashboard');

  return (
    <Grid style={{ gap: 12, minHeight: 420 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          overflow: 'hidden',
          background: 'var(--ui-color-surface, #fff)',
        }}
      >
        <AppHeader
          sticky
          bordered
          showMenuButton
          onMenuTrigger={() => {
            setMenuOpen(true);
            toastAdvanced.info('Navigation opened', { duration: 1200, theme: 'light' });
          }}
          style={
            {
              '--ui-app-header-height': '66px',
              '--ui-app-header-shadow': '0 1px 2px rgba(15, 23, 42, 0.06), 0 18px 30px rgba(15, 23, 42, 0.08)',
            } as React.CSSProperties
          }
        >
          <Flex slot="start" align="center" style={{ gap: 8 }}>
            <Box
              style={{
                width: 28,
                height: 28,
                borderRadius: 9,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent)',
                color: 'var(--ui-color-primary, #2563eb)',
              }}
            >
              <ShieldIcon size={15} />
            </Box>
            <Box style={{ fontWeight: 700, fontSize: 14 }}>Editora CareOps</Box>
          </Flex>

          <Flex slot="center" align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ClockIcon size={14} />
            Live monitoring
          </Flex>
          <Box slot="title">Hospital Command Center</Box>
          <Box slot="subtitle">Shift A / North Campus</Box>

          <Flex slot="end" align="center" style={{ gap: 8 }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toastAdvanced.info('Search shortcuts opened', { duration: 1200, theme: 'light' })}
            >
              <SearchIcon size={14} />
              Search
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toastAdvanced.warning('2 critical alerts require acknowledgment', { duration: 1600, theme: 'light' })}
            >
              <BellIcon size={14} />
              Alerts
            </Button>
          </Flex>
        </AppHeader>

        <Box style={{ padding: 16, minHeight: 300, background: 'var(--ui-color-surface-alt, #f8fafc)' }}>
          <Box style={{ fontWeight: 700, fontSize: 16 }}>Current View: {active}</Box>
          <Box style={{ marginTop: 6, color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>
            Enterprise app header supports sticky layout, status context, and fast operations.
          </Box>
        </Box>
      </Box>

      <Drawer open={menuOpen} side="left" dismissible onChange={setMenuOpen}>
        <Flex slot="header" align="center" style={{ gap: 8, fontWeight: 700 }}>
          <MenuIcon size={14} />
          Navigation
        </Flex>
        <Sidebar
          value={active}
          onSelect={(detail) => {
            setActive(detail.value);
            setMenuOpen(false);
            toastAdvanced.success(`Switched to ${detail.value}`, { duration: 1200, theme: 'light' });
          }}
        >
          <Box slot="item" data-value="dashboard" data-icon="🏥" data-active>Dashboard</Box>
          <Box slot="item" data-value="patients" data-icon="🩺">Patients</Box>
          <Box slot="item" data-value="staff" data-icon="👥">Staffing</Box>
          <Box slot="item" data-value="billing" data-icon="💳">Billing</Box>
        </Sidebar>
      </Drawer>
    </Grid>
  );
}

export const EnterpriseCommandCenter = () => <EnterpriseOpsHeader />;

