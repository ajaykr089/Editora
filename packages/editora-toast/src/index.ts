export type ToastLevel = 'info' | 'success' | 'error';

export interface ToastOptions {
  message: string;
  duration?: number; // ms
  level?: ToastLevel;
}

const DEFAULT_DURATION = 4000;
let container: HTMLElement | null = null;

function ensureContainer() {
  if (container) return container;
  container = document.createElement('div');
  container.className = 'editora-toast-container';
  document.body.appendChild(container);

  // try to inject css if not loaded
  const existing = Array.from(document.styleSheets).find(s => (s.ownerNode as any)?.href?.includes('toast.css'));
  if (!existing) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/packages/editora-toast/dist/toast.css';
    document.head.appendChild(link);
  }

  return container;
}

function createToastEl(message: string, level: ToastLevel) {
  const el = document.createElement('div');
  el.className = `editora-toast ${level}`;
  el.textContent = message;

  const close = document.createElement('span');
  close.className = 'close';
  close.textContent = '×';
  close.style.float = 'right';
  close.style.marginLeft = '8px';
  close.onclick = () => {
    // immediate hide for manual close (will mirror show.hide behavior)
    el.classList.remove('show');
    setTimeout(() => {
      try { el.remove(); } catch (e) {}
    }, 220);
  };

  el.appendChild(close);
  return el;
}

function show(options: ToastOptions) {
  if (typeof document === 'undefined') return;
  const { message, duration = DEFAULT_DURATION, level = 'info' } = options;
  const cont = ensureContainer();
  const el = createToastEl(message, level);
  cont.appendChild(el);

  // force layout then show
  requestAnimationFrame(() => el.classList.add('show'));

  const timeout = setTimeout(() => hide(el), duration);

  function hide(target: HTMLElement) {
    clearTimeout(timeout);
    target.classList.remove('show');
    setTimeout(() => {
      try { target.remove(); } catch (e) {}
    }, 220);
  }

  return {
    dismiss: () => hide(el)
  };
}

export const toast = {
  info: (msg: string, duration?: number) => show({ message: msg, level: 'info', duration }),
  success: (msg: string, duration?: number) => show({ message: msg, level: 'success', duration }),
  error: (msg: string, duration?: number) => show({ message: msg, level: 'error', duration })
};

export default toast;
