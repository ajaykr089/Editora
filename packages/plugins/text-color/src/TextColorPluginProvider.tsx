import React, { ReactNode } from 'react';
import { ColorPickerDialog } from './ColorPickerDialog';

interface TextColorPluginProviderProps {
  children: ReactNode;
}

export const TextColorPluginProvider: React.FC<TextColorPluginProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('openTextColorDialog', () => {
      setIsDialogOpen(true);
    });
  }, []);

  const handleColorSelect = (color: string) => {
    document.execCommand('foreColor', false, color);
  };

  return (
    <>
      {children}
      <ColorPickerDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onColorSelect={handleColorSelect}
        type="text"
        initialColor="#000000"
      />
    </>
  );
};
