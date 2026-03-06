import React from 'react';
import type { Meta } from '@storybook/react';
import { Avatar, Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
};

export default meta;

type Clinician = {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  uiState?: 'idle' | 'loading' | 'error' | 'success';
  badge?: string;
  src?: string;
};

const clinicians: Clinician[] = [
  {
    id: 'dr-ava',
    name: 'Dr. Ava Singh',
    role: 'ICU Lead',
    status: 'online',
    tone: 'success',
    badge: '1',
    src: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'nurse-luca',
    name: 'Luca Chen',
    role: 'Charge Nurse',
    status: 'away',
    tone: 'warning',
    uiState: 'loading',
    badge: '2',
    src: 'https://randomuser.me/api/portraits/men/35.jpg',
  },
  {
    id: 'dr-omar',
    name: 'Dr. Omar Hale',
    role: 'Cardiology',
    status: 'busy',
    tone: 'danger',
    src: 'https://randomuser.me/api/portraits/men/48.jpg',
  },
  {
    id: 'ops-ria',
    name: 'Ria Patel',
    role: 'Operations',
    status: 'offline',
    tone: 'info',
    src: 'https://randomuser.me/api/portraits/women/52.jpg',
  },
  {
    id: 'fallback',
    name: 'Maya Thomas',
    role: 'Triage Coordinator',
    status: 'online',
    tone: 'neutral',
    uiState: 'error',
    src: 'https://example.invalid/avatar-not-found.png',
  },
];

function EnterpriseCareRoster() {
  const [selected, setSelected] = React.useState(clinicians[0]?.id || '');
  const selectedMember = clinicians.find((member) => member.id === selected) || clinicians[0];

  return (
    <Grid style={{ gap: 14, maxInlineSize: 980 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background:
            'linear-gradient(136deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, #fff) 0%, var(--ui-color-surface, #fff) 44%)',
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Clinical Presence Roster</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise avatar system with status, badge counts, and quick escalation actions.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ClockIcon size={14} />
            Shift status: Live
          </Flex>
        </Flex>
      </Box>

      <Grid style={{ gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
        {clinicians.map((member) => {
          const isActive = member.id === selected;
          return (
            <Box
              key={member.id}
              style={{
                border: isActive
                  ? '1px solid color-mix(in srgb, var(--ui-color-primary, #2563eb) 48%, transparent)'
                  : '1px solid var(--ui-color-border, #d8e1ec)',
                borderRadius: 14,
                padding: 12,
                background: 'var(--ui-color-surface, #fff)',
                boxShadow: isActive ? '0 10px 24px rgba(37, 99, 235, 0.14)' : '0 1px 2px rgba(15, 23, 42, 0.05)',
              }}
            >
              <Flex align="center" justify="space-between" style={{ gap: 10 }}>
                <Flex align="center" style={{ gap: 10, minWidth: 0 }}>
                  <Avatar
                    src={member.src}
                    alt={member.name}
                    size={50}
                    status={member.status}
                    tone={member.tone}
                    state={isActive ? 'success' : member.uiState}
                    badge={member.badge}
                    interactive
                    disabled={member.uiState === 'loading'}
                    ring={isActive}
                    variant={isActive ? 'solid' : 'soft'}
                    onClick={() => {
                      setSelected(member.id);
                      toastAdvanced.info(`${member.name} selected`, { duration: 1300, theme: 'light' });
                    }}
                    onAvatarError={() =>
                      toastAdvanced.warning(`${member.name} profile image unavailable, showing initials`, {
                        duration: 1700,
                        theme: 'light',
                      })
                    }
                  />
                  <Box style={{ minWidth: 0 }}>
                    <Box style={{ fontWeight: 650, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</Box>
                    <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)', marginTop: 2 }}>{member.role}</Box>
                  </Box>
                </Flex>
                <Flex
                  align="center"
                  style={{
                    gap: 5,
                    fontSize: 11,
                    color: isActive ? 'var(--ui-color-primary, #2563eb)' : 'var(--ui-color-muted, #64748b)',
                  }}
                >
                  <ActivityIcon size={12} />
                  {member.status}
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </Grid>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 14,
          background: 'var(--ui-color-surface, #fff)',
        }}
      >
        <Flex justify="space-between" align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Flex align="center" style={{ gap: 8, fontSize: 14, fontWeight: 650 }}>
            <ShieldIcon size={15} />
            {selectedMember?.name || 'Clinician'} selected for escalation coverage
          </Flex>
          <Flex style={{ gap: 8, flexWrap: 'wrap' }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                toastAdvanced.warning(`Escalation ping sent to ${selectedMember?.name || 'clinician'}`, {
                  duration: 1500,
                  theme: 'light',
                })
              }
            >
              <BellIcon size={14} />
              Notify
            </Button>
            <Button
              size="sm"
              onClick={() =>
                toastAdvanced.success(`${selectedMember?.name || 'Clinician'} assigned as response lead`, {
                  duration: 1500,
                  theme: 'light',
                })
              }
            >
              <CheckCircleIcon size={14} />
              Assign Lead
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Grid>
  );
}

export const EnterpriseCareTeam = () => <EnterpriseCareRoster />;
