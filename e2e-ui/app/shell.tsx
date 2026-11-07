import React from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '@editora/ui-react/Layout';
import { AppHeader } from '@editora/ui-react/AppHeader';
import { Sidebar } from '@editora/ui-react/Sidebar';
import { Card } from '@editora/ui-react/Card';
const w = window as any; w.log = [];
function App() {
  return (
    <Layout id="layout" variant="shell" onSidebarOpenChange={(open, d) => w.log.push([open, d.source])} sidebarOpen={w.forceOpen}>
      <AppHeader slot="header" id="hdr" bordered showMenuButton="narrow"><AppHeader.Title>PettyFlow</AppHeader.Title></AppHeader>
      <Sidebar slot="sidebar" id="side" navigation="client" onNavigate={(d) => d.preventDefault()}>
        <Sidebar.Item value="home" label="Home" href="/home" />
        <Sidebar.Item value="reports" label="Reports" href="/reports" />
      </Sidebar>
      <div slot="content" id="content">
        <Card><Card.Header><Card.Title>Overview</Card.Title></Card.Header><p>Body</p></Card>
        <button id="inContent">In content</button>
        <div style={{ height: 2000 }}>tall</div>
      </div>
    </Layout>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
