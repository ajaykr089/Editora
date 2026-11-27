import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Question, Questionnaire } from '@editora/ui-react';

const meta: Meta<typeof Questionnaire> = {
  title: 'UI/Questionnaire',
  component: Questionnaire,
};
export default meta;
type Story = StoryObj<typeof Questionnaire>;

export const ClarifyATask: Story = {
  render: function Render() {
    const [answers, setAnswers] = React.useState<string>('');
    return (
      <Box style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
        <Questionnaire shortcuts onSubmit={(values) => setAnswers(JSON.stringify(values))}>
          <Question name="scope" label="What should I build?" description="Pick one" required>
            <option value="web">A web app</option>
            <option value="api" data-description="REST or GraphQL">An API</option>
            <option value="cli">A command-line tool</option>
          </Question>
          <Question name="auth" label="Which sign-in methods?" type="multiple" when="scope:web">
            <option value="email">Email and password</option>
            <option value="google">Google</option>
            <option value="github">GitHub</option>
          </Question>
          <Question name="language" label="Which language?" allowOther>
            <option value="ts">TypeScript</option>
            <option value="py">Python</option>
          </Question>
          <Question name="notes" label="Anything else I should know?" type="text" placeholder="Optional" />
          <p slot="complete">Thanks, starting now.</p>
        </Questionnaire>
        {answers ? <pre style={{ margin: 0, fontSize: 'var(--ui-font-size-sm, 13px)' }}>{answers}</pre> : null}
      </Box>
    );
  },
};

export const FromData: Story = {
  render: () => (
    <Box style={{ maxWidth: 520 }}>
      <Questionnaire
        items={[
          { name: 'role', label: 'What is your role?', required: true, options: [{ value: 'dev', label: 'Developer' }, { value: 'design', label: 'Designer' }] },
          { name: 'team', label: 'How big is your team?', options: [{ value: 'solo', label: 'Just me' }, { value: 'small', label: '2-10' }, { value: 'large', label: 'More than 10' }] },
        ]}
        defaultValues={{ role: 'dev' }}
      />
    </Box>
  ),
};
