import { toastAdvanced as toast } from '@editora/toast';
import '@editora/toast/toast.css';

toast.configure({ maxVisible: 10 });

const positions = [
  'top-left', 'top-center', 'top-right',
  'bottom-left', 'bottom-center', 'bottom-right',
  'center'
] as const;

for (const position of positions) {
  toast.success(position, { position, duration: 0 });
}
