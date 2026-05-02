import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
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
  useDelayGroup,
  useDismiss,
  useFloating,
  useFloatingList,
  useFloatingNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListNavigation,
  useRole,
  useTransition,
  useTypeahead
} from '..';

function InteractionMenu() {
  const floating = useFloating({ placement: 'bottom-start', offset: 4 });
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef(['Alpha', 'Beta', 'Gamma']);
  const transition = useTransition(floating.context, { duration: 1 });
  const click = useClick(floating.context);
  const role = useRole(floating.context, { role: 'menu' });
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
    role,
    dismiss,
    listNavigation,
    typeahead
  ]);

  return (
    <div>
      <button data-testid="trigger" ref={floating.referenceRef} {...getReferenceProps()}>
        Open
      </button>
      <div data-testid="transition">{transition.status}</div>
      {floating.open ? (
        <FloatingPortal>
          <FloatingFocusManager context={floating.context}>
            <div
              data-testid="floating"
              ref={floating.floatingRef}
              {...getFloatingProps({
                style: {
                  position: 'absolute',
                  top: floating.coords.top,
                  left: floating.coords.left
                }
              })}
            >
              <FloatingArrow context={floating.context} data-testid="arrow" />
              {labelsRef.current.map((label, index) => (
                <button
                  key={label}
                  ref={(node) => {
                    elementsRef.current[index] = node;
                  }}
                  {...getItemProps({ 'data-index': index, 'data-testid': `item-${index}` })}
                >
                  {label}
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </div>
  );
}

function DelayProbe() {
  const group = useDelayGroup();
  return <div data-testid="delay">{group?.delay}/{group?.closeDelay}</div>;
}

function ListProbe() {
  const list = useFloatingList();
  React.useEffect(() => {
    if (!list) return;
    list.labelsRef.current = ['One'];
  }, [list]);
  return <div data-testid="list">{String(!!list)}</div>;
}

function TreeProbe() {
  const tree = useFloatingTree();
  const id = useFloatingNodeId();
  return <div data-testid="tree">{String(!!tree)}:{id}</div>;
}

function AdvancedInteractionProbe() {
  const floating = useFloating({ placement: 'bottom-start', offset: 4 });
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [typing, setTyping] = React.useState(false);
  const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef(['Alpha', 'Beta', 'Gamma', 'Delta']);
  const returnFocusRef = React.useRef<HTMLButtonElement | null>(null);
  const transition = useTransition(floating.context, { duration: { open: 5, close: 1 } });
  const click = useClick(floating.context, { ignoreMouse: true, stickIfOpen: true });
  const hover = useHover(floating.context, { enabled: false, delay: { open: 5, close: 2 } });
  const dismiss = useDismiss(floating.context, {
    outsidePress: (event) => !(event.target as HTMLElement | null)?.closest('[data-ignore-outside]'),
    outsidePressEvent: 'mousedown'
  });
  const listNavigation = useListNavigation(floating.context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    orientation: 'both',
    cols: 2,
    openOnArrowKeyDown: true,
    focusItemOnOpen: 'auto'
  });
  const typeahead = useTypeahead(floating.context, {
    listRef: elementsRef,
    labelsRef,
    activeIndex,
    selectedIndex: 1,
    onMatch: setActiveIndex,
    onTypingChange: setTyping,
    findMatch: (labels, query) => labels.findIndex((label) => label.endsWith(query)) ?? null
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    hover,
    dismiss,
    listNavigation,
    typeahead
  ]);

  return (
    <div>
      <button data-testid="return-focus" ref={returnFocusRef}>
        Return target
      </button>
      <button data-testid="advanced-trigger" ref={floating.referenceRef} {...getReferenceProps()}>
        Trigger
      </button>
      <div data-testid="advanced-transition">{transition.status}</div>
      <div data-testid="typing">{String(typing)}</div>
      <div data-testid="ignored-outside" data-ignore-outside="">
        Ignore outside
      </div>
      {transition.isMounted ? (
        <FloatingFocusManager context={floating.context} modal initialFocus={false} returnFocus={returnFocusRef}>
          <div
            data-testid="advanced-floating"
            ref={floating.floatingRef}
            {...getFloatingProps({
              style: {
                position: 'absolute',
                top: floating.coords.top,
                left: floating.coords.left,
                transition: transition.styles.transition
              }
            })}
          >
            {labelsRef.current.map((label, index) => (
              <button
                key={label}
                ref={(node) => {
                  elementsRef.current[index] = node;
                }}
                {...getItemProps({ 'data-index': index, 'data-testid': `advanced-item-${index}` })}
              >
                {label}
              </button>
            ))}
          </div>
        </FloatingFocusManager>
      ) : null}
    </div>
  );
}

function TreeUtilityProbe() {
  const tree = useFloatingTree();
  const [childOpen, setChildOpen] = React.useState(true);
  const [eventFrom, setEventFrom] = React.useState('');
  const parentId = useFloatingNodeId({ setOpen: () => undefined });
  const childId = useFloatingNodeId({ parentId, setOpen: (open) => setChildOpen(open) });

  React.useEffect(() => tree?.on('ping', (event) => setEventFrom(String(event.detail.from ?? ''))), [tree]);

  return (
    <div>
      <div data-testid="tree-children">{tree?.getChildren(parentId).length ?? 0}</div>
      <div data-testid="tree-child-open">{String(childOpen)}</div>
      <div data-testid="tree-event">{eventFrom}</div>
      <button data-testid="tree-emit" onClick={() => tree?.emit('ping', { from: childId })}>
        Emit
      </button>
      <button data-testid="tree-close" onClick={() => tree?.closeDescendants(parentId)}>
        Close
      </button>
    </div>
  );
}

function FocusManagerProbe() {
  const [open, setOpen] = React.useState(true);
  const floating = useFloating({
    open,
    onOpenChange: (nextOpen) => setOpen(nextOpen)
  });

  return (
    <div>
      <div data-testid="focus-outside">Outside</div>
      {open ? (
        <FloatingFocusManager
          context={floating.context}
          modal
          initialFocus={false}
          outsideElementsInert
          visuallyHiddenDismiss="Close floating"
        >
          <div data-testid="focus-floating" ref={floating.floatingRef}>
            <button data-testid="focus-inside">Inside</button>
          </div>
        </FloatingFocusManager>
      ) : null}
    </div>
  );
}

function NestedDismissProbe() {
  const [parentOpen, setParentOpen] = React.useState(false);
  const [childOpen, setChildOpen] = React.useState(false);
  const parent = useFloating({ placement: 'bottom-start', offset: 4, open: parentOpen, onOpenChange: setParentOpen });
  const child = useFloating({ placement: 'right-start', offset: 4, open: childOpen, onOpenChange: setChildOpen });
  const parentId = useFloatingNodeId({ setOpen: (open) => setParentOpen(open) });
  const childId = useFloatingNodeId({ parentId, setOpen: (open) => setChildOpen(open) });
  const parentClick = useClick(parent.context);
  const parentDismiss = useDismiss(parent.context, { nodeId: parentId, outsidePressEvent: 'mousedown' });
  const childClick = useClick(child.context);
  const childDismiss = useDismiss(child.context, { nodeId: childId, outsidePressEvent: 'mousedown' });
  const parentInteractions = useInteractions([parentClick, parentDismiss]);
  const childInteractions = useInteractions([childClick, childDismiss]);

  return (
    <div>
      <button data-testid="parent-trigger" ref={parent.referenceRef} {...parentInteractions.getReferenceProps()}>
        Parent
      </button>
      {parentOpen ? (
        <FloatingPortal>
          <div
            data-testid="parent-floating"
            ref={parent.floatingRef}
            {...parentInteractions.getFloatingProps({
              style: { position: 'absolute', top: parent.coords.top, left: parent.coords.left }
            })}
          >
            <button data-testid="parent-action">Parent action</button>
            <button data-testid="child-trigger" ref={child.referenceRef} {...childInteractions.getReferenceProps()}>
              Child
            </button>
          </div>
        </FloatingPortal>
      ) : null}
      {childOpen ? (
        <FloatingPortal>
          <div
            data-testid="child-floating"
            ref={child.floatingRef}
            {...childInteractions.getFloatingProps({
              style: { position: 'absolute', top: child.coords.top, left: child.coords.left }
            })}
          >
            <button data-testid="child-action">Child action</button>
          </div>
        </FloatingPortal>
      ) : null}
    </div>
  );
}

function DelayGroupSiblingsInner() {
  const group = useDelayGroup();
  const first = useFloating({ placement: 'bottom', offset: 4 });
  const second = useFloating({ placement: 'bottom', offset: 4 });
  const firstHover = useHover(first.context, { delay: { open: 40, close: 30 } });
  const secondHover = useHover(second.context, { delay: { open: 40, close: 30 } });
  const firstInteractions = useInteractions([firstHover]);
  const secondInteractions = useInteractions([secondHover]);

  return (
    <div>
      <div data-testid="delay-group-state">{group?.currentId ?? 'none'}:{String(group?.isInstantPhase ?? false)}</div>
      <button data-testid="hover-a" ref={first.referenceRef} {...firstInteractions.getReferenceProps()}>
        Hover A
      </button>
      <button data-testid="hover-b" ref={second.referenceRef} {...secondInteractions.getReferenceProps()}>
        Hover B
      </button>
      {first.open ? (
        <div
          data-testid="panel-a"
          ref={first.floatingRef}
          {...firstInteractions.getFloatingProps({ style: { position: 'absolute', top: first.coords.top, left: first.coords.left } })}
        >
          Panel A
        </div>
      ) : null}
      {second.open ? (
        <div
          data-testid="panel-b"
          ref={second.floatingRef}
          {...secondInteractions.getFloatingProps({ style: { position: 'absolute', top: second.coords.top, left: second.coords.left } })}
        >
          Panel B
        </div>
      ) : null}
    </div>
  );
}

function DelayGroupSiblingsProbe() {
  return (
    <FloatingDelayGroup delay={{ open: 40, close: 30 }}>
      <DelayGroupSiblingsInner />
    </FloatingDelayGroup>
  );
}

function NestedKeyboardProbe() {
  const [parentOpen, setParentOpen] = React.useState(false);
  const [childOpen, setChildOpen] = React.useState(false);
  const [parentActiveIndex, setParentActiveIndex] = React.useState<number | null>(null);
  const [childActiveIndex, setChildActiveIndex] = React.useState<number | null>(null);
  const parent = useFloating({ placement: 'bottom-start', offset: 4, open: parentOpen, onOpenChange: setParentOpen, role: 'menu' });
  const child = useFloating({ placement: 'right-start', offset: 4, open: childOpen, onOpenChange: setChildOpen, role: 'menu' });
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
    <div>
      <button data-testid="nested-parent-trigger" ref={parent.referenceRef} {...parentInteractions.getReferenceProps()}>
        Parent trigger
      </button>
      {parentOpen ? (
        <FloatingPortal>
          <FloatingFocusManager context={parent.context} initialFocus={false}>
            <div
              data-testid="nested-parent-floating"
              ref={parent.floatingRef}
              {...parentInteractions.getFloatingProps({
                style: { position: 'absolute', top: parent.coords.top, left: parent.coords.left }
              })}
            >
              <button
                ref={(node) => {
                  parentItemsRef.current[0] = node;
                }}
                {...parentInteractions.getItemProps({ 'data-index': 0, 'data-testid': 'nested-parent-item-0', role: 'menuitem' })}
              >
                Rename
              </button>
              <button
                ref={(node) => {
                  parentItemsRef.current[1] = node;
                }}
                {...parentInteractions.getItemProps({ 'data-index': 1, 'data-testid': 'nested-parent-item-1', role: 'menuitem' })}
              >
                Duplicate
              </button>
              <button
                ref={(node) => {
                  parentItemsRef.current[2] = node;
                }}
                {...childInteractions.getReferenceProps(parentInteractions.getItemProps({
                  'data-index': 2,
                  'data-testid': 'nested-submenu-trigger',
                  ref: child.referenceRef,
                  role: 'menuitem'
                }))}
              >
                More actions
              </button>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
      {childOpen ? (
        <FloatingPortal>
          <FloatingFocusManager context={child.context} initialFocus={false}>
            <div
              data-testid="nested-child-floating"
              ref={child.floatingRef}
              {...childInteractions.getFloatingProps({
                style: { position: 'absolute', top: child.coords.top, left: child.coords.left }
              })}
            >
              <button
                ref={(node) => {
                  childItemsRef.current[0] = node;
                }}
                {...childInteractions.getItemProps({ 'data-index': 0, 'data-testid': 'nested-child-item-0', role: 'menuitem' })}
              >
                Move
              </button>
              <button
                ref={(node) => {
                  childItemsRef.current[1] = node;
                }}
                {...childInteractions.getItemProps({ 'data-index': 1, 'data-testid': 'nested-child-item-1', role: 'menuitem' })}
              >
                Archive
              </button>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </div>
  );
}

afterEach(() => {
  vi.useRealTimers();
});

describe('floating interaction utilities', () => {
  it('composes click, role, dismiss, list navigation, typeahead, portal, focus manager, arrow, and transition helpers', async () => {
    const { getByTestId, queryByTestId } = render(<InteractionMenu />);
    const trigger = getByTestId('trigger');
    (trigger as any).getBoundingClientRect = () => ({ top: 100, bottom: 132, left: 120, right: 200, width: 80, height: 32 });

    fireEvent.click(trigger);

    await waitFor(() => expect(getByTestId('floating').getAttribute('role')).toBe('menu'));
    const floating = getByTestId('floating');
    (floating as any).getBoundingClientRect = () => ({ top: 0, left: 0, right: 180, bottom: 160, width: 180, height: 160 });
    fireEvent(window, new Event('resize'));

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(getByTestId('arrow').getAttribute('aria-hidden')).toBe('true');
    expect(getByTestId('arrow').getAttribute('data-side')).toBe('bottom');
    expect(getByTestId('arrow').querySelector('path')).toBeTruthy();
    await waitFor(() => expect(getByTestId('arrow').style.left || getByTestId('arrow').style.top).not.toBe(''));
    await waitFor(() => expect(getByTestId('arrow').style.top).toBe('-7px'));
    expect(getByTestId('transition').textContent).not.toBe('unmounted');

    fireEvent.keyDown(floating, { key: 'ArrowDown' });
    await waitFor(() => expect(getByTestId('item-1').hasAttribute('data-active')).toBe(true));

    fireEvent.keyDown(floating, { key: 'g' });
    await waitFor(() => expect(getByTestId('item-2').hasAttribute('data-active')).toBe(true));

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(queryByTestId('floating')).toBeNull());
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('provides overlay, delay group, floating list, tree, and composite helpers', () => {
    const { getByTestId, unmount } = render(
      <FloatingDelayGroup delay={{ open: 75, close: 25 }}>
        <FloatingTree>
          <FloatingList>
            <FloatingOverlay data-testid="overlay" lockScroll />
            <DelayProbe />
            <ListProbe />
            <TreeProbe />
            <Composite data-testid="composite">
              <button data-composite-item data-testid="first">First</button>
              <button data-composite-item data-testid="second">Second</button>
            </Composite>
          </FloatingList>
        </FloatingTree>
      </FloatingDelayGroup>
    );

    expect(getByTestId('overlay').style.position).toBe('fixed');
    expect(document.body.style.overflow).toBe('hidden');
    expect(getByTestId('delay').textContent).toBe('75/25');
    expect(getByTestId('list').textContent).toBe('true');
    expect(getByTestId('tree').textContent).toMatch(/^true:floating-node-/);

    getByTestId('first').focus();
    fireEvent.keyDown(getByTestId('composite'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(getByTestId('second'));

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('supports deeper parity options for click, dismiss, navigation, typeahead, transition, and focus management', async () => {
    const { getByTestId, queryByTestId } = render(<AdvancedInteractionProbe />);
    const trigger = getByTestId('advanced-trigger');

    (trigger as any).getBoundingClientRect = () => ({ top: 60, bottom: 92, left: 140, right: 220, width: 80, height: 32 });
    fireEvent.click(trigger, { detail: 1 });
    expect(queryByTestId('advanced-floating')).toBeNull();

    fireEvent.keyDown(trigger, { key: 'Enter' });
    await waitFor(() => expect(getByTestId('advanced-floating')).toBeTruthy());

    const floating = getByTestId('advanced-floating');
    (floating as any).getBoundingClientRect = () => ({ top: 0, left: 0, right: 220, bottom: 180, width: 220, height: 180 });
    fireEvent(window, new Event('resize'));

    await waitFor(() => expect(document.activeElement).toBe(getByTestId('advanced-item-0')));
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(getByTestId('advanced-floating')).toBeTruthy();
    expect(getByTestId('advanced-transition').textContent).toBe('open');

    fireEvent.keyDown(document.activeElement || floating, { key: 'a' });
    await waitFor(() => expect(getByTestId('typing').textContent).toBe('true'));
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('advanced-item-0')));

    fireEvent.mouseDown(getByTestId('ignored-outside'));
    expect(getByTestId('advanced-floating')).toBeTruthy();

    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(queryByTestId('advanced-floating')).toBeNull());
  });

  it('provides tree utilities for events and descendant closing', async () => {
    const { getByTestId } = render(
      <FloatingTree>
        <TreeUtilityProbe />
      </FloatingTree>
    );

    await waitFor(() => expect(getByTestId('tree-children').textContent).toBe('1'));
    fireEvent.click(getByTestId('tree-emit'));
    await waitFor(() => expect(getByTestId('tree-event').textContent).toMatch(/^floating-node-/));

    fireEvent.click(getByTestId('tree-close'));
    await waitFor(() => expect(getByTestId('tree-child-open').textContent).toBe('false'));
  });

  it('supports inert outside content and hidden dismiss in FloatingFocusManager', async () => {
    const { getByTestId, getByText, queryByTestId } = render(<FocusManagerProbe />);

    await waitFor(() => expect(getByTestId('focus-outside').getAttribute('aria-hidden')).toBe('true'));
    fireEvent.click(getByText('Close floating'));
    await waitFor(() => expect(queryByTestId('focus-floating')).toBeNull());
    await waitFor(() => expect(getByTestId('focus-outside').hasAttribute('aria-hidden')).toBe(false));
  });

  it('keeps parent and child floats coordinated through tree-aware dismiss logic', async () => {
    const { getByTestId, queryByTestId } = render(
      <FloatingTree>
        <NestedDismissProbe />
      </FloatingTree>
    );

    fireEvent.click(getByTestId('parent-trigger'));
    await waitFor(() => expect(getByTestId('parent-floating')).toBeTruthy());

    fireEvent.click(getByTestId('child-trigger'));
    await waitFor(() => expect(getByTestId('child-floating')).toBeTruthy());

    fireEvent.mouseDown(getByTestId('child-action'));
    expect(getByTestId('parent-floating')).toBeTruthy();
    expect(getByTestId('child-floating')).toBeTruthy();

    fireEvent.mouseDown(getByTestId('parent-action'));
    await waitFor(() => expect(queryByTestId('child-floating')).toBeNull());
    expect(getByTestId('parent-floating')).toBeTruthy();

    fireEvent.click(getByTestId('child-trigger'));
    await waitFor(() => expect(getByTestId('child-floating')).toBeTruthy());

    getByTestId('child-action').focus();
    fireEvent.keyDown(getByTestId('child-action'), { key: 'Escape' });
    await waitFor(() => expect(queryByTestId('child-floating')).toBeNull());
    expect(getByTestId('parent-floating')).toBeTruthy();

    fireEvent.click(getByTestId('child-trigger'));
    await waitFor(() => expect(getByTestId('child-floating')).toBeTruthy());
    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(queryByTestId('child-floating')).toBeNull());
    await waitFor(() => expect(queryByTestId('parent-floating')).toBeNull());
  });

  it('keeps delay groups instant while moving between sibling hover triggers', () => {
    vi.useFakeTimers();
    const { getByTestId, queryByTestId } = render(<DelayGroupSiblingsProbe />);

    fireEvent.mouseEnter(getByTestId('hover-a'));
    act(() => {
      vi.advanceTimersByTime(41);
    });

    expect(getByTestId('panel-a')).toBeTruthy();
    expect(getByTestId('delay-group-state').textContent).toMatch(/^delay-group-.*:true$/);

    fireEvent.mouseLeave(getByTestId('hover-a'));
    fireEvent.mouseEnter(getByTestId('hover-b'));
    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(getByTestId('panel-b')).toBeTruthy();
    expect(getByTestId('delay-group-state').textContent).toMatch(/^delay-group-.*:true$/);

    act(() => {
      vi.advanceTimersByTime(31);
    });
    expect(queryByTestId('panel-a')).toBeNull();
    expect(getByTestId('panel-b')).toBeTruthy();

    fireEvent.mouseLeave(getByTestId('hover-b'));
    act(() => {
      vi.advanceTimersByTime(31);
    });
    expect(queryByTestId('panel-b')).toBeNull();
    expect(getByTestId('delay-group-state').textContent).toBe('none:true');

    act(() => {
      vi.advanceTimersByTime(31);
    });
    expect(getByTestId('delay-group-state').textContent).toBe('none:false');
  });

  it('supports nested keyboard navigation and returns focus to the submenu trigger when the child closes', async () => {
    const { getByTestId, queryByTestId } = render(
      <FloatingTree>
        <NestedKeyboardProbe />
      </FloatingTree>
    );

    const trigger = getByTestId('nested-parent-trigger');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    await waitFor(() => expect(getByTestId('nested-parent-floating')).toBeTruthy());
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('nested-parent-item-0')));

    getByTestId('nested-submenu-trigger').focus();
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('nested-submenu-trigger')));
    expect(getByTestId('nested-submenu-trigger').getAttribute('aria-expanded')).toBe('false');

    fireEvent.keyDown(getByTestId('nested-submenu-trigger'), { key: 'ArrowRight' });
    await waitFor(() => expect(getByTestId('nested-child-floating')).toBeTruthy());
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('nested-child-item-0')));
    expect(getByTestId('nested-submenu-trigger').getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(getByTestId('nested-child-item-0'), { key: 'ArrowLeft' });
    await waitFor(() => expect(queryByTestId('nested-child-floating')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('nested-submenu-trigger')));
    expect(getByTestId('nested-parent-floating')).toBeTruthy();

    fireEvent.keyDown(getByTestId('nested-submenu-trigger'), { key: 'ArrowRight' });
    await waitFor(() => expect(getByTestId('nested-child-floating')).toBeTruthy());
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('nested-child-item-0')));

    fireEvent.keyDown(getByTestId('nested-child-item-0'), { key: 'Escape' });
    await waitFor(() => expect(queryByTestId('nested-child-floating')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(getByTestId('nested-submenu-trigger')));
    expect(getByTestId('nested-parent-floating')).toBeTruthy();
  });
});
