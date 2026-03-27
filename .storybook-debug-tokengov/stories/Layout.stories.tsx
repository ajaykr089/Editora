import { Layout } from '@editora/ui-react';
import { layoutArgTypes, LayoutPlayground } from './layout.shared';
import { ArgsTable, Description, Primary, Stories, Title, PRIMARY_STORY } from '@storybook/addon-docs';

export default {
  title: 'UI/Layout',
  component: Layout,
  argTypes: layoutArgTypes,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description>
            The `Layout` component is a thin wrapper around the underlying `ui-layout` web component.
            Use the composable slot helpers to render layout regions:
          </Description>
          <Description>
{`\
\`\`\`tsx
import { Layout } from '@editora/ui-react';

<Layout>
  <Layout.Header>...</Layout.Header>
  <Layout.Sidebar>...</Layout.Sidebar>
  <Layout.Content>...</Layout.Content>
  <Layout.Aside>...</Layout.Aside>
  <Layout.Footer>...</Layout.Footer>
</Layout>
\`\`\`
`}
          </Description>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
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
