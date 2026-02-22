import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, EmptyState, Flex } from '@editora/ui-react';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100dvh', padding: 16 }}>
      <Box style={{ width: 'min(460px, 100%)' }}>
        <EmptyState title="Access denied" description="Your role does not have permission for this module.">
          <Button slot="action" onClick={() => navigate('/dashboard')}>Back to dashboard</Button>
        </EmptyState>
      </Box>
    </Flex>
  );
}
