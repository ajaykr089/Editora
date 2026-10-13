import { createDebouncer, debounce } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo input { box-sizing: border-box; width: 100%; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 8px; font: inherit; }
    .demo p { margin: 10px 0 0; }
    .demo .counts { font: 12px ui-monospace, monospace; color: #57606a; }
  </style>
  <div class="demo">
    <input id="query" type="search" placeholder="Type quickly" aria-label="Search" />
    <p class="counts" id="counts"></p>
    <p id="result"></p>
  </div>`;

const input = root.querySelector<HTMLInputElement>('#query')!;
const counts = root.querySelector('#counts')!;
const result = root.querySelector('#result')!;

let keystrokes = 0;
let searches = 0;
const showCounts = () => (counts.textContent = `keystrokes: ${keystrokes} · searches: ${searches}`);
showCounts();

// One search, 300 ms after the last keystroke, with the text as it is then. Each new call cancels the one waiting.
const search = createDebouncer(300);
input.addEventListener('input', () => {
  keystrokes++;
  showCounts();
  search.execute((text: string) => {
    searches++;
    result.textContent = text ? `Results for "${text}"` : '';
    showCounts();
  }, input.value);
});

// debounce() wraps a function that you call yourself, such as a resize handler.
window.addEventListener('resize', debounce(() => console.log('resized', window.innerWidth), 150));
