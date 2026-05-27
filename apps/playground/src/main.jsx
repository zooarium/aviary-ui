import '@tabler/core/dist/css/tabler.min.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configure } from '@aviary-ui/core';
import App from './App.jsx';

// Playground uses no real API — configure with dummy values to silence warnings.
configure({ apiBase: 'http://localhost:8081', authBase: 'http://localhost:8080' });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
