// The pretend backend both templates talk to. Everything is generated from a fixed seed against a
// fixed "today", so every screenshot is the same, and every call waits a little so loading states,
// server-side paging and server-side validation behave as they would against a real API.
// Nothing leaves the browser. Writes live in memory until the page reloads.

export const TODAY = '2026-06-15';

// ---------------------------------------------------------------------------------------------
// Helpers

/** Deterministic pseudo-random numbers (mulberry32). */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = seeded(20260615);
const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
const between = (min: number, max: number) => Math.round(min + rand() * (max - min));
const round2 = (value: number) => Math.round(value * 100) / 100;

export function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86_400_000);

/** Waits like a network call. `?latency=0` in the URL turns it off (tests, screenshots). */
export function wait(ms = 260) {
  const asked = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('latency');
  const delay = asked === null ? ms : Number(asked) || 0;
  return new Promise<void>((resolve) => setTimeout(resolve, delay));
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const money = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
export const wholeMoney = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
export const compact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
export const shortDate = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
export const longDate = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const initials = (name: string) => name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

export type Page<T> = { rows: T[]; total: number };
export type SortDirection = 'asc' | 'desc';
export type ListQuery<K extends string> = {
  page?: number;
  pageSize?: number;
  sort?: K;
  direction?: SortDirection;
  query?: string;
  status?: string;
  from?: string;
  to?: string;
};

function sortRows<T>(rows: T[], key: keyof T | undefined, direction: SortDirection = 'asc') {
  if (!key) return rows;
  const sign = direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const x = a[key] as unknown;
    const y = b[key] as unknown;
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * sign;
    return String(x).localeCompare(String(y)) * sign;
  });
}
function paginate<T>(rows: T[], page = 1, pageSize = 10): Page<T> {
  const start = (Math.max(1, page) - 1) * pageSize;
  return { rows: clone(rows.slice(start, start + pageSize)), total: rows.length };
}

// ---------------------------------------------------------------------------------------------
// People

const FIRST = ['Maya', 'Omar', 'Ines', 'Theo', 'Priya', 'Lukas', 'Aisha', 'Sam', 'Nora', 'Kenji', 'Lena', 'Diego', 'Zara', 'Felix', 'Hana', 'Marco', 'Amara', 'Jonas', 'Leila', 'Ravi', 'Elif', 'Tomas', 'Yuki', 'Grace'];
const LAST = ['Chen', 'Haddad', 'Duarte', 'Brandt', 'Nair', 'Weber', 'Bello', 'Ortiz', 'Lindqvist', 'Sato', 'Novak', 'Ramos', 'Okafor', 'Meyer', 'Kim', 'Rossi', 'Mensah', 'Berg', 'Farah', 'Iyer', 'Kaya', 'Silva', 'Tanaka', 'Walsh'];
const CITIES = [
  ['Lisbon', 'Portugal'], ['Berlin', 'Germany'], ['Austin', 'United States'], ['Toronto', 'Canada'], ['Pune', 'India'],
  ['Osaka', 'Japan'], ['Lagos', 'Nigeria'], ['Melbourne', 'Australia'], ['Leeds', 'United Kingdom'], ['Seattle', 'United States'],
  ['Lyon', 'France'], ['Utrecht', 'Netherlands'],
] as const;
const COMPANIES = ['Brightwell Studio', 'Harbor & Pine', 'Quillstone', 'Northlight Labs', 'Fernway', 'Cobalt Kitchen', 'Saltmarsh Co.', 'Oakline Health', 'Tidewater Media', 'Kestrel Logistics', 'Juniper Learning', 'Mosaic Dental'];

export type CustomerStatus = 'active' | 'trial' | 'paused' | 'churned';
export type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  city: string;
  country: string;
  status: CustomerStatus;
  orders: number;
  spent: number;
  since: string;
  lastOrder: string;
  tags: string[];
  phone: string;
  notes: string;
};
export const CUSTOMER_STATUSES: CustomerStatus[] = ['active', 'trial', 'paused', 'churned'];
export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = { active: 'Active', trial: 'Trial', paused: 'Paused', churned: 'Churned' };
export const CUSTOMER_STATUS_TONE: Record<CustomerStatus, 'success' | 'info' | 'warning' | 'neutral'> = { active: 'success', trial: 'info', paused: 'warning', churned: 'neutral' };

const customers: Customer[] = Array.from({ length: 128 }, (_, index) => {
  // Walk the name lists at different speeds so the 128 names (and emails) are all different.
  const first = FIRST[index % FIRST.length];
  const last = LAST[(index * 7 + Math.floor(index / FIRST.length) * 5) % LAST.length];
  const [city, country] = pick(CITIES);
  const since = addDays(TODAY, -Math.round(4 + Math.pow(rand(), 1.4) * 880));
  const roll = rand();
  const status: CustomerStatus = roll < 0.62 ? 'active' : roll < 0.78 ? 'trial' : roll < 0.9 ? 'paused' : 'churned';
  return {
    id: `C-${String(1001 + index)}`,
    name: `${first} ${last}`,
    email: `${first}.${last}`.toLowerCase() + '@example.com',
    company: pick(COMPANIES),
    city,
    country,
    status,
    orders: 0,
    spent: 0,
    since,
    lastOrder: since,
    tags: [pick(['Wholesale', 'Retail', 'VIP', 'Newsletter', 'Referral']), ...(rand() > 0.6 ? [pick(['Gift buyer', 'Returns', 'B2B'])] : [])],
    phone: `+1 555 ${String(between(100, 999))} ${String(between(1000, 9999))}`,
    notes: '',
  };
});

// ---------------------------------------------------------------------------------------------
// Products

export type ProductCategory = 'Ceramics' | 'Textiles' | 'Lighting' | 'Furniture' | 'Stationery' | 'Kitchen';
export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  sold: number;
  rating: number;
  status: 'published' | 'draft' | 'archived';
  sku: string;
  colour: string;
};
export const PRODUCT_CATEGORIES: ProductCategory[] = ['Ceramics', 'Textiles', 'Lighting', 'Furniture', 'Stationery', 'Kitchen'];
const PRODUCT_NAMES: Record<ProductCategory, string[]> = {
  Ceramics: ['Speckled mug', 'Stoneware bowl', 'Bud vase', 'Serving platter', 'Pour-over set', 'Planter, small'],
  Textiles: ['Linen throw', 'Wool cushion', 'Waffle towel', 'Table runner', 'Cotton apron', 'Tea towel set'],
  Lighting: ['Paper pendant', 'Brass desk lamp', 'Glass sconce', 'Floor lamp', 'Candle holder', 'String lights'],
  Furniture: ['Oak stool', 'Wall shelf', 'Side table', 'Bench, ash', 'Coat rack', 'Magazine rack'],
  Stationery: ['Dot-grid notebook', 'Brass pen', 'Desk tray', 'Weekly planner', 'Card set', 'Washi tape'],
  Kitchen: ['Chef knife', 'Cutting board', 'Salt cellar', 'Spice tin set', 'Copper pan', 'Linen bread bag'],
};
const COLOURS = ['#c2410c', '#0f766e', '#4338ca', '#a16207', '#be123c', '#475569', '#15803d', '#7c3aed'];

const products: Product[] = PRODUCT_CATEGORIES.flatMap((category, c) =>
  PRODUCT_NAMES[category].map((name, i) => {
    const index = c * 6 + i;
    return {
      id: `P-${String(201 + index)}`,
      name,
      category,
      price: round2(between(14, 160) - 0.01),
      stock: index % 9 === 4 ? 0 : between(0, 140),
      sold: 0,
      rating: round2(3.4 + rand() * 1.6),
      status: index % 11 === 7 ? 'draft' : index % 17 === 9 ? 'archived' : 'published',
      sku: `LK-${category.slice(0, 3).toUpperCase()}-${String(index + 10).padStart(3, '0')}`,
      colour: COLOURS[index % COLOURS.length],
    } satisfies Product;
  })
);

// ---------------------------------------------------------------------------------------------
// Orders

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'refunded' | 'cancelled';
export type OrderLine = { productId: string; name: string; qty: number; price: number };
export type Order = {
  id: string;
  customerId: string;
  customer: string;
  email: string;
  date: string;
  status: OrderStatus;
  channel: 'Web' | 'Mobile' | 'Marketplace' | 'In store';
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  country: string;
  timeline: { at: string; title: string; detail?: string }[];
  note: string;
};
export const ORDER_STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'refunded', 'cancelled'];
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Pending', paid: 'Paid', shipped: 'Shipped', delivered: 'Delivered', refunded: 'Refunded', cancelled: 'Cancelled',
};
export const ORDER_STATUS_TONE: Record<OrderStatus, 'warning' | 'info' | 'brand' | 'success' | 'danger' | 'neutral'> = {
  pending: 'warning', paid: 'info', shipped: 'brand', delivered: 'success', refunded: 'danger', cancelled: 'neutral',
};

function orderTimeline(date: string, status: OrderStatus) {
  const steps: Order['timeline'] = [{ at: date, title: 'Order placed', detail: 'Paid by card ending 4242' }];
  if (status === 'pending') return steps;
  steps.push({ at: date, title: 'Payment captured' });
  if (status === 'cancelled') return [...steps, { at: addDays(date, 1), title: 'Cancelled by customer', detail: 'Refunded in full' }];
  if (status === 'paid') return steps;
  steps.push({ at: addDays(date, 1), title: 'Shipped', detail: 'Tracking LK' + date.replace(/-/g, '') });
  if (status === 'shipped') return steps;
  steps.push({ at: addDays(date, 4), title: 'Delivered' });
  if (status === 'refunded') steps.push({ at: addDays(date, 9), title: 'Refunded', detail: 'Item arrived damaged' });
  return steps;
}

const orders: Order[] = Array.from({ length: 312 }, (_, index) => {
  const customer = customers[Math.floor(rand() * customers.length)];
  const age = Math.floor(Math.pow(rand(), 1.15) * 180);
  const date = addDays(TODAY, -age);
  const lineCount = between(1, 3);
  const lines: OrderLine[] = Array.from({ length: lineCount }, () => {
    const product = pick(products);
    return { productId: product.id, name: product.name, qty: rand() < 0.75 ? 1 : 2, price: product.price };
  });
  const subtotal = round2(lines.reduce((sum, line) => sum + line.qty * line.price, 0));
  const shipping = subtotal > 150 ? 0 : 9.5;
  const tax = round2(subtotal * 0.08);
  const roll = rand();
  const status: OrderStatus =
    age < 2 ? (roll < 0.5 ? 'pending' : 'paid') :
    age < 6 ? (roll < 0.6 ? 'shipped' : 'paid') :
    roll < 0.86 ? 'delivered' : roll < 0.94 ? 'refunded' : 'cancelled';
  return {
    id: `#${String(48210 + index)}`,
    customerId: customer.id,
    customer: customer.name,
    email: customer.email,
    date,
    status,
    channel: pick(['Web', 'Web', 'Web', 'Mobile', 'Mobile', 'Marketplace', 'In store'] as const),
    lines,
    subtotal,
    shipping,
    tax,
    total: round2(subtotal + shipping + tax),
    country: customer.country,
    timeline: orderTimeline(date, status),
    note: '',
  };
}).sort((a, b) => (a.date < b.date ? 1 : -1));

for (const order of orders) {
  const customer = customers.find((c) => c.id === order.customerId)!;
  customer.orders += 1;
  customer.spent = round2(customer.spent + order.total);
  if (order.date > customer.lastOrder) customer.lastOrder = order.date;
  for (const line of order.lines) products.find((p) => p.id === line.productId)!.sold += line.qty;
}

export const orderId = (id: string) => id.replace('#', '');

// ---------------------------------------------------------------------------------------------
// Queries: customers, orders, products

export async function listCustomers(q: ListQuery<keyof Customer & string> = {}): Promise<Page<Customer>> {
  await wait();
  const needle = (q.query || '').trim().toLowerCase();
  let rows = customers.filter((c) =>
    (!needle || `${c.name} ${c.email} ${c.company} ${c.id}`.toLowerCase().includes(needle)) &&
    (!q.status || c.status === q.status)
  );
  rows = sortRows(rows, q.sort as keyof Customer, q.direction);
  return paginate(rows, q.page, q.pageSize);
}

export async function getCustomer(id: string) {
  await wait(200);
  const customer = customers.find((c) => c.id === id);
  if (!customer) return null;
  return {
    customer: clone(customer),
    orders: clone(orders.filter((o) => o.customerId === id).slice(0, 8)),
    activity: clone(activityFor(customer)),
  };
}

export async function updateCustomer(id: string, patch: Partial<Customer>): Promise<{ ok: true; customer: Customer } | { ok: false; errors: Record<string, string> }> {
  await wait(420);
  const errors: Record<string, string> = {};
  if (patch.email !== undefined && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(patch.email)) errors.email = 'Enter an email address like name@example.com.';
  if (patch.email && customers.some((c) => c.id !== id && c.email === patch.email)) errors.email = 'Another customer already uses this email.';
  if (patch.name !== undefined && patch.name.trim().length < 2) errors.name = 'Enter the customer’s full name.';
  if (Object.keys(errors).length) return { ok: false, errors };
  const customer = customers.find((c) => c.id === id)!;
  Object.assign(customer, patch);
  return { ok: true, customer: clone(customer) };
}

export async function deleteCustomers(ids: string[]) {
  await wait(380);
  for (const id of ids) {
    const index = customers.findIndex((c) => c.id === id);
    if (index >= 0) customers.splice(index, 1);
  }
  return { ok: true as const, removed: ids.length };
}

export async function listOrders(q: ListQuery<keyof Order & string> = {}): Promise<Page<Order>> {
  await wait();
  const needle = (q.query || '').trim().toLowerCase();
  let rows = orders.filter((o) =>
    (!needle || `${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(needle)) &&
    (!q.status || o.status === q.status) &&
    (!q.from || o.date >= q.from) &&
    (!q.to || o.date <= q.to)
  );
  rows = sortRows(rows, (q.sort || 'date') as keyof Order, q.direction || 'desc');
  return paginate(rows, q.page, q.pageSize);
}

export async function getOrder(id: string) {
  await wait(200);
  const wanted = id.startsWith('#') ? id : `#${id}`;
  const order = orders.find((o) => o.id === wanted);
  return order ? clone(order) : null;
}

export async function setOrderStatus(id: string, status: OrderStatus, note?: string) {
  await wait(380);
  const order = orders.find((o) => o.id === id);
  if (!order) return { ok: false as const, error: 'Order not found' };
  if (status === 'refunded' && order.status === 'pending') return { ok: false as const, error: 'A pending order has not been paid yet, so it cannot be refunded. Cancel it instead.' };
  order.status = status;
  order.timeline.push({ at: TODAY, title: ORDER_STATUS_LABEL[status], detail: note || undefined });
  return { ok: true as const, order: clone(order) };
}

export async function listProducts(q: ListQuery<keyof Product & string> & { category?: string } = {}): Promise<Page<Product>> {
  await wait();
  const needle = (q.query || '').trim().toLowerCase();
  let rows = products.filter((p) =>
    (!needle || `${p.name} ${p.sku}`.toLowerCase().includes(needle)) &&
    (!q.status || p.status === q.status) &&
    (!q.category || p.category === q.category)
  );
  rows = sortRows(rows, q.sort as keyof Product, q.direction);
  return paginate(rows, q.page, q.pageSize || 50);
}

export async function saveProduct(input: Partial<Product> & { name: string }): Promise<{ ok: true; product: Product } | { ok: false; errors: Record<string, string> }> {
  await wait(420);
  const errors: Record<string, string> = {};
  if (input.name.trim().length < 3) errors.name = 'Give the product a name of at least 3 characters.';
  if (!(Number(input.price) > 0)) errors.price = 'Enter a price above zero.';
  if (Number(input.price) > 5000) errors.price = 'Prices above $5,000 need a manager to publish them.';
  if (input.sku && products.some((p) => p.sku === input.sku && p.id !== input.id)) errors.sku = 'This SKU is already used by another product.';
  if (Object.keys(errors).length) return { ok: false, errors };
  if (input.id) {
    const existing = products.find((p) => p.id === input.id)!;
    Object.assign(existing, input);
    return { ok: true, product: clone(existing) };
  }
  const product: Product = {
    id: `P-${String(201 + products.length)}`,
    name: input.name.trim(),
    category: (input.category || 'Ceramics') as ProductCategory,
    price: Number(input.price),
    stock: Number(input.stock) || 0,
    sold: 0,
    rating: 0,
    status: input.status || 'draft',
    sku: input.sku || `LK-NEW-${products.length}`,
    colour: COLOURS[products.length % COLOURS.length],
  };
  products.unshift(product);
  return { ok: true, product: clone(product) };
}

// ---------------------------------------------------------------------------------------------
// Dashboards

function monthKey(iso: string) { return iso.slice(0, 7); }
const MONTH_LABEL = (key: string) => new Date(`${key}-01T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });

export async function commerceSummary() {
  await wait();
  const last30 = orders.filter((o) => daysBetween(o.date, TODAY) < 30 && o.status !== 'cancelled');
  const prev30 = orders.filter((o) => { const d = daysBetween(o.date, TODAY); return d >= 30 && d < 60 && o.status !== 'cancelled'; });
  const revenue = last30.reduce((sum, o) => sum + o.total, 0);
  const prevRevenue = prev30.reduce((sum, o) => sum + o.total, 0);
  const months = new Map<string, { revenue: number; orders: number }>();
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(`${TODAY}T12:00:00Z`);
    d.setUTCMonth(d.getUTCMonth() - i, 1);
    months.set(d.toISOString().slice(0, 7), { revenue: 0, orders: 0 });
  }
  for (const order of orders) {
    const bucket = months.get(monthKey(order.date));
    if (bucket && order.status !== 'cancelled') { bucket.revenue += order.total; bucket.orders += 1; }
  }
  const byCategory = new Map<string, number>();
  for (const order of last30) for (const line of order.lines) {
    const product = products.find((p) => p.id === line.productId)!;
    byCategory.set(product.category, (byCategory.get(product.category) || 0) + line.qty * line.price);
  }
  const byChannel = new Map<string, number>();
  for (const order of last30) byChannel.set(order.channel, (byChannel.get(order.channel) || 0) + 1);
  return {
    revenue: round2(revenue),
    revenueChange: prevRevenue ? (revenue - prevRevenue) / prevRevenue : 0,
    orders: last30.length,
    ordersChange: prev30.length ? (last30.length - prev30.length) / prev30.length : 0,
    aov: last30.length ? round2(revenue / last30.length) : 0,
    newCustomers: customers.filter((c) => daysBetween(c.since, TODAY) < 30).length,
    months: [...months.entries()].map(([key, value]) => ({ label: MONTH_LABEL(key), revenue: Math.round(value.revenue), orders: value.orders })),
    byCategory: [...byCategory.entries()].map(([label, value]) => ({ label, value: Math.round(value) })).sort((a, b) => b.value - a.value),
    byChannel: [...byChannel.entries()].map(([label, value]) => ({ label, value })),
    recent: clone(orders.slice(0, 6)),
    topProducts: clone([...products].sort((a, b) => b.sold - a.sold).slice(0, 5)),
    lowStock: clone(products.filter((p) => p.stock < 8 && p.status === 'published').slice(0, 5)),
  };
}

export async function analyticsSummary(range: '7d' | '30d' | '90d' = '30d') {
  await wait();
  const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
  const r = seeded(days * 31);
  const series = Array.from({ length: days }, (_, i) => {
    const date = addDays(TODAY, i - days + 1);
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    const base = 3200 + i * 18 + (weekday === 0 || weekday === 6 ? -900 : 0);
    const sessions = Math.round(base + r() * 700);
    return { date, sessions, visitors: Math.round(sessions * (0.68 + r() * 0.08)), conversions: Math.round(sessions * (0.021 + r() * 0.012)) };
  });
  const sum = (key: 'sessions' | 'visitors' | 'conversions') => series.reduce((total, day) => total + day[key], 0);
  return {
    range,
    series,
    sessions: sum('sessions'),
    visitors: sum('visitors'),
    conversions: sum('conversions'),
    bounceRate: 0.412 - days / 2000,
    avgSession: 184 + days,
    sources: [
      { label: 'Organic search', value: 41 }, { label: 'Direct', value: 23 }, { label: 'Social', value: 16 },
      { label: 'Email', value: 12 }, { label: 'Referral', value: 8 },
    ],
    devices: [{ label: 'Mobile', value: 58 }, { label: 'Desktop', value: 36 }, { label: 'Tablet', value: 6 }],
    countries: [
      { label: 'United States', value: 38 }, { label: 'Germany', value: 14 }, { label: 'United Kingdom', value: 11 },
      { label: 'India', value: 9 }, { label: 'Canada', value: 7 }, { label: 'Japan', value: 6 },
    ],
    pages: [
      { path: '/', title: 'Home', views: 18240, time: '0:48' },
      { path: '/collections/ceramics', title: 'Ceramics', views: 9120, time: '1:32' },
      { path: '/products/speckled-mug', title: 'Speckled mug', views: 6480, time: '2:05' },
      { path: '/journal/slow-mornings', title: 'Journal: Slow mornings', views: 4310, time: '3:41' },
      { path: '/collections/lighting', title: 'Lighting', views: 3980, time: '1:12' },
      { path: '/cart', title: 'Cart', views: 3125, time: '0:57' },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// CRM

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type Deal = { id: string; title: string; company: string; owner: string; value: number; stage: DealStage; closeDate: string; probability: number };
export const DEAL_STAGES: { value: DealStage; label: string }[] = [
  { value: 'lead', label: 'Lead' }, { value: 'qualified', label: 'Qualified' }, { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' }, { value: 'won', label: 'Won' }, { value: 'lost', label: 'Lost' },
];
const STAGE_PROBABILITY: Record<DealStage, number> = { lead: 10, qualified: 25, proposal: 50, negotiation: 75, won: 100, lost: 0 };
const deals: Deal[] = Array.from({ length: 26 }, (_, index) => {
  const stage = DEAL_STAGES[index % 6].value;
  return {
    id: `D-${300 + index}`,
    title: pick(['Spring wholesale order', 'Hotel lobby fit-out', 'Café tableware', 'Gift box programme', 'Office lighting refresh', 'Restaurant ceramics', 'Studio furniture']),
    company: COMPANIES[index % COMPANIES.length],
    owner: `${FIRST[index % 6]} ${LAST[(index * 7) % LAST.length]}`,
    value: between(4, 60) * 500,
    stage,
    closeDate: addDays(TODAY, between(-20, 75)),
    probability: STAGE_PROBABILITY[stage],
  };
});

export async function crmSummary() {
  await wait();
  const open = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
  return {
    pipeline: open.reduce((sum, d) => sum + d.value, 0),
    weighted: Math.round(open.reduce((sum, d) => sum + (d.value * d.probability) / 100, 0)),
    won: deals.filter((d) => d.stage === 'won').reduce((sum, d) => sum + d.value, 0),
    winRate: deals.filter((d) => d.stage === 'won').length / Math.max(1, deals.filter((d) => d.stage === 'won' || d.stage === 'lost').length),
    byStage: DEAL_STAGES.filter((s) => s.value !== 'lost').map((s) => ({ label: s.label, value: deals.filter((d) => d.stage === s.value).reduce((sum, d) => sum + d.value, 0) })),
    deals: clone(deals),
    tasks: [
      { id: 't1', title: 'Send revised quote to Harbor & Pine', due: TODAY, done: false },
      { id: 't2', title: 'Book showroom visit with Quillstone', due: addDays(TODAY, 1), done: false },
      { id: 't3', title: 'Follow up on lighting samples', due: addDays(TODAY, 2), done: false },
      { id: 't4', title: 'Renewal call: Oakline Health', due: addDays(TODAY, -1), done: true },
      { id: 't5', title: 'Prepare Q3 wholesale price list', due: addDays(TODAY, 5), done: false },
    ],
  };
}

export async function moveDeal(id: string, stage: DealStage) {
  await wait(200);
  const deal = deals.find((d) => d.id === id);
  if (!deal) return { ok: false as const };
  deal.stage = stage;
  deal.probability = STAGE_PROBABILITY[stage];
  return { ok: true as const, deal: clone(deal) };
}

// ---------------------------------------------------------------------------------------------
// Projects, tasks (gantt) and the kanban board

export type Project = { id: string; name: string; client: string; progress: number; due: string; status: 'on-track' | 'at-risk' | 'late' | 'done'; members: string[]; budget: number; spent: number };
const projects: Project[] = [
  { id: 'PR-1', name: 'Autumn catalogue', client: 'In-house', progress: 72, due: addDays(TODAY, 18), status: 'on-track', members: ['Maya Chen', 'Ines Duarte', 'Kenji Sato'], budget: 24000, spent: 15800 },
  { id: 'PR-2', name: 'Store relaunch', client: 'In-house', progress: 46, due: addDays(TODAY, 9), status: 'at-risk', members: ['Priya Nair', 'Lukas Weber', 'Zara Okafor', 'Felix Meyer'], budget: 58000, spent: 39500 },
  { id: 'PR-3', name: 'Hotel Aurora fit-out', client: 'Hotel Aurora', progress: 88, due: addDays(TODAY, 4), status: 'on-track', members: ['Omar Haddad', 'Hana Kim'], budget: 41000, spent: 33900 },
  { id: 'PR-4', name: 'Wholesale portal', client: 'In-house', progress: 21, due: addDays(TODAY, -3), status: 'late', members: ['Theo Brandt', 'Diego Ramos', 'Leila Farah'], budget: 36000, spent: 14100 },
  { id: 'PR-5', name: 'Spring photo shoot', client: 'In-house', progress: 100, due: addDays(TODAY, -30), status: 'done', members: ['Aisha Bello', 'Marco Rossi'], budget: 9000, spent: 8650 },
];

export async function projectSummary() {
  await wait();
  return {
    projects: clone(projects),
    gantt: [
      { id: 'g1', label: 'Store relaunch', start: addDays(TODAY, -28), end: addDays(TODAY, 9), progress: 46, type: 'summary' as const },
      { id: 'g2', label: 'Audit current store', start: addDays(TODAY, -28), end: addDays(TODAY, -20), progress: 100, parent: 'g1' },
      { id: 'g3', label: 'New design system', start: addDays(TODAY, -19), end: addDays(TODAY, -4), progress: 90, parent: 'g1' },
      { id: 'g4', label: 'Product pages', start: addDays(TODAY, -6), end: addDays(TODAY, 5), progress: 40, parent: 'g1' },
      { id: 'g5', label: 'Checkout', start: addDays(TODAY, -2), end: addDays(TODAY, 7), progress: 10, parent: 'g1' },
      { id: 'g6', label: 'Launch', start: addDays(TODAY, 9), end: addDays(TODAY, 9), progress: 0, parent: 'g1', type: 'milestone' as const },
      { id: 'g7', label: 'Autumn catalogue', start: addDays(TODAY, -14), end: addDays(TODAY, 18), progress: 72, type: 'summary' as const },
      { id: 'g8', label: 'Shot list', start: addDays(TODAY, -14), end: addDays(TODAY, -9), progress: 100, parent: 'g7' },
      { id: 'g9', label: 'Copy and layout', start: addDays(TODAY, -8), end: addDays(TODAY, 10), progress: 65, parent: 'g7' },
      { id: 'g10', label: 'Print', start: addDays(TODAY, 11), end: addDays(TODAY, 18), progress: 0, parent: 'g7' },
    ],
    links: [
      { id: 'l1', source: 'g2', target: 'g3' }, { id: 'l2', source: 'g3', target: 'g4' }, { id: 'l3', source: 'g4', target: 'g6' },
      { id: 'l4', source: 'g5', target: 'g6' }, { id: 'l5', source: 'g8', target: 'g9' }, { id: 'l6', source: 'g9', target: 'g10' },
    ],
    hours: [
      { label: 'Mon', value: 38 }, { label: 'Tue', value: 42 }, { label: 'Wed', value: 47 }, { label: 'Thu', value: 40 }, { label: 'Fri', value: 31 },
    ],
  };
}

export type BoardCard = { id: string; title: string; tag: string; assignee: string; due?: string; priority: 'low' | 'medium' | 'high'; column: string };
export const BOARD_COLUMNS = [
  { id: 'backlog', label: 'Backlog' }, { id: 'todo', label: 'To do' }, { id: 'doing', label: 'In progress' }, { id: 'review', label: 'Review' }, { id: 'done', label: 'Done' },
];
const board: BoardCard[] = [
  ['Write product copy for lamps', 'Copy', 'Ines Duarte', 'backlog', 'low'],
  ['Shoot lifestyle images, textiles', 'Photo', 'Aisha Bello', 'backlog', 'medium'],
  ['Size guide for furniture', 'Content', 'Kenji Sato', 'backlog', 'low'],
  ['Checkout address autocomplete', 'Store', 'Lukas Weber', 'todo', 'high'],
  ['Gift card email template', 'Email', 'Maya Chen', 'todo', 'medium'],
  ['Wholesale price list PDF', 'Sales', 'Theo Brandt', 'todo', 'medium'],
  ['New product page layout', 'Store', 'Priya Nair', 'doing', 'high'],
  ['Returns policy rewrite', 'Content', 'Omar Haddad', 'doing', 'medium'],
  ['Catalogue cover options', 'Design', 'Zara Okafor', 'review', 'medium'],
  ['Cookie banner copy', 'Legal', 'Hana Kim', 'review', 'low'],
  ['Migrate blog to journal', 'Store', 'Diego Ramos', 'done', 'low'],
  ['June newsletter', 'Email', 'Maya Chen', 'done', 'medium'],
].map(([title, tag, assignee, column, priority], index) => ({
  id: `K-${index + 1}`,
  title, tag, assignee, column,
  priority: priority as BoardCard['priority'],
  due: index % 3 === 0 ? addDays(TODAY, index - 4) : undefined,
}));

export async function getBoard() { await wait(); return clone(board); }
export async function saveBoard(next: BoardCard[]) {
  await wait(160);
  board.splice(0, board.length, ...clone(next));
  return { ok: true as const };
}
export async function addBoardCard(input: Omit<BoardCard, 'id'>) {
  await wait(220);
  const card = { ...input, id: `K-${board.length + 1}-${Date.now() % 1000}` };
  board.push(card);
  return clone(card);
}

// ---------------------------------------------------------------------------------------------
// Calendar

export type CalendarEntry = { id: string; date: string; title: string; time?: string; tone: 'info' | 'success' | 'warning' | 'danger' | 'neutral'; kind: 'Meeting' | 'Delivery' | 'Launch' | 'Deadline' | 'Personal' };
const calendarEntries: CalendarEntry[] = [
  [0, 'Team stand-up', '09:30', 'info', 'Meeting'],
  [0, 'Ship Hotel Aurora order', '14:00', 'warning', 'Delivery'],
  [1, 'Quillstone showroom visit', '11:00', 'info', 'Meeting'],
  [2, 'Lighting samples arrive', undefined, 'neutral', 'Delivery'],
  [4, 'Hotel Aurora handover', '10:00', 'success', 'Launch'],
  [6, 'Weekend market stall', '08:00', 'neutral', 'Personal'],
  [9, 'Store relaunch', '09:00', 'success', 'Launch'],
  [9, 'Press preview', '17:30', 'info', 'Meeting'],
  [12, 'Q2 close', undefined, 'danger', 'Deadline'],
  [15, 'Catalogue to print', undefined, 'danger', 'Deadline'],
  [-3, 'Wholesale portal milestone', undefined, 'danger', 'Deadline'],
  [-5, 'Supplier call: Fernway', '15:00', 'info', 'Meeting'],
  [-8, 'June newsletter sent', '07:00', 'success', 'Launch'],
  [18, 'Autumn catalogue launch', '09:00', 'success', 'Launch'],
].map(([offset, title, time, tone, kind], index) => ({
  id: `E-${index + 1}`,
  date: addDays(TODAY, offset as number),
  title: title as string,
  time: time as string | undefined,
  tone: tone as CalendarEntry['tone'],
  kind: kind as CalendarEntry['kind'],
}));

export async function listEvents() { await wait(); return clone(calendarEntries); }
export async function addEvent(input: Omit<CalendarEntry, 'id'>): Promise<{ ok: true; event: CalendarEntry } | { ok: false; errors: Record<string, string> }> {
  await wait(300);
  const errors: Record<string, string> = {};
  if (!input.title.trim()) errors.title = 'Give the event a title.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) errors.date = 'Pick a date.';
  if (input.time && !/^\d{2}:\d{2}$/.test(input.time)) errors.time = 'Use a time like 14:30.';
  if (Object.keys(errors).length) return { ok: false, errors };
  const event = { ...input, id: `E-${calendarEntries.length + 1}` };
  calendarEntries.push(event);
  return { ok: true, event: clone(event) };
}
export async function deleteEvent(id: string) {
  await wait(200);
  const index = calendarEntries.findIndex((e) => e.id === id);
  if (index >= 0) calendarEntries.splice(index, 1);
  return { ok: true as const };
}

// ---------------------------------------------------------------------------------------------
// Mail

export type MailFolder = 'inbox' | 'starred' | 'sent' | 'drafts' | 'archive' | 'trash';
export type Mail = { id: string; folder: MailFolder; from: string; email: string; to: string; subject: string; preview: string; html: string; date: string; time: string; unread: boolean; starred: boolean; label?: 'Orders' | 'Suppliers' | 'Team' | 'Press' };
const mail: Mail[] = [
  ['Omar Haddad', 'Hotel Aurora: delivery window confirmed', 'Team', 0, '08:12', true, '<p>Hi Maya,</p><p>The hotel confirmed the <strong>Thursday 10:00</strong> window for the lobby pieces. Their facilities lead will meet us at the loading bay.</p><ul><li>12 × Brass desk lamp</li><li>4 × Bench, ash</li><li>30 × Speckled mug (gift sets)</li></ul><p>I will send the packing list tomorrow.</p><p>Omar</p>'],
  ['Fernway Supply', 'Invoice FW-2291 for May', 'Suppliers', 0, '07:45', true, '<p>Hello,</p><p>Please find attached invoice <strong>FW-2291</strong> for linen delivered in May. Payment terms are 30 days.</p><p>Kind regards,<br>Fernway accounts</p>'],
  ['Zara Okafor', 'Catalogue cover: three options', 'Team', -1, '17:30', false, '<p>Three cover directions are in the shared folder. My favourite is <em>option B</em> (the bowl on linen), but the lamp shot photographs better in print.</p><blockquote>Can we decide by Wednesday? The printer needs the files on the 26th.</blockquote>'],
  ['Tidewater Media', 'Feature request: summer gift guide', 'Press', -1, '11:04', false, '<p>Hi there! We are putting together our summer gift guide and would love to include the <strong>Pour-over set</strong>. Could you send hi-res images and a price by Friday?</p>'],
  ['Larkspur Store', 'New order #48210 from Lena Novak', 'Orders', -2, '09:20', false, '<p>A new order was placed on the web store.</p><table><tr><td>Order</td><td>#48210</td></tr><tr><td>Total</td><td>$184.32</td></tr></table>'],
  ['Kenji Sato', 'Size guide draft', 'Team', -3, '15:10', false, '<p>First draft of the furniture size guide is ready for review. I used the measurements from the supplier sheets, so some may be off by a centimetre.</p>'],
  ['Harbor & Pine', 'Re: Wholesale quote', 'Suppliers', -4, '10:02', false, '<p>Thanks for the quote. We would like to go ahead with the ceramics but need the textiles a month later. Is that possible?</p>'],
  ['Priya Nair', 'Product page layout is in review', 'Team', -5, '16:45', false, '<p>The new product page is on staging. The gallery now supports video, and the add-to-cart button stays visible on mobile.</p>'],
].map(([from, subject, label, offset, time, unread, html], index) => ({
  id: `M-${index + 1}`,
  folder: 'inbox' as MailFolder,
  from: from as string,
  email: String(from).toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com',
  to: 'maya.chen@example.com',
  subject: subject as string,
  preview: String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 110),
  html: html as string,
  date: addDays(TODAY, offset as number),
  time: time as string,
  unread: unread as boolean,
  starred: index === 2 || index === 6,
  label: label as Mail['label'],
}));
mail.push(
  { id: 'M-90', folder: 'sent', from: 'Maya Chen', email: 'maya.chen@example.com', to: 'zara.okafor@example.com', subject: 'Re: Catalogue cover', preview: 'Let us go with option B, and use the lamp shot inside.', html: '<p>Let us go with option B, and use the lamp shot inside.</p>', date: addDays(TODAY, -1), time: '18:02', unread: false, starred: false, label: 'Team' },
  { id: 'M-91', folder: 'drafts', from: 'Maya Chen', email: 'maya.chen@example.com', to: 'press@tidewater.example', subject: 'Images for the gift guide', preview: 'Hi! Attached are the images you asked for…', html: '<p>Hi! Attached are the images you asked for…</p>', date: TODAY, time: '08:40', unread: false, starred: false, label: 'Press' },
);

export async function listMail(folder: MailFolder, query = '') {
  await wait(220);
  const needle = query.trim().toLowerCase();
  const rows = mail.filter((m) =>
    (folder === 'starred' ? m.starred && m.folder !== 'trash' : m.folder === folder) &&
    (!needle || `${m.from} ${m.subject} ${m.preview}`.toLowerCase().includes(needle))
  );
  return clone(rows);
}
export function mailCounts() {
  return {
    inbox: mail.filter((m) => m.folder === 'inbox' && m.unread).length,
    drafts: mail.filter((m) => m.folder === 'drafts').length,
  };
}
export async function updateMail(id: string, patch: Partial<Pick<Mail, 'unread' | 'starred' | 'folder'>>) {
  await wait(120);
  const item = mail.find((m) => m.id === id);
  if (item) Object.assign(item, patch);
  return clone(item);
}
export async function sendMail(input: { to: string; subject: string; html: string; draft?: boolean }): Promise<{ ok: true; mail: Mail } | { ok: false; errors: Record<string, string> }> {
  await wait(500);
  const errors: Record<string, string> = {};
  const recipients = input.to.split(/[,;]\s*/).filter(Boolean);
  if (!input.draft) {
    if (!recipients.length) errors.to = 'Add at least one recipient.';
    else if (recipients.some((r) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(r))) errors.to = 'Check the addresses: one of them is not an email address.';
    if (!input.subject.trim()) errors.subject = 'Add a subject so people know what this is about.';
    if (!input.html.replace(/<[^>]+>/g, '').trim()) errors.body = 'Write a message before sending.';
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  const item: Mail = {
    id: `M-${100 + mail.length}`,
    folder: input.draft ? 'drafts' : 'sent',
    from: 'Maya Chen', email: 'maya.chen@example.com', to: input.to,
    subject: input.subject || '(no subject)',
    preview: input.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 110),
    html: input.html, date: TODAY, time: '09:00', unread: false, starred: false,
  };
  mail.push(item);
  return { ok: true, mail: clone(item) };
}

// ---------------------------------------------------------------------------------------------
// Invoices (generated from orders of wholesale customers)

export type Invoice = { id: string; customer: Customer; issued: string; due: string; status: 'paid' | 'open' | 'overdue' | 'draft'; lines: { description: string; qty: number; price: number }[]; subtotal: number; tax: number; total: number; notes: string };
const invoices: Invoice[] = Array.from({ length: 24 }, (_, index) => {
  const customer = customers[(index * 5) % customers.length];
  const issued = addDays(TODAY, -index * 6 - 2);
  const due = addDays(issued, 30);
  const lines = Array.from({ length: between(2, 5) }, () => {
    const product = pick(products);
    return { description: `${product.name} (${product.sku})`, qty: between(4, 40), price: round2(product.price * 0.6) };
  });
  const subtotal = round2(lines.reduce((sum, line) => sum + line.qty * line.price, 0));
  const tax = round2(subtotal * 0.08);
  const status: Invoice['status'] = index === 0 ? 'draft' : due < TODAY ? (index % 4 === 0 ? 'overdue' : 'paid') : 'open';
  return { id: `INV-${2026}-${String(140 - index).padStart(4, '0')}`, customer, issued, due, status, lines, subtotal, tax, total: round2(subtotal + tax), notes: 'Wholesale terms: net 30. Thank you for your business.' };
});
export const INVOICE_TONE = { paid: 'success', open: 'info', overdue: 'danger', draft: 'neutral' } as const;
export async function listInvoices() { await wait(); return clone(invoices.map(({ lines, ...rest }) => ({ ...rest, lineCount: lines.length }))); }
export async function getInvoice(id: string) { await wait(200); const found = invoices.find((i) => i.id === id); return found ? clone(found) : null; }
export async function markInvoicePaid(id: string) { await wait(300); const found = invoices.find((i) => i.id === id); if (found) found.status = 'paid'; return clone(found); }

// ---------------------------------------------------------------------------------------------
// Articles (Copperline's help centre, Larkspur's journal)

export type Article = { id: string; title: string; slug: string; status: 'published' | 'draft' | 'review'; author: string; category: string; updated: string; views: number; html: string; tags: string[] };
const articles: Article[] = [
  ['How to track your order', 'Shipping', 'published', '<h2>Where is my order?</h2><p>Every order gets a tracking link by email as soon as it ships. You can also find it under <strong>Orders</strong> in your account.</p><ol><li>Open the confirmation email.</li><li>Click <em>Track parcel</em>.</li><li>Check the carrier page for the latest scan.</li></ol><p>Parcels usually arrive in 2–4 working days.</p>'],
  ['Returns and refunds', 'Returns', 'published', '<h2>Returning an item</h2><p>You have <strong>30 days</strong> to return anything unused. Start a return from your account, print the label and drop the parcel at any post office.</p><blockquote>Refunds go back to the original payment method within 5 working days of us receiving the item.</blockquote>'],
  ['Caring for stoneware', 'Product care', 'published', '<h2>Stoneware care</h2><p>Our stoneware is dishwasher safe, but hand washing keeps the glaze bright for longer.</p><ul><li>Avoid sudden temperature changes.</li><li>Do not use in the microwave if the piece has a metallic rim.</li></ul>'],
  ['Changing your delivery address', 'Shipping', 'review', '<p>You can change the address until the order is packed. After that, contact us and we will ask the carrier to redirect it.</p>'],
  ['Wholesale accounts', 'Wholesale', 'draft', '<p>Wholesale accounts get net-30 terms and tiered pricing. Apply with your company details and we will reply within two working days.</p>'],
  ['Gift cards', 'Payments', 'published', '<p>Gift cards never expire and can be used across several orders. They cannot be exchanged for cash.</p>'],
  ['Paying with a bank transfer', 'Payments', 'published', '<p>Choose <em>Bank transfer</em> at checkout. We hold the items for 5 days while the payment clears.</p>'],
  ['Linen: washing guide', 'Product care', 'draft', '<p>Wash at 40°C with similar colours. Linen softens with every wash.</p>'],
].map(([title, category, status, html], index) => ({
  id: `A-${index + 1}`,
  title: title as string,
  slug: String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  status: status as Article['status'],
  author: `${FIRST[index]} ${LAST[(index * 7) % LAST.length]}`,
  category: category as string,
  updated: addDays(TODAY, -index * 3),
  views: between(120, 9000),
  html: html as string,
  tags: [category as string],
}));
export const ARTICLE_TONE = { published: 'success', draft: 'neutral', review: 'warning' } as const;
export async function listArticles(query = '', status = '') {
  await wait();
  const needle = query.trim().toLowerCase();
  return clone(articles.filter((a) => (!needle || `${a.title} ${a.category}`.toLowerCase().includes(needle)) && (!status || a.status === status)));
}
export async function getArticle(id: string) { await wait(200); const found = articles.find((a) => a.id === id); return found ? clone(found) : null; }
export async function saveArticle(input: Partial<Article> & { title: string; html: string }): Promise<{ ok: true; article: Article } | { ok: false; errors: Record<string, string> }> {
  await wait(450);
  const errors: Record<string, string> = {};
  if (input.title.trim().length < 4) errors.title = 'Titles need at least 4 characters.';
  if (input.status === 'published' && input.html.replace(/<[^>]+>/g, '').trim().length < 40) errors.html = 'Write at least a couple of sentences before publishing.';
  const slug = (input.slug || input.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (articles.some((a) => a.slug === slug && a.id !== input.id)) errors.slug = 'Another article already uses this URL.';
  if (Object.keys(errors).length) return { ok: false, errors };
  let article = input.id ? articles.find((a) => a.id === input.id) : undefined;
  if (article) Object.assign(article, input, { slug, updated: TODAY });
  else {
    article = { id: `A-${articles.length + 1}`, author: 'Maya Chen', category: 'General', status: 'draft', views: 0, tags: [], ...input, slug, updated: TODAY } as Article;
    articles.unshift(article);
  }
  return { ok: true, article: clone(article) };
}

// ---------------------------------------------------------------------------------------------
// Team, notifications, activity

export const TEAM = [
  { name: 'Maya Chen', role: 'Owner', email: 'maya.chen@example.com', status: 'online' as const },
  { name: 'Omar Haddad', role: 'Operations', email: 'omar.haddad@example.com', status: 'away' as const },
  { name: 'Priya Nair', role: 'Engineering', email: 'priya.nair@example.com', status: 'online' as const },
  { name: 'Ines Duarte', role: 'Design', email: 'ines.duarte@example.com', status: 'offline' as const },
  { name: 'Zara Okafor', role: 'Design', email: 'zara.okafor@example.com', status: 'busy' as const },
  { name: 'Theo Brandt', role: 'Sales', email: 'theo.brandt@example.com', status: 'offline' as const },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'New order #48521', detail: 'Lena Novak, $212.40', when: '2 min ago', tone: 'info' as const, unread: true },
  { id: 'n2', title: 'Brass desk lamp is low on stock', detail: '3 left', when: '1 h ago', tone: 'warning' as const, unread: true },
  { id: 'n3', title: 'Refund issued', detail: 'Order #48344, $64.80', when: 'Yesterday', tone: 'danger' as const, unread: false },
  { id: 'n4', title: 'Zara commented on the catalogue', detail: '“Option B it is.”', when: 'Yesterday', tone: 'neutral' as const, unread: false },
];

function activityFor(customer: Customer) {
  return [
    { at: customer.lastOrder, title: 'Placed an order', detail: `${customer.orders} orders in total` },
    { at: addDays(customer.lastOrder, -3), title: 'Opened the June newsletter' },
    { at: addDays(customer.since, 1), title: 'Created an account', detail: `${customer.city}, ${customer.country}` },
  ];
}

// ---------------------------------------------------------------------------------------------
// Account

export const ACCOUNT = { name: 'Maya Chen', email: 'maya.chen@example.com', role: 'Owner', company: 'Larkspur Goods', timezone: 'Europe/Lisbon', bio: '<p>Founder of Larkspur Goods. I look after wholesale and the catalogue.</p>' };
export async function saveAccount(patch: Partial<typeof ACCOUNT>): Promise<{ ok: true } | { ok: false; errors: Record<string, string> }> {
  await wait(420);
  const errors: Record<string, string> = {};
  if (patch.email !== undefined && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(patch.email)) errors.email = 'Enter an email address like name@example.com.';
  if (patch.name !== undefined && !patch.name.trim()) errors.name = 'Your name cannot be empty.';
  if (Object.keys(errors).length) return { ok: false, errors };
  Object.assign(ACCOUNT, patch);
  return { ok: true };
}
export async function changePassword(current: string, next: string): Promise<{ ok: true } | { ok: false; errors: Record<string, string> }> {
  await wait(500);
  const errors: Record<string, string> = {};
  if (current !== 'larkspur-demo') errors.current = 'That is not your current password. (In this demo it is larkspur-demo.)';
  if (next.length < 12) errors.next = 'Use at least 12 characters.';
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true };
}
export async function signIn(email: string, password: string): Promise<{ ok: true } | { ok: false; errors: Record<string, string> }> {
  await wait(500);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, errors: { email: 'Enter the email address you signed up with.' } };
  if (password !== 'larkspur-demo') return { ok: false, errors: { password: 'Email or password is wrong. (In this demo the password is larkspur-demo.)' } };
  return { ok: true };
}
