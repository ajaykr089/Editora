import React from 'react';
import { createRoot } from 'react-dom/client';
import { Layout } from '@editora/ui-react/Layout';
import { Sidebar } from '@editora/ui-react/Sidebar';

// A shell whose sidebar fills its 260px column exactly: the panel's 1px divider used to leave
// the sidebar a pixel too wide, so the column scrolled sideways.
function App() {
  return (
    <Layout id="layout" variant="shell" sidebarWidth="260px">
      <Sidebar slot="sidebar" id="side" width="260px">
        <Sidebar.Item value="home" label="Home" />
        <Sidebar.Item value="reports" label="Reports" />
      </Sidebar>
      <div slot="content">Content</div>
    </Layout>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
