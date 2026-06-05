// @aviary-ui/ui — barrel export
// Import from '@aviary-ui/ui' — never from individual files inside the package.

// Auth guards (React + react-router-dom)
export { PrivateRoute, PublicRoute, RootRedirect, RequireRole, RequirePermission } from './src/auth/guards';

// Context providers + hooks
export { NotificationProvider, useNotification } from './src/context/NotificationContext';
export { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Layout + structural components
export { default as AppLayout } from './src/components/AppLayout';
export { default as ErrorBoundary } from './src/components/ErrorBoundary';
export { default as Notification } from './src/components/Notification';

// UI primitives
export { default as Button } from './src/ui/Button';
export { Card, CardHeader, CardTitle, CardBody } from './src/ui/Card';
export { default as Badge } from './src/ui/Badge';
export { default as Spinner } from './src/ui/Spinner';
export { default as FormField, Input, Select } from './src/ui/FormField';
export { default as Alert } from './src/ui/Alert';
export { default as Modal } from './src/ui/Modal';
export { default as ConfirmDialog } from './src/ui/ConfirmDialog';

// Icons re-export (swap icon library: edit src/ui/icons.js only)
export * from './src/ui/icons';

// Design tokens
export * from './src/ui/theme';
