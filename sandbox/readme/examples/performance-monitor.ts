import { createPerformanceMonitor } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo button { padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa; font: inherit; }
    .demo pre { margin: 12px 0 0; font: 13px/1.6 ui-monospace, monospace; }
  </style>
  <div class="demo">
    <button id="run" type="button">Run a slow render</button>
    <pre id="out">No operation yet</pre>
  </div>`;

// Samples the heap every second (in Chromium) and does not log warnings. Call monitor.destroy() when you are done.
const monitor = createPerformanceMonitor({ sampleInterval: 1000, logWarnings: false });

root.querySelector('#run')!.addEventListener('click', () => {
  monitor.startOperation('render');
  const until = performance.now() + 30;
  while (performance.now() < until) {
    // 30 ms of work to measure
  }
  const metrics = monitor.endOperation(); // null if monitoring is off

  const average = monitor.getAverageMetrics(60_000);
  root.querySelector('#out')!.textContent = [
    `This render: ${Math.round(metrics?.renderTime ?? 0)} ms`,
    `Average over the last minute: ${average.renderTime ?? 0} ms`,
  ].join('\n');
});
