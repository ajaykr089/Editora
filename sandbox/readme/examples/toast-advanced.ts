import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// A toast with a title, a description, actions and progress. duration: 0 keeps it until it is dismissed.
const report = toast.show({
  level: 'success',
  title: 'Report ready',
  description: 'Q3-summary.pdf is 2.4 MB',
  actions: [
    { label: 'Open', primary: true, onClick: () => console.log('open') },
    { label: 'Dismiss', onClick: () => report.dismiss() }
  ],
  duration: 0
});

const upload = toast.show({
  level: 'info',
  message: 'Uploading photos',
  progress: { value: 64, showPercentage: true },
  duration: 0
});
