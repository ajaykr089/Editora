import React, { ReactNode, useRef, useState } from 'react';
import { PreviewEditorDialog } from "./PreviewEditorDialog";

interface PreviewPluginProviderProps {
  children: ReactNode;
}

interface SelectionBookmark {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
  collapsed: boolean;
}

export const PreviewPluginProvider: React.FC<PreviewPluginProviderProps> = ({
  children,
}) => {
  const [isPreviewEditorOpen, setIsPreviewEditorOpen] = useState(false);
  const [currentHtml, setCurrentHtml] = useState("");
  const selectionBookmarkRef = useRef<SelectionBookmark | null>(null);
  const commandRegistered = useRef(false);

  // Register command immediately when component mounts
  React.useLayoutEffect(() => {
    if (!commandRegistered.current && typeof window !== "undefined") {
      (window as any).registerEditorCommand?.("togglePreview", () => {
        openPreviewEditor();
      });
      commandRegistered.current = true;
    }
  }, []);

  // Serialize editor content to HTML string
  const serializeEditorContent = (): string => {
    const editorElement = document.querySelector(".rte-content") as HTMLElement;
    if (!editorElement) return "";

    // Clone the content to avoid modifying the original
    const clonedContent = editorElement.cloneNode(true) as HTMLElement;

    // Remove any RTE-specific classes or elements that shouldn't be in the source
    clonedContent
      .querySelectorAll(".rte-floating-toolbar, .rte-selection-marker")
      .forEach((el) => el.remove());

    // Return the inner HTML
    return clonedContent.innerHTML;
  };

  // Sanitize HTML to prevent XSS
  const sanitizeHTML = (html: string): string => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Remove dangerous elements and attributes
    const dangerousElements = tempDiv.querySelectorAll(
      'script, iframe[src^="javascript:"], object, embed, form[action^="javascript:"]',
    );
    dangerousElements.forEach((el) => el.remove());

    // Remove dangerous attributes
    const allElements = tempDiv.querySelectorAll("*");
    allElements.forEach((el) => {
      // Remove event handlers
      Array.from(el.attributes).forEach((attr) => {
        if (attr.name.startsWith("on")) {
          el.removeAttribute(attr.name);
        }
        // Remove javascript: URLs
        if (attr.name === "href" || attr.name === "src") {
          if (attr.value.startsWith("javascript:")) {
            el.removeAttribute(attr.name);
          }
        }
      });
    });

    return tempDiv.innerHTML;
  };

  // Restore selection from bookmark
  const restoreSelection = (bookmark: SelectionBookmark): void => {
    try {
      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      range.setStart(bookmark.startContainer, bookmark.startOffset);
      range.setEnd(bookmark.endContainer, bookmark.endOffset);

      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      // Selection restoration failed, ignore
      console.warn("Failed to restore selection:", error);
    }
  };

  // Open preview editor
  const openPreviewEditor = (): void => {
    // Serialize current content
    const html = serializeEditorContent();
    setCurrentHtml(html);
    setIsPreviewEditorOpen(true);
  };

  return (
    <>
      {children}
      <PreviewEditorDialog
        isOpen={isPreviewEditorOpen}
        onClose={() => setIsPreviewEditorOpen(false)}
        initialHtml={currentHtml}
      />
    </>
  );
};
