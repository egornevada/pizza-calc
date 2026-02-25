import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import 'folder-ds/folder-ds.css';

import App from './App';

declare global {
  interface Window {
    Telegram?: { WebApp?: any }
  }
}

const tg = window.Telegram?.WebApp;
try {
  if (tg) {
    tg.ready();
    tg.expand();

    const applyTheme = () => {
      const p = tg.themeParams || {};
      document.documentElement.style.setProperty('--tg-bg', p.bg_color || '#F3F4F6');
      document.documentElement.style.setProperty('--tg-text', p.text_color || '#1F2937');
    };
    applyTheme();
    tg.onEvent?.('themeChanged', applyTheme);
  }
} catch (e) {
  console.error('TG init error:', e);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </MemoryRouter>
  </React.StrictMode>
);
