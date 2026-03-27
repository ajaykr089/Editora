import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin, LinkPlugin, StrikethroughPlugin, UnderlinePlugin } from '@editora/plugins';
import { Box, Flex } from '@editora/ui-react';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import { allNativePlugins } from './richTextEditor.shared';

const meta: Meta<typeof EditoraEditor> = {
  title: 'Editor/Rich Text Editor - Web Component',
  component: EditoraEditor,
  parameters: {
    layout: 'padded',
    docs: {
      source: { type: 'code' },
      description: {
        component: `
# Editora Web Component - Core Docs

This page now only contains the core introduction stories so docs stay responsive.

Additional examples were split into dedicated pages:
- \`Formatting & Content\`
- \`Patterns & State\`
- \`Collaboration & Workflows\`
- \`Performance\`

Use those sub-stories when you want the heavier scenarios without loading every example on one docs page.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <EditoraEditor
      plugins={allNativePlugins}
      statusbar={{ enabled: true, position: 'bottom' }}
      floatingToolbar={true}
      defaultValue={`
        <h2>Welcome to Editora</h2>
        <p>This is a <strong>framework-agnostic</strong> rich text editor with a broad native plugin surface.</p>
        <p>✨ <strong>Core capabilities:</strong></p>
        <ul>
          <li>Zero framework dependencies in the editor runtime</li>
          <li>Works with React, Vue, Angular, Svelte, and vanilla web apps</li>
          <li>Large native plugin catalog for enterprise workflows</li>
          <li>Declarative TinyMCE-style API</li>
        </ul>
        <p>Use this page for the lightweight overview. Heavier scenario docs live in dedicated subpages.</p>
      `}
    />
  ),
};

export const WebComponentAPI: Story = {
  render: () => {
    const editorRef = useRef<any>(null);
    const [output, setOutput] = useState('');
    const [pluginCount, setPluginCount] = useState(0);
    const [version, setVersion] = useState('');

    useEffect(() => {
      if (typeof window !== 'undefined' && (window as any).Editora) {
        const Editora = (window as any).Editora;
        setVersion(Editora.version || 'N/A');
        setPluginCount(Editora.plugins?.length || 0);
      }
    }, []);

    const getContent = () => {
      if (editorRef.current) setOutput(editorRef.current.innerHTML);
    };

    const setContent = () => {
      if (!editorRef.current) return;
      editorRef.current.innerHTML = `
        <h3>Content Set via API</h3>
        <p>Updated at: ${new Date().toLocaleTimeString()}</p>
        <p>This was set using the Web Component API.</p>
      `;
    };

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Global Editora API</h4>
          <p style={{ margin: '5px 0' }}>Version: <strong>{version}</strong></p>
          <p style={{ margin: '5px 0' }}>Plugins Available: <strong>{pluginCount}</strong></p>
          <Flex style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button onClick={getContent} style={{ padding: '8px 16px' }}>Get Content</button>
            <button onClick={setContent} style={{ padding: '8px 16px' }}>Set Content</button>
          </Flex>
        </Box>

        <div ref={editorRef}>
          <EditoraEditor
            plugins={allNativePlugins}
            statusbar={{ enabled: true }}
            defaultValue={`
              <h3>Web Component API Demo</h3>
              <p>This editor can be controlled via the global <code>window.Editora</code> object.</p>
              <p>Try the buttons above to interact with the editor programmatically.</p>
            `}
          />
        </div>

        {output ? (
          <Box style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Output</h4>
            <pre style={{ overflow: 'auto', fontSize: '12px' }}>{output}</pre>
          </Box>
        ) : null}
      </div>
    );
  },
};

export const CustomToolbar: Story = {
  render: () => (
    <div>
      <Box style={{ marginBottom: '20px', padding: '15px', background: '#fff3e0', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Custom Toolbar</h4>
        <p style={{ margin: 0, fontSize: '14px' }}>Only essential formatting tools are shown in the toolbar.</p>
      </Box>

      <EditoraEditor
        plugins={[
          BoldPlugin(),
          ItalicPlugin(),
          UnderlinePlugin(),
          StrikethroughPlugin(),
          LinkPlugin(),
          HistoryPlugin(),
        ]}
        statusbar={{ enabled: true }}
        toolbar={{
          items: 'undo redo | bold italic underline strikethrough | link',
          sticky: true,
        }}
        defaultValue={`
          <h2>Minimal Editor</h2>
          <p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>
          <p>Perfect for comments, lightweight review flows, or simple text input.</p>
        `}
      />
    </div>
  ),
};

export const ReadonlyMode: Story = {
  render: () => {
    const [readonly, setReadonly] = useState(true);

    return (
      <div>
        <Box style={{ marginBottom: '20px', padding: '15px', background: '#f3e5f5', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Readonly Mode</h4>
          <button onClick={() => setReadonly(!readonly)} style={{ padding: '8px 16px' }}>
            {readonly ? 'Enable Editing' : 'Disable Editing'}
          </button>
        </Box>

        <EditoraEditor
          plugins={allNativePlugins}
          statusbar={{ enabled: true }}
          readonly={readonly}
          defaultValue={`
            <h2>Readonly Content</h2>
            <p>This content is <strong>${readonly ? 'readonly' : 'editable'}</strong>.</p>
            <p>Click the button above to toggle editing mode.</p>
            <ul>
              <li>Useful for previews and audit views</li>
              <li>Good for formatted document display</li>
              <li>Supports review-mode workflows</li>
            </ul>
          `}
        />
      </div>
    );
  },
};
