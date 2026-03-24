import React from 'react';
import { Box, Flex, Grid } from '@editora/ui-react';
import { Tabs } from '@editora/ui-react';

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
        'default', 'soft', 'outline', 'solid', 'ghost', 'glass',
        'indicator', 'indicator-line', 'underline', 'line',
        'segmented', 'cards', 'contrast', 'minimal'
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
        <Tabs.Tab value="overview" icon="📊">Overview</Tabs.Tab>
        <Tabs.Panel>Workspace KPIs, revenue velocity, and trend deltas for this week.</Tabs.Panel>

        <Tabs.Tab value="activity" icon="🕒">Activity</Tabs.Tab>
        <Tabs.Panel>Approvals, assignments, and SLA response timeline across teams.</Tabs.Panel>

        <Tabs.Tab value="permissions" icon="🔐">Permissions</Tabs.Tab>
        <Tabs.Panel>Role-based access mapping with tenant-level override rules.</Tabs.Panel>

        <Tabs.Tab value="webhooks" icon="⚡">Webhooks</Tabs.Tab>
        <Tabs.Panel>Delivery retries, endpoint errors, and queue throughput analytics.</Tabs.Panel>
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
      <Tabs.Tab value="board">Board</Tabs.Tab>
      <Tabs.Panel>Segmented pattern: compact for switch-like workflows.</Tabs.Panel>
      <Tabs.Tab value="list">List</Tabs.Tab>
      <Tabs.Panel>Best for light mode admin dashboards with dense controls.</Tabs.Panel>
      <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
      <Tabs.Panel>Provides clear mode switching with high scanability.</Tabs.Panel>
    </Tabs>

    <Tabs variant="line" selected={1}>
      <Tabs.Tab value="critical">Critical</Tabs.Tab>
      <Tabs.Panel>Line pattern: minimal visual noise for data-heavy layouts.</Tabs.Panel>
      <Tabs.Tab value="standard">Standard</Tabs.Tab>
      <Tabs.Panel>Keeps the active state clear while preserving table focus.</Tabs.Panel>
      <Tabs.Tab value="longtail">Long-tail</Tabs.Tab>
      <Tabs.Panel>Great for settings surfaces with many small sections.</Tabs.Panel>
    </Tabs>

    <Tabs variant="cards" shape="square" selected={0}>
      <Tabs.Tab value="pending" icon="🩺">Pending</Tabs.Tab>
      <Tabs.Panel>Cards pattern: stronger surface separation for enterprise portals.</Tabs.Panel>
      <Tabs.Tab value="approved" icon="✅">Approved</Tabs.Tab>
      <Tabs.Panel>Works well in operations dashboards and compliance screens.</Tabs.Panel>
      <Tabs.Tab value="archived" icon="📦">Archived</Tabs.Tab>
      <Tabs.Panel>Square corners support flat UI systems without custom CSS forks.</Tabs.Panel>
    </Tabs>

    <Box variant="contrast" p="14px" radius="lg">
      <Tabs variant="contrast" tone="warning" size="lg" stretched selected={2}>
        <Tabs.Tab value="alerts">Alerts</Tabs.Tab>
        <Tabs.Panel>Contrast pattern for command-center and dark operational themes.</Tabs.Panel>
        <Tabs.Tab value="runtime">Runtime</Tabs.Tab>
        <Tabs.Panel>Large hit targets improve usability in high-pressure contexts.</Tabs.Panel>
        <Tabs.Tab value="logs">Logs</Tabs.Tab>
        <Tabs.Panel>Color contrast and focus ring remain WCAG-friendly.</Tabs.Panel>
      </Tabs>
    </Box>
  </Grid>
);

export const AdditionalVariants = () => (
  <Grid gap="14px" style={{ maxWidth: 980 }}>
    <Tabs variant="outline" selected={0}>
      <Tabs.Tab value="summary">Summary</Tabs.Tab>
      <Tabs.Panel>Outline style for admin dashboards that prefer clear strokes over fills.</Tabs.Panel>
      <Tabs.Tab value="queues">Queues</Tabs.Tab>
      <Tabs.Panel>Strong contrast in low-noise layouts.</Tabs.Panel>
      <Tabs.Tab value="history">History</Tabs.Tab>
      <Tabs.Panel>Easy to theme with token overrides.</Tabs.Panel>
    </Tabs>

    <Tabs variant="solid" tone="success" selected={1}>
      <Tabs.Tab value="healthy">Healthy</Tabs.Tab>
      <Tabs.Panel>Solid style acts like mode chips for operational UIs.</Tabs.Panel>
      <Tabs.Tab value="monitoring">Monitoring</Tabs.Tab>
      <Tabs.Panel>Selected tab remains highly visible.</Tabs.Panel>
      <Tabs.Tab value="alerts">Alerts</Tabs.Tab>
      <Tabs.Panel>Works with success/warning/danger tones.</Tabs.Panel>
    </Tabs>

    <Tabs variant="ghost" selected={0}>
      <Tabs.Tab value="week">Week</Tabs.Tab>
      <Tabs.Panel>Ghost style removes container chrome for embedded views.</Tabs.Panel>
      <Tabs.Tab value="month">Month</Tabs.Tab>
      <Tabs.Panel>Good with tables/charts where tab chrome should be minimal.</Tabs.Panel>
      <Tabs.Tab value="quarter">Quarter</Tabs.Tab>
      <Tabs.Panel>Still keyboard/focus accessible.</Tabs.Panel>
    </Tabs>

    <Tabs variant="glass" selected={2}>
      <Tabs.Tab value="north">North</Tabs.Tab>
      <Tabs.Panel>Glass style for modern high-end SaaS shells.</Tabs.Panel>
      <Tabs.Tab value="south">South</Tabs.Tab>
      <Tabs.Panel>Uses transparent surfaces and backdrop blur.</Tabs.Panel>
      <Tabs.Tab value="global">Global</Tabs.Tab>
      <Tabs.Panel>Useful when page backgrounds are textured.</Tabs.Panel>
    </Tabs>
  </Grid>
);

export const AnimatedIndicators = () => (
  <Grid gap="14px" style={{ maxWidth: 980 }}>
    <Tabs variant="indicator" selected={1}>
      <Tabs.Tab value="triage">Triage</Tabs.Tab>
      <Tabs.Panel>Moving pill indicator for modern SaaS top navigation.</Tabs.Panel>
      <Tabs.Tab value="review">Review</Tabs.Tab>
      <Tabs.Panel>Selection motion follows click and keyboard transitions.</Tabs.Panel>
      <Tabs.Tab value="approved">Approved</Tabs.Tab>
      <Tabs.Panel>Tab labels stay readable while indicator animates beneath.</Tabs.Panel>
      <Tabs.Tab value="done">Done</Tabs.Tab>
      <Tabs.Panel>Works with overflow and reduced motion settings.</Tabs.Panel>
    </Tabs>

    <Tabs variant="indicator-line" selected={0}>
      <Tabs.Tab value="overview">Overview</Tabs.Tab>
      <Tabs.Panel>Animated underline indicator for low-noise enterprise surfaces.</Tabs.Panel>
      <Tabs.Tab value="ops">Ops</Tabs.Tab>
      <Tabs.Panel>The line tracks active tab width and position.</Tabs.Panel>
      <Tabs.Tab value="audit">Audit</Tabs.Tab>
      <Tabs.Panel>Strong visual hierarchy for data-dense workflows.</Tabs.Panel>
      <Tabs.Tab value="logs">Logs</Tabs.Tab>
      <Tabs.Panel>Keyboard navigation updates the line instantly.</Tabs.Panel>
    </Tabs>

    <Tabs variant="indicator-line" orientation="vertical" activation="manual" loop={false} selected={2}>
      <Tabs.Tab value="profile">Profile</Tabs.Tab>
      <Tabs.Panel>Vertical mode uses a side indicator rail.</Tabs.Panel>
      <Tabs.Tab value="billing">Billing</Tabs.Tab>
      <Tabs.Panel>Manual activation remains supported.</Tabs.Panel>
      <Tabs.Tab value="security">Security</Tabs.Tab>
      <Tabs.Panel>Line indicator adapts to vertical dimensions.</Tabs.Panel>
      <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
      <Tabs.Panel>Loop disabled prevents wrap-around navigation.</Tabs.Panel>
    </Tabs>
  </Grid>
);

export const VerticalEdgeScenarios = () => (
  <Box style={{ maxWidth: 980 }}>
    <Tabs orientation="vertical" activation="manual" variant="underline" loop={false} selected={1}>
      <Tabs.Tab value="profile">Profile</Tabs.Tab>
      <Tabs.Panel>Manual activation: arrow keys move focus; Enter/Space commits selection.</Tabs.Panel>

      <Tabs.Tab value="billing">Billing</Tabs.Tab>
      <Tabs.Panel>Loop disabled: navigation stops at first/last enabled tab.</Tabs.Panel>

      <Tabs.Tab value="security" disabled>Security (Disabled)</Tabs.Tab>
      <Tabs.Panel>Disabled tabs are skipped in keyboard traversal and cannot be selected.</Tabs.Panel>

      <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
      <Tabs.Panel>Vertical overflow remains scrollable for large tab sets.</Tabs.Panel>
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
        <Tabs.Tab value="summary">Summary</Tabs.Tab>
        <Tabs.Panel>Flat tabs: no default shadow, sharp edges, token-based control retained.</Tabs.Panel>
        <Tabs.Tab value="financials">Financials</Tabs.Tab>
        <Tabs.Panel>Useful for teams that enforce strict flat design language.</Tabs.Panel>
        <Tabs.Tab value="notes">Notes</Tabs.Tab>
        <Tabs.Panel>Still supports tone/size variants without visual debt.</Tabs.Panel>
      </Tabs>
    </Box>

    <Flex gap="10px" wrap="wrap">
      <Tabs variant="default" size="sm" shape="square" elevation="none" selected={0}>
        <Tabs.Tab value="a">A</Tabs.Tab><Tabs.Panel>Small</Tabs.Panel>
        <Tabs.Tab value="b">B</Tabs.Tab><Tabs.Panel>Small</Tabs.Panel>
      </Tabs>

      <Tabs variant="default" size="md" shape="rounded" elevation="low" selected={0}>
        <Tabs.Tab value="a">A</Tabs.Tab><Tabs.Panel>Medium</Tabs.Panel>
        <Tabs.Tab value="b">B</Tabs.Tab><Tabs.Panel>Medium</Tabs.Panel>
      </Tabs>

      <Tabs variant="default" size="lg" shape="pill" elevation="high" selected={0}>
        <Tabs.Tab value="a">A</Tabs.Tab><Tabs.Panel>Large</Tabs.Panel>
        <Tabs.Tab value="b">B</Tabs.Tab><Tabs.Panel>Large</Tabs.Panel>
      </Tabs>
    </Flex>
  </Grid>
);

export const DensityModes = () => (
  <Grid gap="12px" style={{ maxWidth: 980 }}>
    <Tabs variant="soft" density="compact" selected={0}>
      <Tabs.Tab value="compact-a">Compact A</Tabs.Tab>
      <Tabs.Panel>Compact density for data-heavy enterprise screens.</Tabs.Panel>
      <Tabs.Tab value="compact-b">Compact B</Tabs.Tab>
      <Tabs.Panel>Tighter spacing with preserved tap targets.</Tabs.Panel>
    </Tabs>

    <Tabs variant="soft" density="default" selected={0}>
      <Tabs.Tab value="default-a">Default A</Tabs.Tab>
      <Tabs.Panel>Balanced default density for most dashboard workflows.</Tabs.Panel>
      <Tabs.Tab value="default-b">Default B</Tabs.Tab>
      <Tabs.Panel>Good middle ground for mixed content.</Tabs.Panel>
    </Tabs>

    <Tabs variant="soft" density="comfortable" selected={0}>
      <Tabs.Tab value="comfortable-a">Comfortable A</Tabs.Tab>
      <Tabs.Panel>Comfortable density for touch-heavy and executive views.</Tabs.Panel>
      <Tabs.Tab value="comfortable-b">Comfortable B</Tabs.Tab>
      <Tabs.Panel>Improved spacing and larger targets.</Tabs.Panel>
    </Tabs>
  </Grid>
);

export const OverflowWithScroll = () => (
  <Tabs variant="soft" selected={5}>
    <Tabs.Tab value="mon">Mon</Tabs.Tab><Tabs.Panel>Mon capacity</Tabs.Panel>
    <Tabs.Tab value="tue">Tue</Tabs.Tab><Tabs.Panel>Tue capacity</Tabs.Panel>
    <Tabs.Tab value="wed">Wed</Tabs.Tab><Tabs.Panel>Wed capacity</Tabs.Panel>
    <Tabs.Tab value="thu">Thu</Tabs.Tab><Tabs.Panel>Thu capacity</Tabs.Panel>
    <Tabs.Tab value="fri">Fri</Tabs.Tab><Tabs.Panel>Fri capacity</Tabs.Panel>
    <Tabs.Tab value="sat">Sat</Tabs.Tab><Tabs.Panel>Sat capacity</Tabs.Panel>
    <Tabs.Tab value="sun">Sun</Tabs.Tab><Tabs.Panel>Sun capacity</Tabs.Panel>
    <Tabs.Tab value="next">Next Week</Tabs.Tab><Tabs.Panel>Next week planning</Tabs.Panel>
  </Tabs>
);
