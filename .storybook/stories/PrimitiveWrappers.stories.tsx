import React from 'react';
import {
  Anchor,
  Box,
  Button,
  Collection,
  DismissableLayer,
  Flex,
  FocusScope,
  Listbox,
  Positioner,
  RovingFocusGroup
} from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/Primitive Wrappers'
};

const shell: React.CSSProperties = {
  display: 'grid',
  gap: 18,
  maxWidth: 980,
  padding: 24,
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent)',
  borderRadius: 20,
  background: 'var(--ui-color-surface, #ffffff)',
  boxShadow: '0 18px 42px rgba(15, 23, 42, 0.08)'
};

const panel: React.CSSProperties = {
  display: 'grid',
  gap: 12,
  padding: 16,
  border: '1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent)',
  borderRadius: 14,
  background: 'color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, #eff6ff 4%)'
};

const menuButton: React.CSSProperties = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: 12,
  alignItems: 'center',
  minHeight: 42,
  padding: '10px 12px',
  border: 0,
  borderRadius: 10,
  background: 'transparent',
  color: '#0f172a',
  textAlign: 'left',
  cursor: 'pointer'
};

const shortcut: React.CSSProperties = {
  justifySelf: 'end',
  padding: '4px 6px',
  borderRadius: 8,
  background: 'rgba(15, 23, 42, 0.04)',
  fontSize: 12,
  fontFamily: 'IBM Plex Mono, SFMono-Regular, monospace',
  color: '#64748b'
};

export const CollectionAndListbox = () => {
  const collectionRef = React.useRef<HTMLElement | null>(null);
  const listboxRef = React.useRef<HTMLElement | null>(null);
  const [collectionInfo, setCollectionInfo] = React.useState('3 items registered');
  const [activeValue, setActiveValue] = React.useState('schedule');

  const updateCollectionInfo = React.useCallback(() => {
    const items = ((collectionRef.current as any)?.queryItems?.() || []) as HTMLElement[];
    setCollectionInfo(`${items.length} items registered`);
  }, []);

  const syncActiveValue = React.useCallback(() => {
    const active = (listboxRef.current as any)?.getActiveItem?.() as HTMLElement | null;
    setActiveValue(active?.getAttribute('data-value') || '(none)');
  }, []);

  React.useEffect(() => {
    updateCollectionInfo();
    const listbox = listboxRef.current as any;
    if (!listbox) return;
    const first = listbox.findByValue?.('schedule') || null;
    if (first) {
      listbox.setActiveItem(first, { focus: false, scroll: false });
      syncActiveValue();
    }
  }, [syncActiveValue, updateCollectionInfo]);

  return (
    <ShowcasePage
      eyebrow="Infrastructure"
      title="Primitive wrappers need audit surfaces too, not just product-facing components"
      description="These stories are intentionally utilitarian, but they still need clean spacing, strong hierarchy, and enough framing to debug behavior without visual noise."
      meta={[
        { label: 'Collection', value: collectionInfo },
        { label: 'Active', value: activeValue },
        { label: 'Pattern', value: 'Behavioral primitive' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Collection + Listbox"
        title="Item discovery and active traversal"
        description="This story is for debugging low-level selection mechanics, so the surrounding presentation should stay quiet and systematic."
      >
        <div style={showcaseChipRowStyle}>
          <span style={showcaseChipStyle}>Imperative hooks</span>
          <span style={showcaseChipStyle}>Discovery</span>
          <span style={showcaseChipStyle}>Traversal</span>
        </div>

        <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button size="sm" onClick={() => updateCollectionInfo()}>
            Refresh collection
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              (listboxRef.current as any)?.move?.(-1, { focus: false, scroll: true });
              syncActiveValue();
            }}
          >
            Previous option
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              (listboxRef.current as any)?.move?.(1, { focus: false, scroll: true });
              syncActiveValue();
            }}
          >
            Next option
          </Button>
        </Flex>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(240px, 280px) minmax(280px, 1fr)' }}>
          <Box style={panel}>
            <strong>ui-collection</strong>
            <Collection ref={collectionRef} itemSelector="[data-collection-item]" itemRole="option" onCollectionChange={updateCollectionInfo}>
              <div data-collection-item data-value="schedule">Schedule publish</div>
              <div data-collection-item data-value="duplicate">Duplicate release</div>
              <div data-collection-item data-value="archive">Archive draft</div>
            </Collection>
            <div style={{ fontSize: 13, color: '#64748b' }}>{collectionInfo}</div>
          </Box>

          <Box style={panel}>
            <strong>ui-listbox</strong>
            <Listbox ref={listboxRef} itemSelector="[data-menu-item]" itemRole="option" activeAttribute="data-current">
              {[
                ['schedule', 'Schedule publish', '⌘K'],
                ['duplicate', 'Duplicate release', ''],
                ['archive', 'Archive draft', '']
              ].map(([value, label, keys]) => (
                <button
                  key={value}
                  data-menu-item
                  data-value={value}
                  style={menuButton}
                  onClick={(event) => {
                    (listboxRef.current as any)?.setActiveItem?.(event.currentTarget, { focus: false, scroll: false });
                    syncActiveValue();
                  }}
                >
                  <span>{label}</span>
                  {keys ? <span style={shortcut}>{keys}</span> : null}
                </button>
              ))}
            </Listbox>
            <div style={{ fontSize: 13, color: '#64748b' }}>Active value: <code>{activeValue}</code></div>
          </Box>
        </div>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

export const RovingFocusToolbar = () => {
  const ref = React.useRef<HTMLElement | null>(null);
  const [active, setActive] = React.useState('Bold');

  return (
    <Box style={shell}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
          Roving Focus Group
        </div>
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: '#0f172a' }}>
          Test directional focus management over a toolbar-style surface
        </div>
      </div>

      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => (ref.current as any)?.focusBoundary?.('first', { focus: true })}>First item</Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.move?.(-1, { focus: true })}>Move left</Button>
        <Button size="sm" variant="secondary" onClick={() => (ref.current as any)?.move?.(1, { focus: true })}>Move right</Button>
      </Flex>

      <Box style={panel}>
        <RovingFocusGroup ref={ref} itemSelector="[data-tool]" activeAttribute="data-current" onActiveItemChange={(detail) => {
          const label = detail.item?.textContent?.trim();
          if (label) setActive(label);
        }}>
          <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Bold', 'Italic', 'Underline', 'Comment'].map((label, index) => (
              <button
                key={label}
                data-tool
                style={{
                  minHeight: 40,
                  padding: '0 14px',
                  borderRadius: 10,
                  border: '1px solid #dbe4f0',
                  background: index === 0 ? '#eff6ff' : '#ffffff'
                }}
                onClick={(event) => (ref.current as any)?.setActiveItem?.(event.currentTarget, { focus: true })}
              >
                {label}
              </button>
            ))}
          </Flex>
        </RovingFocusGroup>
        <div style={{ fontSize: 13, color: '#64748b' }}>Active tool: <code>{active}</code></div>
      </Box>
    </Box>
  );
};

export const LayerAndFocusScope = () => {
  const [open, setOpen] = React.useState(false);
  const [log, setLog] = React.useState('Closed');

  return (
    <Box style={shell}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
          Dismissable Layer + Focus Scope
        </div>
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: '#0f172a' }}>
          Test outside dismissal, Escape handling, and trapped focus
        </div>
      </div>

      <Button size="sm" onClick={() => setOpen(true)}>Open test layer</Button>
      <div style={{ fontSize: 13, color: '#64748b' }}>Event log: <code>{log}</code></div>

      {open ? (
        <DismissableLayer
          open
          closeOnEscape
          closeOnPointerOutside
          onBeforeClose={(detail) => setLog(`before-close:${detail.reason}`)}
          onClose={(detail) => {
            setLog(`close:${detail.reason}`);
            setOpen(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(15, 23, 42, 0.22)',
            zIndex: 2000
          }}
        >
          <FocusScope
            active
            trapped
            loop
            autoFocus="container"
            onEscape={() => {
              setLog('focus-scope:escape');
              setOpen(false);
            }}
          >
            <Box
              tabIndex={-1}
              style={{
                width: 360,
                padding: 20,
                borderRadius: 16,
                background: '#ffffff',
                boxShadow: '0 24px 48px rgba(15, 23, 42, 0.18)',
                display: 'grid',
                gap: 12
              }}
            >
              <strong>Primitive test surface</strong>
              <div style={{ fontSize: 13, color: '#64748b' }}>Use Tab and Escape here to validate focus containment and dismissal behavior.</div>
              <input placeholder="First field" style={{ minHeight: 38, padding: '0 12px', borderRadius: 10, border: '1px solid #cbd5e1' }} />
              <input placeholder="Second field" style={{ minHeight: 38, padding: '0 12px', borderRadius: 10, border: '1px solid #cbd5e1' }} />
              <Flex style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button size="sm" variant="secondary" onClick={() => setOpen(false)}>Close</Button>
                <Button size="sm">Confirm</Button>
              </Flex>
            </Box>
          </FocusScope>
        </DismissableLayer>
      ) : null}
    </Box>
  );
};

export const PositionerAndAnchor = () => {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState('bottom-start');

  return (
    <Box style={shell}>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b' }}>
          Positioner + Anchor
        </div>
        <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color: '#0f172a' }}>
          Test anchored floating layout with live placement updates
        </div>
      </div>

      <Flex style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" onClick={() => setOpen((value) => !value)}>{open ? 'Hide layer' : 'Show layer'}</Button>
        <Button size="sm" variant="secondary" onClick={() => setPlacement('top-start')}>Top start</Button>
        <Button size="sm" variant="secondary" onClick={() => setPlacement('bottom-start')}>Bottom start</Button>
        <Button size="sm" variant="secondary" onClick={() => setPlacement('right-start')}>Right start</Button>
      </Flex>

      <Box
        style={{
          minHeight: 260,
          borderRadius: 18,
          border: '1px dashed #94a3b8',
          background: 'linear-gradient(180deg, #f8fafc, #eef2ff)',
          display: 'grid',
          placeItems: 'center',
          padding: 24
        }}
      >
        <Positioner open={open} placement={placement as any} offset={10} shift fitViewport onPositionChange={(detail) => setPlacement(detail.placement)}>
          <Anchor slot="anchor">
            <Button>Anchored trigger</Button>
          </Anchor>
          <Box
            slot="content"
            style={{
              minWidth: 240,
              padding: 14,
              borderRadius: 14,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              boxShadow: '0 22px 48px rgba(15, 23, 42, 0.14)'
            }}
          >
            <strong>Positioned surface</strong>
            <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
              Current placement: <code>{placement}</code>
            </div>
          </Box>
        </Positioner>
      </Box>
    </Box>
  );
};
