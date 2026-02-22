import { useAlertDialog } from '@editora/ui-react';

export function useConfirmAction() {
  const dialog = useAlertDialog();

  return async (options: { title: string; description: string; confirmText?: string; cancelText?: string }) => {
    const result = await dialog.confirm({
      title: options.title,
      description: options.description,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel'
    });

    return result.action === 'confirm';
  };
}
