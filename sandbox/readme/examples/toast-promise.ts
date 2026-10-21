import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

const saveDocument = new Promise<{ name: string }>((resolve) => {
  setTimeout(() => resolve({ name: 'Q3-summary.pdf' }), 1500);
});

// One toast that moves from loading to success or error by itself.
toast.promise(saveDocument, {
  loading: 'Saving document...',
  success: (file) => `Saved ${file.name}`,
  error: (error) => `Could not save: ${error.message}`
});

// Or update a toast yourself.
const sync = toast.loading('Syncing...');
setTimeout(() => {
  toast.update(sync.id, { message: 'Everything is up to date', level: 'success' });
}, 2500);
