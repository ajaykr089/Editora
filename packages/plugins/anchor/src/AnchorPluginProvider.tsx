import React, { ReactNode, useState } from "react";
import {
  insertAnchorCommand,
  renameAnchorCommand,
  deleteAnchorCommand,
} from "./AnchorPlugin";
import { AnchorDialog } from "./AnchorDialog";
import "./AnchorStyles.css";

interface AnchorPluginProviderProps {
  children: ReactNode;
}

interface DialogState {
  isOpen: boolean;
  mode: "add" | "edit";
  currentId?: string;
  anchorElement?: HTMLElement;
  savedRange?: Range;
}

/**
 * AnchorPluginProvider
 *
 * Registers anchor commands, handles anchor interactions,
 * and provides dialog for adding/editing anchor IDs.
 */
export const AnchorPluginProvider: React.FC<AnchorPluginProviderProps> = ({
  children,
}) => {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    mode: "add",
  });

  React.useEffect(() => {
    // Register anchor commands
    if (typeof window !== "undefined") {
      (window as any).registerEditorCommand?.("insertAnchor", () => {
        // Save the current cursor position before opening dialog
        const selection = window.getSelection();
        let savedRange: Range | undefined;

        if (selection && selection.rangeCount > 0) {
          savedRange = selection.getRangeAt(0).cloneRange();
        }

        setDialogState({
          isOpen: true,
          mode: "add",
          savedRange,
        });
      });

      (window as any).registerEditorCommand?.(
        "renameAnchor",
        (oldId: string, newId: string) => {
          renameAnchorCommand(oldId, newId);
        },
      );

      (window as any).registerEditorCommand?.(
        "deleteAnchor",
        (anchorId: string) => {
          deleteAnchorCommand(anchorId);
        },
      );
    }

    // Handle double-click on anchors to open edit dialog
    const handleAnchorDoubleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest(
        ".rte-anchor",
      ) as HTMLElement;
      if (!anchor) return;

      e.preventDefault();
      e.stopPropagation();

      const currentId = anchor.id || "";
      setDialogState({
        isOpen: true,
        mode: "edit",
        currentId,
        anchorElement: anchor,
      });
    };

    // Handle right-click on anchors to show context menu
    const handleAnchorRightClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest(
        ".rte-anchor",
      ) as HTMLElement;
      if (!anchor) return;

      e.preventDefault();
    };

    document.addEventListener("dblclick", handleAnchorDoubleClick);
    document.addEventListener("contextmenu", handleAnchorRightClick);

    // Monitor for paste events to sanitize anchors
    const handlePaste = (e: ClipboardEvent) => {
      const pastedData = e.clipboardData?.getData("text/html");
      if (!pastedData) return;

      // Check if pasted content has anchors
      if (pastedData.includes("rte-anchor")) {
        // Sanitization would happen in the paste handler
      }
    };

    const editor = document.querySelector("[data-editora-editor]");
    if (editor) {
      editor.addEventListener("paste", handlePaste);
    }

    return () => {
      document.removeEventListener("dblclick", handleAnchorDoubleClick);
      document.removeEventListener("contextmenu", handleAnchorRightClick);
      if (editor) {
        editor.removeEventListener("paste", handlePaste);
      }
    };
  }, []);

  const handleSave = (anchorId: string) => {
    if (dialogState.mode === "add") {
      // Restore cursor position before inserting
      if (dialogState.savedRange) {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(dialogState.savedRange);
        }
      }
      insertAnchorCommand(anchorId);
    } else if (dialogState.mode === "edit" && dialogState.currentId) {
      renameAnchorCommand(dialogState.currentId, anchorId);
    }

    setDialogState({
      isOpen: false,
      mode: "add",
    });
  };

  const handleCancel = () => {
    setDialogState({
      isOpen: false,
      mode: "add",
    });
  };

  return (
    <>
      {children}
      <AnchorDialog
        isOpen={dialogState.isOpen}
        mode={dialogState.mode}
        currentId={dialogState.currentId}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </>
  );
};
