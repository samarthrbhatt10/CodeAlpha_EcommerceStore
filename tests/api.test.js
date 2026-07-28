const request = require('supertest');
const { app } = require('../server');

describe('API Endpoints', () => {
  it('GET /api/products - should return 200 and a list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /api/nonexistent - should return 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toEqual(404);
  });

  afterAll(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
  });
});
