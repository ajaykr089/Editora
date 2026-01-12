import { Node } from './model/Node';
import { Schema } from './schema/Schema';
import { Selection } from './Selection';
import { Plugin } from './plugins/Plugin';
import { Mark, MarkType } from './model/Mark';
import { Fragment } from './model/Fragment';

export interface EditorStateConfig {
  doc: Node;
  schema: Schema;
  selection?: Selection;
  plugins?: readonly Plugin[];
  version?: number;
  storedMarks?: readonly Mark[] | null;
}

/**
 * Immutable editor state representing the complete state of the editor at a point in time.
 * All state changes are made through transactions to ensure predictability and enable features
 * like undo/redo, collaboration, and time-travel debugging.
 */
export class EditorState {
  public readonly doc: Node;
  public readonly schema: Schema;
  public readonly selection: Selection;
  public readonly plugins: readonly Plugin[];
  public readonly version: number;
  public readonly storedMarks: readonly Mark[] | null;

  constructor(config: EditorStateConfig) {
    this.doc = config.doc;
    this.schema = config.schema;
    this.selection = config.selection || Selection.atStart(this.doc);
    this.plugins = Object.freeze(config.plugins || []);
    this.version = config.version || 0;
    this.storedMarks = config.storedMarks || null;
  }

  /**
   * Create a new EditorState from configuration.
   */
  static create(config: EditorStateConfig): EditorState {
    return new EditorState(config);
  }

  /**
   * Create a new EditorState with updated properties.
   * This method creates a new immutable instance while sharing unchanged references.
   */
  update(updates: Partial<EditorStateConfig>): EditorState {
    return new EditorState({
      doc: updates.doc ?? this.doc,
      schema: updates.schema ?? this.schema,
      selection: updates.selection ?? this.selection,
      plugins: updates.plugins ?? this.plugins,
      version: (updates.version ?? this.version) + 1
    });
  }

  /**
   * Apply a transaction to create a new state.
   * Transactions encapsulate all state changes and can be reversed for undo functionality.
   */
  apply(tr: Transaction): EditorState {
    return tr.apply(this);
  }

  /**
   * Create a transaction that can modify this state.
   */
  get tr(): Transaction {
    return new Transaction(this);
  }

  /**
   * Check if this state is equal to another state.
   * Used for change detection and optimization.
   */
  equals(other: EditorState): boolean {
    return (
      this.doc === other.doc &&
      this.schema === other.schema &&
      this.selection.equals(other.selection) &&
      this.plugins === other.plugins &&
      this.version === other.version
    );
  }

  /**
   * Get stored marks at the current selection.
   * Stored marks are marks that should be applied to newly typed content.
   */
  get storedMarksGetter(): readonly Mark[] | null {
    return this.storedMarks;
  }

  /**
   * Check if the document can be modified at the current selection.
   */
  get isEditable(): boolean {
    return true; // Can be overridden by plugins or configuration
  }
}

/**
 * Transaction class for batched state changes.
 * Transactions ensure atomic updates and enable undo/redo functionality.
 */
export class Transaction {
  private readonly before: EditorState;
  private steps: Step[] = [];
  private metadata: Map<string, any> = new Map();
  private updated: Partial<EditorStateConfig> = {};

  constructor(before: EditorState) {
    this.before = before;
  }

  /**
   * Apply this transaction to create a new editor state.
   */
  apply(before: EditorState = this.before): EditorState {
    let state = before;

    // Apply all steps in order
    for (const step of this.steps) {
      const result = step.apply(state);
      if (result.failed) {
        throw new Error(`Transaction failed: ${result.failed}`);
      }
      state = result.state;
    }

    // Apply any direct state updates
    if (Object.keys(this.updated).length > 0) {
      state = state.update(this.updated);
    }

    return state;
  }

  /**
   * Add a step to this transaction.
   */
  step(step: Step): Transaction {
    this.steps.push(step);
    return this;
  }

  /**
   * Set document directly (bypasses normal step validation).
   */
  setDoc(doc: Node): Transaction {
    this.updated.doc = doc;
    return this;
  }

  /**
   * Set selection directly.
   */
  setSelection(selection: Selection): Transaction {
    this.updated.selection = selection;
    return this;
  }

  /**
   * Add metadata to this transaction.
   */
  setMeta(key: string, value: any): Transaction {
    this.metadata.set(key, value);
    return this;
  }

  /**
   * Get metadata from this transaction.
   */
  getMeta(key: string): any {
    return this.metadata.get(key);
  }

  /**
   * Add stored marks to this transaction.
   */
  setStoredMarks(marks: readonly Mark[]): Transaction {
    this.updated.storedMarks = marks;
    return this;
  }

  /**
   * Add a mark to a range.
   */
  addMark(from: number, to: number, mark: Mark): Transaction {
    const step = new AddMarkStep(from, to, mark);
    return this.step(step);
  }

  /**
   * Remove a mark from a range.
   */
  removeMark(from: number, to: number, markType: MarkType): Transaction {
    const step = new RemoveMarkStep(from, to, markType);
    return this.step(step);
  }

  /**
   * Insert text at a position.
   */
  insertText(pos: number, text: string, marks?: readonly Mark[]): Transaction {
    const step = new ReplaceStep(pos, pos, Fragment.from([Node.text(text, marks)]));
    return this.step(step);
  }

  /**
   * Replace content in a range.
   */
  replace(from: number, to: number, slice: Fragment): Transaction {
    const step = new ReplaceStep(from, to, slice);
    return this.step(step);
  }

  /**
   * Set the block type for nodes in a range.
   */
  setBlockType(from: number, to: number, nodeType: any, attrs?: any): Transaction {
    const doc = this.updated.doc || this.before.doc;
    const newChildren: Node[] = [];
    
    doc.content.children.forEach((child, idx) => {
      const childStart = idx === 0 ? 1 : newChildren.reduce((sum, n) => sum + n.nodeSize, 1);
      const childEnd = childStart + child.nodeSize;
      
      if (childEnd > from && childStart < to && !child.isText) {
        newChildren.push(nodeType.create(attrs || {}, child.content, child.marks));
      } else {
        newChildren.push(child);
      }
    });
    
    const newDoc = doc.type.create(doc.attrs, Fragment.from(newChildren));
    this.updated.doc = newDoc;
    return this;
  }

  /**
   * Wrap a range in a node.
   */
  wrapIn(nodeType: any, attrs?: any): Transaction {
    const doc = this.updated.doc || this.before.doc;
    const { from, to } = this.before.selection;
    const newChildren: Node[] = [];
    const wrappedChildren: Node[] = [];
    
    doc.content.children.forEach((child, idx) => {
      const childStart = idx === 0 ? 1 : newChildren.reduce((sum, n) => sum + n.nodeSize, 1) + wrappedChildren.reduce((sum, n) => sum + n.nodeSize, 0);
      const childEnd = childStart + child.nodeSize;
      
      if (childEnd > from && childStart < to && !child.isText) {
        wrappedChildren.push(child);
      } else {
        if (wrappedChildren.length > 0) {
          newChildren.push(nodeType.create(attrs || {}, Fragment.from(wrappedChildren)));
          wrappedChildren.length = 0;
        }
        newChildren.push(child);
      }
    });
    
    if (wrappedChildren.length > 0) {
      newChildren.push(nodeType.create(attrs || {}, Fragment.from(wrappedChildren)));
    }
    
    const newDoc = doc.type.create(doc.attrs, Fragment.from(newChildren));
    this.updated.doc = newDoc;
    return this;
  }

  /**
   * Get the state before this transaction.
   */
  get beforeState(): EditorState {
    return this.before;
  }
}

/**
 * Result of applying a step to a state.
 */
export interface StepResult {
  state: EditorState;
  failed?: string;
}

/**
 * A single atomic change to the editor state.
 */
export interface Step {
  apply(state: EditorState): StepResult;
  invert?(state: EditorState): Step;
  map?(mapping: any): Step | null;
}

/**
 * Step for adding a mark to a range.
 */
export class AddMarkStep implements Step {
  constructor(
    public readonly from: number,
    public readonly to: number,
    public readonly mark: Mark
  ) {}

  apply(state: EditorState): StepResult {
    const newDoc = state.doc.addMark(this.from, this.to, this.mark);
    return {
      state: state.update({ doc: newDoc })
    };
  }
}

/**
 * Step for removing a mark from a range.
 */
export class RemoveMarkStep implements Step {
  constructor(
    public readonly from: number,
    public readonly to: number,
    public readonly markType: MarkType
  ) {}

  apply(state: EditorState): StepResult {
    const newDoc = state.doc.removeMark(this.from, this.to, this.markType);
    return {
      state: state.update({ doc: newDoc })
    };
  }
}

/**
 * Step for replacing content in a range.
 */
export class ReplaceStep implements Step {
  constructor(
    public readonly from: number,
    public readonly to: number,
    public readonly slice: Fragment
  ) {}

  apply(state: EditorState): StepResult {
    const newDoc = state.doc.replace(this.from, this.to, this.slice);
    return {
      state: state.update({ doc: newDoc })
    };
  }
}

// Re-export for convenience
export type { Mark } from './model/Mark';