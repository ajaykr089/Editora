import { DatePicker, DateRangePicker, DateTimePicker, ColorPicker } from '@editora/ui-react';

export default function PickersDemo() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <DatePicker label="Start date" clearable onValueChange={(v) => console.log(v)} />
      <DateRangePicker label="Window" closeOnSelect />
      <DateTimePicker label="Publish at" />
      <ColorPicker mode="popover" format="hex" alpha presets={['#2563eb', '#16a34a', '#dc2626']} />
    </div>
  );
}
