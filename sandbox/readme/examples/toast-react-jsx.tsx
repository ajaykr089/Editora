import { Toaster, toast } from '@editora/toast/react';

export default function App() {
  function archive() {
    // JSX goes anywhere text does: the title, the message, the description, the icon.
    toast.success(
      <span>
        Moved <strong>Q3-summary.pdf</strong> to Archive
      </span>,
      { action: { label: 'Undo', onClick: () => toast.info('Moved back') } }
    );
  }

  function invite() {
    // A toast made of your own JSX, in the toast card, with a function that dismisses it.
    toast.custom(
      ({ dismiss }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ flex: 1 }}>
            Ana invited you to <strong>Roadmap</strong>
          </span>
          <button onClick={dismiss}>Join</button>
        </div>
      ),
      { duration: 0 }
    );
  }

  return (
    <>
      {/* Once, inside your providers: it renders the JSX of the toasts, with your app's context. */}
      <Toaster position="bottom-right" />
      <button onClick={archive}>Archive</button>
      <button onClick={invite}>Invite</button>
    </>
  );
}
