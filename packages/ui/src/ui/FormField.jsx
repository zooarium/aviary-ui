import React from 'react';
import { IconEye, IconEyeOff } from './icons';

export default function FormField({ label, htmlFor, error, children, className = '' }) {
  return (
    <div className={`mb-3 ${className}`.trim()}>
      {label && (
        <label className="form-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}

export function Input({ error, className = '', type = 'text', ...props }) {
  const [reveal, setReveal] = React.useState(false);
  const cls = `form-control ${error ? 'is-invalid' : ''} ${className}`.trim();

  if (type !== 'password') {
    return <input type={type} className={cls} {...props} />;
  }

  return (
    <div className="input-group input-group-flat">
      <input type={reveal ? 'text' : 'password'} className={cls} {...props} />
      <span className="input-group-text p-0">
        <button
          type="button"
          className="btn btn-link link-secondary px-2 border-0 shadow-none"
          tabIndex={-1}
          aria-label={reveal ? 'Hide password' : 'Show password'}
          title={reveal ? 'Hide password' : 'Show password'}
          onClick={() => setReveal((v) => !v)}
        >
          {reveal ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      </span>
    </div>
  );
}

export function Select({ error, children, className = '', ...props }) {
  return (
    <select
      className={`form-select ${error ? 'is-invalid' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
}
