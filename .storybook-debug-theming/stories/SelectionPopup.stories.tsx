import React, { useState } from 'react';
import { Box, Button, Flex, Grid, SelectionPopup } from '@editora/ui-react';

export default {
  title: 'UI/SelectionPopup',
  component: SelectionPopup,
  argTypes: {
    open: { control: 'boolean' },
    anchorId: { control: 'text' },
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right', 'auto'] },
    variant: { control: 'select', options: ['default', 'surface', 'soft', 'glass', 'contrast'] },
    tone: { control: 'select', options: ['brand', 'success', 'warning', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    arrow: { control: 'boolean' },
    closeOnOutside: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
  }
};

export const Playground = (args: any) => {
  const [open, setOpen] = useState(!!args.open);
  const [message, setMessage] = useState('No action selected');
  const anchorId = args.anchorId || 'sel-anchor';

  return (
    <Grid style={{ display: 'grid', gap: 14 }}>
      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setOpen(true)}>Show popup</Button>
        <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Hide popup</Button>
      </Flex>

      <Box
        id={anchorId}
        style={{ margin: 42, padding: 18, border: '1px dashed #94a3b8', borderRadius: 12, display: 'inline-block', background: '#f8fafc' }}
      >
        Highlight this paragraph region to trigger formatting actions.
      </Box>

      <SelectionPopup
        anchorId={anchorId}
        open={open}
        placement={args.placement || 'top'}
        variant={args.variant || 'glass'}
        size={args.size || 'md'}
        arrow={args.arrow ?? true}
        closeOnOutside={args.closeOnOutside ?? true}
        closeOnEscape={args.closeOnEscape ?? true}
        onClose={() => setOpen(false)}
      >
        <SelectionPopup.Content style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" onClick={() => setMessage('Bold applied')}>Bold</Button>
          <Button size="sm" variant="secondary" onClick={() => setMessage('Comment added')}>Comment</Button>
          <Button size="sm" variant="ghost" onClick={() => setMessage('Tag created')}>Tag</Button>
        </SelectionPopup.Content>
      </SelectionPopup>

      <Box style={{ fontSize: 13, color: '#475569' }}>{message}</Box>
    </Grid>
  );
};

Playground.args = {
  open: true,
  anchorId: 'sel-anchor',
  placement: 'top',
  variant: 'glass',
  size: 'md',
  arrow: true,
  closeOnOutside: true,
  closeOnEscape: true,
};

export const CompositionSlots = () => {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState('—');

  return (
    <Grid style={{ display: 'grid', gap: 16, padding: 16 }}>
      <Box style={{ fontSize: 12, color: '#94a3b8' }}>SelectionPopup.Content slot</Box>

      <Box
        id="comp-anchor"
        style={{ padding: 20, border: '1px dashed #94a3b8', borderRadius: 10, background: '#f8fafc', display: 'inline-block' }}
      >
        Selected text region — popup anchors here.
      </Box>

      <SelectionPopup
        anchorId="comp-anchor"
        open={open}
        placement="top"
        variant="surface"
        arrow
        closeOnOutside
        onClose={() => setOpen(false)}
      >
        <SelectionPopup.Content style={{ display: 'flex', gap: 6, padding: 4 }}>
          <Button size="sm" onClick={() => { setMessage('Bold'); setOpen(false); }}>B</Button>
          <Button size="sm" variant="secondary" onClick={() => { setMessage('Italic'); setOpen(false); }}>I</Button>
          <Button size="sm" variant="secondary" onClick={() => { setMessage('Underline'); setOpen(false); }}>U</Button>
          <Button size="sm" variant="ghost" onClick={() => { setMessage('Link'); setOpen(false); }}>🔗</Button>
        </SelectionPopup.Content>
      </SelectionPopup>

      <Flex style={{ display: 'flex', gap: 8 }}>
        <Button size="sm" onClick={() => setOpen(true)}>Reopen</Button>
        <Box style={{ fontSize: 13, color: '#475569', alignSelf: 'center' }}>Last action: <strong>{message}</strong></Box>
      </Flex>
    </Grid>
  );
};

export const PlacementMatrix = () => {
  const [openId, setOpenId] = useState('top-anchor');

  const items = [
    { id: 'top-anchor', label: 'Top', placement: 'top' as const, variant: 'glass' as const },
    { id: 'right-anchor', label: 'Right', placement: 'right' as const, variant: 'soft' as const },
    { id: 'bottom-anchor', label: 'Bottom', placement: 'bottom' as const, variant: 'soft' as const },
    { id: 'left-anchor', label: 'Left', placement: 'left' as const, variant: 'contrast' as const },
  ];

  return (
    <Grid style={{ display: 'grid', gap: 16 }}>
      <Flex style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {items.map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant={openId === item.id ? 'primary' : 'secondary'}
            onClick={() => setOpenId(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </Flex>

      <Flex style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        {items.map((item) => (
          <Box
            key={item.id}
            id={item.id}
            style={{ minWidth: 130, padding: 14, borderRadius: 10, border: '1px solid #cbd5e1', background: '#ffffff' }}
          >
            Anchor: {item.label}
            <SelectionPopup
              anchorId={item.id}
              open={openId === item.id}
              placement={item.placement}
              variant={item.variant}
              arrow
              closeOnOutside
              onClose={() => setOpenId('')}
            >
              <SelectionPopup.Content style={{ fontSize: 12, padding: 4 }}>
                Placement: <strong>{item.placement}</strong>
              </SelectionPopup.Content>
            </SelectionPopup>
          </Box>
        ))}
      </Flex>
    </Grid>
  );
};

export const Variants = () => {
  const [openVariant, setOpenVariant] = useState<string | null>('glass');

  const variants = ['default', 'surface', 'soft', 'glass', 'contrast'] as const;

  return (
    <Grid style={{ display: 'grid', gap: 16, padding: 16 }}>
      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {variants.map((v) => (
          <Button key={v} size="sm" variant={openVariant === v ? 'primary' : 'secondary'} onClick={() => setOpenVariant(v)}>
            {v}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={() => setOpenVariant(null)}>Close all</Button>
      </Flex>

      <Flex style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {variants.map((v) => (
          <Box key={v} id={`variant-anchor-${v}`} style={{ padding: 14, borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc' }}>
            {v}
            <SelectionPopup
              anchorId={`variant-anchor-${v}`}
              open={openVariant === v}
              placement="top"
              variant={v}
              arrow
              closeOnOutside
              onClose={() => setOpenVariant(null)}
            >
              <SelectionPopup.Content style={{ display: 'flex', gap: 6, padding: 2 }}>
                <Button size="sm">Bold</Button>
                <Button size="sm" variant="secondary">Link</Button>
              </SelectionPopup.Content>
            </SelectionPopup>
          </Box>
        ))}
      </Flex>
    </Grid>
  );
};
