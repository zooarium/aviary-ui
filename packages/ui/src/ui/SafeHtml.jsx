import React from 'react';
import DOMPurify from 'dompurify';

// Renders untrusted/admin-authored HTML safely. The markup is sanitized with
// DOMPurify before being injected, so stored-XSS payloads (scripts, event
// handlers, javascript: URLs) are stripped. Reusable by any app that displays
// rich-text fields (e.g. an app's About body).
export default function SafeHtml({ html, className }) {
  const clean = React.useMemo(() => DOMPurify.sanitize(html ?? ''), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
