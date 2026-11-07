import React from 'react';
import { createRoot } from 'react-dom/client';
import { Card } from '@editora/ui-react/Card';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { Button } from '@editora/ui-react/Button';
createRoot(document.getElementById('root')!).render(<>
  <Card id="c1"><Card.Header><Card.Title>Expenses</Card.Title><Card.Description>This month, all accounts</Card.Description><Card.Actions><Button size="sm" variant="secondary">Export</Button><Button size="sm">Add</Button></Card.Actions></Card.Header><p>Body</p></Card>
  <br />
  <Card id="c2"><Card.Header><Card.Title>Receipts</Card.Title></Card.Header><EmptyState id="e1" variant="plain" title="No receipts yet" description="Upload one to get started." /></Card>
  <br />
  <Card id="c3"><Card.Header><Card.Title>Default empty state (boxed)</Card.Title></Card.Header><EmptyState title="No receipts yet" description="Upload one to get started." /></Card>
</>);
