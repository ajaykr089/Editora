import React from 'react';
import type { Meta } from '@storybook/react';
import { Badge, Box, Button, ContextMenu, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  ActivityIcon,
  AlertTriangleIcon,
  ClipboardCheckIcon,
  CheckCircleIcon,
  SaveIcon,
  SparklesIcon,
  RefreshCwIcon,
  ShieldIcon,
  UsersIcon
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof ContextMenu> = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  argTypes: {
    open: { control: 'boolean' },
    anchorId: { control: 'text' },
    disabled: { control: 'boolean' },
    state: { control: { type: 'radio', options: ['idle', 'loading', 'error', 'success'] } },
    stateText: { control: 'text' },
    variant: { control: { type: 'radio', options: ['default', 'solid', 'flat', 'contrast'] } },
    density: { control: { type: 'radio', options: ['default', 'compact', 'comfortable'] } },
    shape: { control: { type: 'radio', options: ['default', 'square', 'soft'] } },
    elevation: { control: { type: 'radio', options: ['default', 'none', 'low', 'high'] } },
    tone: { control: { type: 'radio', options: ['default', 'brand', 'danger', 'success'] } },
    closeOnSelect: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    typeahead: { control: 'boolean' }
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

const baseItems = [
  {
    label: 'Create Follow-up Task',
    description: 'Assign a remediation owner',
    icon: <SaveIcon size={14} />,
    shortcut: 'T'
  },
  {
    label: 'Edit Incident Notes',
    description: 'Update timeline and context',
    icon: <SparklesIcon size={14} />,
    shortcut: 'E'
  },
  {
    label: 'Share with Command Center',
    description: 'Notify escalation room',
    icon: <UsersIcon size={14} />,
    shortcut: 'S'
  },
  { separator: true },
  {
    label: 'Move Incident',
    description: 'Transfer to another queue',
    icon: <ActivityIcon size={14} />,
    submenu: [
      { label: 'Critical Queue', description: 'On-call triage', shortcut: '1' },
      { label: 'Compliance Queue', description: 'Audit pathway', shortcut: '2' },
      { label: 'Archive', description: 'Resolved long-term', shortcut: '3' }
    ]
  },
  {
    label: 'Delete Incident',
    description: 'Requires supervisor approval',
    icon: <AlertTriangleIcon size={14} />,
    disabled: true
  }
];

export const Playground = (args: any) => (
  <Box style={{ ...cardStyle, maxInlineSize: 980 }}>
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Enterprise Incident Actions</div>
          <div style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
            Validate navigation, submenu behavior, and action safety states.
          </div>
        </div>
        <Badge tone="brand">Playground</Badge>
      </Flex>

      <Box
        id="ctx-enterprise-anchor"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 110,
          borderRadius: 12,
          border: '1px dashed #94a3b8',
          color: '#334155',
          background: '#f8fafc'
        }}
      >
        Action Surface Anchor
      </Box>

      <ContextMenu
        {...args}
        anchorId={args.anchorId || 'ctx-enterprise-anchor'}
        items={baseItems as any}
        onSelect={(detail) => {
          toastAdvanced.info(`${detail.label || detail.value || 'Action'} selected`, { duration: 900, theme: 'light' });
        }}
        onOpenDetail={(detail) => {
          if (detail.source !== 'attribute') {
            toastAdvanced.info(`Menu ${detail.open ? 'opened' : 'closed'} via ${detail.source}`, {
              duration: 850,
              theme: 'light'
            });
          }
        }}
      />
    </Grid>
  </Box>
);

Playground.args = {
  open: true,
  anchorId: 'ctx-enterprise-anchor',
  disabled: false,
  state: 'idle',
  stateText: '',
  variant: 'default',
  density: 'default',
  shape: 'default',
  elevation: 'default',
  tone: 'default',
  closeOnSelect: true,
  closeOnEscape: true,
  typeahead: true
};

export const IncidentWorkflow = () => {
  const [open, setOpen] = React.useState(false);
  const [point, setPoint] = React.useState<{ x: number; y: number } | undefined>(undefined);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [lastAction, setLastAction] = React.useState('none');

  const stateText =
    state === 'loading'
      ? 'Syncing policy actions'
      : state === 'error'
        ? 'Action pipeline unavailable'
        : state === 'success'
          ? 'Action pipeline healthy'
          : '';

  return (
    <Box style={{ ...cardStyle, maxInlineSize: 980 }}>
      <Grid style={{ display: 'grid', gap: 12 }}>
        <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Flex align="center" style={{ gap: 8 }}>
            <ShieldIcon size={15} />
            <span style={{ fontWeight: 700 }}>Critical Escalation Workspace</span>
          </Flex>
          <Badge tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'brand'}>{state.toUpperCase()}</Badge>
        </Flex>

        <Box
          onContextMenu={(event) => {
            event.preventDefault();
            setPoint({ x: event.clientX, y: event.clientY });
            setOpen(true);
          }}
          style={{
            minHeight: 170,
            borderRadius: 12,
            border: '1px dashed #94a3b8',
            background: 'linear-gradient(160deg, #f8fafc 0%, #eef2ff 100%)',
            display: 'grid',
            placeItems: 'center',
            color: '#334155',
            fontWeight: 600
          }}
        >
          Right-click to open incident actions
        </Box>

        <ContextMenu
          open={open}
          anchorPoint={point}
          state={state}
          stateText={stateText}
          closeOnSelect
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onSelect={(detail) => {
            setLastAction(detail.label || detail.value || 'unknown');
            toastAdvanced.success(`${detail.label || detail.value || 'Action'} executed`, { duration: 1100, theme: 'light' });
          }}
          items={[
            {
              label: 'Run Safety Validation',
              description: 'Check protocol consistency',
              icon: <ClipboardCheckIcon size={14} />,
              shortcut: 'V'
            },
            {
              label: 'Refresh Incident Stream',
              description: 'Rehydrate event context',
              icon: <RefreshCwIcon size={14} />,
              shortcut: 'R'
            },
            {
              label: 'Escalate to Supervisor',
              description: 'Critical route',
              icon: <AlertTriangleIcon size={14} />,
              shortcut: 'X'
            }
          ] as any}
        />

        <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<RefreshCwIcon size={14} />}
            onClick={() => {
              setState('loading');
              toastAdvanced.loading('Syncing action policies...', { duration: 900, theme: 'light' });
              window.setTimeout(() => setState('idle'), 950);
            }}
          >
            Loading
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<AlertTriangleIcon size={14} />}
            onClick={() => {
              setState('error');
              toastAdvanced.error('Policy service timeout', { duration: 1300, theme: 'light' });
            }}
          >
            Error
          </Button>
          <Button
            size="sm"
            variant="secondary"
            startIcon={<CheckCircleIcon size={14} />}
            onClick={() => {
              setState('success');
              toastAdvanced.success('Policy checks passed', { duration: 1000, theme: 'light' });
            }}
          >
            Success
          </Button>
        </Flex>

        <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Last action: {lastAction}</Box>
      </Grid>
    </Box>
  );
};

export const PersistentSelection = () => {
  const [last, setLast] = React.useState<string>('none');

  return (
    <Box style={{ ...cardStyle, maxInlineSize: 820 }}>
      <Grid style={{ display: 'grid', gap: 12 }}>
        <Flex align="center" justify="space-between" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Badge tone="info">Persistent Selection</Badge>
          <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Live preference panel</Box>
        </Flex>
        <Box
          id="ctx-functional"
          style={{
            padding: 16,
            border: '1px dashed #cbd5e1',
            borderRadius: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: '#334155',
            background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)'
          }}
        >
          <SparklesIcon size={14} />
          Toggle options (menu stays open)
        </Box>
        <ContextMenu
          open
          anchorId="ctx-functional"
          closeOnSelect={false}
          density="comfortable"
          shape="soft"
          onSelect={(detail) => {
            setLast(`${detail.label || detail.value || 'item'}${typeof detail.checked === 'boolean' ? ` (${detail.checked ? 'on' : 'off'})` : ''}`);
          }}
        >
          <div slot="menu">
            <div className="section-label">Layout Preferences</div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="true" data-value="show-grid" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Show Grid</span><span className="caption">Visual alignment overlay</span></span>
              <span className="shortcut">Cmd+G</span>
            </div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="false" data-value="snap" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Snap to Guides</span><span className="caption">Precision drag behavior</span></span>
              <span className="shortcut">Alt+S</span>
            </div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="true" data-value="context-hints" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Context Hints</span><span className="caption">Inline action recommendations</span></span>
              <span className="shortcut">Cmd+H</span>
            </div>
            <div className="separator" role="separator" />
            <div className="section-label">Theme Mode</div>
            <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="true" data-value="theme-light" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Theme: Light</span><span className="caption">High contrast workspace</span></span>
              <span className="shortcut">1</span>
            </div>
            <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="false" data-value="theme-dark" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Theme: Dark</span><span className="caption">Low-glare night shift mode</span></span>
              <span className="shortcut">2</span>
            </div>
            <div className="menuitem" role="menuitemradio" data-group="theme" aria-checked="false" data-value="theme-system" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Theme: System</span><span className="caption">Follow OS color scheme</span></span>
              <span className="shortcut">3</span>
            </div>
          </div>
        </ContextMenu>

        <Box style={{ fontSize: 12, color: 'var(--ui-color-muted, #64748b)' }}>Last action: {last}</Box>
      </Grid>
    </Box>
  );
};
