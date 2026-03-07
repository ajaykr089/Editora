import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EditoraEditor } from '@editora/react';
import {
  BoldPlugin,
  ContentRulesPlugin,
  HistoryPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  TablePlugin,
  UnderlinePlugin
} from '@editora/plugins';
import { Box, Button, Dialog, Flex, Grid, Tabs, Toast, type ToastElement } from '@editora/ui-react';
import '@editora/themes/themes/default.css';

type CardProps = {
  title: string;
  value: string;
  note: string;
};

const Card = ({ title, value, note }: CardProps) => (
  <Box
    variant="surface"
    p="12px"
    radius="md"
    style={{
      border: '1px solid #e2e8f0',
      background: '#fff'
    }}
  >
    <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</div>
    <div style={{ marginTop: 6, fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{value}</div>
    <div style={{ marginTop: 6, fontSize: 13, color: '#475569' }}>{note}</div>
  </Box>
);

type ModalProps = {
  open: boolean;
  onClose: () => void;
  onPublish: () => void;
};

const Modal = ({ open, onClose, onPublish }: ModalProps) => (
  <Dialog
    open={open}
    title="Publish Editorial Update"
    description="Confirm release notes and compliance checks before publishing."
    submitText="Publish"
    cancelText="Cancel"
    dismissible
    closeOnOverlay
    closeOnEsc
    onDialogSubmit={onPublish}
    onDialogClose={onClose}
  >
    <Grid gap="10px">
      <Box variant="outline" p="10px" radius="sm" color="#475569">
        This release updates customer-facing workflows and internal policy wording.
      </Box>
      <Box variant="surface" p="10px" radius="sm" color="#334155">
        Ensure terminology and risk statements pass content rules before approval.
      </Box>
    </Grid>
  </Dialog>
);

const plugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  LinkPlugin(),
  ListPlugin(),
  TablePlugin(),
  HistoryPlugin(),
  ContentRulesPlugin({
    bannedWords: ['obviously', 'simply'],
    requiredHeadings: ['Summary'],
    maxSentenceWords: 30,
    minReadabilityScore: 55,
    enableRealtime: true
  })
];

const meta: Meta = {
  title: 'Editor/AI SaaS Workspace'
};

export default meta;
type Story = StoryObj;

export const EnterpriseEditorOps: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const [publishOpen, setPublishOpen] = React.useState(false);
    const [contentLength, setContentLength] = React.useState(0);
    const [saving, setSaving] = React.useState(false);
    const toastRef = React.useRef<ToastElement | null>(null);

    const notify = React.useCallback((message: string, type: 'success' | 'error' | 'info' | 'loading' = 'info') => {
      toastRef.current?.show(message, { type, theme: 'light', duration: 1400 });
    }, []);

    const saveDraft = React.useCallback(() => {
      if (saving) return;
      setSaving(true);
      notify('Saving draft...', 'loading');
      window.setTimeout(() => {
        setSaving(false);
        notify('Draft saved to editorial queue', 'success');
      }, 900);
    }, [notify, saving]);

    return (
      <Grid gap="14px" style={{ maxWidth: 1120, margin: '0 auto', padding: 8 }}>
        <Toast ref={toastRef} position="bottom-right" theme="light" />

        <Flex justify="between" align="center" wrap="wrap" gap="10px">
          <Box>
            <h2 style={{ margin: 0, fontSize: 28, color: '#0f172a' }}>Editorial Operations Workspace</h2>
            <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>
              AI-assisted release drafting, review workflows, and policy-safe publishing.
            </p>
          </Box>
          <Flex gap="8px">
            <Button onClick={saveDraft}>{saving ? 'Saving...' : 'Save Draft'}</Button>
            <Button variant="secondary" onClick={() => setPublishOpen(true)}>
              Open Modal
            </Button>
          </Flex>
        </Flex>

        <Grid columns={{ initial: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="10px">
          <Card title="Documents" value="48" note="6 pending legal review" />
          <Card title="Open Comments" value="129" note="22 unresolved blockers" />
          <Card title="Content Risk" value="Low" note="No banned terms detected" />
          <Card title="Current Draft" value={`${contentLength} chars`} note="Realtime onChange tracked" />
        </Grid>

        <Box variant="surface" p="12px" radius="md" style={{ border: '1px solid #e2e8f0' }}>
          <Tabs selected={activeTab} variant="soft" onChange={setActiveTab}>
            <div slot="tab" data-value="draft">Draft</div>
            <div slot="panel">
              <EditoraEditor
                plugins={plugins}
                statusbar={{ enabled: true, position: 'bottom' }}
                toolbar={{ items: 'undo redo | bold italic underline | link | bullist numlist | table', sticky: true }}
                defaultValue="<h2>Summary</h2><p>Draft your enterprise release update here.</p>"
                onChange={(html) => setContentLength(html.length)}
              />
            </div>

            <div slot="tab" data-value="review">Review</div>
            <div slot="panel">
              <Grid gap="8px">
                <Box variant="outline" p="10px" radius="sm" color="#475569">
                  Reviewer queue: Product, Legal, Security.
                </Box>
                <Button size="sm" onClick={() => notify('Review checklist refreshed', 'info')}>
                  Refresh Checklist
                </Button>
              </Grid>
            </div>

            <div slot="tab" data-value="publish">Publish</div>
            <div slot="panel">
              <Grid gap="8px">
                <Box variant="outline" p="10px" radius="sm" color="#475569">
                  Final release gating passed. You can publish this document now.
                </Box>
                <Button size="sm" onClick={() => setPublishOpen(true)}>
                  Open Publish Modal
                </Button>
              </Grid>
            </div>
          </Tabs>
        </Box>

        <Modal
          open={publishOpen}
          onClose={() => setPublishOpen(false)}
          onPublish={() => {
            notify('Release published successfully', 'success');
            setPublishOpen(false);
          }}
        />
      </Grid>
    );
  }
};
