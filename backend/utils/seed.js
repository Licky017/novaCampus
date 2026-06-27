/**
 * Seeds demo school data with Gambian names.
 *
 * Run:
 *   npm run seed
 *
 * Demo password for every seeded account:
 *   Password123!
 */

require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Subject = require('../models/Subject');

const PASSWORD = 'Password123!';
const YEAR = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

const firstNames = [
  'Binta', 'Awa', 'Fatou', 'Afo', 'Muhammed', 'Malick', 'Demba', 'Lamin',
  'Omar', 'Mariama', 'Isatou', 'Adama', 'Modou', 'Ebrima', 'Sainabou',
  'Kaddy', 'Musa', 'Alieu', 'Hawa', 'Yusupha', 'Ndey', 'Bakary',
];

const surnames = [
  'Jah', 'Kah', 'Jahateh', 'Jaiteh', 'Jallow', 'Bojang', 'Bittaye',
  'Ceesay', 'Sarr', 'Camara', 'Touray', 'Sanyang', 'Njie', 'Badjie',
  'Drammeh', 'Manneh', 'Bah', 'Darboe',
];

const departments = ['Mathematics', 'English', 'Science', 'Social Studies', 'Business', 'ICT'];
const subjectDefs = [
  ['Mathematics', 'MATH'],
  ['English Language', 'ENG'],
  ['Integrated Science', 'SCI'],
  ['Social and Environmental Studies', 'SES'],
  ['Information Technology', 'ICT'],
  ['Business Studies', 'BUS'],
];

const sample = (items, index) => items[index % items.length];
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
const phone = (index) => `+220 ${String(3000000 + index * 1379).slice(0, 7)}`;
const fullName = (index) => `${sample(firstNames, index)} ${sample(surnames, index * 3)}`;

async function upsertUser({ name, email, role, index }) {
  const update = {
    name,
    role,
    phone: phone(index),
    address: `${sample(['Kanifing', 'Brikama', 'Bakau', 'Serekunda', 'Farafenni'], index)}, The Gambia`,
    isActive: true,
  };

  const existing = await User.findOne({ email }).select('+password');
  if (existing) {
    Object.assign(existing, update);
    await existing.save();
    return existing;
  }

  return User.create({ ...update, email, password: PASSWORD });
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing from backend/.env');
  }

  await connectDB();

  const admin = await upsertUser({
    name: 'Nova Campus Admin',
    email: 'admin@novacampus.test',
    role: 'superadmin',
    index: 1,
  });

  const classes = [];
  for (let grade = 7; grade <= 9; grade += 1) {
    const klass = await Class.findOneAndUpdate(
      { name: `Grade ${grade}A`, academicYear: YEAR },
      {
        name: `Grade ${grade}A`,
        grade,
        section: 'A',
        academicYear: YEAR,
        capacity: 40,
        room: `Block ${grade - 6}`,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    classes.push(klass);
  }

  const teachers = [];
  for (let i = 0; i < 12; i += 1) {
    const name = fullName(i + 10);
    const user = await upsertUser({
      name,
      email: `${slug(name)}.teacher${i + 1}@novacampus.test`,
      role: 'teacher',
      index: i + 20,
    });

    const teacher = await Teacher.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        teacherId: `TCH-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        qualification: sample(['B.Ed', 'BSc Education', 'Higher Teachers Certificate', 'PGDE'], i),
        experience: 2 + (i % 14),
        salary: 18000 + i * 750,
        department: sample(departments, i),
        joiningDate: new Date(new Date().getFullYear() - (i % 5), i % 12, 1),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    teachers.push(teacher);
  }

  const subjects = [];
  for (let i = 0; i < subjectDefs.length; i += 1) {
    for (let c = 0; c < classes.length; c += 1) {
      const [name, prefix] = subjectDefs[i];
      const teacher = teachers[(i + c) % teachers.length];
      const klass = classes[c];
      const subject = await Subject.findOneAndUpdate(
        { code: `${prefix}${klass.grade}A` },
        {
          name,
          code: `${prefix}${klass.grade}A`,
          class: klass._id,
          teacher: teacher._id,
          description: `${name} for Grade ${klass.grade}A`,
          credits: 1,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      subjects.push(subject);
      await Class.findByIdAndUpdate(klass._id, { $addToSet: { subjects: subject._id } });
      await Teacher.findByIdAndUpdate(teacher._id, {
        $addToSet: { subjects: subject._id, classes: klass._id },
      });
    }
  }

  for (let i = 0; i < classes.length; i += 1) {
    await Class.findByIdAndUpdate(classes[i]._id, { classTeacher: teachers[i]._id });
  }

  const students = [];
  for (let i = 0; i < 45; i += 1) {
    const name = fullName(i + 40);
    const klass = classes[i % classes.length];
    const user = await upsertUser({
      name,
      email: `${slug(name)}.student${i + 1}@novacampus.test`,
      role: 'student',
      index: i + 60,
    });

    const student = await Student.findOneAndUpdate(
      { user: user._id },
      {
        user: user._id,
        studentId: `SMS-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        class: klass._id,
        rollNumber: Math.floor(i / classes.length) + 1,
        dateOfBirth: new Date(2008 + (i % 4), i % 12, 1 + (i % 26)),
        gender: i % 2 === 0 ? 'female' : 'male',
        guardianName: fullName(i + 90),
        guardianPhone: phone(i + 120),
        feeStatus: sample(['paid', 'pending', 'overdue'], i),
        admissionDate: new Date(new Date().getFullYear(), i % 8, 1),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    students.push(student);
    await Class.findByIdAndUpdate(klass._id, { $addToSet: { students: student._id } });
  }

  console.log('Seed complete.');
  console.log(`Superadmin: ${admin.email}`);
  console.log(`Password: ${PASSWORD}`);
  console.log(`Teachers: ${teachers.length}`);
  console.log(`Students: ${students.length}`);
  console.log(`Classes: ${classes.length}`);
  console.log(`Subjects: ${subjects.length}`);
}

seed()
  .catch((error) => {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
