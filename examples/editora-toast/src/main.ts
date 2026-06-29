import { toastAdvanced as toast } from '@editora/toast';
import '@editora/toast/toast.css';
import './styles.css';

toast.configure({
  position: 'bottom-right',
  visibleToasts: 3,
  expand: false,
  stack: true,
  richColors: false,
  closeButton: true,
  preventDuplicate: true,
  pauseOnWindowBlur: true,
  swipeDismiss: true
});

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = `
  <section class="shell">
    <aside class="sidebar">
      <p class="eyebrow">Editora Toast</p>
      <h1>Production toast patterns</h1>
      <p class="lede">A compact sandbox for modern notifications: stack behavior, async states, actions, dedupe, progress, and headless state.</p>
      <div class="status" aria-live="polite">
        <span class="status-dot"></span>
        <span id="stateText">No visible toasts</span>
      </div>
    </aside>

    <section class="panel" aria-label="Toast examples">
      <div class="toolbar">
        <label>
          Position
          <select id="position">
            <option value="bottom-right">Bottom right</option>
            <option value="bottom-center">Bottom center</option>
            <option value="top-right">Top right</option>
            <option value="top-center">Top center</option>
          </select>
        </label>

        <label class="switch">
          <input id="richColors" type="checkbox" />
          <span>Rich colors</span>
        </label>

        <label class="switch">
          <input id="expand" type="checkbox" />
          <span>Expanded stack</span>
        </label>
      </div>

      <div class="grid">
        <button data-demo="success">Success</button>
        <button data-demo="action">Action</button>
        <button data-demo="promise">Promise</button>
        <button data-demo="progress">Progress</button>
        <button data-demo="duplicate">Prevent duplicate</button>
        <button data-demo="important">Important</button>
        <button data-demo="custom">Custom render</button>
        <button data-demo="clear" class="secondary">Clear all</button>
      </div>
    </section>
  </section>
`;

const stateText = document.querySelector<HTMLSpanElement>('#stateText');
const position = document.querySelector<HTMLSelectElement>('#position');
const richColors = document.querySelector<HTMLInputElement>('#richColors');
const expand = document.querySelector<HTMLInputElement>('#expand');

toast.subscribe((state) => {
  if (!stateText) return;
  const visible = state.visible.length;
  const queued = state.queued.length;
  stateText.textContent = `${visible} visible${queued ? `, ${queued} queued` : ''}`;
});

position?.addEventListener('change', () => {
  toast.configure({ position: position.value as Parameters<typeof toast.configure>[0]['position'] });
});

richColors?.addEventListener('change', () => {
  toast.configure({ richColors: richColors.checked });
});

expand?.addEventListener('change', () => {
  toast.configure({ expand: expand.checked });
});

document.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-demo]');
  if (!button) return;

  const demo = button.dataset.demo;

  if (demo === 'success') {
    toast.success('Saved to workspace', {
      title: 'Document saved',
      description: 'All collaborators will see the latest version.',
      icon: '✓'
    });
  }

  if (demo === 'action') {
    toast.info('The paragraph was removed.', {
      title: 'Block deleted',
      description: 'Use undo if this was not intentional.',
      icon: '↶',
      action: {
        label: 'Undo',
        onClick: () => toast.success('Block restored', { title: 'Undo complete', icon: '✓' })
      },
      cancel: {
        label: 'Dismiss',
        onClick: () => undefined
      }
    });
  }

  if (demo === 'promise') {
    toast.promise(fakeRequest(), {
      loading: {
        title: 'Publishing',
        message: 'Preparing the document...',
        icon: '⏳',
        duration: 0
      },
      success: {
        title: 'Published',
        message: 'Your page is live.',
        icon: '✓'
      },
      error: {
        title: 'Publish failed',
        message: 'Try again in a moment.',
        icon: '!'
      }
    });
  }

  if (demo === 'progress') {
    const upload = toast.loading('Uploading assets...', {
      title: 'Asset upload',
      icon: '↑',
      duration: 0,
      progress: { value: 8, showPercentage: true },
      action: {
        label: 'Cancel',
        onClick: () => upload.dismiss()
      }
    });

    let value = 8;
    const interval = window.setInterval(() => {
      value += Math.round(Math.random() * 18) + 8;
      if (value >= 100) {
        window.clearInterval(interval);
        upload.update({
          level: 'success',
          title: 'Upload complete',
          message: 'All image assets are ready.',
          icon: '✓',
          progress: { value: 100, showPercentage: true },
          duration: 2800,
          actions: []
        });
        return;
      }
      upload.update({ progress: { value, showPercentage: true } });
    }, 420);
  }

  if (demo === 'duplicate') {
    toast.warning('Only one duplicate warning is shown.', {
      id: 'duplicate-demo',
      title: 'Duplicate prevented',
      icon: '!',
      preventDuplicate: true
    });
  }

  if (demo === 'important') {
    toast.error('Payment sync failed.', {
      title: 'Needs attention',
      description: 'Important toasts can replace lower-priority visible toasts.',
      icon: '!',
      important: true,
      priority: 100,
      duration: 6000,
      closeButton: true
    });
  }

  if (demo === 'custom') {
    toast.show({
      level: 'custom',
      duration: 6500,
      render: () => {
        const node = document.createElement('div');
        node.className = 'custom-toast';
        node.innerHTML = '<strong>Custom renderer</strong><span>Use your own DOM while keeping Editora lifecycle, queue, and gestures.</span>';
        return node;
      }
    });
  }

  if (demo === 'clear') {
    toast.clear();
  }
});

function fakeRequest(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 1400);
  });
}
