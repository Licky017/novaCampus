/**
 * @file services/attendanceService.js
 * @description Business logic for marking/updating attendance, batch class
 * marking, percentage reports per student, class date-range reports, and a
 * dashboard summary of today's attendance.
 * @dependencies ../models/Attendance, ../models/Student
 */

const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

const listAttendance = async ({ page = 1, limit = 10, classId, date, studentId }) => {
  const query = {};
  if (classId) query.class = classId;
  if (studentId) query.student = studentId;
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  const total = await Attendance.countDocuments(query);
  const records = await Attendance.find(query)
    .populate('student', 'studentId rollNumber')
    .populate('class', 'name')
    .sort({ date: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return {
    records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

/**
 * Marks attendance for an entire class on a given date in one batch.
 * Upserts each student's record so re-submitting the same day updates it
 * instead of creating duplicates (the {student, date} index is unique).
 */
const markClassAttendance = async ({ classId, date, records, markedBy }) => {
  const ops = records.map(({ student, status, remarks }) => ({
    updateOne: {
      filter: { student, date: new Date(date) },
      update: { $set: { class: classId, status, remarks, markedBy } },
      upsert: true,
    },
  }));

  const result = await Attendance.bulkWrite(ops);
  return result;
};

const updateAttendance = async (id, payload) =>
  Attendance.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

const getStudentAttendanceReport = async (studentId) => {
  const records = await Attendance.find({ student: studentId });
  const total = records.length;
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const late = records.filter((r) => r.status === 'late').length;
  const excused = records.filter((r) => r.status === 'excused').length;
  const percentage = total > 0 ? Number(((present / total) * 100).toFixed(2)) : 0;

  return { totalDays: total, present, absent, late, excused, attendancePercentage: percentage };
};

const getClassAttendanceRange = async (classId, startDate, endDate) => {
  const query = { class: classId };
  if (startDate && endDate) {
    query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  return Attendance.find(query).populate('student', 'studentId rollNumber').sort({ date: -1 });
};

const getAttendanceSummary = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const totalStudents = await Student.countDocuments({ isDeleted: false });
  const todayRecords = await Attendance.find({ date: { $gte: today, $lt: tomorrow } });

  const present = todayRecords.filter((r) => r.status === 'present').length;
  const absent = todayRecords.filter((r) => r.status === 'absent').length;
  const late = todayRecords.filter((r) => r.status === 'late').length;
  const excused = todayRecords.filter((r) => r.status === 'excused').length;
  const notMarked = Math.max(totalStudents - todayRecords.length, 0);

  return { totalStudents, present, absent, late, excused, notMarked };
};

module.exports = {
  listAttendance,
  markClassAttendance,
  updateAttendance,
  getStudentAttendanceReport,
  getClassAttendanceRange,
  getAttendanceSummary,
};
