import React from 'react';
import { AppLayout, Button, Card, CardBody, CardHeader, CardTitle, IconLayoutDashboard, IconTag, IconPlus } from '@aviary-ui/ui';

const NAV_ITEMS = [
  { path: '#', label: 'Dashboard', Icon: IconLayoutDashboard },
  { path: '#', label: 'Categories', Icon: IconTag },
];

export default function LayoutPreviewPage() {
  return (
    <AppLayout navItems={NAV_ITEMS} appName="Playground">
      <div className="page-header d-print-none mb-3">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">AppLayout Preview</h2>
            <div className="text-secondary">Sidebar, navbar, theme toggle, user block, logout.</div>
          </div>
          <div className="col-auto ms-auto">
            <Button className="d-flex align-items-center gap-2">
              <IconPlus size={16} /> New Item
            </Button>
          </div>
        </div>
      </div>

      <div className="row row-cards">
        {[1, 2, 3].map((n) => (
          <div key={n} className="col-md-4">
            <Card>
              <CardHeader>
                <CardTitle>Card {n}</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-secondary mb-0">
                  Sample content inside AppLayout. Sidebar collapses on mobile.
                </p>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
