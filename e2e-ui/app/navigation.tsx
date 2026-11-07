import React from 'react';
import { createRoot } from 'react-dom/client';
import { NavigationProvider } from '@editora/ui-react/NavigationProvider';
import { Sidebar } from '@editora/ui-react/Sidebar';
import { Breadcrumb } from '@editora/ui-react/Breadcrumb';
import { Tabs } from '@editora/ui-react/Tabs';
import { Pagination } from '@editora/ui-react/Pagination';

const w = window as any;
w.routed = [] as string[];

function App() {
  return (
    <NavigationProvider navigate={(href) => w.routed.push(href)}>
      <Breadcrumb id="crumbs">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/expenses">Expenses</Breadcrumb.Item>
        <Breadcrumb.Item>March</Breadcrumb.Item>
      </Breadcrumb>
      <Sidebar id="side" items={[{ value: 'reports', label: 'Reports', href: '/reports' }]} />
      <Tabs id="tabs" activation="manual">
        <Tabs.Tab href="/overview">Overview</Tabs.Tab><Tabs.Tab href="/history">History</Tabs.Tab>
        <Tabs.Panel>o</Tabs.Panel><Tabs.Panel>h</Tabs.Panel>
      </Tabs>
      <Pagination id="pager" page={1} count={5} hrefTemplate="/expenses?page={page}" />
    </NavigationProvider>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
