import express from 'express';
import multer from 'multer';
import validator from 'validator';
import fs from 'fs';
import os from 'os';
import rateLimit from 'express-rate-limit';
import { sendExcelEmail, sendChartEmail } from '../services/emailService.js';

const router = express.Router();

// Rate limiter for email endpoints to prevent abuse
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

// For Excel uploads
const uploadExcel = multer({
  dest: os.tmpdir(), // Use system temp directory
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.originalname.endsWith('.xlsx')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx files are allowed!'));
    }
  }
});

// For PNG uploads
const uploadPNG = multer({
  dest: os.tmpdir(), // Use system temp directory
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.originalname.endsWith('.png')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .png files are allowed!'));
    }
  }
});

// Always sanitize and never trust user input, even when using validator.isEmail()

// If the feature is disabled, return 403 Forbidden
router.post('/send-excel', (req, res) => {
  return res.status(403).json({ error: 'This feature is currently disabled.' });
});

router.post('/send-chart', emailLimiter, uploadPNG.single('file'), async (req, res) => {
  const { email } = req.body;
  const filePath = req.file?.path;

  // Validate email
  if (!email || !validator.isEmail(email)) {
    if (filePath) fs.unlinkSync(filePath);
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  // Validate file
  if (!filePath) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  try {
    await sendChartEmail(email, filePath);
    res.json({ message: 'Chart image sent!' });
  } catch (err) {
    console.error('Send chart error:', err); // Log the error for debugging
    res.status(500).json({ error: 'Failed to send chart image.' });
  } finally {
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

export default router;