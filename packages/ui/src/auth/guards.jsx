import React from 'react';
import { Navigate } from 'react-router-dom';
import { storage } from '@aviary-ui/core';

// PrivateRoute — requires auth token. Redirects to loginPath if not authenticated.
export function PrivateRoute({ children, loginPath = '/login' }) {
  return storage.getToken() ? children : <Navigate to={loginPath} replace />;
}

// PublicRoute — for login/register pages. Redirects to homePath if already authenticated.
export function PublicRoute({ children, homePath = '/dashboard' }) {
  return !storage.getToken() ? children : <Navigate to={homePath} replace />;
}

// RootRedirect — landing route ("/"). Reads the token at render time (not at
// router mount), so the target is never stale: home when authenticated,
// login otherwise. Usage: <Route path="/" element={<RootRedirect />} />
export function RootRedirect({ homePath = '/dashboard', loginPath = '/login' }) {
  return <Navigate to={storage.getToken() ? homePath : loginPath} replace />;
}

// RequireRole — renders children only if user.role matches.
// Usage: <RequireRole role="admin"><AdminPanel /></RequireRole>
// Optional fallback: <RequireRole role="admin" fallback={<p>No access</p>}>…
export function RequireRole({ role, children, fallback = null }) {
  const user = storage.getUser();
  if (!user?.role || user.role !== role) return fallback;
  return children;
}

// RequirePermission — renders children only if user.permissions includes the given permission.
// Usage: <RequirePermission permission="transactions:write"><CreateButton /></RequirePermission>
// Expects user.permissions to be a string[].
export function RequirePermission({ permission, children, fallback = null }) {
  const user = storage.getUser();
  if (!Array.isArray(user?.permissions) || !user.permissions.includes(permission)) return fallback;
  return children;
}
