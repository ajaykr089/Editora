import { Alert, Avatar, Badge, Button, Checkbox, DatePicker, Input, Progress, Switch } from '@editora/ui-react';

export default function Gallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <Input label="Project name" description="Shown in the sidebar" placeholder="Untitled" clearable />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="danger">Delete</Button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge tone="success" text="Live" />
          <Badge tone="warning" text="Review" />
          <Badge tone="danger" text="Failed" />
          <Avatar initials="AM" />
          <Avatar initials="JK" />
        </div>

        <Alert title="Heads up" description="Your trial ends in 3 days." tone="warning" />
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        <Switch checked label="Email notifications" description="A summary every Monday" />
        <Checkbox checked>Remember me</Checkbox>
        <Progress value={64} />
        <DatePicker label="Start date" clearable />
      </div>
    </div>
  );
}
