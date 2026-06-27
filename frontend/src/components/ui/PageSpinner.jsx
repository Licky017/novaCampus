// frontend/src/components/ui/PageSpinner.jsx
// Purpose: Full-page loading spinner shown during route suspense / auth resolve
import React from 'react';

export default function PageSpinner() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', background: 'var(--bg-page)' }}
    >
      <div className="text-center">
        <div
          className="spinner-border mb-3"
          style={{ width: '2.5rem', height: '2.5rem', color: 'var(--sms-secondary)' }}
          role="status"
        />
        <p className="mb-0" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Loading…
        </p>
      </div>
    </div>
  );
}
