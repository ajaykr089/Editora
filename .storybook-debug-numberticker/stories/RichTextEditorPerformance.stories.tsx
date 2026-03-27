import type { Meta, StoryObj } from '@storybook/react';
import { EditoraEditor } from '@editora/react';
import { Box } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component/Performance',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: 'The large-document stress case is isolated here so it does not slow down the main Rich Text Editor docs page.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function generateLargeContent() {
  let content = '<h1>Large Document Performance Test</h1>';
  content += '<p><strong>This document contains 100 sections to stress test editor rendering and navigation.</strong></p>';

  for (let i = 1; i <= 100; i += 1) {
    content += `<h3>Section ${i}</h3>`;
    content += `<p>This is paragraph ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`;
    if (i % 10 === 0) {
      content += `<blockquote>Milestone: Completed ${i} sections.</blockquote>`;
    }
  }

  return content;
}

export const LargeDocument: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#ffebee', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Performance Test</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>
          This story is intentionally isolated because it mounts a large document and is meant for performance validation, not for the default docs page.
        </p>
      </Box>

      <EditoraEditor
        plugins={allNativePlugins}
        statusbar={{ enabled: true }}
        defaultValue={generateLargeContent()}
      />
    </div>
  ),
};
