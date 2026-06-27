import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Unable to sign in. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="p-4"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
      }}
    >
      <div className="mb-4">
        <h1 className="h3 mb-2" style={{ color: 'var(--text-primary)' }}>Sign in</h1>
        <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
          Access your school management dashboard.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            className="form-control"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <label htmlFor="password" className="form-label">Password</label>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem' }}>Forgot?</Link>
          </div>
          <input
            id="password"
            className="form-control"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
