import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions
} from '@editora/ui-react';

export default function Example() {
  const floating = useFloating({
    placement: 'bottom-start',
    offset: 10,
    flip: true,
    shift: true,
    fitViewport: true,
    strategy: 'fixed'
  });

  const interactions = useInteractions([
    useClick(floating.context),
    useDismiss(floating.context)
  ]);

  return (
    <>
      <button ref={floating.referenceRef} {...interactions.getReferenceProps()}>
        Open
      </button>

      {floating.open ? (
        <FloatingPortal>
          <FloatingFocusManager context={floating.context}>
            <div
              ref={floating.floatingRef}
              {...interactions.getFloatingProps({
                style: {
                  position: 'fixed',
                  top: floating.coords.top,
                  left: floating.coords.left
                }
              })}
            >
              <FloatingArrow context={floating.context} fill="#fff" stroke="#111827" />
              Floating content
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}
