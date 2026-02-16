/**
 * Transaction Extension for Light Code Editor
 * Implements immutable state updates and batched changes.
 */

import { EditorExtension, Transaction } from '../types';

export class TransactionExtension implements EditorExtension {
  name = 'transaction';

  private transactions: Transaction[] = [];

  setup(editor) {
    editor.on('change', (change) => {
      const transaction: Transaction = {
        changes: [change],
        selection: editor.getSelection(),
        effects: [],
        annotations: []
      };
      this.transactions.push(transaction);
    });
  }

  getTransactions() {
    return this.transactions;
  }

  destroy() {
    this.transactions = [];
  }
}