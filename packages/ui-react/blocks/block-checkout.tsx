// block: A checkout page: contact and shipping details, delivery options, and an order summary.
import * as React from 'react';
import { Box, Button, Card, DataList, Flex, Heading, Input, NativeSelect, Separator, Text } from '@editora/ui-react';

export type CartLine = { id: string; name: string; quantity: number; price: number };
export type CheckoutValues = { email: string; name: string; address: string; city: string; postcode: string; country: string; delivery: 'standard' | 'express' };

export type CheckoutBlockProps = {
  lines?: CartLine[];
  currency?: string;
  onSubmit?: (values: CheckoutValues) => void | Promise<void>;
};

const SAMPLE: CartLine[] = [
  { id: 'mug', name: 'Ceramic mug', quantity: 2, price: 14 },
  { id: 'notebook', name: 'Dot-grid notebook', quantity: 1, price: 22 },
];

const DELIVERY = { standard: { label: 'Standard (3 to 5 days)', price: 5 }, express: { label: 'Express (next day)', price: 15 } } as const;

/** Shipping form and order summary, side by side on wide screens. */
export function CheckoutBlock({ lines = SAMPLE, currency = 'USD', onSubmit }: CheckoutBlockProps) {
  const [delivery, setDelivery] = React.useState<'standard' | 'express'>('standard');
  const [pending, setPending] = React.useState(false);
  const money = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n);
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
  const shipping = DELIVERY[delivery].price;
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) || '');
    setPending(true);
    try {
      await onSubmit?.({ email: value('email'), name: value('name'), address: value('address'), city: value('city'), postcode: value('postcode'), country: value('country'), delivery });
    } finally {
      setPending(false);
    }
  };
  return (
    <Box style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start', padding: 16 }}>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }} aria-labelledby="checkout-title">
        <Heading level={1} size="xl" id="checkout-title">Checkout</Heading>
        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          <legend style={{ fontWeight: 600, marginBottom: 8 }}>Contact</legend>
          <Input name="email" type="email" label="Email" required autoComplete="email" />
        </fieldset>
        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          <legend style={{ fontWeight: 600, marginBottom: 8 }}>Shipping address</legend>
          <Input name="name" label="Full name" required autoComplete="name" />
          <Input name="address" label="Address" required autoComplete="street-address" />
          <Flex style={{ gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '2 1 160px' }}><Input name="city" label="City" required autoComplete="address-level2" /></div>
            <div style={{ flex: '1 1 100px' }}><Input name="postcode" label="Postcode" required autoComplete="postal-code" /></div>
          </Flex>
          <label htmlFor="checkout-country" style={{ fontSize: 'var(--ui-font-size-sm, 13px)', fontWeight: 500 }}>Country</label>
          <NativeSelect>
            <select id="checkout-country" name="country" autoComplete="country" defaultValue="IN">
              <option value="IN">India</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
            </select>
          </NativeSelect>
        </fieldset>
        <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          <legend style={{ fontWeight: 600, marginBottom: 8 }}>Delivery</legend>
          {(Object.keys(DELIVERY) as Array<'standard' | 'express'>).map((key) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 28 }}>
              <input type="radio" name="delivery" value={key} checked={delivery === key} onChange={() => setDelivery(key)} />
              {DELIVERY[key].label} <Text inline variant="muted">{money(DELIVERY[key].price)}</Text>
            </label>
          ))}
        </fieldset>
        <Button type="submit" block loading={pending}>Pay {money(subtotal + shipping)}</Button>
      </form>
      <aside aria-labelledby="summary-title">
      <Card style={{ display: 'grid', gap: 12 }}>
        <Heading level={2} size="lg" id="summary-title">Order summary</Heading>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
          {lines.map((line) => (
            <li key={line.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span>{line.name} <Text inline variant="muted">× {line.quantity}</Text></span>
              <span>{money(line.quantity * line.price)}</span>
            </li>
          ))}
        </ul>
        <Separator />
        <DataList>
          <DataList.Item><DataList.Label>Subtotal</DataList.Label><DataList.Value>{money(subtotal)}</DataList.Value></DataList.Item>
          <DataList.Item><DataList.Label>Shipping</DataList.Label><DataList.Value>{money(shipping)}</DataList.Value></DataList.Item>
          <DataList.Item><DataList.Label>Total</DataList.Label><DataList.Value><strong>{money(subtotal + shipping)}</strong></DataList.Value></DataList.Item>
        </DataList>
      </Card>
      </aside>
    </Box>
  );
}

export default CheckoutBlock;
