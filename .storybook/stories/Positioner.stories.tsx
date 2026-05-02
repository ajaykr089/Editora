import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  createPositioner,
  createVirtualPoint,
  detectPositionerOverflow,
  type PositionerAnchor,
  type PositionerHandle,
  type PositionerPlacement,
  type PositionerState
} from '@editora/ui-core/runtime';

const placements: PositionerPlacement[] = [
  'top',
  'top-start',
  'top-end',
  'right',
  'right-start',
  'right-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end'
];

type AnchorMode = 'element' | 'virtual-point' | 'virtual-inline';

type PositionerStoryArgs = {
  placement: PositionerPlacement;
  strategy: 'fixed' | 'absolute';
  anchorMode: AnchorMode;
  offset: number;
  crossOffset: number;
  boundaryPadding: number;
  flip: boolean;
  shift: boolean;
  autoPlacement: boolean;
  matchWidth: boolean;
  fitViewport: boolean;
  inline: boolean;
  hideWhenDetached: boolean;
  showArrow: boolean;
  useBoundary: boolean;
  clippedBoundary: boolean;
  dir: 'ltr' | 'rtl';
  customNudge: boolean;
  animationFrame: boolean;
};

const meta: Meta<PositionerStoryArgs> = {
  title: 'UI Primitives/Positioner',
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    placement: { control: 'select', options: placements },
    strategy: { control: 'inline-radio', options: ['fixed', 'absolute'] },
    anchorMode: { control: 'inline-radio', options: ['element', 'virtual-point', 'virtual-inline'] },
    offset: { control: { type: 'number', min: -24, max: 48, step: 1 } },
    crossOffset: { control: { type: 'number', min: -48, max: 48, step: 1 } },
    boundaryPadding: { control: { type: 'number', min: 0, max: 48, step: 1 } },
    flip: { control: 'boolean' },
    shift: { control: 'boolean' },
    autoPlacement: { control: 'boolean' },
    matchWidth: { control: 'boolean' },
    fitViewport: { control: 'boolean' },
    inline: { control: 'boolean' },
    hideWhenDetached: { control: 'boolean' },
    showArrow: { control: 'boolean' },
    useBoundary: { control: 'boolean' },
    clippedBoundary: { control: 'boolean' },
    dir: { control: 'inline-radio', options: ['ltr', 'rtl'] },
    customNudge: { control: 'boolean' },
    animationFrame: { control: 'boolean' }
  },
  args: {
    placement: 'bottom-start',
    strategy: 'fixed',
    anchorMode: 'element',
    offset: 12,
    crossOffset: 0,
    boundaryPadding: 8,
    flip: true,
    shift: true,
    autoPlacement: false,
    matchWidth: false,
    fitViewport: true,
    inline: false,
    hideWhenDetached: true,
    showArrow: true,
    useBoundary: true,
    clippedBoundary: true,
    dir: 'ltr',
    customNudge: false,
    animationFrame: false
  }
};

export default meta;
type Story = StoryObj<PositionerStoryArgs>;

function createVirtualInlineAnchor(boundary: HTMLElement): PositionerAnchor {
  return {
    contextElement: boundary,
    getBoundingClientRect: () => {
      const base = boundary.getBoundingClientRect();
      return new DOMRect(base.left + 130, base.top + 120, 220, 62);
    },
    getClientRects: () => {
      const base = boundary.getBoundingClientRect();
      return [
        new DOMRect(base.left + 130, base.top + 120, 168, 24),
        new DOMRect(base.left + 168, base.top + 158, 182, 24)
      ];
    }
  };
}

function StateReadout({ state }: { state: PositionerState | null }) {
  const overflow = state?.rects
    ? detectPositionerOverflow({
      x: state.x,
      y: state.y,
      rects: state.rects,
      boundary: {
        top: 0,
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight
      },
      padding: 0
    })
    : null;

  return (
    <pre style={readoutStyle}>
      {JSON.stringify({
        x: state ? Math.round(state.x) : null,
        y: state ? Math.round(state.y) : null,
        placement: state?.placement,
        availableWidth: state ? Math.round(state.availableWidth) : null,
        availableHeight: state ? Math.round(state.availableHeight) : null,
        referenceHidden: state?.referenceHidden,
        escaped: state?.escaped,
        overflow,
        middlewareData: state?.middlewareData
      }, null, 2)}
    </pre>
  );
}

function PositionerLab(args: PositionerStoryArgs) {
  const boundaryRef = React.useRef<HTMLDivElement | null>(null);
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const floatingRef = React.useRef<HTMLDivElement | null>(null);
  const arrowRef = React.useRef<HTMLDivElement | null>(null);
  const positionerRef = React.useRef<PositionerHandle | null>(null);
  const [state, setState] = React.useState<PositionerState | null>(null);
  const [anchorPosition, setAnchorPosition] = React.useState({ left: 280, top: 190 });
  const [virtualPoint, setVirtualPoint] = React.useState({ x: 420, y: 280 });

  React.useLayoutEffect(() => {
    const boundary = boundaryRef.current;
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!boundary || !anchor || !floating) return;

    positionerRef.current?.destroy();

    const reference: PositionerAnchor = args.anchorMode === 'virtual-point'
      ? createVirtualPoint(virtualPoint.x, virtualPoint.y, boundary)
      : args.anchorMode === 'virtual-inline'
        ? createVirtualInlineAnchor(boundary)
        : anchor;

    positionerRef.current = createPositioner({
      anchor: reference,
      floating,
      placement: args.placement,
      strategy: args.strategy,
      dir: args.dir,
      offset: args.offset,
      crossOffset: args.crossOffset,
      flip: args.flip,
      shift: args.shift,
      autoPlacement: args.autoPlacement,
      matchWidth: args.matchWidth,
      fitViewport: args.fitViewport,
      inline: args.inline || args.anchorMode === 'virtual-inline',
      hideWhenDetached: args.hideWhenDetached,
      boundary: args.useBoundary ? boundary : null,
      boundaryPadding: args.boundaryPadding,
      arrow: args.showArrow ? arrowRef.current : null,
      animationFrame: args.animationFrame,
      middleware: args.customNudge
        ? [
          {
            name: 'storybookNudge',
            fn(current) {
              return {
                x: current.x + 10,
                y: current.y - 6,
                data: { x: 10, y: -6 }
              };
            }
          }
        ]
        : undefined,
      onUpdate: setState
    });

    return () => {
      positionerRef.current?.destroy();
      positionerRef.current = null;
    };
  }, [args, anchorPosition, virtualPoint]);

  const moveAnchor = (left: number, top: number) => {
    setAnchorPosition({ left, top });
    requestAnimationFrame(() => positionerRef.current?.update());
  };

  return (
    <div style={pageStyle}>
      <div style={toolbarStyle}>
        <button style={buttonStyle} onClick={() => moveAnchor(24, 24)}>Top left</button>
        <button style={buttonStyle} onClick={() => moveAnchor(620, 32)}>Top right</button>
        <button style={buttonStyle} onClick={() => moveAnchor(40, 408)}>Bottom left</button>
        <button style={buttonStyle} onClick={() => moveAnchor(620, 408)}>Bottom right</button>
        <button style={buttonStyle} onClick={() => moveAnchor(280, 190)}>Center</button>
        <button style={buttonStyle} onClick={() => positionerRef.current?.update()}>Update</button>
      </div>

      <div
        ref={boundaryRef}
        style={{
          ...boundaryStyle,
          overflow: args.clippedBoundary ? 'auto' : 'visible',
          direction: args.dir
        }}
        onPointerMove={(event) => {
          if (args.anchorMode === 'virtual-point') {
            setVirtualPoint({ x: event.clientX, y: event.clientY });
          }
        }}
      >
        <div style={gridStyle} />
        <button
          ref={anchorRef}
          style={{
            ...anchorStyle,
            left: anchorPosition.left,
            top: anchorPosition.top
          }}
        >
          Anchor
        </button>
        {args.anchorMode === 'virtual-point' ? (
          <div style={{ ...pointStyle, left: virtualPoint.x - 7, top: virtualPoint.y - 7 }} />
        ) : null}
        {args.anchorMode === 'virtual-inline' ? (
          <div style={inlineTextStyle}>
            <span>Inline virtual range wraps across this phrase</span>
            <span>and lets you test first/last client rect behavior.</span>
          </div>
        ) : null}
        <div ref={floatingRef} style={floatingStyle}>
          {args.showArrow ? (
            <div ref={arrowRef} style={arrowStyle}>
              <svg width="16" height="10" viewBox="0 0 16 10" style={{ display: 'block', overflow: 'visible' }}>
                <path d="M1 1 L8 9 L15 1" fill="#172033" stroke="#1f2937" strokeWidth="1" strokeLinejoin="round" />
              </svg>
            </div>
          ) : null}
          <strong>Positioned panel</strong>
          <span>Placement: {state?.placement || args.placement}</span>
          <span>Anchor: {args.anchorMode}</span>
          <span>Boundary: {args.useBoundary ? 'local' : 'viewport'}</span>
        </div>
      </div>

      <StateReadout state={state} />
    </div>
  );
}

export const Playground: Story = {
  render: (args) => <PositionerLab {...args} />
};

function PlacementTile({ placement }: { placement: PositionerPlacement }) {
  const boundaryRef = React.useRef<HTMLDivElement | null>(null);
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const floatingRef = React.useRef<HTMLDivElement | null>(null);

  React.useLayoutEffect(() => {
    const boundary = boundaryRef.current;
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!boundary || !anchor || !floating) return;
    const handle = createPositioner({
      anchor,
      floating,
      placement,
      offset: 8,
      flip: false,
      shift: false,
      boundary
    });
    return () => handle.destroy();
  }, [placement]);

  return (
    <div ref={boundaryRef} style={tileStyle}>
      <button ref={anchorRef} style={tileAnchorStyle}>{placement}</button>
      <div ref={floatingRef} style={tileFloatingStyle}>{placement}</div>
    </div>
  );
}

export const PlacementMatrix: Story = {
  render: () => (
    <div style={matrixStyle}>
      {placements.map((placement) => (
        <PlacementTile key={placement} placement={placement} />
      ))}
    </div>
  )
};

function ScrollFlipLab() {
  const boundaryRef = React.useRef<HTMLDivElement | null>(null);
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const floatingRef = React.useRef<HTMLDivElement | null>(null);
  const arrowRef = React.useRef<HTMLDivElement | null>(null);
  const positionerRef = React.useRef<PositionerHandle | null>(null);
  const [state, setState] = React.useState<PositionerState | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);

  React.useLayoutEffect(() => {
    const boundary = boundaryRef.current;
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!boundary || !anchor || !floating) return;

    positionerRef.current?.destroy();
    positionerRef.current = createPositioner({
      anchor,
      floating,
      placement: 'bottom-start',
      strategy: 'fixed',
      offset: 10,
      flip: true,
      shift: true,
      fitViewport: true,
      boundary,
      boundaryPadding: 8,
      arrow: arrowRef.current,
      onUpdate: setState
    });

    return () => {
      positionerRef.current?.destroy();
      positionerRef.current = null;
    };
  }, []);

  const scrollBoundary = (nextScrollTop: number) => {
    const boundary = boundaryRef.current;
    if (!boundary) return;
    boundary.scrollTo({ top: nextScrollTop, behavior: 'auto' });
    setScrollTop(nextScrollTop);
  };

  return (
    <div style={pageStyle}>
      <div style={toolbarStyle}>
        <button style={buttonStyle} onClick={() => scrollBoundary(0)}>Anchor low</button>
        <button style={buttonStyle} onClick={() => scrollBoundary(320)}>Center it</button>
        <button style={buttonStyle} onClick={() => scrollBoundary(580)}>Anchor high</button>
        <span style={toolbarMetaStyle}>Placement: {state?.placement ?? 'bottom-start'} | Scroll: {scrollTop}px</span>
      </div>

      <div
        ref={boundaryRef}
        style={{ ...boundaryStyle, overflow: 'auto', maxHeight: 420 }}
        onScroll={(event) => {
          setScrollTop((event.currentTarget as HTMLDivElement).scrollTop);
        }}
      >
        <div style={scrollTrackStyle}>
          <div style={scrollCopyStyle}>
            Scroll this canvas. The anchored panel should flip between `bottom-start` and `top-start`
            as the available space changes.
          </div>
          <button ref={anchorRef} style={scrollAnchorStyle}>
            Scroll anchor
          </button>
        </div>
        <div ref={floatingRef} style={floatingStyle}>
          <div ref={arrowRef} style={arrowStyle}>
            <svg width="16" height="10" viewBox="0 0 16 10" style={{ display: 'block', overflow: 'visible' }}>
              <path d="M1 1 L8 9 L15 1" fill="#172033" stroke="#1f2937" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </div>
          <strong>Scroll-aware panel</strong>
          <span>Auto updates on ancestor scroll.</span>
          <span>Current placement: {state?.placement ?? 'bottom-start'}</span>
        </div>
      </div>

      <StateReadout state={state} />
    </div>
  );
}

export const ScrollFlip: Story = {
  render: () => <ScrollFlipLab />
};

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: 24,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 360px',
  gridTemplateRows: 'auto minmax(0, 1fr)',
  gap: 16,
  background: '#f6f7f9',
  color: '#172033',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
};

const toolbarStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8
};

const buttonStyle: React.CSSProperties = {
  border: '1px solid #c9d2e3',
  background: '#ffffff',
  color: '#172033',
  borderRadius: 6,
  minHeight: 34,
  padding: '0 12px',
  font: 'inherit',
  cursor: 'pointer'
};

const boundaryStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: 560,
  border: '1px solid #bbc6d8',
  borderRadius: 8,
  background: '#ffffff',
  boxShadow: '0 18px 60px rgba(23, 32, 51, 0.10)'
};

const gridStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: 'linear-gradient(#edf1f7 1px, transparent 1px), linear-gradient(90deg, #edf1f7 1px, transparent 1px)',
  backgroundSize: '32px 32px'
};

const anchorStyle: React.CSSProperties = {
  position: 'absolute',
  width: 128,
  height: 42,
  border: '1px solid #246bfe',
  borderRadius: 6,
  background: '#e8f0ff',
  color: '#123c9c',
  fontWeight: 700
};

const floatingStyle: React.CSSProperties = {
  position: 'fixed',
  zIndex: 20,
  width: 220,
  minHeight: 112,
  display: 'grid',
  gap: 6,
  alignContent: 'start',
  padding: 14,
  border: '1px solid #1f2937',
  borderRadius: 8,
  background: '#172033',
  color: '#ffffff',
  boxShadow: '0 16px 48px rgba(23, 32, 51, 0.28)',
  fontSize: 13
};

const arrowStyle: React.CSSProperties = {
  position: 'absolute',
  width: 16,
  height: 10,
  pointerEvents: 'none'
};

const pointStyle: React.CSSProperties = {
  position: 'fixed',
  zIndex: 5,
  width: 14,
  height: 14,
  borderRadius: 999,
  background: '#e11d48',
  boxShadow: '0 0 0 6px rgba(225, 29, 72, 0.16)',
  pointerEvents: 'none'
};

const inlineTextStyle: React.CSSProperties = {
  position: 'absolute',
  left: 130,
  top: 120,
  width: 260,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 4,
  padding: 10,
  border: '1px dashed #5b6b83',
  borderRadius: 6,
  background: '#f8fafc',
  color: '#334155'
};

const readoutStyle: React.CSSProperties = {
  margin: 0,
  minHeight: 560,
  overflow: 'auto',
  border: '1px solid #bbc6d8',
  borderRadius: 8,
  background: '#101828',
  color: '#d1e7ff',
  padding: 16,
  fontSize: 12,
  lineHeight: 1.5
};

const toolbarMetaStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 34,
  padding: '0 12px',
  borderRadius: 6,
  background: '#e8f0ff',
  color: '#123c9c',
  fontSize: 13,
  fontWeight: 600
};

const matrixStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: 24,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: 18,
  background: '#f6f7f9'
};

const tileStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: 230,
  border: '1px solid #c9d2e3',
  borderRadius: 8,
  background: '#ffffff',
  overflow: 'visible'
};

const tileAnchorStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 104,
  height: 36,
  border: '1px solid #246bfe',
  borderRadius: 6,
  background: '#e8f0ff',
  color: '#123c9c'
};

const tileFloatingStyle: React.CSSProperties = {
  position: 'fixed',
  width: 118,
  padding: '8px 10px',
  borderRadius: 6,
  background: '#172033',
  color: '#ffffff',
  fontSize: 12,
  textAlign: 'center'
};

const scrollTrackStyle: React.CSSProperties = {
  position: 'relative',
  minHeight: 980,
  padding: '48px 40px 220px'
};

const scrollCopyStyle: React.CSSProperties = {
  maxWidth: 440,
  color: '#475569',
  lineHeight: 1.6
};

const scrollAnchorStyle: React.CSSProperties = {
  position: 'absolute',
  left: 40,
  top: 640,
  width: 148,
  height: 42,
  border: '1px solid #246bfe',
  borderRadius: 6,
  background: '#e8f0ff',
  color: '#123c9c',
  fontWeight: 700
};
