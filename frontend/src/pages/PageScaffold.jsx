import React from 'react';

export default function PageScaffold({ title, description, icon = 'bi-grid' }) {
  return (
    <section className="container-fluid px-0">
      <div
        className="p-4"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: 'rgba(37, 99, 235, 0.12)',
              color: '#2563eb',
              flexShrink: 0,
            }}
          >
            <i className={`bi ${icon}`} />
          </div>
          <div>
            <h1 className="h4 mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h1>
            <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
