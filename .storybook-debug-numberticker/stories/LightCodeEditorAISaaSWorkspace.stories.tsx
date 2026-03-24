import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { toastAdvanced } from '@editora/toast';
import {
  BracketMatchingExtension,
  CodeFoldingExtension,
  LineNumbersExtension,
  SearchExtension,
  SyntaxHighlightingExtension,
  ThemeExtension,
  createEditor
} from '@editora/light-code-editor';
import { Box, Button, Dialog, Flex, Grid, Tabs } from '@editora/ui-react';
import '../../packages/light-code-editor/dist/light-code-editor.css';

const meta: Meta = {
  title: 'AI/Light Code Editor SaaS Workspace'
};

export default meta;
type Story = StoryObj;

const starterCode = `export function buildReleasePayload(input) {
  const timestamp = new Date().toISOString();
  return {
    ...input,
    generatedAt: timestamp,
    status: "ready"
  };
}
`;

const Modal = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog
    open={open}
    title="Code Policy Approval"
    description="Approve lint and security checks before publishing snippet."
    submitText="Approve"
    cancelText="Cancel"
    onDialogSubmit={() => {
      toastAdvanced.success('Code policy approved', { theme: 'light', duration: 1200 });
      onClose();
    }}
    onDialogClose={onClose}
  >
    <Box variant="outline" p="10px" radius="sm" color="#475569">
      Checks: naming conventions, export policy, and readonly review mode compliance.
    </Box>
  </Dialog>
);

export const DeveloperCodeWorkspace: Story = {
  render: () => {
    const hostRef = React.useRef<HTMLDivElement | null>(null);
    const editorRef = React.useRef<any>(null);
    const [tab, setTab] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [readonly, setReadonly] = React.useState(false);
    const [chars, setChars] = React.useState(starterCode.length);

    React.useEffect(() => {
      if (!hostRef.current) return;

      editorRef.current?.destroy?.();
      editorRef.current = createEditor(hostRef.current, {
        value: starterCode,
        theme: 'dark',
        readOnly: readonly,
        extensions: [
          new ThemeExtension(),
          new LineNumbersExtension(),
          new SyntaxHighlightingExtension(),
          new SearchExtension({ replaceAndFindNext: true }),
          new BracketMatchingExtension(),
          new CodeFoldingExtension()
        ]
      });

      editorRef.current.on('change', () => {
        const next = editorRef.current.getValue();
        setChars(next.length);
      });

      return () => editorRef.current?.destroy?.();
    }, [readonly]);

    return (
      <Grid gap="14px" style={{ maxWidth: 1120, margin: '0 auto', padding: 8 }}>
        <Flex justify="between" align="center" wrap="wrap" gap="10px">
          <Box>
            <h2 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>Light Code Editor Workspace</h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>SaaS developer workspace for source review and policy-safe publishing.</p>
          </Box>
          <Flex gap="8px">
            <Button
              onClick={() => {
                toastAdvanced.loading('Validating source...', { theme: 'light', duration: 850 });
                setTimeout(() => toastAdvanced.success('Validation complete', { theme: 'light', duration: 1200 }), 900);
              }}
            >
              Validate
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setReadonly((prev) => !prev);
                toastAdvanced.info(`Readonly ${!readonly ? 'enabled' : 'disabled'}`, { theme: 'light', duration: 1000 });
              }}
            >
              Toggle Readonly
            </Button>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Open Modal
            </Button>
          </Flex>
        </Flex>

        <Grid columns={{ initial: '1fr', md: '1fr 1fr 1fr' }} gap="10px">
          <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Characters</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700 }}>{chars}</div>
          </Box>
          <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Theme</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700 }}>Dark</div>
          </Box>
          <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: 12, color: '#64748b' }}>Mode</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700 }}>{readonly ? 'Readonly' : 'Editable'}</div>
          </Box>
        </Grid>

        <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
          <Tabs selected={tab} variant="soft" onChange={setTab}>
            <div slot="tab" data-value="editor">Editor</div>
            <div slot="panel">
              <div
                ref={hostRef}
                style={{
                  minHeight: 360,
                  border: '1px solid #0f172a',
                  borderRadius: 10,
                  overflow: 'hidden'
                }}
              />
            </div>

            <div slot="tab" data-value="commands">Commands</div>
            <div slot="panel">
              <Flex gap="8px" wrap="wrap">
                <Button size="sm" onClick={() => editorRef.current?.executeCommand?.('find')}>Find</Button>
                <Button size="sm" onClick={() => editorRef.current?.executeCommand?.('replace')}>Replace</Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    editorRef.current?.setValue?.(starterCode);
                    toastAdvanced.success('Editor reset to starter code', { theme: 'light', duration: 1000 });
                  }}
                >
                  Reset Code
                </Button>
              </Flex>
            </div>
          </Tabs>
        </Box>

        <Modal open={open} onClose={() => setOpen(false)} />
      </Grid>
    );
  }
};
