import { DialogProvider, useDialog, AlertDialogProvider, useAlertDialog, Button } from '@editora/ui-react';

function Actions() {
  const dialog = useDialog();
  const alerts = useAlertDialog();

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        onClick={async () => {
          const res = await dialog.confirm({
            title: 'Archive project?',
            description: 'You can restore it later.',
            submitText: 'Archive'
          });
          console.log(res);
        }}
      >
        Confirm
      </Button>

      <Button
        variant="secondary"
        onClick={async () => {
          const res = await alerts.prompt({
            title: 'Rename',
            input: { required: true, placeholder: 'New name' }
          });
          console.log(res);
        }}
      >
        Prompt
      </Button>
    </div>
  );
}

export default function DialogExample() {
  return (
    <DialogProvider>
      <AlertDialogProvider>
        <Actions />
      </AlertDialogProvider>
    </DialogProvider>
  );
}
