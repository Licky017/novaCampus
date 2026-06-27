/**
 * @file services/studentService.js
 * @description Business logic for student CRUD, linked User-account creation,
 * search/filter/pagination, soft-delete, and related grade/attendance/fee
 * lookups. Controllers call into this layer rather than touching models directly.
 * @dependencies ../models/Student, ../models/User, ../models/Class, ../models/Grade,
 *               ../models/Attendance, ../models/Fee, ../utils/generateId
 */

const Student = require('../models/Student');
const User = require('../models/User');
const Class = require('../models/Class');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const { generateSequentialId } = require('../utils/generateId');

const listStudents = async ({ page = 1, limit = 10, search = '', classId, feeStatus }) => {
  const query = { isDeleted: false };
  if (classId) query.class = classId;
  if (feeStatus) query.feeStatus = feeStatus;

  if (search) {
    const matchingUsers = await User.find({ name: { $regex: search, $options: 'i' } }).select('_id');
    query.$or = [
      { user: { $in: matchingUsers.map((u) => u._id) } },
      { studentId: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Student.countDocuments(query);
  const students = await Student.find(query)
    .populate('class', 'name grade section')
    .populate('user', 'name email phone avatar isActive')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return {
    students,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const createStudent = async (payload) => {
  const { name, email, password, phone, address, avatar, ...studentFields } = payload;

  const user = await User.create({ name, email, password, phone, address, avatar, role: 'student' });
  const studentId = await generateSequentialId(Student, 'SMS');

  const student = await Student.create({ ...studentFields, user: user._id, studentId });

  await Class.findByIdAndUpdate(studentFields.class, { $addToSet: { students: student._id } });

  return Student.findById(student._id)
    .populate('class', 'name grade section')
    .populate('user', 'name email phone avatar');
};

const getStudentById = async (id) =>
  Student.findOne({ _id: id, isDeleted: false })
    .populate('class', 'name grade section')
    .populate('user', 'name email phone avatar isActive');

const updateStudent = async (id, payload) => {
  const { name, email, phone, address, avatar, ...studentFields } = payload;

  const student = await Student.findOne({ _id: id, isDeleted: false });
  if (!student) return null;

  if (name || email || phone || address || avatar) {
    await User.findByIdAndUpdate(student.user, {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(avatar && { avatar }),
    });
  }

  // If the class changed, keep both classes' roster arrays in sync
  if (studentFields.class && String(studentFields.class) !== String(student.class)) {
    await Class.findByIdAndUpdate(student.class, { $pull: { students: student._id } });
    await Class.findByIdAndUpdate(studentFields.class, { $addToSet: { students: student._id } });
  }

  Object.assign(student, studentFields);
  await student.save();

  return Student.findById(id)
    .populate('class', 'name grade section')
    .populate('user', 'name email phone avatar');
};

const softDeleteStudent = async (id) => {
  const student = await Student.findOne({ _id: id, isDeleted: false });
  if (!student) return null;

  student.isDeleted = true;
  await student.save();
  await User.findByIdAndUpdate(student.user, { isActive: false });
  await Class.findByIdAndUpdate(student.class, { $pull: { students: student._id } });

  return student;
};

const getStudentGrades = async (id) =>
  Grade.find({ student: id }).populate('subject', 'name code').sort({ createdAt: -1 });

const getStudentAttendance = async (id) => Attendance.find({ student: id }).sort({ date: -1 });

const getStudentFees = async (id) => Fee.find({ student: id }).sort({ dueDate: -1 });

module.exports = {
  listStudents,
  createStudent,
  getStudentById,
  updateStudent,
  softDeleteStudent,
  getStudentGrades,
  getStudentAttendance,
  getStudentFees,
};
