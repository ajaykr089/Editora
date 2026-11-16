import { $, toast } from './common';
import '@editora/ui-core/tabs';
import '@editora/ui-core/form';
import '@editora/ui-core/input';
import '@editora/ui-core/select';
import '@editora/ui-core/textarea';
import '@editora/ui-core/switch';
import '@editora/ui-core/password-field';

type UIForm = HTMLElement & { setErrors(errors: Record<string, string | null>): void };
const form = $<UIForm>('#profile-form');

// ui-form validates the fields (required, type="email"), then fires submit with the values.
form.addEventListener('submit', async (event) => {
  // ui-form fires a CustomEvent named "submit": its detail holds the validated values.
  const { values } = (event as unknown as CustomEvent<{ values: Record<string, string> }>).detail;
  form.setAttribute('loading', '');
  await new Promise((resolve) => setTimeout(resolve, 400)); // the pretend server
  form.removeAttribute('loading');
  if (String(values.email).endsWith('@taken.example')) {
    // A server-side error lands on its field, like a validation error.
    form.setErrors({ email: 'Another account already uses this email.' });
    return;
  }
  void toast('Profile saved');
});

$('#save-notifications').addEventListener('click', () => toast('Notification settings saved'));
$('#change-password').addEventListener('click', () => toast('Password changed'));
