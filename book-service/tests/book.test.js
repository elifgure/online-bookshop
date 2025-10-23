const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Book Service', () => {
  let bookId;

  it('Kitap ekleme başarılı olmalı', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({
        title: 'Test Book',
        author: 'Author',
        price: 20
      });
    expect(res.statusCode).toBe(201);
    bookId = res.body._id;
  });

  it('Kitap listesi döndürülmeli', async () => {
    const res = await request(app)
      .get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
