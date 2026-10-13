import { createMemoryManager } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo button { margin-right: 8px; padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa; font: inherit; }
    .demo p { margin: 12px 0 0; }
  </style>
  <div class="demo">
    <button id="ping" type="button">Ping</button>
    <button id="destroy" type="button">Destroy the manager</button>
    <p id="pings"></p>
    <p id="heap"></p>
  </div>`;

// Checks the heap every 10 s, and when it is above 200 MB clears the timers that were registered with it.
const memory = createMemoryManager({ maxMemoryMB: 200, cleanupIntervalMs: 10000 });

const pings = root.querySelector('#pings')!;
const heap = root.querySelector('#heap')!;
let heard = 0;
const showPings = () => (pings.textContent = `Pings heard: ${heard}`);
showPings();

// Added through the manager, so destroy() removes it.
memory.registerEventListener(root, 'ping', () => {
  heard++;
  showPings();
});

// An interval that the manager may clear, and that destroy() does clear.
const showHeap = () => {
  const usage = memory.getMemoryUsage(); // null where the browser does not say (only Chromium does)
  heap.textContent = usage ? `Heap: ${usage.used} MB of ${usage.limit} MB` : 'The heap size is not available in this browser';
};
showHeap();
memory.registerInterval(window.setInterval(showHeap, 1000));

root.querySelector('#ping')!.addEventListener('click', () => root.dispatchEvent(new Event('ping')));
root.querySelector('#destroy')!.addEventListener('click', () => memory.destroy());
