import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

// A list instead of a deck, so all four are visible at once.
toast.configure({ maxVisible: 4, stack: false });

toast.success('Saved');                              // the icon of the level
toast('Copied to clipboard');                        // no level, no icon
toast.info('Invite sent', { icon: '✉️' });           // your own: text, an emoji or a DOM node
toast.error('Payment failed', { icon: false });      // none

// Or switch the built-in icons off everywhere:
// toast.configure({ icons: false });
