// cleanUploads.js
// Script to delete files older than 1 day in the uploads directory

import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const ONE_DAY = 24 * 60 * 60 * 1000;

fs.readdir(UPLOADS_DIR, (err, files) => {
  if (err) {
    console.error('Error reading uploads directory:', err);
    process.exit(1);
  }
  const now = Date.now();
  files.forEach(file => {
    const filePath = path.join(UPLOADS_DIR, file);
    fs.stat(filePath, (err, stats) => {
      if (err) return;
      if (now - stats.mtimeMs > ONE_DAY) {
        fs.unlink(filePath, err => {
          if (err) console.error('Failed to delete', filePath);
        });
      }
    });
  });
});
