/**
 * @file utils/generateId.js
 * @description Generates sequential, human-readable unique identifiers such as
 * Student IDs (SMS-2024-0001), Teacher IDs (TCH-2024-0001), and Fee receipt
 * numbers. Uses a document count + timestamp suffix to minimise collisions.
 * @dependencies none
 */

const pad = (num, size = 4) => String(num).padStart(size, '0');

/**
 * Generates an ID in the form PREFIX-YEAR-0001
 * @param {import('mongoose').Model} Model - Mongoose model to count existing docs
 * @param {string} prefix - e.g. 'SMS' or 'TCH'
 */
const generateSequentialId = async (Model, prefix) => {
  const year = new Date().getFullYear();
  const count = await Model.countDocuments();
  return `${prefix}-${year}-${pad(count + 1)}`;
};

/**
 * Generates a unique fee receipt number in the form RCPT-00001-482913
 * @param {import('mongoose').Model} Model - The Fee model
 */
const generateReceiptNumber = async (Model) => {
  const count = await Model.countDocuments();
  const timestampSuffix = Date.now().toString().slice(-6);
  return `RCPT-${pad(count + 1, 5)}-${timestampSuffix}`;
};

module.exports = { generateSequentialId, generateReceiptNumber };
