import React from 'react';
import { Box, Flex, Grid, Tabs } from '@editora/ui-react';

export default {
  title: 'UI/Tabs',
  component: Tabs,
  argTypes: {
    selected: { control: { type: 'number', min: 0, max: 5, step: 1 } },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    activation: { control: 'select', options: ['auto', 'manual'] },
    variant: {
      control: 'select',
      options: [
        'default',
        'soft',
        'outline',
        'solid',
        'ghost',
        'glass',
        'indicator',
        'indicator-line',
        'underline',
        'line',
        'segmented',
        'cards',
        'contrast',
        'minimal'
      ]
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    density: { control: 'select', options: ['default', 'compact', 'comfortable'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] },
    shape: { control: 'select', options: ['rounded', 'square', 'pill'] },
    elevation: { control: 'select', options: ['low', 'none', 'high'] },
    loop: { control: 'boolean' },
    stretched: { control: 'boolean' },
    bare: { control: 'boolean' }
  }
};

export const EnterpriseWorkspace = (args: any) => {
  const [selected, setSelected] = React.useState(Number(args.selected ?? 0));

  return (
    <Grid gap="12px" style={{ maxWidth: 860 }}>
      <Tabs
        selected={selected}
        orientation={args.orientation || 'horizontal'}
        activation={args.activation || 'auto'}
        variant={args.variant || 'soft'}
        size={args.size || 'md'}
        density={args.density || 'default'}
        tone={args.tone || 'brand'}
        shape={args.shape || 'rounded'}
        elevation={args.elevation || 'low'}
        stretched={Boolean(args.stretched)}
        bare={Boolean(args.bare)}
        loop={args.loop ?? true}
        onChange={setSelected}
      >
        <div slot="tab" data-value="overview" data-icon="📊">Overview</div>
        <div slot="panel">Workspace KPIs, revenue velocity, and trend deltas for this week.</div>

        <div slot="tab" data-value="activity" data-icon="🕒">Activity</div>
        <div slot="panel">Approvals, assignments, and SLA response timeline across teams.</div>

        <div slot="tab" data-value="permissions" data-icon="🔐">Permissions</div>
        <div slot="panel">Role-based access mapping with tenant-level override rules.</div>

        <div slot="tab" data-value="webhooks" data-icon="⚡">Webhooks</div>
        <div slot="panel">Delivery retries, endpoint errors, and queue throughput analytics.</div>
      </Tabs>

      <Box style={{ fontSize: 13, color: '#475569' }}>
        Selected tab index: <strong>{selected}</strong>
      </Box>
    </Grid>
  );
};

EnterpriseWorkspace.args = {
  selected: 0,
  orientation: 'horizontal',
  activation: 'auto',
  variant: 'soft',
  size: 'md',
  density: 'default',
  tone: 'brand',
  shape: 'rounded',
  elevation: 'low',
  loop: true,
  stretched: false,
  bare: false
};

export const DesignPatterns = () => (
  <Grid gap="14px" style={{ maxWidth: 980 }}>
    <Tabs variant="segmented" selected={0}>
      <div slot="tab" data-value="board">Board</div>
      <div slot="panel">Segmented pattern: compact for switch-like workflows.</div>
      <div slot="tab" data-value="list">List</div>
      <div slot="panel">Best for light mode admin dashboards with dense controls.</div>
      <div slot="tab" data-value="timeline">Timeline</div>
      <div slot="panel">Provides clear mode switching with high scanability.</div>
    </Tabs>

    <Tabs variant="line" selected={1}>
      <div slot="tab" data-value="critical">Critical</div>
      <div slot="panel">Line pattern: minimal visual noise for data-heavy layouts.</div>
      <div slot="tab" data-value="standard">Standard</div>
      <div slot="panel">Keeps the active state clear while preserving table focus.</div>
      <div slot="tab" data-value="longtail">Long-tail</div>
      <div slot="panel">Great for settings surfaces with many small sections.</div>
    </Tabs>

    <Tabs variant="cards" shape="square" selected={0}>
      <div slot="tab" data-value="pending" data-icon="🩺">Pending</div>
      <div slot="panel">Cards pattern: stronger surface separation for enterprise portals.</div>
      <div slot="tab" data-value="approved" data-icon="✅">Approved</div>
      <div slot="panel">Works well in operations dashboards and compliance screens.</div>
      <div slot="tab" data-value="archived" data-icon="📦">Archived</div>
      <div slot="panel">Square corners support flat UI systems without custom CSS forks.</div>
    </Tabs>

    <Box variant="contrast" p="14px" radius="lg">
      <Tabs variant="contrast" tone="warning" size="lg" stretched selected={2}>
        <div slot="tab" data-value="alerts">Alerts</div>
        <div slot="panel">Contrast pattern for command-center and dark operational themes.</div>
        <div slot="tab" data-value="runtime">Runtime</div>
        <div slot="panel">Large hit targets improve usability in high-pressure contexts.</div>
        <div slot="tab" data-value="logs">Logs</div>
        <div slot="panel">Color contrast and focus ring remain WCAG-friendly.</div>
      </Tabs>
    </Box>
  </Grid>
);

export const AdditionalVariants = () => (
  <Grid gap="14px" style={{ maxWidth: 980 }}>
    <Tabs variant="outline" selected={0}>
      <div slot="tab" data-value="summary">Summary</div>
      <div slot="panel">Outline style for admin dashboards that prefer clear strokes over fills.</div>
      <div slot="tab" data-value="queues">Queues</div>
      <div slot="panel">Strong contrast in low-noise layouts.</div>
      <div slot="tab" data-value="history">History</div>
      <div slot="panel">Easy to theme with token overrides.</div>
    </Tabs>

    <Tabs variant="solid" tone="success" selected={1}>
      <div slot="tab" data-value="healthy">Healthy</div>
      <div slot="panel">Solid style acts like mode chips for operational UIs.</div>
      <div slot="tab" data-value="monitoring">Monitoring</div>
      <div slot="panel">Selected tab remains highly visible.</div>
      <div slot="tab" data-value="alerts">Alerts</div>
      <div slot="panel">Works with success/warning/danger tones.</div>
    </Tabs>

    <Tabs variant="ghost" selected={0}>
      <div slot="tab" data-value="week">Week</div>
      <div slot="panel">Ghost style removes container chrome for embedded views.</div>
      <div slot="tab" data-value="month">Month</div>
      <div slot="panel">Good with tables/charts where tab chrome should be minimal.</div>
      <div slot="tab" data-value="quarter">Quarter</div>
      <div slot="panel">Still keyboard/focus accessible.</div>
    </Tabs>

    <Tabs variant="glass" selected={2}>
      <div slot="tab" data-value="north">North</div>
      <div slot="panel">Glass style for modern high-end SaaS shells.</div>
      <div slot="tab" data-value="south">South</div>
      <div slot="panel">Uses transparent surfaces and backdrop blur.</div>
      <div slot="tab" data-value="global">Global</div>
      <div slot="panel">Useful when page backgrounds are textured.</div>
    </Tabs>
  </Grid>
);

export const AnimatedIndicators = () => (
  <Grid gap="14px" style={{ maxWidth: 980 }}>
    <Tabs variant="indicator" selected={1}>
      <div slot="tab" data-value="triage">Triage</div>
      <div slot="panel">Moving pill indicator for modern SaaS top navigation.</div>
      <div slot="tab" data-value="review">Review</div>
      <div slot="panel">Selection motion follows click and keyboard transitions.</div>
      <div slot="tab" data-value="approved">Approved</div>
      <div slot="panel">Tab labels stay readable while indicator animates beneath.</div>
      <div slot="tab" data-value="done">Done</div>
      <div slot="panel">Works with overflow and reduced motion settings.</div>
    </Tabs>

    <Tabs variant="indicator-line" selected={0}>
      <div slot="tab" data-value="overview">Overview</div>
      <div slot="panel">Animated underline indicator for low-noise enterprise surfaces.</div>
      <div slot="tab" data-value="ops">Ops</div>
      <div slot="panel">The line tracks active tab width and position.</div>
      <div slot="tab" data-value="audit">Audit</div>
      <div slot="panel">Strong visual hierarchy for data-dense workflows.</div>
      <div slot="tab" data-value="logs">Logs</div>
      <div slot="panel">Keyboard navigation updates the line instantly.</div>
    </Tabs>

    <Tabs variant="indicator-line" orientation="vertical" activation="manual" loop={false} selected={2}>
      <div slot="tab" data-value="profile">Profile</div>
      <div slot="panel">Vertical mode uses a side indicator rail.</div>
      <div slot="tab" data-value="billing">Billing</div>
      <div slot="panel">Manual activation remains supported.</div>
      <div slot="tab" data-value="security">Security</div>
      <div slot="panel">Line indicator adapts to vertical dimensions.</div>
      <div slot="tab" data-value="notifications">Notifications</div>
      <div slot="panel">Loop disabled prevents wrap-around navigation.</div>
    </Tabs>
  </Grid>
);

export const VerticalEdgeScenarios = () => (
  <Box style={{ maxWidth: 980 }}>
    <Tabs orientation="vertical" activation="manual" variant="underline" loop={false} selected={1}>
      <div slot="tab" data-value="profile">Profile</div>
      <div slot="panel">Manual activation: arrow keys move focus; Enter/Space commits selection.</div>

      <div slot="tab" data-value="billing">Billing</div>
      <div slot="panel">Loop disabled: navigation stops at first/last enabled tab.</div>

      <div slot="tab" data-value="security" data-disabled="true">Security (Disabled)</div>
      <div slot="panel">Disabled tabs are skipped in keyboard traversal and cannot be selected.</div>

      <div slot="tab" data-value="notifications">Notifications</div>
      <div slot="panel">Vertical overflow remains scrollable for large tab sets.</div>
    </Tabs>
  </Box>
);

export const FlatBareEnterprise = () => (
  <Grid gap="12px" style={{ maxWidth: 920 }}>
    <Box
      variant="surface"
      p="12px"
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: 6,
        ['--ui-tabs-border' as any]: '#94a3b8',
        ['--ui-tabs-accent' as any]: '#0f172a',
        ['--ui-tabs-nav-bg' as any]: '#ffffff',
        ['--ui-tabs-panel-bg' as any]: '#ffffff'
      }}
    >
      <Tabs variant="minimal" shape="square" elevation="none" bare selected={0}>
        <div slot="tab" data-value="summary">Summary</div>
        <div slot="panel">Flat tabs: no default shadow, sharp edges, token-based control retained.</div>

        <div slot="tab" data-value="financials">Financials</div>
        <div slot="panel">Useful for teams that enforce strict flat design language.</div>

        <div slot="tab" data-value="notes">Notes</div>
        <div slot="panel">Still supports tone/size variants without visual debt.</div>
      </Tabs>
    </Box>

    <Flex gap="10px" wrap="wrap">
      <Tabs variant="default" size="sm" shape="square" elevation="none" selected={0}>
        <div slot="tab" data-value="a">A</div>
        <div slot="panel">Small</div>
        <div slot="tab" data-value="b">B</div>
        <div slot="panel">Small</div>
      </Tabs>

      <Tabs variant="default" size="md" shape="rounded" elevation="low" selected={0}>
        <div slot="tab" data-value="a">A</div>
        <div slot="panel">Medium</div>
        <div slot="tab" data-value="b">B</div>
        <div slot="panel">Medium</div>
      </Tabs>

      <Tabs variant="default" size="lg" shape="pill" elevation="high" selected={0}>
        <div slot="tab" data-value="a">A</div>
        <div slot="panel">Large</div>
        <div slot="tab" data-value="b">B</div>
        <div slot="panel">Large</div>
      </Tabs>
    </Flex>
  </Grid>
);

export const DensityModes = () => (
  <Grid gap="12px" style={{ maxWidth: 980 }}>
    <Tabs variant="soft" density="compact" selected={0}>
      <div slot="tab" data-value="compact-a">Compact A</div>
      <div slot="panel">Compact density for data-heavy enterprise screens.</div>
      <div slot="tab" data-value="compact-b">Compact B</div>
      <div slot="panel">Tighter spacing with preserved tap targets.</div>
    </Tabs>

    <Tabs variant="soft" density="default" selected={0}>
      <div slot="tab" data-value="default-a">Default A</div>
      <div slot="panel">Balanced default density for most dashboard workflows.</div>
      <div slot="tab" data-value="default-b">Default B</div>
      <div slot="panel">Good middle ground for mixed content.</div>
    </Tabs>

    <Tabs variant="soft" density="comfortable" selected={0}>
      <div slot="tab" data-value="comfortable-a">Comfortable A</div>
      <div slot="panel">Comfortable density for touch-heavy and executive views.</div>
      <div slot="tab" data-value="comfortable-b">Comfortable B</div>
      <div slot="panel">Improved spacing and larger targets.</div>
    </Tabs>
  </Grid>
);

export const OverflowWithScroll = () => (
  <Tabs variant="soft" selected={5}>
    <div slot="tab" data-value="mon">Mon</div><div slot="panel">Mon capacity</div>
    <div slot="tab" data-value="tue">Tue</div><div slot="panel">Tue capacity</div>
    <div slot="tab" data-value="wed">Wed</div><div slot="panel">Wed capacity</div>
    <div slot="tab" data-value="thu">Thu</div><div slot="panel">Thu capacity</div>
    <div slot="tab" data-value="fri">Fri</div><div slot="panel">Fri capacity</div>
    <div slot="tab" data-value="sat">Sat</div><div slot="panel">Sat capacity</div>
    <div slot="tab" data-value="sun">Sun</div><div slot="panel">Sun capacity</div>
    <div slot="tab" data-value="next">Next Week</div><div slot="panel">Next week planning</div>
  </Tabs>
);
