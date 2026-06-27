// frontend/src/pages/auth/Register.jsx
// Purpose: Admin-only "create a new user" form. Super Admins use this to
// create Teacher, Student, or additional Super Admin accounts.
// Uses AuthContext.register(), which correctly POSTs to POST /api/auth/register.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await register(form);
      setSuccess(`${form.name} was registered successfully as ${form.role}.`);
      setForm({ name: '', email: '', password: '', role: 'student', phone: '', address: '' });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="p-4"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}
    >
      <div className="mb-4">
        <h1 className="h3 mb-2" style={{ color: 'var(--text-primary)' }}>Register a new user</h1>
        <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
          Create a Super Admin, Teacher, or Student account.
        </p>
      </div>

      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
      {success && <div className="alert alert-success py-2" role="alert">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full name</label>
          <input id="name" name="name" className="form-control" type="text"
            value={form.name} onChange={handleChange} minLength={2} maxLength={100} required />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email" name="email" className="form-control" type="email"
            value={form.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Temporary password</label>
          <input id="password" name="password" className="form-control" type="password"
            value={form.password} onChange={handleChange} minLength={8} required />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select id="role" name="role" className="form-select" value={form.role} onChange={handleChange} required>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        <div className="row gx-2 mb-4">
          <div className="col">
            <label htmlFor="phone" className="form-label">Phone (optional)</label>
            <input id="phone" name="phone" className="form-control" type="tel" value={form.phone} onChange={handleChange} />
          </div>
          <div className="col">
            <label htmlFor="address" className="form-label">Address (optional)</label>
            <input id="address" name="address" className="form-control" type="text" value={form.address} onChange={handleChange} />
          </div>
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register user'}
        </button>
      </form>

      <div className="mt-3">
        <Link to="/dashboard" className="text-decoration-none">← Back to dashboard</Link>
      </div>
    </div>
  );
}