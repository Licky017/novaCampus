/**
 * @file services/subjectService.js
 * @description Business logic for direct Subject CRUD (independent of the
 * nested POST /api/classes/:id/subjects route handled in classService).
 * @dependencies ../models/Subject, ../models/Class
 */

const Subject = require('../models/Subject');
const Class = require('../models/Class');

const listSubjects = async ({ page = 1, limit = 10, search = '', classId }) => {
  const query = {};
  if (classId) query.class = classId;
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { code: { $regex: search, $options: 'i' } }];

  const total = await Subject.countDocuments(query);
  const subjects = await Subject.find(query)
    .populate('class', 'name grade section')
    .populate('teacher', 'teacherId')
    .sort({ name: 1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  return {
    subjects,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const createSubject = async (payload) => {
  const subject = await Subject.create(payload);
  if (payload.class) {
    await Class.findByIdAndUpdate(payload.class, { $addToSet: { subjects: subject._id } });
  }
  return subject;
};

const getSubjectById = async (id) =>
  Subject.findById(id).populate('class', 'name grade section').populate('teacher', 'teacherId');

const updateSubject = async (id, payload) =>
  Subject.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

const deleteSubject = async (id) => {
  const subject = await Subject.findByIdAndDelete(id);
  if (subject && subject.class) {
    await Class.findByIdAndUpdate(subject.class, { $pull: { subjects: subject._id } });
  }
  return subject;
};

module.exports = { listSubjects, createSubject, getSubjectById, updateSubject, deleteSubject };
