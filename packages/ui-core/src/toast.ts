type ToastOptions = { duration?: number };

const TOAST_ROOT_ID = 'ui-toast-root';

function getRoot() {
  if (typeof document === 'undefined') return null;
  let root = document.getElementById(TOAST_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = TOAST_ROOT_ID;
    root.style.position = 'fixed';
    root.style.right = '16px';
    root.style.bottom = '16px';
    root.style.zIndex = '9999';
    document.body.appendChild(root);
  }
  return root;
}

export function showToast(message: string, opts: ToastOptions = {}) {
  const root = getRoot();
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'ui-toast';
  el.textContent = message;
  el.style.background = 'rgba(0,0,0,0.8)';
  el.style.color = 'white';
  el.style.padding = '8px 12px';
  el.style.marginTop = '8px';
  el.style.borderRadius = '6px';
  root.appendChild(el);
  const duration = opts.duration ?? 3000;
  const timeout = setTimeout(() => {
    try { root.removeChild(el); } catch (e) {}
    clearTimeout(timeout);
  }, duration);
  return () => { try { root.removeChild(el); } catch (e) {} };
}
