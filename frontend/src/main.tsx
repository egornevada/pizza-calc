import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import './index.css';
import './theme/material-theme.css';
import { createThemeFromCssVars } from './theme/applyTheme';

import App from './App';

// Типы для window.Telegram
declare global {
  interface Window {
    Telegram?: { WebApp?: any }
  }
}

// Инициализация Telegram WebApp (без падений при открытии в браузере)
const tg = window.Telegram?.WebApp;
try {
  if (tg) {
    tg.ready();
    tg.expand();

    // Синхронизируем тему (опционально)
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

const theme = createThemeFromCssVars();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  </React.StrictMode>
);