// frontend/src/layouts/AppLayout.jsx
// Purpose: Main authenticated shell — sidebar, top navbar, page content area
// Dependencies: react-router-dom, AuthContext, ThemeContext
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth }  from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getInitials, avatarColor } from '@/utils/helpers';

// ── Nav config per role ──
const NAV_ITEMS = {
  superadmin: [
    { section: 'Main',       items: [{ to: '/dashboard',   icon: 'bi-speedometer2', label: 'Dashboard' }] },
    { section: 'Academic',   items: [
      { to: '/students',  icon: 'bi-mortarboard',    label: 'Students'  },
      { to: '/teachers',  icon: 'bi-person-badge',   label: 'Teachers'  },
      { to: '/classes',   icon: 'bi-building',       label: 'Classes'   },
      { to: '/subjects',  icon: 'bi-book',           label: 'Subjects'  },
    ]},
    { section: 'Operations', items: [
      { to: '/attendance/mark',   icon: 'bi-calendar-check', label: 'Attendance' },
      { to: '/grades/entry',      icon: 'bi-bar-chart',      label: 'Grades'     },
      { to: '/fees',              icon: 'bi-credit-card',    label: 'Fees'       },
      { to: '/announcements',     icon: 'bi-megaphone',      label: 'Announcements' },
    ]},
  ],
  teacher: [
    { section: 'Main',     items: [{ to: '/dashboard/teacher', icon: 'bi-speedometer2', label: 'Dashboard' }] },
    { section: 'Academic', items: [
      { to: '/students',          icon: 'bi-mortarboard',    label: 'Students'   },
      { to: '/classes',           icon: 'bi-building',       label: 'Classes'    },
      { to: '/attendance/mark',   icon: 'bi-calendar-check', label: 'Attendance' },
      { to: '/grades/entry',      icon: 'bi-bar-chart',      label: 'Grades'     },
      { to: '/announcements',     icon: 'bi-megaphone',      label: 'Announcements' },
    ]},
  ],
  student: [
    { section: 'Main', items: [{ to: '/dashboard/student', icon: 'bi-speedometer2', label: 'Dashboard' }] },
    { section: 'My School', items: [
      { to: '/attendance/report', icon: 'bi-calendar-check', label: 'Attendance' },
      { to: '/grades/report',     icon: 'bi-bar-chart',      label: 'Grades'     },
      { to: '/fees',              icon: 'bi-credit-card',    label: 'Fees'       },
      { to: '/announcements',     icon: 'bi-megaphone',      label: 'Announcements' },
    ]},
  ],
};

// Map route path to page title
const PAGE_TITLES = {
  '/dashboard':           'Dashboard',
  '/dashboard/teacher':   'Dashboard',
  '/dashboard/student':   'Dashboard',
  '/students':            'Students',
  '/teachers':            'Teachers',
  '/classes':             'Classes',
  '/subjects':            'Subjects',
  '/attendance/mark':     'Mark Attendance',
  '/attendance/report':   'Attendance Report',
  '/grades/entry':        'Grade Entry',
  '/grades/report':       'Grade Report',
  '/fees':                'Fee Management',
  '/announcements':       'Announcements',
  '/profile':             'My Profile',
};

export default function AppLayout() {
  const { user, logout }    = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const navGroups = NAV_ITEMS[user?.role] || [];
  const pageTitle = PAGE_TITLES[location.pathname] || 'School Management';

  const initials = getInitials(user?.name || '');
  const bgColor  = avatarColor(user?.name || '');

  return (
    <>
      {/* ── Sidebar ── */}
      <aside className={`sms-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon"><i className="bi bi-mortarboard-fill" /></div>
          <div className="sidebar-brand-name">
            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>SchoolERP</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 400 }}>Management System</div>
          </div>
          <button
            className="sidebar-toggle ms-auto"
            onClick={() => setCollapsed((c) => !c)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: 'rgba(255,255,255,0.7)', borderRadius: 8,
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`} style={{ fontSize: '0.75rem' }} />
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.section}>
              <div className="sidebar-section-label">{group.section}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard' || item.to === '/dashboard/teacher' || item.to === '/dashboard/student'}
                  className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                  data-label={item.label}
                >
                  <i className={`bi ${item.icon}`} />
                  <span className="sidebar-nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer — profile shortcut */}
        <div className="sidebar-footer">
          <div
            className="sidebar-nav-link"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
            data-label="Profile"
          >
            <div
              className="avatar-initials"
              style={{ background: bgColor, width: 28, height: 28, fontSize: '0.65rem', borderRadius: 8 }}
            >
              {initials}
            </div>
            <div className="sidebar-nav-label" style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'show' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── Top Navbar ── */}
      <header className={`sms-navbar ${collapsed ? 'collapsed' : ''}`}>
        {/* Mobile hamburger */}
        <button
          className="d-md-none navbar-icon-btn me-2"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <i className="bi bi-list" style={{ fontSize: '1.2rem' }} />
        </button>

        <span className="navbar-page-title d-none d-md-block">{pageTitle}</span>

        <div className="d-flex align-items-center gap-2 ms-auto">
          {/* Dark mode toggle */}
          <button className="navbar-icon-btn" onClick={toggleTheme} title="Toggle theme">
            <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`} />
          </button>

          {/* Notifications */}
          <button className="navbar-icon-btn" title="Notifications">
            <i className="bi bi-bell" />
            <span className="notif-dot" />
          </button>

          {/* Avatar / logout */}
          <div className="dropdown">
            <button
              className="navbar-icon-btn"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: 'auto', padding: '0 6px', gap: 8, borderRadius: 10 }}
            >
              <div
                className="avatar-initials"
                style={{ background: bgColor, width: 28, height: 28, fontSize: '0.65rem', borderRadius: 8 }}
              >
                {initials}
              </div>
              <span className="d-none d-md-block" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.name?.split(' ')[0]}
              </span>
              <i className="bi bi-chevron-down d-none d-md-block" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', minWidth: 180 }}>
              <li>
                <button className="dropdown-item" style={{ fontSize: '0.85rem' }} onClick={() => navigate('/profile')}>
                  <i className="bi bi-person me-2" />My Profile
                </button>
              </li>
              <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border-color)' }} /></li>
              <li>
                <button className="dropdown-item text-danger" style={{ fontSize: '0.85rem' }} onClick={logout}>
                  <i className="bi bi-box-arrow-right me-2" />Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className={`sms-content ${collapsed ? 'collapsed' : ''}`}>
        <Outlet />
      </main>
    </>
  );
}
