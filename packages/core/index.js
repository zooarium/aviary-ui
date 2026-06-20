// @aviary-ui/core — barrel export
// Pure JS utilities. No React. No framework deps.

// HTTP
export {
  configure,
  apiRequest,
  authRequest,
  clearAuth,
  startImpersonation,
  exchangeImpersonation,
  logoutImpersonation,
} from './src/http/client';
export { NetworkError, AuthError } from './src/http/errors';

// Auth storage
export { storage } from './src/auth/storage';
