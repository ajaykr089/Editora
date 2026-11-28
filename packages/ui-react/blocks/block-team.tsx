// block: A team members page: invite by email with a role, the member list with roles, and removal.
import * as React from 'react';
import { Avatar, Box, Button, Card, Flex, Heading, Input, Item, ItemGroup, NativeSelect, Text } from '@editora/ui-react';

export type TeamRole = 'owner' | 'admin' | 'member' | 'viewer';
export type TeamMember = { id: string; name: string; email: string; role: TeamRole };

export type TeamBlockProps = {
  members?: TeamMember[];
  onInvite?: (email: string, role: TeamRole) => void | Promise<void>;
  onRoleChange?: (member: TeamMember, role: TeamRole) => void;
  onRemove?: (member: TeamMember) => void;
};

const ROLES: TeamRole[] = ['admin', 'member', 'viewer'];
const SAMPLE: TeamMember[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', role: 'owner' },
  { id: '2', name: 'Alan Turing', email: 'alan@example.com', role: 'admin' },
  { id: '3', name: 'Grace Hopper', email: 'grace@example.com', role: 'member' },
];

const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

/** Invite people and manage their roles. */
export function TeamBlock({ members: initial = SAMPLE, onInvite, onRoleChange, onRemove }: TeamBlockProps) {
  const [members, setMembers] = React.useState(initial);
  const [pending, setPending] = React.useState(false);
  const invite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const role = String(data.get('role') || 'member') as TeamRole;
    if (!email) return;
    setPending(true);
    try {
      await onInvite?.(email, role);
      setMembers((list) => [...list, { id: `${Date.now()}`, name: email.split('@')[0], email, role }]);
      form.reset();
    } finally {
      setPending(false);
    }
  };
  return (
    <Card style={{ display: 'grid', gap: 20, maxWidth: 720 }}>
      <Card.Header>
        <Heading level={2} size="lg">Team members</Heading>
        <Text variant="muted">Invite people and choose what they can do.</Text>
      </Card.Header>
      <form onSubmit={invite} style={{ display: 'flex', gap: 8, alignItems: 'end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px' }}><Input name="email" type="email" label="Email address" required placeholder="name@example.com" /></div>
        <div style={{ display: 'grid', gap: 4 }}>
          <label htmlFor="invite-role" style={{ fontSize: 'var(--ui-font-size-sm, 13px)', fontWeight: 500 }}>Role</label>
          <NativeSelect>
            <select id="invite-role" name="role" defaultValue="member">
              {ROLES.map((role) => <option key={role} value={role}>{role[0].toUpperCase() + role.slice(1)}</option>)}
            </select>
          </NativeSelect>
        </div>
        <Button type="submit" loading={pending}>Invite</Button>
      </form>
      <ItemGroup aria-label="Members">
        {members.map((member) => (
          <Item key={member.id} label={member.name} description={member.email}>
            <Avatar slot="media" initials={initials(member.name)} />
            <Flex slot="actions" style={{ gap: 8, alignItems: 'center' }}>
              {member.role === 'owner' ? (
                <Text size="sm" variant="muted">Owner</Text>
              ) : (
                <>
                  <NativeSelect>
                    <select
                      aria-label={`Role for ${member.name}`}
                      value={member.role}
                      onChange={(event) => {
                        const role = event.target.value as TeamRole;
                        setMembers((list) => list.map((m) => (m.id === member.id ? { ...m, role } : m)));
                        onRoleChange?.(member, role);
                      }}
                    >
                      {ROLES.map((role) => <option key={role} value={role}>{role[0].toUpperCase() + role.slice(1)}</option>)}
                    </select>
                  </NativeSelect>
                  <Button size="sm" variant="ghost" aria-label={`Remove ${member.name}`} onClick={() => { setMembers((list) => list.filter((m) => m.id !== member.id)); onRemove?.(member); }}>Remove</Button>
                </>
              )}
            </Flex>
          </Item>
        ))}
      </ItemGroup>
      <Box><Text size="sm" variant="muted">{members.length} {members.length === 1 ? 'member' : 'members'}</Text></Box>
    </Card>
  );
}

export default TeamBlock;
