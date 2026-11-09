// A pretend Tallyhawk API. Data is generated from a fixed seed, so screenshots are stable, and
// every call waits a little, so loading states and the server-driven table behave as with a real
// backend. Nothing leaves the browser.

export type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
export type Category = 'Travel' | 'Meals' | 'Software' | 'Lodging' | 'Office' | 'Training';

export type Expense = {
  id: string;
  merchant: string;
  category: Category;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  date: string; // YYYY-MM-DD
  person: string;
  team: string;
  status: ExpenseStatus;
  note: string;
  overPolicy: boolean;
};

export const CATEGORIES: Category[] = ['Travel', 'Meals', 'Software', 'Lodging', 'Office', 'Training'];
export const STATUSES: ExpenseStatus[] = ['draft', 'submitted', 'approved', 'rejected', 'reimbursed'];
export const STATUS_LABEL: Record<ExpenseStatus, string> = {
  draft: 'Draft',
  submitted: 'Waiting',
  approved: 'Approved',
  rejected: 'Rejected',
  reimbursed: 'Reimbursed',
};
export const STATUS_TONE: Record<ExpenseStatus, 'neutral' | 'info' | 'success' | 'danger' | 'brand'> = {
  draft: 'neutral',
  submitted: 'info',
  approved: 'success',
  rejected: 'danger',
  reimbursed: 'brand',
};

const PEOPLE = [
  ['Maya Chen', 'Sales'], ['Omar Haddad', 'Operations'], ['Ines Duarte', 'Design'], ['Theo Brandt', 'Sales'],
  ['Priya Nair', 'Engineering'], ['Lukas Weber', 'Engineering'], ['Aisha Bello', 'Marketing'], ['Sam Ortiz', 'Operations'],
] as const;
const MERCHANTS: Record<Category, string[]> = {
  Travel: ['Rail Europe', 'City Cabs', 'SkyLine Air', 'Metro Card'],
  Meals: ['Harbour Kitchen', 'Noodle Bar', 'Café Lume', 'Team lunch'],
  Software: ['Design tool', 'Cloud hosting', 'Analytics suite', 'Password manager'],
  Lodging: ['Hotel Aurora', 'Canal House', 'Northside Inn'],
  Office: ['Paper & Co', 'Desk supplies', 'Monitor stand'],
  Training: ['Conference pass', 'Online course', 'Workshop'],
};

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

const TODAY = new Date(2026, 5, 18); // a fixed "today" (18 June 2026) keeps dates stable

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function generate(): Expense[] {
  const random = seeded(20260618);
  const pick = <T,>(list: readonly T[]) => list[Math.floor(random() * list.length)];
  return Array.from({ length: 140 }, (_, index) => {
    const category = pick(CATEGORIES);
    const [person, team] = pick(PEOPLE);
    const date = new Date(TODAY);
    date.setDate(date.getDate() - Math.floor(random() * 75));
    const base = { Travel: 180, Meals: 60, Software: 240, Lodging: 320, Office: 45, Training: 400 }[category];
    const amount = Math.round(base * (0.35 + random() * 1.6) * 100) / 100;
    const age = (TODAY.getTime() - date.getTime()) / 86400000;
    const status: ExpenseStatus = age < 4 ? pick(['draft', 'submitted'] as const) : age < 20 ? pick(['submitted', 'approved', 'approved', 'rejected'] as const) : pick(['approved', 'reimbursed', 'reimbursed'] as const);
    return {
      id: `EX-${String(4200 + index).padStart(4, '0')}`,
      merchant: pick(MERCHANTS[category]),
      category,
      amount,
      currency: pick(['USD', 'USD', 'EUR', 'GBP'] as const),
      date: iso(date),
      person,
      team,
      status,
      note: '',
      overPolicy: amount > base * 1.7,
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

let expenses = generate();

const wait = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

export type ListQuery = {
  page: number;
  pageSize: number;
  sort?: keyof Expense;
  direction?: 'asc' | 'desc';
  query?: string;
  status?: ExpenseStatus | '';
  from?: string;
  to?: string;
};

/** Server-side filtering, sorting and paging, as a real list endpoint does it. */
export async function listExpenses(q: ListQuery): Promise<{ rows: Expense[]; total: number }> {
  await wait();
  const needle = (q.query || '').trim().toLowerCase();
  let rows = expenses.filter((row) =>
    (!needle || `${row.merchant} ${row.person} ${row.id} ${row.category}`.toLowerCase().includes(needle)) &&
    (!q.status || row.status === q.status) &&
    (!q.from || row.date >= q.from) &&
    (!q.to || row.date <= q.to)
  );
  if (q.sort) {
    const key = q.sort;
    const sign = q.direction === 'desc' ? -1 : 1;
    rows = [...rows].sort((a, b) => (a[key] > b[key] ? sign : a[key] < b[key] ? -sign : 0));
  }
  const start = (q.page - 1) * q.pageSize;
  return { rows: rows.slice(start, start + q.pageSize), total: rows.length };
}

export async function getExpense(id: string): Promise<Expense | null> {
  await wait(160);
  return expenses.find((row) => row.id === id) || null;
}

export async function decide(id: string, status: 'approved' | 'rejected'): Promise<Expense> {
  await wait(220);
  expenses = expenses.map((row) => (row.id === id ? { ...row, status } : row));
  return expenses.find((row) => row.id === id)!;
}

export type NewExpense = { merchant: string; category: string; amount: string; date: string; note: string };

/** Validates like an API: 422 with field errors, or the created expense. */
export async function createExpense(input: NewExpense): Promise<{ ok: true; expense: Expense } | { ok: false; errors: Record<string, string> }> {
  await wait(420);
  const errors: Record<string, string> = {};
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) errors.amount = 'Enter the amount on the receipt.';
  else if (amount > 5000) errors.amount = 'Expenses over $5,000 need a purchase order. Attach it as a receipt instead.';
  if (input.date && input.date > iso(TODAY)) errors.date = 'The date can’t be in the future.';
  if (/test/i.test(input.merchant)) errors.merchant = 'We couldn’t match this merchant. Check the name on the receipt.';
  if (Object.keys(errors).length) return { ok: false, errors };
  const expense: Expense = {
    id: `EX-${4200 + expenses.length}`,
    merchant: input.merchant,
    category: (CATEGORIES as string[]).includes(input.category) ? (input.category as Category) : 'Office',
    amount,
    currency: 'USD',
    date: input.date || iso(TODAY),
    person: 'Maya Chen',
    team: 'Sales',
    status: 'submitted',
    note: input.note,
    overPolicy: false,
  };
  expenses = [expense, ...expenses];
  return { ok: true, expense };
}

/** Dashboard numbers for the current month. */
export async function dashboard() {
  await wait(200);
  const month = iso(TODAY).slice(0, 7);
  const thisMonth = expenses.filter((row) => row.date.startsWith(month));
  const byCategory = CATEGORIES.map((category) => ({
    label: category,
    value: Math.round(thisMonth.filter((row) => row.category === category).reduce((sum, row) => sum + row.amount, 0)),
  }));
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const end = new Date(TODAY);
    end.setDate(end.getDate() - 7 * (7 - i));
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    const total = expenses.filter((row) => row.date >= iso(start) && row.date <= iso(end)).reduce((sum, row) => sum + row.amount, 0);
    return { label: `${end.toLocaleString('en', { month: 'short' })} ${end.getDate()}`, value: Math.round(total) };
  });
  return {
    spend: Math.round(thisMonth.reduce((sum, row) => sum + row.amount, 0)),
    waiting: expenses.filter((row) => row.status === 'submitted').length,
    overPolicy: expenses.filter((row) => row.status === 'submitted' && row.overPolicy).length,
    reimbursed: Math.round(expenses.filter((row) => row.status === 'reimbursed' && row.date >= iso(new Date(TODAY.getTime() - 30 * 86400000))).reduce((sum, row) => sum + row.amount, 0)),
    byCategory,
    weeks,
    queue: expenses.filter((row) => row.status === 'submitted').slice(0, 5),
  };
}

export const money = (amount: number, currency: Expense['currency'] = 'USD') =>
  new Intl.NumberFormat('en', { style: 'currency', currency }).format(amount);

/** Whole amounts for headline numbers. */
export const wholeMoney = (amount: number) =>
  new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

export const shortDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('en', { day: 'numeric', month: 'short' });

export { TODAY, iso };
