import { Layout } from '@editora/ui-react';
import { layoutArgTypes, LayoutPlayground } from './layout.shared';

export default {
  title: 'UI/Layout',
  component: Layout,
  argTypes: layoutArgTypes
};

export const Playground = (args: any) => <LayoutPlayground {...args} />;

Playground.args = {
  mode: 'dashboard',
  variant: 'default',
  density: 'default',
  maxWidth: 'xl',
  sidebarSide: 'start',
  collapsed: false,
  sidebarWidth: '280px',
  asideWidth: '320px'
};
