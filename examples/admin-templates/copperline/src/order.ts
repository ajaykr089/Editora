import { $, esc, param, toast } from './common';
import '@editora/ui-core/breadcrumb';
import '@editora/ui-core/timeline';
import '@editora/ui-core/dialog';
import '@editora/ui-core/textarea';
import '@editora/ui-core/alert';
import { getOrder, longDate, money, ORDER_STATUS_LABEL, ORDER_STATUS_TONE, setOrderStatus, shortDate, type Order, type OrderStatus } from '../../shared/data';

const NEXT: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  pending: { status: 'paid', label: 'Mark as paid' },
  paid: { status: 'shipped', label: 'Mark as shipped' },
  shipped: { status: 'delivered', label: 'Mark as delivered' },
};

const id = param('id') || '';
let order = await getOrder(id);

function render() {
  if (!order) {
    $('#title').textContent = 'Order not found';
    $('#subtitle').textContent = `There is no order #${id}.`;
    return;
  }
  document.title = `Order ${order.id} · Copperline`;
  $('#crumb').textContent = order.id;
  $('#title').textContent = `Order ${order.id}`;
  $('#subtitle').textContent = `Placed ${longDate(order.date)} · ${order.channel}`;
  const badge = $('#status-badge');
  badge.setAttribute('tone', ORDER_STATUS_TONE[order.status]);
  badge.textContent = ORDER_STATUS_LABEL[order.status];

  const next = NEXT[order.status];
  const advance = $('#advance');
  advance.classList.toggle('cl-hidden', !next);
  if (next) advance.textContent = next.label;
  $('#refund').classList.toggle('cl-hidden', ['pending', 'refunded', 'cancelled'].includes(order.status));

  $('#lines').innerHTML = order.lines.map((line) => `<tr><td>${esc(line.name)}</td><td data-align="end">${line.qty}</td><td data-align="end">${money(line.price)}</td><td data-align="end">${money(line.qty * line.price)}</td></tr>`).join('');
  $('#totals').innerHTML = `
    <tr><td colspan="3">Shipping</td><td data-align="end">${order.shipping ? money(order.shipping) : 'Free'}</td></tr>
    <tr><td colspan="3">Tax</td><td data-align="end">${money(order.tax)}</td></tr>
    <tr><td colspan="3"><strong>Total</strong></td><td data-align="end"><strong>${money(order.total)}</strong></td></tr>`;
  // ui-timeline takes its items as JSON.
  $('#timeline').setAttribute('items', JSON.stringify([...order.timeline].reverse().map((step, index) => ({
    title: step.title, description: step.detail, time: shortDate(step.at), active: index === 0,
    tone: step.title === 'Refunded' || step.title.startsWith('Cancelled') ? 'danger' : step.title === 'Delivered' ? 'success' : 'info',
  }))));
  $('#customer').innerHTML = `<dt>Name</dt><dd>${esc(order.customer)}</dd><dt>Email</dt><dd><a href="mailto:${esc(order.email)}">${esc(order.email)}</a></dd><dt>Country</dt><dd>${esc(order.country)}</dd>`;
  $('#refund-text').textContent = `${money(order.total)} goes back to the customer's card. They are told by email.`;
}

async function change(status: OrderStatus, note?: string) {
  if (!order) return;
  const result = await setOrderStatus(order.id, status, note);
  const error = $('#error');
  if (!result.ok) {
    error.setAttribute('description', result.error);
    error.classList.remove('cl-hidden');
    return;
  }
  error.classList.add('cl-hidden');
  order = result.order;
  render();
  void toast(`${order.id}: ${ORDER_STATUS_LABEL[status]}`);
}

$('#advance').addEventListener('click', () => { const next = order && NEXT[order.status]; if (next) void change(next.status); });
$('#print').addEventListener('click', () => window.print());
const dialog = $('#refund-dialog');
$('#refund').addEventListener('click', () => dialog.setAttribute('open', ''));
dialog.addEventListener('ui-submit', () => {
  const reason = ($('#refund-reason') as HTMLTextAreaElement).value;
  dialog.removeAttribute('open');
  void change('refunded', reason || undefined);
});
dialog.addEventListener('ui-close', () => dialog.removeAttribute('open'));

render();
