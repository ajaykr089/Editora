import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, EmptyState, Flex } from '@editora/ui-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Flex align="center" justify="center" style={{ minHeight: '100dvh', padding: 16 }}>
      <Box style={{ width: 'min(460px, 100%)' }}>
        <EmptyState title="Page not found" description="The route does not exist in this module.">
          <Button slot="action" onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
        </EmptyState>
      </Box>
    </Flex>
  );
}
