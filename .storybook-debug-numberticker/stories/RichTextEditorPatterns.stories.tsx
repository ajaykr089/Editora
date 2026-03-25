import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from '@editora/plugins';
import { Box, Flex, Grid } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component/Patterns & State',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: 'State-heavy editor examples were moved here so the core docs page no longer renders multiple live instances at once.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PlaceholderPatterns: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Placeholder Patterns</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Simple, detailed, and prefilled placeholder states are grouped here instead of the main docs page.</p>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Simple Placeholder</h4>
          <EditoraEditor
            plugins={[BoldPlugin(), ItalicPlugin()]}
            toolbar={{ items: 'bold italic', showMoreOptions: false }}
            statusbar={{ enabled: true }}
            placeholder="Type something here..."
          />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Detailed Placeholder</h4>
          <EditoraEditor
            plugins={[BoldPlugin(), ItalicPlugin(), UnderlinePlugin()]}
            toolbar={{ items: 'bold italic underline', showMoreOptions: false }}
            statusbar={{ enabled: true }}
            placeholder="Draft release notes: summary, impact, migration steps, and rollback plan."
          />
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Prefilled Then Clear</h4>
          <EditoraEditor
            plugins={[BoldPlugin(), ItalicPlugin()]}
            toolbar={{ items: 'bold italic', showMoreOptions: false }}
            statusbar={{ enabled: true }}
            placeholder="Delete all content to show this placeholder."
            defaultValue="<p>This editor starts with content. Clear it to reveal placeholder.</p>"
          />
        </div>
      </Grid>
    </div>
  ),
};

export const ThemeSwitcherEditorOnly: Story = {
  render: () => {
    const [themeA, setThemeA] = useState<'default' | 'dark' | 'acme'>('default');
    const [themeB, setThemeB] = useState<'default' | 'dark' | 'acme'>('dark');

    const cycleTheme = (theme: 'default' | 'dark' | 'acme') => {
      if (theme === 'default') return 'dark';
      if (theme === 'dark') return 'acme';
      return 'default';
    };

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#ede7f6', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Theme Switcher (Editor Only)</h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
            Switch only the editor theme wrappers without changing the Storybook page theme.
          </p>
          <Flex style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setThemeA(cycleTheme(themeA))} style={{ padding: '8px 16px' }}>Cycle Editor A</button>
            <button onClick={() => setThemeB(cycleTheme(themeB))} style={{ padding: '8px 16px' }}>Cycle Editor B</button>
            <button onClick={() => { setThemeA('dark'); setThemeB('dark'); }} style={{ padding: '8px 16px' }}>Set Both Dark</button>
            <button onClick={() => { setThemeA('default'); setThemeB('default'); }} style={{ padding: '8px 16px' }}>Set Both Default</button>
            <button onClick={() => { setThemeA('acme'); setThemeB('acme'); }} style={{ padding: '8px 16px' }}>Set Both Acme</button>
          </Flex>
        </Box>

        <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div data-theme={themeA} style={{ padding: '10px', borderRadius: '8px', background: themeA === 'dark' ? '#0b1220' : themeA === 'acme' ? '#eef4fb' : '#ffffff' }}>
            <h4 style={{ margin: '0 0 8px 0', color: themeA === 'dark' ? '#f8fafc' : themeA === 'acme' ? '#0f4f4a' : '#111827' }}>Editor A</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{ showMoreOptions: false }} statusbar={{ enabled: true }} floatingToolbar={true} defaultValue="<p>Editor A theme is controlled independently.</p>" />
          </div>

          <div data-theme={themeB} style={{ padding: '10px', borderRadius: '8px', background: themeB === 'dark' ? '#0b1220' : themeB === 'acme' ? '#eef4fb' : '#ffffff' }}>
            <h4 style={{ margin: '0 0 8px 0', color: themeB === 'dark' ? '#f8fafc' : themeB === 'acme' ? '#0f4f4a' : '#111827' }}>Editor B</h4>
            <EditoraEditor plugins={allNativePlugins} toolbar={{ showMoreOptions: false }} statusbar={{ enabled: true }} floatingToolbar={true} defaultValue="<p>Editor B can use a different theme from Editor A.</p>" />
          </div>
        </Grid>
      </div>
    );
  },
};

export const MultipleEditors: Story = {
  render: () => {
    const [contentA, setContentA] = useState('');
    const [contentB, setContentB] = useState('');

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#fff9c4', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Multiple Editors</h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Two independent editor instances with content synchronization.</p>
          <Flex style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setContentB(contentA)} style={{ padding: '8px 16px' }}>Sync A → B</button>
            <button onClick={() => setContentA(contentB)} style={{ padding: '8px 16px' }}>Sync B → A</button>
          </Flex>
        </Box>

        <Grid style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4>Editor A</h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              onChange={setContentA}
              defaultValue="<h3>Editor A</h3><p>Type here...</p>"
            />
          </div>
          <div>
            <h4>Editor B</h4>
            <EditoraEditor
              plugins={allNativePlugins}
              toolbar={{ showMoreOptions: false }}
              statusbar={{ enabled: true }}
              value={contentB}
              onChange={setContentB}
              defaultValue="<h3>Editor B</h3><p>Type here...</p>"
            />
          </div>
        </Grid>
      </div>
    );
  },
};

export const ControlledEditor: Story = {
  render: () => {
    const [value, setValue] = useState(`
      <h2>Controlled Editor</h2>
      <p>This editor's content is controlled by React state.</p>
    `);

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#e0f2f1', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Controlled Component</h4>
          <Flex style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setValue(`<h2>Reset!</h2><p>Content was reset at ${new Date().toLocaleTimeString()}</p>`)} style={{ padding: '8px 16px' }}>
              Reset Content
            </button>
            <button onClick={() => setValue((prev) => prev + `<p>Appended at ${new Date().toLocaleTimeString()}</p>`)} style={{ padding: '8px 16px' }}>
              Append Content
            </button>
          </Flex>
        </Box>

        <EditoraEditor plugins={allNativePlugins} statusbar={{ enabled: true }} value={value} onChange={setValue} />
      </div>
    );
  },
};
