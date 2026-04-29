import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '../app/AppShell';
import { DashboardPage } from '../pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppShell>
        <DashboardPage />
      </AppShell>
    ),
  },
]);
