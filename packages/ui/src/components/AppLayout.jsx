import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { storage } from '@aviary-ui/core';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../ui/Button';
import { IconLogout, IconMenu2, IconSun, IconMoon, IconChevronDown } from '../ui/icons';

// navItems: [{ path: string, label: string, Icon: ReactComponent }]
// appName: string — shown in sidebar header
// onLogout: optional override; default clears storage + navigates to loginPath
// loginPath: where logout lands (default /login); homePath: brand click target (default /)
// userMenuItems: [{ path, label, Icon }] — when non-empty, the bottom-left
//   username becomes a dropdown (items + Logout); when empty, the original
//   plain name + theme + logout-icon layout is preserved (backward-compatible).
export default function AppLayout({
  children,
  navItems = [],
  appName = 'App',
  onLogout,
  loginPath = '/login',
  homePath = '/',
  userMenuItems = [],
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = storage.getUser();
  const { theme, toggle } = useTheme();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      storage.clear();
      showNotification('Logged out successfully.', 'success');
      navigate(loginPath);
    }
  };

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="page">
      <aside className="navbar navbar-vertical navbar-expand-lg">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <IconMenu2 size={20} />
          </button>

          <div className="navbar-brand">
            <button
              className="btn btn-link navbar-brand p-0 text-decoration-none fw-bold"
              onClick={() => handleNav(homePath)}
            >
              {appName}
            </button>
          </div>

          <div className={`collapse navbar-collapse ${sidebarOpen ? 'show' : ''}`}>
            <ul className="navbar-nav pt-lg-3">
              {navItems.map(({ path, label, Icon }) => (
                <li key={path} className="nav-item">
                  <button
                    className={`nav-link btn btn-link w-100 text-start ${location.pathname === path ? 'active' : ''}`}
                    onClick={() => handleNav(path)}
                  >
                    {Icon && (
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <Icon size={20} />
                      </span>
                    )}
                    <span className="nav-link-title">{label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-top pt-3 pb-2 px-3">
              {userMenuItems.length > 0 ? (
                <div className="d-flex align-items-center justify-content-between">
                  <div className={`dropup flex-fill overflow-hidden ${userMenuOpen ? 'show' : ''}`}>
                    <button
                      type="button"
                      className="btn btn-link text-reset text-decoration-none p-0 w-100 d-flex align-items-center justify-content-between"
                      aria-expanded={userMenuOpen}
                      onClick={() => setUserMenuOpen((prev) => !prev)}
                    >
                      <span className="overflow-hidden text-start">
                        <span className="d-block fw-medium text-truncate">
                          {user?.firstname ?? user?.name ?? 'User'}
                        </span>
                        <span className="d-block text-secondary small text-truncate">
                          {user?.email ?? ''}
                        </span>
                      </span>
                      <IconChevronDown size={16} className="ms-2 flex-shrink-0" />
                    </button>
                    <div className={`dropdown-menu ${userMenuOpen ? 'show' : ''}`}>
                      {userMenuItems.map(({ path, label, Icon }) => (
                        <button
                          key={path}
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            handleNav(path);
                            setUserMenuOpen(false);
                          }}
                        >
                          {Icon && <Icon size={18} className="me-2" />}
                          {label}
                        </button>
                      ))}
                      <div className="dropdown-divider" />
                      <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
                        <IconLogout size={18} className="me-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                  <Button
                    variant="ghost-secondary"
                    icon
                    className="ms-2 flex-shrink-0"
                    onClick={toggle}
                    title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
                  >
                    {theme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
                  </Button>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-between">
                  <div className="overflow-hidden">
                    <div className="fw-medium text-truncate">
                      {user?.firstname ?? user?.name ?? 'User'}
                    </div>
                    <div className="text-secondary small text-truncate">{user?.email ?? ''}</div>
                  </div>
                  <div className="d-flex gap-1 ms-2 flex-shrink-0">
                    <Button
                      variant="ghost-secondary"
                      icon
                      onClick={toggle}
                      title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
                    >
                      {theme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
                    </Button>
                    <Button variant="ghost-danger" icon onClick={handleLogout} title="Logout">
                      <IconLogout size={18} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
