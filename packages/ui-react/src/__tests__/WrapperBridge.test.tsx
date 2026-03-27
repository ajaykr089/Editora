import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { Alert } from '../components/Alert';
import { Anchor } from '../components/Anchor';
import { Calendar } from '../components/Calendar';
import { AspectRatio } from '../components/AspectRatio';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Checkbox } from '../components/Checkbox';
import { ColorPicker } from '../components/ColorPicker';
import { DateField } from '../components/DateField';
import { DatePicker } from '../components/DatePicker';
import { DateRangePicker } from '../components/DateRangePicker';
import { DateTimePicker } from '../components/DateTimePicker';
import { EmptyState } from '../components/EmptyState';
import { Field } from '../components/Field';
import { HoverCard } from '../components/HoverCard';
import { Icon } from '../components/Icon';
import { Input } from '../components/Input';
import { Meter } from '../components/Meter';
import { Menubar } from '../components/Menubar';
import { NumberField } from '../components/NumberField';
import { PasswordField } from '../components/PasswordField';
import { PinInput } from '../components/PinInput';
import { Progress } from '../components/Progress';
import { QuickActions } from '../components/QuickActions';
import { RadioGroup } from '../components/RadioGroup';
import { Select } from '../components/Select';
import { Slider } from '../components/Slider';
import { Stepper } from '../components/Stepper';
import { Section } from '../components/Section';
import { Switch } from '../components/Switch';
import { TagsInput } from '../components/TagsInput';
import { Textarea } from '../components/Textarea';
import { TimePicker } from '../components/TimePicker';
import { Toggle } from '../components/Toggle';
import { Breadcrumb } from '../components/Breadcrumb';
import { Collapsible } from '../components/Collapsible';
import { Label } from '../components/Label';
import { Skeleton } from '../components/Skeleton';

function ensureElement(tagName: string) {
  if (customElements.get(tagName)) return;

  class MockElement extends HTMLElement {}

  customElements.define(tagName, MockElement);
}

describe('wrapper bridge helpers', () => {
  beforeAll(() => {
    ensureElement('ui-odometer');
    ensureElement('ui-alert');
    ensureElement('ui-anchor');
    ensureElement('ui-aspect-ratio');
    ensureElement('ui-avatar');
    ensureElement('ui-badge');
    ensureElement('ui-breadcrumb');
    ensureElement('ui-calendar');
    ensureElement('ui-checkbox');
    ensureElement('ui-collapsible');
    ensureElement('ui-date-field');
    ensureElement('ui-date-picker');
    ensureElement('ui-date-range-picker');
    ensureElement('ui-date-time-picker');
    ensureElement('ui-empty-state');
    ensureElement('ui-field');
    ensureElement('ui-color-picker');
    ensureElement('ui-hover-card');
    ensureElement('ui-icon');
    ensureElement('ui-input');
    ensureElement('ui-label');
    ensureElement('ui-meter');
    ensureElement('ui-menubar');
    ensureElement('ui-number-field');
    ensureElement('ui-password-field');
    ensureElement('ui-pin-input');
    ensureElement('ui-progress');
    ensureElement('ui-quick-actions');
    ensureElement('ui-radio-group');
    ensureElement('ui-select');
    ensureElement('ui-slider');
    ensureElement('ui-stepper');
    ensureElement('ui-section');
    ensureElement('ui-skeleton');
    ensureElement('ui-switch');
    ensureElement('ui-tags-input');
    ensureElement('ui-textarea');
    ensureElement('ui-time-picker');
    ensureElement('ui-toggle');
  });

  it('maps DatePicker props and custom events', async () => {
    let changedValue: string | null = null;
    let invalidReason = '';

    const { container } = render(
      <DatePicker
        value="2026-03-12"
        defaultOpen
        weekStart={1}
        showFooter={false}
        events={[{ date: '2026-03-12', title: 'Launch', tone: 'info' }]}
        onValueChange={(value) => {
          changedValue = value;
        }}
        onInvalid={(detail) => {
          invalidReason = detail.reason;
        }}
      />
    );

    const host = container.querySelector('ui-date-picker') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('2026-03-12');
      expect(host?.hasAttribute('default-open')).toBe(true);
      expect(host?.getAttribute('week-start')).toBe('1');
      expect(host?.getAttribute('show-footer')).toBe('false');
      expect(host?.getAttribute('events')).toContain('Launch');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { mode: 'single', value: '2026-03-18', displayValue: 'Mar 18, 2026', source: 'calendar' },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('invalid', {
        detail: { raw: '2026-99-99', reason: 'bounds' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(changedValue).toBe('2026-03-18');
      expect(invalidReason).toBe('bounds');
    });
  });

  it('maps DateRangePicker props and change detail', async () => {
    let changedValue: string | null = null;

    const { container } = render(
      <DateRangePicker
        value='{"start":"2026-03-01","end":"2026-03-08"}'
        rangeVariant="single-field"
        allowPartial
        nameStart="startDate"
        nameEnd="endDate"
        showFooter
        onValueChange={(value) => {
          changedValue = value;
        }}
      />
    );

    const host = container.querySelector('ui-date-range-picker') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('{"start":"2026-03-01","end":"2026-03-08"}');
      expect(host?.getAttribute('range-variant')).toBe('single-field');
      expect(host?.hasAttribute('allow-partial')).toBe(true);
      expect(host?.getAttribute('name-start')).toBe('startDate');
      expect(host?.getAttribute('name-end')).toBe('endDate');
      expect(host?.getAttribute('show-footer')).toBe('true');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: {
          mode: 'range',
          start: '2026-03-10',
          end: '2026-03-15',
          value: { start: '2026-03-10', end: '2026-03-15' },
          source: 'calendar',
        },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(changedValue).toBe('{"start":"2026-03-10","end":"2026-03-15"}');
    });
  });

  it('maps ColorPicker props and open/close detail events', async () => {
    let latestValue = '';
    let openSource = '';
    let closeSource = '';

    const { container } = render(
      <ColorPicker
        value="#336699"
        presets={['#336699', '#112233']}
        recent
        open
        onValueChange={(value) => {
          latestValue = value;
        }}
        onOpenDetail={(detail) => {
          openSource = detail.source;
        }}
        onCloseDetail={(detail) => {
          closeSource = detail.source;
        }}
      />
    );

    const host = container.querySelector('ui-color-picker') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('#336699');
      expect(host?.getAttribute('presets')).toContain('#112233');
      expect(host?.hasAttribute('recent')).toBe(true);
      expect(host?.hasAttribute('open')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: {
          value: '#445566',
          hex: '#445566',
          rgba: { r: 68, g: 85, b: 102, a: 1 },
          hsla: { h: 210, s: 20, l: 33, a: 1 },
          source: 'preset',
        },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('open', {
        detail: { open: true, previousOpen: false, source: 'toggle' },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('close', {
        detail: { open: false, previousOpen: true, source: 'escape' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(latestValue).toBe('#445566');
      expect(openSource).toBe('toggle');
      expect(closeSource).toBe('escape');
    });
  });

  it('maps Calendar props and calendar events', async () => {
    let selectedValue = '';
    let changedMode = '';
    let changedMonth = 0;

    const { container } = render(
      <Calendar
        year={2026}
        month={3}
        value="2026-03-12"
        selection="range"
        events={[{ date: '2026-03-12', title: 'Planning', tone: 'info' }]}
        showToday={false}
        onValueChange={(value) => {
          selectedValue = value;
        }}
        onCalendarChange={(detail) => {
          changedMode = detail.mode;
        }}
        onMonthChange={(detail) => {
          changedMonth = detail.month;
        }}
      />
    );

    const host = container.querySelector('ui-calendar') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('year')).toBe('2026');
      expect(host?.getAttribute('month')).toBe('3');
      expect(host?.getAttribute('selection')).toBe('range');
      expect(host?.getAttribute('events')).toContain('Planning');
      expect(host?.getAttribute('show-today')).toBe('false');
    });

    fireEvent(
      host!,
      new CustomEvent('ui-select', {
        detail: { value: '2026-03-18', source: 'pointer' },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('ui-change', {
        detail: {
          mode: 'range',
          value: { start: '2026-03-18', end: '2026-03-21' },
          start: '2026-03-18',
          end: '2026-03-21',
          source: 'pointer',
        },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('ui-month-change', {
        detail: { year: 2026, month: 4, source: 'pointer' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(selectedValue).toBe('2026-03-18');
      expect(changedMode).toBe('range');
      expect(changedMonth).toBe(4);
    });
  });

  it('maps TimePicker props and change detail', async () => {
    let changedValue: string | null = null;

    const { container } = render(
      <TimePicker
        value="10:30"
        step={15}
        seconds
        defaultOpen
        onValueChange={(value) => {
          changedValue = value;
        }}
      />
    );

    const host = container.querySelector('ui-time-picker') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('10:30');
      expect(host?.getAttribute('step')).toBe('15');
      expect(host?.hasAttribute('seconds')).toBe(true);
      expect(host?.hasAttribute('default-open')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { mode: 'time', value: '11:45', source: 'list' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(changedValue).toBe('11:45');
    });
  });

  it('maps DateTimePicker props and invalid detail', async () => {
    let invalidReason = '';

    const { container } = render(
      <DateTimePicker
        value="2026-03-18T10:30"
        weekStart={1}
        step={30}
        allowInput
        showFooter={false}
        onInvalid={(detail) => {
          invalidReason = detail.reason;
        }}
      />
    );

    const host = container.querySelector('ui-date-time-picker') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('2026-03-18T10:30');
      expect(host?.getAttribute('week-start')).toBe('1');
      expect(host?.getAttribute('step')).toBe('30');
      expect(host?.hasAttribute('allow-input')).toBe(true);
      expect(host?.getAttribute('show-footer')).toBe('false');
    });

    fireEvent(
      host!,
      new CustomEvent('invalid', {
        detail: { raw: 'bad', reason: 'parse' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(invalidReason).toBe('parse');
    });
  });

  it('maps DateField props and change detail', async () => {
    let changedValue: string | null = null;

    const { container } = render(
      <DateField
        value="2026-03-18"
        min="2026-03-01"
        required
        onValueChange={(value) => {
          changedValue = value;
        }}
      />
    );

    const host = container.querySelector('ui-date-field') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('2026-03-18');
      expect(host?.getAttribute('min')).toBe('2026-03-01');
      expect(host?.hasAttribute('required')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { value: '2026-03-19', previousValue: '2026-03-18', source: 'input' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(changedValue).toBe('2026-03-19');
    });
  });

  it('maps AnimatedNumber props and completion event', async () => {
    let completedValue = 0;

    const { container } = render(
      <AnimatedNumber
        value={128}
        variant="digital"
        minimumFractionDigits={1}
        maximumFractionDigits={2}
        animate
        animateOnMount
        onComplete={(event) => {
          completedValue = event.detail.value;
        }}
      />
    );

    const host = container.querySelector('ui-odometer') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('128');
      expect(host?.getAttribute('variant')).toBe('digital');
      expect(host?.getAttribute('minimum-fraction-digits')).toBe('1');
      expect(host?.getAttribute('maximum-fraction-digits')).toBe('2');
      expect(host?.hasAttribute('animate')).toBe(true);
      expect(host?.hasAttribute('animate-on-mount')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('complete', {
        detail: { value: 256 },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(completedValue).toBe(256);
    });
  });

  it('maps Input props and string value events', async () => {
    let changedValue = '';
    let debouncedValue = '';
    let cleared = false;

    const { container } = render(
      <Input
        clearable
        debounce={250}
        floatingLabel
        placeholder="Search"
        onChange={(value) => {
          changedValue = value;
        }}
        onDebouncedInput={(value) => {
          debouncedValue = value;
        }}
        onClear={() => {
          cleared = true;
        }}
      />
    );

    const host = container.querySelector('ui-input') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.hasAttribute('clearable')).toBe(true);
      expect(host?.getAttribute('debounce')).toBe('250');
      expect(host?.hasAttribute('floating-label')).toBe(true);
      expect(host?.getAttribute('placeholder')).toBe('Search');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { value: 'hello' },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('debounced-input', {
        detail: { value: 'hello world' },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(host!, new CustomEvent('clear', { bubbles: true, composed: true }));

    await waitFor(() => {
      expect(changedValue).toBe('hello');
      expect(debouncedValue).toBe('hello world');
      expect(cleared).toBe(true);
    });
  });

  it('maps Textarea props and value events', async () => {
    let inputValue = '';

    const { container } = render(
      <Textarea
        autosize
        showCount
        rows={4}
        maxRows={8}
        onInput={(value) => {
          inputValue = value;
        }}
      />
    );

    const host = container.querySelector('ui-textarea') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.hasAttribute('autosize')).toBe(true);
      expect(host?.hasAttribute('show-count')).toBe(true);
      expect(host?.getAttribute('rows')).toBe('4');
      expect(host?.getAttribute('max-rows')).toBe('8');
    });

    fireEvent(
      host!,
      new CustomEvent('input', {
        detail: { value: 'notes', length: 5, name: 'notes' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(inputValue).toBe('notes');
    });
  });

  it('maps Checkbox props and checked detail events', async () => {
    let checkedValue = false;

    const { container } = render(
      <Checkbox
        checked
        indeterminate
        density="compact"
        onCheckedChange={(checked) => {
          checkedValue = checked;
        }}
      />
    );

    const host = container.querySelector('ui-checkbox') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.hasAttribute('checked')).toBe(true);
      expect(host?.hasAttribute('indeterminate')).toBe(true);
      expect(host?.getAttribute('density')).toBe('compact');
    });

    fireEvent(
      host!,
      new CustomEvent('input', {
        detail: { checked: false, indeterminate: false },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(checkedValue).toBe(false);
    });
  });

  it('maps Select props and value events', async () => {
    let selectedValue = '';

    const { container } = render(
      <Select
        value="apple"
        loading
        showCheck
        checkPlacement="start"
        onValueChange={(value) => {
          selectedValue = value;
        }}
      >
        <Select.Option value="apple">Apple</Select.Option>
      </Select>
    );

    const host = container.querySelector('ui-select') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('apple');
      expect(host?.hasAttribute('loading')).toBe(true);
      expect(host?.hasAttribute('show-check')).toBe(true);
      expect(host?.getAttribute('check-placement')).toBe('start');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { value: 'banana' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(selectedValue).toBe('banana');
    });
  });

  it('maps NumberField props and detail events', async () => {
    let nextValue: number | null = null;
    let invalidReason = '';

    const { container } = render(
      <NumberField
        value={10}
        precision={2}
        allowWheel
        onValueChange={(detail) => {
          nextValue = detail.value;
        }}
        onInvalidValue={(reason) => {
          invalidReason = reason;
        }}
      />
    );

    const host = container.querySelector('ui-number-field') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('10');
      expect(host?.getAttribute('precision')).toBe('2');
      expect(host?.hasAttribute('allow-wheel')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('value-change', {
        detail: { value: 12, previousValue: 10, source: 'stepper' },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('invalid', {
        detail: { reason: 'bounds' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(nextValue).toBe(12);
      expect(invalidReason).toBe('bounds');
    });
  });

  it('maps PasswordField props and extended events', async () => {
    let revealed = false;
    let strengthScore = 0;

    const { container } = render(
      <PasswordField
        clearable
        showStrength
        revealable={false}
        debounce={150}
        onVisibilityChange={(next) => {
          revealed = next;
        }}
        onStrengthChange={(detail) => {
          strengthScore = detail.score;
        }}
      />
    );

    const host = container.querySelector('ui-password-field') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.hasAttribute('clearable')).toBe(true);
      expect(host?.hasAttribute('show-strength')).toBe(true);
      expect(host?.getAttribute('revealable')).toBe('false');
      expect(host?.getAttribute('debounce')).toBe('150');
    });

    fireEvent(
      host!,
      new CustomEvent('visibility-change', {
        detail: { revealed: true },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('strength-change', {
        detail: { value: 'secret', score: 4, label: 'Strong', caption: 'Great password' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(revealed).toBe(true);
      expect(strengthScore).toBe(4);
    });
  });

  it('maps Switch props and change detail', async () => {
    let currentChecked = false;

    const { container } = render(
      <Switch
        checked
        variant="contrast"
        onChange={(detail) => {
          currentChecked = detail.checked;
        }}
      />
    );

    const host = container.querySelector('ui-switch') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.hasAttribute('checked')).toBe(true);
      expect(host?.getAttribute('variant')).toBe('contrast');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { checked: false, value: 'off', name: 'notifications', required: false },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(currentChecked).toBe(false);
    });
  });

  it('maps RadioGroup props and value change detail', async () => {
    let changedValue = '';

    const { container } = render(
      <RadioGroup
        value="weekly"
        options={[{ value: 'weekly', label: 'Weekly' }, 'monthly']}
        variant="card"
        onValueChange={(detail) => {
          changedValue = detail.value;
        }}
      />
    );

    const host = container.querySelector('ui-radio-group') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('weekly');
      expect(host?.getAttribute('variant')).toBe('card');
      expect(host?.getAttribute('options')).toContain('weekly');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { value: 'monthly', reason: 'click', name: 'billing' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(changedValue).toBe('monthly');
    });
  });

  it('maps Slider props and slider detail events', async () => {
    let currentValue = 0;

    const { container } = render(
      <Slider
        value={20}
        min={0}
        max={100}
        showValue
        marks={[0, { value: 50, label: 'Mid' }]}
        onValueChange={(detail) => {
          currentValue = detail.value;
        }}
      />
    );

    const host = container.querySelector('ui-slider') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('20');
      expect(host?.getAttribute('min')).toBe('0');
      expect(host?.getAttribute('max')).toBe('100');
      expect(host?.getAttribute('show-value')).toBe('true');
      expect(host?.getAttribute('marks')).toContain('Mid');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: {
          value: 35,
          valueStart: 35,
          valueEnd: 35,
          range: false,
          min: 0,
          max: 100,
          step: 1,
          percent: 35,
          percentStart: 35,
          percentEnd: 35,
        },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(currentValue).toBe(35);
    });
  });

  it('maps TagsInput props and tag events', async () => {
    let values: string[] = [];
    let addedTag = '';

    const { container } = render(
      <TagsInput
        value={['alpha', 'beta']}
        maxTags={5}
        addOnBlur
        onChange={(next) => {
          values = next;
        }}
        onTagAdd={(detail) => {
          addedTag = detail.tag;
        }}
      />
    );

    const host = container.querySelector('ui-tags-input') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toContain('alpha');
      expect(host?.getAttribute('max-tags')).toBe('5');
      expect(host?.hasAttribute('add-on-blur')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { value: ['alpha', 'beta', 'gamma'] },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('tag-add', {
        detail: { tag: 'gamma', value: ['alpha', 'beta', 'gamma'] },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(values).toEqual(['alpha', 'beta', 'gamma']);
      expect(addedTag).toBe('gamma');
    });
  });

  it('maps PinInput props and completion events', async () => {
    let completedValue = '';

    const { container } = render(
      <PinInput
        value="12"
        length={4}
        mask
        placeholderChar="-"
        onComplete={(value) => {
          completedValue = value;
        }}
      />
    );

    const host = container.querySelector('ui-pin-input') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('12');
      expect(host?.getAttribute('length')).toBe('4');
      expect(host?.hasAttribute('mask')).toBe(true);
      expect(host?.getAttribute('placeholder-char')).toBe('-');
    });

    fireEvent(
      host!,
      new CustomEvent('complete', {
        detail: { value: '1234' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(completedValue).toBe('1234');
    });
  });

  it('maps Meter props and change detail', async () => {
    let meterPercent = 0;

    const { container } = render(
      <Meter
        value={40}
        min={0}
        max={100}
        showLabel
        precision={1}
        onValueChange={(detail) => {
          meterPercent = detail.percent;
        }}
      />
    );

    const host = container.querySelector('ui-meter') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('40');
      expect(host?.getAttribute('min')).toBe('0');
      expect(host?.getAttribute('max')).toBe('100');
      expect(host?.hasAttribute('show-label')).toBe(true);
      expect(host?.getAttribute('precision')).toBe('1');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: {
          value: 40,
          min: 0,
          max: 100,
          low: 20,
          high: 80,
          optimum: null,
          percent: 40,
          state: 'suboptimum',
        },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(meterPercent).toBe(40);
    });
  });

  it('maps Progress props and complete detail', async () => {
    let completedValue = 0;

    const { container } = render(
      <Progress
        value={60}
        buffer={80}
        animated
        onComplete={(detail) => {
          completedValue = detail.value;
        }}
      />
    );

    const host = container.querySelector('ui-progress') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('value')).toBe('60');
      expect(host?.getAttribute('buffer')).toBe('80');
      expect(host?.hasAttribute('animated')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('complete', {
        detail: { value: 100, max: 100 },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(completedValue).toBe(100);
    });
  });

  it('maps Toggle props and toggle detail events', async () => {
    let pressed = false;

    const { container } = render(
      <Toggle
        pressed
        iconOn="check"
        onChange={(detail) => {
          pressed = detail.pressed;
        }}
      />
    );

    const host = container.querySelector('ui-toggle') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.hasAttribute('pressed')).toBe(true);
      expect(host?.getAttribute('icon-on')).toBe('check');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { pressed: false, value: 'off', name: 'mode', required: false },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(pressed).toBe(false);
    });
  });

  it('maps Stepper props and selection events', async () => {
    let selectedValue = '';

    const { container } = render(
      <Stepper
        steps={[{ value: 'shipping', label: 'Shipping' }, { value: 'payment', label: 'Payment' }]}
        clickable
        onSelect={(detail) => {
          selectedValue = detail.value;
        }}
      />
    );

    const host = container.querySelector('ui-stepper') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('steps')).toContain('Shipping');
      expect(host?.hasAttribute('clickable')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('select', {
        detail: { index: 1, value: 'payment', label: 'Payment', trigger: 'click' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(selectedValue).toBe('payment');
    });
  });

  it('maps Badge props and remove detail', async () => {
    let removedText = '';

    const { container } = render(
      <Badge
        text="Beta"
        tone="info"
        removable
        maxWidth="120px"
        onRemove={(detail) => {
          removedText = detail.text;
        }}
      />
    );

    const host = container.querySelector('ui-badge') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('text')).toBe('Beta');
      expect(host?.getAttribute('tone')).toBe('info');
      expect(host?.hasAttribute('removable')).toBe(true);
      expect(host?.getAttribute('max-width')).toBe('120px');
    });

    fireEvent(
      host!,
      new CustomEvent('remove', {
        detail: { text: 'Beta', source: 'button' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(removedText).toBe('Beta');
    });
  });

  it('maps Avatar props and avatar events', async () => {
    let loadedSrc = '';

    const { container } = render(
      <Avatar
        src="/user.png"
        alt="Taylor Swift"
        status="online"
        ring
        onAvatarLoad={(detail) => {
          loadedSrc = detail.src;
        }}
      />
    );

    const host = container.querySelector('ui-avatar') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('src')).toBe('/user.png');
      expect(host?.getAttribute('alt')).toBe('Taylor Swift');
      expect(host?.getAttribute('status')).toBe('online');
      expect(host?.hasAttribute('ring')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('avatar-load', {
        detail: { src: '/user.png' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(loadedSrc).toBe('/user.png');
    });
  });

  it('maps AspectRatio props onto host attributes', async () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9} showRatioBadge interactive tone="success" />
    );

    const host = container.querySelector('ui-aspect-ratio') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('ratio')).toBe('16/9');
      expect(host?.hasAttribute('show-ratio-badge')).toBe(true);
      expect(host?.hasAttribute('interactive')).toBe(true);
      expect(host?.getAttribute('tone')).toBe('success');
    });
  });

  it('renders Anchor through the shared host ref path', async () => {
    const { container } = render(<Anchor id="anchor-test" />);

    const host = container.querySelector('ui-anchor') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('id')).toBe('anchor-test');
    });
  });

  it('maps Alert props and close event', async () => {
    let closed = false;

    const { container } = render(
      <Alert
        title="System notice"
        description="Scheduled maintenance"
        dismissible
        open={false}
        onClose={() => {
          closed = true;
        }}
      />
    );

    const host = container.querySelector('ui-alert') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('title')).toBe('System notice');
      expect(host?.getAttribute('description')).toBe('Scheduled maintenance');
      expect(host?.hasAttribute('dismissible')).toBe(true);
      expect(host?.hasAttribute('hidden')).toBe(true);
    });

    fireEvent(host!, new CustomEvent('close', { bubbles: true, composed: true }));

    await waitFor(() => {
      expect(closed).toBe(true);
    });
  });

  it('maps EmptyState props and action event', async () => {
    let actionTriggered = false;

    const { container } = render(
      <EmptyState
        title="No Results"
        actionLabel="Try again"
        compact
        onAction={() => {
          actionTriggered = true;
        }}
      />
    );

    const host = container.querySelector('ui-empty-state') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('title')).toBe('No Results');
      expect(host?.getAttribute('action-label')).toBe('Try again');
      expect(host?.hasAttribute('compact')).toBe(true);
    });

    fireEvent(host!, new CustomEvent('action', { bubbles: true, composed: true }));

    await waitFor(() => {
      expect(actionTriggered).toBe(true);
    });
  });

  it('maps Field props onto host attributes', async () => {
    const { container } = render(
      <Field
        label="Email"
        description="Used for receipts"
        error="Required"
        htmlFor="email"
        required
        invalid
        orientation="horizontal"
        variant="soft"
        tone="warning"
        density="compact"
        shape="soft"
        shell="filled"
        labelWidth="12rem"
        headless
      />
    );

    const host = container.querySelector('ui-field') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('label')).toBe('Email');
      expect(host?.getAttribute('description')).toBe('Used for receipts');
      expect(host?.getAttribute('error')).toBe('Required');
      expect(host?.getAttribute('for')).toBe('email');
      expect(host?.hasAttribute('required')).toBe(true);
      expect(host?.hasAttribute('invalid')).toBe(true);
      expect(host?.getAttribute('orientation')).toBe('horizontal');
      expect(host?.getAttribute('variant')).toBe('soft');
      expect(host?.getAttribute('tone')).toBe('warning');
      expect(host?.getAttribute('density')).toBe('compact');
      expect(host?.getAttribute('shape')).toBe('soft');
      expect(host?.getAttribute('shell')).toBe('filled');
      expect(host?.getAttribute('label-width')).toBe('12rem');
      expect(host?.hasAttribute('headless')).toBe(true);
    });
  });

  it('maps Section props onto host attributes', async () => {
    const { container } = render(
      <Section variant="elevated" tone="brand" inset />
    );

    const host = container.querySelector('ui-section') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('variant')).toBe('elevated');
      expect(host?.getAttribute('tone')).toBe('brand');
      expect(host?.hasAttribute('inset')).toBe(true);
    });
  });

  it('maps Icon props onto host attributes', async () => {
    const { container } = render(
      <Icon
        name="sparkles"
        iconVariant="solid"
        rotate={90}
        decorative
        strokeWidth={1.5}
      />
    );

    const host = container.querySelector('ui-icon') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('name')).toBe('sparkles');
      expect(host?.getAttribute('icon-variant')).toBe('solid');
      expect(host?.getAttribute('rotate')).toBe('90');
      expect(host?.hasAttribute('decorative')).toBe(true);
      expect(host?.getAttribute('stroke-width')).toBe('1.5');
    });
  });

  it('maps Label props onto host attributes', async () => {
    const { container } = render(
      <Label htmlFor="email" required description="Work email" tone="brand" />
    );

    const host = container.querySelector('ui-label') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('for')).toBe('email');
      expect(host?.hasAttribute('required')).toBe(true);
      expect(host?.getAttribute('description')).toBe('Work email');
      expect(host?.getAttribute('tone')).toBe('brand');
    });
  });

  it('maps Skeleton props onto host attributes', async () => {
    const { container } = render(
      <Skeleton count={3} animation="none" width="10rem" animated />
    );

    const host = container.querySelector('ui-skeleton') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('count')).toBe('3');
      expect(host?.getAttribute('animation')).toBe('none');
      expect(host?.getAttribute('width')).toBe('10rem');
      expect(host?.hasAttribute('animated')).toBe(true);
    });
  });

  it('maps Breadcrumb props and select events', async () => {
    let selectedLabel = '';

    const { container } = render(
      <Breadcrumb separator=">" maxItems={4} onSelect={(detail) => {
        selectedLabel = detail.label;
      }}>
        <Breadcrumb.Item label="Home" />
      </Breadcrumb>
    );

    const host = container.querySelector('ui-breadcrumb') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('separator')).toBe('>');
      expect(host?.getAttribute('max-items')).toBe('4');
    });

    fireEvent(
      host!,
      new CustomEvent('ui-select', {
        detail: { index: 1, label: 'Settings', href: '/settings', source: 'click' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(selectedLabel).toBe('Settings');
    });
  });

  it('maps Collapsible props, CSS radius, and toggle events', async () => {
    let openState = false;

    const { container } = render(
      <Collapsible
        open
        radius="lg"
        closeOnEscape={false}
        onToggle={(open) => {
          openState = open;
        }}
      />
    );

    const host = container.querySelector('ui-collapsible') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.hasAttribute('open')).toBe(true);
      expect(host?.getAttribute('close-on-escape')).toBe('false');
      expect(host?.style.getPropertyValue('--ui-collapsible-radius')).toBe('20px');
    });

    fireEvent(
      host!,
      new CustomEvent('toggle', {
        detail: { open: false, previousOpen: true, source: 'pointer' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(openState).toBe(false);
    });
  });

  it('maps QuickActions props and quick action events', async () => {
    let selectedId = '';
    let changedOpen: boolean | null = null;
    let toggledOpen: boolean | null = null;

    const { container } = render(
      <QuickActions
        open
        mode="fab"
        orientation="vertical"
        variant="contrast"
        floating
        placement="top-left"
        collapsible
        label="Shortcuts"
        headless
        onSelect={(detail) => {
          selectedId = detail.id;
        }}
        onOpenChange={(open) => {
          changedOpen = open;
        }}
        onToggle={(open) => {
          toggledOpen = open;
        }}
      />
    );

    const host = container.querySelector('ui-quick-actions') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.hasAttribute('open')).toBe(true);
      expect(host?.getAttribute('mode')).toBe('fab');
      expect(host?.getAttribute('orientation')).toBe('vertical');
      expect(host?.getAttribute('variant')).toBe('contrast');
      expect(host?.hasAttribute('floating')).toBe(true);
      expect(host?.getAttribute('placement')).toBe('top-left');
      expect(host?.hasAttribute('collapsible')).toBe(true);
      expect(host?.getAttribute('label')).toBe('Shortcuts');
      expect(host?.hasAttribute('headless')).toBe(true);
    });

    fireEvent(
      host!,
      new CustomEvent('select', {
        detail: { index: 1, id: 'share', label: 'Share' },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { open: false },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('toggle', {
        detail: { open: true },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(selectedId).toBe('share');
      expect(changedOpen).toBe(false);
      expect(toggledOpen).toBe(true);
    });
  });

  it('maps Menubar props and menubar events', async () => {
    let changedSelected = -1;
    let openedSelected = -1;
    let closed = false;
    let selectedLabel = '';

    const { container } = render(
      <Menubar
        selected={2}
        open
        loop={false}
        headless
        orientation="vertical"
        placement="left"
        variant="contrast"
        size="lg"
        density="compact"
        radius="12px"
        shape="soft"
        elevation="high"
        tone="warning"
        closeOnSelect={false}
        typeahead={false}
        onChange={(detail) => {
          changedSelected = detail.selected;
        }}
        onOpen={(selected) => {
          openedSelected = selected;
        }}
        onClose={() => {
          closed = true;
        }}
        onSelect={(detail) => {
          selectedLabel = detail.label ?? '';
        }}
      />
    );

    const host = container.querySelector('ui-menubar') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.getAttribute('selected')).toBe('2');
      expect(host?.hasAttribute('open')).toBe(true);
      expect(host?.getAttribute('loop')).toBe('false');
      expect(host?.hasAttribute('headless')).toBe(true);
      expect(host?.getAttribute('orientation')).toBe('vertical');
      expect(host?.getAttribute('placement')).toBe('left');
      expect(host?.getAttribute('variant')).toBe('contrast');
      expect(host?.getAttribute('size')).toBe('lg');
      expect(host?.getAttribute('density')).toBe('compact');
      expect(host?.getAttribute('radius')).toBe('12px');
      expect(host?.getAttribute('shape')).toBe('soft');
      expect(host?.getAttribute('elevation')).toBe('high');
      expect(host?.getAttribute('tone')).toBe('warning');
      expect(host?.getAttribute('close-on-select')).toBe('false');
      expect(host?.getAttribute('typeahead')).toBe('false');
    });

    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { selected: 1, previous: 2, open: true, reason: 'keyboard' },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(
      host!,
      new CustomEvent('open', {
        detail: { selected: 1 },
        bubbles: true,
        composed: true,
      })
    );

    fireEvent(host!, new CustomEvent('close', { bubbles: true, composed: true }));

    fireEvent(
      host!,
      new CustomEvent('select', {
        detail: { selected: 1, index: 1, value: 'settings', label: 'Settings' },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(changedSelected).toBe(1);
      expect(openedSelected).toBe(1);
      expect(closed).toBe(true);
      expect(selectedLabel).toBe('Settings');
    });
  });

  it('maps HoverCard props and hover card events', async () => {
    let opened = false;
    let closed = false;
    let changedOpen: boolean | null = null;

    const { container } = render(
      <HoverCard
        open
        delay={150}
        closeDelay={250}
        placement="left"
        offset={12}
        variant="glass"
        tone="warning"
        density="compact"
        shape="soft"
        elevation="high"
        headless
        onOpen={() => {
          opened = true;
        }}
        onClose={() => {
          closed = true;
        }}
        onChange={(open) => {
          changedOpen = open;
        }}
      />
    );

    const host = container.querySelector('ui-hover-card') as HTMLElement | null;

    await waitFor(() => {
      expect(host?.hasAttribute('open')).toBe(true);
      expect(host?.getAttribute('delay')).toBe('150');
      expect(host?.getAttribute('close-delay')).toBe('250');
      expect(host?.getAttribute('placement')).toBe('left');
      expect(host?.getAttribute('offset')).toBe('12');
      expect(host?.getAttribute('variant')).toBe('glass');
      expect(host?.getAttribute('tone')).toBe('warning');
      expect(host?.getAttribute('density')).toBe('compact');
      expect(host?.getAttribute('shape')).toBe('soft');
      expect(host?.getAttribute('elevation')).toBe('high');
      expect(host?.hasAttribute('headless')).toBe(true);
    });

    fireEvent(host!, new CustomEvent('open', { bubbles: true, composed: true }));
    fireEvent(host!, new CustomEvent('close', { bubbles: true, composed: true }));
    fireEvent(
      host!,
      new CustomEvent('change', {
        detail: { open: false },
        bubbles: true,
        composed: true,
      })
    );

    await waitFor(() => {
      expect(opened).toBe(true);
      expect(closed).toBe(true);
      expect(changedOpen).toBe(false);
    });
  });
});
