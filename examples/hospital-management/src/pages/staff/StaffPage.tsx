import React from 'react';
import { Box, Button, DataViewToolbar, Drawer, Grid, Stat } from '@editora/ui-react';
import { EntityDataTable, StatusPill } from '@/shared/components/EntityDataTable';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorStateView, TableSkeleton } from '@/shared/components/StateViews';
import { useStaffQuery } from '@/shared/query/hooks';
import { Role, StaffMember } from '@/shared/types/domain';

const pageSize = 10;

export default function StaffPage() {
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [department, setDepartment] = React.useState('all');
  const [selectedStaff, setSelectedStaff] = React.useState<StaffMember | null>(null);

  const query = useStaffQuery({
    page,
    pageSize,
    search,
    department: department === 'all' ? undefined : department
  });

  const roster = query.data?.items || [];
  const activeCount = roster.filter((member) => member.status === 'active').length;
  const onLeaveCount = roster.filter((member) => member.status === 'leave').length;
  const doctorCount = roster.filter((member) => member.role === 'doctor').length;

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <PageHeader
        title="Doctor & Staff Management"
        subtitle="Staff roster, shifts, and role-based permission matrix."
      />

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        <Stat variant="card" tone="success" label="Active on shift" value={String(activeCount)} description="Currently available staff in this filtered roster." />
        <Stat variant="card" tone="warning" label="On leave" value={String(onLeaveCount)} description="Staff members currently marked away from duty." />
        <Stat variant="card" tone="info" label="Doctors in view" value={String(doctorCount)} description="Physicians available for rounds, consults, and admissions." />
      </Grid>

      <DataViewToolbar
        title="Roster controls"
        description="Search staff records, focus by department, and inspect role coverage."
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onClear={() => {
          setSearch('');
          setDepartment('all');
          setPage(1);
        }}
        searchPlaceholder="Search by staff name or department"
        status={department}
        statusOptions={[
          { value: 'all', label: 'All departments' },
          { value: 'Cardiology', label: 'Cardiology' },
          { value: 'Orthopedics', label: 'Orthopedics' },
          { value: 'Pediatrics', label: 'Pediatrics' },
          { value: 'Neurology', label: 'Neurology' },
          { value: 'Laboratory', label: 'Laboratory' },
          { value: 'Accounts', label: 'Accounts' }
        ]}
        onStatusChange={(value) => {
          setDepartment(value);
          setPage(1);
        }}
        totalCount={query.data?.total}
        itemLabel="staff member"
        actions={<Button size="sm" variant="secondary" onClick={() => query.refetch()}>Refresh roster</Button>}
      />

      {query.isLoading ? <TableSkeleton /> : null}
      {query.isError ? <ErrorStateView description={(query.error as Error)?.message} onRetry={() => query.refetch()} /> : null}

      {query.data ? (
        <EntityDataTable<StaffMember>
          rows={query.data.items}
          columns={[
            { key: 'name', label: 'Name', render: (row) => row.name },
            { key: 'role', label: 'Role', render: (row) => <StatusPill value={row.role} /> },
            { key: 'department', label: 'Department', render: (row) => row.department },
            { key: 'shift', label: 'Shift', render: (row) => row.shift },
            { key: 'status', label: 'Availability', render: (row) => <StatusPill value={row.status} /> },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <Button size="sm" variant="ghost" onClick={() => setSelectedStaff(row)}>
                  View profile
                </Button>
              )
            }
          ]}
          page={page}
          pageSize={pageSize}
          total={query.data.total}
          paginationId="staff-pagination"
          onPageChange={setPage}
        />
      ) : null}

      {query.data?.permissions ? (
        <Box variant="surface" p="12px" radius="lg" style={{ border: '1px solid var(--ui-color-border, #dbe4ef)', overflowX: 'auto' }}>
          <Box style={{ fontWeight: 700, marginBottom: 8 }}>RBAC permissions matrix</Box>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e2e8f0' }}>Role</th>
                {Object.keys(query.data.permissions.admin).map((module) => (
                  <th key={module} style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e2e8f0' }}>
                    {module}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(query.data.permissions) as Role[]).map((role) => (
                <tr key={role}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f1f5f9', fontWeight: 600 }}>{role}</td>
                  {Object.values(query.data.permissions[role]).map((perm, idx) => (
                    <td key={`${role}-${idx}`} style={{ padding: 8, borderBottom: '1px solid #f1f5f9' }}>
                      <StatusPill value={String(perm)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      ) : null}

      <Drawer
        open={!!selectedStaff}
        title={selectedStaff ? selectedStaff.name : 'Staff profile'}
        description={selectedStaff ? `${selectedStaff.role} • ${selectedStaff.department}` : ''}
        side="right"
        size="sm"
        dismissible
        showClose
        closeOnOverlay
        onChange={(open) => {
          if (!open) setSelectedStaff(null);
        }}
      >
        {selectedStaff ? (
          <Grid style={{ display: 'grid', gap: 10, padding: 12 }}>
            <Stat variant="card" tone="info" label="Shift" value={selectedStaff.shift} description="Assigned coverage block for this staff member." />
            <Stat variant="card" tone={selectedStaff.status === 'active' ? 'success' : 'warning'} label="Availability" value={selectedStaff.status} description="Pulled from the roster status board." />
            <Stat variant="card" tone="brand" label="Department" value={selectedStaff.department} description="Routing, permissions, and assignment scope follow this unit." />
          </Grid>
        ) : null}
      </Drawer>
    </Grid>
  );
}
