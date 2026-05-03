import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Composite,
  FloatingArrow,
  FloatingDelayGroup,
  FloatingFocusManager,
  FloatingList,
  FloatingOverlay,
  FloatingPortal,
  FloatingTree,
  useClick,
  useClientPoint,
  useDelayGroup,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFocus,
  useHover,
  useInteractions,
  useListNavigation,
  useRole,
  useTransition,
  useTypeahead,
  type Placement
} from '@editora/ui-react';

const placements: Placement[] = [
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

type FloatingInteractionsArgs = {
  placement: Placement;
  trigger: 'click' | 'hover' | 'focus' | 'client-point';
  modalFocus: boolean;
  overlay: boolean;
  offset: number;
  flip: boolean;
  shift: boolean;
  matchWidth: boolean;
  fitViewport: boolean;
};

const meta: Meta<FloatingInteractionsArgs> = {
  title: 'UI Primitives/Floating React',
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    placement: { control: 'select', options: placements },
    trigger: { control: 'inline-radio', options: ['click', 'hover', 'focus', 'client-point'] },
    modalFocus: { control: 'boolean' },
    overlay: { control: 'boolean' },
    offset: { control: { type: 'number', min: 0, max: 40, step: 1 } },
    flip: { control: 'boolean' },
    shift: { control: 'boolean' },
    matchWidth: { control: 'boolean' },
    fitViewport: { control: 'boolean' }
  },
  args: {
    placement: 'bottom-start',
    trigger: 'click',
    modalFocus: false,
    overlay: false,
    offset: 12,
    flip: true,
    shift: true,
    matchWidth: false,
    fitViewport: true
  }
};

export default meta;
type Story = StoryObj<FloatingInteractionsArgs>;

const options = ['Alpha', 'Beta', 'Gamma', 'Delta'];

function FloatingReactLab(args: FloatingInteractionsArgs) {
  const nodeId = useFloatingNodeId();
  const delayGroup = useDelayGroup();
  const floating = useFloating({
    placement: args.placement,
    offset: args.offset,
    flip: args.flip,
    shift: args.shift,
    matchWidth: args.matchWidth,
    fitViewport: args.fitViewport,
    role: 'listbox'
  });
  const [activeIndex, setActiveIndex] = React.useState<number | null>(0);
  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef(options);
  const arrowRef = React.useRef<HTMLDivElement | null>(null);
  const transition = useTransition(floating.context, {
    duration: 140,
    initial: { opacity: 0, transform: 'translateY(-4px) scale(0.98)' },
    open: { opacity: 1, transform: 'translateY(0) scale(1)' },
    close: { opacity: 0, transform: 'translateY(-4px) scale(0.98)' }
  });

  const click = useClick(floating.context, { enabled: args.trigger === 'click' });
  const hover = useHover(floating.context, {
    enabled: args.trigger === 'hover' || args.trigger === 'client-point',
    delay: delayGroup?.delay ?? 80,
    closeDelay: delayGroup?.closeDelay ?? 80
  });
  const focus = useFocus(floating.context, { enabled: args.trigger === 'focus' });
  const clientPoint = useClientPoint(floating.context, { enabled: args.trigger === 'client-point' });
  const role = useRole(floating.context, { role: 'listbox' });
  const dismiss = useDismiss(floating.context);
  const listNavigation = useListNavigation(floating.context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex
  });
  const typeahead = useTypeahead(floating.context, {
    listRef: elementsRef,
    labelsRef,
    activeIndex,
    onMatch: setActiveIndex
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    hover,
    focus,
    clientPoint,
    role,
    dismiss,
    listNavigation,
    typeahead
  ]);

  return (
    <div style={pageStyle}>
      <div style={toolbarStyle}>
        <button ref={floating.referenceRef} style={triggerStyle} {...getReferenceProps({ 'data-testid': 'floating-trigger' })}>
          Open floating panel
        </button>
        <Composite style={compositeStyle} aria-label="Composite toolbar">
          <button data-composite-item style={toolButtonStyle}>Bold</button>
          <button data-composite-item style={toolButtonStyle}>Italic</button>
          <button data-composite-item style={toolButtonStyle}>Link</button>
        </Composite>
      </div>

      {args.overlay && floating.open ? <FloatingOverlay style={overlayStyle} /> : null}

      {transition.isMounted ? (
        <FloatingPortal>
          <FloatingFocusManager
            context={floating.context}
            modal={args.modalFocus}
            outsideElementsInert={args.modalFocus}
            visuallyHiddenDismiss={args.modalFocus ? 'Close floating panel' : false}
          >
            <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
              <div
                data-node-id={nodeId}
                {...getFloatingProps({
                  ref: floating.floatingRef,
                  style: {
                    ...panelStyle,
                    ...transition.styles,
                    width: args.matchWidth ? undefined : 260
                  }
                })}
              >
                <FloatingArrow
                  ref={arrowRef}
                  context={floating.context}
                  width={16}
                  height={10}
                  fill="#ffffff"
                  stroke="#111827"
                />
                <div style={panelHeaderStyle}>Placement: {floating.coords.placement}</div>
                {options.map((option, index) => (
                  <button
                    key={option}
                    ref={(node) => {
                      elementsRef.current[index] = node;
                    }}
                    style={{
                      ...itemStyle,
                      ...(activeIndex === index ? activeItemStyle : null)
                    }}
                    {...getItemProps({
                      'data-index': index,
                      role: 'option',
                      'aria-selected': activeIndex === index
                    })}
                    onClick={() => {
                      setActiveIndex(index);
                      floating.setOpen(false, 'click');
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </FloatingList>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <FloatingTree>
      <FloatingDelayGroup delay={120} closeDelay={160}>
        <FloatingReactLab {...args} />
      </FloatingDelayGroup>
    </FloatingTree>
  )
};

function NestedFloatingTreeLab() {
  const [parentOpen, setParentOpen] = React.useState(false);
  const [childOpen, setChildOpen] = React.useState(false);
  const [parentActiveIndex, setParentActiveIndex] = React.useState<number | null>(null);
  const [childActiveIndex, setChildActiveIndex] = React.useState<number | null>(null);
  const parent = useFloating({ placement: 'bottom-start', offset: 10, open: parentOpen, onOpenChange: setParentOpen, role: 'menu' });
  const child = useFloating({ placement: 'right-start', offset: 8, open: childOpen, onOpenChange: setChildOpen, role: 'menu' });
  const parentItemsRef = React.useRef<Array<HTMLElement | null>>([]);
  const childItemsRef = React.useRef<Array<HTMLElement | null>>([]);
  const parentId = useFloatingNodeId({ setOpen: (open) => setParentOpen(open) });
  const childId = useFloatingNodeId({ parentId, setOpen: (open) => setChildOpen(open) });
  const parentInteractions = useInteractions([
    useClick(parent.context),
    useRole(parent.context, { role: 'menu' }),
    useDismiss(parent.context, { nodeId: parentId, outsidePressEvent: 'mousedown' }),
    useListNavigation(parent.context, {
      listRef: parentItemsRef,
      activeIndex: parentActiveIndex,
      onNavigate: setParentActiveIndex,
      focusItemOnOpen: 'auto',
      openOnArrowKeyDown: true,
      nested: true,
      nodeId: parentId,
      getItemHasSubmenu: (index) => index === 2,
      getItemExpanded: (index) => index === 2 && childOpen,
      onOpenSubmenu: (index) => {
        if (index === 2) setChildOpen(true);
      }
    })
  ]);
  const childInteractions = useInteractions([
    useClick(child.context),
    useRole(child.context, { role: 'menu' }),
    useDismiss(child.context, { nodeId: childId, outsidePressEvent: 'mousedown' }),
    useListNavigation(child.context, {
      listRef: childItemsRef,
      activeIndex: childActiveIndex,
      onNavigate: setChildActiveIndex,
      focusItemOnOpen: 'auto',
      nested: true,
      nodeId: childId,
      onCloseSubmenu: () => setChildOpen(false)
    })
  ]);

  return (
    <div style={pageStyle}>
      <div style={nestedWrapStyle}>
        <button ref={parent.referenceRef} style={triggerStyle} {...parentInteractions.getReferenceProps()}>
          Open parent menu
        </button>
      </div>

      {parentOpen ? (
        <FloatingPortal>
          <FloatingFocusManager context={parent.context} initialFocus={false}>
            <div
              {...parentInteractions.getFloatingProps({
                ref: parent.floatingRef,
                style: {
                  ...panelStyle,
                  width: 240
                }
              })}
            >
              <button
                ref={(node) => {
                  parentItemsRef.current[0] = node;
                }}
                style={itemStyle}
                {...parentInteractions.getItemProps({ 'data-index': 0, role: 'menuitem' })}
              >
                Rename
              </button>
              <button
                ref={(node) => {
                  parentItemsRef.current[1] = node;
                }}
                style={itemStyle}
                {...parentInteractions.getItemProps({ 'data-index': 1, role: 'menuitem' })}
              >
                Duplicate
              </button>
              <button
                ref={(node) => {
                  parentItemsRef.current[2] = node;
                }}
                style={{ ...itemStyle, ...nestedTriggerStyle }}
                {...childInteractions.getReferenceProps(parentInteractions.getItemProps({ 'data-index': 2, ref: child.referenceRef, role: 'menuitem' }))}
              >
                More actions
                <span aria-hidden="true">&gt;</span>
              </button>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}

      {childOpen ? (
        <FloatingPortal>
          <FloatingFocusManager context={child.context} initialFocus={false}>
            <div
              {...childInteractions.getFloatingProps({
                ref: child.floatingRef,
                style: {
                  ...panelStyle,
                  width: 220
                }
              })}
            >
              <button
                ref={(node) => {
                  childItemsRef.current[0] = node;
                }}
                style={itemStyle}
                {...childInteractions.getItemProps({ 'data-index': 0, role: 'menuitem' })}
              >
                Move
              </button>
              <button
                ref={(node) => {
                  childItemsRef.current[1] = node;
                }}
                style={itemStyle}
                {...childInteractions.getItemProps({ 'data-index': 1, role: 'menuitem' })}
              >
                Archive
              </button>
              <button
                ref={(node) => {
                  childItemsRef.current[2] = node;
                }}
                style={itemStyle}
                {...childInteractions.getItemProps({ 'data-index': 2, role: 'menuitem' })}
              >
                Delete
              </button>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </div>
  );
}

export const NestedTree: Story = {
  render: () => (
    <FloatingTree>
      <NestedFloatingTreeLab />
    </FloatingTree>
  )
};

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  background: '#f5f7fb',
  color: '#111827',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
};

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  padding: 16,
  border: '1px solid #d9e0ea',
  borderRadius: 8,
  background: '#ffffff',
  boxShadow: '0 20px 50px rgba(15, 23, 42, 0.12)'
};

const triggerStyle: React.CSSProperties = {
  minHeight: 42,
  padding: '0 16px',
  border: '1px solid #2563eb',
  borderRadius: 6,
  background: '#2563eb',
  color: '#ffffff',
  fontWeight: 650,
  cursor: 'pointer'
};

const compositeStyle: React.CSSProperties = {
  display: 'flex',
  gap: 4,
  padding: 4,
  border: '1px solid #d1d5db',
  borderRadius: 6,
  background: '#f9fafb'
};

const nestedWrapStyle: React.CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  minHeight: 320
};

const toolButtonStyle: React.CSSProperties = {
  minWidth: 48,
  minHeight: 32,
  border: '1px solid transparent',
  borderRadius: 5,
  background: '#ffffff',
  color: '#374151',
  cursor: 'pointer'
};

const overlayStyle: React.CSSProperties = {
  background: 'rgba(17, 24, 39, 0.22)'
};

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 20,
  padding: 8,
  border: '1px solid #111827',
  borderRadius: 8,
  background: '#ffffff',
  boxShadow: '0 18px 50px rgba(15, 23, 42, 0.22)',
  transformOrigin: 'top left'
};

const panelHeaderStyle: React.CSSProperties = {
  padding: '6px 8px 8px',
  color: '#6b7280',
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase'
};

const itemStyle: React.CSSProperties = {
  width: '100%',
  display: 'block',
  minHeight: 36,
  padding: '0 10px',
  border: 0,
  borderRadius: 6,
  background: 'transparent',
  color: '#111827',
  textAlign: 'left',
  cursor: 'pointer'
};

const activeItemStyle: React.CSSProperties = {
  background: '#e8f0ff',
  color: '#1746a2'
};

const nestedTriggerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between'
};
