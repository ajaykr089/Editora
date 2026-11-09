// Copperline: everything every page shares. Plain DOM and Editora web components, no framework.
//
// 1. Register the Editora UI elements this template uses (each import defines one custom element).
import '@editora/ui-core/layout';
import '@editora/ui-core/app-header';
import '@editora/ui-core/sidebar';
import '@editora/ui-core/button';
import '@editora/ui-core/icon';
import '@editora/ui-core/badge';
import '@editora/ui-core/card';
import '@editora/ui-core/avatar';
import '@editora/ui-core/dropdown';
import '@editora/ui-core/toast';
import { addIcons } from '@editora/ui-core/add-icons';
import { applyTheme, createThemeTokens, type ThemeMode } from '@editora/ui-core/runtime';
import {
  archiveIcon, bellIcon, bookIcon, cartIcon, chartLineIcon, checkIcon, chevronDownIcon, dashboardIcon, downloadIcon,
  editIcon, eyeIcon, fileTextIcon, homeIcon, inboxIcon, lockIcon, logoutIcon, mailIcon, moonIcon, packageIcon,
  pencilIcon, plusIcon, printerIcon, searchIcon, sendIcon, settingsIcon, sunIcon, trashIcon, truckIcon, userIcon,
  usersIcon, walletIcon, xIcon, creditCardIcon, alertTriangleIcon, refreshCwIcon,
} from '@editora/icons/glyphs';
import '@editora/toast/toast.css';
import './copperline.css';

addIcons(
  archiveIcon, bellIcon, bookIcon, cartIcon, chartLineIcon, checkIcon, chevronDownIcon, dashboardIcon, downloadIcon,
  editIcon, eyeIcon, fileTextIcon, homeIcon, inboxIcon, lockIcon, logoutIcon, mailIcon, moonIcon, packageIcon,
  pencilIcon, plusIcon, printerIcon, searchIcon, sendIcon, settingsIcon, sunIcon, trashIcon, truckIcon, userIcon,
  usersIcon, walletIcon, xIcon, creditCardIcon, alertTriangleIcon, refreshCwIcon,
);

// 2. The theme: Copperline's copper brand, light or dark. applyTheme writes the --ui-* tokens
//    on <html>, which every element (and the rich-text editor) reads.
const FONT = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

function initialMode(): ThemeMode {
  const asked = new URLSearchParams(location.search).get('theme');
  if (asked === 'light' || asked === 'dark') return asked;
  try {
    const saved = localStorage.getItem('copperline-mode');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* storage blocked */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

let mode = initialMode();

export function setMode(next: ThemeMode) {
  mode = next;
  const dark = mode === 'dark';
  applyTheme(
    createThemeTokens(
      {
        colors: {
          primary: dark ? '#f59e66' : '#b4531f',
          primaryHover: dark ? '#f8b48a' : '#94431a',
          foregroundOnPrimary: dark ? '#2a1205' : '#ffffff',
        },
        typography: { family: FONT, headingFamily: FONT },
        radius: '8px',
      },
      { mode }
    ),
    document
  );
  document.documentElement.dataset.theme = mode;
  try { localStorage.setItem('copperline-mode', mode); } catch { /* storage blocked */ }
  const toggle = document.querySelector<HTMLElement>('[data-action="toggle-theme"]');
  if (toggle) {
    toggle.setAttribute('aria-label', dark ? 'Use light theme' : 'Use dark theme');
    toggle.querySelector('ui-icon')?.setAttribute('name', dark ? 'sun' : 'moon');
  }
}
setMode(mode);

// 3. Navigation: one list, highlighted from the page's own file name. Real links, so every page
//    is a separate HTML file a server (or a static host) serves as it is.
const NAV = [
  { value: 'index', label: 'Dashboard', href: './', icon: 'dashboard', section: 'Overview' },
  { value: 'orders', label: 'Orders', href: './orders.html', icon: 'cart', section: 'Store' },
  { value: 'articles', label: 'Help centre', href: './articles.html', icon: 'book', section: 'Content' },
  { value: 'editor', label: 'Write an article', href: './editor.html', icon: 'pencil', section: 'Content' },
  { value: 'settings', label: 'Settings', href: './settings.html', icon: 'settings', section: 'Account' },
  { value: 'sign-in', label: 'Sign in page', href: './sign-in.html', icon: 'lock', section: 'Pages' },
  { value: '404', label: 'Error 404', href: './404.html', icon: 'alert-triangle', section: 'Pages' },
];

function currentPage() {
  const file = location.pathname.split('/').pop() || '';
  return file === '' || file === 'index.html' ? 'index' : file.replace(/\.html$/, '');
}

const sidebar = document.querySelector('ui-sidebar');
if (sidebar) {
  sidebar.setAttribute('items', JSON.stringify(NAV));
  sidebar.setAttribute('value', currentPage() === 'order' ? 'orders' : currentPage());
}

document.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest('[data-action="toggle-theme"]');
  if (target) setMode(mode === 'dark' ? 'light' : 'dark');
});

// 4. Small helpers the pages share.
export const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) => root.querySelector(selector) as T;
export const esc = (text: unknown) => String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function toast(message: string, level: 'success' | 'error' | 'info' | 'warning' = 'success') {
  const { toastAdvanced } = await import('@editora/toast');
  toastAdvanced.show({ message, level });
}

export function param(name: string) {
  return new URLSearchParams(location.search).get(name);
}
