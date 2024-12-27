import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from "./authcontext/AuthContext";

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <AuthContextProvider> {/* Wrap your app with AuthContextProvider */}
        <App />
      </AuthContextProvider>
    </StrictMode>
  </BrowserRouter>
);
