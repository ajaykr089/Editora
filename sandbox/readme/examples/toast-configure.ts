import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// Settings for every toast from now on. A toast can still override them.
toast.configure({
  position: 'top-center',
  duration: 6000,
  maxVisible: 3,
  theme: 'ocean',
  closeButton: true,
  preventDuplicate: true
});

toast.info('Welcome back');
toast.info('Welcome back'); // the duplicate is dropped
toast.warning('Your plan renews tomorrow', { theme: 'sunset', duration: 0 });
