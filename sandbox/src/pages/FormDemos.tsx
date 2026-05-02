import React, { useState } from 'react';
import {
  Box, Button, Checkbox, Combobox, Field,
  Flex, Grid, Input, Label, MultiSelect, NumberField, PasswordField,
  PinInput, RadioGroup, Rating, Select, Slider, Switch, TagsInput,
  Textarea, TransferList,
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
  return (
    <div>
      <h2 style={h2}>Input</h2>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 10 }}>
          <Input placeholder="Surface input" variant="surface" />
          <Input placeholder="Outline input" variant="outline" />
          <Input placeholder="Soft input" variant="soft" />
          <Input placeholder="Disabled" disabled />
          <Input placeholder="With error" error="This field is required" />
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Sizes</h3>
        <Grid style={{ gap: 10 }}>
          {(['sm','md','lg'] as const).map((s) => <Input key={s} placeholder={`Size ${s}`} size={s} />)}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>With Prefix / Suffix</h3>
        <Grid style={{ gap: 10 }}>
          <Input placeholder="Search..."><Input.Prefix>🔍</Input.Prefix></Input>
          <Input placeholder="Amount"><Input.Prefix>$</Input.Prefix><Input.Suffix>.00</Input.Suffix></Input>
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
  const [val, setVal] = useState('');
  return (
    <div>
      <h2 style={h2}>Select</h2>
      <div style={panel}>
        <h3 style={h3}>Basic</h3>
        <Grid style={{ gap: 10 }}>
          <Select placeholder="Choose option" value={val} onChange={(d: any) => setVal(d.value)}>
            <option value="a">Option A</option>
            <option value="b">Option B</option>
            <option value="c">Option C</option>
          </Select>
          <Select placeholder="Disabled" disabled>
            <option>Option</option>
          </Select>
        </Grid>
        <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>Selected: {val || 'none'}</div>
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
