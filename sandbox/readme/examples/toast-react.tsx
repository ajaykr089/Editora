import { toast } from '@editora/toast';
import '@editora/toast/toast.css';

async function saveDraft() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { name: 'draft.md' };
}

// There is nothing to mount: call toast from any handler or effect.
export default function SaveButton() {
  return (
    <button
      onClick={() =>
        toast.promise(saveDraft(), {
          loading: 'Saving...',
          success: (file) => `Saved ${file.name}`,
          error: 'Could not save'
        })
      }
    >
      Save
    </button>
  );
}
