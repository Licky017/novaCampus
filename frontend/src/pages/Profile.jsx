import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <section className="p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8 }}>
      <h1 className="h4 mb-3" style={{ color: 'var(--text-primary)' }}>My Profile</h1>
      <dl className="row mb-0">
        <dt className="col-sm-3">Name</dt>
        <dd className="col-sm-9">{user?.name || 'Not available'}</dd>
        <dt className="col-sm-3">Email</dt>
        <dd className="col-sm-9">{user?.email || 'Not available'}</dd>
        <dt className="col-sm-3">Role</dt>
        <dd className="col-sm-9 text-capitalize">{user?.role || 'Not available'}</dd>
      </dl>
    </section>
  );
}
