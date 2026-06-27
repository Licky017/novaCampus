/**
 * @file services/teacherService.js
 * @description Business logic for teacher CRUD, linked User-account creation,
 * search/filter/pagination, soft-delete, and class-assignment lookups.
 * @dependencies ../models/Teacher, ../models/User, ../models/Class, ../utils/generateId
 */

const Teacher = require('../models/Teacher');
const User = require('../models/User');
const Class = require('../models/Class');
const { generateSequentialId } = require('../utils/generateId');

const listTeachers = async ({ page = 1, limit = 10, search = '', department }) => {
  const query = { isDeleted: false };
  if (department) query.department = department;

  if (search) {
    const matchingUsers = await User.find({ name: { $regex: search, $options: 'i' } }).select('_id');
    query.$or = [
      { user: { $in: matchingUsers.map((u) => u._id) } },
      { teacherId: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Teacher.countDocuments(query);
  const teachers = await Teacher.find(query)
    .populate('user', 'name email phone avatar isActive')
    .populate('subjects', 'name code')
    .populate('classes', 'name grade section')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return {
    teachers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const createTeacher = async (payload) => {
  const { name, email, password, phone, address, avatar, ...teacherFields } = payload;

  const user = await User.create({ name, email, password, phone, address, avatar, role: 'teacher' });
  const teacherId = await generateSequentialId(Teacher, 'TCH');

  const teacher = await Teacher.create({ ...teacherFields, user: user._id, teacherId });

  if (teacherFields.classes && teacherFields.classes.length) {
    await Class.updateMany(
      { _id: { $in: teacherFields.classes } },
      { $set: { classTeacher: teacher._id } }
    );
  }

  return Teacher.findById(teacher._id)
    .populate('user', 'name email phone avatar')
    .populate('subjects', 'name code')
    .populate('classes', 'name grade section');
};

const getTeacherById = async (id) =>
  Teacher.findOne({ _id: id, isDeleted: false })
    .populate('user', 'name email phone avatar isActive')
    .populate('subjects', 'name code')
    .populate('classes', 'name grade section');

const updateTeacher = async (id, payload) => {
  const { name, email, phone, address, avatar, ...teacherFields } = payload;

  const teacher = await Teacher.findOne({ _id: id, isDeleted: false });
  if (!teacher) return null;

  if (name || email || phone || address || avatar) {
    await User.findByIdAndUpdate(teacher.user, {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(avatar && { avatar }),
    });
  }

  Object.assign(teacher, teacherFields);
  await teacher.save();

  return Teacher.findById(id)
    .populate('user', 'name email phone avatar')
    .populate('subjects', 'name code')
    .populate('classes', 'name grade section');
};

const softDeleteTeacher = async (id) => {
  const teacher = await Teacher.findOne({ _id: id, isDeleted: false });
  if (!teacher) return null;

  teacher.isDeleted = true;
  await teacher.save();
  await User.findByIdAndUpdate(teacher.user, { isActive: false });

  return teacher;
};

const getTeacherClasses = async (id) =>
  Class.find({ classTeacher: id }).populate('students', 'studentId rollNumber');

module.exports = {
  listTeachers,
  createTeacher,
  getTeacherById,
  updateTeacher,
  softDeleteTeacher,
  getTeacherClasses,
};
