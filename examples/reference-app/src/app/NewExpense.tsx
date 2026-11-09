import React from 'react';
import { Breadcrumb } from '@editora/ui-react/Breadcrumb';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { DatePicker } from '@editora/ui-react/DatePicker';
import { FileUpload } from '@editora/ui-react/FileUpload';
import { Form } from '@editora/ui-react/Form';
import { Input } from '@editora/ui-react/Input';
import { NumberField } from '@editora/ui-react/NumberField';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Select } from '@editora/ui-react/Select';
import { Textarea } from '@editora/ui-react/Textarea';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { CATEGORIES, createExpense } from './api';

/**
 * Validation happens on the pretend server: an amount over $5,000, a date in the future or a
 * merchant containing "test" comes back as field errors, shown with Form's `errors` prop.
 */
export function NewExpense() {
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [busy, setBusy] = React.useState(false);

  const submit = async (values: Record<string, unknown>) => {
    setBusy(true);
    const result = await createExpense({
      merchant: String(values.merchant || ''),
      category: String(values.category || ''),
      amount: String(values.amount ?? ''),
      date: String(values.date || ''),
      note: String(values.note || ''),
    });
    setBusy(false);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    toastApi.success(`${result.expense.merchant} submitted for approval`);
    window.location.hash = `#/app/expenses/${result.expense.id}`;
  };

  return (
    <div className="screen screen-narrow">
      <Breadcrumb>
        <Breadcrumb.Item href="#/app/expenses">Expenses</Breadcrumb.Item>
        <Breadcrumb.Item>New expense</Breadcrumb.Item>
      </Breadcrumb>
      <PageHeader title="New expense" subtitle="Add the receipt and we fill in what we can read from it." />

      <Card>
        <Form className="expense-form" errors={errors} onSubmit={submit} loading={busy} aria-label="New expense">
          <FileUpload name="receipt" label="Receipt" accept="image/*,application/pdf" description="A photo or PDF, up to 10 MB." />
          <div className="form-row">
            <Input name="merchant" label="Merchant" placeholder="Where you paid" required />
            <Select name="category" label="Category" required defaultValue="">
              <option value="" disabled>Choose a category</option>
              {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </Select>
          </div>
          <div className="form-row">
            <NumberField name="amount" label="Amount" prefix="$" min={0} step={0.01} required />
            <DatePicker name="date" label="Date" hint="Leave empty for today." />
          </div>
          <Textarea name="note" label="Note" description="Optional: what it was for, if it is not obvious." rows={3} />
          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={() => { window.location.hash = '#/app/expenses'; }}>Cancel</Button>
            <Button type="submit" loading={busy}>Submit for approval</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
