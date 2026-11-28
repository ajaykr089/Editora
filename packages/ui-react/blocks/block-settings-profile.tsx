// block: A profile settings page: avatar, fields, a time zone, a preference switch and account details.
import * as React from 'react';
import { Avatar, Badge, Box, Button, Card, DataList, Flex, Heading, Input, NativeSelect, Switch, Text, Textarea } from '@editora/ui-react';

export type ProfileValues = { name: string; email: string; bio: string; timezone: string; newsletter: boolean };

export type SettingsProfileBlockProps = {
  defaultValues?: Partial<ProfileValues>;
  onSave?: (values: ProfileValues) => void | Promise<void>;
};

/** A profile settings page: avatar, editable fields, a preference switch and the account details. */
export function SettingsProfileBlock({ defaultValues = {}, onSave }: SettingsProfileBlockProps) {
  const [saving, setSaving] = React.useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaving(true);
    try {
      await onSave?.({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        bio: String(data.get('bio') || ''),
        timezone: String(data.get('timezone') || ''),
        newsletter: data.get('newsletter') != null,
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <Box style={{ display: 'grid', gap: 24, maxWidth: 720, padding: 16 }}>
      <header>
        <Heading level={1} size="2xl">Profile</Heading>
        <Text variant="muted">How others see you, and how we reach you.</Text>
      </header>
      <Card>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <Flex style={{ gap: 14, alignItems: 'center' }}>
            <Avatar initials={(defaultValues.name || 'You').slice(0, 2).toUpperCase()} size="lg" />
            <Button type="button" variant="secondary" size="sm">Change photo</Button>
          </Flex>
          <Box style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <Input name="name" label="Name" value={defaultValues.name} autoComplete="name" required />
            <Input name="email" type="email" label="Email" value={defaultValues.email} autoComplete="email" required />
          </Box>
          <Textarea name="bio" label="Bio" description="A sentence or two, shown on your profile." value={defaultValues.bio} rows={3} />
          <label htmlFor="timezone" style={{ fontSize: 'var(--ui-font-size-sm, 13px)', fontWeight: 500 }}>Time zone</label>
          <NativeSelect>
            <select id="timezone" name="timezone" defaultValue={defaultValues.timezone || 'Asia/Kolkata'}>
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="America/New_York">New York (ET)</option>
            </select>
          </NativeSelect>
          <Switch name="newsletter" checked={defaultValues.newsletter} label="Send me product updates" />
          <Flex style={{ justifyContent: 'flex-end', gap: 8 }}>
            <Button type="reset" variant="ghost">Cancel</Button>
            <Button type="submit" loading={saving}>Save changes</Button>
          </Flex>
        </form>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title as="h2">Account</Card.Title>
        </Card.Header>
        <DataList divided>
          <DataList.Item>
            <DataList.Label>Plan</DataList.Label>
            <DataList.Value><Badge tone="brand">Pro</Badge></DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>Member since</DataList.Label>
            <DataList.Value>March 2024</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label>User ID</DataList.Label>
            <DataList.Value><code>u_2J89JSA4GJ</code></DataList.Value>
          </DataList.Item>
        </DataList>
      </Card>
    </Box>
  );
}

export default SettingsProfileBlock;
