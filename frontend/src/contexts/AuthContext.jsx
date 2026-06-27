// frontend/src/contexts/AuthContext.jsx
// Purpose: Global auth state — login, logout, register, current user
// Dependencies: axios api instance, react-router-dom
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('sms_user')) || null; }
    catch { return null; }
  });
  const [token,   setToken]   = useState(() => localStorage.getItem('sms_token') || null);
  const [loading, setLoading] = useState(true); // resolving initial auth state

  // ── Persist helpers ──
  const persist = (userData, tokenStr) => {
    localStorage.setItem('sms_user',  JSON.stringify(userData));
    localStorage.setItem('sms_token', tokenStr);
    setUser(userData);
    setToken(tokenStr);
  };

  const clear = () => {
    localStorage.removeItem('sms_user');
    localStorage.removeItem('sms_token');
    setUser(null);
    setToken(null);
  };

  // ── Verify token on mount ──
  useEffect(() => {
    const verify = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.data);
        localStorage.setItem('sms_user', JSON.stringify(data.data));
      } catch {
        clear();
      } finally {
        setLoading(false);
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login ──
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.data.user, data.data.accessToken);

    // Role-based redirect
    const role = data.data.user.role;
    if (role === 'superadmin') navigate('/dashboard');
    else if (role === 'teacher') navigate('/dashboard/teacher');
    else navigate('/dashboard/student');

    return data.data.user;
  }, [navigate]);

  // ── Logout ──
  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    clear();
    navigate('/login');
  }, [navigate]);

  // ── Register (admin creates accounts) ──
  const register = useCallback(async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  }, []);

  // ── Update profile in context ──
  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('sms_user', JSON.stringify(updated));
  }, [user]);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user, token, loading, isAuthenticated,
      login, logout, register, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
