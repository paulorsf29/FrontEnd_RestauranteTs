import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Verifique o caminho
import './index.css';
import './styles/globals.css';
import './pages/Home/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);