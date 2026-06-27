/**
 * @file utils/calculateGrade.js
 * @description Computes a letter grade (A+ / A / B+ / B / C / D / F) from
 * marks obtained against total marks. Used by the Grade model's pre-save hook.
 * @dependencies none
 */

const calculateGrade = (marksObtained, totalMarks = 100) => {
  const percentage = (marksObtained / totalMarks) * 100;

  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

module.exports = calculateGrade;
