import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ConfirmDialog,
  Button,
  FormField,
  Input,
  Card,
  CardBody,
  useNotification,
  IconCheck,
  IconAlertTriangle,
  IconInfoCircle,
  IconCircleX,
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
      <div className="d-flex flex-column gap-2">{children}</div>
    </div>
  );
}

function AlertShowcase() {
  const [dismissed, setDismissed] = useState({});
  const dismiss = (key) => setDismissed((p) => ({ ...p, [key]: true }));

  const types = [
    { type: 'success', Icon: IconCheck, label: 'Operation completed successfully.' },
    { type: 'error', Icon: IconCircleX, label: 'Something went wrong. Please try again.' },
    { type: 'warning', Icon: IconAlertTriangle, label: 'Proceed with caution.' },
    { type: 'info', Icon: IconInfoCircle, label: 'Here is some useful information.' },
  ];

  return (
    <Row label="All types — with icon + dismissible">
      {types.map(({ type, Icon, label }) =>
        dismissed[type] ? null : (
          <Alert key={type} type={type} icon={Icon} onClose={() => dismiss(type)}>
            {label}
          </Alert>
        )
      )}
      {Object.keys(dismissed).length === types.length && (
        <Button size="sm" variant="secondary" onClick={() => setDismissed({})}>
          Reset
        </Button>
      )}
    </Row>
  );
}

function ModalShowcase() {
  const [size, setSize] = useState(null);

  return (
    <Row label="Sizes">
      <div className="d-flex gap-2 flex-wrap">
        {['sm', 'md', 'lg', 'xl'].map((s) => (
          <Button key={s} variant="secondary" size="sm" onClick={() => setSize(s)}>
            Open {s.toUpperCase()}
          </Button>
        ))}
      </div>
      <Modal isOpen={!!size} onClose={() => setSize(null)} title={`Modal — ${(size ?? '').toUpperCase()}`} size={size}>
        <FormField label="Sample field" htmlFor="modal-input">
          <Input id="modal-input" placeholder="Type something…" />
        </FormField>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="secondary" onClick={() => setSize(null)}>Cancel</Button>
          <Button onClick={() => setSize(null)}>Save</Button>
        </div>
      </Modal>
    </Row>
  );
}

function ConfirmShowcase() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <Row label="Confirm dialog">
      <div className="d-flex gap-3 align-items-center">
        <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
          Delete item
        </Button>
        {result && <span className={`text-${result === 'confirmed' ? 'danger' : 'secondary'}`}>→ {result}</span>}
      </div>
      <ConfirmDialog
        isOpen={open}
        message="Delete this item? This cannot be undone."
        onConfirm={() => { setResult('confirmed'); setOpen(false); }}
        onCancel={() => { setResult('cancelled'); setOpen(false); }}
      />
    </Row>
  );
}

function NotificationShowcase() {
  const { showNotification } = useNotification();

  return (
    <Row label="Trigger toasts">
      <div className="d-flex gap-2 flex-wrap">
        <Button size="sm" variant="ghost-primary" onClick={() => showNotification('Info message.', 'info')}>Info</Button>
        <Button size="sm" variant="ghost-primary" onClick={() => showNotification('Success! Operation done.', 'success')}>Success</Button>
        <Button size="sm" variant="ghost-danger" onClick={() => showNotification('Error! Something failed.', 'error')}>Error</Button>
        <Button size="sm" variant="ghost-secondary" onClick={() => showNotification('Warning: check this.', 'warning')}>Warning</Button>
      </div>
    </Row>
  );
}

export default function DialogsSection() {
  return (
    <>
      <Section title="Alert">
        <Card><CardBody><AlertShowcase /></CardBody></Card>
      </Section>

      <Section title="Modal">
        <Card><CardBody><ModalShowcase /></CardBody></Card>
      </Section>

      <Section title="ConfirmDialog">
        <Card><CardBody><ConfirmShowcase /></CardBody></Card>
      </Section>

      <Section title="Notification (toast)">
        <Card><CardBody><NotificationShowcase /></CardBody></Card>
      </Section>
    </>
  );
}
