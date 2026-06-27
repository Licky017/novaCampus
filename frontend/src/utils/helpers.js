// frontend/src/utils/helpers.js
// Purpose: Shared utility functions used across all components
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const formatDate = (date, pattern = 'dd MMM yyyy') => {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, pattern) : '—';
};

export const timeAgo = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '';
};

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
};

export const getInitials = (name = '') =>
  name.trim().split(' ').filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join('');

export const computeGrade = (marks, total = 100) => {
  const p = (marks / total) * 100;
  if (p >= 95) return 'A+';
  if (p >= 90) return 'A';
  if (p >= 85) return 'B+';
  if (p >= 80) return 'B';
  if (p >= 75) return 'C+';
  if (p >= 70) return 'C';
  if (p >= 60) return 'D';
  return 'F';
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
};

export const buildQueryString = (params = {}) => {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return qs ? `?${qs}` : '';
};

export const truncate = (text = '', max = 60) =>
  text.length <= max ? text : text.slice(0, max).trimEnd() + '…';

export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const avatarColor = (str = '') => {
  const colors = ['#2563EB','#7C3AED','#DB2777','#DC2626','#D97706','#059669','#0891B2','#4F46E5'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};
