import React, { ReactNode } from 'react';
import { ColorPickerDialog } from '../../text-color/src/ColorPickerDialog';

interface BackgroundColorPluginProviderProps {
  children: ReactNode;
}

export const BackgroundColorPluginProvider: React.FC<BackgroundColorPluginProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('openBackgroundColorDialog', () => {
      setIsDialogOpen(true);
    });
  }, []);

  const handleColorSelect = (color: string) => {
    document.execCommand('backColor', false, color);
  };

  return (
    <>
      {children}
      <ColorPickerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onColorSelect={handleColorSelect}
        type="background"
        initialColor="#ffffff"
      />
    </>
  );
};
