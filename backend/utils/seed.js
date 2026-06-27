/**
 * @file utils/seed.js
 * @description One-time seed script that creates the very first Super Admin
 * account directly in the database, bypassing the auth-protected
 * POST /api/auth/register route (which requires an existing superadmin
 * token — a chicken-and-egg problem on a brand new database).
 *
 * Run with: npm run seed
 *
 * Reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD from .env, falling back
 * to sensible defaults if unset. Safe to re-run — skips if that email
 * already exists.
 * @dependencies dotenv, mongoose, ../config/db, ../models/User
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const seedSuperAdmin = async () => {
  await connectDB();

  const name = process.env.ADMIN_NAME || 'Super Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@school.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`⚠️  A user with email "${email}" already exists — skipping seed.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const admin = await User.create({ name, email, password, role: 'superadmin' });

  console.log('✅ Super Admin created successfully:');
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: ${password}`);
  console.log('   ⚠️  Log in and change this password immediately.');

  await mongoose.disconnect();
  process.exit(0);
};

seedSuperAdmin().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
