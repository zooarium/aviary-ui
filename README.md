# aviary-ui

Monorepo of shared React UI packages. Used across projects in the zooarium family.

## Packages

| Package | Description |
|---------|-------------|
| [`@aviary-ui/core`](./packages/core) | Pure JS: HTTP client, auth storage, error types |
| [`@aviary-ui/ui`](./packages/ui) | React components, context providers, auth guards (Tabler CSS) |

## Setup

```bash
git clone <repo-url> aviary-ui
cd aviary-ui
make install   # installs deps + builds both packages
```

## Using in a project

```json
// your-app/package.json
{
  "dependencies": {
    "@aviary-ui/core": "file:../aviary-ui/packages/core",
    "@aviary-ui/ui":   "file:../aviary-ui/packages/ui"
  }
}
```

Then `npm install` in your app. Both packages are pre-built to `dist/`.

## Configuring the HTTP client

Call `configure()` once at app startup — before any API calls.

```js
// your-app/src/main.jsx
import { configure } from '@aviary-ui/core';

configure({
  apiBase:     import.meta.env.VITE_API_BE_URL,
  authBase:    import.meta.env.VITE_API_URL,
  refreshPath: import.meta.env.VITE_REFRESH_PATH ?? '/users/refresh',
});
```

## Provider stack (App.jsx)

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary, ThemeProvider, NotificationProvider, AppLayout } from '@aviary-ui/ui';
import { IconLayoutDashboard, IconTag } from '@aviary-ui/ui';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', Icon: IconLayoutDashboard },
  { path: '/settings',  label: 'Settings',  Icon: IconTag },
];

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <NotificationProvider>
            <AppRouter />
          </NotificationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

// In a private page layout:
<AppLayout navItems={NAV_ITEMS} appName="MyApp">
  {children}
</AppLayout>
```

## Development (watch mode)

```bash
# Terminal 1 — rebuild core on change
make dev-core

# Terminal 2 — rebuild ui on change
make dev-ui

# Your app's Vite dev server picks up dist/ changes automatically
```

## Adding a new package

```bash
mkdir packages/mypackage
# add packages/mypackage/package.json with "name": "@aviary-ui/mypackage"
# add packages/mypackage/vite.config.js (library mode)
# add packages/mypackage/index.js (barrel)
make install   # workspace picks it up
```

## Peer dependencies required by consuming project

```
react >= 19
react-dom >= 19
react-router-dom >= 7
@tanstack/react-query >= 5
@tabler/core >= 1
@tabler/icons-react >= 3
@radix-ui/react-dialog >= 1
@radix-ui/react-alert-dialog >= 1
```
