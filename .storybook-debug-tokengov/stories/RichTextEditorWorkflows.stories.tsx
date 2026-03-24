import type { Meta, StoryObj } from '@storybook/react';
import { EditoraEditor } from '@editora/react';
import { Box, Grid } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component/Collaboration & Workflows',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: 'Workflow-heavy editor scenarios were split out so the base docs page no longer mounts every enterprise example at once.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FrameworkIndependence: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#f3e5f5', borderRadius: '4px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Framework Independence</h3>
        <p style={{ margin: 0, fontSize: '14px' }}>
          The same editor works in React, Vue, Angular, Svelte, or vanilla JavaScript.
        </p>

        <Grid style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '13px' }}>
          <Box style={{ padding: '10px', background: 'white', borderRadius: '4px' }}><strong>React:</strong><br /><code style={{ fontSize: '11px' }}>&lt;EditoraEditor /&gt;</code></Box>
          <Box style={{ padding: '10px', background: 'white', borderRadius: '4px' }}><strong>Vanilla JS:</strong><br /><code style={{ fontSize: '11px' }}>&lt;editora-editor&gt;</code></Box>
          <Box style={{ padding: '10px', background: 'white', borderRadius: '4px' }}><strong>Vue:</strong><br /><code style={{ fontSize: '11px' }}>&lt;editora-editor&gt;</code></Box>
          <Box style={{ padding: '10px', background: 'white', borderRadius: '4px' }}><strong>Angular:</strong><br /><code style={{ fontSize: '11px' }}>&lt;editora-editor&gt;</code></Box>
        </Grid>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={`
          <h2>Universal Editor</h2>
          <p><strong>Zero framework dependencies.</strong></p>
          <h3>Works With</h3>
          <ul>
            <li>React</li>
            <li>Vue.js</li>
            <li>Angular</li>
            <li>Svelte</li>
            <li>Vanilla JavaScript</li>
          </ul>
          <blockquote>Build once, use everywhere.</blockquote>
        `}
      />
    </div>
  ),
};

export const DocSchemaWorkflow: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '16px', padding: '14px', background: '#ecfdf5', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Doc Schema Workflow</h4>
        <p style={{ margin: 0, fontSize: '13px' }}>
          Use <code>Ctrl/Cmd+Alt+Shift+G</code> to open schema validation, review missing sections, and normalize structure.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true, position: 'bottom' }}
        defaultValue={`
          <h2>Q2 Access Control Policy Draft</h2>
          <h3>Policy Statement</h3>
          <p>All production access must be approved and logged.</p>
          <h3>Controls</h3>
          <p>Access reviews run monthly. Emergency access expires in 24 hours.</p>
        `}
      />
    </div>
  ),
};

export const TranslationWorkflowScenario: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '16px', padding: '14px', background: '#eff6ff', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Translation Workflow</h4>
        <p style={{ margin: 0, fontSize: '13px' }}>
          Use <code>Ctrl/Cmd+Alt+Shift+L</code> to open translation QA, capture source, and lock approved segments.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true, position: 'bottom' }}
        defaultValue={`
          <h2>Release Notes v4.8</h2>
          <p>Welcome {{firstName}}! Your order ID is %ORDER_ID%.</p>
          <p>Click <strong>Upgrade Now</strong> to activate premium analytics.</p>
          <p>For support, contact support@acme.com within 24 hours.</p>
        `}
      />
    </div>
  ),
};
