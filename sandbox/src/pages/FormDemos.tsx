import React, { useState } from 'react';
import {
  Box, Button, Checkbox, ColorPicker, Combobox, DateField, DatePicker, DateRangePicker,
  DateRangeTimePicker, DateTimePicker, Dropzone, Field, FileUpload,
  Flex, Grid, Input, Label, MultiSelect, NumberField, PasswordField,
  InlineEdit, PinInput, RadioGroup, Rating, Select, Slider, Switch, TagsInput,
  Textarea, TimeField, TimePicker, TransferList,
} from '@editora/ui-react';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

export function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <h2 style={h2}>Checkbox</h2>
      <div style={panel}>
        <h3 style={h3}>States</h3>
        <Flex direction="column" style={{ gap: 10 }}>
          <Checkbox checked={checked} onChange={(d: any) => setChecked(d.checked)}>Controlled checkbox</Checkbox>
          <Checkbox defaultChecked>Default checked</Checkbox>
          <Checkbox disabled>Disabled</Checkbox>
          <Checkbox disabled defaultChecked>Disabled checked</Checkbox>
          <Checkbox indeterminate>Indeterminate</Checkbox>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Flex style={{ gap: 16, alignItems: 'center' }}>
          {(['sm','md','lg'] as const).map((s) => <Checkbox key={s} size={s}>{s}</Checkbox>)}
        </Flex>
      </div>
    </div>
  );
}

export function InputDemo() {
  const [email, setEmail] = useState('editor@editora.dev');
  const [search, setSearch] = useState('');
  return (
    <div>
      <h2 style={h2}>Input</h2>
      <div style={panel}>
        <h3 style={h3}>Controlled fields</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <Input label="Email" description="Controlled value with clear action." value={email} onChange={setEmail} clearable type="email" placeholder="you@example.com" variant="surface" />
          <Input label="Search" value={search} onInput={setSearch} debounce={250} clearable placeholder="Search projects..." variant="soft">
            <Input.Prefix>⌕</Input.Prefix>
          </Input>
          <Input label="Slug" placeholder="release-notes" floatingLabel maxlength={24} counter variant="outlined" />
          <Input label="Disabled" value="Locked field" disabled variant="filled" />
        </Grid>
        <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Email: {email || 'empty'} · Search: {search || 'empty'}</div>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants and states</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {(['classic', 'surface', 'soft', 'outlined', 'filled', 'flushed', 'minimal', 'contrast', 'elevated'] as const).map((variant) => (
            <Input key={variant} label={variant} placeholder={`${variant} input`} variant={variant} />
          ))}
          <Input label="Success" placeholder="Validated input" validation="success" tone="success" />
          <Input label="Error" placeholder="Required field" validation="error" tone="danger">
            <Input.Error>This field is required.</Input.Error>
          </Input>
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Sizes, density, and adornments</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {(['sm','md','lg'] as const).map((s) => <Input key={s} label={`Size ${s}`} placeholder={`Size ${s}`} size={s} />)}
          <Input label="Compact" placeholder="Compact density" density="compact" />
          <Input label="Amount" placeholder="0.00" inputMode="decimal">
            <Input.Prefix>$</Input.Prefix>
            <Input.Suffix>USD</Input.Suffix>
          </Input>
        </Grid>
      </div>
    </div>
  );
}

export function ColorPickerDemo() {
  const [brand, setBrand] = useState('#2563eb');
  const presets = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0f172a'];
  return (
    <div>
      <h2 style={h2}>ColorPicker</h2>
      <div style={panel}>
        <h3 style={h3}>Popover and inline modes</h3>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'start' }}>
          <ColorPicker value={brand} onValueChange={setBrand} presets={presets} recent alpha label="Brand color" />
          <ColorPicker value="#16a34a" mode="inline" presets={presets} label="Inline picker" />
          <ColorPicker value="#0f172a" variant="contrast" format="rgb" label="Contrast RGB" />
        </Grid>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#64748b' }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #cbd5e1', background: brand }} />
          Selected: {brand}
        </div>
      </div>
    </div>
  );
}

export function FileUploadDemo() {
  const [files, setFiles] = useState<string[]>([]);
  const [rejected, setRejected] = useState('');
  return (
    <div>
      <h2 style={h2}>FileUpload</h2>
      <div style={panel}>
        <h3 style={h3}>Upload field</h3>
        <FileUpload
          label="Product assets"
          description="Upload PNG, JPG, or SVG assets up to 2 MB."
          accept="image/png,image/jpeg,image/svg+xml"
          multiple
          maxFiles={4}
          maxSize={2 * 1024 * 1024}
          showPreviews
          buttonText="Choose assets"
          onChange={(next) => {
            setFiles(next.map((file) => file.name));
            setRejected('');
          }}
          onReject={(items) => setRejected(items.map((item) => `${item.file.name}: ${item.reason}`).join(', '))}
        />
        <div style={{ marginTop: 10, fontSize: 13, color: rejected ? '#b45309' : '#64748b' }}>
          {rejected || `Selected: ${files.length ? files.join(', ') : 'none'}`}
        </div>
      </div>
      <div style={panel}>
        <h3 style={h3}>Dropzone with simulated upload</h3>
        <Dropzone
          label="Drop release notes"
          description="Auto-upload Markdown or PDF files."
          accept=".md,.pdf"
          multiple
          uploadOnSelect
          uploadButtonText="Upload now"
          dropLabel="Drop files here or browse"
          onUploadRequest={async ({ setProgress }) => {
            for (const progress of [20, 45, 70, 100]) {
              setProgress(progress);
              await new Promise((resolve) => window.setTimeout(resolve, 120));
            }
          }}
        />
      </div>
    </div>
  );
}

export function InlineEditDemo() {
  const [title, setTitle] = useState('Quarterly roadmap');
  const [summary, setSummary] = useState('Click the text to edit this project summary.');
  return (
    <div>
      <h2 style={h2}>InlineEdit</h2>
      <div style={panel}>
        <h3 style={h3}>Editable text</h3>
        <Grid style={{ gap: 16 }}>
          <Box style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Title</div>
            <InlineEdit value={title} onValueChange={setTitle} placeholder="Untitled project" />
          </Box>
          <Box style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Multiline summary</div>
            <InlineEdit value={summary} onValueChange={setSummary} multiline placeholder="Add summary..." />
          </Box>
          <Box style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Read only</div>
            <InlineEdit value="Published changelog" readOnly />
          </Box>
        </Grid>
      </div>
    </div>
  );
}

export function DateTimeFieldDemo() {
  const [date, setDate] = useState<string | null>('2026-05-18');
  const [time, setTime] = useState<string | null>('14:30');
  return (
    <div>
      <h2 style={h2}>Date and Time Fields</h2>
      <div style={panel}>
        <h3 style={h3}>Segmented fields</h3>
        <Grid style={{ gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <DateField label="Launch date" description="Keyboard-friendly date segments." value={date || undefined} min="2026-01-01" max="2026-12-31" onValueChange={setDate} />
          <TimeField label="Launch time" description="24-hour time with seconds." value={time || undefined} seconds onValueChange={setTime} />
          <DateField label="Disabled date" value="2026-06-01" disabled />
          <TimeField label="12-hour field" value="09:45" format="12h" />
        </Grid>
        <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>Selected: {date || 'none'} at {time || 'none'}</div>
      </div>
    </div>
  );
}

export function DateTimePickersDemo() {
  const [date, setDate] = useState<string | null>('2026-05-18');
  const [dateTime, setDateTime] = useState<string | null>('2026-05-18T14:30');
  return (
    <div>
      <h2 style={h2}>Date Time Pickers</h2>
      <div style={panel}>
        <h3 style={h3}>Popover pickers</h3>
        <Grid style={{ gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <DatePicker label="Due date" value={date || undefined} onValueChange={setDate} clearable allowInput showFooter events={[
            { date: '2026-05-18', title: 'Release', tone: 'success' },
            { date: '2026-05-21', title: 'Review', tone: 'info' },
          ]} />
          <DateRangePicker label="Sprint window" defaultValue='{"start":"2026-05-11","end":"2026-05-22"}' clearable allowSameDay showFooter />
          <TimePicker label="Reminder" defaultValue="09:30" format="12h" clearable allowInput />
          <DateTimePicker label="Publish at" value={dateTime || undefined} onValueChange={setDateTime} clearable allowInput showFooter />
        </Grid>
        <div style={{ marginTop: 10, fontSize: 13, color: '#64748b' }}>Date: {date || 'none'} · Date-time: {dateTime || 'none'}</div>
      </div>
      <div style={panel}>
        <h3 style={h3}>Inline and range time pickers</h3>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'start' }}>
          <DatePicker label="Inline calendar" mode="inline" defaultValue="2026-05-18" showFooter eventsMax={2} />
          <DateRangeTimePicker label="Maintenance window" defaultValue='{"start":"2026-05-18T20:00","end":"2026-05-18T22:30"}' clearable autoNormalize showFooter />
        </Grid>
      </div>
    </div>
  );
}

export function LabelDemo() {
  return (
    <div>
      <h2 style={h2}>Label</h2>
      <div style={panel}>
        <Grid style={{ gap: 14 }}>
          <div>
            <Label htmlFor="l1" required>
              <Label.Text>Email address</Label.Text>
              <Label.Description>We'll never share your email.</Label.Description>
            </Label>
            <Input id="l1" placeholder="you@example.com" style={{ marginTop: 6 }} />
          </div>
          <div>
            <Label htmlFor="l2">
              <Label.Text>Username</Label.Text>
            </Label>
            <Input id="l2" placeholder="johndoe" style={{ marginTop: 6 }} />
          </div>
        </Grid>
      </div>
    </div>
  );
}

export function SelectDemo() {
  const [val, setVal] = useState('review');
  return (
    <div>
      <h2 style={h2}>Select</h2>
      <div style={panel}>
        <h3 style={h3}>Styled select controls</h3>
        <Grid style={{ gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <Select label="Workflow status" description="Controls publish automation." placeholder="Choose status" value={val} onChange={setVal} variant="surface" elevation="high" showCheck optionBorder>
            <Select.Option value="">Choose a status</Select.Option>
            <Select.OptGroup label="Active">
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="review">In review</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Final">
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="published">Published</Select.Option>
            </Select.OptGroup>
          </Select>
          <Select label="Assignee" value="maya" variant="soft" tone="brand" shape="pill" showCheck>
            <Select.Leading>PM</Select.Leading>
            <Select.Option value="maya">Maya Patel</Select.Option>
            <Select.Option value="noah">Noah Smith</Select.Option>
            <Select.Option value="ava">Ava Chen</Select.Option>
          </Select>
          <Select label="Release risk" value="high" variant="outline" tone="danger" validation="warning" error="High-risk release requires approval.">
            <Select.Option value="low">Low</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="high">High</Select.Option>
          </Select>
          <Select label="Disabled state" value="locked" disabled variant="surface">
            <Select.Option value="locked">Locked by release policy</Select.Option>
          </Select>
        </Grid>
        <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Selected: {val || 'none'}</div>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variant matrix</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {(['surface', 'soft', 'outline', 'solid', 'glass', 'contrast'] as const).map((variant) => (
            <Select key={variant} label={variant} value="review" variant={variant} tone={variant === 'solid' ? 'success' : 'default'} elevation="low">
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="review">In review</Select.Option>
              <Select.Option value="approved">Approved</Select.Option>
            </Select>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function SwitchDemo() {
  const [on, setOn] = useState(false);
  return (
    <div>
      <h2 style={h2}>Switch</h2>
      <div style={panel}>
        <h3 style={h3}>States</h3>
        <Flex direction="column" style={{ gap: 12 }}>
          <Switch checked={on} onChange={(d: any) => setOn(d.checked)}>
            Notifications {on ? 'enabled' : 'disabled'}
            <Switch.Description>Receive alerts for important events.</Switch.Description>
          </Switch>
          <Switch defaultChecked>Default on</Switch>
          <Switch disabled>Disabled off</Switch>
          <Switch disabled defaultChecked>Disabled on</Switch>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Flex style={{ gap: 16, alignItems: 'center' }}>
          {(['sm','md','lg'] as const).map((s) => <Switch key={s} size={s}>{s}</Switch>)}
        </Flex>
      </div>
    </div>
  );
}

export function TextareaDemo() {
  return (
    <div>
      <h2 style={h2}>Textarea</h2>
      <div style={panel}>
        <Grid style={{ gap: 12 }}>
          <Textarea placeholder="Default textarea">
            <Textarea.Label>Notes</Textarea.Label>
            <Textarea.Description>Add any relevant notes here.</Textarea.Description>
          </Textarea>
          <Textarea placeholder="With error" error="This field is required">
            <Textarea.Label>Required field</Textarea.Label>
            <Textarea.Error>This field is required</Textarea.Error>
          </Textarea>
          <Textarea placeholder="Disabled" disabled>
            <Textarea.Label>Disabled</Textarea.Label>
          </Textarea>
        </Grid>
      </div>
    </div>
  );
}

export function SliderDemo() {
  const [val, setVal] = useState(40);
  return (
    <div>
      <h2 style={h2}>Slider</h2>
      <div style={panel}>
        <Grid style={{ gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, marginBottom: 8 }}>Value: {val}</div>
            <Slider value={val} min={0} max={100} onChange={(d: any) => setVal(d.value)} />
          </div>
          <Slider defaultValue={60} min={0} max={100} tone="success" />
          <Slider defaultValue={80} min={0} max={100} tone="warning" disabled />
        </Grid>
      </div>
    </div>
  );
}

export function RadioGroupDemo() {
  const [val, setVal] = useState('b');
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
    { value: 'd', label: 'Disabled', disabled: true },
  ];
  return (
    <div>
      <h2 style={h2}>RadioGroup</h2>
      <div style={panel}>
        <RadioGroup value={val} options={options} onValueChange={(d: any) => setVal(d.value)} />
        <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Selected: {val}</div>
      </div>
      <div style={panel}>
        <h3 style={h3}>Horizontal</h3>
        <RadioGroup orientation="horizontal" value="x" options={[
          { value: 'x', label: 'X' },
          { value: 'y', label: 'Y' },
          { value: 'z', label: 'Z' },
        ]} />
      </div>
      <div style={panel}>
        <h3 style={h3}>Card variant</h3>
        <RadioGroup value="b" variant="card" options={[
          { value: 'a', label: 'Starter', description: 'For individuals' },
          { value: 'b', label: 'Pro', description: 'For teams' },
          { value: 'c', label: 'Enterprise', description: 'For organizations' },
        ]} />
      </div>
    </div>
  );
}

export function RatingDemo() {
  const [val, setVal] = useState(3);
  return (
    <div>
      <h2 style={h2}>Rating</h2>
      <div style={panel}>
        <Grid style={{ gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Interactive (value: {val})</div>
            <Rating value={val} onChange={(d: any) => setVal(d.value)} />
          </div>
          <div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Read-only</div>
            <Rating value={4} readOnly />
          </div>
          <div>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Half stars</div>
            <Rating value={3.5} allowHalf readOnly />
          </div>
        </Grid>
      </div>
    </div>
  );
}

export function TagsInputDemo() {
  const [tags, setTags] = useState(['react', 'typescript']);
  return (
    <div>
      <h2 style={h2}>TagsInput</h2>
      <div style={panel}>
        <TagsInput value={tags} onChange={(d: any) => setTags(d.value)} placeholder="Add tag..." />
        <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Tags: {tags.join(', ')}</div>
      </div>
    </div>
  );
}

export function PasswordFieldDemo() {
  return (
    <div>
      <h2 style={h2}>PasswordField</h2>
      <div style={panel}>
        <Grid style={{ gap: 10 }}>
          <PasswordField placeholder="Enter password" />
          <PasswordField placeholder="With strength meter" showStrength />
          <PasswordField placeholder="Disabled" disabled />
        </Grid>
      </div>
    </div>
  );
}

export function PinInputDemo() {
  const [val, setVal] = useState('');
  return (
    <div>
      <h2 style={h2}>PinInput</h2>
      <div style={panel}>
        <Grid style={{ gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, marginBottom: 8 }}>4-digit PIN (value: {val})</div>
            <PinInput length={4} onChange={(d: any) => setVal(d.value)} />
          </div>
          <div>
            <div style={{ fontSize: 13, marginBottom: 8 }}>6-digit OTP</div>
            <PinInput length={6} type="number" />
          </div>
          <div>
            <div style={{ fontSize: 13, marginBottom: 8 }}>Masked</div>
            <PinInput length={4} mask />
          </div>
        </Grid>
      </div>
    </div>
  );
}

export function NumberFieldDemo() {
  const [val, setVal] = useState(10);
  return (
    <div>
      <h2 style={h2}>NumberField</h2>
      <div style={panel}>
        <Grid style={{ gap: 10 }}>
          <NumberField value={val} min={0} max={100} onChange={(d: any) => setVal(d.value)} label="Quantity" />
          <NumberField defaultValue={5} min={1} max={10} step={0.5} label="Step 0.5" />
          <NumberField defaultValue={100} formatOptions={{ style: 'currency', currency: 'USD' }} label="Currency" />
        </Grid>
      </div>
    </div>
  );
}

export function ComboboxDemo() {
  const options = ['Apple','Banana','Cherry','Date','Elderberry','Fig','Grape'];
  return (
    <div>
      <h2 style={h2}>Combobox</h2>
      <div style={panel}>
        <Grid style={{ gap: 10 }}>
          <Combobox placeholder="Select fruit..." options={options.map((o) => ({ value: o.toLowerCase(), label: o }))} />
          <Combobox placeholder="Multi-select" multiple options={options.map((o) => ({ value: o.toLowerCase(), label: o }))} />
        </Grid>
      </div>
    </div>
  );
}

export function MultiSelectDemo() {
  return (
    <div>
      <h2 style={h2}>MultiSelect</h2>
      <div style={panel}>
        <MultiSelect
          placeholder="Select technologies..."
          options={['React','TypeScript','Vite','Tailwind','Radix','Storybook'].map((o) => ({ value: o.toLowerCase(), label: o }))}
        />
      </div>
    </div>
  );
}

export function TransferListDemo() {
  return (
    <div>
      <h2 style={h2}>TransferList</h2>
      <div style={panel}>
        <TransferList
          sourceItems={['Item A','Item B','Item C','Item D','Item E'].map((l) => ({ value: l.toLowerCase().replace(' ','_'), label: l }))}
          targetItems={['Item F','Item G'].map((l) => ({ value: l.toLowerCase().replace(' ','_'), label: l }))}
        />
      </div>
    </div>
  );
}

export function FieldDemo() {
  return (
    <div>
      <h2 style={h2}>Field</h2>
      <div style={panel}>
        <Grid style={{ gap: 14 }}>
          <Field label="Full name" description="Your legal name as it appears on your ID.">
            <Input placeholder="John Doe" />
          </Field>
          <Field label="Email" required>
            <Input placeholder="you@example.com" type="email" />
          </Field>
          <Field label="Bio" description="Tell us about yourself.">
            <Textarea placeholder="I'm a developer..." />
          </Field>
        </Grid>
      </div>
    </div>
  );
}
