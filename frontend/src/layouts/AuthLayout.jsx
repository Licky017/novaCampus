// frontend/src/layouts/AuthLayout.jsx
// Purpose: Centered two-column layout for login / forgot-password pages
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

export default function AuthLayout() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className="min-vh-100 d-flex"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Left decorative panel (hidden on mobile) */}
      <div
        className="d-none d-lg-flex flex-column justify-content-between p-5"
        style={{
          width: '42%',
          background: 'linear-gradient(145deg, #1E3A5F 0%, #1E40AF 60%, #2563EB 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />

        {/* Brand */}
        <div className="d-flex align-items-center gap-3" style={{ zIndex: 1 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="bi bi-mortarboard-fill text-white" style={{ fontSize: '1.2rem' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>SchoolERP</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem' }}>Management System</div>
          </div>
        </div>

        {/* Centre text */}
        <div style={{ zIndex: 1 }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.8rem', lineHeight: 1.3, marginBottom: 16 }}>
            Manage your school smarter, not harder.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Students, teachers, classes, grades, fees and announcements — all in one place.
          </p>
        </div>

        {/* Stats strip */}
        <div className="d-flex gap-4" style={{ zIndex: 1 }}>
          {[['1,200+', 'Students'], ['80+', 'Teachers'], ['60+', 'Classes']].map(([val, lbl]) => (
            <div key={lbl}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem' }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form area */}
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4" style={{ position: 'relative' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: 10, width: 38, height: 38,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}
        >
          <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`} />
        </button>

        <div style={{ width: '100%', maxWidth: 420 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
