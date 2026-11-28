import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LoginBlock } from '../../packages/ui-react/blocks/block-login';
import { SettingsProfileBlock } from '../../packages/ui-react/blocks/block-settings-profile';
import { DashboardBlock } from '../../packages/ui-react/blocks/block-dashboard';
import { AppShellBlock } from '../../packages/ui-react/blocks/block-app-shell';
import { ChatBlock, type ChatMessage } from '../../packages/ui-react/blocks/block-chat';
import { SignupBlock } from '../../packages/ui-react/blocks/block-signup';
import { PricingBlock } from '../../packages/ui-react/blocks/block-pricing';
import { OrdersBlock } from '../../packages/ui-react/blocks/block-orders';
import { CheckoutBlock } from '../../packages/ui-react/blocks/block-checkout';
import { TeamBlock } from '../../packages/ui-react/blocks/block-team';
import { FaqBlock } from '../../packages/ui-react/blocks/block-faq';
import { EmptyStateBlock } from '../../packages/ui-react/blocks/block-empty-state';
import { NotFoundBlock } from '../../packages/ui-react/blocks/block-not-found';

// Copyable page sections (`npx @editora/cli add block-<name>`), rendered as they ship.
const meta: Meta = { title: 'Blocks', parameters: { layout: 'fullscreen' } };
export default meta;
type Story = StoryObj;

export const Login: Story = { render: () => <LoginBlock /> };
export const SettingsProfile: Story = { render: () => <SettingsProfileBlock defaultValues={{ name: 'Ada Lovelace', email: 'ada@example.com' }} /> };
export const Dashboard: Story = { render: () => <DashboardBlock /> };
export const AppShell: Story = {
  render: () => (
    <div style={{ height: 480 }}>
      <AppShellBlock>
        <p>Page content goes here.</p>
      </AppShellBlock>
    </div>
  ),
};

const MESSAGES: ChatMessage[] = [
  { id: '1', role: 'user', text: 'Why does the build fail?', time: '10:40' },
  { id: '2', role: 'assistant', text: 'Vite 7 needs Node 20.19 or later, and CI runs Node 18. Upgrade the Node version in the workflow.', time: '10:41' },
];
export const Chat: Story = {
  render: function Render() {
    const [messages, setMessages] = React.useState(MESSAGES);
    return (
      <div style={{ padding: 16, maxWidth: 720 }}>
        <ChatBlock
          messages={messages}
          height={480}
          onSend={(text) => setMessages((list) => [...list, { id: String(list.length + 1), role: 'user', text }])}
        />
      </div>
    );
  },
};

export const Signup: Story = { render: () => <SignupBlock /> };
export const Pricing: Story = { render: () => <PricingBlock /> };
export const Orders: Story = { render: () => <div style={{ padding: 16 }}><OrdersBlock /></div> };
export const Checkout: Story = { render: () => <CheckoutBlock /> };
export const Team: Story = { render: () => <div style={{ padding: 16 }}><TeamBlock /></div> };
export const Faq: Story = { render: () => <FaqBlock /> };
export const EmptyState: Story = { render: () => <div style={{ padding: 16 }}><EmptyStateBlock /></div> };
export const NotFound: Story = { render: () => <NotFoundBlock /> };
