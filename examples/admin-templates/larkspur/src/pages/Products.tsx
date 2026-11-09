import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { DataTable } from '@editora/ui-react/DataTable';
import { Drawer } from '@editora/ui-react/Drawer';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { FiltersBar } from '@editora/ui-react/FiltersBar';
import { Form } from '@editora/ui-react/Form';
import { Input } from '@editora/ui-react/Input';
import { NumberField } from '@editora/ui-react/NumberField';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { RadioGroup } from '@editora/ui-react/RadioGroup';
import { Rating } from '@editora/ui-react/Rating';
import { Select } from '@editora/ui-react/Select';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { ToggleGroup } from '@editora/ui-react/ToggleGroup';
import { listProducts, money, PRODUCT_CATEGORIES, saveProduct, type Product } from '../../../shared/data';
import { Swatch, useLoad } from '../lib/ui';
import { navigate, useTitle } from '../lib/router';

const STATUS_TONE = { published: 'success', draft: 'neutral', archived: 'warning' } as const;
const STATUS_LABEL = { published: 'Published', draft: 'Draft', archived: 'Archived' } as const;

function stockLabel(stock: number) {
  return stock === 0 ? 'Sold out' : stock < 8 ? `${stock} left` : `${stock} in stock`;
}

export function Products() {
  useTitle('Products');
  const opensNew = new URLSearchParams(window.location.hash.split('?')[1] || '').get('new') === '1';
  const [view, setView] = React.useState<'grid' | 'table'>('grid');
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [editing, setEditing] = React.useState<Product | 'new' | null>(opensNew ? 'new' : null);
  const [errors, setErrors] = React.useState<Record<string, string> | null>(null);
  const [saving, setSaving] = React.useState(false);
  const { data, loading, reload } = useLoad(() => listProducts({ query, category, pageSize: 100 }), [query, category]);

  const close = () => {
    setEditing(null);
    setErrors(null);
    if (opensNew) navigate('/products');
  };

  const save = async (values: Record<string, unknown>) => {
    setSaving(true);
    const result = await saveProduct({
      id: editing && editing !== 'new' ? editing.id : undefined,
      name: String(values.name ?? ''),
      sku: String(values.sku ?? '') || undefined,
      category: values.category as Product['category'],
      price: Number(values.price),
      stock: Number(values.stock ?? 0),
      status: (values.status as Product['status']) || 'draft',
    });
    setSaving(false);
    if (!result.ok) { setErrors(result.errors); return; }
    toastApi.success(`${result.product.name} saved`);
    close();
    reload();
  };

  const product = editing && editing !== 'new' ? editing : null;

  return (
    <div className="lk-screen">
      <PageHeader
        title="Products"
        subtitle={data ? `${data.total} products in ${PRODUCT_CATEGORIES.length} categories` : 'Loading'}
        actions={<Button icon="plus" onClick={() => setEditing('new')}>Add product</Button>}
      />

      <div className="lk-toolbar">
        <FiltersBar
          className="lk-grow"
          search={query}
          onSearchChange={setQuery}
          searchPlaceholder="Name or SKU"
          searchDebounce={200}
          status={category}
          statusLabel="Category"
          statusPlaceholder="All categories"
          statusOptions={PRODUCT_CATEGORIES.map((value) => ({ value, label: value }))}
          onStatusChange={setCategory}
          clearDisabled={!query && !category}
          onClear={() => { setQuery(''); setCategory(''); }}
        />
        <ToggleGroup value={view} aria-label="View" onValueChange={(detail) => { if (detail.value) setView(detail.value as 'grid' | 'table'); }}>
          <ToggleGroup.Item value="grid" aria-label="Grid view"><span className="lk-toggle-label">Grid</span></ToggleGroup.Item>
          <ToggleGroup.Item value="table" aria-label="Table view"><span className="lk-toggle-label">Table</span></ToggleGroup.Item>
        </ToggleGroup>
      </div>

      {data && data.rows.length === 0 ? (
        <EmptyState title="No products match" description="Try another name, or clear the filters." actionLabel="Clear filters" onAction={() => { setQuery(''); setCategory(''); }} />
      ) : view === 'grid' ? (
        <div className="lk-product-grid" aria-busy={loading}>
          {!data ? Array.from({ length: 8 }, (_, i) => <Skeleton key={i} height="250px" radius="var(--base-card-radius)" />) : data.rows.map((p) => (
            <Card key={p.id} className="lk-product">
              <div className="lk-product-media" style={{ background: p.colour }} aria-hidden="true">
                <span>{p.name.slice(0, 1)}</span>
              </div>
              <div className="lk-product-body">
                <div className="lk-row">
                  <span className="lk-row-main">
                    <span className="cell-title">{p.name}</span>
                    <span className="cell-sub">{p.category} · {p.sku}</span>
                  </span>
                  <Badge tone={STATUS_TONE[p.status]} variant="soft" size="sm">{STATUS_LABEL[p.status]}</Badge>
                </div>
                <Rating value={Math.round(p.rating * 2) / 2} readonly precision={0.5} size="sm" ariaLabel={`Rated ${p.rating.toFixed(1)} out of 5`} />
                <div className="lk-row">
                  <strong className="lk-price">{money(p.price)}</strong>
                  <span className={p.stock < 8 ? 'lk-stock' + (p.stock === 0 ? ' out' : '') : 'cell-sub'}>{stockLabel(p.stock)}</span>
                </div>
                <Button variant="secondary" size="sm" icon="pencil" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>Edit</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <DataTable sortable hover aria-label="Products" state={loading ? 'loading' : 'idle'} page={1} pageSize={12} paginationId="products-pager">
          <table>
            <thead>
              <tr>
                <th data-key="name">Product</th><th data-key="category">Category</th><th data-key="price" data-align="end">Price</th>
                <th data-key="stock" data-align="end">Stock</th><th data-key="sold" data-align="end">Sold</th><th data-key="status">Status</th><th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {(data?.rows || []).map((p) => (
                <tr key={p.id} data-id={p.id}>
                  <td><span className="lk-person"><Swatch colour={p.colour} label={p.name} size={28} /><span><span className="cell-title">{p.name}</span><span className="cell-sub">{p.sku}</span></span></span></td>
                  <td>{p.category}</td>
                  <td data-align="end" data-value={p.price}>{money(p.price)}</td>
                  <td data-align="end" data-value={p.stock}>{p.stock}</td>
                  <td data-align="end" data-value={p.sold}>{p.sold}</td>
                  <td><Badge tone={STATUS_TONE[p.status]} variant="soft" size="sm">{STATUS_LABEL[p.status]}</Badge></td>
                  <td><Button variant="ghost" size="sm" icon="pencil" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataTable>
      )}

      <Drawer open={!!editing} side="right" title={product ? `Edit ${product.name}` : 'Add product'} onChange={(open) => { if (!open) close(); }}>
        <Form errors={errors} onSubmit={save} loading={saving} aria-label={product ? 'Edit product' : 'Add product'} key={product?.id ?? 'new'}>
          <div className="lk-stack">
            <Input name="name" label="Name" defaultValue={product?.name} required placeholder="Speckled mug" />
            <div className="lk-form-grid">
              <Select name="category" label="Category" defaultValue={product?.category ?? 'Ceramics'}>
                {PRODUCT_CATEGORIES.map((value) => <option key={value} value={value}>{value}</option>)}
              </Select>
              <Input name="sku" label="SKU" defaultValue={product?.sku} description="Left empty, one is made for you." />
              <NumberField name="price" label="Price" prefix="$" min={0} step={0.01} defaultValue={product?.price} required />
              <NumberField name="stock" label="Stock" min={0} step={1} defaultValue={product?.stock ?? 0} />
            </div>
            <RadioGroup
              name="status"
              aria-label="Status"
              value={product?.status ?? 'draft'}
              variant="card"
              options={[
                { value: 'draft', label: 'Draft', description: 'Only your team can see it.' },
                { value: 'published', label: 'Published', description: 'On sale in the store.' },
              ]}
            />
            <div className="lk-actions">
              <Button variant="secondary" type="button" onClick={close}>Cancel</Button>
              <Button type="submit" loading={saving}>{product ? 'Save' : 'Add product'}</Button>
            </div>
          </div>
        </Form>
      </Drawer>
    </div>
  );
}
