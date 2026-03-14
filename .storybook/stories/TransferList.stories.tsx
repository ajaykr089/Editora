import React from 'react';
import { Box, TransferList } from '@editora/ui-react';

export default {
  title: 'UI/TransferList',
  component: TransferList
};

export const RoleMapping = () => {
  const [value, setValue] = React.useState<string[]>(['read']);
  return (
    <Box style={{ maxWidth: 860 }}>
      <TransferList
        label="Workspace permissions"
        description="Move permissions into the selected column to grant them."
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'read', label: 'Read', description: 'View records and reports.' },
          { value: 'write', label: 'Write', description: 'Create and edit content.' },
          { value: 'export', label: 'Export', description: 'Download audit and CSV exports.' },
          { value: 'admin', label: 'Admin', description: 'Manage workspace configuration.' }
        ]}
      />
    </Box>
  );
};
