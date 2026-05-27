import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, NotificationProvider, useTheme, IconSun, IconMoon } from '@aviary-ui/ui';
import ShowcasePage from './pages/ShowcasePage';
import LayoutPreviewPage from './pages/LayoutPreviewPage';

const queryClient = new QueryClient();

function Nav() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();

  return (
    <header className="navbar navbar-expand-sm border-bottom mb-0">
      <div className="container-xl">
        <span className="navbar-brand fw-bold">aviary-ui playground</span>
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className={`nav-link ${pathname === '/' ? 'active' : ''}`} to="/">
              Components
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${pathname === '/layout' ? 'active' : ''}`}
              to="/layout"
            >
              AppLayout
            </Link>
          </li>
        </ul>
        <button className="btn btn-ghost-secondary btn-icon" onClick={toggle} title="Toggle theme">
          {theme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
        </button>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <BrowserRouter>
            <div className="page">
              <div className="page-wrapper">
                <Nav />
                <div className="page-body">
                  <Routes>
                    <Route path="/" element={<ShowcasePage />} />
                    <Route path="/layout" element={<LayoutPreviewPage />} />
                  </Routes>
                </div>
              </div>
            </div>
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
