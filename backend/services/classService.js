/**
 * @file services/classService.js
 * @description Business logic for class CRUD, student-count aggregation,
 * roster retrieval, and attaching subjects to a class.
 * @dependencies ../models/Class, ../models/Subject
 */

const Class = require('../models/Class');
const Subject = require('../models/Subject');

const listClasses = async ({ page = 1, limit = 10, search = '', grade }) => {
  const query = {};
  if (grade) query.grade = grade;
  if (search) query.name = { $regex: search, $options: 'i' };

  const total = await Class.countDocuments(query);
  const classes = await Class.find(query)
    .populate('classTeacher', 'teacherId')
    .populate('subjects', 'name code')
    .sort({ grade: 1, section: 1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const classesWithCounts = classes.map((cls) => ({
    ...cls.toObject(),
    studentCount: cls.students.length,
  }));

  return {
    classes: classesWithCounts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const createClass = async (payload) => Class.create(payload);

const getClassById = async (id) =>
  Class.findById(id)
    .populate('classTeacher', 'teacherId user')
    .populate('subjects', 'name code teacher')
    .populate('students', 'studentId rollNumber user');

const updateClass = async (id, payload) =>
  Class.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

const deleteClass = async (id) => Class.findByIdAndDelete(id);

const getClassStudents = async (id) => {
  const cls = await Class.findById(id).populate({
    path: 'students',
    populate: { path: 'user', select: 'name email phone avatar' },
  });
  return cls ? cls.students : null;
};

const addSubjectToClass = async (classId, subjectPayload) => {
  const subject = await Subject.create({ ...subjectPayload, class: classId });
  await Class.findByIdAndUpdate(classId, { $addToSet: { subjects: subject._id } });
  return subject;
};

module.exports = {
  listClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass,
  getClassStudents,
  addSubjectToClass,
};
