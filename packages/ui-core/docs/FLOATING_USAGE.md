# Floating Positioning Guide

This guide documents the first-party floating primitives in Editora UI and maps them to the Floating UI ideas most developers already know.

The goal is similar capability, but the API is not a drop-in clone of `floating-ui`.

## Packages

- `@editora/ui-core`
  - framework-agnostic positioning engine
  - custom-element consumers such as `ui-menu`, `ui-context-menu`, `ui-hover-card`, `ui-floating-toolbar`
- `@editora/ui-react`
  - React hook and interaction layer built on the shared core engine

## Concept Map

| Floating UI concept | Editora API |
| --- | --- |
| `computePosition` | `computePositionState()` |
| `autoUpdate` | `autoUpdatePositioner()` or `createPositioner()` observer lifecycle |
| `offset` | `offset` option or `offsetMiddleware()` |
| `shift` | `shift` option or `shiftMiddleware()` |
| `flip` | `flip` option or `flipMiddleware()` |
| `arrow` | `arrow` option or `arrowMiddleware()` |
| `size` | `sizeMiddleware()` |
| `autoPlacement` | `autoPlacement` option or `autoPlacementMiddleware()` |
| `hide` | `hideWhenDetached` or `hideMiddleware()` |
| `inline` | `inline` option |
| `detectOverflow` | `detectPositionerOverflow()` |
| virtual elements | `createVirtualPoint()`, `createVirtualRect()`, `createVirtualRange()` |
| React `useFloating` | `useFloating()` |
| React interactions | `useInteractions()` plus `useClick()`, `useHover()`, `useFocus()`, `useDismiss()`, `useRole()`, `useListNavigation()`, `useTypeahead()`, `useClientPoint()`, `useTransition()` |
| React helpers | `FloatingArrow`, `FloatingPortal`, `FloatingOverlay`, `FloatingFocusManager`, `FloatingTree`, `FloatingList`, `FloatingDelayGroup`, `Composite` |

## Core Usage

Use `@editora/ui-core/runtime` when you want direct control over the positioning engine.

```ts
import {
  createPositioner,
  type PositionerHandle
} from '@editora/ui-core/runtime';

let positioner: PositionerHandle | null = null;

function mountFloating(anchor: HTMLElement, floating: HTMLElement, arrow: HTMLElement | null) {
  positioner?.destroy();

  positioner = createPositioner({
    anchor,
    floating,
    placement: 'bottom-start',
    strategy: 'fixed',
    offset: 8,
    flip: true,
    shift: true,
    fitViewport: true,
    boundaryPadding: 8,
    arrow,
    onUpdate(state) {
      floating.dataset.side = state.placement.split('-')[0];
      floating.dataset.placement = state.placement;
    }
  });
}

function unmountFloating() {
  positioner?.destroy();
  positioner = null;
}
```

### Common `createPositioner()` options

- `placement`
- `strategy`
- `offset`
- `crossOffset`
- `flip`
- `shift`
- `autoPlacement`
- `matchWidth`
- `fitViewport`
- `inline`
- `hideWhenDetached`
- `boundary`
- `boundaryPadding`
- `arrow`
- `allowedPlacements`
- `fallbackPlacements`
- `middleware`
- `observeScroll`
- `observeAncestorScroll`
- `observeAncestorResize`
- `observeLayoutShift`
- `observeAnchorResize`
- `observeFloatingResize`
- `animationFrame`

### One-shot computation

Use `computePositionState()` when you want the coordinates without creating a long-lived handle.

```ts
import { computePositionState } from '@editora/ui-core/runtime';

const state = computePositionState({
  anchor: button,
  floating: panel,
  placement: 'right-start',
  strategy: 'fixed',
  offset: 12,
  flip: true,
  shift: true
});

panel.style.left = `${Math.round(state.x)}px`;
panel.style.top = `${Math.round(state.y)}px`;
```

### Auto update

Use `autoUpdatePositioner()` when you want to wire your own update lifecycle.

```ts
import { autoUpdatePositioner } from '@editora/ui-core/runtime';

const cleanup = autoUpdatePositioner(button, panel, () => {
  // recompute or call your own update function
}, {
  observeScroll: true,
  observeAncestorScroll: true,
  observeAncestorResize: true,
  observeWindowResize: true
});

// later
cleanup();
```

### Virtual anchors

Use virtual anchors for context menus, client-point popovers, and selection-based UI.

```ts
import { createVirtualPoint } from '@editora/ui-core/runtime';

const anchor = createVirtualPoint(event.clientX, event.clientY, document.body);

createPositioner({
  anchor,
  floating: menu,
  placement: 'right-start',
  strategy: 'fixed'
});
```

### Overflow inspection

```ts
import { detectPositionerOverflow } from '@editora/ui-core/runtime';

const overflow = detectPositionerOverflow({
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
  padding: 8
});
```

## React Usage

Use `useFloating()` as the shared React entry point.

```tsx
import React from 'react';
import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole
} from '@editora/ui-react';

export function Example() {
  const floating = useFloating({
    placement: 'bottom-start',
    offset: 10,
    flip: true,
    shift: true,
    fitViewport: true,
    role: 'menu'
  });

  const interactions = useInteractions([
    useClick(floating.context),
    useDismiss(floating.context),
    useRole(floating.context, { role: 'menu' })
  ]);

  return (
    <>
      <button ref={floating.referenceRef} {...interactions.getReferenceProps()}>
        Open menu
      </button>

      {floating.open ? (
        <FloatingPortal>
          <FloatingFocusManager context={floating.context}>
            <div
              ref={floating.floatingRef}
              {...interactions.getFloatingProps({
                style: {
                  position: floating.strategy,
                  top: floating.coords.top,
                  left: floating.coords.left
                }
              })}
            >
              <FloatingArrow context={floating.context} fill="#fff" stroke="#111827" />
              <button>First action</button>
              <button>Second action</button>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}
```

### `useFloating()` options

- `placement`
- `offset`
- `open`
- `onOpen`
- `onClose`
- `onOpenChange`
- `role`
- `flip`
- `shift`
- `matchWidth`
- `fitViewport`
- `strategy`
- `arrowPadding`
- `dir`
- `boundary`
- `boundaryPadding`
- `autoPlacement`
- `allowedPlacements`
- `fallbackPlacements`
- `inline`
- `hideWhenDetached`
- `observeWindowResize`
- `observeScroll`
- `observeAncestorScroll`
- `observeAncestorResize`
- `observeLayoutShift`
- `observeAnchorResize`
- `observeFloatingResize`
- `animationFrame`
- `middleware`

### Interaction hooks

Compose only what you need:

- `useInteractions()`
- `useClick()`
- `useHover()`
- `useFocus()`
- `useDismiss()`
- `useRole()`
- `useListNavigation()`
- `useTypeahead()`
- `useClientPoint()`
- `useTransition()`

### Tree and nested menus

For nested menus, submenus, and coordinated dismiss behavior:

- wrap the surface in `FloatingTree`
- use `useFloatingNodeId()`
- pass `nodeId` into `useDismiss()` / nested navigation hooks

### Delay groups and lists

- `FloatingDelayGroup` coordinates hover timing across siblings
- `FloatingList` shares item refs and labels for list navigation and typeahead

## Built-in Consumers

The shared engine is already used by floating components in `ui-core`, including:

- `ui-menu`
- `ui-menubar`
- `ui-context-menu`
- `ui-hover-card`
- `ui-floating-toolbar`
- date/time picker overlays via `date-time-utils`

That means React wrappers and Web Components ride the same positioning behavior instead of each inventing their own math.

## Manual Demos

Use Storybook for manual verification:

- `UI Primitives/Positioner`
  - source: `.storybook/stories/Positioner.stories.tsx`
- `UI Primitives/Floating React`
  - source: `.storybook/stories/FloatingInteractions.stories.tsx`

These demos cover:

- placement matrix
- scroll-aware flip
- virtual point anchors
- inline anchors
- arrow placement
- nested floating trees
- focus management
- list navigation
- typeahead

## Notes

- The feature set is intentionally close to Floating UI concepts, but it is not a strict 1:1 public API.
- Screen-reader roles and interaction semantics still belong to the consuming component, not just the positioner.
- For framework-agnostic usage, prefer `createPositioner()`.
- For React usage, prefer `useFloating()` plus the interaction helpers.
