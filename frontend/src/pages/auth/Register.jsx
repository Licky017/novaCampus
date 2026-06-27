import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/services/api';

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/auth/signup', {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      setSuccess('Successfully registered! Redirecting to login...');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        <h1 className="h3 mb-2" style={{ color: 'var(--text-primary)' }}>Register</h1>
        <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
          Create your account by entering your first name, last name, email, and a secure password.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success py-2" role="alert">
          {success} <button type="button" className="btn btn-link p-0" onClick={() => navigate('/login')}>Go to login</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row gx-2 mb-3">
          <div className="col">
            <label htmlFor="firstName" className="form-label">First name</label>
            <input
              id="firstName"
              className="form-control"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div className="col">
            <label htmlFor="lastName" className="form-label">Last name</label>
            <input
              id="lastName"
              className="form-control"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            className="form-control"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            className="form-control"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
          <input
            id="confirmPassword"
            className="form-control"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="mt-3 d-flex justify-content-between">
        <Link to="/login" className="text-decoration-none">Already have an account?</Link>
        <Link to="/" className="text-decoration-none">Back home</Link>
      </div>
    </div>
  );
}
