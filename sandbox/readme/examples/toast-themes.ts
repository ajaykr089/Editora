import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// A deck would fold these into one; stack: false keeps them in a list.
toast.configure({ position: 'top-right', maxVisible: 12, stack: false, gap: 8 });

const themes = [
  'light', 'dark', 'colored', 'minimal', 'glass', 'neon', 'retro', 'ocean', 'forest', 'sunset', 'midnight'
] as const;

for (const theme of themes) {
  toast.info(`The ${theme} theme`, { theme, duration: 0 });
}
