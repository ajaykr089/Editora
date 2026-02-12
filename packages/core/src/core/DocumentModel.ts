/**
 * DocumentModel - Represents the editor content
 */

import { Node } from '../schema/Node';

export interface Selection {
  anchor: number;
  head: number;
  from?: number;
  to?: number;
}

export class DocumentModel {
  private doc: Node;
  private selection: Selection;

  constructor(doc: Node, selection: Selection = { anchor: 0, head: 0 }) {
    this.doc = doc;
    this.selection = selection;
  }

  getDocument(): Node {
    return this.doc;
  }

  setDocument(doc: Node): DocumentModel {
    return new DocumentModel(doc, this.selection);
  }

  getSelection(): Selection {
    return { ...this.selection };
  }

  setSelection(selection: Selection): DocumentModel {
    return new DocumentModel(this.doc, selection);
  }

  /**
   * Create a new model with updated document and selection
   */
  update(doc?: Node, selection?: Selection): DocumentModel {
    return new DocumentModel(
      doc || this.doc,
      selection || this.selection
    );
  }

  /**
   * Get text content
   */
  getTextContent(): string {
    // This would traverse the node tree to extract text
    // Simplified for now
    return '';
  }

  /**
   * Check if selection is empty
   */
  isSelectionEmpty(): boolean {
    return this.selection.anchor === this.selection.head;
  }
}
