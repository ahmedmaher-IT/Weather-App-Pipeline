const request = require('supertest');
const app = require('../app');

describe('Auth & Health Endpoints', () => {
  it('should return 401 for protected weather endpoint without token', async () => {
    const res = await request(app).get('/api/weather');
    expect(res.statusCode).toEqual(401);
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        city: 'Cairo'
      });
    expect(res.statusCode).toEqual(201);
  });
});