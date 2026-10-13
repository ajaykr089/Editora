import { DataTable, Pagination } from '@editora/ui-react';
import { useState } from 'react';

export default function UsersTable() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <DataTable
        sortable
        selectable
        resizableColumns
        draggableColumns
        page={page}
        pageSize={2}
        paginationId="users-pager"
        onPageChange={(d) => setPage(d.page)}
        onSortChange={(d) => console.log('sort', d)}
        onRowSelect={(d) => console.log('rows', d.indices)}
      >
        <table>
          <thead>
            <tr>
              <th data-key="id">ID</th>
              <th data-key="name">Name</th>
              <th data-key="role">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Asha</td><td>Admin</td></tr>
            <tr><td>2</td><td>Marco</td><td>Editor</td></tr>
            <tr><td>3</td><td>Lena</td><td>Viewer</td></tr>
            <tr><td>4</td><td>Tariq</td><td>Editor</td></tr>
          </tbody>
        </table>
      </DataTable>

      <Pagination id="users-pager" page={page} />
    </div>
  );
}
