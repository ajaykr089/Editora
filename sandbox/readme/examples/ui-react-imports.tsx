// Everything from the package root: the simplest, and the heaviest.
import { Button, Input } from '@editora/ui-react';
// One component per entry: a lighter first load.
import ButtonOnly from '@editora/ui-react/Button';
import InputOnly from '@editora/ui-react/Input';

export default function Imports() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <Input label="From the root" />
      <InputOnly label="From its own entry" />
      <Button>Root</Button>
      <ButtonOnly>Own entry</ButtonOnly>
    </div>
  );
}
