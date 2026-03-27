import React from 'react';
import { Box, Button, DialogProvider, Flex, useDialog } from '@editora/ui-react';

export default {
  title: 'UI/DialogPromise'
};

function Demo() {
  const dialog = useDialog();
  const [result, setResult] = React.useState('No result yet');

  const runConfirm = async () => {
    const next = await dialog.confirm({
      title: 'Publish release notes?',
      description: 'This opens a production-grade promise dialog for confirm/cancel flows.',
      submitText: 'Publish',
      cancelText: 'Review again',
      onSubmit: async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    });
    setResult(JSON.stringify(next));
  };

  const runQueue = async () => {
    const first = await dialog.open({
      title: 'Step 1',
      description: 'First queued dialog',
      mode: 'queue'
    });
    const second = await dialog.open({
      title: 'Step 2',
      description: 'Second queued dialog',
      mode: 'queue'
    });
    setResult(`${JSON.stringify(first)} | ${JSON.stringify(second)}`);
  };

  return (
    <Box>
      <Flex gap="10px" wrap="wrap">
        <Button onClick={runConfirm}>Run Confirm</Button>
        <Button variant="secondary" onClick={runQueue}>Run Queue</Button>
      </Flex>
      <Box mt="14px">Result: {result}</Box>
    </Box>
  );
}

export const PromiseAPI = () => (
  <DialogProvider>
    <Demo />
  </DialogProvider>
);
