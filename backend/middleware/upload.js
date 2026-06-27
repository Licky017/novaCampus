/**
 * @file middleware/upload.js
 * @description Configures multer for multipart file uploads (avatars,
 * announcement attachments). Validates file type against ALLOWED_FILE_TYPES
 * and enforces MAX_FILE_SIZE, both read from environment variables.
 * @dependencies multer
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const allowedTypes = (
  process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,application/pdf'
).split(',');

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type "${file.mimetype}" is not allowed`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 5242880 },
});

module.exports = upload;
