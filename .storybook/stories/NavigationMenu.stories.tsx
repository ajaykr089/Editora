import React from 'react';
import { NavigationMenu , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  argTypes: {
    selected: { control: 'number' },
    orientation: { control: { type: 'radio', options: ['horizontal', 'vertical'] } },
    activation: { control: { type: 'radio', options: ['automatic', 'manual'] } },
    loop: { control: 'boolean' },
    collapsible: { control: 'boolean' }
  }
};

function ProductMenu(props: any) {
  return (
    <NavigationMenu {...props} style={{ maxWidth: 860 }}>
      <button slot="item">Overview</button>
      <button slot="item">Components</button>
      <button slot="item">Resources</button>

      <section slot="panel">
        <Grid style={{ display: 'grid', gap: 4 }}>
          <strong>Overview</strong>
          <span style={{ fontSize: 13, color: '#475569' }}>Roadmap, release notes, and workspace activity.</span>
        </Grid>
      </section>
      <section slot="panel">
        <Grid style={{ display: 'grid', gap: 6 }}>
          <strong>Components</strong>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#475569', fontSize: 13 }}>
            <li>Combobox</li>
            <li>Badge</li>
            <li>Table</li>
            <li>Context Menu</li>
          </ul>
        </Grid>
      </section>
      <section slot="panel">
        <Grid style={{ display: 'grid', gap: 4 }}>
          <strong>Resources</strong>
          <span style={{ fontSize: 13, color: '#475569' }}>Developer docs, tokens, and Storybook examples.</span>
        </Grid>
      </section>
    </NavigationMenu>
  );
}

export const Default = (args: any) => <ProductMenu {...args} />;
Default.args = {
  selected: 0,
  orientation: 'horizontal',
  activation: 'automatic',
  loop: true
};

export const ManualActivation = (args: any) => (
  <ProductMenu {...args} activation="manual" />
);
ManualActivation.args = {
  selected: 1
};

export const Vertical = (args: any) => (
  <NavigationMenu {...args} orientation="vertical" style={{ maxWidth: 360 }}>
    <button slot="item">Dashboard</button>
    <button slot="item">Analytics</button>
    <button slot="item">Billing</button>

    <section slot="panel">
      <strong>Dashboard links</strong>
    </section>
    <section slot="panel">
      <strong>Analytics links</strong>
    </section>
    <section slot="panel">
      <strong>Billing links</strong>
    </section>
  </NavigationMenu>
);
Vertical.args = {
  selected: 0
};

export const Controlled = () => {
  const [selected, setSelected] = React.useState(0);
  return (
    <Grid style={{ display: 'grid', gap: 10 }}>
      <ProductMenu selected={selected} onSelect={(next) => setSelected(next)} />
      <Box style={{ fontSize: 13, color: '#475569' }}>Selected index: {selected}</Box>
    </Grid>
  );
};
