import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, Box, Button, Card, Flex, Grid } from '@editora/ui-react';
import { ActivityIcon, BellIcon, CheckCircleIcon, ClockIcon, ShieldIcon } from '@editora/react-icons';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  args: {
    variant: 'surface',
    tone: 'neutral',
    size: 'md',
    elevation: 'low',
    radius: 'full',
  },
  argTypes: {
    variant: { control: 'select', options: ['surface', 'soft', 'outline', 'solid'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    elevation: { control: 'select', options: ['none', 'low', 'high'] },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

const clinicians = [
  {
    id: 'dr-ava',
    name: 'Dr. Ava Singh',
    role: 'ICU Lead',
    status: 'online' as const,
    tone: 'success' as const,
    badge: '1',
    src: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'nurse-luca',
    name: 'Luca Chen',
    role: 'Charge Nurse',
    status: 'away' as const,
    tone: 'warning' as const,
    state: 'loading' as const,
    badge: '2',
    src: 'https://randomuser.me/api/portraits/men/35.jpg',
  },
  {
    id: 'dr-omar',
    name: 'Dr. Omar Hale',
    role: 'Cardiology',
    status: 'busy' as const,
    tone: 'danger' as const,
    src: 'https://randomuser.me/api/portraits/men/48.jpg',
  },
];

export const Playground: Story = {
  render: (args) => (
    <Grid style={{ gap: 16 }}>
      <Card radius={16}>
        <Card.Header>
          <Card.Title>Avatar</Card.Title>
          <Card.Description>
            Identity surface for people, queues, and entities with presence, badge, and fallback states.
          </Card.Description>
        </Card.Header>
        <Box slot="inset" style={{ padding: 12 }}>
          <Flex align="center" style={{ gap: 12 }}>
            <Avatar
              {...args}
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Dr. Ava Singh"
              status="online"
              badge="1"
              interactive
            />
            <Flex direction="column" style={{ gap: 2 }}>
              <Box style={{ fontWeight: 600 }}>Dr. Ava Singh</Box>
              <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13 }}>ICU Lead</Box>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </Grid>
  ),
};

export const VariantGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Surface', variant: 'surface', tone: 'neutral' },
        { label: 'Soft', variant: 'soft', tone: 'info' },
        { label: 'Outline', variant: 'outline', tone: 'warning' },
        { label: 'Solid', variant: 'solid', tone: 'success' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Flex align="center" style={{ gap: 12 }}>
            <Avatar
              alt={`${entry.label} avatar`}
              initials="EA"
              variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'}
              tone={entry.tone as 'neutral' | 'info' | 'warning' | 'success'}
              radius="full"
              elevation="low"
            />
            <Avatar
              alt={`${entry.label} image avatar`}
              src="https://randomuser.me/api/portraits/women/68.jpg"
              variant={entry.variant as 'surface' | 'soft' | 'outline' | 'solid'}
              tone={entry.tone as 'neutral' | 'info' | 'warning' | 'success'}
              radius={12}
              shape="rounded"
            />
          </Flex>
        </Grid>
      ))}
    </Grid>
  ),
};

export const SizeGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      {[
        { label: 'Small', size: 'sm' },
        { label: 'Medium', size: 'md' },
        { label: 'Large', size: 'lg' },
      ].map((entry) => (
        <Grid key={entry.label} style={{ gap: 8 }}>
          <Box style={{ fontSize: 13, fontWeight: 600, color: 'var(--ui-color-muted, #64748b)' }}>{entry.label}</Box>
          <Flex align="center" style={{ gap: 12 }}>
            <Avatar size={entry.size as 'sm' | 'md' | 'lg'} initials="AV" tone="info" />
            <Avatar
              size={entry.size as 'sm' | 'md' | 'lg'}
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Dr. Ava Singh"
              status="online"
              badge="1"
              tone="success"
            />
          </Flex>
        </Grid>
      ))}
    </Grid>
  ),
};

export const StateGallery: Story = {
  render: () => (
    <Grid style={{ gap: 14 }}>
      <Flex align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
        <Avatar initials="ID" state="idle" tone="neutral" />
        <Avatar initials="LD" state="loading" tone="info" />
        <Avatar initials="ER" state="error" tone="danger" />
        <Avatar initials="OK" state="success" tone="success" />
        <Avatar initials="DS" disabled />
      </Flex>
    </Grid>
  ),
};

export const ClinicalRosterWorkflow: Story = {
  render: () => {
    const [selected, setSelected] = React.useState(clinicians[0]?.id || '');
    const selectedMember = clinicians.find((member) => member.id === selected) || clinicians[0];

    return (
      <Grid style={{ gap: 14, maxInlineSize: 980 }}>
        <Box
          style={{
            border: '1px solid var(--ui-color-border, #d8e1ec)',
            borderRadius: 16,
            padding: 16,
            background: 'color-mix(in srgb, var(--ui-color-primary, #2563eb) 4%, var(--ui-color-surface, #fff))',
          }}
        >
          <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
            <Box>
              <Box style={{ fontWeight: 700, fontSize: 18 }}>Clinical presence roster</Box>
              <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
                Presence, fallback, queue badges, and quick escalation actions for live operations.
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
                      size="lg"
                      status={member.status}
                      tone={member.tone}
                      state={isActive ? 'success' : member.state}
                      badge={member.badge}
                      interactive
                      disabled={member.state === 'loading'}
                      ring={isActive}
                      variant={isActive ? 'solid' : 'soft'}
                      onClick={() => setSelected(member.id)}
                    />
                    <Box style={{ minWidth: 0 }}>
                      <Box style={{ fontWeight: 650, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</Box>
                      <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)', marginTop: 2 }}>{member.role}</Box>
                    </Box>
                  </Flex>
                  <Flex align="center" style={{ gap: 5, fontSize: 11, color: isActive ? 'var(--ui-color-primary, #2563eb)' : 'var(--ui-color-muted, #64748b)' }}>
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
              <Button size="sm" recipe="soft" variant="secondary">
                <BellIcon size={14} />
                Notify
              </Button>
              <Button size="sm">
                <CheckCircleIcon size={14} />
                Assign lead
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Grid>
    );
  },
};
