import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import emailRouter from './routes/email.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api', emailRouter);

// Only serve index.html for non-file requests (no dot in the path)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.includes('.') && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});