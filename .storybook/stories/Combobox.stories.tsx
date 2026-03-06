import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, Combobox, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import { AlertTriangleIcon, CheckCircleIcon, RefreshCwIcon, ShieldIcon, UsersIcon } from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof Combobox> = {
  title: 'UI/Combobox',
  component: Combobox,
  argTypes: {
    value: { control: 'text' },
    open: { control: 'boolean' },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    stateText: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    clearable: { control: 'boolean' },
    debounce: { control: 'number' },
    allowCustom: { control: 'boolean' },
    noFilter: { control: 'boolean' },
    validation: { control: { type: 'radio', options: ['none', 'error', 'success'] } },
    size: { control: { type: 'radio', options: ['sm', 'md', 'lg', '1', '2', '3'] } },
    variant: { control: { type: 'radio', options: ['classic', 'surface', 'soft'] } },
    radius: { control: { type: 'radio', options: ['none', 'large', 'full'] } },
    label: { control: 'text' },
    description: { control: 'text' },
    emptyText: { control: 'text' }
  }
};

export default meta;

const cardStyle: React.CSSProperties = {
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
  borderRadius: 16,
  padding: 16,
  background: 'linear-gradient(168deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)'
};

const staffOptions = [
  { value: 'dr-nadia-khan', label: 'Dr. Nadia Khan', description: 'ICU - Critical Care' },
  { value: 'dr-oliver-johnson', label: 'Dr. Oliver Johnson', description: 'Cardiology' },
  { value: 'nurse-amy-chen', label: 'Nurse Amy Chen', description: 'Emergency Triage' },
  { value: 'nurse-sam-patel', label: 'Nurse Sam Patel', description: 'Ward Operations' },
  { value: 'admin-rachel-park', label: 'Rachel Park', description: 'Admissions Manager' },
  { value: 'qa-ravi-mehta', label: 'Ravi Mehta', description: 'Clinical QA Lead' }
];

const renderOptions = () =>
  staffOptions.map((option) => (
    <option key={option.value} value={option.value} data-description={option.description}>
      {option.label}
    </option>
  ));

export const Playground = (args: any) => (
  <Box style={{ ...cardStyle, maxInlineSize: 900 }}>
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex align="center" justify="space-between" style={{ gap: 8, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Enterprise Assignment Combobox</div>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
            Test keyboard filtering, async states, and validation feedback.
          </div>
        </div>
        <Badge tone="brand">SaaS Ready</Badge>
      </Flex>

      <Combobox
        {...args}
        onChange={(next) => toastAdvanced.info(`Assigned ${next || 'none'}`, { duration: 900, theme: 'light' })}
        onOpenDetail={(detail) => {
          if (detail.source !== 'attribute') {
            toastAdvanced.info(`Combobox ${detail.open ? 'opened' : 'closed'} via ${detail.source}`, {
              duration: 850,
              theme: 'light'
            });
          }
        }}
      >
        {renderOptions()}
      </Combobox>
    </Grid>
  </Box>
);

Playground.args = {
  value: '',
  placeholder: 'Search staff and departments...',
  clearable: true,
  debounce: 220,
  disabled: false,
  readOnly: false,
  validation: 'none',
  size: 'md',
  variant: 'surface',
  radius: 'large',
  label: 'Assignee',
  description: 'Choose the incident owner for this escalation.',
  allowCustom: false,
  noFilter: false,
  state: 'idle',
  stateText: '',
  emptyText: 'No matching staff found.'
};

export const EnterpriseTriageWorkflow = () => {
  const [value, setValue] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [open, setOpen] = React.useState(false);

  return (
    <Box style={{ ...cardStyle, maxInlineSize: 980 }}>
      <Grid style={{ display: 'grid', gap: 12 }}>
        <Flex align="center" justify="space-between" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Flex align="center" style={{ gap: 8 }}>
            <ShieldIcon size={15} />
            <span style={{ fontWeight: 700 }}>Critical Incident Routing</span>
          </Flex>
          <Badge tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}>
            {state.toUpperCase()}
          </Badge>
        </Flex>

        <Combobox
          open={open}
          value={value}
          clearable
          debounce={280}
          state={state}
          stateText={
            state === 'loading'
              ? 'Syncing on-call directory'
              : state === 'error'
                ? 'Directory unavailable'
                : state === 'success'
                  ? 'Directory verified'
                  : ''
          }
          label="Clinical owner"
          description="Type to search clinician roster and assign incident ownership."
          placeholder="Find clinician..."
          validation={state === 'error' ? 'error' : state === 'success' ? 'success' : 'none'}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onInput={(nextQuery) => {
            setQuery(nextQuery);
            setState('loading');
            window.setTimeout(() => {
              setState(nextQuery.trim().length > 1 ? 'success' : 'idle');
            }, 500);
          }}
          onChange={(next) => {
            setValue(next);
            toastAdvanced.success(`Incident assigned to ${next || 'unassigned'}`, { duration: 1200, theme: 'light' });
          }}
          onOpenDetail={(detail) => {
            if (detail.source === 'outside') {
              toastAdvanced.info('Combobox dismissed by outside click', { duration: 900, theme: 'light' });
            }
          }}
        >
          {renderOptions()}
        </Combobox>

        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<RefreshCwIcon size={14} />}
            onClick={() => {
              setState('loading');
              toastAdvanced.loading('Refreshing staffing directory...', { duration: 900, theme: 'light' });
              window.setTimeout(() => setState('idle'), 900);
            }}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<AlertTriangleIcon size={14} />}
            onClick={() => {
              setState('error');
              toastAdvanced.error('Roster API timeout detected', { duration: 1400, theme: 'light' });
            }}
          >
            Simulate Error
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<CheckCircleIcon size={14} />}
            onClick={() => {
              setState('success');
              toastAdvanced.success('Roster cache warmed and ready', { duration: 1100, theme: 'light' });
            }}
          >
            Mark Success
          </Button>
          <Button size="sm" startIcon={<UsersIcon size={14} />} onClick={() => setOpen((current) => !current)}>
            {open ? 'Close List' : 'Open List'}
          </Button>
        </Flex>

        <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
          value: <code>{value || '(none)'}</code> | query: <code>{query || '(empty)'}</code>
        </Box>
      </Grid>
    </Box>
  );
};

export const EdgeCases = () => {
  const [value, setValue] = React.useState('');

  return (
    <Grid style={{ display: 'grid', gap: 12, maxInlineSize: 980 }}>
      <Box style={cardStyle}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Badge tone="warning">Custom + Empty State</Badge>
          <Combobox
            allowCustom
            clearable
            debounce={250}
            emptyText="No known clinical tags. Press Enter to use custom value."
            label="Escalation Tag"
            description="Supports custom tags when no preset value matches."
            placeholder="Type severity tag..."
            onChange={(next) => {
              setValue(next);
              toastAdvanced.info(`Tag set to ${next || '(empty)'}`, { duration: 900, theme: 'light' });
            }}
          >
            <option value="high-risk" data-description="Immediate supervisory review">
              High Risk
            </option>
            <option value="compliance" data-description="Policy validation required">
              Compliance
            </option>
            <option value="handover" data-description="Shift transition dependency">
              Handover
            </option>
          </Combobox>
          <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>
            Current tag: <code>{value || '(none)'}</code>
          </Box>
        </Grid>
      </Box>

      <Box style={cardStyle}>
        <Grid style={{ display: 'grid', gap: 10 }}>
          <Badge tone="info">Read-Only Review</Badge>
          <Combobox
            readOnly
            value="dr-oliver-johnson"
            label="Escalation reviewer"
            description="Read-only snapshot for approval audit trail."
            placeholder="Reviewer"
          >
            {renderOptions()}
          </Combobox>
        </Grid>
      </Box>
    </Grid>
  );
};
