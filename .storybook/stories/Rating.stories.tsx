import React, { useState } from 'react';
import { Rating } from '@editora/ui-react';

export default {
  title: 'UI/Rating',
  component: Rating,
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 10, step: 1 } },
    max: { control: { type: 'number', min: 1, max: 20, step: 1 } },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    variant: { control: 'select', options: ['default', 'soft', 'glass', 'contrast', 'minimal'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    theme: { control: 'select', options: ['light', 'dark', 'brand'] },
    tone: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger'] },
    animation: { control: 'select', options: ['scale', 'pulse', 'none'] },
    shape: { control: 'select', options: ['rounded', 'square', 'pill'] },
    showValue: { control: 'boolean' },
    label: { control: 'text' }

  }
};

export const BasicRating = (args: any) => {
  const [value, setValue] = useState(3);

  return (
    <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif" }}>
      <h3>Basic Rating</h3>
      <Rating
        {...args}
        value={value}
        precision={0.5}
        onChange={(e) => {
          console.log(e.value);
          setValue(e.value);
        }}
      />
      <p style={{ marginTop: "10px", fontSize: "14px", color: "#64748b" }}>
        Current value: {value} / {args.max || 5}
      </p>
    </div>
  );
};

BasicRating.args = {
  value: 3,
  max: 5,
  disabled: false,
  readonly: false,
  variant: 'default',
  size: 'md',
  theme: 'light',
  tone: 'warning',
  animation: 'scale',
  shape: 'rounded',
  showValue: true,
  label: 'Product Rating'
};

export const ProductRating = () => {
  const [value, setValue] = useState(4);

  return (
    <div style={{ padding: '20px', maxWidth: 400 }}>
      <h3>Product Rating</h3>
      <Rating 
        value={value}
        max={5}
        variant="glass"
        size="lg"
        tone="warning"
        animation="scale"
        onChange={(e) => setValue(e.value)}
      />
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
        {value} out of 5 stars
      </p>
    </div>
  );
};

export const CustomerFeedback = () => {
  const [value, setValue] = useState(3);

  return (
    <div style={{ padding: '20px', maxWidth: 500 }}>
      <h3>Customer Feedback</h3>
      <Rating 
        value={value}
        max={10}
        variant="soft"
        size="md"
        tone="success"
        animation="none"
        label="Overall satisfaction"
        showValue={true}
        onChange={(e) => setValue(e.value)}
      />
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
        Please rate your experience from 1 to 10
      </p>
    </div>
  );
};

export const ServiceRating = () => {
  const [value, setValue] = useState(2);

  return (
    <div style={{ padding: '20px', maxWidth: 300 }}>
      <h3>Service Rating</h3>
      <Rating 
        value={value}
        max={5}
        variant="minimal"
        size="sm"
        tone="danger"
        animation="none"
        label="Service Quality"
        onChange={(e) => setValue(e.value)}
      />
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
        Rate the service quality
      </p>
    </div>
  );
};

export const ReadonlyRating = () => {
  return (
    <div style={{ padding: '20px', maxWidth: 400 }}>
      <h3>Readonly Rating</h3>
      <Rating 
        value={4.5}
        max={5}
        readonly={true}
        size="lg"
        tone="info"
        animation="none"
        label="Average Rating"
        showValue={true}
      />
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
        This rating is readonly and shows an average score
      </p>
    </div>
  );
};

export const DisabledRating = () => {
  return (
    <div style={{ padding: '20px', maxWidth: 400 }}>
      <h3>Disabled Rating</h3>
      <Rating 
        value={3}
        max={5}
        disabled={true}
        variant="glass"
        size="md"
        tone="neutral"
        animation="none"
        label="Temporarily Unavailable"
        showValue={true}
      />
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
        This rating is disabled and cannot be interacted with
      </p>
    </div>
  );
};

export const CustomShapeRating = () => {
  const [value, setValue] = useState(4);

  return (
    <div style={{ padding: '20px', maxWidth: 400 }}>
      <h3>Custom Shape Rating</h3>
      <Rating 
        value={value}
        max={5}
        variant="contrast"
        size="lg"
        tone="danger"
        animation="pulse"
        shape="square"
        onChange={(e) => setValue(e.value)}
      />
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
        Square-shaped rating with pulse animation
      </p>
    </div>
  );
};

export const PillShapeRating = () => {
  const [value, setValue] = useState(5);

  return (
    <div style={{ padding: '20px', maxWidth: 400 }}>
      <h3>Pill Shape Rating</h3>
      <Rating 
        value={value}
        max={5}
        variant="glass"
        size="lg"
        tone="success"
        animation="scale"
        shape="pill"
        onChange={(e) => setValue(e.value)}
      />
      <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
        Pill-shaped rating with scale animation
      </p>
    </div>
  );
};

export const ThemeVariants = () => {
  const [value, setValue] = useState(3);

  return (
    <div style={{ padding: '20px', maxWidth: 800 }}>
      <h3>Theme Variants</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div>
          <h4>Light Theme</h4>
          <Rating 
            value={value}
            max={5}
            theme="light"
            tone="warning"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Dark Theme</h4>
          <div style={{ backgroundColor: '#1e293b', padding: '10px', borderRadius: '8px' }}>
            <Rating 
              value={value}
              max={5}
              theme="dark"
              tone="warning"
              onChange={(e) => setValue(e.value)}
            />
          </div>
        </div>
        <div>
          <h4>Brand Theme</h4>
          <Rating 
            value={value}
            max={5}
            theme="brand"
            tone="warning"
            onChange={(e) => setValue(e.value)}
          />
        </div>
      </div>
    </div>
  );
};

export const SizeVariants = () => {
  const [value, setValue] = useState(3);

  return (
    <div style={{ padding: '20px', maxWidth: 600 }}>
      <h3>Size Variants</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h4>Small (16px)</h4>
          <Rating 
            value={value}
            max={5}
            size="sm"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Medium (20px) - Default</h4>
          <Rating 
            value={value}
            max={5}
            size="md"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Large (24px)</h4>
          <Rating 
            value={value}
            max={5}
            size="lg"
            onChange={(e) => setValue(e.value)}
          />
        </div>
      </div>
    </div>
  );
};

export const ToneVariants = () => {
  const [value, setValue] = useState(3);

  return (
    <div style={{ padding: '20px', maxWidth: 800 }}>
      <h3>Tone Variants</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <div>
          <h4>Neutral</h4>
          <Rating 
            value={value}
            max={5}
            tone="neutral"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Info</h4>
          <Rating 
            value={value}
            max={5}
            tone="info"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Success</h4>
          <Rating 
            value={value}
            max={5}
            tone="success"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Warning</h4>
          <Rating 
            value={value}
            max={5}
            tone="warning"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Danger</h4>
          <Rating 
            value={value}
            max={5}
            tone="danger"
            onChange={(e) => setValue(e.value)}
          />
        </div>
      </div>
    </div>
  );
};

export const AnimationVariants = () => {
  const [value, setValue] = useState(3);

  return (
    <div style={{ padding: '20px', maxWidth: 600 }}>
      <h3>Animation Variants</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h4>Scale Animation (Default)</h4>
          <Rating 
            value={value}
            max={5}
            animation="scale"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Pulse Animation</h4>
          <Rating 
            value={value}
            max={5}
            animation="pulse"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>No Animation</h4>
          <Rating 
            value={value}
            max={5}
            animation="none"
            onChange={(e) => setValue(e.value)}
          />
        </div>
      </div>
    </div>
  );
};

export const VariantStyles = () => {
  const [value, setValue] = useState(3);

  return (
    <div style={{ padding: '20px', maxWidth: 800 }}>
      <h3>Variant Styles</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div>
          <h4>Default</h4>
          <Rating 
            value={value}
            max={5}
            variant="default"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Soft</h4>
          <Rating 
            value={value}
            max={5}
            variant="soft"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Glass</h4>
          <Rating 
            value={value}
            max={5}
            variant="glass"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Contrast</h4>
          <Rating 
            value={value}
            max={5}
            variant="contrast"
            onChange={(e) => setValue(e.value)}
          />
        </div>
        <div>
          <h4>Minimal</h4>
          <Rating 
            value={value}
            max={5}
            variant="minimal"
            onChange={(e) => setValue(e.value)}
          />
        </div>
      </div>
    </div>
  );
};

export const InteractiveDemo = () => {
  const [value, setValue] = useState(0);
  const [max, setMax] = useState(5);
  const [variant, setVariant] = useState<'default' | 'soft' | 'glass' | 'contrast' | 'minimal'>('default');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [tone, setTone] = useState<'neutral' | 'info' | 'success' | 'warning' | 'danger'>('warning');
  const [animation, setAnimation] = useState<'scale' | 'pulse' | 'none'>('scale');
  const [shape, setShape] = useState<'rounded' | 'square' | 'pill'>('rounded');
  const [disabled, setDisabled] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [showValue, setShowValue] = useState(true);

  return (
    <div style={{ padding: '20px', maxWidth: 800 }}>
      <h3>Interactive Demo</h3>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <h4>Current Rating</h4>
        <Rating 
          value={value}
          max={max}
          variant={variant}
          size={size}
          tone={tone}
          animation={animation}
          shape={shape}
          disabled={disabled}
          readonly={readonly}
          showValue={showValue}
          onChange={(e) => setValue(e.value)}
        />
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
          Value: {value} / {max} | Variant: {variant} | Size: {size} | Tone: {tone} | Animation: {animation} | Shape: {shape}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Max Value</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={max} 
            onChange={(e) => setMax(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <span style={{ fontSize: '12px', color: '#64748b' }}>{max}</span>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Current Value</label>
          <input 
            type="range" 
            min="0" 
            max={max} 
            value={value} 
            onChange={(e) => setValue(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <span style={{ fontSize: '12px', color: '#64748b' }}>{value}</span>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Variant</label>
          <select value={variant} onChange={(e) => setVariant(e.target.value as typeof variant)} style={{ width: '100%', padding: '5px' }}>
            <option value="default">Default</option>
            <option value="soft">Soft</option>
            <option value="glass">Glass</option>
            <option value="contrast">Contrast</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Size</label>
          <select value={size} onChange={(e) => setSize(e.target.value as typeof size)} style={{ width: '100%', padding: '5px' }}>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value as typeof tone)} style={{ width: '100%', padding: '5px' }}>
            <option value="neutral">Neutral</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Animation</label>
          <select value={animation} onChange={(e) => setAnimation(e.target.value as typeof animation)} style={{ width: '100%', padding: '5px' }}>
            <option value="scale">Scale</option>
            <option value="pulse">Pulse</option>
            <option value="none">None</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>Shape</label>
          <select value={shape} onChange={(e) => setShape(e.target.value as typeof shape)} style={{ width: '100%', padding: '5px' }}>
            <option value="rounded">Rounded</option>
            <option value="square">Square</option>
            <option value="pill">Pill</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
            <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} />
            Disabled
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
            <input type="checkbox" checked={readonly} onChange={(e) => setReadonly(e.target.checked)} />
            Readonly
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px' }}>
            <input type="checkbox" checked={showValue} onChange={(e) => setShowValue(e.target.checked)} />
            Show Value
          </label>
        </div>
      </div>
    </div>
  );
};
