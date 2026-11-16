import React from 'react';
import { Alert } from '@editora/ui-react/Alert';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Breadcrumb } from '@editora/ui-react/Breadcrumb';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { Checkbox } from '@editora/ui-react/Checkbox';
import { Combobox } from '@editora/ui-react/Combobox';
import { DatePicker } from '@editora/ui-react/DatePicker';
import { DateRangePicker } from '@editora/ui-react/DateRangePicker';
import { Dialog } from '@editora/ui-react/Dialog';
import { Drawer } from '@editora/ui-react/Drawer';
import { HoverCard } from '@editora/ui-react/HoverCard';
import { Input } from '@editora/ui-react/Input';
import { Kbd } from '@editora/ui-react/Kbd';
import { Menu } from '@editora/ui-react/Menu';
import { Meter } from '@editora/ui-react/Meter';
import { MultiSelect } from '@editora/ui-react/MultiSelect';
import { NumberField } from '@editora/ui-react/NumberField';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Pagination } from '@editora/ui-react/Pagination';
import { Popover } from '@editora/ui-react/Popover';
import { Progress } from '@editora/ui-react/Progress';
import { RadioGroup } from '@editora/ui-react/RadioGroup';
import { Rating } from '@editora/ui-react/Rating';
import { Select } from '@editora/ui-react/Select';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { Slider } from '@editora/ui-react/Slider';
import { Stepper } from '@editora/ui-react/Stepper';
import { Switch } from '@editora/ui-react/Switch';
import { Tabs } from '@editora/ui-react/Tabs';
import { TagsInput } from '@editora/ui-react/TagsInput';
import { Textarea } from '@editora/ui-react/Textarea';
import { TimePicker } from '@editora/ui-react/TimePicker';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { Tooltip } from '@editora/ui-react/Tooltip';
import { TransferList } from '@editora/ui-react/TransferList';
import { Tree } from '@editora/ui-react/Tree';
import { useAlertDialog } from '@editora/ui-react/AlertDialogProvider';
import { PRODUCT_CATEGORIES } from '../../../shared/data';
import { useTitle } from '../lib/router';
import { RichText } from '../lib/RichText';

const COLOURS = ['Clay', 'Sage', 'Ink', 'Oat', 'Rust', 'Slate'];

/** Every family of Editora components in one place, in Larkspur's theme. */
export function UiKit() {
  useTitle('UI elements');
  return (
    <div className="lk-screen">
      <PageHeader title="UI elements" subtitle="The Editora components Larkspur is built from, in this theme. Switch to dark mode or change the density from the account menu to see them adapt." />
      <Tabs variant="soft" aria-label="Component groups">
        <Tabs.Tab value="actions">Actions</Tabs.Tab>
        <Tabs.Panel><Actions /></Tabs.Panel>
        <Tabs.Tab value="forms">Forms</Tabs.Tab>
        <Tabs.Panel><Forms /></Tabs.Panel>
        <Tabs.Tab value="feedback">Feedback</Tabs.Tab>
        <Tabs.Panel><Feedback /></Tabs.Panel>
        <Tabs.Tab value="overlays">Overlays</Tabs.Tab>
        <Tabs.Panel><Overlays /></Tabs.Panel>
        <Tabs.Tab value="navigation">Navigation</Tabs.Tab>
        <Tabs.Panel><Navigation /></Tabs.Panel>
        <Tabs.Tab value="editor">Rich text</Tabs.Tab>
        <Tabs.Panel><Editor /></Tabs.Panel>
      </Tabs>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title as="h2">{title}</Card.Title>
        {description ? <Card.Description>{description}</Card.Description> : null}
      </Card.Header>
      {children}
    </Card>
  );
}

function Actions() {
  return (
    <div className="lk-stack">
      <Section title="Buttons" description="Variants, sizes, icons and states.">
        <div className="lk-wrap">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button icon="plus">With icon</Button>
          <Button loading>Saving</Button>
          <Button disabled>Disabled</Button>
          <Button variant="ghost" icon="settings" aria-label="Settings" />
        </div>
        <div className="lk-wrap">
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>
      <Section title="Badges and avatars">
        <div className="lk-wrap">
          {(['brand', 'neutral', 'info', 'success', 'warning', 'danger', 'purple'] as const).map((tone) => <Badge key={tone} tone={tone} variant="soft">{tone}</Badge>)}
        </div>
        <div className="lk-wrap">
          {(['brand', 'success', 'danger'] as const).map((tone) => <Badge key={tone} tone={tone} variant="solid">{tone}</Badge>)}
          {(['info', 'warning'] as const).map((tone) => <Badge key={tone} tone={tone} variant="outline" pill>{tone}</Badge>)}
        </div>
        <div className="lk-wrap">
          <Avatar initials="MC" alt="Maya Chen" status="online" />
          <Avatar initials="OH" alt="Omar Haddad" status="away" variant="soft" tone="info" />
          <Avatar initials="ID" alt="Ines Duarte" status="busy" variant="soft" tone="warning" />
          <Avatar initials="ZO" alt="Zara Okafor" status="offline" variant="solid" tone="success" />
          <Avatar initials="TB" alt="Theo Brandt" size="lg" shape="rounded" />
        </div>
      </Section>
      <Section title="Progress and meters">
        <div className="lk-stack">
          <Progress value={64} showLabel aria-label="Upload" />
          <Progress value={30} tone="warning" striped animated aria-label="Import" />
          <Progress indeterminate aria-label="Loading" />
          <div className="lk-wrap">
            <Progress mode="circle" value={72} showLabel aria-label="Storage used" />
            <Meter value={0.82} low={0.3} high={0.75} optimum={0.2} aria-label="Disk" />
          </div>
          <div className="lk-wrap"><Skeleton width="180px" height="14px" /><Skeleton width="120px" height="14px" /><Skeleton variant="circle" width="36px" height="36px" /></div>
        </div>
      </Section>
    </div>
  );
}

function Forms() {
  const [tags, setTags] = React.useState(['linen', 'gift']);
  const [colours, setColours] = React.useState<string[]>(['Clay']);
  return (
    <div className="lk-grid-2">
      <Section title="Text">
        <div className="lk-stack">
          <Input label="Product name" placeholder="Speckled mug" description="Shown on the store." />
          <Input label="With an error" defaultValue="mug" error="Names need at least 4 characters." />
          <Input label="Search" placeholder="Search…" clearable><Input.Prefix>⌕</Input.Prefix></Input>
          <NumberField label="Price" prefix="$" min={0} step={0.5} defaultValue={24} />
          <Textarea label="Description" rows={3} placeholder="What makes it special" maxlength={160} description="Up to 160 characters." />
          <TagsInput label="Tags" value={tags} onChange={setTags} />
        </div>
      </Section>
      <Section title="Choices">
        <div className="lk-stack">
          <Select label="Category" defaultValue="Ceramics">{PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
          <Combobox label="Supplier" placeholder="Type to search">
            {['Fernway Supply', 'Harbor & Pine', 'Quillstone', 'Saltmarsh Co.'].map((s) => <Combobox.Option key={s} value={s}>{s}</Combobox.Option>)}
          </Combobox>
          <MultiSelect label="Colours" options={COLOURS.map((c) => ({ value: c, label: c }))} value={colours} onValueChange={setColours} />
          <RadioGroup aria-label="Shipping" value="standard" orientation="horizontal" options={[{ value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }, { value: 'pickup', label: 'Pick up' }]} />
          <div className="lk-wrap"><Checkbox defaultChecked>Gift wrap</Checkbox><Checkbox>Leave at door</Checkbox><Switch label="On sale" checked onChange={() => {}} /></div>
          <Slider label="Discount" min={0} max={50} value={15} showValue format="percent" />
          <Rating value={4} label="Quality" showValue />
        </div>
      </Section>
      <Section title="Dates and times">
        <div className="lk-stack">
          <DatePicker label="Ship on" />
          <DateRangePicker label="Sale period" />
          <TimePicker label="Pick-up time" />
        </div>
      </Section>
      <Section title="Move items between lists">
        <TransferList label="Featured products" options={['Speckled mug', 'Linen throw', 'Brass desk lamp', 'Oak stool', 'Dot-grid notebook'].map((p) => ({ value: p, label: p }))} value={['Linen throw']} />
      </Section>
    </div>
  );
}

function Feedback() {
  return (
    <div className="lk-stack">
      <Section title="Alerts">
        <div className="lk-stack">
          <Alert tone="info" title="Heads up" description="Prices change on July 1." />
          <Alert tone="success" title="Saved" description="The product is live in the store." />
          <Alert tone="warning" title="Low stock" description="Brass desk lamp has 3 left." dismissible />
          <Alert tone="danger" title="Payment failed" description="The card was declined. Ask the customer for another." />
        </div>
      </Section>
      <Section title="Toasts" description="From anywhere in the app with toastApi.">
        <div className="lk-wrap">
          <Button variant="secondary" onClick={() => toastApi.success('Order #48521 shipped')}>Success</Button>
          <Button variant="secondary" onClick={() => toastApi.error('Could not reach the payment provider')}>Error</Button>
          <Button variant="secondary" onClick={() => toastApi.warning('Stock is running low')}>Warning</Button>
          <Button variant="secondary" onClick={() => toastApi.info('A new version is available')}>Info</Button>
        </div>
      </Section>
    </div>
  );
}

function Overlays() {
  const [dialog, setDialog] = React.useState(false);
  const [drawer, setDrawer] = React.useState(false);
  const dialogs = useAlertDialog();
  return (
    <div className="lk-stack">
      <Section title="Dialogs and drawers">
        <div className="lk-wrap">
          <Button variant="secondary" onClick={() => setDialog(true)}>Open dialog</Button>
          <Button variant="secondary" onClick={() => setDrawer(true)}>Open drawer</Button>
          <Button variant="secondary" onClick={async () => { const r = await dialogs.confirm({ title: 'Archive 12 products?', description: 'They leave the store but keep their history.', confirmText: 'Archive' }); toastApi.info(r.action === 'confirm' ? 'Archived' : 'Kept'); }}>Confirm</Button>
          <Button variant="secondary" onClick={async () => { const r = await dialogs.prompt({ title: 'Rename collection', input: { label: 'Name', defaultValue: 'Summer' }, confirmText: 'Rename' }); if (r.action === 'confirm') toastApi.success(`Renamed to ${r.value}`); }}>Prompt</Button>
        </div>
      </Section>
      <Section title="Menus, popovers and tooltips">
        <div className="lk-wrap">
          <Menu>
            <Menu.Trigger><Button variant="secondary" icon="more-horizontal">Actions</Button></Menu.Trigger>
            <Menu.Content>
              <Menu.Item icon="pencil">Edit</Menu.Item>
              <Menu.Item icon="copy">Duplicate</Menu.Item>
              <Menu.Separator />
              <Menu.Item icon="trash" tone="danger">Delete</Menu.Item>
            </Menu.Content>
          </Menu>
          <Popover>
            <Popover.Trigger><Button variant="secondary">Popover</Button></Popover.Trigger>
            <Popover.Content><div className="lk-pop">Popovers hold small forms or details. <Kbd>Esc</Kbd> closes them.</div></Popover.Content>
          </Popover>
          <HoverCard>
            <HoverCard.Trigger><a href="#/customers/C-1003">Hover: Ines Kim</a></HoverCard.Trigger>
            <HoverCard.Content><div className="lk-person"><Avatar initials="IK" alt="" /><span><span className="cell-title">Ines Kim</span><span className="cell-sub">Oakline Health · 2 orders</span></span></div></HoverCard.Content>
          </HoverCard>
          <Tooltip text="Copies the product link"><Button variant="ghost" icon="link" aria-label="Copy link" /></Tooltip>
        </div>
      </Section>
      <Dialog open={dialog} title="Publish 3 products?" description="They go on sale straight away." submitText="Publish" cancelText="Not yet" onDialogClose={() => setDialog(false)} onDialogSubmit={() => toastApi.success('Published')}>
        <Checkbox defaultChecked>Tell newsletter subscribers</Checkbox>
      </Dialog>
      <Drawer open={drawer} side="right" title="Filters" onChange={setDrawer}>
        <div className="lk-stack">
          <Select label="Category">{PRODUCT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
          <Slider label="Price up to" min={0} max={300} value={150} showValue />
          <Button onClick={() => setDrawer(false)}>Apply</Button>
        </div>
      </Drawer>
    </div>
  );
}

function Navigation() {
  const [page, setPage] = React.useState(3);
  return (
    <div className="lk-stack">
      <Section title="Breadcrumbs and pagination">
        <div className="lk-stack">
          <Breadcrumb>
            <Breadcrumb.Item href="#/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="#/products">Products</Breadcrumb.Item>
            <Breadcrumb.Item>Speckled mug</Breadcrumb.Item>
          </Breadcrumb>
          <Pagination page={page} count={12} onPageChange={(detail) => setPage(detail.page)} />
        </div>
      </Section>
      <Section title="Steps">
        <Stepper
          value="details"
          steps={[
            { value: 'cart', label: 'Cart', state: 'complete' },
            { value: 'details', label: 'Details', description: 'Address and delivery' },
            { value: 'payment', label: 'Payment' },
            { value: 'done', label: 'Done' },
          ]}
        />
      </Section>
      <Section title="Tabs" description="Three of the variants.">
        <div className="lk-stack">
          {(['underline', 'segmented', 'cards'] as const).map((variant) => (
            <Tabs key={variant} variant={variant} aria-label={`${variant} tabs`}>
              <Tabs.Tab value="a">Overview</Tabs.Tab><Tabs.Panel><p className="lk-muted">Overview panel</p></Tabs.Panel>
              <Tabs.Tab value="b">Orders</Tabs.Tab><Tabs.Panel><p className="lk-muted">Orders panel</p></Tabs.Panel>
              <Tabs.Tab value="c">Notes</Tabs.Tab><Tabs.Panel><p className="lk-muted">Notes panel</p></Tabs.Panel>
            </Tabs>
          ))}
        </div>
      </Section>
      <Section title="Tree">
        <Tree aria-label="Collections">
          <Tree.Item value="home" label="Home" expanded>
            <Tree.Item value="kitchen" label="Kitchen" expanded>
              <Tree.Item value="ceramics" label="Ceramics" />
              <Tree.Item value="textiles" label="Textiles" />
            </Tree.Item>
            <Tree.Item value="living" label="Living room" />
          </Tree.Item>
          <Tree.Item value="office" label="Office" />
        </Tree>
      </Section>
    </div>
  );
}

function Editor() {
  const [html, setHtml] = React.useState('<h2>The Editora editor</h2><p>Headings, <strong>bold</strong>, <em>italic</em>, <a href="https://example.com">links</a>, lists, checklists, quotes and tables, with undo and redo.</p><ul><li>Type <code>/</code>-free: everything is on the toolbar.</li><li>Paste from Word or Google Docs.</li></ul>');
  return (
    <div className="lk-grid-2">
      <Section title="Editor" description="The full toolbar, as on journal posts.">
        <RichText className="lk-editor" variant="full" value={html} onChange={setHtml} minHeight={260} />
      </Section>
      <Section title="Its HTML" description="What onChange gives you, ready to store.">
        <pre className="lk-code">{html}</pre>
      </Section>
    </div>
  );
}
