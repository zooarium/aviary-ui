// HTTP client — swap fetch → axios: edit here only.
// Call configure() once at app startup (in main.jsx or App.jsx).
//
// Example:
//   import { configure } from '@aviary-ui/core';
//   configure({
//     apiBase: import.meta.env.VITE_API_BE_URL,
//     authBase: import.meta.env.VITE_API_URL,
//     refreshPath: import.meta.env.VITE_REFRESH_PATH ?? '/users/refresh',
//   });

import { storage } from '../auth/storage';
import { AuthError, NetworkError } from './errors';

let _config = {
  apiBase: '',
  authBase: '',
  // Path on authBase that issues a new access token from a refresh token.
  refreshPath: '/users/refresh',
  // Browser route to land on when auth is irrecoverably lost (e.g. '/admin/login').
  loginPath: '/login',
  // Browser route to land on when an IMPERSONATION session ends (expired,
  // revoked, or exited). Returns to the admin context rather than the login
  // screen, since the admin's own session is still valid in this/other tabs.
  impersonationExitPath: '/',
};

export function configure(options) {
  _config = { ..._config, ...options };
}

export function clearAuth() {
  // While impersonating, only tear down the per-tab overlay — never the admin's
  // localStorage session.
  if (storage.isImpersonating()) {
    storage.exitImpersonation();
    return;
  }
  storage.clear();
}

// failAuth handles an irrecoverable 401. Under impersonation it drops the
// overlay and returns to the admin context; otherwise it clears auth and sends
// the user to login. Always throws AuthError.
function failAuth() {
  if (storage.isImpersonating()) {
    storage.exitImpersonation();
    window.location.href = _config.impersonationExitPath;
  } else {
    storage.clear();
    window.location.href = _config.loginPath;
  }
  throw new AuthError();
}

// --- Refresh token state ---
// Prevents concurrent refresh storms: if 3 requests 401 simultaneously,
// only one refresh call fires; the other two queue and retry with the new token.
let isRefreshing = false;
let refreshQueue = [];

function drainQueue(newToken) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

async function doRefresh() {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) throw new AuthError();

  const res = await fetch(`${_config.authBase}${_config.refreshPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) throw new AuthError();

  const body = await res.json();
  const newToken = body?.data?.token ?? body?.token;
  if (!newToken) throw new AuthError();

  storage.setToken(newToken);
  if (body?.data?.refresh_token) storage.setRefreshToken(body.data.refresh_token);

  return newToken;
}

async function parseResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) {
    throw new NetworkError(
      data?.error || data?.message || `Request failed (${res.status})`,
      res.status
    );
  }
  return data;
}

async function retryWithToken(url, options, newToken) {
  const res = await fetch(url, {
    ...options,
    headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
  });
  if (res.status === 401) {
    failAuth();
  }
  return parseResponse(res);
}

async function request(baseUrl, path, options = {}, skipAuthRefresh = false) {
  const token = storage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const url = `${baseUrl}${path}`;
  const res = await fetch(url, { ...options, headers });

  // Auth endpoints (login, register) must NOT trigger the refresh flow.
  // A 401 from login just means bad credentials — let the error propagate normally.
  if (res.status !== 401 || skipAuthRefresh) return parseResponse(res);

  // Impersonation tokens cannot be refreshed (no refresh token). A 401 means the
  // session expired or was revoked: drop the overlay and return to admin.
  if (storage.isImpersonating()) {
    failAuth();
  }

  // --- 401 handling: try silent refresh ---
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const newToken = await doRefresh();
      isRefreshing = false;
      drainQueue(newToken);
      return retryWithToken(url, { ...options, headers }, newToken);
    } catch {
      isRefreshing = false;
      drainQueue(null);
      failAuth();
    }
  }

  // Another request is already refreshing — queue this one and wait
  return new Promise((resolve, reject) => {
    refreshQueue.push((newToken) => {
      if (!newToken) return reject(new AuthError());
      retryWithToken(url, { ...options, headers }, newToken).then(resolve).catch(reject);
    });
  });
}

export const apiRequest = (path, options = {}) =>
  request(_config.apiBase, path, options, false);

export const authRequest = (path, options = {}) =>
  request(_config.authBase, path, options, true);

// --- Impersonation handoff ---
// These talk to keeper's impersonation endpoints (on authBase) WITHOUT an auth
// header: the one-time code and the opaque session id are the capabilities. They
// bypass the normal auth/refresh machinery entirely.

// startImpersonation asks keeper to mint a one-time handoff code for logging in
// as a user on a given downstream service (audience). Targets keeper (authBase)
// and carries the caller's admin token. Returns
// { code, session_id, audience, expires_at }.
export const startImpersonation = (body) =>
  authRequest('/impersonations', { method: 'POST', body: JSON.stringify(body) });

// exchangeImpersonation redeems a one-time code (typically read from the URL
// fragment of the exchange page) for an impersonation token + user object.
// Public, no auth header. Returns { token, user, audience, expires_at }.
export async function exchangeImpersonation(code) {
  const res = await fetch(`${_config.authBase}/impersonations/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ code }),
  });
  return parseResponse(res);
}

// logoutImpersonation revokes an impersonation session server-side by its opaque
// id (best-effort; safe to call even if already revoked). Public, no auth.
export async function logoutImpersonation(sessionId) {
  const res = await fetch(`${_config.authBase}/impersonations/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  });
  return parseResponse(res);
}
