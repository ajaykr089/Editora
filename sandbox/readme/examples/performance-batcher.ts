import { createTransactionBatcher } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo button { padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa; font: inherit; }
    .demo ol { margin: 12px 0 0; padding-left: 20px; line-height: 1.7; }
  </style>
  <div class="demo">
    <button id="add" type="button">Add 7 transactions</button>
    <ol id="flushes"></ol>
  </div>`;

// Up to 5 transactions are handled together, and a smaller batch waits at most 200 ms for company.
const batcher = createTransactionBatcher({ maxBatchSize: 5, maxBatchTime: 200 });

batcher.setOnFlush((transactions) => {
  const item = document.createElement('li');
  item.textContent = `Handled ${transactions.length} together: ${transactions.map((transaction) => transaction.id).join(', ')}`;
  root.querySelector('#flushes')!.append(item);
});

let next = 1;
root.querySelector('#add')!.addEventListener('click', () => {
  for (let i = 0; i < 7; i++) batcher.add({ id: next++ });
});
