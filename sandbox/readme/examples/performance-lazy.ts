import { lazyLoader } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo button { padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa; font: inherit; }
    .demo p { margin: 12px 0 0; }
  </style>
  <div class="demo">
    <button id="open" type="button">Open the chart twice</button>
    <p id="status"></p>
  </div>`;

let downloads = 0;

// Stands in for () => import('./chart'): anything that returns a promise will do.
const loadChart = () =>
  new Promise<{ draw: () => string }>((resolve) => {
    downloads++;
    setTimeout(() => resolve({ draw: () => 'chart drawn' }), 100);
  });

root.querySelector('#open')!.addEventListener('click', async () => {
  // Two callers ask for the same module before it has arrived: the loader runs once, and both get the module.
  const [first, second] = await Promise.all([lazyLoader.load('chart', loadChart), lazyLoader.load('chart', loadChart)]);
  root.querySelector('#status')!.textContent = `${first.draw()} · same module: ${first === second} · loader ran ${downloads} time${downloads === 1 ? '' : 's'}`;
});
