import { $, toast } from './common';
import '@editora/ui-core/form';
import '@editora/ui-core/input';
import '@editora/ui-core/password-field';
import '@editora/ui-core/checkbox';

type UIForm = HTMLElement & { setErrors(errors: Record<string, string | null>): void };
const form = $<UIForm>('#sign-in');

form.addEventListener('submit', async (event) => {
  // ui-form fires a CustomEvent named "submit": its detail holds the validated values.
  const { values } = (event as unknown as CustomEvent<{ values: Record<string, string> }>).detail;
  form.setAttribute('loading', '');
  await new Promise((resolve) => setTimeout(resolve, 500));
  form.removeAttribute('loading');
  if (values.password !== 'copperline-demo') {
    form.setErrors({ password: 'Email or password is wrong. (In this demo the password is copperline-demo.)' });
    return;
  }
  void toast('Welcome back, Sana');
  setTimeout(() => { location.href = './'; }, 600);
});
