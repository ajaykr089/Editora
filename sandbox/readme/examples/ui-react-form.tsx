import { useState } from 'react';
import { Form, Field, Input, Button, useForm } from '@editora/ui-react';

export default function ProfileForm() {
  const { ref, submit, validate, getValues, reset } = useForm();
  const [dirty, setDirty] = useState(false);

  return (
    <Form
      ref={ref}
      autosave
      guardUnsaved
      onSubmit={(values) => console.log('submit', values)}
      onInvalid={(errors) => console.log('invalid', errors)}
      onDirtyChange={(isDirty) => setDirty(isDirty)}
      style={{ display: 'grid', gap: 12, maxWidth: 520 }}
    >
      <Field label="Full name" required>
        <Input name="fullName" required />
      </Field>

      <Field label="Email" required>
        <Input name="email" type="email" required />
      </Field>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={() => validate()}>Validate</Button>
        <Button variant="secondary" onClick={() => console.log(getValues())}>Values</Button>
        <Button variant="secondary" onClick={() => reset()}>Reset</Button>
        <Button onClick={() => submit()} disabled={!dirty}>Submit</Button>
      </div>
    </Form>
  );
}
