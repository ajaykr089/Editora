import React from 'react';
import { render } from '@testing-library/react';
import { Form, Input } from '../components';

describe('React Form wrapper', () => {
  it('forwards submit/invalid events and reflects methods', async () => {
    const onSubmit = vi.fn();
    const onInvalid = vi.fn();
    const ref = React.createRef<any>();

    render(
      <Form ref={ref} onSubmit={onSubmit} onInvalid={onInvalid}>
        <Input name="email" type="email" value="test@example.com" />
      </Form>
    );

    // submit should be callable
    const ok = await ref.current.submit();
    expect(ok).toBe(true);
    expect(onSubmit).toHaveBeenCalled();
  });

  it('maps heading/state props to ui-form attributes', () => {
    const { container } = render(
      <Form
        heading="Clinical intake"
        description="Theme-aware metadata section."
        state="warning"
        stateText="Unsaved changes"
        loadingText="Saving intake..."
        disabled
      >
        <Input name="firstName" value="Ava" />
      </Form>
    );

    const element = container.querySelector('ui-form') as HTMLElement | null;
    expect(element).toBeTruthy();
    expect(element?.getAttribute('heading')).toBe('Clinical intake');
    expect(element?.hasAttribute('title')).toBe(false);
    expect(element?.getAttribute('description')).toBe('Theme-aware metadata section.');
    expect(element?.getAttribute('state')).toBe('warning');
    expect(element?.getAttribute('state-text')).toBe('Unsaved changes');
    expect(element?.getAttribute('loading-text')).toBe('Saving intake...');
    expect(element?.hasAttribute('disabled')).toBe(true);
  });
});
