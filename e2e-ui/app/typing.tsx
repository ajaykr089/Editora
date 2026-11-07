import React from 'react';
import { createRoot } from 'react-dom/client';
import { Input } from '@editora/ui-react/Input';
import { Textarea } from '@editora/ui-react/Textarea';
const w = window as any; w.commits = [];
function App() {
  const [a, setA] = React.useState('');
  const [b, setB] = React.useState('');
  const [c, setC] = React.useState('');
  w.state = { a, b, c };
  return (<>
    <Input id="a" label="Plain" value={a} onChange={setA} onCommit={(v) => w.commits.push(v)} />
    <Input id="b" label="Upper, max 8" value={b} onChange={(v) => setB(v.toUpperCase().slice(0, 8))} />
    <Textarea id="c" label="Notes" value={c} onChange={setC} />
    <Input id="d" label="Uncontrolled" defaultValue="start" />
  </>);
}
createRoot(document.getElementById('root')!).render(<App />);
