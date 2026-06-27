/**
 * @file utils/sendEmail.js
 * @description Nodemailer transport wrapper used for forgot-password reset
 * links and other transactional notification emails.
 * @dependencies nodemailer
 */

const nodemailer = require('nodemailer');

/**
 * Sends an HTML email.
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"School Management System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
