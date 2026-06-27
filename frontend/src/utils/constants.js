// frontend/src/utils/constants.js
// Purpose: App-wide enums, role constants, badge colour maps

export const ROLES = { SUPER_ADMIN: 'superadmin', TEACHER: 'teacher', STUDENT: 'student' };

export const FEE_TYPES     = ['tuition','transport','library','lab','exam','activity'];
export const FEE_STATUSES  = ['paid','pending','overdue'];
export const PAYMENT_METHODS = ['cash','online','cheque'];

export const EXAM_TYPES = ['quiz','midterm','final','assignment','project'];
export const TERMS      = ['term1','term2','term3'];

export const ATTENDANCE_STATUSES = ['present','absent','late','excused'];
export const ANNOUNCEMENT_PRIORITIES = ['low','normal','high','urgent'];
export const GENDERS = ['male','female','other'];

export const PAGE_SIZES        = [10, 25, 50];
export const DEFAULT_PAGE_SIZE = 10;

export const BADGE_COLORS = {
  paid: 'success', approved: 'success', present: 'success',
  pending: 'warning', late: 'warning',
  overdue: 'danger',  rejected: 'danger',  absent: 'danger',
  excused: 'primary',
  active: 'success',  inactive: 'muted',
};

export const PRIORITY_COLORS = {
  low: 'muted', normal: 'primary', high: 'warning', urgent: 'danger',
};
