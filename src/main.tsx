import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <App />
        </LocalizationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
