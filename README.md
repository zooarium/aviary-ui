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

## Required vite.config.js in consuming project

Add `resolve.dedupe` and `server.watch` — required for all projects using aviary-ui via `file:` deps.

```js
// your-app/vite.config.js
export default defineConfig({
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
    // Prevent duplicate React from symlinked file: deps — hooks crash without this.
    dedupe: ['react', 'react-dom'],
  },
  server: {
    watch: {
      // Watch @aviary-ui dist/ for changes so HMR fires when make dev-ui rebuilds.
      ignored: (path) => path.includes('node_modules') && !path.includes('@aviary-ui'),
    },
  },
  optimizeDeps: {
    // Don't pre-bundle aviary-ui — let Vite load dist/ fresh on each rebuild.
    exclude: ['@aviary-ui/core', '@aviary-ui/ui'],
  },
});
```

## Development (watch mode)

```bash
# Terminal 1 (aviary-ui repo) — watch-build package(s) being edited
make dev-ui    # or dev-core

# Terminal 2 (your app) — normal dev server
make dev

# Edit a component in aviary-ui → vite build --watch rebuilds dist/
# → your app's Vite HMR detects dist/ change → browser reloads automatically
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
