import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// By default several toasts fold into a deck: the newest in full, the others as edges behind it.
// Hover the deck (or press Alt+T) and it opens into a list; the timers wait while it is open.
toast.success('Document saved');
toast.info('A new version is available');
toast.warning('Storage is almost full');

// Prefer a plain list that is always open?
// toast.configure({ stack: false });
