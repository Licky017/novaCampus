// frontend/src/pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center" style={{ maxWidth: 400 }}>
        <div style={{ fontSize: '4rem', color: 'var(--sms-danger)', marginBottom: 16 }}>
          <i className="bi bi-shield-x" />
        </div>
        <h2 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
          You don't have permission to view this page.
        </p>
        <button className="btn btn-primary px-4" style={{ borderRadius: 8 }} onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2" />Go Back
        </button>
      </div>
    </div>
  );
}
