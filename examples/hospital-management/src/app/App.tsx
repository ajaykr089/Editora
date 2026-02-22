import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/routes/AppRouter';

export function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
