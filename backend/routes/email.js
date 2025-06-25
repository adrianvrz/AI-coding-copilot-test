import express from 'express';
import multer from 'multer';
import validator from 'validator';
import fs from 'fs';
import { sendExcelEmail, sendChartEmail } from '../services/emailService.js';

const router = express.Router();

// For Excel uploads
const uploadExcel = multer({
  dest: 'uploads/',
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
  dest: 'uploads/',
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

router.post('/send-excel', uploadExcel.single('file'), async (req, res) => {
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
    await sendExcelEmail(email, filePath);
    res.json({ message: 'Email sent!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email.' });
  } finally {
    // Always remove the uploaded file
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
});

router.post('/send-chart', uploadPNG.single('file'), async (req, res) => {
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