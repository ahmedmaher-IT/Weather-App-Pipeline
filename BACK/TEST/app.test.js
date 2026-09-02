const request = require('supertest');
const app = require('../app');

describe('Backend Validation & Auth Tests', () => {
  it('should fail registration if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'invalid_user' }); // بدون password أو email
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should fail accessing weather without JWT token', async () => {
    const res = await request(app).get('/api/weather?city=Cairo');
    expect(res.statusCode).toEqual(401);
  });
});