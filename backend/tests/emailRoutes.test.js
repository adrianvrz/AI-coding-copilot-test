// backend/tests/emailRoutes.test.js
import request from 'supertest';
import express from 'express';
import emailRouter from '../routes/email.js';
import * as emailService from '../services/emailService.js';

jest.mock('../services/emailService.js', () => ({
  sendExcelEmail: jest.fn().mockResolvedValue(),
  sendChartEmail: jest.fn().mockResolvedValue(),
}));

const app = express();
app.use(express.json());
app.use('/api', emailRouter);

describe('Email Routes', () => {
  describe('POST /api/send-excel', () => {
    it('should return 403 Forbidden when feature is disabled', async () => {
      const res = await request(app)
        .post('/api/send-excel')
        .send({ email: 'test@example.com' });
      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe('This feature is currently disabled.');
    });
  });

  describe('POST /api/send-chart', () => {
    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/send-chart')
        .field('email', 'not-an-email');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid email address.');
    });
  });
});
