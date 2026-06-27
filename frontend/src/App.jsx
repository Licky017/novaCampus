// frontend/src/App.jsx
// Purpose: Root component — context providers + all app routes
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider }  from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ProtectedRoute    from '@/components/ProtectedRoute';
import AppLayout         from '@/layouts/AppLayout';
import AuthLayout        from '@/layouts/AuthLayout';
import PageSpinner       from '@/components/ui/PageSpinner';

// ── Lazy page imports ──
const Home           = lazy(() => import('@/pages/Home'));
const Login          = lazy(() => import('@/pages/auth/Login'));
const Register       = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword  = lazy(() => import('@/pages/auth/ResetPassword'));
const Unauthorized   = lazy(() => import('@/pages/Unauthorized'));
const NotFound       = lazy(() => import('@/pages/NotFound'));

const SuperAdminDashboard = lazy(() => import('@/pages/dashboard/SuperAdminDashboard'));
const TeacherDashboard    = lazy(() => import('@/pages/dashboard/TeacherDashboard'));
const StudentDashboard    = lazy(() => import('@/pages/dashboard/StudentDashboard'));

const StudentList   = lazy(() => import('@/pages/students/StudentList'));
const StudentDetail = lazy(() => import('@/pages/students/StudentDetail'));

const TeacherList   = lazy(() => import('@/pages/teachers/TeacherList'));
const TeacherDetail = lazy(() => import('@/pages/teachers/TeacherDetail'));

const ClassList   = lazy(() => import('@/pages/classes/ClassList'));
const ClassDetail = lazy(() => import('@/pages/classes/ClassDetail'));
const SubjectList = lazy(() => import('@/pages/subjects/SubjectList'));

const AttendanceMarking = lazy(() => import('@/pages/attendance/AttendanceMarking'));
const AttendanceReport  = lazy(() => import('@/pages/attendance/AttendanceReport'));

const GradeEntry  = lazy(() => import('@/pages/grades/GradeEntry'));
const GradeReport = lazy(() => import('@/pages/grades/GradeReport'));

const FeeList   = lazy(() => import('@/pages/fees/FeeList'));
const FeeDetail = lazy(() => import('@/pages/fees/FeeDetail'));

const AnnouncementList = lazy(() => import('@/pages/announcements/AnnouncementList'));
const AnnouncementForm = lazy(() => import('@/pages/announcements/AnnouncementForm'));

const Profile = lazy(() => import('@/pages/Profile'));

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* ── Auth (public) ── */}
            <Route element={<AuthLayout />}>
              <Route path="/register"        element={<Register />} />
              <Route path="/login"           element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password"  element={<ResetPassword />} />
            </Route>

            {/* ── Static ── */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/404"          element={<NotFound />} />

            {/* ── Protected app shell ── */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboards */}
              <Route path="dashboard">
                <Route index element={
                  <ProtectedRoute roles={['superadmin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="teacher" element={
                  <ProtectedRoute roles={['teacher']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } />
                <Route path="student" element={
                  <ProtectedRoute roles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Students */}
              <Route path="students" element={<ProtectedRoute roles={['superadmin', 'teacher']} />}>
                <Route index     element={<StudentList />} />
                <Route path=":id" element={<StudentDetail />} />
              </Route>

              {/* Teachers */}
              <Route path="teachers" element={<ProtectedRoute roles={['superadmin']} />}>
                <Route index     element={<TeacherList />} />
                <Route path=":id" element={<TeacherDetail />} />
              </Route>

              {/* Classes */}
              <Route path="classes" element={<ProtectedRoute roles={['superadmin', 'teacher']} />}>
                <Route index     element={<ClassList />} />
                <Route path=":id" element={<ClassDetail />} />
              </Route>

              {/* Subjects */}
              <Route path="subjects" element={<ProtectedRoute roles={['superadmin', 'teacher']} />}>
                <Route index element={<SubjectList />} />
              </Route>

              {/* Attendance */}
              <Route path="attendance">
                <Route path="mark" element={
                  <ProtectedRoute roles={['superadmin', 'teacher']}>
                    <AttendanceMarking />
                  </ProtectedRoute>
                } />
                <Route path="report" element={
                  <ProtectedRoute roles={['superadmin', 'teacher', 'student']}>
                    <AttendanceReport />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Grades */}
              <Route path="grades">
                <Route path="entry" element={
                  <ProtectedRoute roles={['superadmin', 'teacher']}>
                    <GradeEntry />
                  </ProtectedRoute>
                } />
                <Route path="report" element={
                  <ProtectedRoute roles={['superadmin', 'teacher', 'student']}>
                    <GradeReport />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Fees */}
              <Route path="fees" element={<ProtectedRoute roles={['superadmin', 'student']} />}>
                <Route index     element={<FeeList />} />
                <Route path=":id" element={<FeeDetail />} />
              </Route>

              {/* Announcements */}
              <Route path="announcements">
                <Route index element={<AnnouncementList />} />
                <Route path="new" element={
                  <ProtectedRoute roles={['superadmin', 'teacher']}>
                    <AnnouncementForm />
                  </ProtectedRoute>
                } />
                <Route path=":id/edit" element={
                  <ProtectedRoute roles={['superadmin', 'teacher']}>
                    <AnnouncementForm />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Profile */}
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}
