import React, { useState } from 'react';
import { Presence, Button , Box, Grid} from '@editora/ui-react';

export default {
  title: 'UI/Presence',
  component: Presence,
  argTypes: { present: { control: 'boolean' } }
};

export const Toggle = (args: any) => {
  const [present, setPresent] = useState(!!args.present);

  return (
    <Grid style={{ display: 'grid', gap: 12 }}>
      <Button size="sm" onClick={() => setPresent((v) => !v)}>
        {present ? 'Hide' : 'Show'} card
      </Button>
      <Presence present={present}>
        <Box style={{ padding: 16, borderRadius: 12, border: '1px solid #bfdbfe', background: '#eff6ff' }}>
          Presence-aware content with enter/exit transitions.
        </Box>
      </Presence>
    </Grid>
  );
};
Toggle.args = { present: true };
