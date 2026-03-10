import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Button, ContextMenu, Flex, Grid } from '@editora/ui-react';
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  LayersIcon,
  RefreshCwIcon,
  ShieldIcon,
  SparklesIcon
} from '@editora/react-icons';
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

const shell: React.CSSProperties = {
  maxInlineSize: 1040,
  marginInline: 'auto',
  padding: 24,
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)',
  borderRadius: 20,
  background:
    'radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)'
};

const panel: React.CSSProperties = {
  padding: 20,
  borderRadius: 16,
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent)',
  background: 'color-mix(in srgb, white 94%, #eff6ff 6%)'
};

const workspace: React.CSSProperties = {
  minHeight: 240,
  borderRadius: 18,
  border: '1px dashed #94a3b8',
  background:
    'linear-gradient(155deg, rgba(248, 250, 252, 1) 0%, rgba(238, 242, 255, 0.92) 48%, rgba(239, 246, 255, 0.86) 100%)',
  display: 'grid',
  placeItems: 'center',
  padding: 24,
  color: '#334155'
};

const anchorCard: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 16,
  borderRadius: 14,
  border: '1px solid rgba(148, 163, 184, 0.28)',
  background: 'rgba(255, 255, 255, 0.82)'
};

const baseItems = [
  {
    label: 'Run Safety Validation',
    description: 'Check policy consistency before publish',
    icon: <ClipboardCheckIcon size={14} />,
    shortcut: 'V'
  },
  {
    label: 'Refresh Incident Stream',
    description: 'Rehydrate timeline state from live events',
    icon: <RefreshCwIcon size={14} />,
    shortcut: 'R'
  },
  {
    label: 'Open Command Workspace',
    description: 'Jump into the elevated operator flow',
    icon: <LayersIcon size={14} />,
    shortcut: 'W'
  },
  { separator: true },
  {
    label: 'Escalate to Supervisor',
    description: 'Requires privileged confirmation',
    icon: <AlertTriangleIcon size={14} />,
    shortcut: 'X'
  }
];

function StoryShell(props: { eyebrow: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <Box style={shell}>
      <Grid style={{ display: 'grid', gap: 20 }}>
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ marginBottom: 8, color: '#475569', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {props.eyebrow}
            </div>
            <div style={{ fontSize: 28, lineHeight: 1.15, fontWeight: 700, color: '#0f172a' }}>{props.title}</div>
            <div style={{ marginTop: 8, maxInlineSize: 640, color: '#475569', fontSize: 14, lineHeight: 1.55 }}>{props.subtitle}</div>
          </div>
          <Badge tone="info">Context Menu</Badge>
        </Flex>
        {props.children}
      </Grid>
    </Box>
  );
}

function PlaygroundStory(args: any) {
  const generatedAnchorId = React.useId().replace(/:/g, '');
  const anchorId = args.anchorId || `ctx-story-anchor-${generatedAnchorId}`;
  const [menu, setMenu] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });

  const openFromAnchor = React.useCallback(() => {
    const anchor = document.getElementById(anchorId);
    if (!(anchor instanceof HTMLElement)) return;
    const rect = anchor.getBoundingClientRect();
    setMenu({
      open: true,
      point: {
        x: rect.left + Math.min(32, Math.max(16, rect.width * 0.24)),
        y: rect.bottom - 12
      }
    });
  }, [anchorId]);

  React.useEffect(() => {
    if (args.open) {
      openFromAnchor();
      return;
    }
    setMenu((current) => (current.open ? { ...current, open: false } : current));
  }, [args.open, openFromAnchor]);

  const interactiveDisabled = !!args.disabled || args.state === 'loading';

  return (
    <StoryShell
      eyebrow="Anchored Surface"
      title="Controlled anchor menu with premium spacing and low runtime churn"
      subtitle="This story keeps the menu closed by default and lets you inspect visual variants, focus behavior, and layout density without forcing an always-open docs render."
    >
      <Grid style={{ display: 'grid', gap: 16 }}>
        <Box style={panel}>
          <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Incident action rail</div>
              <div style={{ marginTop: 4, color: '#64748b', fontSize: 13 }}>Click or right-click the anchor below to open the menu and inspect anchored behavior.</div>
            </div>
            <Flex align="center" style={{ gap: 10, flexWrap: 'wrap' }}>
              <Badge tone="info">Docs-safe</Badge>
              <Button
                variant="secondary"
                disabled={interactiveDisabled}
                onClick={() => {
                  if (menu.open) {
                    setMenu((current) => ({ ...current, open: false }));
                    return;
                  }
                  openFromAnchor();
                }}
                startIcon={<SparklesIcon size={14} />}
              >
                {menu.open ? 'Close menu' : 'Open menu'}
              </Button>
            </Flex>
          </Flex>
        </Box>

        <div
          id={anchorId}
          style={{
            ...workspace,
            minHeight: 180
          }}
          onClick={() => {
            if (interactiveDisabled) return;
            openFromAnchor();
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            if (interactiveDisabled) return;
            setMenu({ open: true, point: { x: event.clientX, y: event.clientY } });
          }}
        >
          <div style={anchorCard}>
            <Flex align="center" style={{ gap: 10 }}>
              <ShieldIcon size={16} />
              <div style={{ fontWeight: 700 }}>Policy Anchor Surface</div>
            </Flex>
            <div style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5 }}>Click or right-click here to open the anchored menu. Use Storybook controls to inspect visual variants.</div>
            <div style={{ color: '#94a3b8', fontSize: 12 }}>Anchor id: {anchorId}</div>
          </div>
        </div>

        <ContextMenu
          {...args}
          open={menu.open}
          anchorPoint={menu.point}
          items={baseItems as any}
          onClose={() => {
            setMenu((current) => ({ ...current, open: false }));
            args.onClose?.();
          }}
          onChange={(nextOpen) => {
            setMenu((current) => ({ ...current, open: nextOpen }));
            args.onChange?.(nextOpen);
          }}
        />
      </Grid>
    </StoryShell>
  );
}

export const Playground: StoryObj<typeof ContextMenu> = {
  render: (args) => <PlaygroundStory {...args} />,
  args: {
  open: false,
  anchorId: 'ctx-story-anchor',
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
  }
};

export const IncidentWorkflow = () => {
  const [menu, setMenu] = React.useState<{ open: boolean; point?: { x: number; y: number } }>({ open: false });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [lastAction, setLastAction] = React.useState('None');

  const statusText =
    status === 'loading'
      ? 'Syncing operator policies'
      : status === 'error'
        ? 'Escalation route unavailable'
        : status === 'success'
          ? 'Safety checks passed'
          : '';

  return (
    <StoryShell
      eyebrow="Point Invocation"
      title="Right-click workflow designed for dense enterprise canvases"
      subtitle="This is the high-stress context-menu path: point-based invocation, controlled close behavior, and lightweight state transitions without toasts or extra docs churn."
    >
      <Grid style={{ display: 'grid', gap: 16 }}>
        <Box
          style={workspace}
          onContextMenu={(event) => {
            event.preventDefault();
            setMenu({ open: true, point: { x: event.clientX, y: event.clientY } });
          }}
        >
          <Grid style={{ display: 'grid', gap: 12, justifyItems: 'center', textAlign: 'center' }}>
            <Flex align="center" style={{ gap: 10 }}>
              <ShieldIcon size={16} />
              <span style={{ fontWeight: 700 }}>Critical Escalation Workspace</span>
            </Flex>
            <div style={{ maxInlineSize: 520, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
              Right-click anywhere in this surface to open incident actions. The menu stays lightweight so the story remains responsive under Storybook docs rendering.
            </div>
            <Badge tone={status === 'error' ? 'danger' : status === 'success' ? 'success' : status === 'loading' ? 'warning' : 'info'}>{status.toUpperCase()}</Badge>
          </Grid>
        </Box>

        <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <Button variant="secondary" onClick={() => setStatus('loading')} startIcon={<RefreshCwIcon size={14} />}>
            Loading
          </Button>
          <Button variant="secondary" onClick={() => setStatus('error')} startIcon={<AlertTriangleIcon size={14} />}>
            Error
          </Button>
          <Button variant="secondary" onClick={() => setStatus('success')} startIcon={<CheckCircleIcon size={14} />}>
            Success
          </Button>
        </Grid>

        <Box style={panel}>
          <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
            <div style={{ color: '#475569', fontSize: 14 }}>Last selected action</div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{lastAction}</div>
          </Flex>
        </Box>

        <ContextMenu
          open={menu.open}
          anchorPoint={menu.point}
          state={status}
          stateText={statusText}
          closeOnSelect
          onClose={() => setMenu((current) => ({ ...current, open: false }))}
          onSelect={(detail) => {
            setLastAction(detail.label || detail.value || 'Unknown');
            setMenu((current) => ({ ...current, open: false }));
          }}
          items={baseItems as any}
        />
      </Grid>
    </StoryShell>
  );
};

export const PersistentSelection = () => {
  const [open, setOpen] = React.useState(false);
  const [last, setLast] = React.useState('No change yet');

  return (
    <StoryShell
      eyebrow="Persistent Controls"
      title="Preference editing with non-destructive menu selection"
      subtitle="This variant keeps the menu open while toggles and radios update, making it a better demo for production-style settings panels than an always-open static example."
    >
      <Grid style={{ display: 'grid', gap: 16 }}>
        <Flex align="center" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Button id="ctx-persistent-anchor" variant="secondary" onClick={() => setOpen((value) => !value)} startIcon={<SparklesIcon size={14} />}>
            {open ? 'Close preferences' : 'Open preferences'}
          </Button>
          <Badge tone="info">closeOnSelect=false</Badge>
        </Flex>

        <Box style={panel}>
          <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
            <div style={{ color: '#475569', fontSize: 14 }}>Most recent preference update</div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{last}</div>
          </Flex>
        </Box>

        <ContextMenu
          open={open}
          anchorId="ctx-persistent-anchor"
          closeOnSelect={false}
          density="comfortable"
          shape="soft"
          onClose={() => setOpen(false)}
          onSelect={(detail) => {
            const label = detail.label || detail.value || 'item';
            const checked = typeof detail.checked === 'boolean' ? ` (${detail.checked ? 'on' : 'off'})` : '';
            setLast(`${label}${checked}`);
          }}
        >
          <div slot="menu">
            <div className="section-label">Layout Preferences</div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="true" data-value="grid" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Show Grid</span><span className="caption">Visual alignment overlay</span></span>
              <span className="shortcut">G</span>
            </div>
            <div className="menuitem" role="menuitemcheckbox" aria-checked="false" data-value="guides" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Snap to Guides</span><span className="caption">Precision drag behavior</span></span>
              <span className="shortcut">S</span>
            </div>
            <div className="separator" role="separator" />
            <div className="section-label">Mode</div>
            <div className="menuitem" role="menuitemradio" data-group="mode" aria-checked="true" data-value="review" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Review</span><span className="caption">High-signal inspection workflow</span></span>
              <span className="shortcut">1</span>
            </div>
            <div className="menuitem" role="menuitemradio" data-group="mode" aria-checked="false" data-value="build" tabIndex={0}>
              <span className="icon selection-icon" aria-hidden="true" />
              <span className="label"><span className="text">Build</span><span className="caption">Fast execution mode</span></span>
              <span className="shortcut">2</span>
            </div>
          </div>
        </ContextMenu>
      </Grid>
    </StoryShell>
  );
};
