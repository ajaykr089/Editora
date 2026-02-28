/**
 * Transaction Extension for Light Code Editor
 * Implements immutable state updates and batched changes.
 */

import { EditorCore, EditorExtension, TextChange, Transaction } from '../types';

export class TransactionExtension implements EditorExtension {
  name = 'transaction';

  private transactions: Transaction[] = [];

  setup(editor: EditorCore): void {
    editor.on('change', (changes: TextChange[]) => {
      const transaction: Transaction = {
        changes,
        selection: editor.getSelection(),
        effects: [],
        annotations: []
      };
      this.transactions.push(transaction);
    });
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  destroy(): void {
    this.transactions = [];
  }
}
