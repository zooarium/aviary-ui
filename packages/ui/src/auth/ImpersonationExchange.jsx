import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, exchangeImpersonation } from '@aviary-ui/core';
import Spinner from '../ui/Spinner';

// ImpersonationExchange is the landing page each service UI mounts at its
// impersonation exchange route (e.g. /impersonate/exchange). It reads the
// one-time handoff code from the URL fragment, redeems it with keeper for a
// short-lived impersonation token, installs the per-tab impersonation overlay,
// and redirects into the app — now acting as the impersonated user. The admin's
// own session (in localStorage / other tabs) is never touched.
//
// The code travels in the URL *fragment* (never the query string), so it is not
// sent to servers or logged; we also strip it from the address bar immediately
// on mount. The code is single-use and short-lived.
export function ImpersonationExchange({ redirectTo = '/dashboard', loginPath = '/login' }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const ran = useRef(false);

  useEffect(() => {
    // The handoff code is single-use; guard against React StrictMode's
    // double-invoke so we don't redeem (and burn) it twice.
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const code = params.get('code');

    // Strip the fragment immediately so the code never lingers in history.
    window.history.replaceState(null, '', window.location.pathname + window.location.search);

    if (!code) {
      setError('Missing impersonation code.');
      return;
    }

    exchangeImpersonation(code)
      .then((res) => {
        const data = res?.data ?? res;
        if (!data?.token) throw new Error('Invalid exchange response.');
        storage.enterImpersonation(data.token, data.user, data.session_id);
        navigate(redirectTo, { replace: true });
      })
      .catch((e) => setError(e?.message || 'Impersonation failed.'));
  }, [navigate, redirectTo]);

  if (error) {
    return (
      <div style={{ maxWidth: 420, margin: '4rem auto', textAlign: 'center' }}>
        <h3>Impersonation failed</h3>
        <p className="text-muted">{error}</p>
        <a href={loginPath}>Return to login</a>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '4rem' }}>
      <Spinner />
      <p className="text-muted">Signing in…</p>
    </div>
  );
}

export default ImpersonationExchange;
