import { $, esc } from './common';
import '@editora/ui-core/data-table';
import '@editora/ui-core/input';
import '@editora/ui-core/select';
import '@editora/ui-core/pagination';
import { listOrders, money, orderId, ORDER_STATUS_LABEL, ORDER_STATUS_TONE, shortDate, type Order } from '../../shared/data';

const PAGE_SIZE = 15;
const table = $('#orders');
const pager = $('#orders-pager');
const search = $('#search');
const status = $('#status');
const query = { page: 1, sort: 'date' as keyof Order, direction: 'desc' as 'asc' | 'desc', query: '', status: '' };

// Ask the pretend server for one page, then fill the table. Only the latest answer is used.
let ticket = 0;
async function load() {
  const mine = ++ticket;
  table.setAttribute('state', 'loading');
  const result = await listOrders({ ...query, pageSize: PAGE_SIZE });
  if (mine !== ticket) return;
  table.querySelector('tbody')!.innerHTML = result.rows.map((order) => `
    <tr data-id="${esc(order.id)}" data-href="./order.html?id=${orderId(order.id)}">
      <td><a class="cl-strong" href="./order.html?id=${orderId(order.id)}">${esc(order.id)}</a><span class="cl-sub">${order.lines.length} items</span></td>
      <td>${esc(order.customer)}<span class="cl-sub">${esc(order.email)}</span></td>
      <td>${shortDate(order.date)}</td>
      <td>${esc(order.channel)}</td>
      <td data-align="end">${money(order.total)}</td>
      <td><ui-badge tone="${ORDER_STATUS_TONE[order.status]}" variant="soft" size="sm">${ORDER_STATUS_LABEL[order.status]}</ui-badge></td>
    </tr>`).join('');
  table.setAttribute('total-rows', String(result.total));
  table.setAttribute('page', String(query.page));
  pager.setAttribute('count', String(Math.max(1, Math.ceil(result.total / PAGE_SIZE))));
  pager.setAttribute('page', String(query.page));
  table.setAttribute('state', 'idle');
}

// Events from the elements: sorting and paging come from the table (server-side mode), the
// filters from the input and select. Each change goes back to page 1.
table.addEventListener('sort-change', (event) => {
  const { key, direction } = (event as CustomEvent).detail;
  Object.assign(query, { sort: key, direction, page: 1 });
  void load();
});
table.addEventListener('page-change', (event) => {
  query.page = (event as CustomEvent).detail.page;
  void load();
});
search.addEventListener('debounced-input', () => {
  query.query = (search as HTMLInputElement).value;
  query.page = 1;
  void load();
});
search.addEventListener('clear', () => { query.query = ''; query.page = 1; void load(); });
status.addEventListener('change', () => {
  query.status = (status as HTMLSelectElement).value || '';
  query.page = 1;
  void load();
});

void load();
