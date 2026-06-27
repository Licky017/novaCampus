// frontend/src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center" style={{ maxWidth: 400 }}>
        <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--sms-secondary)', lineHeight: 1, marginBottom: 8 }}>404</div>
        <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button className="btn btn-primary px-4" style={{ borderRadius: 8 }} onClick={() => navigate('/')}>
          <i className="bi bi-house me-2" />Back to Home
        </button>
      </div>
    </div>
  );
}
