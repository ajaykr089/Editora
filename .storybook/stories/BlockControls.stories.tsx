import React from 'react';
import type { Meta } from '@storybook/react';
import { BlockControls, Box, Button, Flex, Grid } from '@editora/ui-react';
import { toastAdvanced } from '@editora/toast';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AlertTriangleIcon,
  BoldIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  ShieldIcon,
  SparklesIcon,
} from '@editora/react-icons';
import '../../packages/editora-toast/src/toast.css';
import '@editora/themes/themes/default.css';

const meta: Meta<typeof BlockControls> = {
  title: 'UI/BlockControls',
  component: BlockControls,
};

export default meta;

function EnterpriseClinicalComposerControls() {
  const [block, setBlock] = React.useState<'paragraph' | 'heading' | 'quote' | 'code'>('paragraph');
  const [align, setAlign] = React.useState<'left' | 'center' | 'right'>('left');
  const [bold, setBold] = React.useState(false);
  const [italic, setItalic] = React.useState(false);
  const [linking, setLinking] = React.useState(false);
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const applyChange = (label: string, callback: () => void) => {
    callback();
    toastAdvanced.info(`${label} updated`, { duration: 1200, theme: 'light' });
  };

  return (
    <Grid style={{ gap: 14, maxInlineSize: 1020 }}>
      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 16,
          padding: 16,
          background:
            'linear-gradient(136deg, color-mix(in srgb, var(--ui-color-primary, #2563eb) 7%, #fff) 0%, var(--ui-color-surface, #fff) 44%)',
        }}
      >
        <Flex align="center" justify="space-between" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Box>
            <Box style={{ fontWeight: 700, fontSize: 18 }}>Clinical Note Block Controls</Box>
            <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: 13, marginTop: 4 }}>
              Enterprise command strip for fast formatting, alignment, and assistive review actions.
            </Box>
          </Box>
          <Flex align="center" style={{ gap: 8, color: 'var(--ui-color-muted, #64748b)', fontSize: 12 }}>
            <ShieldIcon size={14} />
            Secure Shift Documentation
          </Flex>
        </Flex>
      </Box>

      <BlockControls
        ariaLabel="Clinical note formatting controls"
        variant="solid"
        tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'info'}
        state={state}
        wrap
        onNavigate={(detail) => {
          if (detail.key === 'Home' || detail.key === 'End') {
            toastAdvanced.info(`Navigation moved to control ${detail.toIndex + 1}/${detail.total}`, {
              duration: 1100,
              theme: 'light',
            });
          }
        }}
      >
        <Button
          size="sm"
          variant={block === 'paragraph' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Paragraph block', () => setBlock('paragraph'))}
        >
          P
        </Button>
        <Button
          size="sm"
          variant={block === 'heading' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Heading block', () => setBlock('heading'))}
        >
          H1
        </Button>
        <Button
          size="sm"
          variant={block === 'quote' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Quote block', () => setBlock('quote'))}
        >
          "
        </Button>
        <Button
          size="sm"
          variant={block === 'code' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Code block', () => setBlock('code'))}
        >
          <CodeIcon size={14} />
        </Button>

        <span data-separator aria-hidden="true" />

        <Button
          size="sm"
          variant={bold ? 'primary' : 'secondary'}
          onClick={() => applyChange('Bold', () => setBold((value) => !value))}
        >
          <BoldIcon size={14} />
        </Button>
        <Button
          size="sm"
          variant={italic ? 'primary' : 'secondary'}
          onClick={() => applyChange('Italic', () => setItalic((value) => !value))}
        >
          <ItalicIcon size={14} />
        </Button>
        <Button
          size="sm"
          variant={linking ? 'primary' : 'secondary'}
          onClick={() => applyChange('Clinical reference link', () => setLinking((value) => !value))}
        >
          <LinkIcon size={14} />
        </Button>

        <span data-separator aria-hidden="true" />

        <Button
          size="sm"
          variant={align === 'left' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Align left', () => setAlign('left'))}
        >
          <AlignLeftIcon size={14} />
        </Button>
        <Button
          size="sm"
          variant={align === 'center' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Align center', () => setAlign('center'))}
        >
          <AlignCenterIcon size={14} />
        </Button>
        <Button
          size="sm"
          variant={align === 'right' ? 'primary' : 'secondary'}
          onClick={() => applyChange('Align right', () => setAlign('right'))}
        >
          <AlignRightIcon size={14} />
        </Button>

        <span data-separator aria-hidden="true" />

        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('loading');
            toastAdvanced.info('Clinical AI review in progress', { duration: 1200, theme: 'light' });
            window.setTimeout(() => {
              setState('success');
              toastAdvanced.success('Safety suggestions applied', { duration: 1300, theme: 'light' });
            }, 900);
          }}
        >
          <SparklesIcon size={14} />
          Suggest
        </Button>
      </BlockControls>

      <Flex align="center" style={{ gap: 8, flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('idle');
            toastAdvanced.info('Controls returned to idle', { duration: 1100, theme: 'light' });
          }}
        >
          <ClockIcon size={14} />
          Idle
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setState('error');
            toastAdvanced.warning('Audit rule mismatch detected', { duration: 1400, theme: 'light' });
          }}
        >
          <AlertTriangleIcon size={14} />
          Simulate Error
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setState('success');
            toastAdvanced.success('Documentation policy checks passed', { duration: 1400, theme: 'light' });
          }}
        >
          <CheckCircleIcon size={14} />
          Mark Success
        </Button>
      </Flex>

      <Box
        style={{
          border: '1px solid var(--ui-color-border, #d8e1ec)',
          borderRadius: 14,
          padding: 12,
          background: 'var(--ui-color-surface, #fff)',
          fontSize: 13,
          color: 'var(--ui-color-muted, #64748b)',
        }}
      >
        Active block: <strong>{block}</strong> | Alignment: <strong>{align}</strong> | State: <strong>{state}</strong> | Style:{' '}
        <strong>
          {bold ? 'Bold ' : ''}
          {italic ? 'Italic ' : ''}
          {linking ? 'Linked' : 'Unlinked'}
        </strong>
      </Box>
    </Grid>
  );
}

export const EnterpriseClinicalComposer = () => <EnterpriseClinicalComposerControls />;
