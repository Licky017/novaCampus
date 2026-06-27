/**
 * @file services/gradeService.js
 * @description Business logic for grade entry/CRUD, a full student
 * transcript report, and a class-level performance report (subject averages).
 * @dependencies ../models/Grade
 */

const Grade = require('../models/Grade');

const listGrades = async ({ page = 1, limit = 10, studentId, subjectId, term }) => {
  const query = {};
  if (studentId) query.student = studentId;
  if (subjectId) query.subject = subjectId;
  if (term) query.term = term;

  const total = await Grade.countDocuments(query);
  const grades = await Grade.find(query)
    .populate('student', 'studentId rollNumber')
    .populate('subject', 'name code')
    .populate('class', 'name')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return {
    grades,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const createGrade = async (payload) => {
  const grade = await Grade.create(payload);
  return Grade.findById(grade._id).populate('student', 'studentId rollNumber').populate('subject', 'name code');
};

const updateGrade = async (id, payload) => {
  const grade = await Grade.findById(id);
  if (!grade) return null;
  Object.assign(grade, payload);
  await grade.save(); // re-runs pre-save hook so letter grade stays in sync
  return grade;
};

const deleteGrade = async (id) => Grade.findByIdAndDelete(id);

const getStudentTranscript = async (studentId) => {
  const grades = await Grade.find({ student: studentId })
    .populate('subject', 'name code credits')
    .sort({ academicYear: 1, term: 1 });

  const bySubject = {};
  grades.forEach((g) => {
    const key = g.subject?.code || 'UNKNOWN';
    if (!bySubject[key]) bySubject[key] = { subject: g.subject, entries: [] };
    bySubject[key].entries.push(g);
  });

  const overallAverage =
    grades.length > 0
      ? Number((grades.reduce((sum, g) => sum + (g.marksObtained / g.totalMarks) * 100, 0) / grades.length).toFixed(2))
      : 0;

  return { grades, bySubject, overallAverage };
};

const getClassPerformanceReport = async (classId) => {
  const grades = await Grade.find({ class: classId }).populate('subject', 'name code');

  const bySubject = {};
  grades.forEach((g) => {
    const key = g.subject?.code || 'UNKNOWN';
    if (!bySubject[key]) bySubject[key] = { subject: g.subject, totalPercent: 0, count: 0 };
    bySubject[key].totalPercent += (g.marksObtained / g.totalMarks) * 100;
    bySubject[key].count += 1;
  });

  const report = Object.values(bySubject).map((entry) => ({
    subject: entry.subject,
    averagePercentage: Number((entry.totalPercent / entry.count).toFixed(2)),
    studentsGraded: entry.count,
  }));

  return report;
};

module.exports = {
  listGrades,
  createGrade,
  updateGrade,
  deleteGrade,
  getStudentTranscript,
  getClassPerformanceReport,
};
