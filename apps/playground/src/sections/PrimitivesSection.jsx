import React from 'react';
import {
  Button,
  Badge,
  Spinner,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
} from '@aviary-ui/ui';

function Section({ title, children }) {
  return (
    <section className="mb-5">
      <h3 className="mb-3 border-bottom pb-2">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, children }) {
  return (
    <div className="mb-3">
      <div className="text-secondary small mb-2">{label}</div>
      <div className="d-flex flex-wrap gap-2 align-items-center">{children}</div>
    </div>
  );
}

export default function PrimitivesSection() {
  return (
    <>
      <Section title="Button">
        <Row label="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost-primary">Ghost Primary</Button>
          <Button variant="ghost-danger">Ghost Danger</Button>
          <Button variant="ghost-secondary">Ghost Secondary</Button>
          <Button variant="outline-secondary">Outline Secondary</Button>
          <Button variant="outline-danger">Outline Danger</Button>
          <Button variant="link">Link</Button>
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Row>
        <Row label="States">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </Row>
        <Row label="Icon-only">
          <Button variant="ghost-primary" icon><IconPlus size={16} /></Button>
          <Button variant="ghost-secondary" icon><IconEdit size={16} /></Button>
          <Button variant="ghost-danger" icon><IconTrash size={16} /></Button>
          <Button variant="secondary" icon><IconSearch size={16} /></Button>
        </Row>
        <Row label="With icon + label">
          <Button className="d-flex align-items-center gap-2">
            <IconPlus size={16} /> New Item
          </Button>
        </Row>
      </Section>

      <Section title="Badge">
        <Row label="Colors">
          <Badge color="primary">Primary</Badge>
          <Badge color="success">Success</Badge>
          <Badge color="danger">Danger</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="info">Info</Badge>
          <Badge color="secondary">Secondary</Badge>
        </Row>
      </Section>

      <Section title="Spinner">
        <Row label="Colors">
          <Spinner color="primary" />
          <Spinner color="secondary" />
          <Spinner color="success" />
          <Spinner color="danger" />
        </Row>
        <Row label="Centered (inside box)">
          <div className="border rounded" style={{ width: 200, height: 80 }}>
            <Spinner centered />
          </div>
        </Row>
      </Section>
    </>
  );
}
