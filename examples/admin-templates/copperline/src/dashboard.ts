import { $, esc } from './common';
import '@editora/ui-core/chart';
import '@editora/ui-core/data-table';
import { commerceSummary, money, orderId, ORDER_STATUS_LABEL, ORDER_STATUS_TONE, shortDate, wholeMoney } from '../../shared/data';

const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(Math.round(v * 1000) / 10)}% vs previous 30 days`;
const TONES = ['#b4531f', '#0f766e', '#4338ca', '#a16207', '#be123c', '#475569'];

$('#export').addEventListener('click', () => window.print());

const data = await commerceSummary();

const set = (name: string, text: string, cls?: string) => {
  const el = $(`[data-stat="${name}"]`);
  el.textContent = text;
  if (cls) el.className = `trend ${cls}`;
};
set('revenue', wholeMoney(data.revenue));
set('revenue-trend', pct(data.revenueChange), data.revenueChange >= 0 ? 'cl-up' : 'cl-down');
set('orders', String(data.orders));
set('orders-trend', pct(data.ordersChange), data.ordersChange >= 0 ? 'cl-up' : 'cl-down');
set('aov', money(data.aov));
set('customers', String(data.newCustomers));

// Charts take their data as JSON attributes (or the .data property).
const revenue = $('#revenue-chart');
revenue.setAttribute('labels', JSON.stringify(data.months.map((m) => m.label)));
revenue.setAttribute('values', JSON.stringify(data.months.map((m) => m.revenue)));
revenue.setAttribute('state', 'idle');
const categories = $('#category-chart');
categories.setAttribute('data', JSON.stringify(data.byCategory.map((point, i) => ({ ...point, tone: TONES[i % TONES.length] }))));
categories.setAttribute('state', 'idle');

// The data table wraps an ordinary <table>: fill its <tbody> and it does the rest.
const table = $('#recent');
table.querySelector('tbody')!.innerHTML = data.recent.map((order) => `
  <tr data-href="./order.html?id=${orderId(order.id)}">
    <td><a class="cl-strong" href="./order.html?id=${orderId(order.id)}">${esc(order.id)}</a></td>
    <td>${esc(order.customer)}<span class="cl-sub">${esc(order.email)}</span></td>
    <td>${shortDate(order.date)}</td>
    <td data-align="end">${money(order.total)}</td>
    <td><ui-badge tone="${ORDER_STATUS_TONE[order.status]}" variant="soft" size="sm">${ORDER_STATUS_LABEL[order.status]}</ui-badge></td>
  </tr>`).join('');
table.setAttribute('state', 'idle');
