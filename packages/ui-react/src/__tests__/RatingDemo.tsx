import React, { useState } from 'react';
import { Rating, RatingChangeEvent } from '../components/Rating';

export const RatingDemo: React.FC = () => {
  const [value, setValue] = useState(3);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Rating Component Demo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Basic Rating</h3>
        <Rating 
          value={value}
          onChange={(e: any) => {
            if ('value' in e) {
              setValue(e.value);
            }
          }}
        />
        <p>Current value: {value}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Custom Props</h3>
        <Rating 
          value={4}
          max={10}
          variant="glass"
          size="lg"
          theme="dark"
          tone="warning"
          animation="scale"
          shape="square"
          label="Customer Rating"
          showValue={true}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Readonly Rating</h3>
        <Rating 
          value={2.5}
          readonly={true}
          size="sm"
          tone="success"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Disabled Rating</h3>
        <Rating 
          value={4}
          disabled={true}
          variant="minimal"
          size="lg"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Custom Animation</h3>
        <Rating 
          value={3}
          animation="pulse"
          tone="danger"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Custom Shape</h3>
        <Rating 
          value={4}
          shape="pill"
          tone="info"
          size="lg"
        />
      </div>
    </div>
  );
};

export default RatingDemo;