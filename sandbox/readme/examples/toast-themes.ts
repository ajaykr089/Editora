import { toastAdvanced as toast } from '@editora/toast';
import '@editora/toast/toast.css';

toast.configure({ position: 'top-right', maxVisible: 10, gap: 8 });

const themes = [
  'light', 'colored', 'minimal', 'glass', 'neon', 'retro', 'ocean', 'forest', 'sunset', 'midnight'
] as const;

for (const theme of themes) {
  toast.info(`The ${theme} theme`, { theme, duration: 0 });
}
