import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className="p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
      <h1 className="h3 mb-2" style={{ color: 'var(--text-primary)' }}>Forgot password</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Password reset is not configured yet.</p>
      <Link to="/login" className="btn btn-outline-primary">Back to sign in</Link>
    </div>
  );
}
