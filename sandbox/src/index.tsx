import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import '@editora/plugins/styles.css';
import '@editora/toast/toast.css';
import '@editora/light-code-editor/light-code-editor.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
