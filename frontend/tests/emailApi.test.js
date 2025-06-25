// frontend/tests/emailApi.test.js
// Example test for frontend API call to /api/send-excel and /api/send-chart
// This is a mock test, assuming you use Jest and fetch-mock or similar

import fetchMock from 'jest-fetch-mock';

beforeAll(() => {
  fetchMock.enableMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('Frontend Email API', () => {
  it('should handle 403 from /api/send-excel', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'This feature is currently disabled.' }), { status: 403 });
    const res = await fetch('/api/send-excel', { method: 'POST' });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe('This feature is currently disabled.');
  });

  it('should handle 400 from /api/send-chart for invalid email', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'Invalid email address.' }), { status: 400 });
    const res = await fetch('/api/send-chart', { method: 'POST', body: JSON.stringify({ email: 'bad' }) });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid email address.');
  });
});
