// Single point for auth token / user storage.
// Swap localStorage → cookie/sessionStorage: edit here only.
//
// Impersonation overlay: a sysadmin "login as user" session is stored in
// sessionStorage (per-tab) under separate keys. When an impersonation overlay
// is present, the getters/setters transparently operate on it instead of the
// admin's localStorage — so the impersonated session lives only in the tab that
// started it, the admin's own localStorage token is never touched, and other
// tabs keep their admin identity. Exiting impersonation clears only the overlay.
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

// Per-tab impersonation overlay (sessionStorage). No refresh token: impersonation
// tokens are short-lived and re-minted via the exchange flow, never refreshed.
const IMP_TOKEN_KEY = 'imp_token';
const IMP_USER_KEY = 'imp_user';
const IMP_SESSION_KEY = 'imp_session_id';

// isImpersonating reports whether this tab is in an impersonation session.
const isImpersonating = () => !!sessionStorage.getItem(IMP_TOKEN_KEY);

function readUser(raw) {
  try {
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export const storage = {
  getToken: () =>
    isImpersonating()
      ? sessionStorage.getItem(IMP_TOKEN_KEY)
      : localStorage.getItem(TOKEN_KEY),
  setToken: (token) =>
    isImpersonating()
      ? sessionStorage.setItem(IMP_TOKEN_KEY, token)
      : localStorage.setItem(TOKEN_KEY, token),
  removeToken: () =>
    isImpersonating()
      ? sessionStorage.removeItem(IMP_TOKEN_KEY)
      : localStorage.removeItem(TOKEN_KEY),

  // Impersonation tokens have no refresh token; reads return null and writes are
  // ignored while impersonating so the refresh flow is effectively disabled.
  getRefreshToken: () =>
    isImpersonating() ? null : localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => {
    if (isImpersonating()) return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  removeRefreshToken: () => {
    if (isImpersonating()) return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  getUser: () =>
    isImpersonating()
      ? readUser(sessionStorage.getItem(IMP_USER_KEY))
      : readUser(localStorage.getItem(USER_KEY)),
  setUser: (user) =>
    isImpersonating()
      ? sessionStorage.setItem(IMP_USER_KEY, JSON.stringify(user))
      : localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () =>
    isImpersonating()
      ? sessionStorage.removeItem(IMP_USER_KEY)
      : localStorage.removeItem(USER_KEY),

  // clear wipes the ADMIN (localStorage) session. It deliberately leaves any
  // impersonation overlay alone — use exitImpersonation for that.
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // --- Impersonation overlay controls ---

  isImpersonating,

  // enterImpersonation installs the impersonation overlay in this tab. The
  // admin's localStorage session is untouched, so closing/exiting returns to it.
  enterImpersonation: (token, user, sessionId) => {
    sessionStorage.setItem(IMP_TOKEN_KEY, token);
    sessionStorage.setItem(IMP_USER_KEY, JSON.stringify(user ?? {}));
    if (sessionId) sessionStorage.setItem(IMP_SESSION_KEY, sessionId);
  },

  // exitImpersonation removes the overlay only, restoring the admin session in
  // this tab. Never touches localStorage.
  exitImpersonation: () => {
    sessionStorage.removeItem(IMP_TOKEN_KEY);
    sessionStorage.removeItem(IMP_USER_KEY);
    sessionStorage.removeItem(IMP_SESSION_KEY);
  },

  getImpersonationSessionId: () => sessionStorage.getItem(IMP_SESSION_KEY),
};
