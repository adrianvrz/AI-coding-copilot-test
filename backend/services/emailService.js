import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import fs from 'fs';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendExcelEmail(recipientEmail, excelPath) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Set in your environment
      pass: process.env.EMAIL_PASS  // Set in your environment
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: 'Your Bucks2Bar Excel Data',
    text: 'Attached is your Bucks2Bar Excel data.',
    attachments: [
      {
        filename: 'bucks2bar-data.xlsx',
        path: excelPath
      }
    ]
  });
}

export async function sendChartEmail(recipientEmail, imagePath) {
  // Read the PNG file as a base64 string
  const fileData = fs.readFileSync(imagePath).toString('base64');

  await resend.emails.send({
    from: process.env.EMAIL_USER, // e.g. 'onboarding@resend.dev'
    to: recipientEmail,
    subject: 'Your Bucks2Bar Chart Image',
    html: '<p>Attached is your Bucks2Bar chart as a PNG image.</p>',
    attachments: [
      {
        filename: 'chart.png',
        content: fileData,
        type: 'image/png',
      }
    ]
  });
}